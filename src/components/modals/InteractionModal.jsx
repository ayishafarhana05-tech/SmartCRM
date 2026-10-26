import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { useCRM } from '../../context/CRMContext';

export function InteractionModal({ isOpen, onClose, onSave, initialData }) {
  const { customers, employees } = useCRM();

  const [formData, setFormData] = useState({
    customerId: '',
    employeeId: '',
    type: 'Call',
    date: new Date().toISOString().slice(0, 16),
    notes: '',
    outcome: 'Follow-up Required',
    followUpDate: ''
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      setFormData({
        customerId: initialData.customerId || '',
        employeeId: initialData.employeeId || '',
        type: initialData.type || 'Call',
        date: initialData.date || new Date().toISOString().slice(0, 16),
        notes: initialData.notes || '',
        outcome: initialData.outcome || 'Follow-up Required',
        followUpDate: initialData.followUpDate || ''
      });
    } else {
      setFormData({
        customerId: customers[0]?.id || '',
        employeeId: employees[0]?.id || '',
        type: 'Call',
        date: new Date().toISOString().slice(0, 16),
        notes: '',
        outcome: 'Follow-up Required',
        followUpDate: ''
      });
    }
    setErrors({});
  }, [initialData, isOpen, customers, employees]);

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
    if (!formData.employeeId) newErrors.employeeId = 'Staff member is required';
    if (!formData.notes.trim()) newErrors.notes = 'Notes and minutes are required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSave(formData);
    onClose();
  };

  const types = ['Call', 'Email', 'Meeting', 'Demo', 'Note'];
  const outcomes = [
    'Follow-up Required',
    'Deal Closed',
    'Issue Resolved',
    'Information Provided',
    'No Answer',
    'Proposal Sent'
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialData ? 'Edit Interaction' : 'Log Customer Interaction'}
      subtitle={initialData ? `Update touchpoint ${initialData.id}` : 'Record a call, meeting, email or customer note'}
      size="md"
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSubmit}>
            {initialData ? 'Save Changes' : 'Log Interaction'}
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
            Customer *
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
            Staff Member / Attendant *
          </label>
          <select
            name="employeeId"
            value={formData.employeeId}
            onChange={handleChange}
            className={`w-full px-3 py-2 text-sm border rounded-lg bg-white focus:outline-none focus:ring-2 ${
              errors.employeeId ? 'border-rose-300 ring-rose-200' : 'border-slate-300 ring-brand-200 focus:border-brand-500'
            }`}
          >
            <option value="">Select Employee...</option>
            {employees.map(e => (
              <option key={e.id} value={e.id}>
                {e.name} ({e.department})
              </option>
            ))}
          </select>
          {errors.employeeId && <p className="text-xs text-rose-500 mt-1">{errors.employeeId}</p>}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Interaction Channel
            </label>
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-2 ring-brand-200 focus:border-brand-500"
            >
              {types.map(t => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Date & Time
            </label>
            <input
              type="datetime-local"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 ring-brand-200 focus:border-brand-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
            Interaction Notes & Discussion Summary *
          </label>
          <textarea
            name="notes"
            rows="3"
            value={formData.notes}
            onChange={handleChange}
            placeholder="Key discussion points, customer feedback, agreements reached..."
            className={`w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 ${
              errors.notes ? 'border-rose-300 ring-rose-200' : 'border-slate-300 ring-brand-200 focus:border-brand-500'
            }`}
          />
          {errors.notes && <p className="text-xs text-rose-500 mt-1">{errors.notes}</p>}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Outcome
            </label>
            <select
              name="outcome"
              value={formData.outcome}
              onChange={handleChange}
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-2 ring-brand-200 focus:border-brand-500"
            >
              {outcomes.map(o => (
                <option key={o} value={o}>{o}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Follow-Up Date
            </label>
            <input
              type="date"
              name="followUpDate"
              value={formData.followUpDate}
              onChange={handleChange}
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 ring-brand-200 focus:border-brand-500"
            />
          </div>
        </div>
      </form>
    </Modal>
  );
}
