import fs from 'fs';
import path from 'path';

const OWNER = 'ayishafarhana05-tech';
const REPO = 'SmartCRM';
const TOKEN = process.argv[2];
const BRANCH = 'main';
const ROOT_DIR = 'c:/Users/MYCARE/Desktop/crm';

if (!TOKEN) {
  console.error('Please pass token as argument');
  process.exit(1);
}

const headers = {
  'Authorization': `token ${TOKEN}`,
  'User-Agent': 'SmartCRM-Uploader',
  'Accept': 'application/vnd.github.v3+json',
  'Content-Type': 'application/json'
};

async function api(endpoint, method = 'GET', body = null) {
  const url = `https://api.github.com/repos/${OWNER}/${REPO}${endpoint}`;
  const options = { method, headers };
  if (body) options.body = JSON.stringify(body);
  const res = await fetch(url, options);
  const data = await res.json();
  if (!res.ok) {
    throw new Error(`GitHub API Error [${res.status}] ${endpoint}: ${JSON.stringify(data)}`);
  }
  return data;
}

async function getProjectFiles(dir, prefix = '') {
  const entries = await fs.promises.readdir(dir, { withFileTypes: true });
  let files = [];
  for (const entry of entries) {
    if (['node_modules', '.git', 'dist', '.runtime', 'out'].includes(entry.name)) continue;
    if (entry.name === 'upload-to-github-api.js') continue;
    if (entry.name.endsWith('.jar') || entry.name.endsWith('.db') || entry.name.endsWith('.zip') || entry.name.endsWith('.lnk')) continue;
    const full = path.join(dir, entry.name);
    const rel = prefix ? `${prefix}/${entry.name}` : entry.name;
    if (entry.isDirectory()) {
      files = files.concat(await getProjectFiles(full, rel));
    } else {
      files.push(rel);
    }
  }
  return files;
}

async function upload() {
  console.log(`Starting upload to https://github.com/${OWNER}/${REPO}...`);

  const files = await getProjectFiles(ROOT_DIR);
  console.log(`Found ${files.length} project files to upload.`);

  const treeItems = [];

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const fullPath = path.join(ROOT_DIR, file);
    const content = await fs.promises.readFile(fullPath);
    const base64 = content.toString('base64');

    const blob = await api('/git/blobs', 'POST', {
      content: base64,
      encoding: 'base64'
    });

    treeItems.push({
      path: file.replace(/\\/g, '/'),
      mode: '100644',
      type: 'blob',
      sha: blob.sha
    });

    if ((i + 1) % 10 === 0 || i === files.length - 1) {
      console.log(`Uploaded blobs: ${i + 1}/${files.length}`);
    }
  }

  console.log('Creating Git Tree with all files...');
  const tree = await api('/git/trees', 'POST', {
    tree: treeItems
  });
  console.log('Tree created:', tree.sha);

  console.log('Creating Git Commit...');
  const commit = await api('/git/commits', 'POST', {
    message: 'Initial commit: Complete SmartCRM system ready for Vercel deployment',
    tree: tree.sha
  });
  console.log('Commit created:', commit.sha);

  console.log(`Updating ${BRANCH} branch reference...`);
  try {
    await api(`/git/refs/heads/${BRANCH}`, 'PATCH', {
      sha: commit.sha,
      force: true
    });
  } catch (e) {
    console.log(`Ref not found, creating refs/heads/${BRANCH}...`);
    await api('/git/refs', 'POST', {
      ref: `refs/heads/${BRANCH}`,
      sha: commit.sha
    });
  }

  console.log('\n========================================');
  console.log('🎉 SUCCESS! All files pushed to GitHub!');
  console.log(`Repository: https://github.com/${OWNER}/${REPO}`);
  console.log('========================================');
}

upload().catch(err => {
  console.error('\n❌ Upload failed:', err.message);
  process.exit(1);
});
