import React, { useState } from 'react';
import { Layout } from './components/layout/Layout';
import { Dashboard } from './pages/Dashboard';
import { Customers } from './pages/Customers';
import { Employees } from './pages/Employees';
import { Interactions } from './pages/Interactions';
import { Products } from './pages/Products';
import { SalesPage } from './pages/Sales';
import { Complaints } from './pages/Complaints';
import { SupportTickets } from './pages/SupportTickets';
import { Reports } from './pages/Reports';
import { OopShowcase } from './pages/OopShowcase';
import { LoginPage } from './pages/LoginPage';

// Quick Modals triggerable from Dashboard or global buttons
import { CustomerModal } from './components/modals/CustomerModal';
import { SaleModal } from './components/modals/SaleModal';
import { InteractionModal } from './components/modals/InteractionModal';
import { TicketModal } from './components/modals/TicketModal';
import { useCRM } from './context/CRMContext';
import { useToast } from './context/ToastContext';

export function App() {
  // ── Auth Gate ────────────────────────────────────────────────────────────────
  // Persist login across hot-reloads via sessionStorage (cleared on browser close)
  const [isAuthenticated, setIsAuthenticated] = useState(
    () => sessionStorage.getItem('smartcrm_auth') === 'true'
  );
  const [loggedInUser, setLoggedInUser] = useState(
    () => {
      try { return JSON.parse(sessionStorage.getItem('smartcrm_user') || 'null'); }
      catch { return null; }
    }
  );

  const handleLoginSuccess = (user) => {
    sessionStorage.setItem('smartcrm_auth', 'true');
    sessionStorage.setItem('smartcrm_user', JSON.stringify(user));
    setLoggedInUser(user);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    sessionStorage.removeItem('smartcrm_auth');
    sessionStorage.removeItem('smartcrm_user');
    setLoggedInUser(null);
    setIsAuthenticated(false);
  };
  // ─────────────────────────────────────────────────────────────────────────────

  const [currentTab, setCurrentTab] = useState('dashboard');
  const [globalSearch, setGlobalSearch] = useState('');

  // Quick Action Modal states
  const [isCustomerModalOpen, setIsCustomerModalOpen] = useState(false);
  const [isSaleModalOpen, setIsSaleModalOpen] = useState(false);
  const [isInteractionModalOpen, setIsInteractionModalOpen] = useState(false);
  const [isTicketModalOpen, setIsTicketModalOpen] = useState(false);

  const { addCustomer, addSale, addInteraction, addTicket } = useCRM();
  const { showToast } = useToast();

  const handleQuickCustomerSave = (data) => {
    try {
      const c = addCustomer(data);
      showToast(`Customer ${c.name} added successfully!`, 'success');
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const handleQuickSaleSave = (data) => {
    try {
      const s = addSale(data);
      showToast(`Sale recorded #${s.id} and inventory updated!`, 'success');
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const handleQuickInteractionSave = (data) => {
    try {
      addInteraction(data);
      showToast('Interaction logged successfully!', 'success');
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const handleQuickTicketSave = (data) => {
    try {
      const t = addTicket(data);
      showToast(`Support Ticket #${t.id} opened!`, 'success');
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const renderContent = () => {
    switch (currentTab) {
      case 'dashboard':
        return (
          <Dashboard
            onNavigate={setCurrentTab}
            onOpenCustomerModal={() => setIsCustomerModalOpen(true)}
            onOpenSaleModal={() => setIsSaleModalOpen(true)}
            onOpenInteractionModal={() => setIsInteractionModalOpen(true)}
            onOpenTicketModal={() => setIsTicketModalOpen(true)}
          />
        );
      case 'customers':
        return <Customers globalSearch={globalSearch} />;
      case 'employees':
        return <Employees globalSearch={globalSearch} />;
      case 'interactions':
        return <Interactions globalSearch={globalSearch} />;
      case 'products':
        return <Products globalSearch={globalSearch} />;
      case 'sales':
        return <SalesPage globalSearch={globalSearch} />;
      case 'complaints':
        return <Complaints globalSearch={globalSearch} />;
      case 'tickets':
        return <SupportTickets globalSearch={globalSearch} />;
      case 'reports':
        return <Reports />;
      case 'oop-showcase':
        return <OopShowcase />;
      default:
        return <Dashboard onNavigate={setCurrentTab} />;
    }
  };

  // Show full-page login when not authenticated
  if (!isAuthenticated) {
    return <LoginPage onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <Layout
      currentTab={currentTab}
      setCurrentTab={setCurrentTab}
      globalSearch={globalSearch}
      setGlobalSearch={setGlobalSearch}
      onLogout={handleLogout}
      loggedInUser={loggedInUser}
    >
      {renderContent()}

      {/* Global Quick Modals */}
      <CustomerModal
        isOpen={isCustomerModalOpen}
        onClose={() => setIsCustomerModalOpen(false)}
        onSave={handleQuickCustomerSave}
      />
      <SaleModal
        isOpen={isSaleModalOpen}
        onClose={() => setIsSaleModalOpen(false)}
        onSave={handleQuickSaleSave}
      />
      <InteractionModal
        isOpen={isInteractionModalOpen}
        onClose={() => setIsInteractionModalOpen(false)}
        onSave={handleQuickInteractionSave}
      />
      <TicketModal
        isOpen={isTicketModalOpen}
        onClose={() => setIsTicketModalOpen(false)}
        onSave={handleQuickTicketSave}
      />
    </Layout>
  );
}

export default App;
