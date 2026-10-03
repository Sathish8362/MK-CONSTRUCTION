'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  LayoutDashboard, 
  MessageSquare, 
  FolderKanban, 
  FileEdit, 
  Settings, 
  LogOut, 
  HardHat, 
  ExternalLink, 
  Menu, 
  X, 
  Smartphone,
  ShieldCheck 
} from 'lucide-react';

interface AdminLayoutProps {
  children: React.ReactNode;
  newEnquiriesCount?: number;
}

export function AdminLayout({ children, newEnquiriesCount = 0 }: AdminLayoutProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const navItems = [
    { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { name: 'Enquiries', href: '/admin/enquiries', icon: MessageSquare, badge: newEnquiriesCount > 0 ? newEnquiriesCount : null },
    { name: 'Projects', href: '/admin/projects', icon: FolderKanban },
    { name: 'Content Editor', href: '/admin/content', icon: FileEdit },
    { name: 'Settings', href: '/admin/settings', icon: Settings },
  ];

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      document.cookie = "admin_session=; path=/; max-age=0; expires=Thu, 01 Jan 1970 00:00:00 GMT";
      router.push('/admin/login');
      router.refresh();
    } catch (e) {
      console.error("Logout error:", e);
    } finally {
      setLoggingOut(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 flex flex-col md:flex-row" suppressHydrationWarning>
      
      {/* MOBILE TOP BAR */}
      <div className="md:hidden bg-white border-b border-slate-200 px-4 py-3 flex items-center justify-between sticky top-0 z-40 pt-safe shadow-xs" suppressHydrationWarning>
        <Link href="/admin" className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-lg bg-amber-500 flex items-center justify-center text-slate-950 font-black shadow-xs">
            <HardHat className="w-5 h-5" />
          </div>
          <div>
            <span className="font-black text-slate-950 text-base tracking-wider block">
              MK <span className="text-amber-600">ADMIN</span>
            </span>
            <span className="text-[10px] text-slate-500 font-medium">Owner Control Panel</span>
          </div>
        </Link>

        <div className="flex items-center gap-2">
          {newEnquiriesCount > 0 && (
            <span className="px-2 py-0.5 rounded-full bg-rose-500 text-white text-[11px] font-bold">
              {newEnquiriesCount} New
            </span>
          )}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 min-tap-target flex items-center justify-center transition-colors"
            aria-label="Toggle Navigation"
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* SIDEBAR NAVIGATION (Desktop + Mobile Drawer) */}
      <aside suppressHydrationWarning className={`
        fixed inset-y-0 left-0 z-50 w-72 bg-white border-r border-slate-200 flex flex-col justify-between p-6 transition-transform duration-300 md:static md:translate-x-0 shadow-xs
        ${mobileOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full md:translate-x-0'}
      `}>
        <div>
          {/* Brand Header */}
          <div className="hidden md:flex items-center gap-3 mb-8 pb-6 border-b border-slate-100">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center text-slate-950 font-black shadow-md shadow-amber-500/20">
              <HardHat className="w-7 h-7 stroke-[2.2]" />
            </div>
            <div>
              <span className="font-black text-slate-950 text-lg tracking-wider block">
                MK <span className="text-amber-600">ADMIN</span>
              </span>
              <span className="text-xs text-slate-500 font-medium">Thirubuvanam, TN</span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center justify-between px-4 py-3 rounded-xl text-sm font-bold tracking-wide transition-all min-tap-target ${
                    isActive
                      ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20 scale-[1.02]'
                      : 'text-slate-600 hover:text-slate-950 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-5 h-5" />
                    <span>{item.name}</span>
                  </div>

                  {item.badge && (
                    <span className={`px-2 py-0.5 rounded-full text-xs font-black ${
                      isActive ? 'bg-slate-950 text-amber-400' : 'bg-rose-500 text-white'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom Actions */}
        <div className="pt-6 border-t border-slate-100 space-y-3">
          
          {/* View Customer Website */}
          <Link
            href="/"
            target="_blank"
            className="w-full flex items-center justify-between px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-xs font-bold text-slate-700 hover:text-slate-900 transition-colors min-tap-target"
          >
            <span>View Public Website</span>
            <ExternalLink className="w-4 h-4 text-amber-600" />
          </Link>

          {/* Logout */}
          <button
            onClick={handleLogout}
            disabled={loggingOut}
            className="w-full flex items-center justify-between px-4 py-2.5 rounded-xl border border-rose-200 bg-rose-50 hover:bg-rose-100 text-xs font-bold text-rose-700 transition-colors min-tap-target cursor-pointer"
          >
            <span>{loggingOut ? 'Signing out...' : 'Sign Out'}</span>
            <LogOut className="w-4 h-4 text-rose-600" />
          </button>

          <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-500 pt-2 font-medium">
            <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
            <span>Authenticated Owner Session</span>
          </div>

        </div>
      </aside>

      {/* Backdrop for mobile drawer */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-xs md:hidden"
        />
      )}

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 overflow-x-hidden min-h-[calc(100vh-60px)] md:min-h-screen p-4 sm:p-8 lg:p-10 pb-safe bg-[#f8fafc] text-slate-900">
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </main>

    </div>
  );
}
