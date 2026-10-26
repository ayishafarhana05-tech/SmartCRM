import { BaseEntity } from './BaseEntity.js';

/**
 * SupportTicket Class
 * Manages technical assistance and customer service tickets assigned to staff.
 */
export class SupportTicket extends BaseEntity {
  constructor({
    id,
    customerId,
    assignedEmployeeId = '',
    subject = '',
    description = '',
    category = 'Technical', // 'Account Access', 'Bug Report', 'Feature Request', 'Technical', 'General Inquiry'
    priority = 'Medium', // 'Low', 'Medium', 'High', 'Urgent'
    status = 'Open', // 'Open', 'In Progress', 'Closed'
    date = new Date().toISOString().split('T')[0],
    resolution = '',
    createdAt = new Date().toISOString()
  } = {}) {
    super(id || `TCK-${Math.floor(1000 + Math.random() * 9000)}`, createdAt);
    this.customerId = customerId || '';
    this.assignedEmployeeId = assignedEmployeeId;
    this.subject = subject;
    this.description = description;
    this.category = category;
    this.priority = priority;
    this.status = status;
    this.date = date;
    this.resolution = resolution;
  }

  getCustomer(customers = []) {
    return customers.find(c => c.id === this.customerId) || null;
  }

  getAssignedEmployee(employees = []) {
    return employees.find(e => e.id === this.assignedEmployeeId) || null;
  }

  assignTo(employeeId) {
    this.assignedEmployeeId = employeeId;
    this.touch();
  }

  close(resolution = '') {
    this.status = 'Closed';
    this.resolution = resolution;
    this.touch();
  }

  isOpen() {
    return this.status !== 'Closed';
  }

  getSummary() {
    return `SupportTicket ${this.id}: ${this.subject} [${this.priority}] -> ${this.status}`;
  }

  validate() {
    const errors = [];
    if (!this.customerId) errors.push('Customer is required.');
    if (!this.subject || this.subject.trim().length < 3) errors.push('Ticket subject is required.');
    if (!this.description || this.description.trim().length < 5) errors.push('Issue description is required.');
    if (!this.priority) errors.push('Priority is required.');
    if (!this.status) errors.push('Status is required.');
    return {
      isValid: errors.length === 0,
      errors
    };
  }

  static fromJSON(json) {
    return new SupportTicket(json);
  }
}
