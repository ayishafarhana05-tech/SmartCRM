/**
 * LocalStorage Service with versioning and fail-safe fallback
 */

const STORAGE_KEYS = {
  CUSTOMERS: 'smartcrm_customers',
  EMPLOYEES: 'smartcrm_employees',
  PRODUCTS: 'smartcrm_products',
  SALES: 'smartcrm_sales',
  INTERACTIONS: 'smartcrm_interactions',
  COMPLAINTS: 'smartcrm_complaints',
  TICKETS: 'smartcrm_tickets',
  AUTH_USER: 'smartcrm_auth_user',
  VERSION: 'smartcrm_version'
};

const CURRENT_VERSION = '1.0.0';

export function loadFromStorage(key, fallbackValue) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallbackValue;
    return JSON.parse(raw);
  } catch (err) {
    console.warn(`Failed reading ${key} from localStorage, using fallback:`, err);
    return fallbackValue;
  }
}

export function saveToStorage(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.error(`Failed writing ${key} to localStorage:`, err);
  }
}

export function clearAllStorage() {
  Object.values(STORAGE_KEYS).forEach(k => {
    localStorage.removeItem(k);
  });
}

export { STORAGE_KEYS, CURRENT_VERSION };
