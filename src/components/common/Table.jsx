import React from 'react';
import { Inbox } from 'lucide-react';

export function Table({
  columns,
  data,
  keyExtractor = (item) => item.id,
  emptyMessage = 'No records found',
  onRowClick,
  className = ''
}) {
  if (!data || data.length === 0) {
    return (
      <div className="py-12 px-4 text-center bg-white rounded-xl border border-slate-200">
        <div className="w-12 h-12 mx-auto rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mb-3">
          <Inbox className="w-6 h-6" />
        </div>
        <p className="text-sm font-medium text-slate-600">{emptyMessage}</p>
        <p className="text-xs text-slate-400 mt-1">Try adjusting your search or filters.</p>
      </div>
    );
  }

  return (
    <div className={`overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm ${className}`}>
      <table className="w-full text-left text-sm text-slate-600 border-collapse">
        <thead className="bg-slate-50/80 text-xs uppercase tracking-wider text-slate-500 font-semibold border-b border-slate-200">
          <tr>
            {columns.map((col, idx) => (
              <th
                key={idx}
                className={`py-3.5 px-4 ${col.align === 'right' ? 'text-right' : col.align === 'center' ? 'text-center' : 'text-left'} ${col.className || ''}`}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {data.map((item, rowIdx) => (
            <tr
              key={keyExtractor(item, rowIdx)}
              onClick={() => onRowClick && onRowClick(item)}
              className={`transition-colors ${
                onRowClick ? 'cursor-pointer hover:bg-brand-50/40' : 'hover:bg-slate-50/60'
              }`}
            >
              {columns.map((col, colIdx) => (
                <td
                  key={colIdx}
                  className={`py-3.5 px-4 ${col.align === 'right' ? 'text-right' : col.align === 'center' ? 'text-center' : 'text-left'} ${col.cellClassName || ''}`}
                >
                  {col.render ? col.render(item, rowIdx) : item[col.accessor]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
