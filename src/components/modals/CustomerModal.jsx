import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';

export function CustomerModal({ isOpen, onClose, onSave, initialData }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    address: '',
    city: 'Kochi',
    status: 'Active'
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        email: initialData.email || '',
        phone: initialData.phone || '',
        company: initialData.company || '',
        address: initialData.address || '',
        city: initialData.city || 'Kochi',
        status: initialData.status || 'Active'
      });
    } else {
      setFormData({
        name: '',
        email: '',
        phone: '',
        company: '',
        address: '',
        city: 'Kochi',
        status: 'Active'
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

    if (!formData.name.trim()) newErrors.name = 'Full name is required';
    if (!formData.email.trim() || !formData.email.includes('@')) newErrors.email = 'Valid email is required';
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSave(formData);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialData ? 'Edit Customer' : 'Add New Customer'}
      subtitle={initialData ? `Update record for ${initialData.id}` : 'Create a new customer profile'}
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSubmit}>
            {initialData ? 'Save Changes' : 'Create Customer'}
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
            Customer Name *
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="e.g. Dr. Ananya Nair"
            className={`w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 ${
              errors.name ? 'border-rose-300 ring-rose-200' : 'border-slate-300 ring-brand-200 focus:border-brand-500'
            }`}
          />
          {errors.name && <p className="text-xs text-rose-500 mt-1">{errors.name}</p>}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Email Address *
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="name@company.com"
              className={`w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 ${
                errors.email ? 'border-rose-300 ring-rose-200' : 'border-slate-300 ring-brand-200 focus:border-brand-500'
              }`}
            />
            {errors.email && <p className="text-xs text-rose-500 mt-1">{errors.email}</p>}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Phone Number *
            </label>
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="+91 98470 12345"
              className={`w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 ${
                errors.phone ? 'border-rose-300 ring-rose-200' : 'border-slate-300 ring-brand-200 focus:border-brand-500'
              }`}
            />
            {errors.phone && <p className="text-xs text-rose-500 mt-1">{errors.phone}</p>}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Company / Organization
            </label>
            <input
              type="text"
              name="company"
              value={formData.company}
              onChange={handleChange}
              placeholder="e.g. KeralaMed Healthcare Ltd"
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 ring-brand-200 focus:border-brand-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              City / Location
            </label>
            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleChange}
              placeholder="e.g. Kochi"
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 ring-brand-200 focus:border-brand-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
            Physical Address
          </label>
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
            placeholder="Office / Street address"
            className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 ring-brand-200 focus:border-brand-500"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
            Lifecycle Status
          </label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-2 ring-brand-200 focus:border-brand-500"
          >
            <option value="Active">Active Customer</option>
            <option value="Lead">Prospective Lead</option>
            <option value="Inactive">Inactive / Past</option>
          </select>
        </div>
      </form>
    </Modal>
  );
}
