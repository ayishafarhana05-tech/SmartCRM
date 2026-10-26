import { BaseEntity } from './BaseEntity.js';

/**
 * Interaction Class
 * Records touches with customers: Calls, Meetings, Emails, Demos, Notes.
 */
export class Interaction extends BaseEntity {
  constructor({
    id,
    customerId,
    employeeId,
    type = 'Call', // 'Call', 'Email', 'Meeting', 'Demo', 'Note'
    date = new Date().toISOString().slice(0, 16), // YYYY-MM-DDTHH:MM
    notes = '',
    outcome = 'Follow-up Required', // 'Deal Closed', 'Follow-up Required', 'Issue Resolved', 'Information Provided', 'No Answer'
    followUpDate = '',
    createdAt = new Date().toISOString()
  } = {}) {
    super(id || `INT-${Math.floor(1000 + Math.random() * 9000)}`, createdAt);
    this.customerId = customerId || '';
    this.employeeId = employeeId || '';
    this.type = type;
    this.date = date;
    this.notes = notes;
    this.outcome = outcome;
    this.followUpDate = followUpDate;
  }

  getCustomer(customers = []) {
    return customers.find(c => c.id === this.customerId) || null;
  }

  getEmployee(employees = []) {
    return employees.find(e => e.id === this.employeeId) || null;
  }

  isFollowUpDue() {
    if (!this.followUpDate) return false;
    const due = new Date(this.followUpDate);
    const today = new Date();
    return due <= today;
  }

  getSummary() {
    return `Interaction [${this.type}] on ${this.date} - Outcome: ${this.outcome}`;
  }

  validate() {
    const errors = [];
    if (!this.customerId) errors.push('Customer is required.');
    if (!this.employeeId) errors.push('Employee is required.');
    if (!this.type) errors.push('Interaction type is required.');
    if (!this.notes || this.notes.trim().length < 5) errors.push('Interaction notes must be at least 5 characters.');
    return {
      isValid: errors.length === 0,
      errors
    };
  }

  static fromJSON(json) {
    return new Interaction(json);
  }
}
