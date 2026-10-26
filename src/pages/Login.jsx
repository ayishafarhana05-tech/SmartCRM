import React, { useState } from 'react';
import { Modal } from '../components/common/Modal';
import { Button } from '../components/common/Button';
import { useCRM } from '../context/CRMContext';
import { useToast } from '../context/ToastContext';
import { Sparkles, ShieldCheck, Lock, Mail, User } from 'lucide-react';

export function LoginModal({ isOpen, onClose }) {
  const { currentUser, setCurrentUser } = useCRM();
  const { showToast } = useToast();

  const [email, setEmail] = useState(currentUser?.email || 'adithya@smartcrm.io');
  const [role, setRole] = useState(currentUser?.role || 'Admin');
  const [password, setPassword] = useState('demo1234');

  const demoAccounts = [
    {
      name: 'Adithya Kurian',
      email: 'adithya@smartcrm.io',
      role: 'Admin',
      avatar: 'AK',
      label: 'System Administrator'
    },
    {
      name: 'Divya Nambiar',
      email: 'divya.n@smartcrm.io',
      role: 'Sales Manager',
      avatar: 'DN',
      label: 'Enterprise Sales Lead'
    },
    {
      name: 'Meera Krishnan',
      email: 'meera.k@smartcrm.io',
      role: 'Support Lead',
      avatar: 'MK',
      label: 'Customer Helpdesk Lead'
    }
  ];

  const handleSelectDemoAccount = (acc) => {
    setEmail(acc.email);
    setRole(acc.role);
    setCurrentUser({
      name: acc.name,
      email: acc.email,
      role: acc.role,
      avatar: acc.avatar
    });
    showToast(`Logged in as ${acc.name} (${acc.role})!`, 'success');
    onClose();
  };

  const handleCustomLogin = (e) => {
    e.preventDefault();
    if (!email) return;

    const name = email.split('@')[0].replace('.', ' ');
    const formattedName = name.charAt(0).toUpperCase() + name.slice(1);
    const initials = (name.substring(0, 2)).toUpperCase();

    setCurrentUser({
      name: formattedName,
      email,
      role,
      avatar: initials
    });
    showToast(`Welcome, ${formattedName}! Signed in as ${role}.`, 'success');
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="SmartCRM Demo Authentication"
      subtitle="Select a role or sign in for presentation demo"
      size="md"
    >
      <div className="space-y-6">
        {/* Brand Banner */}
        <div className="text-center p-4 rounded-xl bg-gradient-to-r from-brand-50 to-accent-50 border border-brand-100">
          <div className="w-12 h-12 mx-auto rounded-xl bg-gradient-to-tr from-brand-600 to-accent-600 flex items-center justify-center text-white mb-2 shadow-sm">
            <Sparkles className="w-6 h-6" />
          </div>
          <h4 className="font-bold text-slate-900 text-sm">SmartCRM Authentication</h4>
          <p className="text-xs text-slate-500 mt-0.5">KTU OOP 3rd Sem CS Project Demonstration Portal</p>
        </div>

        {/* Quick Demo Role Picker */}
        <div>
          <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
            Quick Sign-In As (Click to Demo):
          </label>
          <div className="space-y-2">
            {demoAccounts.map((acc) => (
              <button
                key={acc.email}
                type="button"
                onClick={() => handleSelectDemoAccount(acc)}
                className={`w-full p-3 rounded-xl border text-left flex items-center justify-between transition-all ${
                  currentUser.email === acc.email
                    ? 'border-brand-500 bg-brand-50/70 shadow-sm'
                    : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-brand-600 text-white font-bold text-xs flex items-center justify-center">
                    {acc.avatar}
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-slate-900 block">{acc.name}</span>
                    <span className="text-[11px] text-slate-500">{acc.email} • {acc.label}</span>
                  </div>
                </div>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-white border border-slate-200 text-slate-700">
                  {acc.role}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Manual Form */}
        <form onSubmit={handleCustomLogin} className="pt-4 border-t border-slate-100 space-y-3">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Custom Email
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="user@smartcrm.io"
                className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 ring-brand-200 focus:border-brand-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 ring-brand-200 focus:border-brand-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Role
              </label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-2 ring-brand-200 focus:border-brand-500"
              >
                <option value="Admin">Admin</option>
                <option value="Sales Manager">Sales Manager</option>
                <option value="Support Lead">Support Lead</option>
              </select>
            </div>
          </div>

          <Button type="submit" variant="primary" className="w-full mt-2">
            Sign In with Custom Profile
          </Button>
        </form>
      </div>
    </Modal>
  );
}
