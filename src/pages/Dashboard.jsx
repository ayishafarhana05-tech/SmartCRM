import React from 'react';
import {
  Users,
  Briefcase,
  ShoppingBag,
  TrendingUp,
  AlertOctagon,
  LifeBuoy,
  Plus,
  ArrowUpRight,
  Clock,
  CheckCircle2,
  Calendar
} from 'lucide-react';
import { StatCard } from '../components/common/StatCard';
import { Card, CardHeader, CardContent } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { useCRM } from '../context/CRMContext';
import { formatCurrency, formatDate, formatDateTime, getStatusBadgeColor, getPriorityBadgeColor } from '../utils/formatters';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';

export function Dashboard({
  onNavigate,
  onOpenCustomerModal,
  onOpenSaleModal,
  onOpenInteractionModal,
  onOpenTicketModal
}) {
  const { stats, sales, customers, interactions, complaints, tickets, products, employees } = useCRM();

  // Aggregate monthly sales for the area chart
  const salesByMonth = React.useMemo(() => {
    const months = ['May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'];
    const monthlyMap = {
      '05': { month: 'May', revenue: 0, orders: 0 },
      '06': { month: 'Jun', revenue: 0, orders: 0 },
      '07': { month: 'Jul', revenue: 0, orders: 0 },
      '08': { month: 'Aug', revenue: 0, orders: 0 },
      '09': { month: 'Sep', revenue: 0, orders: 0 },
      '10': { month: 'Oct', revenue: 0, orders: 0 }
    };

    sales.forEach(s => {
      if (s.date) {
        const m = s.date.split('-')[1];
        if (monthlyMap[m]) {
          monthlyMap[m].revenue += Number(s.totalAmount) || 0;
          monthlyMap[m].orders += 1;
        }
      }
    });

    return Object.values(monthlyMap);
  }, [sales]);

  // Aggregate product category distribution
  const categoryData = React.useMemo(() => {
    const counts = {};
    products.forEach(p => {
      counts[p.category] = (counts[p.category] || 0) + 1;
    });
    return Object.keys(counts).map(cat => ({
      name: cat,
      value: counts[cat]
    }));
  }, [products]);

  const COLORS = ['#4f46e5', '#8b5cf6', '#06b6d4', '#10b981', '#f59e0b', '#ec4899'];

  const pendingComplaints = complaints.filter(c => c.status !== 'Resolved').slice(0, 4);
  const openTickets = tickets.filter(t => t.status !== 'Closed').slice(0, 4);
  const recentSales = [...sales].reverse().slice(0, 5);
  const recentInteractions = [...interactions].reverse().slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Welcome & Quick Action Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            Welcome back to SmartCRM
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            KTU 3rd Sem CS OOP Project — Enterprise Relationship & Pipeline Management System.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button
            size="sm"
            variant="secondary"
            icon={Users}
            onClick={onOpenCustomerModal}
          >
            Add Customer
          </Button>
          <Button
            size="sm"
            variant="secondary"
            icon={TrendingUp}
            onClick={onOpenSaleModal}
          >
            Record Sale
          </Button>
          <Button
            size="sm"
            variant="secondary"
            icon={Clock}
            onClick={onOpenInteractionModal}
          >
            Log Touchpoint
          </Button>
          <Button
            size="sm"
            variant="primary"
            icon={LifeBuoy}
            onClick={onOpenTicketModal}
          >
            Raise Ticket
          </Button>
        </div>
      </div>

      {/* 6 Key Performance Indicator Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <StatCard
          title="Total Customers"
          value={stats.totalCustomers}
          icon={Users}
          colorScheme="blue"
          trend="+12% MoM"
          trendType="positive"
          onClick={() => onNavigate('customers')}
        />
        <StatCard
          title="Employees"
          value={stats.totalEmployees}
          icon={Briefcase}
          colorScheme="purple"
          subtitle="All Active"
          onClick={() => onNavigate('employees')}
        />
        <StatCard
          title="Product Catalog"
          value={stats.totalProducts}
          icon={ShoppingBag}
          colorScheme="emerald"
          subtitle="6 Categories"
          onClick={() => onNavigate('products')}
        />
        <StatCard
          title="Total Revenue"
          value={formatCurrency(stats.totalSalesAmount)}
          icon={TrendingUp}
          colorScheme="blue"
          trend={`${stats.totalSalesCount} Invoices`}
          trendType="positive"
          onClick={() => onNavigate('sales')}
        />
        <StatCard
          title="Pending Complaints"
          value={stats.pendingComplaintsCount}
          icon={AlertOctagon}
          colorScheme="rose"
          trend={stats.pendingComplaintsCount > 0 ? 'Needs Attention' : 'All Clear'}
          trendType={stats.pendingComplaintsCount > 0 ? 'negative' : 'positive'}
          onClick={() => onNavigate('complaints')}
        />
        <StatCard
          title="Open Tickets"
          value={stats.openTicketsCount}
          icon={LifeBuoy}
          colorScheme="amber"
          trend={`${stats.openTicketsCount} Active`}
          trendType="neutral"
          onClick={() => onNavigate('tickets')}
        />
      </div>

      {/* Charts Section: Revenue Area Chart & Product Categories */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Revenue Chart */}
        <Card className="lg:col-span-2">
          <CardHeader
            title="Sales & Revenue Growth"
            subtitle="Monthly gross billing volume in INR"
            action={
              <button
                onClick={() => onNavigate('reports')}
                className="text-xs font-semibold text-brand-600 hover:text-brand-700 flex items-center gap-1"
              >
                <span>View Full Reports</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            }
          />
          <CardContent>
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={salesByMonth} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#4f46e5" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="month" stroke="#94a3b8" fontSize={12} tickLine={false} />
                  <YAxis
                    stroke="#94a3b8"
                    fontSize={11}
                    tickLine={false}
                    tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`}
                  />
                  <Tooltip
                    formatter={(value) => [formatCurrency(value), 'Revenue']}
                    labelFormatter={(label) => `Month: ${label}`}
                    contentStyle={{ backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0' }}
                  />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke="#4f46e5"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#colorRev)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Product Category Breakdown */}
        <Card>
          <CardHeader
            title="Product Mix"
            subtitle="Inventory distribution across solutions"
          />
          <CardContent>
            <div className="h-72 w-full flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="45%"
                    innerRadius={55}
                    outerRadius={80}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value, name) => [`${value} SKUs`, name]} />
                  <Legend
                    verticalAlign="bottom"
                    iconType="circle"
                    iconSize={8}
                    wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Two Columns: Recent Interactions & Recent Sales */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Customer Interactions */}
        <Card>
          <CardHeader
            title="Recent Customer Interactions"
            subtitle="Latest meetings, phone calls and discussions"
            action={
              <button
                onClick={() => onNavigate('interactions')}
                className="text-xs font-semibold text-brand-600 hover:text-brand-700 flex items-center gap-1"
              >
                <span>View All</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            }
          />
          <CardContent className="space-y-3">
            {recentInteractions.map(item => {
              const cust = customers.find(c => c.id === item.customerId);
              const emp = employees.find(e => e.id === item.employeeId);
              return (
                <div
                  key={item.id}
                  className="p-3.5 rounded-xl border border-slate-100 hover:border-slate-200 bg-slate-50/50 hover:bg-slate-50 transition-all flex items-start justify-between gap-3"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-sm text-slate-800">
                        {cust ? cust.name : item.customerId}
                      </span>
                      <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-brand-50 text-brand-700">
                        {item.type}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 line-clamp-1">{item.notes}</p>
                    <p className="text-[11px] text-slate-400">
                      Staff: {emp ? emp.name : item.employeeId} • {formatDateTime(item.date)}
                    </p>
                  </div>
                  <span className="shrink-0 text-[11px] font-medium text-slate-600 bg-white border border-slate-200 px-2 py-1 rounded-md">
                    {item.outcome}
                  </span>
                </div>
              );
            })}
          </CardContent>
        </Card>

        {/* Recent Sales Transactions */}
        <Card>
          <CardHeader
            title="Recent Sales Invoices"
            subtitle="Latest revenue generation records"
            action={
              <button
                onClick={() => onNavigate('sales')}
                className="text-xs font-semibold text-brand-600 hover:text-brand-700 flex items-center gap-1"
              >
                <span>View All</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            }
          />
          <CardContent className="space-y-3">
            {recentSales.map(sale => {
              const cust = customers.find(c => c.id === sale.customerId);
              const prod = products.find(p => p.id === sale.productId);
              return (
                <div
                  key={sale.id}
                  className="p-3.5 rounded-xl border border-slate-100 hover:border-slate-200 bg-slate-50/50 hover:bg-slate-50 transition-all flex items-center justify-between gap-3"
                >
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-xs text-slate-500 font-mono">{sale.id}</span>
                      <span className="font-semibold text-sm text-slate-800">{cust ? cust.name : sale.customerId}</span>
                    </div>
                    <p className="text-xs text-slate-600">
                      {prod ? prod.name : sale.productId} ({sale.quantity}x)
                    </p>
                    <p className="text-[11px] text-slate-400">{formatDate(sale.date)} • {sale.paymentMethod}</p>
                  </div>

                  <div className="text-right shrink-0">
                    <p className="text-sm font-bold text-slate-900">{formatCurrency(sale.totalAmount)}</p>
                    <span className={`inline-block px-2 py-0.5 rounded-full text-[11px] font-medium border mt-1 ${getStatusBadgeColor(sale.paymentStatus)}`}>
                      {sale.paymentStatus}
                    </span>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      </div>

      {/* Pending Support & Unresolved Complaints Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Unresolved Complaints */}
        <Card>
          <CardHeader
            title="Active Customer Complaints"
            subtitle="Unresolved grievances needing immediate action"
            action={
              <button
                onClick={() => onNavigate('complaints')}
                className="text-xs font-semibold text-brand-600 hover:text-brand-700 flex items-center gap-1"
              >
                <span>Manage</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            }
          />
          <CardContent className="space-y-3">
            {pendingComplaints.length === 0 ? (
              <div className="text-center py-6 text-sm text-slate-400">
                <CheckCircle2 className="w-8 h-8 mx-auto text-emerald-500 mb-2" />
                No pending customer complaints!
              </div>
            ) : (
              pendingComplaints.map(comp => {
                const cust = customers.find(c => c.id === comp.customerId);
                return (
                  <div key={comp.id} className="p-3.5 rounded-xl border border-rose-100 bg-rose-50/30 flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-sm text-slate-900">{comp.title}</span>
                        <span className={`px-2 py-0.5 rounded text-[11px] font-semibold border ${getPriorityBadgeColor(comp.priority)}`}>
                          {comp.priority}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 mt-1">{cust ? cust.name : comp.customerId} • Category: {comp.category}</p>
                      <p className="text-[11px] text-slate-400 mt-0.5">Date: {formatDate(comp.date)}</p>
                    </div>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium border shrink-0 ${getStatusBadgeColor(comp.status)}`}>
                      {comp.status}
                    </span>
                  </div>
                );
              })
            )}
          </CardContent>
        </Card>

        {/* Open Support Tickets */}
        <Card>
          <CardHeader
            title="Open Helpdesk Tickets"
            subtitle="Customer support tickets currently in queue"
            action={
              <button
                onClick={() => onNavigate('tickets')}
                className="text-xs font-semibold text-brand-600 hover:text-brand-700 flex items-center gap-1"
              >
                <span>Helpdesk</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            }
          />
          <CardContent className="space-y-3">
            {openTickets.length === 0 ? (
              <div className="text-center py-6 text-sm text-slate-400">
                <CheckCircle2 className="w-8 h-8 mx-auto text-emerald-500 mb-2" />
                All support tickets resolved!
              </div>
            ) : (
              openTickets.map(ticket => {
                const cust = customers.find(c => c.id === ticket.customerId);
                const assigned = employees.find(e => e.id === ticket.assignedEmployeeId);
                return (
                  <div key={ticket.id} className="p-3.5 rounded-xl border border-slate-200 bg-white flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-sm text-slate-900">{ticket.subject}</span>
                        <span className={`px-2 py-0.5 rounded text-[11px] font-semibold border ${getPriorityBadgeColor(ticket.priority)}`}>
                          {ticket.priority}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 mt-1">
                        Client: {cust ? cust.name : ticket.customerId} • Assignee: {assigned ? assigned.name : 'Unassigned'}
                      </p>
                      <p className="text-[11px] text-slate-400 mt-0.5">Category: {ticket.category} • {formatDate(ticket.date)}</p>
                    </div>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium border shrink-0 ${getStatusBadgeColor(ticket.status)}`}>
                      {ticket.status}
                    </span>
                  </div>
                );
              })
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
