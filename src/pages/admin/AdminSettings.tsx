import React, { useState } from 'react';
import { Settings as SettingsIcon, Check, ShieldCheck, Store } from 'lucide-react';
import { useStore } from '../../context/StoreContext';

export const AdminSettings: React.FC = () => {
  const { settings, updateSettings } = useStore();
  const [storeName, setStoreName] = useState(settings.storeName);
  const [storeAddress, setStoreAddress] = useState(settings.storeAddress);
  const [phone, setPhone] = useState(settings.phone);
  const [whatsapp, setWhatsapp] = useState(settings.whatsapp);
  const [email, setEmail] = useState(settings.email);
  const [openingHours, setOpeningHours] = useState(settings.openingHours);
  const [minOrderForFreeDelivery, setMinOrderForFreeDelivery] = useState(settings.minOrderForFreeDelivery);
  const [standardDeliveryFee, setStandardDeliveryFee] = useState(settings.standardDeliveryFee);
  const [codEnabled, setCodEnabled] = useState(settings.codEnabled);
  const [onlinePaymentEnabled, setOnlinePaymentEnabled] = useState(settings.onlinePaymentEnabled);
  const [storePickupEnabled, setStorePickupEnabled] = useState(settings.storePickupEnabled);
  const [gstin, setGstin] = useState(settings.gstin);
  const [saved, setSaved] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings({
      storeName,
      storeAddress,
      phone,
      whatsapp,
      email,
      openingHours,
      minOrderForFreeDelivery: Number(minOrderForFreeDelivery),
      standardDeliveryFee: Number(standardDeliveryFee),
      codEnabled,
      onlinePaymentEnabled,
      storePickupEnabled,
      gstin,
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-serif text-2xl font-bold text-obsidian">Supermarket Business Settings</h2>
          <p className="text-xs text-muted mt-0.5">Configure delivery charges, business hours, and payment channels.</p>
        </div>
        {saved && (
          <span className="text-xs text-supermarket-fresh font-bold flex items-center gap-1 bg-green-50 px-3 py-1.5 rounded-full border border-green-200">
            <Check className="w-4 h-4" />
            <span>Settings Saved!</span>
          </span>
        )}
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-6 border border-surface-border shadow-subtle space-y-6 text-xs">
        {/* Basic Store Info */}
        <div className="space-y-4">
          <h3 className="font-bold text-sm text-obsidian pb-2 border-b border-surface-border">
            Store Identity & Registration
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-medium text-stone-700 mb-1">Supermarket Brand Name</label>
              <input
                type="text"
                value={storeName}
                onChange={(e) => setStoreName(e.target.value)}
                className="w-full px-3 py-2 border border-surface-border rounded-lg"
              />
            </div>
            <div>
              <label className="block font-medium text-stone-700 mb-1">GSTIN Tax Registration</label>
              <input
                type="text"
                value={gstin}
                onChange={(e) => setGstin(e.target.value)}
                className="w-full px-3 py-2 border border-surface-border rounded-lg"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block font-medium text-stone-700 mb-1">Physical Store Address</label>
              <input
                type="text"
                value={storeAddress}
                onChange={(e) => setStoreAddress(e.target.value)}
                className="w-full px-3 py-2 border border-surface-border rounded-lg"
              />
            </div>
          </div>
        </div>

        {/* Contact & Hours */}
        <div className="space-y-4 pt-2 border-t border-surface-border">
          <h3 className="font-bold text-sm text-obsidian pb-2 border-b border-surface-border">
            Contact Channels & Hours
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block font-medium text-stone-700 mb-1">Store Phone Helpline</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3 py-2 border border-surface-border rounded-lg"
              />
            </div>
            <div>
              <label className="block font-medium text-stone-700 mb-1">WhatsApp Helpline</label>
              <input
                type="text"
                value={whatsapp}
                onChange={(e) => setWhatsapp(e.target.value)}
                className="w-full px-3 py-2 border border-surface-border rounded-lg"
              />
            </div>
            <div>
              <label className="block font-medium text-stone-700 mb-1">Customer Support Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border border-surface-border rounded-lg"
              />
            </div>
            <div className="sm:col-span-3">
              <label className="block font-medium text-stone-700 mb-1">Supermarket Business Hours</label>
              <input
                type="text"
                value={openingHours}
                onChange={(e) => setOpeningHours(e.target.value)}
                className="w-full px-3 py-2 border border-surface-border rounded-lg"
              />
            </div>
          </div>
        </div>

        {/* Delivery & Fees */}
        <div className="space-y-4 pt-2 border-t border-surface-border">
          <h3 className="font-bold text-sm text-obsidian pb-2 border-b border-surface-border">
            Delivery Fees & Thresholds
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-medium text-stone-700 mb-1">
                Minimum Cart Value for FREE Delivery (₹)
              </label>
              <input
                type="number"
                value={minOrderForFreeDelivery}
                onChange={(e) => setMinOrderForFreeDelivery(Number(e.target.value))}
                className="w-full px-3 py-2 border border-surface-border rounded-lg"
              />
            </div>
            <div>
              <label className="block font-medium text-stone-700 mb-1">
                Standard Delivery Charge (₹)
              </label>
              <input
                type="number"
                value={standardDeliveryFee}
                onChange={(e) => setStandardDeliveryFee(Number(e.target.value))}
                className="w-full px-3 py-2 border border-surface-border rounded-lg"
              />
            </div>
          </div>
        </div>

        {/* Payment & Fulfillment Toggles */}
        <div className="space-y-3 pt-2 border-t border-surface-border">
          <h3 className="font-bold text-sm text-obsidian pb-2 border-b border-surface-border">
            Active Payment & Fulfillment Channels
          </h3>

          <div className="space-y-2">
            <label className="flex items-center gap-3 cursor-pointer p-2 rounded-lg hover:bg-stone-50">
              <input
                type="checkbox"
                checked={codEnabled}
                onChange={(e) => setCodEnabled(e.target.checked)}
                className="text-brand-crimson focus:ring-brand-crimson"
              />
              <div>
                <span className="font-semibold text-stone-900 block">Cash on Delivery (COD)</span>
                <span className="text-muted text-[11px]">Allow customers to pay upon receiving supermarket delivery</span>
              </div>
            </label>

            <label className="flex items-center gap-3 cursor-pointer p-2 rounded-lg hover:bg-stone-50">
              <input
                type="checkbox"
                checked={onlinePaymentEnabled}
                onChange={(e) => setOnlinePaymentEnabled(e.target.checked)}
                className="text-brand-crimson focus:ring-brand-crimson"
              />
              <div>
                <span className="font-semibold text-stone-900 block">Online Payment (Razorpay, Paytm, PhonePe)</span>
                <span className="text-muted text-[11px]">Allow instant UPI, QR, and Card payments</span>
              </div>
            </label>

            <label className="flex items-center gap-3 cursor-pointer p-2 rounded-lg hover:bg-stone-50">
              <input
                type="checkbox"
                checked={storePickupEnabled}
                onChange={(e) => setStorePickupEnabled(e.target.checked)}
                className="text-brand-crimson focus:ring-brand-crimson"
              />
              <div>
                <span className="font-semibold text-stone-900 block">Click & Collect (In-Store Pickup)</span>
                <span className="text-muted text-[11px]">Allow customers to order online and collect in physical supermarket</span>
              </div>
            </label>
          </div>
        </div>

        <div className="pt-4 border-t border-surface-border">
          <button
            type="submit"
            className="px-6 py-2.5 bg-brand-crimson hover:bg-brand-crimson-dark text-white rounded-xl font-semibold shadow-sm transition-colors"
          >
            Save Store Configuration
          </button>
        </div>
      </form>
    </div>
  );
};
