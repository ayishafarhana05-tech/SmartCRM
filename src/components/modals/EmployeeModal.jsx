import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';

export function EmployeeModal({ isOpen, onClose, onSave, initialData }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    department: 'Sales',
    designation: 'Sales Executive',
    status: 'Active',
    hireDate: new Date().toISOString().split('T')[0]
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        email: initialData.email || '',
        phone: initialData.phone || '',
        department: initialData.department || 'Sales',
        designation: initialData.designation || 'Sales Executive',
        status: initialData.status || 'Active',
        hireDate: initialData.hireDate || new Date().toISOString().split('T')[0]
      });
    } else {
      setFormData({
        name: '',
        email: '',
        phone: '',
        department: 'Sales',
        designation: 'Sales Executive',
        status: 'Active',
        hireDate: new Date().toISOString().split('T')[0]
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

    if (!formData.name.trim()) newErrors.name = 'Employee name is required';
    if (!formData.email.trim() || !formData.email.includes('@')) newErrors.email = 'Valid email is required';
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
    if (!formData.designation.trim()) newErrors.designation = 'Designation is required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSave(formData);
    onClose();
  };

  const departments = ['Sales', 'Customer Support', 'Technical', 'Marketing', 'Operations'];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialData ? 'Edit Employee' : 'Add New Employee'}
      subtitle={initialData ? `Update profile for ${initialData.id}` : 'Onboard a new staff member'}
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSubmit}>
            {initialData ? 'Save Changes' : 'Add Employee'}
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
            Full Name *
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="e.g. Aaditya Kurian"
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
              placeholder="aaditya@smartcrm.io"
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
              placeholder="+91 98471 00101"
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
              Department
            </label>
            <select
              name="department"
              value={formData.department}
              onChange={handleChange}
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-2 ring-brand-200 focus:border-brand-500"
            >
              {departments.map(d => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Job Designation *
            </label>
            <input
              type="text"
              name="designation"
              value={formData.designation}
              onChange={handleChange}
              placeholder="e.g. Senior Account Exec"
              className={`w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 ${
                errors.designation ? 'border-rose-300 ring-rose-200' : 'border-slate-300 ring-brand-200 focus:border-brand-500'
              }`}
            />
            {errors.designation && <p className="text-xs text-rose-500 mt-1">{errors.designation}</p>}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Employment Status
            </label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-2 ring-brand-200 focus:border-brand-500"
            >
              <option value="Active">Active</option>
              <option value="On Leave">On Leave</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Hire Date
            </label>
            <input
              type="date"
              name="hireDate"
              value={formData.hireDate}
              onChange={handleChange}
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 ring-brand-200 focus:border-brand-500"
            />
          </div>
        </div>
      </form>
    </Modal>
  );
}
