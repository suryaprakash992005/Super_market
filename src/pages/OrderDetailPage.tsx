import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  Printer, 
  RotateCcw, 
  ArrowLeft,
  Store,
  ShieldCheck, 
  AlertCircle,
  FileText,
  ExternalLink
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { formatCurrency, formatDate, formatReceiptTime } from '../lib/utils';
import { ShopReceiptModal } from '../components/receipt/ShopReceiptModal';
import { OrderTrackingTimeline } from '../components/orders/OrderTrackingTimeline';

export const OrderDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getOrderById, reorder } = useStore();
  const [isReceiptModalOpen, setIsReceiptModalOpen] = useState(false);

  const order = getOrderById(id || '');

  if (!order) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center space-y-4">
        <AlertCircle className="w-12 h-12 text-stone-400 mx-auto" />
        <h2 className="font-serif text-2xl font-bold">Order Not Found</h2>
        <p className="text-xs text-muted">We couldn't locate order reference &ldquo;{id}&rdquo;.</p>
        <Link to="/orders" className="px-4 py-2 bg-brand-crimson text-white rounded-lg text-xs font-semibold inline-block">
          View All Orders
        </Link>
      </div>
    );
  }

  const handlePrint = () => {
    window.print();
  };

  const handleReorder = () => {
    reorder(order.id);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">
      {/* Receipt Modal */}
      <ShopReceiptModal
        order={order}
        isOpen={isReceiptModalOpen}
        onClose={() => setIsReceiptModalOpen(false)}
      />

      {/* Header and Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-surface-border pb-4 no-print">
        <div className="flex items-center gap-3">
          <Link
            to="/orders"
            className="p-2 border border-surface-border rounded-lg text-stone-600 hover:text-obsidian hover:bg-stone-50"
            aria-label="Back to orders"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-serif text-2xl font-bold text-obsidian">
                Order #{order.orderNumber}
              </h1>
              <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                order.status === 'delivered' 
                  ? 'bg-green-100 text-supermarket-fresh' 
                  : order.status === 'cancelled'
                  ? 'bg-red-100 text-red-700'
                  : 'bg-amber-100 text-amber-800'
              }`}>
                {order.status.replace(/_/g, ' ')}
              </span>
            </div>
            <p className="text-xs text-muted mt-0.5">
              Placed on {formatDate(order.createdAt)} ({formatReceiptTime(order.createdAt)} IST)
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Prominent View Bill Button */}
          <button
            onClick={() => setIsReceiptModalOpen(true)}
            className="px-4 py-2 bg-brand-crimson hover:bg-brand-crimson-dark text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all active:scale-95"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>View Digital Bill</span>
          </button>

          <button
            onClick={handlePrint}
            className="px-3 py-2 border border-surface-border bg-white rounded-lg text-xs font-semibold text-stone-700 hover:bg-stone-50 flex items-center gap-1.5 shadow-xs"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Invoice</span>
          </button>

          <button
            onClick={handleReorder}
            className="px-3.5 py-2 border border-surface-border bg-stone-50 text-stone-700 rounded-lg text-xs font-semibold hover:bg-stone-100 flex items-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reorder</span>
          </button>
        </div>
      </div>

      {/* Prominent Shop Bill Callout Banner */}
      <div className="bg-gradient-to-r from-stone-900 via-stone-850 to-stone-900 text-white rounded-2xl p-4 sm:p-5 shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4 no-print border border-stone-800">
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-white/10 border border-white/15 flex items-center justify-center text-white shrink-0">
            <FileText className="w-5 h-5 text-amber-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm text-white">Official Supermarket Bill Available</span>
              <span className="bg-brand-crimson text-white text-[9px] font-black uppercase px-2 py-0.5 rounded-full tracking-wider">
                Real POS Receipt
              </span>
            </div>
            <p className="text-xs text-stone-300 mt-0.5">
              Itemized thermal cash memo with store GSTIN, IST timestamp, verified barcode &amp; QR verification slip.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => setIsReceiptModalOpen(true)}
            className="px-4 py-2 bg-brand-crimson hover:bg-brand-crimson-dark text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all active:scale-95"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>View Receipt</span>
          </button>
          <Link
            to={`/orders/${order.id}/bill`}
            className="px-3 py-2 bg-white/10 hover:bg-white/20 text-stone-200 rounded-xl text-xs font-semibold flex items-center gap-1 transition-colors"
            title="Open printable bill in full window"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Open Page</span>
          </Link>
        </div>
      </div>

      {/* Visual Tracking Stepper & Live Fulfillment Journey */}
      <OrderTrackingTimeline order={order} />

      {/* Order Details & Invoice Card */}
      <div className="bg-white rounded-2xl border border-surface-border p-6 shadow-subtle space-y-6 invoice-card">
        {/* Print Brand Header (visible when printed) */}
        <div className="hidden print:block border-b border-stone-300 pb-4 mb-4">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="font-serif text-2xl font-bold text-brand-crimson">BHARATHI STORE</h2>
              <p className="text-xs text-stone-600">Premium Supermarket & Daily Provisions</p>
              <p className="text-[11px] text-stone-500">42, Bharathi Supermarket Complex, Main Road, Madurai</p>
              <p className="text-[11px] text-stone-500">GSTIN: 33AABCB1234F1Z9</p>
            </div>
            <div className="text-right text-xs">
              <p className="font-bold">TAX INVOICE</p>
              <p>Invoice #: {order.orderNumber}</p>
              <p>Date: {formatDate(order.createdAt)}</p>
            </div>
          </div>
        </div>

        {/* Customer & Fulfillment Info */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs border-b border-surface-border pb-6">
          <div className="space-y-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-muted">Customer</span>
            <p className="font-semibold text-obsidian text-sm">{order.customerName}</p>
            <p className="text-stone-600">{order.customerPhone}</p>
            <p className="text-stone-600">{order.customerEmail}</p>
          </div>

          <div className="space-y-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-muted">
              {order.fulfillmentMethod === 'store_pickup' ? 'Store Pickup Details' : 'Delivery Address'}
            </span>
            {order.fulfillmentMethod === 'store_pickup' ? (
              <div>
                <p className="font-semibold text-obsidian flex items-center gap-1">
                  <Store className="w-3.5 h-3.5 text-brand-crimson" />
                  <span>Click & Collect Pickup Counter</span>
                </p>
                <p className="text-stone-600">Bharathi Store Central, Madurai</p>
                <p className="text-stone-500 text-[11px]">Ready in 15 mins</p>
              </div>
            ) : order.deliveryAddress ? (
              <div>
                <p className="font-semibold text-obsidian">{order.deliveryAddress.streetAddress}</p>
                {order.deliveryAddress.landmark && (
                  <p className="text-stone-600">Landmark: {order.deliveryAddress.landmark}</p>
                )}
                <p className="text-stone-600">{order.deliveryAddress.city}, {order.deliveryAddress.state} {order.deliveryAddress.postalCode}</p>
                <p className="text-brand-crimson font-medium text-[11px] mt-1">Slot: {order.deliverySlot}</p>
              </div>
            ) : (
              <p className="text-stone-500">Standard Delivery</p>
            )}
          </div>

          <div className="space-y-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-muted">Payment Information</span>
            <p className="font-semibold text-obsidian uppercase text-xs">
              {order.paymentMethod.replace(/_/g, ' ')}
            </p>
            <p className="text-xs">
              Status:{' '}
              <span className={`font-bold ${order.paymentStatus === 'paid' ? 'text-supermarket-fresh' : 'text-amber-700'}`}>
                {order.paymentStatus.toUpperCase()}
              </span>
            </p>
            {order.transactionId && (
              <p className="text-[10px] text-muted font-mono truncate">
                Txn: {order.transactionId}
              </p>
            )}
          </div>
        </div>

        {/* Ordered Items List */}
        <div>
          <h3 className="font-semibold text-xs uppercase tracking-wider text-muted mb-3">
            Items in Order ({order.items.length})
          </h3>

          {/* Desktop Table Header */}
          <div className="hidden sm:grid grid-cols-12 bg-stone-50 p-3 rounded-t-xl font-semibold text-stone-700 text-xs border border-surface-border">
            <div className="col-span-7">Item Description</div>
            <div className="col-span-2 text-center">Unit Price</div>
            <div className="col-span-1 text-center">Qty</div>
            <div className="col-span-2 text-right">Total</div>
          </div>

          <div className="border border-surface-border rounded-xl sm:rounded-t-none divide-y divide-surface-border text-xs overflow-hidden">
            {order.items.map((item, idx) => (
              <div key={idx} className="p-3">
                {/* Mobile Item Row */}
                <div className="sm:hidden flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="w-12 h-12 rounded-xl object-cover border border-stone-200 shrink-0"
                    />
                    <div className="min-w-0 truncate">
                      <p className="font-bold text-obsidian truncate text-xs">{item.name}</p>
                      <p className="text-[11px] text-muted">{item.unit} • {formatCurrency(item.price)}</p>
                      <span className="text-[11px] font-semibold text-stone-700">Qty: {item.quantity}</span>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="font-serif font-bold text-sm text-obsidian block">
                      {formatCurrency(item.total)}
                    </span>
                  </div>
                </div>

                {/* Desktop Item Grid */}
                <div className="hidden sm:grid grid-cols-12 items-center">
                  <div className="col-span-7 flex items-center gap-3">
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="w-10 h-10 rounded-md object-cover border border-surface-border shrink-0"
                    />
                    <div className="min-w-0">
                      <p className="font-semibold text-obsidian truncate">{item.name}</p>
                      <span className="text-[11px] text-muted">Unit: {item.unit}</span>
                    </div>
                  </div>
                  <div className="col-span-2 text-center text-stone-700">
                    {formatCurrency(item.price)}
                  </div>
                  <div className="col-span-1 text-center font-semibold text-obsidian">
                    {item.quantity}
                  </div>
                  <div className="col-span-2 text-right font-bold text-obsidian">
                    {formatCurrency(item.total)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Summary Breakdown */}
        <div className="flex flex-col sm:flex-row justify-between items-start pt-4 border-t border-surface-border text-xs">
          <div className="space-y-1 text-muted text-[11px] max-w-sm mb-4 sm:mb-0">
            <p className="flex items-center gap-1 text-supermarket-fresh font-semibold">
              <ShieldCheck className="w-4 h-4" />
              <span>Bharathi Store 100% Freshness Guarantee</span>
            </p>
            <p>For any damaged or missing items, contact our store helpline within 2 hours of delivery for instantaneous replacement.</p>
          </div>

          <div className="w-full sm:w-64 space-y-2">
            <div className="flex justify-between text-stone-600">
              <span>Item Subtotal:</span>
              <span className="font-semibold text-stone-900">{formatCurrency(order.subtotal)}</span>
            </div>
            <div className="flex justify-between text-stone-600">
              <span>Delivery Fee:</span>
              <span>{order.deliveryFee === 0 ? 'FREE' : formatCurrency(order.deliveryFee)}</span>
            </div>
            {order.discount > 0 && (
              <div className="flex justify-between text-supermarket-fresh font-semibold">
                <span>Discount / Coupon:</span>
                <span>-{formatCurrency(order.discount)}</span>
              </div>
            )}
            <div className="pt-2 border-t border-surface-border flex justify-between items-baseline font-bold text-sm">
              <span className="text-obsidian">Total Amount:</span>
              <span className="font-serif text-xl text-brand-crimson">{formatCurrency(order.total)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
