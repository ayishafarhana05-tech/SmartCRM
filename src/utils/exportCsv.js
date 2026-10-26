/**
 * Export table data to CSV file and trigger browser download
 */
export function exportToCSV(filename, rows, headers) {
  if (!rows || !rows.length) {
    alert("No records available to export.");
    return;
  }

  const columnKeys = headers ? Object.keys(headers) : Object.keys(rows[0]);
  const columnLabels = headers ? Object.values(headers) : columnKeys;

  // Header row
  const csvRows = [
    columnLabels.map(label => `"${String(label).replace(/"/g, '""')}"`).join(',')
  ];

  // Data rows
  rows.forEach(row => {
    const values = columnKeys.map(key => {
      const val = row[key] !== undefined && row[key] !== null ? row[key] : '';
      return `"${String(val).replace(/"/g, '""')}"`;
    });
    csvRows.push(values.join(','));
  });

  const csvContent = "data:text/csv;charset=utf-8," + encodeURIComponent(csvRows.join('\r\n'));
  const link = document.createElement("a");
  link.setAttribute("href", csvContent);
  link.setAttribute("download", `${filename}_${new Date().toISOString().split('T')[0]}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
