# SmartCRM – Customer Relationship Management System
**KTU 3rd Semester Computer Science & Engineering — OOP Project (2024 Scheme)**

SmartCRM is an enterprise-grade, modern, responsive, and functional Customer Relationship Management System designed specifically to fulfill all KTU 2024 Scheme Object-Oriented Programming (OOP) requirements.

---

## 🌟 Key Features

### 1. Dashboard Overview
- **6 Key Metrics**: Total Customers, Total Employees, Total Products, Total Sales Revenue, Pending Complaints, and Open Support Tickets.
- **Sales & Revenue Growth Chart**: Interactive monthly sales volume area chart with Recharts.
- **Product Mix Breakdown**: Category distribution pie chart.
- **Recent Customer Touchpoints & Invoices**: Real-time listing of latest interactions and billing records.
- **Urgent Action Alerts**: Direct indicators for unresolved grievances and active tickets.

### 2. Customer Management
- Complete CRUD operations (Add, Edit, View, Delete).
- Stores unique ID, name, email, phone, company, address, city, and lifecycle status.
- Real-time search and status filtering (All, Active, Lead, Inactive).
- **Customer 360° Profile Modal**: Interactive tabbed view displaying personal details, purchase history, touchpoint timeline, complaints, and support tickets.
- **Export to CSV**: One-click customer directory download.

### 3. Employee & Staff Management
- Full CRUD operations with department segregation (Sales, Customer Support, Technical, Marketing, Operations).
- Workload tracking: counts assigned interactions, open tickets, and total sales converted volume.
- Search and department filtering.

### 4. Interaction Management
- Log customer touchpoints across multiple channels: **Calls, Emails, Meetings, Demos, and Notes**.
- Links each interaction to an affected customer and handling staff member.
- Outcome tracking and automated follow-up due date indicators.

### 5. Product & Inventory Catalog
- Catalog software licenses, cloud services, hardware, AMC contracts, and security audits.
- SKU code, unit price in INR (₹), stock quantity, and real-time availability badges (**In Stock**, **Low Stock**, **Out of Stock**).
- **Quick Restock Action**: Instant inventory adjustment dialog.

### 6. Sales & Invoicing
- Transaction recording linked to **Customer**, **Sales Rep**, and **Product**.
- **Automated Total Calculation**: Computes gross total, applies discount percentage, and subtracts deductions in real-time.
- **Inventory Integration**: Automatically deducts units from product stock upon sale recording.
- Financial overview metrics: Total Billed, Settled & Paid, and Pending Receivables.
- Filter by payment status (**Paid**, **Pending**, **Refunded**) and payment mode (**Bank Transfer**, **UPI**, **Credit Card**, **Net Banking**).
- **Export to CSV**: Export invoice ledgers to spreadsheet.

### 7. Complaint Management
- Grievance tracking with priority indicators (**Urgent**, **High**, **Medium**, **Low**).
- Status workflow: **Pending ➔ In Progress ➔ Resolved**.
- **Quick Resolve Action**: Enter resolution notes directly to resolve grievances.
- Unresolved complaints highlighted on the executive dashboard.

### 8. Support Ticket Helpdesk
- Technical issue tracking with category tagging (Bug Report, Feature Request, Integration, Account Access).
- Assign or reassign tickets to support engineers.
- Status management (**Open**, **In Progress**, **Closed**).
- One-click resolution and closure.

### 9. Sales Reports & Analytics
- Executive leaderboard ranking top sales representatives by revenue generated.
- Product solution revenue distribution.
- Monthly sales progression and collection efficiency metrics.

### 10. KTU OOP Architecture Showcase
- Interactive in-app OOP inspector showcasing the 7 Core Classes and their member methods.
- Live object inspector inspecting objects directly in memory.
- Detailed breakdown of OOP principles: **Encapsulation**, **Abstraction**, **Inheritance**, **Polymorphism**, and **Associations**.

### 11. Demonstration Helpers
- **Reset Demo Data**: One-click restore button in the top navigation bar to reset LocalStorage to fresh realistic test records during presentations.
- **Demo Role Switcher**: Quick toggle between **System Administrator**, **Sales Manager**, and **Support Lead** profiles.

---

## 🏛️ Object-Oriented Programming (OOP) Architecture

The application is structured strictly around 7 primary domain models and an abstract base class:

| Class Name | Source File | Extends | Core Responsibilities & Methods |
| :--- | :--- | :--- | :--- |
| **`BaseEntity`** | `src/models/BaseEntity.js` | *Root* | Abstract base class. Generates unique IDs, handles timestamp auditing, and defines abstract `validate()` and `getSummary()`. |
| **`Customer`** | `src/models/Customer.js` | `BaseEntity` | Encapsulates customer attributes, initials generator, relational associations (`getSales()`, `getInteractions()`, `getComplaints()`, `getTickets()`), and `calculateTotalSpent()`. |
| **`Employee`** | `src/models/Employee.js` | `BaseEntity` | Staff entity with department logic, `getAssignedInteractions()`, `getAssignedTickets()`, `calculateSalesVolume()`, and `validate()`. |
| **`Product`** | `src/models/Product.js` | `BaseEntity` | Inventory tracking, `isAvailable()`, `getStockStatus()`, `reduceStock(qty)`, `restock(qty)`, and currency formatting. |
| **`Sales`** | `src/models/Sales.js` | `BaseEntity` | Connects Customer, Employee, and Product. Methods include automated `calculateTotal()`, `recalculate()`, and invoice generation. |
| **`Interaction`**| `src/models/Interaction.js` | `BaseEntity` | Omni-channel touchpoint logs, `isFollowUpDue()`, relational lookups to customer and staff. |
| **`Complaint`** | `src/models/Complaint.js` | `BaseEntity` | Grievance lifecycle handling, `resolve(notes)`, `updateStatus()`, and priority escalation. |
| **`SupportTicket`**| `src/models/SupportTicket.js` | `BaseEntity` | Helpdesk ticketing, `assignTo(empId)`, `close(resolution)`, and category filtering. |

