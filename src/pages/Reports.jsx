import React, { useMemo } from 'react';
import {
  BarChart3,
  TrendingUp,
  Award,
  DollarSign,
  PieChart as PieIcon,
  ShoppingBag,
  Users,
  Calendar
} from 'lucide-react';
import { Card, CardHeader, CardContent } from '../components/common/Card';
import { useCRM } from '../context/CRMContext';
import { formatCurrency } from '../utils/formatters';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell
} from 'recharts';

export function Reports() {
  const { sales, employees, products, customers } = useCRM();

  // Top sales representatives leaderboard
  const repPerformance = useMemo(() => {
    const map = {};
    employees.forEach(e => {
      map[e.id] = { id: e.id, name: e.name, department: e.department, revenue: 0, deals: 0 };
    });

    sales.forEach(s => {
      if (map[s.employeeId]) {
        map[s.employeeId].revenue += Number(s.totalAmount) || 0;
        map[s.employeeId].deals += 1;
      }
    });

    return Object.values(map)
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5);
  }, [sales, employees]);

  // Product sales volume
  const productPerformance = useMemo(() => {
    const map = {};
    products.forEach(p => {
      map[p.id] = { name: p.name, revenue: 0, units: 0 };
    });

    sales.forEach(s => {
      if (map[s.productId]) {
        map[s.productId].revenue += Number(s.totalAmount) || 0;
        map[s.productId].units += Number(s.quantity) || 1;
      }
    });

    return Object.values(map)
      .filter(p => p.revenue > 0)
      .sort((a, b) => b.revenue - a.revenue);
  }, [sales, products]);

  // Monthly revenue breakdown
  const monthlyData = useMemo(() => {
    const map = {
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
        if (map[m]) {
          map[m].revenue += Number(s.totalAmount) || 0;
          map[m].orders += 1;
        }
      }
    });

    return Object.values(map);
  }, [sales]);

  const totalRevenue = sales.reduce((sum, s) => sum + (Number(s.totalAmount) || 0), 0);
  const avgDealSize = sales.length ? Math.round(totalRevenue / sales.length) : 0;
  const paidSales = sales.filter(s => s.paymentStatus === 'Paid');
  const collectionRate = sales.length ? Math.round((paidSales.length / sales.length) * 100) : 0;

  const COLORS = ['#4f46e5', '#8b5cf6', '#06b6d4', '#10b981', '#f59e0b', '#ec4899'];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-slate-900 tracking-tight">Sales Analytics & KPI Reports</h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Executive performance dashboard, deal conversions, and revenue analysis.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl border border-slate-200 bg-white shadow-sm">
          <p className="text-xs font-semibold text-slate-400 uppercase">Gross Pipeline Revenue</p>
          <h4 className="text-2xl font-bold text-slate-900 mt-1">{formatCurrency(totalRevenue)}</h4>
          <span className="text-[11px] text-emerald-600 font-medium">All recorded sales</span>
        </div>

        <div className="p-4 rounded-xl border border-slate-200 bg-white shadow-sm">
          <p className="text-xs font-semibold text-slate-400 uppercase">Average Order Value (AOV)</p>
          <h4 className="text-2xl font-bold text-brand-600 mt-1">{formatCurrency(avgDealSize)}</h4>
          <span className="text-[11px] text-slate-500 font-medium">Per invoice closed</span>
        </div>

        <div className="p-4 rounded-xl border border-slate-200 bg-white shadow-sm">
          <p className="text-xs font-semibold text-slate-400 uppercase">Collection Rate</p>
          <h4 className="text-2xl font-bold text-emerald-600 mt-1">{collectionRate}%</h4>
          <span className="text-[11px] text-emerald-600 font-medium">{paidSales.length} of {sales.length} invoices paid</span>
        </div>

        <div className="p-4 rounded-xl border border-slate-200 bg-white shadow-sm">
          <p className="text-xs font-semibold text-slate-400 uppercase">Total Accounts</p>
          <h4 className="text-2xl font-bold text-purple-600 mt-1">{customers.length}</h4>
          <span className="text-[11px] text-purple-600 font-medium">Active customer base</span>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Revenue Bar Chart */}
        <Card>
          <CardHeader
            title="Monthly Sales Volume"
            subtitle="Closed deals & collections over the past 6 months"
          />
          <CardContent>
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="month" stroke="#94a3b8" fontSize={12} tickLine={false} />
                  <YAxis
                    stroke="#94a3b8"
                    fontSize={11}
                    tickLine={false}
                    tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`}
                  />
                  <Tooltip
                    formatter={(val) => [formatCurrency(val), 'Revenue']}
                    contentStyle={{ backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0' }}
                  />
                  <Bar dataKey="revenue" fill="#4f46e5" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Product Revenue Leaderboard */}
        <Card>
          <CardHeader
            title="Revenue by Product Solution"
            subtitle="Highest grossing CRM modules and software"
          />
          <CardContent>
            <div className="space-y-4 pt-2">
              {productPerformance.map((item, idx) => {
                const percent = totalRevenue ? Math.round((item.revenue / totalRevenue) * 100) : 0;
                return (
                  <div key={idx} className="space-y-1">
                    <div className="flex items-center justify-between text-xs font-medium">
                      <span className="text-slate-800 font-semibold truncate max-w-xs">{item.name}</span>
                      <span className="text-slate-900 font-bold">{formatCurrency(item.revenue)} ({percent}%)</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-brand-600 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Sales Reps Leaderboard Table */}
      <Card>
        <CardHeader
          title="Sales Representative Leaderboard"
          subtitle="Top performing staff members by closed revenue"
        />
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase font-semibold text-slate-500 border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Rank & Rep</th>
                  <th className="py-3 px-4">Department</th>
                  <th className="py-3 px-4 text-center">Deals Closed</th>
                  <th className="py-3 px-4 text-right">Total Revenue Converted</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {repPerformance.map((rep, idx) => (
                  <tr key={rep.id} className="hover:bg-slate-50/60">
                    <td className="py-3 px-4 flex items-center gap-3">
                      <span className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs ${
                        idx === 0 ? 'bg-amber-100 text-amber-800' : idx === 1 ? 'bg-slate-200 text-slate-700' : 'bg-slate-100 text-slate-600'
                      }`}>
                        {idx + 1}
                      </span>
                      <div>
                        <span className="font-semibold text-slate-900 block">{rep.name}</span>
                        <span className="text-[10px] text-slate-400 font-mono">{rep.id}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-xs text-slate-600">
                      <span className="px-2 py-0.5 rounded bg-slate-100 font-medium">
                        {rep.department}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center text-xs font-semibold text-slate-800">
                      {rep.deals} deals
                    </td>
                    <td className="py-3 px-4 text-right font-bold text-slate-900 text-sm">
                      {formatCurrency(rep.revenue)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
