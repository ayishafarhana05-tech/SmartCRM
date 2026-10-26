import React, { useState, useMemo } from 'react';
import {
  Briefcase,
  Plus,
  Mail,
  Phone,
  Filter,
  Edit2,
  Trash2,
  Calendar,
  Layers,
  LifeBuoy,
  TrendingUp
} from 'lucide-react';
import { Button } from '../components/common/Button';
import { Card } from '../components/common/Card';
import { SearchBar } from '../components/common/SearchBar';
import { Table } from '../components/common/Table';
import { ConfirmModal } from '../components/common/ConfirmModal';
import { EmployeeModal } from '../components/modals/EmployeeModal';
import { useCRM } from '../context/CRMContext';
import { useToast } from '../context/ToastContext';
import { formatDate, formatCurrency, getStatusBadgeColor } from '../utils/formatters';

export function Employees({ globalSearch }) {
  const { employees, addEmployee, updateEmployee, deleteEmployee, sales, interactions, tickets } = useCRM();
  const { showToast } = useToast();

  const [localSearch, setLocalSearch] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('All');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const activeSearch = globalSearch || localSearch;

  const departments = ['All', 'Sales', 'Customer Support', 'Technical', 'Marketing', 'Operations'];

  const filteredEmployees = useMemo(() => {
    return employees.filter(e => {
      const matchesSearch =
        e.name.toLowerCase().includes(activeSearch.toLowerCase()) ||
        e.email.toLowerCase().includes(activeSearch.toLowerCase()) ||
        e.phone.toLowerCase().includes(activeSearch.toLowerCase()) ||
        e.designation.toLowerCase().includes(activeSearch.toLowerCase()) ||
        e.id.toLowerCase().includes(activeSearch.toLowerCase());

      const matchesDept = departmentFilter === 'All' || e.department === departmentFilter;

      return matchesSearch && matchesDept;
    });
  }, [employees, activeSearch, departmentFilter]);

  const handleSaveEmployee = (formData) => {
    try {
      if (editingEmployee) {
        updateEmployee(editingEmployee.id, formData);
        showToast(`Staff member ${formData.name} updated successfully!`, 'success');
      } else {
        const created = addEmployee(formData);
        showToast(`Staff member ${created.name} added successfully!`, 'success');
      }
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const handleDeleteConfirm = () => {
    if (!deleteTarget) return;
    deleteEmployee(deleteTarget.id);
    showToast(`Employee ${deleteTarget.name} removed successfully!`, 'info');
    setDeleteTarget(null);
  };

  const columns = [
    {
      header: 'Employee',
      accessor: 'name',
      render: (e) => (
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-700 font-bold text-xs flex items-center justify-center border border-purple-200 shrink-0">
            {e.getInitials ? e.getInitials() : e.name.substring(0, 2).toUpperCase()}
          </div>
          <div>
            <span className="font-semibold text-slate-900 block">{e.name}</span>
            <span className="text-xs text-slate-400 font-mono">{e.id}</span>
          </div>
        </div>
      )
    },
    {
      header: 'Designation & Dept',
      accessor: 'designation',
      render: (e) => (
        <div>
          <p className="text-xs font-semibold text-slate-800">{e.designation}</p>
          <span className="inline-block mt-0.5 px-2 py-0.5 rounded text-[10px] font-medium bg-slate-100 text-slate-600">
            {e.department}
          </span>
        </div>
      )
    },
    {
      header: 'Contact Info',
      accessor: 'email',
      render: (e) => (
        <div className="space-y-0.5 text-xs">
          <div className="flex items-center gap-1.5 text-slate-700">
            <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span>{e.email}</span>
          </div>
          <div className="flex items-center gap-1.5 text-slate-500">
            <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span>{e.phone}</span>
          </div>
        </div>
      )
    },
    {
      header: 'Assigned Work',
      accessor: 'id',
      render: (e) => {
        // OOP method usage
        const assignedInteractions = e.getAssignedInteractions ? e.getAssignedInteractions(interactions) : interactions.filter(i => i.employeeId === e.id);
        const assignedTickets = e.getAssignedTickets ? e.getAssignedTickets(tickets) : tickets.filter(t => t.assignedEmployeeId === e.id);
        const salesVolume = e.calculateSalesVolume ? e.calculateSalesVolume(sales) : sales.filter(s => s.employeeId === e.id).reduce((sum, s) => sum + (Number(s.totalAmount) || 0), 0);

        return (
          <div className="flex items-center gap-3 text-xs">
            <span className="flex items-center gap-1 text-slate-600" title="Interactions Handled">
              <Layers className="w-3.5 h-3.5 text-brand-500" />
              {assignedInteractions.length}
            </span>
            <span className="flex items-center gap-1 text-slate-600" title="Assigned Support Tickets">
              <LifeBuoy className="w-3.5 h-3.5 text-amber-500" />
              {assignedTickets.length}
            </span>
            {salesVolume > 0 && (
              <span className="flex items-center gap-1 font-semibold text-emerald-600" title="Sales Converted">
                <TrendingUp className="w-3.5 h-3.5 text-emerald-500" />
                {formatCurrency(salesVolume)}
              </span>
            )}
          </div>
        );
      }
    },
    {
      header: 'Status',
      accessor: 'status',
      align: 'center',
      render: (e) => (
        <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusBadgeColor(e.status)}`}>
          {e.status}
        </span>
      )
    },
    {
      header: 'Actions',
      accessor: 'id',
      align: 'right',
      render: (e) => (
        <div className="flex items-center justify-end gap-1">
          <button
            onClick={() => {
              setEditingEmployee(e);
              setIsModalOpen(true);
            }}
            className="p-1.5 text-slate-500 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
            title="Edit Employee"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => setDeleteTarget(e)}
            className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
            title="Delete Employee"
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
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Employee Directory</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage sales reps, support engineers, technical staff, and their workload.
          </p>
        </div>

        <Button
          variant="primary"
          icon={Plus}
          onClick={() => {
            setEditingEmployee(null);
            setIsModalOpen(true);
          }}
        >
          Add Employee
        </Button>
      </div>

      {/* Filter and Search */}
      <Card className="p-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          <SearchBar
            value={localSearch}
            onChange={setLocalSearch}
            placeholder="Search by name, designation, email..."
          />

          <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
            <span className="text-xs font-semibold text-slate-500 flex items-center gap-1 shrink-0">
              <Filter className="w-3.5 h-3.5" />
              Department:
            </span>
            <div className="flex bg-slate-100 p-0.5 rounded-lg text-xs shrink-0">
              {departments.map((dept) => (
                <button
                  key={dept}
                  onClick={() => setDepartmentFilter(dept)}
                  className={`px-3 py-1.5 rounded-md font-medium transition-all whitespace-nowrap ${
                    departmentFilter === dept
                      ? 'bg-white text-slate-900 shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {dept}
                </button>
              ))}
            </div>
          </div>
        </div>
      </Card>

      {/* Table */}
      <Table
        data={filteredEmployees}
        columns={columns}
        emptyMessage="No employees found for this department."
      />

      {/* Employee Modal */}
      <EmployeeModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingEmployee(null);
        }}
        onSave={handleSaveEmployee}
        initialData={editingEmployee}
      />

      {/* Delete Confirmation */}
      <ConfirmModal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete Employee"
        message={`Are you sure you want to remove "${deleteTarget?.name}"? Assigned tickets and past sales logs will retain their reference ID.`}
        confirmText="Yes, Remove Staff"
      />
    </div>
  );
}
