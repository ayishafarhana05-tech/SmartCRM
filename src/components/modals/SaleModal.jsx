import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { useCRM } from '../../context/CRMContext';
import { formatCurrency } from '../../utils/formatters';

export function SaleModal({ isOpen, onClose, onSave, initialData }) {
  const { customers, employees, products } = useCRM();

  const [formData, setFormData] = useState({
    customerId: '',
    employeeId: '',
    productId: '',
    date: new Date().toISOString().split('T')[0],
    quantity: 1,
    unitPrice: 0,
    discount: 0,
    paymentStatus: 'Paid',
    paymentMethod: 'Bank Transfer',
    notes: ''
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      setFormData({
        customerId: initialData.customerId || '',
        employeeId: initialData.employeeId || '',
        productId: initialData.productId || '',
        date: initialData.date || new Date().toISOString().split('T')[0],
        quantity: initialData.quantity || 1,
        unitPrice: initialData.unitPrice || 0,
        discount: initialData.discount || 0,
        paymentStatus: initialData.paymentStatus || 'Paid',
        paymentMethod: initialData.paymentMethod || 'Bank Transfer',
        notes: initialData.notes || ''
      });
    } else {
      const defaultProd = products[0];
      setFormData({
        customerId: customers[0]?.id || '',
        employeeId: employees[0]?.id || '',
        productId: defaultProd?.id || '',
        date: new Date().toISOString().split('T')[0],
        quantity: 1,
        unitPrice: defaultProd ? defaultProd.price : 0,
        discount: 0,
        paymentStatus: 'Paid',
        paymentMethod: 'Bank Transfer',
        notes: ''
      });
    }
    setErrors({});
  }, [initialData, isOpen, customers, employees, products]);

  // When product changes, auto-populate unit price
  const handleProductChange = (e) => {
    const prodId = e.target.value;
    const selectedProd = products.find(p => p.id === prodId);
    setFormData(prev => ({
      ...prev,
      productId: prodId,
      unitPrice: selectedProd ? selectedProd.price : prev.unitPrice
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  // Dynamic automatic calculation of total amount
  const gross = (Number(formData.quantity) || 0) * (Number(formData.unitPrice) || 0);
  const discountAmt = gross * ((Number(formData.discount) || 0) / 100);
  const calculatedTotal = Math.max(0, Math.round((gross - discountAmt) * 100) / 100);

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!formData.customerId) newErrors.customerId = 'Customer is required';
    if (!formData.employeeId) newErrors.employeeId = 'Employee representative is required';
    if (!formData.productId) newErrors.productId = 'Product is required';
    if (Number(formData.quantity) <= 0) newErrors.quantity = 'Quantity must be at least 1';
    if (Number(formData.unitPrice) <= 0) newErrors.unitPrice = 'Unit price must be positive';

    // Check inventory availability
    const selectedProduct = products.find(p => p.id === formData.productId);
    if (!initialData && selectedProduct && selectedProduct.stockQuantity < Number(formData.quantity)) {
      newErrors.quantity = `Only ${selectedProduct.stockQuantity} units in stock!`;
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSave({
      ...formData,
      quantity: Number(formData.quantity),
      unitPrice: Number(formData.unitPrice),
      discount: Number(formData.discount),
      totalAmount: calculatedTotal
    });
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialData ? 'Edit Sales Invoice' : 'Record New Sale'}
      subtitle={initialData ? `Update transaction ${initialData.id}` : 'Create a sales invoice and deduct stock'}
      size="lg"
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSubmit}>
            {initialData ? 'Save Changes' : 'Record Transaction'}
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
              Sales Representative *
            </label>
            <select
              name="employeeId"
              value={formData.employeeId}
              onChange={handleChange}
              className={`w-full px-3 py-2 text-sm border rounded-lg bg-white focus:outline-none focus:ring-2 ${
                errors.employeeId ? 'border-rose-300 ring-rose-200' : 'border-slate-300 ring-brand-200 focus:border-brand-500'
              }`}
            >
              <option value="">Select Staff...</option>
              {employees.map(e => (
                <option key={e.id} value={e.id}>
                  {e.name} — {e.designation} ({e.department})
                </option>
              ))}
            </select>
            {errors.employeeId && <p className="text-xs text-rose-500 mt-1">{errors.employeeId}</p>}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Product / Service *
            </label>
            <select
              name="productId"
              value={formData.productId}
              onChange={handleProductChange}
              className={`w-full px-3 py-2 text-sm border rounded-lg bg-white focus:outline-none focus:ring-2 ${
                errors.productId ? 'border-rose-300 ring-rose-200' : 'border-slate-300 ring-brand-200 focus:border-brand-500'
              }`}
            >
              <option value="">Select Product...</option>
              {products.map(p => (
                <option key={p.id} value={p.id}>
                  {p.name} (Stock: {p.stockQuantity} | ₹{p.price.toLocaleString('en-IN')})
                </option>
              ))}
            </select>
            {errors.productId && <p className="text-xs text-rose-500 mt-1">{errors.productId}</p>}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Transaction Date
            </label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 ring-brand-200 focus:border-brand-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Quantity *
            </label>
            <input
              type="number"
              name="quantity"
              min="1"
              value={formData.quantity}
              onChange={handleChange}
              className={`w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 ${
                errors.quantity ? 'border-rose-300 ring-rose-200' : 'border-slate-300 ring-brand-200 focus:border-brand-500'
              }`}
            />
            {errors.quantity && <p className="text-xs text-rose-500 mt-1">{errors.quantity}</p>}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Unit Price (₹) *
            </label>
            <input
              type="number"
              name="unitPrice"
              min="0"
              value={formData.unitPrice}
              onChange={handleChange}
              className={`w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 ${
                errors.unitPrice ? 'border-rose-300 ring-rose-200' : 'border-slate-300 ring-brand-200 focus:border-brand-500'
              }`}
            />
            {errors.unitPrice && <p className="text-xs text-rose-500 mt-1">{errors.unitPrice}</p>}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Discount (%)
            </label>
            <input
              type="number"
              name="discount"
              min="0"
              max="100"
              value={formData.discount}
              onChange={handleChange}
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 ring-brand-200 focus:border-brand-500"
            />
          </div>
        </div>

        {/* Real-time Automatic Total Calculation Display */}
        <div className="p-4 rounded-xl bg-gradient-to-r from-brand-50 to-accent-50 border border-brand-100 flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-brand-700 uppercase tracking-wider">
              Auto-Calculated Total
            </p>
            <p className="text-xs text-slate-500">
              {formData.quantity} qty × {formatCurrency(formData.unitPrice)}
              {formData.discount > 0 ? ` with ${formData.discount}% discount` : ''}
            </p>
          </div>
          <div className="text-2xl font-bold text-brand-700">
            {formatCurrency(calculatedTotal)}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Payment Status
            </label>
            <select
              name="paymentStatus"
              value={formData.paymentStatus}
              onChange={handleChange}
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-2 ring-brand-200 focus:border-brand-500"
            >
              <option value="Paid">Paid</option>
              <option value="Pending">Pending</option>
              <option value="Refunded">Refunded</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Payment Method
            </label>
            <select
              name="paymentMethod"
              value={formData.paymentMethod}
              onChange={handleChange}
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-2 ring-brand-200 focus:border-brand-500"
            >
              <option value="Bank Transfer">Bank Transfer (NEFT/RTGS)</option>
              <option value="UPI">UPI / GPay / PhonePe</option>
              <option value="Credit Card">Credit / Debit Card</option>
              <option value="Net Banking">Net Banking</option>
              <option value="Cash">Cash</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
            Transaction Notes & Reference
          </label>
          <input
            type="text"
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            placeholder="e.g. PO #88392 or special contract provisions"
            className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 ring-brand-200 focus:border-brand-500"
          />
        </div>
      </form>
    </Modal>
  );
}
