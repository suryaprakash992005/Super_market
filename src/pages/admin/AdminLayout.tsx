import React, { useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Package, 
  Layers, 
  Boxes, 
  ShoppingBag, 
  Image as ImageIcon, 
  Settings as SettingsIcon, 
  ArrowLeft,
  Menu,
  X,
  Store
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { cn } from '../../lib/utils';

export const AdminLayout: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAdmin, user } = useStore();
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  const navLinks = [
    { label: 'Dashboard', path: '/admin', icon: LayoutDashboard },
    { label: 'Products Catalog', path: '/admin/products', icon: Package },
    { label: 'Categories / Aisles', path: '/admin/categories', icon: Layers },
    { label: 'Inventory & Stock', path: '/admin/inventory', icon: Boxes },
    { label: 'Order Pipeline', path: '/admin/orders', icon: ShoppingBag },
    { label: 'Cloudflare R2 Media', path: '/admin/media', icon: ImageIcon },
    { label: 'Store Settings', path: '/admin/settings', icon: SettingsIcon },
  ];

  const currentPage = navLinks.find(n => n.path === location.pathname)?.label || 'Admin';

  const SidebarContent = () => (
    <>
      <div>
        {/* Brand header */}
        <div className="p-5 border-b border-stone-800 flex items-center justify-between">
          <Link to="/admin" className="flex items-center gap-2.5" onClick={() => setIsMobileSidebarOpen(false)}>
            <div className="w-8 h-8 rounded-lg bg-brand-crimson text-white flex items-center justify-center font-serif font-bold text-lg">
              B
            </div>
            <div>
              <span className="font-serif font-bold text-white text-base block leading-none">
                BHARATHI
              </span>
              <span className="text-[10px] uppercase font-semibold text-brand-crimson-light tracking-widest leading-none">
                Admin Console
              </span>
            </div>
          </Link>
          {/* Close button on mobile */}
          <button
            onClick={() => setIsMobileSidebarOpen(false)}
            className="md:hidden p-1.5 text-stone-400 hover:text-white rounded-lg hover:bg-stone-800 transition-colors"
            aria-label="Close navigation"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="p-3 space-y-1 text-xs">
          {navLinks.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;

            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsMobileSidebarOpen(false)}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium transition-colors',
                  isActive
                    ? 'bg-brand-crimson text-white shadow-sm font-semibold'
                    : 'text-stone-400 hover:text-white hover:bg-stone-800/60'
                )}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Footer info & exit button */}
      <div className="p-4 border-t border-stone-800 space-y-3 text-xs">
        <div className="bg-stone-900 p-3 rounded-xl border border-stone-800">
          <span className="text-[10px] text-stone-400 uppercase font-semibold block">Logged in as</span>
          <span className="font-bold text-white truncate block">{user?.email || 'Store Administrator'}</span>
          <span className="text-[10px] text-supermarket-fresh font-medium">● Supermarket Manager</span>
        </div>

        <Link
          to="/"
          className="w-full py-2 bg-stone-800 hover:bg-stone-700 text-stone-200 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Storefront</span>
        </Link>
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-stone-100 flex flex-col md:flex-row text-obsidian">
      
      {/* ── Mobile Top Bar ── */}
      <div className="md:hidden bg-obsidian text-white px-4 py-3 flex items-center justify-between shrink-0 z-30 sticky top-0">
        <button
          onClick={() => setIsMobileSidebarOpen(true)}
          className="p-2 text-stone-300 hover:text-white hover:bg-stone-800 rounded-lg transition-colors -ml-2"
          aria-label="Open navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-brand-crimson text-white flex items-center justify-center font-serif font-bold text-sm">
            B
          </div>
          <span className="font-serif font-bold text-white text-sm">{currentPage}</span>
        </div>
        <Link
          to="/"
          className="p-2 text-stone-300 hover:text-white hover:bg-stone-800 rounded-lg transition-colors -mr-2"
          aria-label="Back to storefront"
        >
          <Store className="w-5 h-5" />
        </Link>
      </div>

      {/* ── Mobile Sidebar Drawer ── */}
      {isMobileSidebarOpen && (
        <>
          {/* Backdrop */}
          <div
            className="md:hidden fixed inset-0 z-40 bg-black/60 backdrop-blur-xs"
            onClick={() => setIsMobileSidebarOpen(false)}
            aria-hidden="true"
          />
          {/* Drawer */}
          <aside className="md:hidden fixed inset-y-0 left-0 z-50 w-72 bg-obsidian text-stone-300 flex flex-col justify-between shadow-2xl animate-sheet-up overflow-y-auto">
            <SidebarContent />
          </aside>
        </>
      )}

      {/* ── Desktop Persistent Sidebar ── */}
      <aside className="hidden md:flex md:w-64 bg-obsidian text-stone-300 flex-col justify-between shrink-0">
        <SidebarContent />
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header Bar (desktop only — mobile uses the sticky top bar) */}
        <header className="hidden md:flex bg-white border-b border-surface-border px-6 py-4 items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <h1 className="font-serif text-lg font-bold text-obsidian">
              Bharathi Store Back-Office Operations
            </h1>
          </div>

          <div className="flex items-center gap-3 text-xs">
            <span className="px-2.5 py-1 bg-green-50 text-supermarket-fresh border border-green-200 rounded-full font-semibold text-[11px] flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-supermarket-fresh animate-pulse" />
              Live Supermarket Ledger
            </span>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-4 md:p-6 flex-1 overflow-x-hidden">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
