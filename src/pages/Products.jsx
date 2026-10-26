import React, { useState, useMemo } from 'react';
import {
  ShoppingBag,
  Plus,
  PackageCheck,
  AlertTriangle,
  XCircle,
  Filter,
  Edit2,
  Trash2,
  PlusCircle
} from 'lucide-react';
import { Button } from '../components/common/Button';
import { Card } from '../components/common/Card';
import { SearchBar } from '../components/common/SearchBar';
import { Table } from '../components/common/Table';
import { ConfirmModal } from '../components/common/ConfirmModal';
import { ProductModal } from '../components/modals/ProductModal';
import { useCRM } from '../context/CRMContext';
import { useToast } from '../context/ToastContext';
import { formatCurrency, getStatusBadgeColor } from '../utils/formatters';

export function Products({ globalSearch }) {
  const { products, addProduct, updateProduct, deleteProduct } = useCRM();
  const { showToast } = useToast();

  const [localSearch, setLocalSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const activeSearch = globalSearch || localSearch;

  const categories = ['All', 'Software', 'Cloud Services', 'Hardware', 'Consulting', 'Maintenance', 'Security'];

  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const matchesSearch =
        p.name.toLowerCase().includes(activeSearch.toLowerCase()) ||
        p.sku.toLowerCase().includes(activeSearch.toLowerCase()) ||
        p.description.toLowerCase().includes(activeSearch.toLowerCase()) ||
        p.id.toLowerCase().includes(activeSearch.toLowerCase());

      const matchesCat = categoryFilter === 'All' || p.category === categoryFilter;

      return matchesSearch && matchesCat;
    });
  }, [products, activeSearch, categoryFilter]);

  const handleSave = (formData) => {
    try {
      if (editingProduct) {
        updateProduct(editingProduct.id, formData);
        showToast(`Product ${formData.name} updated successfully!`, 'success');
      } else {
        const created = addProduct(formData);
        showToast(`Product ${created.name} cataloged!`, 'success');
      }
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const handleQuickRestock = (product) => {
    const qty = prompt(`Enter restock units to add to "${product.name}":`, "10");
    if (qty && !isNaN(qty) && Number(qty) > 0) {
      updateProduct(product.id, { stockQuantity: product.stockQuantity + Number(qty) });
      showToast(`Added ${qty} units to stock for ${product.name}!`, 'success');
    }
  };

  const handleDeleteConfirm = () => {
    if (!deleteTarget) return;
    deleteProduct(deleteTarget.id);
    showToast(`Product ${deleteTarget.name} removed from catalog!`, 'info');
    setDeleteTarget(null);
  };

  const columns = [
    {
      header: 'Product / Solution',
      accessor: 'name',
      render: (p) => (
        <div>
          <span className="font-semibold text-sm text-slate-900 block">{p.name}</span>
          <span className="text-xs text-slate-400 font-mono">
            {p.id} • {p.sku}
          </span>
        </div>
      )
    },
    {
      header: 'Category',
      accessor: 'category',
      render: (p) => (
        <span className="px-2.5 py-0.5 rounded-md text-xs font-medium bg-slate-100 text-slate-700">
          {p.category}
        </span>
      )
    },
    {
      header: 'Description',
      accessor: 'description',
      render: (p) => (
        <p className="text-xs text-slate-600 line-clamp-2 max-w-sm">{p.description || '—'}</p>
      )
    },
    {
      header: 'Unit Price',
      accessor: 'price',
      align: 'right',
      render: (p) => (
        <span className="font-bold text-sm text-slate-900">
          {formatCurrency(p.price)}
        </span>
      )
    },
    {
      header: 'Stock Quantity',
      accessor: 'stockQuantity',
      align: 'center',
      render: (p) => (
        <div className="flex items-center justify-center gap-1.5">
          <span className="font-semibold text-slate-800 text-xs">
            {p.stockQuantity} units
          </span>
          <button
            onClick={() => handleQuickRestock(p)}
            className="text-brand-600 hover:text-brand-700 p-0.5 rounded"
            title="Quick Restock"
          >
            <PlusCircle className="w-3.5 h-3.5" />
          </button>
        </div>
      )
    },
    {
      header: 'Availability',
      accessor: 'stockQuantity',
      align: 'center',
      render: (p) => {
        const status = p.getStockStatus ? p.getStockStatus() : p.stockQuantity <= 0 ? 'Out of Stock' : p.stockQuantity < 10 ? 'Low Stock' : 'In Stock';
        return (
          <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${getStatusBadgeColor(status)}`}>
            {status}
          </span>
        );
      }
    },
    {
      header: 'Actions',
      accessor: 'id',
      align: 'right',
      render: (p) => (
        <div className="flex items-center justify-end gap-1">
          <button
            onClick={() => {
              setEditingProduct(p);
              setIsModalOpen(true);
            }}
            className="p-1.5 text-slate-500 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
            title="Edit Product"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => setDeleteTarget(p)}
            className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
            title="Delete Product"
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
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Product & Service Catalog</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage SaaS subscriptions, software licenses, AMC contracts, and inventory.
          </p>
        </div>

        <Button
          variant="primary"
          icon={Plus}
          onClick={() => {
            setEditingProduct(null);
            setIsModalOpen(true);
          }}
        >
          Add Product
        </Button>
      </div>

      {/* Filter and Search */}
      <Card className="p-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          <SearchBar
            value={localSearch}
            onChange={setLocalSearch}
            placeholder="Search by product name, SKU, keywords..."
          />

          <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
            <span className="text-xs font-semibold text-slate-500 flex items-center gap-1 shrink-0">
              <Filter className="w-3.5 h-3.5" />
              Category:
            </span>
            <div className="flex bg-slate-100 p-0.5 rounded-lg text-xs shrink-0">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategoryFilter(cat)}
                  className={`px-3 py-1.5 rounded-md font-medium transition-all whitespace-nowrap ${
                    categoryFilter === cat
                      ? 'bg-white text-slate-900 shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>
      </Card>

      {/* Table */}
      <Table
        data={filteredProducts}
        columns={columns}
        emptyMessage="No products match your criteria."
      />

      {/* Modal */}
      <ProductModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingProduct(null);
        }}
        onSave={handleSave}
        initialData={editingProduct}
      />

      {/* Delete Confirmation */}
      <ConfirmModal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete Product"
        message={`Are you sure you want to remove product "${deleteTarget?.name}"?`}
        confirmText="Yes, Delete Product"
      />
    </div>
  );
}
