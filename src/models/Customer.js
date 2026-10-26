import { BaseEntity } from './BaseEntity.js';

/**
 * Customer Class
 * Demonstrates Encapsulation, Validation, and Association methods.
 */
export class Customer extends BaseEntity {
  constructor({
    id,
    name,
    email,
    phone,
    company = '',
    address = '',
    city = '',
    status = 'Active', // 'Active', 'Lead', 'Inactive'
    createdAt = new Date().toISOString()
  } = {}) {
    super(id || `CUST-${Math.floor(1000 + Math.random() * 9000)}`, createdAt);
    this.name = name || '';
    this.email = email || '';
    this.phone = phone || '';
    this.company = company;
    this.address = address;
    this.city = city;
    this.status = status;
  }

  getInitials() {
    if (!this.name) return 'CU';
    const parts = this.name.trim().split(' ');
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }

  // Association / Relational Helper Methods
  getInteractions(interactions = []) {
    return interactions.filter(i => i.customerId === this.id);
  }

  getSales(sales = []) {
    return sales.filter(s => s.customerId === this.id);
  }

  getComplaints(complaints = []) {
    return complaints.filter(c => c.customerId === this.id);
  }

  getTickets(tickets = []) {
    return tickets.filter(t => t.customerId === this.id);
  }

  calculateTotalSpent(sales = []) {
    return this.getSales(sales)
      .reduce((sum, s) => sum + (Number(s.totalAmount) || 0), 0);
  }

  getSummary() {
    return `Customer: ${this.name} (${this.email}) - Status: ${this.status}`;
  }

  validate() {
    const errors = [];
    if (!this.name || this.name.trim().length < 2) errors.push('Customer name is required (min 2 chars).');
    if (!this.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.email)) errors.push('A valid email address is required.');
    if (!this.phone || this.phone.trim().length < 7) errors.push('A valid phone number is required.');
    return {
      isValid: errors.length === 0,
      errors
    };
  }

  static fromJSON(json) {
    return new Customer(json);
  }
}
