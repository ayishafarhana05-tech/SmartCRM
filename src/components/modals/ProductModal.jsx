import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';

export function ProductModal({ isOpen, onClose, onSave, initialData }) {
  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    category: 'Software',
    description: '',
    price: 9999,
    stockQuantity: 25
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        sku: initialData.sku || '',
        category: initialData.category || 'Software',
        description: initialData.description || '',
        price: initialData.price || 0,
        stockQuantity: initialData.stockQuantity !== undefined ? initialData.stockQuantity : 0
      });
    } else {
      setFormData({
        name: '',
        sku: `SKU-${Math.floor(1000 + Math.random() * 9000)}`,
        category: 'Software',
        description: '',
        price: 9999,
        stockQuantity: 25
      });
    }
    setErrors({});
  }, [initialData, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = 'Product name is required';
    if (!formData.sku.trim()) newErrors.sku = 'SKU is required';
    if (isNaN(formData.price) || Number(formData.price) < 0) newErrors.price = 'Valid price is required';
    if (isNaN(formData.stockQuantity) || Number(formData.stockQuantity) < 0) newErrors.stockQuantity = 'Valid stock is required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSave({
      ...formData,
      price: Number(formData.price),
      stockQuantity: Number(formData.stockQuantity)
    });
    onClose();
  };

  const categories = ['Software', 'Cloud Services', 'Hardware', 'Consulting', 'Maintenance', 'Security'];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialData ? 'Edit Product' : 'Add New Product'}
      subtitle={initialData ? `Update specifications for ${initialData.id}` : 'Catalog a new solution or item'}
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSubmit}>
            {initialData ? 'Save Changes' : 'Add Product'}
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
            Product / Service Name *
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="e.g. SmartCRM Cloud Enterprise"
            className={`w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 ${
              errors.name ? 'border-rose-300 ring-rose-200' : 'border-slate-300 ring-brand-200 focus:border-brand-500'
            }`}
          />
          {errors.name && <p className="text-xs text-rose-500 mt-1">{errors.name}</p>}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              SKU Code *
            </label>
            <input
              type="text"
              name="sku"
              value={formData.sku}
              onChange={handleChange}
              placeholder="SKU-CRM-100"
              className={`w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 ${
                errors.sku ? 'border-rose-300 ring-rose-200' : 'border-slate-300 ring-brand-200 focus:border-brand-500'
              }`}
            />
            {errors.sku && <p className="text-xs text-rose-500 mt-1">{errors.sku}</p>}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Category
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-2 ring-brand-200 focus:border-brand-500"
            >
              {categories.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Unit Price (₹ INR) *
            </label>
            <input
              type="number"
              name="price"
              min="0"
              step="1"
              value={formData.price}
              onChange={handleChange}
              className={`w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 ${
                errors.price ? 'border-rose-300 ring-rose-200' : 'border-slate-300 ring-brand-200 focus:border-brand-500'
              }`}
            />
            {errors.price && <p className="text-xs text-rose-500 mt-1">{errors.price}</p>}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Initial Stock / Available Licenses *
            </label>
            <input
              type="number"
              name="stockQuantity"
              min="0"
              value={formData.stockQuantity}
              onChange={handleChange}
              className={`w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 ${
                errors.stockQuantity ? 'border-rose-300 ring-rose-200' : 'border-slate-300 ring-brand-200 focus:border-brand-500'
              }`}
            />
            {errors.stockQuantity && <p className="text-xs text-rose-500 mt-1">{errors.stockQuantity}</p>}
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
            Product Description
          </label>
          <textarea
            name="description"
            rows="3"
            value={formData.description}
            onChange={handleChange}
            placeholder="Details, specifications and key deliverables..."
            className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 ring-brand-200 focus:border-brand-500"
          />
        </div>
      </form>
    </Modal>
  );
}
