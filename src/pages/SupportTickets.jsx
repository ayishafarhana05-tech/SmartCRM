import React, { useState, useMemo } from 'react';
import {
  LifeBuoy,
  Plus,
  CheckCircle,
  Clock,
  Filter,
  Edit2,
  Trash2,
  UserCheck,
  CheckSquare
} from 'lucide-react';
import { Button } from '../components/common/Button';
import { Card } from '../components/common/Card';
import { SearchBar } from '../components/common/SearchBar';
import { Table } from '../components/common/Table';
import { ConfirmModal } from '../components/common/ConfirmModal';
import { TicketModal } from '../components/modals/TicketModal';
import { useCRM } from '../context/CRMContext';
import { useToast } from '../context/ToastContext';
import { formatDate, getStatusBadgeColor, getPriorityBadgeColor } from '../utils/formatters';

export function SupportTickets({ globalSearch }) {
  const { tickets, addTicket, updateTicket, closeTicket, assignTicket, deleteTicket, customers, employees } = useCRM();
  const { showToast } = useToast();

  const [localSearch, setLocalSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [priorityFilter, setPriorityFilter] = useState('All');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTicket, setEditingTicket] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const activeSearch = globalSearch || localSearch;

  const statuses = ['All', 'Open', 'In Progress', 'Closed'];
  const priorities = ['All', 'Urgent', 'High', 'Medium', 'Low'];

  const filteredTickets = useMemo(() => {
    return tickets.filter(t => {
      const cust = customers.find(c => c.id === t.customerId);
      const emp = employees.find(e => e.id === t.assignedEmployeeId);

      const custName = cust ? cust.name : '';
      const empName = emp ? emp.name : '';

      const matchesSearch =
        custName.toLowerCase().includes(activeSearch.toLowerCase()) ||
        empName.toLowerCase().includes(activeSearch.toLowerCase()) ||
        t.subject.toLowerCase().includes(activeSearch.toLowerCase()) ||
        t.description.toLowerCase().includes(activeSearch.toLowerCase()) ||
        t.category.toLowerCase().includes(activeSearch.toLowerCase()) ||
        t.id.toLowerCase().includes(activeSearch.toLowerCase());

      const matchesStatus = statusFilter === 'All' || t.status === statusFilter;
      const matchesPriority = priorityFilter === 'All' || t.priority === priorityFilter;

      return matchesSearch && matchesStatus && matchesPriority;
    });
  }, [tickets, activeSearch, statusFilter, priorityFilter, customers, employees]);

  const handleSave = (formData) => {
    try {
      if (editingTicket) {
        updateTicket(editingTicket.id, formData);
        showToast(`Ticket ${editingTicket.id} updated!`, 'success');
      } else {
        const created = addTicket(formData);
        showToast(`Ticket ${created.id} opened successfully!`, 'success');
      }
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const handleQuickClose = (ticket) => {
    const res = prompt(`Enter resolution notes to close Ticket #${ticket.id}:`, "Issue resolved and confirmed with client.");
    if (res !== null) {
      closeTicket(ticket.id, res);
      showToast(`Ticket #${ticket.id} closed successfully!`, 'success');
    }
  };

  const handleQuickAssign = (ticketId, employeeId) => {
    assignTicket(ticketId, employeeId);
    showToast(`Ticket #${ticketId} assigned!`, 'info');
  };

  const handleDeleteConfirm = () => {
    if (!deleteTarget) return;
    deleteTicket(deleteTarget.id);
    showToast(`Ticket ${deleteTarget.id} removed!`, 'info');
    setDeleteTarget(null);
  };

  const columns = [
    {
      header: 'Ticket ID & Subject',
      accessor: 'subject',
      render: (t) => (
        <div>
          <span className="font-semibold text-xs text-slate-900 block">{t.subject}</span>
          <span className="text-[10px] text-slate-400 font-mono">
            {t.id} • {t.category}
          </span>
        </div>
      )
    },
    {
      header: 'Customer',
      accessor: 'customerId',
      render: (t) => {
        const cust = t.getCustomer ? t.getCustomer(customers) : customers.find(c => c.id === t.customerId);
        return (
          <div>
            <p className="font-semibold text-xs text-slate-900">{cust ? cust.name : t.customerId}</p>
            <p className="text-[11px] text-slate-400">{cust?.company || 'Direct Client'}</p>
          </div>
        );
      }
    },
    {
      header: 'Assigned Staff',
      accessor: 'assignedEmployeeId',
      render: (t) => {
        const emp = t.getAssignedEmployee ? t.getAssignedEmployee(employees) : employees.find(e => e.id === t.assignedEmployeeId);
        return (
          <select
            value={t.assignedEmployeeId || ''}
            onChange={(e) => handleQuickAssign(t.id, e.target.value)}
            className="text-xs py-1 px-2 border border-slate-200 rounded-md bg-white focus:outline-none focus:ring-1 focus:ring-brand-500 font-medium text-slate-700"
          >
            <option value="">Unassigned</option>
            {employees.map(e => (
              <option key={e.id} value={e.id}>
                {e.name}
              </option>
            ))}
          </select>
        );
      }
    },
    {
      header: 'Description & Resolution',
      accessor: 'description',
      render: (t) => (
        <div className="space-y-1">
          <p className="text-xs text-slate-600 line-clamp-2 max-w-sm">{t.description}</p>
          {t.resolution && (
            <p className="text-[11px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100 max-w-sm">
              <strong>Closed Resolution:</strong> {t.resolution}
            </p>
          )}
        </div>
      )
    },
    {
      header: 'Priority',
      accessor: 'priority',
      align: 'center',
      render: (t) => (
        <span className={`px-2.5 py-0.5 rounded text-xs font-semibold border ${getPriorityBadgeColor(t.priority)}`}>
          {t.priority}
        </span>
      )
    },
    {
      header: 'Status',
      accessor: 'status',
      align: 'center',
      render: (t) => (
        <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusBadgeColor(t.status)}`}>
          {t.status}
        </span>
      )
    },
    {
      header: 'Actions',
      accessor: 'id',
      align: 'right',
      render: (t) => (
        <div className="flex items-center justify-end gap-1">
          {t.status !== 'Closed' && (
            <button
              onClick={() => handleQuickClose(t)}
              className="p-1.5 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition-colors"
              title="Close Ticket"
            >
              <CheckSquare className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={() => {
              setEditingTicket(t);
              setIsModalOpen(true);
            }}
            className="p-1.5 text-slate-500 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
            title="Edit Ticket"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => setDeleteTarget(t)}
            className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
            title="Delete Ticket"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Support Ticket Helpdesk</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage customer technical issues, assign support engineers, and resolve tickets.
          </p>
        </div>

        <Button
          variant="primary"
          icon={Plus}
          onClick={() => {
            setEditingTicket(null);
            setIsModalOpen(true);
          }}
        >
          Create Support Ticket
        </Button>
      </div>

      {/* Filter and Search */}
      <Card className="p-4 space-y-3">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          <SearchBar
            value={localSearch}
            onChange={setLocalSearch}
            placeholder="Search by customer, technician, subject..."
          />

          {/* Status filter */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
            <span className="text-xs font-semibold text-slate-500 shrink-0">Status:</span>
            <div className="flex bg-slate-100 p-0.5 rounded-lg text-xs shrink-0">
              {statuses.map((st) => (
                <button
                  key={st}
                  onClick={() => setStatusFilter(st)}
                  className={`px-3 py-1.5 rounded-md font-medium transition-all whitespace-nowrap ${
                    statusFilter === st
                      ? 'bg-white text-slate-900 shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Priority filter */}
        <div className="flex items-center gap-2 pt-2 border-t border-slate-100 overflow-x-auto">
          <span className="text-xs font-semibold text-slate-500 shrink-0">Priority:</span>
          <div className="flex gap-1.5 shrink-0">
            {priorities.map((p) => (
              <button
                key={p}
                onClick={() => setPriorityFilter(p)}
                className={`px-2.5 py-1 rounded text-xs font-medium transition-all ${
                  priorityFilter === p
                    ? 'bg-brand-600 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>
      </Card>

      {/* Table */}
      <Table
        data={filteredTickets}
        columns={columns}
        emptyMessage="No support tickets found matching filters."
      />

      {/* Modal */}
      <TicketModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingTicket(null);
        }}
        onSave={handleSave}
        initialData={editingTicket}
      />

      {/* Delete Confirmation */}
      <ConfirmModal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete Support Ticket"
        message={`Are you sure you want to delete ticket #${deleteTarget?.id}?`}
        confirmText="Yes, Delete Ticket"
      />
    </div>
  );
}
