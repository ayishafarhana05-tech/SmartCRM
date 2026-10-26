import { BaseEntity } from './BaseEntity.js';

/**
 * Product Class
 * Manages inventory items, unit prices, availability, and stock tracking.
 */
export class Product extends BaseEntity {
  constructor({
    id,
    name,
    sku = '',
    category = 'Software', // 'Software', 'Cloud Services', 'Hardware', 'Consulting', 'Security'
    description = '',
    price = 0,
    stockQuantity = 0,
    createdAt = new Date().toISOString()
  } = {}) {
    super(id || `PROD-${Math.floor(100 + Math.random() * 900)}`, createdAt);
    this.name = name || '';
    this.sku = sku || `SKU-${Math.floor(1000 + Math.random() * 9000)}`;
    this.category = category;
    this.description = description;
    this.price = Number(price) || 0;
    this.stockQuantity = Number(stockQuantity) || 0;
  }

  isAvailable(requestedQty = 1) {
    return this.stockQuantity >= requestedQty;
  }

  getStockStatus() {
    if (this.stockQuantity <= 0) return 'Out of Stock';
    if (this.stockQuantity < 10) return 'Low Stock';
    return 'In Stock';
  }

  reduceStock(quantity) {
    const qty = Number(quantity);
    if (this.stockQuantity >= qty) {
      this.stockQuantity -= qty;
      this.touch();
      return true;
    }
    return false;
  }

  restock(quantity) {
    const qty = Number(quantity);
    if (qty > 0) {
      this.stockQuantity += qty;
      this.touch();
      return true;
    }
    return false;
  }

  getFormattedPrice() {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(this.price);
  }

  getSummary() {
    return `Product: ${this.name} (${this.sku}) - Price: ${this.price}, Stock: ${this.stockQuantity}`;
  }

  validate() {
    const errors = [];
    if (!this.name || this.name.trim().length < 2) errors.push('Product name is required.');
    if (isNaN(this.price) || Number(this.price) < 0) errors.push('Valid positive price is required.');
    if (isNaN(this.stockQuantity) || Number(this.stockQuantity) < 0) errors.push('Valid stock quantity is required.');
    if (!this.category) errors.push('Category is required.');
    return {
      isValid: errors.length === 0,
      errors
    };
  }

  static fromJSON(json) {
    return new Product(json);
  }
}
