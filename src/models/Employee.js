import { BaseEntity } from './BaseEntity.js';

/**
 * Employee Class
 * Represents staff members who handle sales, support tickets, and customer interactions.
 */
export class Employee extends BaseEntity {
  constructor({
    id,
    name,
    email,
    phone,
    department = 'Sales', // 'Sales', 'Customer Support', 'Technical', 'Marketing', 'Operations'
    designation = 'Representative',
    status = 'Active', // 'Active', 'On Leave', 'Inactive'
    hireDate = new Date().toISOString().split('T')[0],
    createdAt = new Date().toISOString()
  } = {}) {
    super(id || `EMP-${Math.floor(100 + Math.random() * 900)}`, createdAt);
    this.name = name || '';
    this.email = email || '';
    this.phone = phone || '';
    this.department = department;
    this.designation = designation;
    this.status = status;
    this.hireDate = hireDate;
  }

  getInitials() {
    if (!this.name) return 'EM';
    const parts = this.name.trim().split(' ');
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }

  getAssignedInteractions(interactions = []) {
    return interactions.filter(i => i.employeeId === this.id);
  }

  getAssignedTickets(tickets = []) {
    return tickets.filter(t => t.assignedEmployeeId === this.id);
  }

  getSalesConducted(sales = []) {
    return sales.filter(s => s.employeeId === this.id);
  }

  calculateSalesVolume(sales = []) {
    return this.getSalesConducted(sales)
      .reduce((sum, s) => sum + (Number(s.totalAmount) || 0), 0);
  }

  getSummary() {
    return `Employee: ${this.name} [${this.designation}, ${this.department}]`;
  }

  validate() {
    const errors = [];
    if (!this.name || this.name.trim().length < 2) errors.push('Employee name is required.');
    if (!this.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.email)) errors.push('A valid email address is required.');
    if (!this.phone || this.phone.trim().length < 7) errors.push('A valid phone number is required.');
    if (!this.department) errors.push('Department is required.');
    if (!this.designation) errors.push('Designation is required.');
    return {
      isValid: errors.length === 0,
      errors
    };
  }

  static fromJSON(json) {
    return new Employee(json);
  }
}
