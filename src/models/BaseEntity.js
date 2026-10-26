/**
 * BaseEntity - Abstract Base Class for CRM Entities
 * KTU 3rd Sem CS OOP Project - 2024 Scheme
 * 
 * Demonstrates:
 * 1. Abstraction: Common attributes (id, createdAt, updatedAt) and validation blueprint
 * 2. Inheritance: Extended by Customer, Employee, Product, Sales, Complaint, SupportTicket
 * 3. Polymorphism: Subclasses override validate() and getSummary()
 */
export class BaseEntity {
  constructor(id, createdAt = new Date().toISOString()) {
    if (new.target === BaseEntity) {
      throw new TypeError("Cannot construct BaseEntity instances directly. It is an abstract class.");
    }
    this.id = id || this.generateId();
    this.createdAt = createdAt;
    this.updatedAt = new Date().toISOString();
  }

  generateId(prefix = 'ENT') {
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    return `${prefix}-${randomNum}`;
  }

  touch() {
    this.updatedAt = new Date().toISOString();
  }

  /**
   * Abstract method to be overridden by subclasses
   * @returns {{ isValid: boolean, errors: string[] }}
   */
  validate() {
    throw new Error("Method 'validate()' must be implemented by subclass.");
  }

  /**
   * Abstract method for polymorphic string summary
   */
  getSummary() {
    return `${this.constructor.name} [ID: ${this.id}]`;
  }

  toJSON() {
    return { ...this };
  }
}
