import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Printer, 
  Download, 
  Share2, 
  Check, 
  ShieldCheck, 
  AlertCircle,
  Lock,
  ShoppingBag
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { ShopReceipt } from '../components/receipt/ShopReceipt';
import { 
  formatReceiptDate, 
  formatReceiptTime, 
  formatReceiptCurrency 
} from '../lib/utils';

export const OrderBillPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getOrderById, user, isAdmin, settings } = useStore();
  const [copiedLink, setCopiedLink] = React.useState(false);

  const order = getOrderById(id || '');

  if (!order) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center space-y-4">
        <AlertCircle className="w-12 h-12 text-stone-400 mx-auto" />
        <h2 className="font-serif text-2xl font-bold text-obsidian">Receipt Not Found</h2>
        <p className="text-xs text-muted">
          We couldn&apos;t find any active or historical supermarket receipt matching reference &ldquo;{id}&rdquo;.
        </p>
        <Link 
          to="/orders" 
          className="px-5 py-2.5 bg-brand-crimson text-white rounded-xl text-xs font-semibold inline-block hover:bg-brand-crimson-dark"
        >
          Return to My Orders
        </Link>
      </div>
    );
  }

  // Security Access Verification (Requirement 26)
  // Customers can only view their own bills unless admin or matching session
  const isOwner = Boolean(
    !order.userId || 
    order.userId === 'usr-guest' || 
    (user && (user.id === order.userId || user.email === order.customerEmail))
  );

  if (!isOwner && !isAdmin) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center space-y-4 bg-white rounded-3xl border border-stone-200 p-8 shadow-subtle my-8">
        <div className="w-14 h-14 rounded-full bg-red-50 text-brand-crimson flex items-center justify-center mx-auto">
          <Lock className="w-6 h-6" />
        </div>
        <h2 className="font-serif text-xl font-bold text-obsidian">Access Restricted</h2>
        <p className="text-xs text-muted leading-relaxed">
          For your financial privacy, digital supermarket receipts can only be viewed by the customer who placed the order.
        </p>
        <div className="pt-2 flex justify-center gap-3">
          <Link 
            to="/orders" 
            className="px-4 py-2 bg-stone-900 text-white rounded-xl text-xs font-semibold hover:bg-stone-800"
          >
            My Orders
          </Link>
          <Link 
            to="/" 
            className="px-4 py-2 bg-stone-100 text-stone-700 rounded-xl text-xs font-semibold hover:bg-stone-200"
          >
            Storefront
          </Link>
        </div>
      </div>
    );
  }

  const handlePrint = () => {
    window.print();
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href).then(() => {
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    });
  };

  const handleDownload = () => {
    const formattedDate = formatReceiptDate(order.createdAt);
    const formattedTime = formatReceiptTime(order.createdAt);
    const itemsListText = order.items
      .map(
        (item, idx) =>
          `${String(idx + 1).padEnd(3)} ${item.name.slice(0, 26).padEnd(28)} ${String(item.quantity).padStart(3)} ${item.unit.padEnd(8)} ${formatReceiptCurrency(item.price).padStart(9)} ${formatReceiptCurrency(item.total).padStart(10)}`
      )
      .join('\n');

    const receiptPlainText = `
================================================================
                    BHARATHI STORE
               SUPERMARKET & PROVISIONS
           42, Bharathi Supermarket Complex,
                Madurai Central - 625001
              Helpline: ${settings.phone || '+91 98421 23456'}
    GSTIN: ${settings.gstin || '33AABCB1234F1Z9'}  |  FSSAI: 12421008000192
================================================================
TAX INVOICE / CASH MEMO
----------------------------------------------------------------
Order / Bill No : ${order.orderNumber}
Order Date      : ${formattedDate}
Order Time (IST): ${formattedTime} IST
Register Node   : POS-04 (Madurai Cloud Hub)
Fulfillment     : ${order.fulfillmentMethod === 'store_pickup' ? 'Store Pickup' : 'Home Delivery'}
Customer Name   : ${order.customerName}
Customer Mobile : ${order.customerPhone}
${order.deliveryAddress ? `Delivery Address: ${order.deliveryAddress.streetAddress}, ${order.deliveryAddress.city} - ${order.deliveryAddress.postalCode}` : ''}
----------------------------------------------------------------
#   ITEM DESCRIPTION             QTY UNIT       RATE     AMOUNT
----------------------------------------------------------------
${itemsListText}
----------------------------------------------------------------
Total Items / Qty : ${order.items.length} items
Subtotal          : ${formatReceiptCurrency(order.subtotal)}
Discount / Coupon : -${formatReceiptCurrency(order.discount)}
Delivery Charges  : ${order.deliveryFee === 0 ? 'FREE' : formatReceiptCurrency(order.deliveryFee)}
GST / Taxes       : Included (CGST 2.5% + SGST 2.5%)
================================================================
NET GRAND TOTAL   : ${formatReceiptCurrency(order.total)}
================================================================
Payment Method    : ${order.paymentMethod.toUpperCase()}
Payment Status    : ${order.paymentStatus.toUpperCase()}
${order.transactionId ? `Transaction Ref   : ${order.transactionId}` : ''}
----------------------------------------------------------------
          THANK YOU FOR SHOPPING WITH BHARATHI STORE!
================================================================
DOC REF: ${order.id.toUpperCase()}
`;

    const blob = new Blob([receiptPlainText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Bharathi-Store-Receipt-${order.orderNumber}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-[#ECE9E2] py-8 px-4 sm:px-6 print:bg-white print:p-0">
      <div className="max-w-xl mx-auto space-y-4">
        
        {/* Top Control Bar (Hidden on Print) */}
        <div className="bg-white/90 backdrop-blur-md rounded-2xl p-4 border border-stone-300 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3 no-print">
          <div className="flex items-center gap-3">
            <Link
              to={`/orders/${order.id}`}
              className="p-2 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl transition-colors"
              aria-label="Back to order tracking"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div>
              <div className="flex items-center gap-1.5">
                <h1 className="font-bold text-sm text-obsidian">Digital Shop Bill</h1>
                <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold border border-emerald-200">
                  <ShieldCheck className="w-3 h-3" />
                  <span>Verified</span>
                </span>
              </div>
              <p className="text-[11px] text-stone-500 font-mono mt-0.5">
                Order #{order.orderNumber}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3 py-1.5 bg-brand-crimson hover:bg-brand-crimson-dark text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-xs transition-all active:scale-95"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Bill</span>
            </button>

            <button
              onClick={handleDownload}
              className="px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download</span>
            </button>

            <button
              onClick={handleCopyLink}
              className="p-2 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-lg transition-colors"
              title="Copy receipt link"
            >
              {copiedLink ? <Check className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Ambient Paper Presentation */}
        <div className="relative animate-receipt-unroll origin-top print:animate-none">
          <ShopReceipt order={order} />
        </div>

        {/* Bottom Helpful Navigation (Hidden on Print) */}
        <div className="text-center pt-2 pb-6 space-y-2 text-xs text-stone-500 no-print">
          <p>This digital receipt acts as official proof of purchase for Bharathi Store Madurai.</p>
          <div className="flex items-center justify-center gap-4 text-stone-700 font-semibold">
            <Link to={`/orders/${order.id}`} className="hover:text-brand-crimson underline">
              Track Order Status
            </Link>
            <span>•</span>
            <Link to="/orders" className="hover:text-brand-crimson underline">
              All Orders
            </Link>
            <span>•</span>
            <Link to="/products" className="hover:text-brand-crimson underline">
              Continue Shopping
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
};
