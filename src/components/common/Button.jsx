import React from 'react';

export function Button({
  children,
  type = 'button',
  variant = 'primary',
  size = 'md',
  icon: Icon,
  iconPosition = 'left',
  disabled = false,
  onClick,
  className = '',
  ...props
}) {
  const baseStyles = 'inline-flex items-center justify-center font-medium rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed select-none active:scale-[0.98]';

  const variants = {
    primary: 'bg-brand-600 hover:bg-brand-700 text-white shadow-sm focus:ring-brand-500',
    secondary: 'bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 shadow-sm focus:ring-brand-500',
    purple: 'bg-accent-600 hover:bg-accent-700 text-white shadow-sm focus:ring-accent-500',
    danger: 'bg-rose-600 hover:bg-rose-700 text-white shadow-sm focus:ring-rose-500',
    ghost: 'hover:bg-slate-100 text-slate-600 hover:text-slate-900 focus:ring-slate-400',
    outline: 'border-2 border-brand-600 text-brand-600 hover:bg-brand-50 focus:ring-brand-500'
  };

  const sizes = {
    sm: 'text-xs px-2.5 py-1.5 gap-1.5',
    md: 'text-sm px-4 py-2 gap-2',
    lg: 'text-base px-5 py-2.5 gap-2.5',
    icon: 'p-2 text-slate-500 hover:text-slate-700 rounded-lg'
  };

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`${baseStyles} ${variants[variant] || variants.primary} ${sizes[size] || sizes.md} ${className}`}
      {...props}
    >
      {Icon && iconPosition === 'left' && <Icon className="w-4 h-4 shrink-0" />}
      {children}
      {Icon && iconPosition === 'right' && <Icon className="w-4 h-4 shrink-0" />}
    </button>
  );
}
