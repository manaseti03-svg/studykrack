'use client';

import { ReactNode } from 'react';
import Link from 'next/link';

/**
 * Scholaris Button: High-viscosity interactive element.
 * Variants: Primary (Cyan Glow), Secondary (Transparent Glass), Error (Red Glow).
 */
interface ScholarisButtonProps {
  children: ReactNode;
  onClick?: () => void;
  href?: string;
  variant?: 'primary' | 'secondary' | 'error';
  className?: string;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
}

export default function ScholarisButton({
  children,
  onClick,
  href,
  variant = 'primary',
  className = "",
  type = 'button',
  disabled = false
}: ScholarisButtonProps) {
  const commonStyles = "py-4 px-8 rounded-2xl font-bold font-headline text-xs uppercase tracking-[0.3em] transition-all transform active:scale-95 disabled:opacity-50 text-center flex items-center justify-center gap-3";
  
  const variantStyles = {
    primary: "bg-surface-container-high/50 hover:bg-primary-container text-white border border-secondary/20 shadow-xl shadow-cyan-500/10 hover:shadow-cyan-500/20",
    secondary: "bg-surface-container-high/20 hover:bg-surface-container-high text-slate-300 border border-white/5",
    error: "bg-error/10 hover:bg-error/30 text-error border border-error/20"
  };

  const finalClassName = `${commonStyles} ${variantStyles[variant]} ${className}`;

  if (href) {
    return (
      <Link href={href} className={finalClassName}>
        {children}
      </Link>
    );
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={finalClassName}
    >
      {children}
    </button>
  );
}
