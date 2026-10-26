import { BaseEntity } from './BaseEntity.js';

/**
 * Sales Class
 * Encapsulates sales transactions, connects Customer, Employee, Product,
 * and handles automated total calculation and financial summaries.
 */
export class Sales extends BaseEntity {
  constructor({
    id,
    customerId,
    employeeId,
    productId,
    date = new Date().toISOString().split('T')[0],
    quantity = 1,
    unitPrice = 0,
    discount = 0, // percentage discount 0-100
    totalAmount,
    paymentStatus = 'Paid', // 'Paid', 'Pending', 'Refunded'
    paymentMethod = 'Bank Transfer', // 'Credit Card', 'Bank Transfer', 'UPI', 'Net Banking'
    notes = '',
    createdAt = new Date().toISOString()
  } = {}) {
    super(id || `INV-${Math.floor(1000 + Math.random() * 9000)}`, createdAt);
    this.customerId = customerId || '';
    this.employeeId = employeeId || '';
    this.productId = productId || '';
    this.date = date;
    this.quantity = Number(quantity) || 1;
    this.unitPrice = Number(unitPrice) || 0;
    this.discount = Number(discount) || 0;
    this.totalAmount = totalAmount !== undefined ? Number(totalAmount) : this.calculateTotal();
    this.paymentStatus = paymentStatus;
    this.paymentMethod = paymentMethod;
    this.notes = notes;
  }

  calculateTotal() {
    const gross = this.quantity * this.unitPrice;
    const discountAmount = gross * (this.discount / 100);
    return Math.max(0, Math.round((gross - discountAmount) * 100) / 100);
  }

  recalculate() {
    this.totalAmount = this.calculateTotal();
    this.touch();
    return this.totalAmount;
  }

  getCustomer(customers = []) {
    return customers.find(c => c.id === this.customerId) || null;
  }

  getEmployee(employees = []) {
    return employees.find(e => e.id === this.employeeId) || null;
  }

  getProduct(products = []) {
    return products.find(p => p.id === this.productId) || null;
  }

  getFormattedAmount() {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(this.totalAmount);
  }

  getSummary() {
    return `Sale ${this.id}: ${this.quantity} units @ ${this.unitPrice} = ${this.totalAmount} (${this.paymentStatus})`;
  }

  validate() {
    const errors = [];
    if (!this.customerId) errors.push('Customer selection is required.');
    if (!this.employeeId) errors.push('Sales representative is required.');
    if (!this.productId) errors.push('Product selection is required.');
    if (!this.quantity || Number(this.quantity) <= 0) errors.push('Quantity must be at least 1.');
    if (isNaN(this.unitPrice) || Number(this.unitPrice) <= 0) errors.push('Unit price must be positive.');
    if (this.discount < 0 || this.discount > 100) errors.push('Discount must be between 0% and 100%.');
    return {
      isValid: errors.length === 0,
      errors
    };
  }

  static fromJSON(json) {
    return new Sales(json);
  }
}
