import React from 'react';
import {
  LayoutDashboard,
  Users,
  Briefcase,
  Layers,
  ShoppingBag,
  TrendingUp,
  AlertOctagon,
  LifeBuoy,
  BarChart3,
  Code2,
  X,
  Sparkles
} from 'lucide-react';
import { useCRM } from '../../context/CRMContext';

export function Sidebar({ currentTab, setCurrentTab, isMobileOpen, setIsMobileOpen }) {
  const { stats } = useCRM();

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'customers', label: 'Customers', icon: Users, badge: stats.totalCustomers },
    { id: 'employees', label: 'Employees', icon: Briefcase, badge: stats.totalEmployees },
    { id: 'interactions', label: 'Interactions', icon: Layers },
    { id: 'products', label: 'Products', icon: ShoppingBag, badge: stats.totalProducts },
    { id: 'sales', label: 'Sales & Invoices', icon: TrendingUp },
    {
      id: 'complaints',
      label: 'Complaints',
      icon: AlertOctagon,
      badge: stats.pendingComplaintsCount > 0 ? stats.pendingComplaintsCount : null,
      badgeColor: 'bg-rose-500 text-white'
    },
    {
      id: 'tickets',
      label: 'Support Tickets',
      icon: LifeBuoy,
      badge: stats.openTicketsCount > 0 ? stats.openTicketsCount : null,
      badgeColor: 'bg-amber-500 text-white'
    },
    { id: 'reports', label: 'Analytics & Reports', icon: BarChart3 },
    { id: 'oop-showcase', label: 'OOP Architecture', icon: Code2, highlight: true },
  ];

  const handleNavClick = (id) => {
    setCurrentTab(id);
    if (setIsMobileOpen) setIsMobileOpen(false);
  };

  return (
    <>
      {/* Mobile overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-sm lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar container */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-slate-200/90 flex flex-col transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="h-16 flex items-center justify-between px-6 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 via-brand-500 to-accent-500 flex items-center justify-center text-white shadow-md shadow-brand-500/20">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h1 className="font-bold text-slate-900 text-base leading-tight">SmartCRM</h1>
              <p className="text-[10px] uppercase font-semibold tracking-wider text-brand-600">
                KTU OOP CS 2024
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsMobileOpen(false)}
            className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation items */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-1">
          <div className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
            Main Menu
          </div>

          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-brand-50 text-brand-700 shadow-sm border border-brand-100'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                } ${item.highlight && !isActive ? 'text-accent-700 bg-accent-50/50 hover:bg-accent-50' : ''}`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={`w-4 h-4 transition-colors ${
                      isActive ? 'text-brand-600' : item.highlight ? 'text-accent-600' : 'text-slate-400'
                    }`}
                  />
                  <span>{item.label}</span>
                </div>
                {item.badge !== undefined && item.badge !== null && (
                  <span
                    className={`px-2 py-0.5 rounded-full text-[11px] font-semibold ${
                      item.badgeColor || (isActive ? 'bg-brand-200/70 text-brand-800' : 'bg-slate-100 text-slate-600')
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Footer info box */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/50">
          <div className="rounded-xl p-3 bg-white border border-slate-200/80 shadow-sm">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
              <span>KTU OOP Project</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-brand-50 text-brand-600 font-mono">v1.0</span>
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              7 OOP Classes & LocalStorage CRM system.
            </p>
          </div>
        </div>
      </aside>
    </>
  );
}
