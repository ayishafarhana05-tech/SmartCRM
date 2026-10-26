import { BaseEntity } from './BaseEntity.js';

/**
 * Complaint Class
 * Tracks customer grievances, priority levels, escalation, and resolution.
 */
export class Complaint extends BaseEntity {
  constructor({
    id,
    customerId,
    title = '',
    description = '',
    category = 'Service Quality', // 'Billing', 'Technical', 'Service Quality', 'Delivery', 'Product Defect'
    date = new Date().toISOString().split('T')[0],
    priority = 'Medium', // 'Low', 'Medium', 'High', 'Urgent'
    status = 'Pending', // 'Pending', 'In Progress', 'Resolved'
    resolutionNotes = '',
    resolvedDate = '',
    createdAt = new Date().toISOString()
  } = {}) {
    super(id || `CMP-${Math.floor(1000 + Math.random() * 9000)}`, createdAt);
    this.customerId = customerId || '';
    this.title = title;
    this.description = description;
    this.category = category;
    this.date = date;
    this.priority = priority;
    this.status = status;
    this.resolutionNotes = resolutionNotes;
    this.resolvedDate = resolvedDate;
  }

  getCustomer(customers = []) {
    return customers.find(c => c.id === this.customerId) || null;
  }

  isUnresolved() {
    return this.status !== 'Resolved';
  }

  resolve(resolutionNotes = '') {
    this.status = 'Resolved';
    this.resolutionNotes = resolutionNotes;
    this.resolvedDate = new Date().toISOString().split('T')[0];
    this.touch();
  }

  updateStatus(newStatus) {
    this.status = newStatus;
    if (newStatus === 'Resolved' && !this.resolvedDate) {
      this.resolvedDate = new Date().toISOString().split('T')[0];
    }
    this.touch();
  }

  getSummary() {
    return `Complaint ${this.id}: ${this.title} [Priority: ${this.priority}, Status: ${this.status}]`;
  }

  validate() {
    const errors = [];
    if (!this.customerId) errors.push('Customer is required.');
    if (!this.title || this.title.trim().length < 3) errors.push('Complaint title is required.');
    if (!this.description || this.description.trim().length < 5) errors.push('Detailed description is required.');
    if (!this.priority) errors.push('Priority must be specified.');
    if (!this.status) errors.push('Status must be specified.');
    return {
      isValid: errors.length === 0,
      errors
    };
  }

  static fromJSON(json) {
    return new Complaint(json);
  }
}