### OOP Principles Demonstrated:
1. **Abstraction**: `BaseEntity` enforces validation and summary contracts while preventing direct instantiation.
2. **Inheritance**: All 7 entities extend `BaseEntity`, reusing ID generation, timestamp auditing, and serialization logic.
3. **Encapsulation**: State manipulation is protected via class methods (`reduceStock()`, `calculateTotal()`, `resolve()`).
4. **Polymorphism**: Each entity provides its own custom implementation of `validate()` and `getSummary()`.
5. **Relational Associations**: Entities query linked data through relational helper methods (e.g., `customer.getSales(allSales)`).

---

## 📁 Project Folder Structure

```
crm/
├── dist/                             # Compiled production build
├── src/
│   ├── components/
│   │   ├── common/                   # Reusable UI widgets
│   │   │   ├── Badge.jsx             # Status and priority badges
│   │   │   ├── Button.jsx            # Primary, secondary, outline & danger buttons
│   │   │   ├── Card.jsx              # Rounded SaaS card with header & body
│   │   │   ├── ConfirmModal.jsx      # Delete confirmation dialog
│   │   │   ├── Modal.jsx             # Accessible modal container with backdrop blur
│   │   │   ├── SearchBar.jsx         # Live search bar with clear button
│   │   │   ├── StatCard.jsx          # KPI metric cards with trends
│   │   │   ├── Table.jsx             # Interactive table with empty states
│   │   │   └── Toast.jsx             # Animated floating toast notifications
│   │   ├── layout/                   # Application shell
│   │   │   ├── Header.jsx            # Top navigation, global search, alerts & profile
│   │   │   ├── Sidebar.jsx           # Responsive sidebar with badges & brand logo
│   │   │   └── Layout.jsx            # Responsive wrapper & container
│   │   └── modals/                   # Dedicated forms & dialogs
│   │       ├── CustomerModal.jsx     # Add / Edit customer form
│   │       ├── CustomerProfileModal.jsx # 360° Customer profile view
│   │       ├── EmployeeModal.jsx     # Add / Edit employee form
│   │       ├── ProductModal.jsx      # Add / Edit product & stock form
│   │       ├── SaleModal.jsx         # Record sale with real-time total calculation
│   │       ├── InteractionModal.jsx  # Log touchpoint form
│   │       ├── ComplaintModal.jsx    # Register grievance form
│   │       └── TicketModal.jsx       # Open support ticket form
│   ├── context/
│   │   ├── CRMContext.jsx            # Central state & LocalStorage sync
│   │   └── ToastContext.jsx          # Global toast notification provider
│   ├── data/
│   │   └── sampleData.js             # Realistic seed data for presentations
│   ├── models/                       # OOP Classes (KTU Scheme)
│   │   ├── BaseEntity.js             # Abstract base class
│   │   ├── Customer.js               # Customer entity class
│   │   ├── Employee.js               # Employee entity class
│   │   ├── Product.js                # Product entity class
│   │   ├── Sales.js                  # Sales transaction entity class
│   │   ├── Interaction.js            # Customer interaction entity class
│   │   ├── Complaint.js              # Grievance entity class
│   │   ├── SupportTicket.js          # Support ticket entity class
│   │   └── index.js                  # Model exports
│   ├── pages/                        # Views
│   │   ├── Dashboard.jsx             # KPI metrics & Recharts graphs
│   │   ├── Customers.jsx             # Customer management page
│   │   ├── Employees.jsx             # Staff management page
│   │   ├── Interactions.jsx          # Touchpoint log page
│   │   ├── Products.jsx              # Product catalog & stock
│   │   ├── Sales.jsx                 # Invoices, ledger & export
│   │   ├── Complaints.jsx            # Complaints & resolution
│   │   ├── SupportTickets.jsx        # Helpdesk ticket center
│   │   ├── Reports.jsx               # Analytics & leaderboard
│   │   ├── OopShowcase.jsx           # Interactive OOP architecture tab
│   │   └── Login.jsx                 # Demo authentication modal
│   ├── utils/
│   │   ├── exportCsv.js              # CSV file generation & export
│   │   ├── formatters.js             # Currency (INR), date & badge styling
│   │   └── storage.js                # LocalStorage abstraction with versioning
│   ├── App.jsx                       # Main application component & routing
│   ├── index.css                     # Tailwind CSS directives & scrollbar styling
│   └── main.jsx                      # React 18 DOM root & provider mounting
├── index.html                        # HTML entry point with Inter font
├── package.json                      # Project dependencies & scripts
├── tailwind.config.js                # Tailwind theme customization
└── vite.config.js                    # Vite bundler configuration (port 3000)
```

---

## 🚀 How to Run the Application

The development server is already running on:
👉 **`http://localhost:3000`**

To run the project in any terminal:

```bash
# 1. Navigate to the project directory
cd c:\Users\MYCARE\Desktop\crm

# 2. Start the development server
npm run dev
```

Then open your browser and navigate to:
**`http://localhost:3000`**

### Building for Production:
```bash
npm run build
```
The compiled output will be placed in the `dist/` directory.

### Previewing the Production Build:
```bash
npm run preview
```
