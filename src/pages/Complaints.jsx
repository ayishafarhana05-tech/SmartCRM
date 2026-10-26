import React, { useState, useMemo } from 'react';
import {
  AlertOctagon,
  Plus,
  CheckCircle,
  Clock,
  Filter,
  Edit2,
  Trash2,
  AlertTriangle,
  FileCheck
} from 'lucide-react';
import { Button } from '../components/common/Button';
import { Card } from '../components/common/Card';
import { SearchBar } from '../components/common/SearchBar';
import { Table } from '../components/common/Table';
import { ConfirmModal } from '../components/common/ConfirmModal';
import { ComplaintModal } from '../components/modals/ComplaintModal';
import { useCRM } from '../context/CRMContext';
import { useToast } from '../context/ToastContext';
import { formatDate, getStatusBadgeColor, getPriorityBadgeColor } from '../utils/formatters';

export function Complaints({ globalSearch }) {
  const { complaints, addComplaint, updateComplaint, resolveComplaint, deleteComplaint, customers } = useCRM();
  const { showToast } = useToast();

  const [localSearch, setLocalSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [priorityFilter, setPriorityFilter] = useState('All');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingComplaint, setEditingComplaint] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const activeSearch = globalSearch || localSearch;

  const statuses = ['All', 'Pending', 'In Progress', 'Resolved'];
  const priorities = ['All', 'Urgent', 'High', 'Medium', 'Low'];

  const filteredComplaints = useMemo(() => {
    return complaints.filter(c => {
      const cust = customers.find(cu => cu.id === c.customerId);
      const custName = cust ? cust.name : '';

      const matchesSearch =
        custName.toLowerCase().includes(activeSearch.toLowerCase()) ||
        c.title.toLowerCase().includes(activeSearch.toLowerCase()) ||
        c.description.toLowerCase().includes(activeSearch.toLowerCase()) ||
        c.category.toLowerCase().includes(activeSearch.toLowerCase()) ||
        c.id.toLowerCase().includes(activeSearch.toLowerCase());

      const matchesStatus = statusFilter === 'All' || c.status === statusFilter;
      const matchesPriority = priorityFilter === 'All' || c.priority === priorityFilter;

      return matchesSearch && matchesStatus && matchesPriority;
    });
  }, [complaints, activeSearch, statusFilter, priorityFilter, customers]);

  const handleSave = (formData) => {
    try {
      if (editingComplaint) {
        updateComplaint(editingComplaint.id, formData);
        showToast(`Complaint ${editingComplaint.id} updated!`, 'success');
      } else {
        const created = addComplaint(formData);
        showToast(`Complaint ${created.id} registered!`, 'success');
      }
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const handleQuickResolve = (complaint) => {
    const notes = prompt(`Enter resolution notes for complaint "${complaint.title}":`, "Grievance reviewed and resolved with client satisfaction.");
    if (notes !== null) {
      resolveComplaint(complaint.id, notes);
      showToast(`Complaint ${complaint.id} marked as Resolved!`, 'success');
    }
  };

  const handleDeleteConfirm = () => {
    if (!deleteTarget) return;
    deleteComplaint(deleteTarget.id);
    showToast(`Complaint ${deleteTarget.id} deleted!`, 'info');
    setDeleteTarget(null);
  };

  const columns = [
    {
      header: 'Complaint & ID',
      accessor: 'title',
      render: (c) => (
        <div>
          <span className="font-semibold text-xs text-slate-900 block">{c.title}</span>
          <span className="text-[10px] text-slate-400 font-mono">
            {c.id} • {c.category}
          </span>
        </div>
      )
    },
    {
      header: 'Customer',
      accessor: 'customerId',
      render: (c) => {
        const cust = c.getCustomer ? c.getCustomer(customers) : customers.find(cu => cu.id === c.customerId);
        return (
          <div>
            <p className="font-semibold text-xs text-slate-900">{cust ? cust.name : c.customerId}</p>
            <p className="text-[11px] text-slate-400">{cust?.company || 'Direct Client'}</p>
          </div>
        );
      }
    },
    {
      header: 'Description',
      accessor: 'description',
      render: (c) => (
        <div className="space-y-1">
          <p className="text-xs text-slate-600 line-clamp-2 max-w-sm">{c.description}</p>
          {c.resolutionNotes && (
            <p className="text-[11px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100 max-w-sm">
              <strong>Resolved:</strong> {c.resolutionNotes}
            </p>
          )}
        </div>
      )
    },
    {
      header: 'Logged Date',
      accessor: 'date',
      render: (c) => (
        <span className="text-xs text-slate-500 whitespace-nowrap">
          {formatDate(c.date)}
        </span>
      )
    },
    {
      header: 'Priority',
      accessor: 'priority',
      align: 'center',
      render: (c) => (
        <span className={`px-2.5 py-0.5 rounded text-xs font-semibold border ${getPriorityBadgeColor(c.priority)}`}>
          {c.priority}
        </span>
      )
    },
    {
      header: 'Status',
      accessor: 'status',
      align: 'center',
      render: (c) => (
        <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusBadgeColor(c.status)}`}>
          {c.status}
        </span>
      )
    },
    {
      header: 'Actions',
      accessor: 'id',
      align: 'right',
      render: (c) => (
        <div className="flex items-center justify-end gap-1">
          {c.status !== 'Resolved' && (
            <button
              onClick={() => handleQuickResolve(c)}
              className="p-1.5 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition-colors"
              title="Mark Resolved"
            >
              <FileCheck className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={() => {
              setEditingComplaint(c);
              setIsModalOpen(true);
            }}
            className="p-1.5 text-slate-500 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
            title="Edit Complaint"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => setDeleteTarget(c)}
            className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
            title="Delete Complaint"
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
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Complaint Management</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Log grievances, escalate priority issues, assign corrective actions, and track SLA resolutions.
          </p>
        </div>

        <Button
          variant="primary"
          icon={Plus}
          onClick={() => {
            setEditingComplaint(null);
            setIsModalOpen(true);
          }}
        >
          Register Complaint
        </Button>
      </div>

      {/* Filter and Search */}
      <Card className="p-4 space-y-3">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          <SearchBar
            value={localSearch}
            onChange={setLocalSearch}
            placeholder="Search by customer, complaint title, category..."
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
        data={filteredComplaints}
        columns={columns}
        emptyMessage="No complaints found matching filters."
      />

      {/* Modal */}
      <ComplaintModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingComplaint(null);
        }}
        onSave={handleSave}
        initialData={editingComplaint}
      />

      {/* Delete Confirmation */}
      <ConfirmModal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete Complaint"
        message={`Are you sure you want to delete complaint "${deleteTarget?.title}" (${deleteTarget?.id})?`}
        confirmText="Yes, Delete Complaint"
      />
    </div>
  );
}
