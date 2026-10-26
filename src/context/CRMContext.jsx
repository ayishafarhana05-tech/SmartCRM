import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import {
  Customer,
  Employee,
  Product,
  Sales,
  Interaction,
  Complaint,
  SupportTicket
} from '../models';
import {
  initialCustomers,
  initialEmployees,
  initialProducts,
  initialSales,
  initialInteractions,
  initialComplaints,
  initialSupportTickets
} from '../data/sampleData';
import { loadFromStorage, saveToStorage, STORAGE_KEYS } from '../utils/storage';

const CRMContext = createContext(null);

export function CRMProvider({ children }) {
  // Current logged in demo user
  const [currentUser, setCurrentUser] = useState(() => {
    return loadFromStorage(STORAGE_KEYS.AUTH_USER, {
      name: 'Adithya Kurian',
      email: 'adithya@smartcrm.io',
      role: 'Admin', // 'Admin', 'Sales Manager', 'Support Lead'
      avatar: 'AK'
    });
  });

  // Raw arrays in state (stored as plain objects for serialization)
  const [customersData, setCustomersData] = useState(() => {
    return loadFromStorage(STORAGE_KEYS.CUSTOMERS, initialCustomers);
  });

  const [employeesData, setEmployeesData] = useState(() => {
    return loadFromStorage(STORAGE_KEYS.EMPLOYEES, initialEmployees);
  });

  const [productsData, setProductsData] = useState(() => {
    return loadFromStorage(STORAGE_KEYS.PRODUCTS, initialProducts);
  });

  const [salesData, setSalesData] = useState(() => {
    return loadFromStorage(STORAGE_KEYS.SALES, initialSales);
  });

  const [interactionsData, setInteractionsData] = useState(() => {
    return loadFromStorage(STORAGE_KEYS.INTERACTIONS, initialInteractions);
  });

  const [complaintsData, setComplaintsData] = useState(() => {
    return loadFromStorage(STORAGE_KEYS.COMPLAINTS, initialComplaints);
  });

  const [ticketsData, setTicketsData] = useState(() => {
    return loadFromStorage(STORAGE_KEYS.TICKETS, initialSupportTickets);
  });

  // Sync back to LocalStorage whenever state changes
  useEffect(() => {
    saveToStorage(STORAGE_KEYS.CUSTOMERS, customersData);
  }, [customersData]);

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.EMPLOYEES, employeesData);
  }, [employeesData]);

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.PRODUCTS, productsData);
  }, [productsData]);

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.SALES, salesData);
  }, [salesData]);

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.INTERACTIONS, interactionsData);
  }, [interactionsData]);

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.COMPLAINTS, complaintsData);
  }, [complaintsData]);

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.TICKETS, ticketsData);
  }, [ticketsData]);

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.AUTH_USER, currentUser);
  }, [currentUser]);

  // Transform raw data into OOP Class instances with rich methods
  const customers = useMemo(() => customersData.map(c => new Customer(c)), [customersData]);
  const employees = useMemo(() => employeesData.map(e => new Employee(e)), [employeesData]);
  const products = useMemo(() => productsData.map(p => new Product(p)), [productsData]);
  const sales = useMemo(() => salesData.map(s => new Sales(s)), [salesData]);
  const interactions = useMemo(() => interactionsData.map(i => new Interaction(i)), [interactionsData]);
  const complaints = useMemo(() => complaintsData.map(c => new Complaint(c)), [complaintsData]);
  const tickets = useMemo(() => ticketsData.map(t => new SupportTicket(t)), [ticketsData]);

  // Reset to initial sample data
  const resetSampleData = useCallback(() => {
    setCustomersData(initialCustomers);
    setEmployeesData(initialEmployees);
    setProductsData(initialProducts);
    setSalesData(initialSales);
    setInteractionsData(initialInteractions);
    setComplaintsData(initialComplaints);
    setTicketsData(initialSupportTickets);
  }, []);

  // --- CUSTOMER CRUD ---
  const addCustomer = useCallback((customerData) => {
    const newCust = new Customer(customerData);
    const validation = newCust.validate();
    if (!validation.isValid) {
      throw new Error(validation.errors.join(', '));
    }
    setCustomersData(prev => [newCust.toJSON(), ...prev]);
    return newCust;
  }, []);

  const updateCustomer = useCallback((id, updatedFields) => {
    setCustomersData(prev => prev.map(c => {
      if (c.id === id) {
        const updated = new Customer({ ...c, ...updatedFields });
        const validation = updated.validate();
        if (!validation.isValid) throw new Error(validation.errors.join(', '));
        updated.touch();
        return updated.toJSON();
      }
      return c;
    }));
  }, []);

  const deleteCustomer = useCallback((id) => {
    setCustomersData(prev => prev.filter(c => c.id !== id));
    // Optional: cascade or notify
  }, []);

  // --- EMPLOYEE CRUD ---
  const addEmployee = useCallback((employeeData) => {
    const newEmp = new Employee(employeeData);
    const validation = newEmp.validate();
    if (!validation.isValid) {
      throw new Error(validation.errors.join(', '));
    }
    setEmployeesData(prev => [newEmp.toJSON(), ...prev]);
    return newEmp;
  }, []);

  const updateEmployee = useCallback((id, updatedFields) => {
    setEmployeesData(prev => prev.map(e => {
      if (e.id === id) {
        const updated = new Employee({ ...e, ...updatedFields });
        const validation = updated.validate();
        if (!validation.isValid) throw new Error(validation.errors.join(', '));
        updated.touch();
        return updated.toJSON();
      }
      return e;
    }));
  }, []);

  const deleteEmployee = useCallback((id) => {
    setEmployeesData(prev => prev.filter(e => e.id !== id));
  }, []);

  // --- PRODUCT CRUD ---
  const addProduct = useCallback((productData) => {
    const newProd = new Product(productData);
    const validation = newProd.validate();
    if (!validation.isValid) {
      throw new Error(validation.errors.join(', '));
    }
    setProductsData(prev => [newProd.toJSON(), ...prev]);
    return newProd;
  }, []);

  const updateProduct = useCallback((id, updatedFields) => {
    setProductsData(prev => prev.map(p => {
      if (p.id === id) {
        const updated = new Product({ ...p, ...updatedFields });
        const validation = updated.validate();
        if (!validation.isValid) throw new Error(validation.errors.join(', '));
        updated.touch();
        return updated.toJSON();
      }
      return p;
    }));
  }, []);

  const deleteProduct = useCallback((id) => {
    setProductsData(prev => prev.filter(p => p.id !== id));
  }, []);

  // --- SALES CRUD & INVENTORY INTEGRATION ---
  const addSale = useCallback((saleData) => {
    const newSale = new Sales(saleData);
    const validation = newSale.validate();
    if (!validation.isValid) {
      throw new Error(validation.errors.join(', '));
    }

    // Deduct stock from the corresponding product
    setProductsData(prev => prev.map(p => {
      if (p.id === newSale.productId) {
        const productInst = new Product(p);
        productInst.reduceStock(newSale.quantity);
        return productInst.toJSON();
      }
      return p;
    }));

    setSalesData(prev => [newSale.toJSON(), ...prev]);
    return newSale;
  }, []);

  const updateSale = useCallback((id, updatedFields) => {
    setSalesData(prev => prev.map(s => {
      if (s.id === id) {
        const updated = new Sales({ ...s, ...updatedFields });
        updated.recalculate();
        const validation = updated.validate();
        if (!validation.isValid) throw new Error(validation.errors.join(', '));
        return updated.toJSON();
      }
      return s;
    }));
  }, []);

  const deleteSale = useCallback((id) => {
    setSalesData(prev => prev.filter(s => s.id !== id));
  }, []);

  // --- INTERACTIONS CRUD ---
  const addInteraction = useCallback((interactionData) => {
    const newInteraction = new Interaction(interactionData);
    const validation = newInteraction.validate();
    if (!validation.isValid) {
      throw new Error(validation.errors.join(', '));
    }
    setInteractionsData(prev => [newInteraction.toJSON(), ...prev]);
    return newInteraction;
  }, []);

  const updateInteraction = useCallback((id, updatedFields) => {
    setInteractionsData(prev => prev.map(i => {
      if (i.id === id) {
        const updated = new Interaction({ ...i, ...updatedFields });
        const validation = updated.validate();
        if (!validation.isValid) throw new Error(validation.errors.join(', '));
        updated.touch();
        return updated.toJSON();
      }
      return i;
    }));
  }, []);

  const deleteInteraction = useCallback((id) => {
    setInteractionsData(prev => prev.filter(i => i.id !== id));
  }, []);

  // --- COMPLAINTS CRUD ---
  const addComplaint = useCallback((complaintData) => {
    const newComplaint = new Complaint(complaintData);
    const validation = newComplaint.validate();
    if (!validation.isValid) {
      throw new Error(validation.errors.join(', '));
    }
    setComplaintsData(prev => [newComplaint.toJSON(), ...prev]);
    return newComplaint;
  }, []);

  const updateComplaint = useCallback((id, updatedFields) => {
    setComplaintsData(prev => prev.map(c => {
      if (c.id === id) {
        const updated = new Complaint({ ...c, ...updatedFields });
        const validation = updated.validate();
        if (!validation.isValid) throw new Error(validation.errors.join(', '));
        updated.touch();
        return updated.toJSON();
      }
      return c;
    }));
  }, []);

  const resolveComplaint = useCallback((id, resolutionNotes) => {
    setComplaintsData(prev => prev.map(c => {
      if (c.id === id) {
        const comp = new Complaint(c);
        comp.resolve(resolutionNotes);
        return comp.toJSON();
      }
      return c;
    }));
  }, []);

  const deleteComplaint = useCallback((id) => {
    setComplaintsData(prev => prev.filter(c => c.id !== id));
  }, []);

  // --- SUPPORT TICKETS CRUD ---
  const addTicket = useCallback((ticketData) => {
    const newTicket = new SupportTicket(ticketData);
    const validation = newTicket.validate();
    if (!validation.isValid) {
      throw new Error(validation.errors.join(', '));
    }
    setTicketsData(prev => [newTicket.toJSON(), ...prev]);
    return newTicket;
  }, []);

  const updateTicket = useCallback((id, updatedFields) => {
    setTicketsData(prev => prev.map(t => {
      if (t.id === id) {
        const updated = new SupportTicket({ ...t, ...updatedFields });
        const validation = updated.validate();
        if (!validation.isValid) throw new Error(validation.errors.join(', '));
        updated.touch();
        return updated.toJSON();
      }
      return t;
    }));
  }, []);

  const assignTicket = useCallback((ticketId, employeeId) => {
    setTicketsData(prev => prev.map(t => {
      if (t.id === ticketId) {
        const ticket = new SupportTicket(t);
        ticket.assignTo(employeeId);
        return ticket.toJSON();
      }
      return t;
    }));
  }, []);

  const closeTicket = useCallback((ticketId, resolution) => {
    setTicketsData(prev => prev.map(t => {
      if (t.id === ticketId) {
        const ticket = new SupportTicket(t);
        ticket.close(resolution);
        return ticket.toJSON();
      }
      return t;
    }));
  }, []);

  const deleteTicket = useCallback((id) => {
    setTicketsData(prev => prev.filter(t => t.id !== id));
  }, []);

  // Aggregated KPI Metrics
  const stats = useMemo(() => {
    const totalSalesAmount = sales.reduce((sum, s) => sum + (Number(s.totalAmount) || 0), 0);
    const pendingComplaintsCount = complaints.filter(c => c.status !== 'Resolved').length;
    const openTicketsCount = tickets.filter(t => t.status !== 'Closed').length;

    return {
      totalCustomers: customers.length,
      totalEmployees: employees.length,
      totalProducts: products.length,
      totalSalesCount: sales.length,
      totalSalesAmount,
      pendingComplaintsCount,
      openTicketsCount
    };
  }, [customers, employees, products, sales, complaints, tickets]);

  const value = {
    // Current user
    currentUser,
    setCurrentUser,
    // Entity Collections
    customers,
    employees,
    products,
    sales,
    interactions,
    complaints,
    tickets,
    stats,
    // Operations
    resetSampleData,
    addCustomer,
    updateCustomer,
    deleteCustomer,
    addEmployee,
    updateEmployee,
    deleteEmployee,
    addProduct,
    updateProduct,
    deleteProduct,
    addSale,
    updateSale,
    deleteSale,
    addInteraction,
    updateInteraction,
    deleteInteraction,
    addComplaint,
    updateComplaint,
    resolveComplaint,
    deleteComplaint,
    addTicket,
    updateTicket,
    assignTicket,
    closeTicket,
    deleteTicket
  };

  return (
    <CRMContext.Provider value={value}>
      {children}
    </CRMContext.Provider>
  );
}

export function useCRM() {
  const context = useContext(CRMContext);
  if (!context) {
    throw new Error('useCRM must be used within a CRMProvider');
  }
  return context;
}
