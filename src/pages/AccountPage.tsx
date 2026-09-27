import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  User, 
  MapPin, 
  Package, 
  Heart, 
  ShieldCheck, 
  LogOut, 
  Plus, 
  Trash2, 
  Edit, 
  CheckCircle2,
  Lock,
  Phone,
  Mail,
  FileText
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { DeliveryAddress, Order } from '../types';
import { formatCurrency, formatDate, formatReceiptTime } from '../lib/utils';
import { ShopReceiptModal } from '../components/receipt/ShopReceiptModal';

export const AccountPage: React.FC = () => {
  const { 
    user, 
    logout, 
    addresses, 
    addAddress, 
    deleteAddress, 
    setDefaultAddress,
    orders,
    wishlist,
    setIsAuthModalOpen,
    isAdmin,
    setIsAdmin
  } = useStore();

  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'profile' | 'addresses' | 'security'>('profile');
  const [selectedReceiptOrder, setSelectedReceiptOrder] = useState<Order | null>(null);

  // New address state
  const [showAddAddressModal, setShowAddAddressModal] = useState(false);
  const [recipientName, setRecipientName] = useState(user?.fullName || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [streetAddress, setStreetAddress] = useState('');
  const [landmark, setLandmark] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [label, setLabel] = useState<'Home' | 'Work' | 'Other'>('Home');

  if (!user) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center space-y-4">
        <User className="w-12 h-12 text-stone-400 mx-auto" />
        <h2 className="font-serif text-2xl font-bold">Please Sign In</h2>
        <p className="text-xs text-muted">
          Sign in to view your orders, saved delivery addresses, and account details.
        </p>
        <button
          onClick={() => setIsAuthModalOpen(true)}
          className="px-6 py-2.5 bg-brand-crimson text-white rounded-lg text-xs font-semibold hover:bg-brand-crimson-dark shadow-sm"
        >
          Sign In / Register
        </button>
      </div>
    );
  }

  const handleSaveAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!streetAddress || !postalCode) return;

    addAddress({
      recipientName: recipientName || user.fullName,
      phone: phone || user.phone,
      streetAddress,
      landmark,
      city: 'Madurai',
      state: 'Tamil Nadu',
      postalCode,
      label,
      isDefault: addresses.length === 0,
    });

    setStreetAddress('');
    setLandmark('');
    setPostalCode('');
    setShowAddAddressModal(false);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
      {/* Top Banner */}
      <div className="bg-white rounded-2xl p-6 border border-surface-border shadow-subtle flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-brand-crimson-tint text-brand-crimson border-2 border-brand-crimson/20 flex items-center justify-center font-serif text-2xl font-bold">
            {user.fullName ? user.fullName[0].toUpperCase() : 'B'}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-serif text-xl sm:text-2xl font-bold text-obsidian">
                {user.fullName}
              </h1>
              {isAdmin && (
                <span className="bg-brand-crimson text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase">
                  Admin
                </span>
              )}
            </div>
            <p className="text-xs text-muted mt-0.5">{user.email} • {user.phone}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {isAdmin ? (
            <Link
              to="/admin"
              className="px-4 py-2 bg-stone-900 text-white rounded-lg text-xs font-semibold hover:bg-stone-800 transition-colors shadow-xs"
            >
              Open Admin Dashboard
            </Link>
          ) : (
            <button
              onClick={() => setIsAdmin(true)}
              className="px-3 py-1.5 bg-brand-crimson-tint text-brand-crimson rounded-lg text-xs font-semibold hover:bg-red-100 transition-colors"
            >
              Switch to Admin View (Demo)
            </button>
          )}

          <button
            onClick={() => {
              logout();
              navigate('/');
            }}
            className="p-2 text-stone-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            title="Sign Out"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Tabs Layout */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
        {/* Left Nav */}
        <div className="md:col-span-3 bg-white rounded-2xl border border-surface-border p-3 shadow-subtle space-y-1 text-xs">
          <button
            onClick={() => setActiveTab('profile')}
            className={`w-full text-left px-3 py-2.5 rounded-xl font-semibold flex items-center gap-2.5 transition-colors ${
              activeTab === 'profile' ? 'bg-brand-crimson text-white shadow-xs' : 'text-stone-700 hover:bg-stone-50'
            }`}
          >
            <User className="w-4 h-4" />
            <span>Profile Overview</span>
          </button>

          <button
            onClick={() => setActiveTab('addresses')}
            className={`w-full text-left px-3 py-2.5 rounded-xl font-semibold flex items-center gap-2.5 transition-colors ${
              activeTab === 'addresses' ? 'bg-brand-crimson text-white shadow-xs' : 'text-stone-700 hover:bg-stone-50'
            }`}
          >
            <MapPin className="w-4 h-4" />
            <span>Saved Addresses ({addresses.length})</span>
          </button>

          <Link
            to="/orders"
            className="w-full text-left px-3 py-2.5 rounded-xl font-semibold flex items-center justify-between text-stone-700 hover:bg-stone-50 transition-colors"
          >
            <div className="flex items-center gap-2.5">
              <Package className="w-4 h-4" />
              <span>Orders History</span>
            </div>
            <span className="text-[11px] bg-stone-100 px-2 py-0.5 rounded-full">{orders.length}</span>
          </Link>

          <Link
            to="/wishlist"
            className="w-full text-left px-3 py-2.5 rounded-xl font-semibold flex items-center justify-between text-stone-700 hover:bg-stone-50 transition-colors"
          >
            <div className="flex items-center gap-2.5">
              <Heart className="w-4 h-4" />
              <span>Saved Wishlist</span>
            </div>
            <span className="text-[11px] bg-stone-100 px-2 py-0.5 rounded-full">{wishlist.length}</span>
          </Link>

          <button
            onClick={() => setActiveTab('security')}
            className={`w-full text-left px-3 py-2.5 rounded-xl font-semibold flex items-center gap-2.5 transition-colors ${
              activeTab === 'security' ? 'bg-brand-crimson text-white shadow-xs' : 'text-stone-700 hover:bg-stone-50'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Security & Login</span>
          </button>
        </div>

        {/* Right Content */}
        <div className="md:col-span-9 bg-white rounded-2xl border border-surface-border p-6 shadow-subtle">
          {activeTab === 'profile' && (
            <div className="space-y-6">
              <h2 className="font-serif text-xl font-bold text-obsidian border-b border-surface-border pb-3">
                Customer Profile Information
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-4 bg-stone-50 rounded-xl border border-surface-border space-y-1">
                  <span className="text-muted text-[11px] font-medium">Full Name</span>
                  <p className="font-bold text-stone-900 text-sm">{user.fullName}</p>
                </div>

                <div className="p-4 bg-stone-50 rounded-xl border border-surface-border space-y-1">
                  <span className="text-muted text-[11px] font-medium">Email Address</span>
                  <p className="font-bold text-stone-900 text-sm">{user.email}</p>
                </div>

                <div className="p-4 bg-stone-50 rounded-xl border border-surface-border space-y-1">
                  <span className="text-muted text-[11px] font-medium">Phone Number</span>
                  <p className="font-bold text-stone-900 text-sm">{user.phone}</p>
                </div>

                <div className="p-4 bg-stone-50 rounded-xl border border-surface-border space-y-1">
                  <span className="text-muted text-[11px] font-medium">Account Role</span>
                  <p className="font-bold text-stone-900 text-sm capitalize">{user.role}</p>
                </div>
              </div>

              {/* Quick Supermarket Metrics */}
              <div className="pt-4 border-t border-surface-border">
                <h3 className="text-xs font-bold uppercase tracking-wider text-muted mb-3">
                  Shopping Summary
                </h3>
                <div className="grid grid-cols-3 gap-3 text-center">
                  <div className="p-3 bg-stone-50 rounded-xl border border-surface-border">
                    <span className="text-xl font-bold text-brand-crimson font-serif">{orders.length}</span>
                    <p className="text-[11px] text-muted mt-0.5">Total Orders</p>
                  </div>
                  <div className="p-3 bg-stone-50 rounded-xl border border-surface-border">
                    <span className="text-xl font-bold text-supermarket-fresh font-serif">{wishlist.length}</span>
                    <p className="text-[11px] text-muted mt-0.5">Saved Items</p>
                  </div>
                  <div className="p-3 bg-stone-50 rounded-xl border border-surface-border">
                    <span className="text-xl font-bold text-obsidian font-serif">{addresses.length}</span>
                    <p className="text-[11px] text-muted mt-0.5">Addresses</p>
                  </div>
                </div>
              </div>

              {/* Recent Orders & Digital Real Shop Bills */}
              <div className="pt-4 border-t border-surface-border space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-stone-800 flex items-center gap-1.5">
                    <FileText className="w-4 h-4 text-brand-crimson" />
                    <span>Recent Supermarket Orders &amp; Bills</span>
                  </h3>
                  <Link to="/orders" className="text-xs font-semibold text-brand-crimson hover:underline">
                    View All ({orders.length}) &rarr;
                  </Link>
                </div>

                {orders.length === 0 ? (
                  <p className="text-xs text-muted">No orders placed yet.</p>
                ) : (
                  <div className="space-y-2.5">
                    {orders.slice(0, 3).map((ord) => (
                      <div
                        key={ord.id}
                        className="p-3.5 bg-stone-50 rounded-xl border border-surface-border flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                      >
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-obsidian text-xs">#{ord.orderNumber}</span>
                            <span className="text-[10px] font-bold px-2 py-0.2 rounded-full bg-emerald-100 text-emerald-800 uppercase">
                              {ord.status.replace(/_/g, ' ')}
                            </span>
                          </div>
                          <p className="text-[11px] text-muted">
                            {formatDate(ord.createdAt)} ({formatReceiptTime(ord.createdAt)} IST) • {ord.items.length} items
                          </p>
                        </div>

                        <div className="flex items-center gap-2.5 shrink-0">
                          <span className="font-bold text-sm text-obsidian font-serif">
                            {formatCurrency(ord.total)}
                          </span>
                          <button
                            onClick={() => setSelectedReceiptOrder(ord)}
                            className="px-3 py-1.5 bg-brand-crimson hover:bg-brand-crimson-dark text-white rounded-lg font-bold text-xs flex items-center gap-1 shadow-2xs transition-all active:scale-95"
                          >
                            <FileText className="w-3.5 h-3.5" />
                            <span>View Bill</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'addresses' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-surface-border pb-3">
                <div>
                  <h2 className="font-serif text-xl font-bold text-obsidian">
                    Saved Delivery Addresses
                  </h2>
                  <p className="text-xs text-muted">Manage your home, office, and family delivery locations.</p>
                </div>
                <button
                  onClick={() => setShowAddAddressModal(true)}
                  className="px-3.5 py-2 bg-brand-crimson text-white rounded-lg text-xs font-semibold hover:bg-brand-crimson-dark flex items-center gap-1.5 shadow-xs"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Address</span>
                </button>
              </div>

              {addresses.length === 0 ? (
                <p className="text-xs text-muted text-center py-8">No saved delivery addresses found.</p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {addresses.map((addr) => (
                    <div
                      key={addr.id}
                      className={`p-4 rounded-xl border text-xs relative flex flex-col justify-between space-y-3 ${
                        addr.isDefault 
                          ? 'border-brand-crimson bg-brand-crimson-tint/20 ring-1 ring-brand-crimson/20' 
                          : 'border-surface-border bg-stone-50/50'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-stone-900 text-sm">{addr.recipientName}</span>
                          <span className="text-[10px] font-semibold bg-stone-200/80 px-2 py-0.5 rounded">
                            {addr.label}
                          </span>
                        </div>
                        <p className="text-stone-700 mt-1 leading-relaxed">
                          {addr.streetAddress}, {addr.landmark && `${addr.landmark}, `}{addr.city} – {addr.postalCode}
                        </p>
                        <p className="text-muted text-[11px] mt-1">Phone: {addr.phone}</p>
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-surface-border/60">
                        {addr.isDefault ? (
                          <span className="text-[11px] font-bold text-brand-crimson flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Default Address</span>
                          </span>
                        ) : (
                          <button
                            onClick={() => setDefaultAddress(addr.id!)}
                            className="text-[11px] text-stone-600 hover:text-brand-crimson font-medium"
                          >
                            Set as Default
                          </button>
                        )}

                        <button
                          onClick={() => deleteAddress(addr.id!)}
                          className="text-stone-400 hover:text-red-600 p-1"
                          aria-label="Delete address"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Add Address Form Modal */}
              {showAddAddressModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs">
                  <div className="bg-white rounded-2xl p-6 max-w-md w-full border border-surface-border shadow-2xl space-y-4">
                    <h3 className="font-bold text-sm text-obsidian">Add New Supermarket Address</h3>
                    <form onSubmit={handleSaveAddress} className="space-y-3 text-xs">
                      <div>
                        <label className="block font-medium text-stone-700 mb-1">Recipient Name</label>
                        <input
                          type="text"
                          required
                          value={recipientName}
                          onChange={(e) => setRecipientName(e.target.value)}
                          className="w-full px-3 py-2 border border-surface-border rounded-lg"
                        />
                      </div>
                      <div>
                        <label className="block font-medium text-stone-700 mb-1">Mobile Phone</label>
                        <input
                          type="tel"
                          required
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          className="w-full px-3 py-2 border border-surface-border rounded-lg"
                        />
                      </div>
                      <div>
                        <label className="block font-medium text-stone-700 mb-1">Street Address</label>
                        <input
                          type="text"
                          required
                          value={streetAddress}
                          onChange={(e) => setStreetAddress(e.target.value)}
                          placeholder="Door No, Street Name, Area"
                          className="w-full px-3 py-2 border border-surface-border rounded-lg"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block font-medium text-stone-700 mb-1">Landmark</label>
                          <input
                            type="text"
                            value={landmark}
                            onChange={(e) => setLandmark(e.target.value)}
                            className="w-full px-3 py-2 border border-surface-border rounded-lg"
                          />
                        </div>
                        <div>
                          <label className="block font-medium text-stone-700 mb-1">Postal Pincode</label>
                          <input
                            type="text"
                            required
                            maxLength={6}
                            value={postalCode}
                            onChange={(e) => setPostalCode(e.target.value)}
                            placeholder="625001"
                            className="w-full px-3 py-2 border border-surface-border rounded-lg"
                          />
                        </div>
                      </div>

                      <div className="flex gap-2 pt-2">
                        <button
                          type="submit"
                          className="flex-1 py-2 bg-brand-crimson text-white rounded-lg font-semibold hover:bg-brand-crimson-dark"
                        >
                          Save Address
                        </button>
                        <button
                          type="button"
                          onClick={() => setShowAddAddressModal(false)}
                          className="px-4 py-2 border border-surface-border rounded-lg text-stone-700 hover:bg-stone-50"
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'security' && (
            <div className="space-y-6">
              <h2 className="font-serif text-xl font-bold text-obsidian border-b border-surface-border pb-3">
                Security & Supabase Auth
              </h2>

              <div className="space-y-4 text-xs">
                <div className="p-4 bg-stone-50 rounded-xl border border-surface-border space-y-2">
                  <span className="font-bold text-stone-900 flex items-center gap-1.5">
                    <Lock className="w-4 h-4 text-brand-crimson" />
                    <span>Password & Session</span>
                  </span>
                  <p className="text-muted leading-relaxed">
                    Authentication is backed by Supabase Auth with encrypted sessions and Row Level Security (RLS) enforcement.
                  </p>
                  <button
                    type="button"
                    onClick={() => alert('Password reset verification email dispatched to ' + user.email)}
                    className="px-3 py-1.5 bg-white border border-surface-border rounded-lg font-semibold text-stone-700 hover:bg-stone-100"
                  >
                    Change Password
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Digital Real Shop Bill Modal */}
      <ShopReceiptModal
        order={selectedReceiptOrder}
        isOpen={Boolean(selectedReceiptOrder)}
        onClose={() => setSelectedReceiptOrder(null)}
      />
    </div>
  );
};
