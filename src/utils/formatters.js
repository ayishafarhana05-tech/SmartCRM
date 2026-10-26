/**
 * Data Formatting & Badge Color Helpers
 */

export function formatCurrency(amount, currency = 'INR') {
  const num = Number(amount) || 0;
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: currency,
    maximumFractionDigits: 0
  }).format(num);
}

export function formatDate(dateString) {
  if (!dateString) return '—';
  try {
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return dateString;
    return d.toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  } catch {
    return dateString;
  }
}

export function formatDateTime(dateTimeString) {
  if (!dateTimeString) return '—';
  try {
    const d = new Date(dateTimeString);
    if (isNaN(d.getTime())) return dateTimeString;
    return d.toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch {
    return dateTimeString;
  }
}

export function getPriorityBadgeColor(priority) {
  switch (priority?.toLowerCase()) {
    case 'urgent':
      return 'bg-red-100 text-red-800 border-red-200';
    case 'high':
      return 'bg-amber-100 text-amber-800 border-amber-200';
    case 'medium':
      return 'bg-blue-100 text-blue-800 border-blue-200';
    case 'low':
      return 'bg-slate-100 text-slate-700 border-slate-200';
    default:
      return 'bg-gray-100 text-gray-700 border-gray-200';
  }
}

export function getStatusBadgeColor(status) {
  switch (status?.toLowerCase()) {
    case 'active':
    case 'paid':
    case 'resolved':
    case 'closed':
    case 'in stock':
      return 'bg-emerald-100 text-emerald-800 border-emerald-200';
    case 'in progress':
    case 'pending':
    case 'lead':
    case 'low stock':
      return 'bg-amber-100 text-amber-800 border-amber-200';
    case 'open':
      return 'bg-blue-100 text-blue-800 border-blue-200';
    case 'inactive':
    case 'out of stock':
    case 'refunded':
      return 'bg-rose-100 text-rose-800 border-rose-200';
    case 'on leave':
      return 'bg-purple-100 text-purple-800 border-purple-200';
    default:
      return 'bg-slate-100 text-slate-700 border-slate-200';
  }
}

export function getInteractionTypeBadge(type) {
  switch (type?.toLowerCase()) {
    case 'call':
      return { bg: 'bg-indigo-50 text-indigo-700 border-indigo-200', icon: 'Phone' };
    case 'email':
      return { bg: 'bg-sky-50 text-sky-700 border-sky-200', icon: 'Mail' };
    case 'meeting':
      return { bg: 'bg-emerald-50 text-emerald-700 border-emerald-200', icon: 'Users' };
    case 'demo':
      return { bg: 'bg-purple-50 text-purple-700 border-purple-200', icon: 'Presentation' };
    default:
      return { bg: 'bg-slate-50 text-slate-700 border-slate-200', icon: 'FileText' };
  }
}
