import React, { useState } from 'react';
import {
  Code2,
  Box,
  Layers,
  GitBranch,
  ShieldAlert,
  Sparkles,
  CheckCircle2,
  Cpu,
  BookOpen,
  ArrowRight
} from 'lucide-react';
import { Card, CardHeader, CardContent } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { useCRM } from '../context/CRMContext';

export function OopShowcase() {
  const { customers, employees, products, sales, interactions, complaints, tickets } = useCRM();
  const [selectedClass, setSelectedClass] = useState('Customer');

  const oopClasses = [
    {
      name: 'Customer',
      file: 'src/models/Customer.js',
      extends: 'BaseEntity',
      count: customers.length,
      sampleInstance: customers[0],
      description: 'Encapsulates client data, lifetime spending calculation, and relational queries for orders, interactions & complaints.',
      properties: ['id', 'name', 'email', 'phone', 'company', 'address', 'city', 'status', 'createdAt'],
      methods: [
        'getInitials(): string',
        'getInteractions(list): Interaction[]',
        'getSales(list): Sales[]',
        'getComplaints(list): Complaint[]',
        'getTickets(list): SupportTicket[]',
        'calculateTotalSpent(sales): number',
        'validate(): { isValid, errors }'
      ]
    },
    {
      name: 'Employee',
      file: 'src/models/Employee.js',
      extends: 'BaseEntity',
      count: employees.length,
      sampleInstance: employees[0],
      description: 'Represents staff members across Sales, Support, and Tech departments handling tickets and client touches.',
      properties: ['id', 'name', 'email', 'phone', 'department', 'designation', 'status', 'hireDate'],
      methods: [
        'getInitials(): string',
        'getAssignedInteractions(list): Interaction[]',
        'getAssignedTickets(list): SupportTicket[]',
        'getSalesConducted(sales): Sales[]',
        'calculateSalesVolume(sales): number',
        'validate(): { isValid, errors }'
      ]
    },
    {
      name: 'Product',
      file: 'src/models/Product.js',
      extends: 'BaseEntity',
      count: products.length,
      sampleInstance: products[0],
      description: 'Manages catalog items, price formatting, stock quantity mutation, and availability status.',
      properties: ['id', 'name', 'sku', 'category', 'description', 'price', 'stockQuantity'],
      methods: [
        'isAvailable(qty): boolean',
        'getStockStatus(): string',
        'reduceStock(qty): boolean',
        'restock(qty): boolean',
        'getFormattedPrice(): string',
        'validate(): { isValid, errors }'
      ]
    },
    {
      name: 'Sales',
      file: 'src/models/Sales.js',
      extends: 'BaseEntity',
      count: sales.length,
      sampleInstance: sales[0],
      description: 'Represents commercial transactions connecting Customer, Employee and Product with auto-calculated total and discount calculation.',
      properties: ['id', 'customerId', 'employeeId', 'productId', 'date', 'quantity', 'unitPrice', 'discount', 'totalAmount', 'paymentStatus'],
      methods: [
        'calculateTotal(): number',
        'recalculate(): number',
        'getCustomer(list): Customer',
        'getEmployee(list): Employee',
        'getProduct(list): Product',
        'validate(): { isValid, errors }'
      ]
    },
    {
      name: 'Interaction',
      file: 'src/models/Interaction.js',
      extends: 'BaseEntity',
      count: interactions.length,
      sampleInstance: interactions[0],
      description: 'Logs omni-channel customer touchpoints (Calls, Meetings, Emails, Demos) and computes follow-up reminders.',
      properties: ['id', 'customerId', 'employeeId', 'type', 'date', 'notes', 'outcome', 'followUpDate'],
      methods: [
        'getCustomer(list): Customer',
        'getEmployee(list): Employee',
        'isFollowUpDue(): boolean',
        'validate(): { isValid, errors }'
      ]
    },
    {
      name: 'Complaint',
      file: 'src/models/Complaint.js',
      extends: 'BaseEntity',
      count: complaints.length,
      sampleInstance: complaints[0],
      description: 'Encapsulates customer grievances, priority escalation, lifecycle state transitions, and resolution logging.',
      properties: ['id', 'customerId', 'title', 'description', 'category', 'date', 'priority', 'status', 'resolutionNotes'],
      methods: [
        'getCustomer(list): Customer',
        'isUnresolved(): boolean',
        'resolve(notes): void',
        'updateStatus(status): void',
        'validate(): { isValid, errors }'
      ]
    },
    {
      name: 'SupportTicket',
      file: 'src/models/SupportTicket.js',
      extends: 'BaseEntity',
      count: tickets.length,
      sampleInstance: tickets[0],
      description: 'Tracks technical and operational helpdesk tickets, engineer assignment, and ticket resolution workflow.',
      properties: ['id', 'customerId', 'assignedEmployeeId', 'subject', 'description', 'category', 'priority', 'status', 'resolution'],
      methods: [
        'getCustomer(list): Customer',
        'getAssignedEmployee(list): Employee',
        'assignTo(employeeId): void',
        'close(resolution): void',
        'isOpen(): boolean',
        'validate(): { isValid, errors }'
      ]
    }
  ];

  const currentObj = oopClasses.find(c => c.name === selectedClass) || oopClasses[0];

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950 to-purple-950 text-white shadow-xl">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-brand-500/20 border border-brand-400/30 text-brand-400">
            <Cpu className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold tracking-tight">KTU 2024 Scheme — OOP Architecture</h2>
              <span className="px-2 py-0.5 rounded bg-brand-500/30 text-brand-300 text-[11px] font-mono border border-brand-400/20">
                CS 3rd Semester
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-1 max-w-2xl">
              Clean implementation of the seven required CRM classes demonstrating Abstraction, Inheritance, Encapsulation, Polymorphism, and Relational Associations.
            </p>
          </div>
        </div>
      </div>

      {/* 4 Pillars of OOP in this System */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl border border-blue-200 bg-blue-50/50">
          <span className="text-xs font-bold text-blue-700 uppercase tracking-wider block">1. Abstraction</span>
          <p className="text-xs text-slate-600 mt-1 leading-relaxed">
            <code className="bg-white px-1 py-0.5 rounded border border-blue-200 text-blue-800 font-mono">BaseEntity</code> acts as an abstract class defining contracts: ID generation, timestamps, abstract <code className="font-mono">validate()</code> and <code className="font-mono">getSummary()</code>.
          </p>
        </div>

        <div className="p-4 rounded-xl border border-purple-200 bg-purple-50/50">
          <span className="text-xs font-bold text-purple-700 uppercase tracking-wider block">2. Inheritance</span>
          <p className="text-xs text-slate-600 mt-1 leading-relaxed">
            All 7 CRM classes (<code className="font-mono">Customer</code>, <code className="font-mono">Employee</code>, <code className="font-mono">Product</code>, etc.) inherit common properties and behaviors via <code className="font-mono">extends BaseEntity</code>.
          </p>
        </div>

        <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/50">
          <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider block">3. Encapsulation</span>
          <p className="text-xs text-slate-600 mt-1 leading-relaxed">
            Business logic is bundled inside class methods: <code className="font-mono">calculateTotal()</code>, <code className="font-mono">reduceStock()</code>, <code className="font-mono">calculateTotalSpent()</code>, and <code className="font-mono">resolve()</code>.
          </p>
        </div>

        <div className="p-4 rounded-xl border border-amber-200 bg-amber-50/50">
          <span className="text-xs font-bold text-amber-700 uppercase tracking-wider block">4. Polymorphism</span>
          <p className="text-xs text-slate-600 mt-1 leading-relaxed">
            Each entity overrides <code className="font-mono">validate()</code> with entity-specific validation criteria and overrides <code className="font-mono">getSummary()</code> for polymorphic reporting.
          </p>
        </div>
      </div>

      {/* Interactive Class Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Class Selection List */}
        <div className="space-y-2">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 px-1">
            7 Core CRM Entities ({oopClasses.length})
          </h3>

          {oopClasses.map(cls => (
            <button
              key={cls.name}
              onClick={() => setSelectedClass(cls.name)}
              className={`w-full text-left p-3.5 rounded-xl border transition-all flex items-center justify-between ${
                selectedClass === cls.name
                  ? 'bg-brand-50 border-brand-300 shadow-sm text-brand-900'
                  : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-700'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Box className={`w-4 h-4 ${selectedClass === cls.name ? 'text-brand-600' : 'text-slate-400'}`} />
                <div>
                  <span className="font-semibold text-sm block">{cls.name}</span>
                  <span className="text-[10px] text-slate-400 font-mono">extends {cls.extends}</span>
                </div>
              </div>

              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                {cls.count} inst.
              </span>
            </button>
          ))}
        </div>

        {/* Selected Class Details Panel */}
        <Card className="lg:col-span-2">
          <CardHeader
            title={`class ${currentObj.name} extends ${currentObj.extends}`}
            subtitle={currentObj.file}
            action={
              <Badge variant="primary">{currentObj.count} Live Objects in Memory</Badge>
            }
          />
          <CardContent className="space-y-4">
            <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-lg border border-slate-200">
              {currentObj.description}
            </p>

            {/* Properties List */}
            <div>
              <h4 className="text-xs font-bold uppercase text-slate-500 mb-2">Encapsulated Properties</h4>
              <div className="flex flex-wrap gap-1.5">
                {currentObj.properties.map(p => (
                  <span key={p} className="px-2.5 py-1 rounded-md text-xs font-mono bg-slate-100 text-slate-700 border border-slate-200">
                    this.{p}
                  </span>
                ))}
              </div>
            </div>

            {/* Methods List */}
            <div>
              <h4 className="text-xs font-bold uppercase text-slate-500 mb-2">Member Methods & Associations</h4>
              <div className="space-y-1.5">
                {currentObj.methods.map(m => (
                  <div key={m} className="p-2 rounded-lg bg-slate-900 text-emerald-400 font-mono text-xs flex items-center gap-2">
                    <span className="text-brand-400 font-bold">&gt;</span>
                    <span>{m}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Sample Instantiated JSON */}
            <div>
              <h4 className="text-xs font-bold uppercase text-slate-500 mb-2">Sample Live Instance (LocalStorage)</h4>
              <pre className="p-3 rounded-xl bg-slate-950 text-slate-200 font-mono text-xs overflow-x-auto max-h-48 border border-slate-800">
                {JSON.stringify(currentObj.sampleInstance, null, 2)}
              </pre>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
