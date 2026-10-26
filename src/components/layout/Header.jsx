import React, { useState } from 'react';
import {
  Menu,
  Bell,
  RotateCcw,
  Home,
  CheckCircle,
  AlertTriangle,
  ChevronDown,
  User,
  LogOut,
  ShieldCheck
} from 'lucide-react';
import { useCRM } from '../../context/CRMContext';
import { useToast } from '../../context/ToastContext';

export function Header({
  currentTab,
  setCurrentTab,
  onOpenMobileSidebar,
  globalSearch,
  setGlobalSearch,
  onLogout,
  loggedInUser
}) {
  const { currentUser, setCurrentUser, resetSampleData, complaints, tickets } = useCRM();
  const { showToast } = useToast();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const pendingComplaints = complaints.filter(c => c.status !== 'Resolved');
  const openTickets = tickets.filter(t => t.status !== 'Closed');
  const totalNotifications = pendingComplaints.length + openTickets.length;

  const handleReset = () => {
    if (window.confirm("Reset all CRM data back to initial sample state? This will restore original test records.")) {
      resetSampleData();
      showToast("CRM data reset to initial sample state successfully!", "info");
    }
  };

  const roles = ['Admin', 'Sales Manager', 'Support Lead'];

  const tabTitles = {
    dashboard: 'Dashboard Overview',
    customers: 'Customer Directory',
    employees: 'Employee & Staff Management',
    interactions: 'Customer Interactions & Logs',
    products: 'Product & Inventory Catalog',
    sales: 'Sales Records & Invoicing',
    complaints: 'Customer Complaints & Escalations',
    tickets: 'Support Tickets & Helpdesk',
    reports: 'Sales Analytics & KPI Reports',
    'oop-showcase': 'KTU 2024 Scheme OOP Architecture'
  };

  return (
    <header className="h-16 bg-white border-b border-slate-200/90 sticky top-0 z-30 px-4 sm:px-6 flex items-center justify-between gap-4">
      {/* Left: Mobile trigger & Breadcrumb */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobileSidebar}
          className="lg:hidden p-2 rounded-lg text-slate-500 hover:text-slate-700 hover:bg-slate-100"
          aria-label="Open sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2">
          {currentTab !== 'dashboard' && (
            <button
              onClick={() => setCurrentTab('dashboard')}
              className="hidden sm:flex items-center gap-1 text-xs font-medium text-slate-500 hover:text-brand-600 transition-colors p-1.5 rounded-lg hover:bg-slate-100"
              title="Return to Dashboard"
            >
              <Home className="w-3.5 h-3.5" />
              <span>Dashboard</span>
              <span className="text-slate-300">/</span>
            </button>
          )}
          <h2 className="text-base font-semibold text-slate-800">
            {tabTitles[currentTab] || 'SmartCRM'}
          </h2>
        </div>
      </div>

      {/* Center: Search input */}
      <div className="hidden md:flex flex-1 max-w-xs mx-4">
        <input
          type="text"
          value={globalSearch}
          onChange={(e) => setGlobalSearch(e.target.value)}
          placeholder="Quick filter on current page..."
          className="w-full text-xs px-3 py-1.5 bg-slate-50 hover:bg-slate-100 focus:bg-white border border-slate-200 rounded-lg text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all"
        />
      </div>

      {/* Right: Actions, Notifications & Profile */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Reset sample data button */}
        <button
          onClick={handleReset}
          className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-slate-600 hover:text-brand-600 hover:bg-slate-100 rounded-lg transition-colors border border-slate-200/60"
          title="Restore fresh sample records for demonstration"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span className="hidden xl:inline">Reset Demo Data</span>
        </button>

        {/* Notification bell dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 rounded-lg text-slate-500 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            aria-label="View notifications"
          >
            <Bell className="w-4 h-4" />
            {totalNotifications > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full animate-pulse" />
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-slate-200 p-3 z-50">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100 mb-2">
                <span className="text-xs font-semibold text-slate-800">Alerts & Attention</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-brand-50 text-brand-600 font-semibold">
                  {totalNotifications} Pending
                </span>
              </div>

              <div className="space-y-2 max-h-64 overflow-y-auto">
                {pendingComplaints.slice(0, 3).map(c => (
                  <div
                    key={c.id}
                    onClick={() => {
                      setCurrentTab('complaints');
                      setShowNotifications(false);
                    }}
                    className="p-2 rounded-lg hover:bg-slate-50 cursor-pointer flex items-start gap-2 text-xs border border-slate-100"
                  >
                    <AlertTriangle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-slate-800 truncate">{c.title}</p>
                      <p className="text-[11px] text-slate-500">{c.priority} priority complaint</p>
                    </div>
                  </div>
                ))}

                {openTickets.slice(0, 3).map(t => (
                  <div
                    key={t.id}
                    onClick={() => {
                      setCurrentTab('tickets');
                      setShowNotifications(false);
                    }}
                    className="p-2 rounded-lg hover:bg-slate-50 cursor-pointer flex items-start gap-2 text-xs border border-slate-100"
                  >
                    <CheckCircle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-slate-800 truncate">{t.subject}</p>
                      <p className="text-[11px] text-slate-500">{t.status} - {t.priority} priority</p>
                    </div>
                  </div>
                ))}

                {totalNotifications === 0 && (
                  <p className="text-center py-4 text-xs text-slate-400">All caught up! No urgent alerts.</p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* User profile / role switcher */}
        <div className="relative">
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center gap-2.5 p-1.5 rounded-xl hover:bg-slate-100 transition-colors text-left"
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-brand-600 to-accent-600 text-white flex items-center justify-center font-bold text-xs shadow-sm">
              {currentUser.avatar || 'AK'}
            </div>
            <div className="hidden sm:block">
              <p className="text-xs font-semibold text-slate-800 leading-none">{currentUser.name}</p>
              <span className="text-[10px] text-brand-600 font-medium">{currentUser.role}</span>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
          </button>

          {showUserMenu && (
            <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-slate-200 p-2 z-50">
              <div className="p-2 border-b border-slate-100 mb-1">
                <p className="text-xs font-bold text-slate-800">{currentUser.name}</p>
                <p className="text-[11px] text-slate-500">{currentUser.email}</p>
              </div>

              <div className="py-1">
                <p className="px-2 text-[10px] font-semibold uppercase text-slate-400 mb-1">Switch Role (Demo)</p>
                {roles.map(r => (
                  <button
                    key={r}
                    onClick={() => {
                      setCurrentUser({ ...currentUser, role: r });
                      setShowUserMenu(false);
                      showToast(`Role switched to ${r}`, 'info');
                    }}
                    className={`w-full text-left px-2 py-1.5 text-xs rounded-lg flex items-center justify-between ${
                      currentUser.role === r ? 'bg-brand-50 text-brand-700 font-semibold' : 'hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      {r}
                    </span>
                    {currentUser.role === r && <span className="w-1.5 h-1.5 rounded-full bg-brand-600" />}
                  </button>
                ))}
              </div>

              <div className="pt-1 border-t border-slate-100 mt-1">
                <button
                  onClick={() => {
                    setShowUserMenu(false);
                    if (onLogout) onLogout();
                  }}
                  className="w-full text-left px-2 py-1.5 text-xs rounded-lg hover:bg-rose-50 text-rose-600 flex items-center gap-2"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
