import React, { useState, useMemo } from 'react';
import {
  Layers,
  Plus,
  Phone,
  Mail,
  Users,
  Presentation,
  FileText,
  Calendar,
  Filter,
  Edit2,
  Trash2,
  Clock
} from 'lucide-react';
import { Button } from '../components/common/Button';
import { Card } from '../components/common/Card';
import { SearchBar } from '../components/common/SearchBar';
import { Table } from '../components/common/Table';
import { ConfirmModal } from '../components/common/ConfirmModal';
import { InteractionModal } from '../components/modals/InteractionModal';
import { useCRM } from '../context/CRMContext';
import { useToast } from '../context/ToastContext';
import { formatDateTime, formatDate, getInteractionTypeBadge } from '../utils/formatters';

export function Interactions({ globalSearch }) {
  const { interactions, addInteraction, updateInteraction, deleteInteraction, customers, employees } = useCRM();
  const { showToast } = useToast();

  const [localSearch, setLocalSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('All');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingInteraction, setEditingInteraction] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const activeSearch = globalSearch || localSearch;

  const interactionTypes = ['All', 'Call', 'Meeting', 'Email', 'Demo', 'Note'];

  const filteredInteractions = useMemo(() => {
    return interactions.filter(i => {
      const cust = customers.find(c => c.id === i.customerId);
      const emp = employees.find(e => e.id === i.employeeId);

      const custName = cust ? cust.name : '';
      const empName = emp ? emp.name : '';

      const matchesSearch =
        custName.toLowerCase().includes(activeSearch.toLowerCase()) ||
        empName.toLowerCase().includes(activeSearch.toLowerCase()) ||
        i.notes.toLowerCase().includes(activeSearch.toLowerCase()) ||
        i.outcome.toLowerCase().includes(activeSearch.toLowerCase()) ||
        i.id.toLowerCase().includes(activeSearch.toLowerCase());

      const matchesType = typeFilter === 'All' || i.type === typeFilter;

      return matchesSearch && matchesType;
    });
  }, [interactions, activeSearch, typeFilter, customers, employees]);

  const handleSave = (formData) => {
    try {
      if (editingInteraction) {
        updateInteraction(editingInteraction.id, formData);
        showToast('Interaction record updated successfully!', 'success');
      } else {
        addInteraction(formData);
        showToast('New interaction touchpoint logged!', 'success');
      }
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const handleDeleteConfirm = () => {
    if (!deleteTarget) return;
    deleteInteraction(deleteTarget.id);
    showToast(`Interaction ${deleteTarget.id} removed!`, 'info');
    setDeleteTarget(null);
  };

  const getIconForType = (type) => {
    switch (type?.toLowerCase()) {
      case 'call': return Phone;
      case 'email': return Mail;
      case 'meeting': return Users;
      case 'demo': return Presentation;
      default: return FileText;
    }
  };

  const columns = [
    {
      header: 'Type & Channel',
      accessor: 'type',
      render: (i) => {
        const Icon = getIconForType(i.type);
        const badge = getInteractionTypeBadge(i.type);
        return (
          <div className="flex items-center gap-2">
            <div className={`p-2 rounded-lg border ${badge.bg} shrink-0`}>
              <Icon className="w-3.5 h-3.5" />
            </div>
            <div>
              <span className="font-semibold text-xs text-slate-800">{i.type}</span>
              <span className="text-[10px] text-slate-400 block font-mono">{i.id}</span>
            </div>
          </div>
        );
      }
    },
    {
      header: 'Customer',
      accessor: 'customerId',
      render: (i) => {
        const cust = i.getCustomer ? i.getCustomer(customers) : customers.find(c => c.id === i.customerId);
        return (
          <div>
            <p className="font-semibold text-xs text-slate-900">{cust ? cust.name : i.customerId}</p>
            <p className="text-[11px] text-slate-400">{cust?.company || 'Direct Client'}</p>
          </div>
        );
      }
    },
    {
      header: 'Staff Representative',
      accessor: 'employeeId',
      render: (i) => {
        const emp = i.getEmployee ? i.getEmployee(employees) : employees.find(e => e.id === i.employeeId);
        return (
          <div>
            <p className="text-xs font-medium text-slate-800">{emp ? emp.name : i.employeeId}</p>
            <p className="text-[10px] text-slate-400">{emp?.designation || emp?.department}</p>
          </div>
        );
      }
    },
    {
      header: 'Notes & Discussion',
      accessor: 'notes',
      render: (i) => (
        <p className="text-xs text-slate-600 line-clamp-2 max-w-sm leading-relaxed">{i.notes}</p>
      )
    },
    {
      header: 'Date & Time',
      accessor: 'date',
      render: (i) => (
        <span className="text-xs text-slate-500 whitespace-nowrap">
          {formatDateTime(i.date)}
        </span>
      )
    },
    {
      header: 'Outcome / Follow-up',
      accessor: 'outcome',
      render: (i) => (
        <div className="space-y-0.5">
          <span className="inline-block px-2 py-0.5 rounded text-[11px] font-semibold bg-slate-100 text-slate-700">
            {i.outcome}
          </span>
          {i.followUpDate && (
            <p className="text-[10px] text-amber-600 font-medium flex items-center gap-1">
              <Clock className="w-2.5 h-2.5" />
              Follow-up: {formatDate(i.followUpDate)}
            </p>
          )}
        </div>
      )
    },
    {
      header: 'Actions',
      accessor: 'id',
      align: 'right',
      render: (i) => (
        <div className="flex items-center justify-end gap-1">
          <button
            onClick={() => {
              setEditingInteraction(i);
              setIsModalOpen(true);
            }}
            className="p-1.5 text-slate-500 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
            title="Edit Log"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => setDeleteTarget(i)}
            className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
            title="Delete Log"
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
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Interaction Management</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Log all customer touchpoints: calls, client demos, emails, and follow-ups.
          </p>
        </div>

        <Button
          variant="primary"
          icon={Plus}
          onClick={() => {
            setEditingInteraction(null);
            setIsModalOpen(true);
          }}
        >
          Log Interaction
        </Button>
      </div>

      {/* Filter and Search */}
      <Card className="p-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          <SearchBar
            value={localSearch}
            onChange={setLocalSearch}
            placeholder="Search by customer, employee, or discussion notes..."
          />

          <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
            <span className="text-xs font-semibold text-slate-500 flex items-center gap-1 shrink-0">
              <Filter className="w-3.5 h-3.5" />
              Channel:
            </span>
            <div className="flex bg-slate-100 p-0.5 rounded-lg text-xs shrink-0">
              {interactionTypes.map((type) => (
                <button
                  key={type}
                  onClick={() => setTypeFilter(type)}
                  className={`px-3 py-1.5 rounded-md font-medium transition-all whitespace-nowrap ${
                    typeFilter === type
                      ? 'bg-white text-slate-900 shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>
        </div>
      </Card>

      {/* Table */}
      <Table
        data={filteredInteractions}
        columns={columns}
        emptyMessage="No customer interactions match your criteria."
      />

      {/* Interaction Modal */}
      <InteractionModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingInteraction(null);
        }}
        onSave={handleSave}
        initialData={editingInteraction}
      />

      {/* Delete Confirmation */}
      <ConfirmModal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete Interaction"
        message={`Are you sure you want to delete interaction log ${deleteTarget?.id}?`}
        confirmText="Yes, Delete Record"
      />
    </div>
  );
}
