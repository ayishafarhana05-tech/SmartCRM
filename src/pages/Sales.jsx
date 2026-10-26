import React, { useState, useMemo } from 'react';
import {
  TrendingUp,
  Plus,
  Download,
  Filter,
  Edit2,
  Trash2,
  Receipt,
  CreditCard,
  Building,
  UserCheck,
  Package
} from 'lucide-react';
import { Button } from '../components/common/Button';
import { Card } from '../components/common/Card';
import { SearchBar } from '../components/common/SearchBar';
import { Table } from '../components/common/Table';
import { ConfirmModal } from '../components/common/ConfirmModal';
import { SaleModal } from '../components/modals/SaleModal';
import { useCRM } from '../context/CRMContext';
import { useToast } from '../context/ToastContext';
import { formatCurrency, formatDate, getStatusBadgeColor } from '../utils/formatters';
import { exportToCSV } from '../utils/exportCsv';

export function SalesPage({ globalSearch }) {
  const { sales, addSale, updateSale, deleteSale, customers, employees, products } = useCRM();
  const { showToast } = useToast();

  const [localSearch, setLocalSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSale, setEditingSale] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const activeSearch = globalSearch || localSearch;

  const paymentStatuses = ['All', 'Paid', 'Pending', 'Refunded'];

  const filteredSales = useMemo(() => {
    return sales.filter(s => {
      const cust = customers.find(c => c.id === s.customerId);
      const emp = employees.find(e => e.id === s.employeeId);
      const prod = products.find(p => p.id === s.productId);

      const custName = cust ? cust.name : '';
      const empName = emp ? emp.name : '';
      const prodName = prod ? prod.name : '';

      const matchesSearch =
        custName.toLowerCase().includes(activeSearch.toLowerCase()) ||
        empName.toLowerCase().includes(activeSearch.toLowerCase()) ||
        prodName.toLowerCase().includes(activeSearch.toLowerCase()) ||
        s.id.toLowerCase().includes(activeSearch.toLowerCase()) ||
        s.paymentMethod.toLowerCase().includes(activeSearch.toLowerCase());

      const matchesStatus = statusFilter === 'All' || s.paymentStatus === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [sales, activeSearch, statusFilter, customers, employees, products]);

  const summary = useMemo(() => {
    const totalAmount = filteredSales.reduce((sum, s) => sum + (Number(s.totalAmount) || 0), 0);
    const paidAmount = filteredSales
      .filter(s => s.paymentStatus === 'Paid')
      .reduce((sum, s) => sum + (Number(s.totalAmount) || 0), 0);
    const pendingAmount = filteredSales
      .filter(s => s.paymentStatus === 'Pending')
      .reduce((sum, s) => sum + (Number(s.totalAmount) || 0), 0);

    return { totalAmount, paidAmount, pendingAmount, count: filteredSales.length };
  }, [filteredSales]);

  const handleSave = (formData) => {
    try {
      if (editingSale) {
        updateSale(editingSale.id, formData);
        showToast(`Invoice ${editingSale.id} updated!`, 'success');
      } else {
        const created = addSale(formData);
        showToast(`Invoice ${created.id} recorded and inventory updated!`, 'success');
      }
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const handleDeleteConfirm = () => {
    if (!deleteTarget) return;
    deleteSale(deleteTarget.id);
    showToast(`Invoice ${deleteTarget.id} removed!`, 'info');
    setDeleteTarget(null);
  };

  const handleExport = () => {
    const exportData = filteredSales.map(s => {
      const cust = customers.find(c => c.id === s.customerId);
      const emp = employees.find(e => e.id === s.employeeId);
      const prod = products.find(p => p.id === s.productId);
      return {
        InvoiceID: s.id,
        Date: s.date,
        Customer: cust ? cust.name : s.customerId,
        SalesRep: emp ? emp.name : s.employeeId,
        Product: prod ? prod.name : s.productId,
        Quantity: s.quantity,
        UnitPrice: s.unitPrice,
        DiscountPercent: s.discount,
        TotalAmount: s.totalAmount,
        PaymentStatus: s.paymentStatus,
        PaymentMethod: s.paymentMethod
      };
    });

    exportToCSV('SmartCRM_Sales_Invoices', exportData, {
      InvoiceID: 'Invoice #',
      Date: 'Date',
      Customer: 'Customer',
      SalesRep: 'Sales Rep',
      Product: 'Product',
      Quantity: 'Quantity',
      UnitPrice: 'Unit Price (INR)',
      DiscountPercent: 'Discount %',
      TotalAmount: 'Total Amount (INR)',
      PaymentStatus: 'Status',
      PaymentMethod: 'Payment Mode'
    });
    showToast('Sales invoices exported to CSV!', 'success');
  };

  const columns = [
    {
      header: 'Invoice #',
      accessor: 'id',
      render: (s) => (
        <div>
          <span className="font-bold text-xs text-brand-600 font-mono block">{s.id}</span>
          <span className="text-[11px] text-slate-400">{formatDate(s.date)}</span>
        </div>
      )
    },
    {
      header: 'Customer',
      accessor: 'customerId',
      render: (s) => {
        const cust = s.getCustomer ? s.getCustomer(customers) : customers.find(c => c.id === s.customerId);
        return (
          <div>
            <p className="font-semibold text-xs text-slate-900">{cust ? cust.name : s.customerId}</p>
            <p className="text-[11px] text-slate-400">{cust?.company || 'Direct Client'}</p>
          </div>
        );
      }
    },
    {
      header: 'Product / Solution',
      accessor: 'productId',
      render: (s) => {
        const prod = s.getProduct ? s.getProduct(products) : products.find(p => p.id === s.productId);
        return (
          <div>
            <p className="font-medium text-xs text-slate-800">{prod ? prod.name : s.productId}</p>
            <p className="text-[11px] text-slate-400">
              {s.quantity} units @ {formatCurrency(s.unitPrice)}
              {s.discount > 0 ? ` (${s.discount}% off)` : ''}
            </p>
          </div>
        );
      }
    },
    {
      header: 'Sales Rep',
      accessor: 'employeeId',
      render: (s) => {
        const emp = s.getEmployee ? s.getEmployee(employees) : employees.find(e => e.id === s.employeeId);
        return (
          <span className="text-xs text-slate-600 font-medium">
            {emp ? emp.name : s.employeeId}
          </span>
        );
      }
    },
    {
      header: 'Payment Method',
      accessor: 'paymentMethod',
      render: (s) => (
        <span className="text-xs text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
          {s.paymentMethod}
        </span>
      )
    },
    {
      header: 'Total Amount',
      accessor: 'totalAmount',
      align: 'right',
      render: (s) => (
        <span className="font-bold text-sm text-slate-900">
          {formatCurrency(s.totalAmount)}
        </span>
      )
    },
    {
      header: 'Status',
      accessor: 'paymentStatus',
      align: 'center',
      render: (s) => (
        <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${getStatusBadgeColor(s.paymentStatus)}`}>
          {s.paymentStatus}
        </span>
      )
    },
    {
      header: 'Actions',
      accessor: 'id',
      align: 'right',
      render: (s) => (
        <div className="flex items-center justify-end gap-1">
          <button
            onClick={() => {
              setEditingSale(s);
              setIsModalOpen(true);
            }}
            className="p-1.5 text-slate-500 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
            title="Edit Invoice"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => setDeleteTarget(s)}
            className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
            title="Delete Invoice"
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
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Sales & Billing Management</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Track transactions, revenue generation, payment status, and invoices.
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
              setEditingSale(null);
              setIsModalOpen(true);
            }}
          >
            Record Sale
          </Button>
        </div>
      </div>

      {/* Financial Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl border border-slate-200 bg-white shadow-sm">
          <p className="text-xs font-semibold uppercase text-slate-400">Total Billed</p>
          <h4 className="text-2xl font-bold text-slate-900 mt-1">{formatCurrency(summary.totalAmount)}</h4>
          <p className="text-xs text-slate-500 mt-0.5">{summary.count} transactions</p>
        </div>

        <div className="p-4 rounded-xl border border-emerald-100 bg-emerald-50/40 shadow-sm">
          <p className="text-xs font-semibold uppercase text-emerald-700">Settled & Paid</p>
          <h4 className="text-2xl font-bold text-emerald-700 mt-1">{formatCurrency(summary.paidAmount)}</h4>
          <p className="text-xs text-emerald-600 mt-0.5">Cleared in account</p>
        </div>

        <div className="p-4 rounded-xl border border-amber-100 bg-amber-50/40 shadow-sm">
          <p className="text-xs font-semibold uppercase text-amber-700">Pending Receivables</p>
          <h4 className="text-2xl font-bold text-amber-700 mt-1">{formatCurrency(summary.pendingAmount)}</h4>
          <p className="text-xs text-amber-600 mt-0.5">Awaiting customer payment</p>
        </div>
      </div>

      {/* Filter and Search */}
      <Card className="p-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          <SearchBar
            value={localSearch}
            onChange={setLocalSearch}
            placeholder="Search by invoice #, customer, sales rep, product..."
          />

          <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
            <span className="text-xs font-semibold text-slate-500 flex items-center gap-1 shrink-0">
              <Filter className="w-3.5 h-3.5" />
              Payment:
            </span>
            <div className="flex bg-slate-100 p-0.5 rounded-lg text-xs shrink-0">
              {paymentStatuses.map((st) => (
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
      </Card>

      {/* Table */}
      <Table
        data={filteredSales}
        columns={columns}
        emptyMessage="No sales transactions found matching filters."
      />

      {/* Modal */}
      <SaleModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingSale(null);
        }}
        onSave={handleSave}
        initialData={editingSale}
      />

      {/* Delete Confirmation */}
      <ConfirmModal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete Sale Invoice"
        message={`Are you sure you want to delete invoice ${deleteTarget?.id}? Note: inventory stock will not be automatically reverted.`}
        confirmText="Yes, Delete Invoice"
      />
    </div>
  );
}
