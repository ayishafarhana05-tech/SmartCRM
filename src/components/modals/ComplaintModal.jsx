import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { useCRM } from '../../context/CRMContext';

export function ComplaintModal({ isOpen, onClose, onSave, initialData }) {
  const { customers } = useCRM();

  const [formData, setFormData] = useState({
    customerId: '',
    title: '',
    description: '',
    category: 'Service Quality',
    date: new Date().toISOString().split('T')[0],
    priority: 'Medium',
    status: 'Pending',
    resolutionNotes: ''
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      setFormData({
        customerId: initialData.customerId || '',
        title: initialData.title || '',
        description: initialData.description || '',
        category: initialData.category || 'Service Quality',
        date: initialData.date || new Date().toISOString().split('T')[0],
        priority: initialData.priority || 'Medium',
        status: initialData.status || 'Pending',
        resolutionNotes: initialData.resolutionNotes || ''
      });
    } else {
      setFormData({
        customerId: customers[0]?.id || '',
        title: '',
        description: '',
        category: 'Service Quality',
        date: new Date().toISOString().split('T')[0],
        priority: 'Medium',
        status: 'Pending',
        resolutionNotes: ''
      });
    }
    setErrors({});
  }, [initialData, isOpen, customers]);

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

    if (!formData.customerId) newErrors.customerId = 'Customer is required';
    if (!formData.title.trim()) newErrors.title = 'Title / summary is required';
    if (!formData.description.trim()) newErrors.description = 'Complaint description is required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSave(formData);
    onClose();
  };

  const categories = ['Billing', 'Technical', 'Service Quality', 'Delivery', 'Product Defect', 'Contractual'];
  const priorities = ['Low', 'Medium', 'High', 'Urgent'];
  const statuses = ['Pending', 'In Progress', 'Resolved'];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialData ? 'Update Complaint' : 'Register Customer Complaint'}
      subtitle={initialData ? `Record: ${initialData.id}` : 'Log an escalated grievance or issue'}
      size="md"
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSubmit}>
            {initialData ? 'Save Changes' : 'Register Complaint'}
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
            Affected Customer *
          </label>
          <select
            name="customerId"
            value={formData.customerId}
            onChange={handleChange}
            className={`w-full px-3 py-2 text-sm border rounded-lg bg-white focus:outline-none focus:ring-2 ${
              errors.customerId ? 'border-rose-300 ring-rose-200' : 'border-slate-300 ring-brand-200 focus:border-brand-500'
            }`}
          >
            <option value="">Select Customer...</option>
            {customers.map(c => (
              <option key={c.id} value={c.id}>
                {c.name} {c.company ? `(${c.company})` : ''}
              </option>
            ))}
          </select>
          {errors.customerId && <p className="text-xs text-rose-500 mt-1">{errors.customerId}</p>}
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
            Grievance Subject / Title *
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Brief summary of the issue..."
            className={`w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 ${
              errors.title ? 'border-rose-300 ring-rose-200' : 'border-slate-300 ring-brand-200 focus:border-brand-500'
            }`}
          />
          {errors.title && <p className="text-xs text-rose-500 mt-1">{errors.title}</p>}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
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

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Priority
            </label>
            <select
              name="priority"
              value={formData.priority}
              onChange={handleChange}
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-2 ring-brand-200 focus:border-brand-500"
            >
              {priorities.map(p => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Status
            </label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-2 ring-brand-200 focus:border-brand-500"
            >
              {statuses.map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
            Detailed Issue Description *
          </label>
          <textarea
            name="description"
            rows="3"
            value={formData.description}
            onChange={handleChange}
            placeholder="Explain the complaint in detail..."
            className={`w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 ${
              errors.description ? 'border-rose-300 ring-rose-200' : 'border-slate-300 ring-brand-200 focus:border-brand-500'
            }`}
          />
          {errors.description && <p className="text-xs text-rose-500 mt-1">{errors.description}</p>}
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
            Resolution Notes / Corrective Actions
          </label>
          <textarea
            name="resolutionNotes"
            rows="2"
            value={formData.resolutionNotes}
            onChange={handleChange}
            placeholder="Action taken by support or billing to resolve the complaint..."
            className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 ring-brand-200 focus:border-brand-500"
          />
        </div>
      </form>
    </Modal>
  );
}
