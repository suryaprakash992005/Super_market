import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  ShieldCheck, 
  MapPin, 
  Truck, 
  Store, 
  Clock, 
  CreditCard, 
  Banknote, 
  CheckCircle2, 
  ArrowRight,
  Plus,
  AlertCircle,
  FileText
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { PaymentModal } from '../components/payment/PaymentModal';
import { DeliveryAddress, FulfillmentMethod, PaymentMethod, Order } from '../types';
import { formatCurrency, generateOrderNumber } from '../lib/utils';
import { ShopReceiptModal } from '../components/receipt/ShopReceiptModal';

export const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const { 
    cart, 
    cartSubtotal, 
    deliveryFee, 
    couponDiscount, 
    cartTotal, 
    addresses, 
    addAddress, 
    placeOrder, 
    settings,
    user
  } = useStore();

  const [confirmedOrder, setConfirmedOrder] = useState<Order | null>(null);
  const [isReceiptModalOpen, setIsReceiptModalOpen] = useState<boolean>(false);
  const [fulfillmentMethod, setFulfillmentMethod] = useState<FulfillmentMethod>('delivery');
  const [selectedAddressId, setSelectedAddressId] = useState<string>(addresses[0]?.id || 'new');
  
  const [isAddingNewAddress, setIsAddingNewAddress] = useState<boolean>(addresses.length === 0);
  const [recipientName, setRecipientName] = useState<string>(user?.fullName || 'Karthik Subramanian');
  const [phone, setPhone] = useState<string>(user?.phone || '+91 98421 99887');
  const [email, setEmail] = useState<string>(user?.email || 'customer@bharathistore.com');
  const [streetAddress, setStreetAddress] = useState<string>('15/2, Annai Nagar, Bypass Road');
  const [landmark, setLandmark] = useState<string>('Near Meenakshi Mission Hospital');
  const [city, setCity] = useState<string>('Madurai');
  const [postalCode, setPostalCode] = useState<string>('625016');

  const [deliverySlot, setDeliverySlot] = useState<string>('Express Delivery (Within 2 Hours)');
  const [specialInstructions, setSpecialInstructions] = useState<string>('');

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cod');
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState<boolean>(false);
  const [pendingOrderRef] = useState<string>(() => generateOrderNumber());
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [formError, setFormError] = useState<string>('');

  const selectedAddress = addresses.find(a => a.id === selectedAddressId) || {
    recipientName,
    phone,
    streetAddress,
    landmark,
    city,
    state: 'Tamil Nadu',
    postalCode,
  };

  const finalDeliveryFee = fulfillmentMethod === 'store_pickup' ? 0 : deliveryFee;
  const finalTotal = Math.max(0, cartSubtotal + finalDeliveryFee - couponDiscount);

  const handleOrderSubmission = (verifiedTxnId?: string) => {
    setIsSubmitting(true);
    setFormError('');

    try {
      const order = placeOrder({
        customerName: recipientName,
        customerPhone: phone,
        customerEmail: email,
        fulfillmentMethod,
        paymentMethod: fulfillmentMethod === 'store_pickup' && paymentMethod === 'cod' ? 'pay_at_store' : paymentMethod,
        deliveryAddress: fulfillmentMethod === 'delivery' ? selectedAddress : undefined,
        deliverySlot: fulfillmentMethod === 'delivery' ? deliverySlot : 'Store Pickup Ready in 15 mins',
        specialInstructions,
        transactionId: verifiedTxnId,
      });

      setConfirmedOrder(order);
      setIsSubmitting(false);
    } catch (err: any) {
      setFormError('An error occurred while creating your order. Please try again.');
      setIsSubmitting(false);
    }
  };

  const handleInitiateOrder = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (fulfillmentMethod === 'delivery' && isAddingNewAddress) {
      if (!streetAddress || !postalCode || !phone) {
        setFormError('Please fill in complete street address, pincode, and phone number.');
        return;
      }
      addAddress({
        recipientName,
        phone,
        streetAddress,
        landmark,
        city,
        state: 'Tamil Nadu',
        postalCode,
        isDefault: true,
      });
      setIsAddingNewAddress(false);
    }

    if (paymentMethod === 'razorpay' || paymentMethod === 'paytm' || paymentMethod === 'phonepe') {
      setIsPaymentModalOpen(true);
      return;
    }

    handleOrderSubmission();
  };

  // 1. Mobile Order Confirmation Screen (Rendered AFTER all hooks are declared)
  if (confirmedOrder) {
    return (
      <div className="max-w-xl mx-auto px-4 py-8 sm:py-12 space-y-6 animate-fadeIn font-sans">
        <ShopReceiptModal
          order={confirmedOrder}
          isOpen={isReceiptModalOpen}
          onClose={() => setIsReceiptModalOpen(false)}
        />

        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/80 shadow-card text-center space-y-5">
          {/* Pulsing Success Badge */}
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-emerald-50 text-supermarket-fresh border-2 border-emerald-200 flex items-center justify-center mx-auto animate-cart-bounce">
            <CheckCircle2 className="w-8 h-8 sm:w-10 sm:h-10 text-emerald-600" />
          </div>

          <div className="space-y-1.5">
            <span className="text-[11px] font-black uppercase tracking-widest text-supermarket-fresh">
              Order Verified & Confirmed
            </span>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-obsidian tracking-tight">
              Order Confirmed!
            </h1>
            <p className="text-xs text-stone-600">
              Bharathi Supermarket is preparing your fresh grocery provisions.
            </p>
          </div>

          {/* Key Order Info Card */}
          <div className="bg-stone-50 rounded-2xl p-4 border border-stone-200/70 text-xs space-y-2.5 text-left">
            <div className="flex items-center justify-between border-b border-stone-200/70 pb-2">
              <span className="text-stone-500 font-medium">Order Reference:</span>
              <span className="font-bold text-obsidian font-mono text-sm">#{confirmedOrder.orderNumber}</span>
            </div>
            <div className="flex items-center justify-between border-b border-stone-200/70 pb-2">
              <span className="text-stone-500 font-medium">Grand Total:</span>
              <span className="font-serif font-bold text-base text-brand-crimson">{formatCurrency(confirmedOrder.total)}</span>
            </div>
            <div className="flex items-center justify-between border-b border-stone-200/70 pb-2">
              <span className="text-stone-500 font-medium">Fulfillment:</span>
              <span className="font-bold text-obsidian capitalize">
                {confirmedOrder.fulfillmentMethod === 'store_pickup' ? 'Store Pickup (Ready in 15 mins)' : 'Doorstep Delivery'}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-stone-500 font-medium">Payment Mode:</span>
              <span className="font-semibold text-stone-800 uppercase text-[11px]">
                {confirmedOrder.paymentMethod.replace(/_/g, ' ')} ({confirmedOrder.paymentStatus})
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-2.5 pt-2">
            <button
              type="button"
              onClick={() => setIsReceiptModalOpen(true)}
              className="w-full py-3.5 bg-brand-crimson hover:bg-brand-crimson-dark text-white rounded-full text-xs font-bold tracking-wider uppercase flex items-center justify-center gap-2 shadow-crimson active:scale-98 transition-all min-h-[44px]"
            >
              <FileText className="w-4 h-4" />
              <span>View Digital Shop Bill</span>
            </button>

            <button
              type="button"
              onClick={() => navigate(`/orders/${confirmedOrder.id}`)}
              className="w-full py-3.5 bg-stone-900 hover:bg-stone-800 text-white rounded-full text-xs font-bold tracking-wider uppercase flex items-center justify-center gap-2 shadow-xs active:scale-98 transition-all min-h-[44px]"
            >
              <span>Track Live Order Status</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <Link
              to="/products"
              className="w-full py-3 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-full text-xs font-semibold flex items-center justify-center transition-colors min-h-[44px]"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // 2. Empty Basket State
  if (cart.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="font-serif text-2xl sm:text-3xl font-bold">Your basket is currently empty</h2>
        <p className="text-xs text-muted">Add some provisions before proceeding to checkout.</p>
        <Link to="/products" className="px-6 py-3 bg-brand-crimson text-white rounded-full text-xs font-semibold inline-block">
          Return to Supermarket
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 space-y-8 font-sans">
      <div className="border-b border-surface-border pb-6">
        <span className="text-[11px] font-bold uppercase tracking-widest text-brand-crimson block mb-1">
          Checkout Process
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-obsidian tracking-tight">
          Delivery & Payment
        </h1>
        <p className="text-xs sm:text-sm text-stone-600 mt-1">
          Review your supermarket fulfillment details and confirm order reservation.
        </p>
      </div>

      {formError && (
        <div className="p-4 bg-red-50 text-red-700 border border-red-200 rounded-2xl text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{formError}</span>
        </div>
      )}

      <form onSubmit={handleInitiateOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start pb-28 lg:pb-0">
        {/* Left Column (8 cols) */}
        <div className="lg:col-span-8 space-y-8">
          {/* 1. Fulfillment Mode */}
          <div className="space-y-4">
            <h2 className="font-serif text-xl font-bold text-obsidian flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-stone-900 text-white flex items-center justify-center text-xs font-sans">
                1
              </span>
              <span>Fulfillment Option</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setFulfillmentMethod('delivery')}
                className={`p-5 rounded-2xl border text-left flex items-start gap-3.5 transition-all ${
                  fulfillmentMethod === 'delivery' 
                    ? 'border-brand-crimson bg-white shadow-card ring-2 ring-brand-crimson/15' 
                    : 'border-surface-border bg-white/70 hover:bg-white'
                }`}
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${fulfillmentMethod === 'delivery' ? 'bg-brand-crimson text-white' : 'bg-stone-100 text-stone-600'}`}>
                  <Truck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-obsidian uppercase tracking-wider">Doorstep Supermarket Delivery</h3>
                  <p className="text-[11px] text-stone-600 mt-1 leading-relaxed">
                    Direct delivery in insulated grocery crates within 2 hours.
                  </p>
                  <span className="text-[11px] font-bold text-supermarket-fresh mt-1.5 block">
                    {deliveryFee === 0 ? 'FREE DELIVERY' : `Standard Fee: ${formatCurrency(settings.standardDeliveryFee)}`}
                  </span>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setFulfillmentMethod('store_pickup')}
                className={`p-5 rounded-2xl border text-left flex items-start gap-3.5 transition-all ${
                  fulfillmentMethod === 'store_pickup' 
                    ? 'border-brand-crimson bg-white shadow-card ring-2 ring-brand-crimson/15' 
                    : 'border-surface-border bg-white/70 hover:bg-white'
                }`}
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${fulfillmentMethod === 'store_pickup' ? 'bg-brand-crimson text-white' : 'bg-stone-100 text-stone-600'}`}>
                  <Store className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-obsidian uppercase tracking-wider">Click & Collect (Store Pickup)</h3>
                  <p className="text-[11px] text-stone-600 mt-1 leading-relaxed">
                    Pick up packed at Bharathi Store, Madurai Central in 15 mins.
                  </p>
                  <span className="text-[11px] font-bold text-supermarket-fresh mt-1.5 block">
                    100% FREE STORE PICKUP
                  </span>
                </div>
              </button>
            </div>
          </div>

          {/* 2. Address & Delivery Schedule */}
          <div className="space-y-4 pt-4 border-t border-surface-border">
            <h2 className="font-serif text-xl font-bold text-obsidian flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-stone-900 text-white flex items-center justify-center text-xs font-sans">
                2
              </span>
              <span>{fulfillmentMethod === 'delivery' ? 'Delivery Address & Schedule' : 'Customer Pickup Information'}</span>
            </h2>

            {fulfillmentMethod === 'store_pickup' ? (
              <div className="p-5 bg-white rounded-2xl border border-surface-border space-y-4 text-xs shadow-subtle">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-brand-crimson shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-bold text-sm text-stone-900">Bharathi Store Central Counter</h3>
                    <p className="text-stone-600 mt-0.5">{settings.storeAddress}</p>
                    <p className="text-stone-500 text-[11px] mt-1">
                      Open 7 Days a week: {settings.openingHours.replace(/^Open\s+(All\s+)?7\s+Days:?\s*/i, '')}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 border-t border-surface-border">
                  <div>
                    <label className="block text-[11px] font-medium text-stone-700 mb-1">Pickup Person Name</label>
                    <input
                      type="text"
                      required
                      value={recipientName}
                      onChange={(e) => setRecipientName(e.target.value)}
                      className="w-full text-xs px-3 py-2 border border-surface-border rounded-xl bg-stone-50"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium text-stone-700 mb-1">Mobile Contact Phone</label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full text-xs px-3 py-2 border border-surface-border rounded-xl bg-stone-50"
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Saved Address Cards */}
                {addresses.length > 0 && !isAddingNewAddress && (
                  <div className="space-y-3">
                    <label className="text-xs font-bold text-stone-800 block">Deliver to Saved Address:</label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {addresses.map((addr) => (
                        <div
                          key={addr.id}
                          onClick={() => setSelectedAddressId(addr.id!)}
                          className={`p-4 rounded-2xl border cursor-pointer text-xs transition-all ${
                            selectedAddressId === addr.id
                              ? 'border-brand-crimson bg-white shadow-card ring-2 ring-brand-crimson/15'
                              : 'border-surface-border bg-white/70 hover:bg-white'
                          }`}
                        >
                          <div className="flex items-center justify-between font-bold text-stone-900">
                            <span>{addr.recipientName}</span>
                            <span className="text-[10px] bg-stone-100 px-2 py-0.5 rounded-full">{addr.label}</span>
                          </div>
                          <p className="text-stone-600 text-[11px] mt-1.5 line-clamp-2 leading-relaxed">{addr.streetAddress}, {addr.city} {addr.postalCode}</p>
                          <p className="text-muted text-[10px] mt-1">Phone: {addr.phone}</p>
                        </div>
                      ))}
                    </div>

                    <button
                      type="button"
                      onClick={() => setIsAddingNewAddress(true)}
                      className="text-xs text-brand-crimson font-semibold hover:underline flex items-center gap-1 mt-1"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Deliver to a New Address</span>
                    </button>
                  </div>
                )}

                {/* New address form */}
                {isAddingNewAddress && (
                  <div className="bg-white p-5 rounded-2xl border border-surface-border space-y-3 text-xs shadow-subtle">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-stone-900">Enter Delivery Address</span>
                      {addresses.length > 0 && (
                        <button
                          type="button"
                          onClick={() => setIsAddingNewAddress(false)}
                          className="text-xs text-brand-crimson hover:underline"
                        >
                          Use Saved Address
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-medium text-stone-700 mb-1">Full Name</label>
                        <input
                          type="text"
                          required
                          value={recipientName}
                          onChange={(e) => setRecipientName(e.target.value)}
                          className="w-full text-xs px-3 py-2 border border-surface-border rounded-xl"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-medium text-stone-700 mb-1">Mobile Phone</label>
                        <input
                          type="tel"
                          required
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          className="w-full text-xs px-3 py-2 border border-surface-border rounded-xl"
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <label className="block text-[11px] font-medium text-stone-700 mb-1">Street Address</label>
                        <input
                          type="text"
                          required
                          value={streetAddress}
                          onChange={(e) => setStreetAddress(e.target.value)}
                          className="w-full text-xs px-3 py-2 border border-surface-border rounded-xl"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-medium text-stone-700 mb-1">Landmark</label>
                        <input
                          type="text"
                          value={landmark}
                          onChange={(e) => setLandmark(e.target.value)}
                          className="w-full text-xs px-3 py-2 border border-surface-border rounded-xl"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-medium text-stone-700 mb-1">Pincode</label>
                        <input
                          type="text"
                          required
                          maxLength={6}
                          value={postalCode}
                          onChange={(e) => setPostalCode(e.target.value)}
                          className="w-full text-xs px-3 py-2 border border-surface-border rounded-xl"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Delivery Slot */}
                <div className="pt-3 space-y-2 text-xs">
                  <label className="text-xs font-bold text-stone-900 flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-brand-crimson" />
                    <span>Choose Delivery Window:</span>
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                    {[
                      'Express (Within 2 Hours)',
                      'Today: 4:00 PM – 7:00 PM',
                      'Tomorrow: 8:00 AM – 11:00 AM',
                    ].map((slot) => (
                      <label
                        key={slot}
                        className={`p-3 rounded-xl border text-left cursor-pointer transition-all flex items-center gap-2 ${
                          deliverySlot === slot 
                            ? 'border-brand-crimson bg-white text-brand-crimson font-bold shadow-xs' 
                            : 'border-surface-border bg-white/70 hover:bg-white text-stone-700'
                        }`}
                      >
                        <input
                          type="radio"
                          name="slot"
                          checked={deliverySlot === slot}
                          onChange={() => setDeliverySlot(slot)}
                          className="text-brand-crimson"
                        />
                        <span className="text-[11px]">{slot}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* 3. Payment Method */}
          <div className="space-y-4 pt-4 border-t border-surface-border">
            <h2 className="font-serif text-xl font-bold text-obsidian flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-stone-900 text-white flex items-center justify-center text-xs font-sans">
                3
              </span>
              <span>Payment Option</span>
            </h2>

            <div className="space-y-3">
              {/* COD */}
              <label
                className={`p-4 rounded-2xl border flex items-start gap-3.5 cursor-pointer transition-all ${
                  paymentMethod === 'cod'
                    ? 'border-brand-crimson bg-white shadow-card ring-2 ring-brand-crimson/15'
                    : 'border-surface-border bg-white/70 hover:bg-white'
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === 'cod'}
                  onChange={() => setPaymentMethod('cod')}
                  className="mt-1 text-brand-crimson"
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-obsidian flex items-center gap-1.5">
                      <Banknote className="w-4 h-4 text-supermarket-fresh" />
                      {fulfillmentMethod === 'delivery' ? 'Cash on Delivery (COD)' : 'Pay at Supermarket Counter'}
                    </span>
                    <span className="text-[11px] text-muted font-medium">Pay upon receipt</span>
                  </div>
                  <p className="text-[11px] text-stone-600 mt-1 leading-relaxed">
                    {fulfillmentMethod === 'delivery' 
                      ? 'Pay with Cash or UPI directly to our store delivery associate upon physical inspection.' 
                      : 'Pay via cash, UPI, or card when picking up your packed grocery bag.'}
                  </p>
                </div>
              </label>

              {/* Razorpay */}
              <label
                className={`p-4 rounded-2xl border flex items-start gap-3.5 cursor-pointer transition-all ${
                  paymentMethod === 'razorpay'
                    ? 'border-brand-crimson bg-white shadow-card ring-2 ring-brand-crimson/15'
                    : 'border-surface-border bg-white/70 hover:bg-white'
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === 'razorpay'}
                  onChange={() => setPaymentMethod('razorpay')}
                  className="mt-1 text-brand-crimson"
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-obsidian flex items-center gap-1.5">
                      <CreditCard className="w-4 h-4 text-blue-600" />
                      Razorpay Gateway (UPI, Cards, NetBanking)
                    </span>
                    <span className="text-[10px] bg-blue-50 text-blue-700 px-2.5 py-0.5 rounded-full font-bold">
                      VERIFIED GATEWAY
                    </span>
                  </div>
                  <p className="text-[11px] text-stone-600 mt-1">
                    Instant payment with GPay, PhonePe, Paytm, RuPay/Visa/Mastercard.
                  </p>
                </div>
              </label>

              {/* PhonePe */}
              <label
                className={`p-4 rounded-2xl border flex items-start gap-3.5 cursor-pointer transition-all ${
                  paymentMethod === 'phonepe'
                    ? 'border-brand-crimson bg-white shadow-card ring-2 ring-brand-crimson/15'
                    : 'border-surface-border bg-white/70 hover:bg-white'
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === 'phonepe'}
                  onChange={() => setPaymentMethod('phonepe')}
                  className="mt-1 text-brand-crimson"
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-obsidian flex items-center gap-1.5">
                      <CreditCard className="w-4 h-4 text-purple-600" />
                      PhonePe PG (Direct UPI & Scanner)
                    </span>
                    <span className="text-[10px] bg-purple-50 text-purple-700 px-2.5 py-0.5 rounded-full font-bold">
                      PHONEPE SECURE
                    </span>
                  </div>
                  <p className="text-[11px] text-stone-600 mt-1">
                    Scan PhonePe QR or pay instantly via PhonePe app.
                  </p>
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* Right Column: Order Summary (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white rounded-3xl p-6 border border-surface-border shadow-card space-y-4">
            <h2 className="font-serif text-lg font-bold text-obsidian border-b border-surface-border pb-3">
              Order Summary
            </h2>

            <div className="space-y-3 max-h-56 overflow-y-auto pr-1 divide-y divide-surface-border/50">
              {cart.map((item) => (
                <div key={item.product.id} className="flex items-center justify-between text-xs pt-2.5 first:pt-0">
                  <div className="flex items-center gap-2.5 min-w-0 pr-2">
                    <img
                      src={item.product.images[0]}
                      alt={item.product.name}
                      className="w-10 h-10 rounded-lg object-cover border border-surface-border shrink-0"
                    />
                    <div className="truncate">
                      <p className="font-semibold text-obsidian truncate">{item.product.name}</p>
                      <span className="text-[10px] text-muted">{item.quantity} × {formatCurrency(item.product.price)}</span>
                    </div>
                  </div>
                  <span className="font-bold text-stone-900 shrink-0">
                    {formatCurrency(item.product.price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-surface-border space-y-2 text-xs">
              <div className="flex justify-between text-stone-600">
                <span>Items Subtotal</span>
                <span className="font-semibold text-stone-900">{formatCurrency(cartSubtotal)}</span>
              </div>
              <div className="flex justify-between text-stone-600">
                <span>Delivery Charge</span>
                <span>
                  {finalDeliveryFee === 0 ? (
                    <span className="text-supermarket-fresh font-bold uppercase text-[11px]">FREE</span>
                  ) : (
                    formatCurrency(finalDeliveryFee)
                  )}
                </span>
              </div>
              {couponDiscount > 0 && (
                <div className="flex justify-between text-supermarket-fresh font-bold">
                  <span>Coupon Discount</span>
                  <span>-{formatCurrency(couponDiscount)}</span>
                </div>
              )}
              <div className="pt-3 border-t border-surface-border flex justify-between items-baseline">
                <span className="font-bold text-sm text-obsidian">Total Payable</span>
                <span className="font-serif text-2xl font-bold text-brand-crimson">
                  {formatCurrency(finalTotal)}
                </span>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 bg-brand-crimson hover:bg-brand-crimson-dark text-white rounded-full text-xs font-bold tracking-wider uppercase flex items-center justify-center gap-2 transition-all shadow-crimson active:scale-[0.99] disabled:opacity-50"
            >
              <span>
                {isSubmitting 
                  ? 'Reserving Order...' 
                  : paymentMethod === 'cod' 
                  ? 'Confirm Supermarket Order' 
                  : `Proceed to Pay ${formatCurrency(finalTotal)}`}
              </span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="pt-2 flex items-center justify-center gap-1.5 text-[11px] text-muted">
              <ShieldCheck className="w-4 h-4 text-supermarket-fresh" />
              <span>Safe Supermarket Checkout • Freshness Guaranteed</span>
            </div>
          </div>
        </div>

        {/* Sticky Mobile Checkout Action Bar */}
        <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/98 backdrop-blur-lg border-t border-stone-200 px-4 py-3 pb-[max(0.85rem,env(safe-area-inset-bottom,0.85rem))] shadow-[0_-6px_25px_rgba(0,0,0,0.1)] animate-sheet-up">
          <div className="flex items-center justify-between gap-3 max-w-md mx-auto">
            <div>
              <span className="text-[10px] text-stone-500 block uppercase font-bold tracking-wider leading-none">
                Total Payable
              </span>
              <span className="font-serif text-xl font-bold text-brand-crimson">
                {formatCurrency(finalTotal)}
              </span>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 max-w-[210px] h-11 bg-brand-crimson hover:bg-brand-crimson-dark text-white rounded-full text-xs font-bold tracking-wider uppercase flex items-center justify-center gap-1.5 shadow-crimson active:scale-95 disabled:opacity-50 transition-all min-h-[44px]"
            >
              <span>{isSubmitting ? 'Reserving...' : paymentMethod === 'cod' ? 'Confirm Order' : 'Pay Now'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </form>

      {/* Online Payment Modal */}
      <PaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        method={paymentMethod}
        amount={finalTotal}
        orderNumber={pendingOrderRef}
        onSuccess={(txnId) => {
          setIsPaymentModalOpen(false);
          handleOrderSubmission(txnId);
        }}
        onFailure={(msg) => {
          setFormError(msg);
        }}
      />
    </div>
  );
};
