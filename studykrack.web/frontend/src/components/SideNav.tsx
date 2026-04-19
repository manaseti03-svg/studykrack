"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function SideNav() {
  const pathname = usePathname();

  const links = [
    { href: "/dashboard", label: "Home", icon: "home" },
    { href: "/vault", label: "Vault", icon: "inventory_2" },
    { href: "/planner", label: "Planner", icon: "calendar_month" },
    { href: "/community", label: "Community", icon: "groups" },
    { href: "/settings", label: "Identity", icon: "account_circle" },
  ];

  return (
    <div className="fixed top-0 left-0 h-screen w-20 flex flex-col justify-between items-center py-8 bg-[#050505]/80 backdrop-blur-3xl border-r border-white/5 z-50">
      <div className="flex flex-col items-center gap-6">
        <Link href="/dashboard" className="mb-4 group">
          <div className="w-12 h-12 rounded-full flex items-center justify-center p-2 group-hover:scale-110 transition-transform bg-primary/10 border border-primary/20 shadow-[0_0_15px_rgba(74,225,131,0.2)]">
            <span className="material-symbols-outlined text-primary text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>cyclone</span>
          </div>
        </Link>
        <nav className="flex flex-col gap-4">
          {links.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link 
                key={link.href} 
                href={link.href}
                className={`relative flex items-center justify-center w-12 h-12 rounded-2xl transition-all duration-300 group ${
                  isActive ? "bg-primary text-black shadow-[0_0_20px_rgba(74,225,131,0.4)]" : "text-zinc-500 hover:text-white hover:bg-white/5"
                }`}
                title={link.label}
              >
                <span className="material-symbols-outlined text-2xl group-hover:scale-110 transition-transform" style={{ fontVariationSettings: isActive ? "'FILL' 1" : "" }}>
                  {link.icon}
                </span>
                {isActive && (
                  <div className="absolute -left-3 top-1/2 -translate-y-1/2 w-1.5 h-6 bg-primary rounded-r-full shadow-[0_0_10px_rgba(74,225,131,0.5)]"></div>
                )}
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
