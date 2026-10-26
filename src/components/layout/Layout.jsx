import React, { useState } from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';

export function Layout({
  children,
  currentTab,
  setCurrentTab,
  globalSearch,
  setGlobalSearch,
  onLogout,
  loggedInUser
}) {
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50">
      {/* Sidebar Navigation */}
      <Sidebar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        isMobileOpen={isMobileOpen}
        setIsMobileOpen={setIsMobileOpen}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header
          currentTab={currentTab}
          setCurrentTab={setCurrentTab}
          onOpenMobileSidebar={() => setIsMobileOpen(true)}
          globalSearch={globalSearch}
          setGlobalSearch={setGlobalSearch}
          onLogout={onLogout}
          loggedInUser={loggedInUser}
        />

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
