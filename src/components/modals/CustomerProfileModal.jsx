import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { Table } from '../common/Table';
import { useCRM } from '../../context/CRMContext';
import {
  formatCurrency,
  formatDate,
  formatDateTime,
  getStatusBadgeColor,
  getPriorityBadgeColor
} from '../../utils/formatters';
import {
  User,
  Mail,
  Phone,
  Building,
  MapPin,
  Calendar,
  DollarSign,
  Layers,
  AlertOctagon,
  LifeBuoy
} from 'lucide-react';

export function CustomerProfileModal({ isOpen, onClose, customer, onEdit }) {
  const { sales, interactions, complaints, tickets, employees, products } = useCRM();
  const [activeTab, setActiveTab] = useState('overview');

  if (!customer) return null;

  // Use OOP relationship methods on the Customer instance!
  const customerSales = customer.getSales ? customer.getSales(sales) : sales.filter(s => s.customerId === customer.id);
  const customerInteractions = customer.getInteractions ? customer.getInteractions(interactions) : interactions.filter(i => i.customerId === customer.id);
  const customerComplaints = customer.getComplaints ? customer.getComplaints(complaints) : complaints.filter(c => c.customerId === customer.id);
  const customerTickets = customer.getTickets ? customer.getTickets(tickets) : tickets.filter(t => t.customerId === customer.id);
  const totalSpent = customer.calculateTotalSpent ? customer.calculateTotalSpent(sales) : customerSales.reduce((sum, s) => sum + (Number(s.totalAmount) || 0), 0);

  const tabs = [
    { id: 'overview', label: 'Overview', icon: User },
    { id: 'sales', label: `Sales (${customerSales.length})`, icon: DollarSign },
    { id: 'interactions', label: `Interactions (${customerInteractions.length})`, icon: Layers },
    { id: 'complaints', label: `Complaints (${customerComplaints.length})`, icon: AlertOctagon },
    { id: 'tickets', label: `Tickets (${customerTickets.length})`, icon: LifeBuoy }
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={customer.name}
      subtitle={`Customer 360° Profile — ${customer.id}`}
      size="xl"
      footer={
        <div className="w-full flex items-center justify-between">
          <span className="text-xs text-slate-500">
            Registered on {formatDate(customer.createdAt)}
          </span>
          <div className="flex gap-2">
            <Button variant="secondary" onClick={onClose}>
              Close
            </Button>
            {onEdit && (
              <Button variant="primary" onClick={() => { onClose(); onEdit(customer); }}>
                Edit Profile
              </Button>
            )}
          </div>
        </div>
      }
    >
      <div className="space-y-6">
        {/* Profile Header Banner */}
        <div className="p-5 rounded-2xl bg-gradient-to-r from-brand-600 via-brand-700 to-accent-700 text-white shadow-md">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-xl font-bold border border-white/30">
                {customer.getInitials ? customer.getInitials() : customer.name.substring(0, 2).toUpperCase()}
              </div>
              <div>
                <h3 className="text-xl font-bold leading-tight">{customer.name}</h3>
                <p className="text-brand-100 text-sm">{customer.company || 'Private Client'}</p>
                <div className="flex items-center gap-2 mt-2">
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase ${
                    customer.status === 'Active' ? 'bg-emerald-400 text-emerald-950' : 'bg-amber-300 text-amber-950'
                  }`}>
                    {customer.status}
                  </span>
                  <span className="text-xs text-brand-200">ID: {customer.id}</span>
                </div>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-xl p-3 border border-white/10 text-right sm:text-right">
              <p className="text-[11px] text-brand-200 uppercase font-medium">Lifetime Value (LTV)</p>
              <p className="text-2xl font-black">{formatCurrency(totalSpent)}</p>
              <p className="text-[10px] text-brand-200">{customerSales.length} Transactions</p>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 gap-2 overflow-x-auto">
          {tabs.map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 pb-3 px-3 text-xs sm:text-sm font-medium border-b-2 transition-all whitespace-nowrap ${
                  isActive
                    ? 'border-brand-600 text-brand-600'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab 1: Overview */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-3">
                <h4 className="text-xs font-semibold uppercase text-slate-500 tracking-wider">Contact Information</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-slate-700">
                    <Mail className="w-4 h-4 text-slate-400 shrink-0" />
                    <span className="font-medium">{customer.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-700">
                    <Phone className="w-4 h-4 text-slate-400 shrink-0" />
                    <span>{customer.phone}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-700">
                    <Building className="w-4 h-4 text-slate-400 shrink-0" />
                    <span>{customer.company || 'Individual Account'}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-700">
                    <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
                    <span>{customer.address ? `${customer.address}, ${customer.city}` : customer.city || 'Kerala, India'}</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-4 rounded-xl border border-slate-200 bg-white">
                  <p className="text-xs text-slate-500 font-medium">Interactions Logged</p>
                  <p className="text-2xl font-bold text-slate-800 mt-1">{customerInteractions.length}</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">Calls, meetings, emails</p>
                </div>
                <div className="p-4 rounded-xl border border-slate-200 bg-white">
                  <p className="text-xs text-slate-500 font-medium">Paid Invoices</p>
                  <p className="text-2xl font-bold text-emerald-600 mt-1">
                    {customerSales.filter(s => s.paymentStatus === 'Paid').length}
                  </p>
                  <p className="text-[11px] text-slate-400 mt-0.5">Successfully settled</p>
                </div>
                <div className="p-4 rounded-xl border border-slate-200 bg-white">
                  <p className="text-xs text-slate-500 font-medium">Complaints Raised</p>
                  <p className="text-2xl font-bold text-rose-600 mt-1">{customerComplaints.length}</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    {customerComplaints.filter(c => c.status !== 'Resolved').length} Unresolved
                  </p>
                </div>
                <div className="p-4 rounded-xl border border-slate-200 bg-white">
                  <p className="text-xs text-slate-500 font-medium">Support Tickets</p>
                  <p className="text-2xl font-bold text-brand-600 mt-1">{customerTickets.length}</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    {customerTickets.filter(t => t.status !== 'Closed').length} Active
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Sales History */}
        {activeTab === 'sales' && (
          <Table
            data={customerSales}
            columns={[
              { header: 'Invoice #', accessor: 'id', render: (s) => <span className="font-semibold text-slate-900">{s.id}</span> },
              { header: 'Date', accessor: 'date', render: (s) => formatDate(s.date) },
              {
                header: 'Product',
                accessor: 'productId',
                render: (s) => {
                  const prod = products.find(p => p.id === s.productId);
                  return prod ? prod.name : s.productId;
                }
              },
              { header: 'Qty', accessor: 'quantity', align: 'center' },
              { header: 'Amount', accessor: 'totalAmount', align: 'right', render: (s) => <span className="font-bold text-slate-900">{formatCurrency(s.totalAmount)}</span> },
              {
                header: 'Status',
                accessor: 'paymentStatus',
                align: 'center',
                render: (s) => (
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium border ${getStatusBadgeColor(s.paymentStatus)}`}>
                    {s.paymentStatus}
                  </span>
                )
              }
            ]}
            emptyMessage="No sales recorded for this customer yet."
          />
        )}

        {/* Tab 3: Interactions Log */}
        {activeTab === 'interactions' && (
          <div className="space-y-3">
            {customerInteractions.length === 0 ? (
              <p className="text-center py-8 text-sm text-slate-400">No interaction touchpoints recorded yet.</p>
            ) : (
              customerInteractions.map(item => {
                const emp = employees.find(e => e.id === item.employeeId);
                return (
                  <div key={item.id} className="p-4 rounded-xl border border-slate-200 bg-white space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded-md text-xs font-semibold bg-brand-50 text-brand-700">
                          {item.type}
                        </span>
                        <span className="text-xs text-slate-500">
                          {formatDateTime(item.date)}
                        </span>
                      </div>
                      <span className="text-xs font-medium text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md">
                        {item.outcome}
                      </span>
                    </div>
                    <p className="text-sm text-slate-700">{item.notes}</p>
                    <div className="flex items-center justify-between text-xs text-slate-500 pt-1 border-t border-slate-100">
                      <span>Staff: {emp ? `${emp.name} (${emp.designation})` : item.employeeId}</span>
                      {item.followUpDate && (
                        <span className="text-amber-600 font-medium">
                          Follow-up: {formatDate(item.followUpDate)}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}

        {/* Tab 4: Complaints */}
        {activeTab === 'complaints' && (
          <div className="space-y-3">
            {customerComplaints.length === 0 ? (
              <p className="text-center py-8 text-sm text-slate-400">No complaints registered by this customer.</p>
            ) : (
              customerComplaints.map(comp => (
                <div key={comp.id} className="p-4 rounded-xl border border-slate-200 bg-white space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-slate-900 text-sm">{comp.title}</span>
                      <span className={`px-2 py-0.5 rounded text-xs font-semibold border ${getPriorityBadgeColor(comp.priority)}`}>
                        {comp.priority}
                      </span>
                    </div>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium border ${getStatusBadgeColor(comp.status)}`}>
                      {comp.status}
                    </span>
                  </div>
                  <p className="text-sm text-slate-600">{comp.description}</p>
                  {comp.resolutionNotes && (
                    <div className="p-2.5 rounded-lg bg-emerald-50 text-emerald-900 text-xs border border-emerald-100">
                      <span className="font-semibold">Resolution: </span>
                      {comp.resolutionNotes}
                    </div>
                  )}
                  <div className="text-xs text-slate-400 pt-1 flex justify-between">
                    <span>Logged on: {formatDate(comp.date)}</span>
                    <span>Category: {comp.category}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Tab 5: Support Tickets */}
        {activeTab === 'tickets' && (
          <div className="space-y-3">
            {customerTickets.length === 0 ? (
              <p className="text-center py-8 text-sm text-slate-400">No support tickets created for this customer.</p>
            ) : (
              customerTickets.map(tck => {
                const assigned = employees.find(e => e.id === tck.assignedEmployeeId);
                return (
                  <div key={tck.id} className="p-4 rounded-xl border border-slate-200 bg-white space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-slate-900 text-sm">#{tck.id} — {tck.subject}</span>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium border ${getStatusBadgeColor(tck.status)}`}>
                        {tck.status}
                      </span>
                    </div>
                    <p className="text-sm text-slate-600">{tck.description}</p>
                    <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500 pt-2 border-t border-slate-100">
                      <span>Category: <strong className="text-slate-700">{tck.category}</strong></span>
                      <span>Assigned: <strong className="text-slate-700">{assigned ? assigned.name : 'Unassigned'}</strong></span>
                      <span className={`px-2 py-0.5 rounded text-xs font-semibold border ${getPriorityBadgeColor(tck.priority)}`}>
                        {tck.priority}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}
      </div>
    </Modal>
  );
}
