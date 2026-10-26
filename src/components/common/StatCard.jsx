import React from 'react';
import { Card } from './Card';

export function StatCard({
  title,
  value,
  icon: Icon,
  trend,
  trendType = 'positive', // 'positive' | 'negative' | 'neutral'
  subtitle,
  colorScheme = 'blue', // 'blue' | 'purple' | 'emerald' | 'amber' | 'rose'
  onClick
}) {
  const colorMap = {
    blue: {
      bg: 'bg-blue-50 text-blue-600',
      border: 'hover:border-blue-300'
    },
    purple: {
      bg: 'bg-purple-50 text-purple-600',
      border: 'hover:border-purple-300'
    },
    emerald: {
      bg: 'bg-emerald-50 text-emerald-600',
      border: 'hover:border-emerald-300'
    },
    amber: {
      bg: 'bg-amber-50 text-amber-600',
      border: 'hover:border-amber-300'
    },
    rose: {
      bg: 'bg-rose-50 text-rose-600',
      border: 'hover:border-rose-300'
    }
  };

  const scheme = colorMap[colorScheme] || colorMap.blue;

  return (
    <Card
      hover={!!onClick}
      onClick={onClick}
      className={`p-5 ${onClick ? 'cursor-pointer' : ''} ${scheme.border} transition-all duration-200`}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">{title}</p>
          <h4 className="text-2xl font-bold text-slate-900 mt-2 tracking-tight">{value}</h4>
        </div>
        <div className={`p-3 rounded-xl ${scheme.bg} shrink-0`}>
          {Icon && <Icon className="w-5 h-5" />}
        </div>
      </div>

      {(trend || subtitle) && (
        <div className="mt-3.5 flex items-center gap-2 text-xs">
          {trend && (
            <span
              className={`font-semibold px-1.5 py-0.5 rounded ${
                trendType === 'positive'
                  ? 'bg-emerald-50 text-emerald-700'
                  : trendType === 'negative'
                  ? 'bg-rose-50 text-rose-700'
                  : 'bg-slate-100 text-slate-600'
              }`}
            >
              {trend}
            </span>
          )}
          {subtitle && <span className="text-slate-500">{subtitle}</span>}
        </div>
      )}
    </Card>
  );
}
