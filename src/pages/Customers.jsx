import React, { useState, useMemo } from 'react';
import {
  Users,
  Plus,
  Download,
  Search,
  Filter,
  Eye,
  Edit2,
  Trash2,
  Building,
  Mail,
  Phone,
  MapPin,
  ExternalLink
} from 'lucide-react';
import { Button } from '../components/common/Button';
import { Card } from '../components/common/Card';
import { SearchBar } from '../components/common/SearchBar';
import { Table } from '../components/common/Table';
import { ConfirmModal } from '../components/common/ConfirmModal';
import { CustomerModal } from '../components/modals/CustomerModal';
import { CustomerProfileModal } from '../components/modals/CustomerProfileModal';
import { useCRM } from '../context/CRMContext';
import { useToast } from '../context/ToastContext';
import { formatDate, getStatusBadgeColor } from '../utils/formatters';
import { exportToCSV } from '../utils/exportCsv';

export function Customers({ globalSearch }) {
  const { customers, addCustomer, updateCustomer, deleteCustomer, sales, interactions } = useCRM();
  const { showToast } = useToast();

  const [localSearch, setLocalSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  // Modals state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [profileCustomer, setProfileCustomer] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const activeSearch = globalSearch || localSearch;

  // Filtered customers
  const filteredCustomers = useMemo(() => {
    return customers.filter(c => {
      const matchesSearch =
        c.name.toLowerCase().includes(activeSearch.toLowerCase()) ||
        c.email.toLowerCase().includes(activeSearch.toLowerCase()) ||
        c.phone.toLowerCase().includes(activeSearch.toLowerCase()) ||
        c.company.toLowerCase().includes(activeSearch.toLowerCase()) ||
        c.city.toLowerCase().includes(activeSearch.toLowerCase()) ||
        c.id.toLowerCase().includes(activeSearch.toLowerCase());

      const matchesStatus = statusFilter === 'All' || c.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [customers, activeSearch, statusFilter]);

  const handleSaveCustomer = (formData) => {
    try {
      if (editingCustomer) {
        updateCustomer(editingCustomer.id, formData);
        showToast(`Customer ${formData.name} updated successfully!`, 'success');
      } else {
        const created = addCustomer(formData);
        showToast(`Customer ${created.name} added successfully!`, 'success');
      }
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const handleDeleteConfirm = () => {
    if (!deleteTarget) return;
    deleteCustomer(deleteTarget.id);
    showToast(`Customer ${deleteTarget.name} deleted successfully!`, 'info');
    setDeleteTarget(null);
  };

  const handleExport = () => {
    const exportData = filteredCustomers.map(c => ({
      ID: c.id,
      Name: c.name,
      Email: c.email,
      Phone: c.phone,
      Company: c.company || '',
      Address: c.address || '',
      City: c.city || '',
      Status: c.status,
      RegistrationDate: formatDate(c.createdAt)
    }));

    exportToCSV('SmartCRM_Customers', exportData, {
      ID: 'Customer ID',
      Name: 'Customer Name',
      Email: 'Email Address',
      Phone: 'Phone',
      Company: 'Company',
      Address: 'Address',
      City: 'City',
      Status: 'Status',
      RegistrationDate: 'Registration Date'
    });
    showToast('Customer directory exported to CSV!', 'success');
  };

  const columns = [
    {
      header: 'Customer',
      accessor: 'name',
      render: (c) => (
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-brand-50 text-brand-700 font-bold text-xs flex items-center justify-center border border-brand-200 shrink-0">
            {c.getInitials ? c.getInitials() : c.name.substring(0, 2).toUpperCase()}
          </div>
          <div>
            <span className="font-semibold text-slate-900 block hover:text-brand-600 transition-colors">
              {c.name}
            </span>
            <span className="text-xs text-slate-400 font-mono">{c.id}</span>
          </div>
        </div>
      )
    },
    {
      header: 'Contact Info',
      accessor: 'email',
      render: (c) => (
        <div className="space-y-0.5 text-xs">
          <div className="flex items-center gap-1.5 text-slate-700">
            <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span>{c.email}</span>
          </div>
          <div className="flex items-center gap-1.5 text-slate-500">
            <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span>{c.phone}</span>
          </div>
        </div>
      )
    },
    {
      header: 'Company & City',
      accessor: 'company',
      render: (c) => (
        <div className="text-xs">
          <p className="font-medium text-slate-800">{c.company || '—'}</p>
          <p className="text-slate-400 flex items-center gap-1 mt-0.5">
            <MapPin className="w-3 h-3 text-slate-400" />
            {c.city || 'Kerala, India'}
          </p>
        </div>
      )
    },
    {
      header: 'Registration',
      accessor: 'createdAt',
      render: (c) => (
        <span className="text-xs text-slate-500">
          {formatDate(c.createdAt)}
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
        <div className="flex items-center justify-end gap-1" onClick={(e) => e.stopPropagation()}>
          <button
            onClick={() => setProfileCustomer(c)}
            className="p-1.5 text-slate-500 hover:text-brand-600 hover:bg-brand-50 rounded-lg transition-colors"
            title="View 360° Customer Profile"
          >
            <Eye className="w-4 h-4" />
          </button>
          <button
            onClick={() => {
              setEditingCustomer(c);
              setIsModalOpen(true);
            }}
            className="p-1.5 text-slate-500 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
            title="Edit Customer"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => setDeleteTarget(c)}
            className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
            title="Delete Customer"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6">
      {/* Top Header & Actions Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Customer Management</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage your accounts, view 360° history, interactions, and sales records.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            icon={Download}
            onClick={handleExport}
          >
            Export CSV
          </Button>
          <Button
            variant="primary"
            icon={Plus}
            onClick={() => {
              setEditingCustomer(null);
              setIsModalOpen(true);
            }}
          >
            Add Customer
          </Button>
        </div>
      </div>

      {/* Search and Filters Bar */}
      <Card className="p-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          <SearchBar
            value={localSearch}
            onChange={setLocalSearch}
            placeholder="Search by customer name, email, phone, city..."
          />

          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-500 flex items-center gap-1">
              <Filter className="w-3.5 h-3.5" />
              Status:
            </span>
            <div className="flex bg-slate-100 p-0.5 rounded-lg text-xs">
              {['All', 'Active', 'Lead', 'Inactive'].map((status) => (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className={`px-3 py-1.5 rounded-md font-medium transition-all ${
                    statusFilter === status
                      ? 'bg-white text-slate-900 shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>
        </div>
      </Card>

      {/* Customer Table */}
      <Table
        data={filteredCustomers}
        columns={columns}
        onRowClick={(c) => setProfileCustomer(c)}
        emptyMessage="No customers match your criteria."
      />

      {/* Add / Edit Customer Modal */}
      <CustomerModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingCustomer(null);
        }}
        onSave={handleSaveCustomer}
        initialData={editingCustomer}
      />

      {/* 360-Degree Customer Profile View Modal */}
      <CustomerProfileModal
        isOpen={!!profileCustomer}
        onClose={() => setProfileCustomer(null)}
        customer={profileCustomer}
        onEdit={(c) => {
          setEditingCustomer(c);
          setIsModalOpen(true);
        }}
      />

      {/* Delete Confirmation Dialog */}
      <ConfirmModal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete Customer"
        message={`Are you sure you want to delete "${deleteTarget?.name}"? All associated sales records and touchpoints will remain in history.`}
        confirmText="Yes, Delete Customer"
      />
    </div>
  );
}
