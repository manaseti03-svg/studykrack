'use client';

/**
 * Scholaris Icon: Standardized Material Symbols wrapper.
 * Ensures consistent sizing and fallback accessibility.
 */
interface IconProps {
  name: string;
  className?: string;
}

export default function Icon({ name, className = "" }: IconProps) {
  return (
    <span 
      className={`material-symbols-outlined select-none transition-colors duration-300 ${className}`}
      aria-hidden="true"
    >
      {name}
    </span>
  );
}
