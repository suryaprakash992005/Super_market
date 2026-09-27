import React, { useEffect, useState } from 'react';
import { 
  X, 
  Printer, 
  Download, 
  Share2, 
  Check, 
  FileText, 
  ExternalLink 
} from 'lucide-react';
import { Order } from '../../types';
import { ShopReceipt } from './ShopReceipt';
import { 
  formatReceiptDate, 
  formatReceiptTime, 
  formatReceiptCurrency 
} from '../../lib/utils';
import { useStore } from '../../context/StoreContext';

interface ShopReceiptModalProps {
  order: Order | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ShopReceiptModal: React.FC<ShopReceiptModalProps> = ({ order, isOpen, onClose }) => {
  const { settings } = useStore();
  const [copiedLink, setCopiedLink] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  // Close on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen || !order) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleCopyLink = () => {
    const billUrl = `${window.location.origin}/orders/${order.id}/bill`;
    navigator.clipboard.writeText(billUrl).then(() => {
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    });
  };

  const handleDownload = () => {
    setIsDownloading(true);
    try {
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
      Exchange within 2 hours of delivery for freshness issues.
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
    } finally {
      setTimeout(() => setIsDownloading(false), 600);
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-stone-950/75 backdrop-blur-sm overflow-y-auto animate-fadeIn no-print"
      onClick={onClose}
    >
      {/* Modal Container */}
      <div 
        className="bg-stone-100 rounded-3xl max-w-lg w-full p-3 sm:p-5 shadow-2xl border border-stone-300/80 my-auto relative max-h-[96vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Control Header */}
        <div className="flex items-center justify-between pb-3 px-1 border-b border-stone-200 shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-brand-crimson/10 text-brand-crimson flex items-center justify-center">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-xs sm:text-sm text-obsidian">
                Digital Real Shop Bill
              </h3>
              <p className="text-[10px] text-stone-500 font-mono">
                Order #{order.orderNumber}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-stone-200/80 hover:bg-stone-300 text-stone-700 flex items-center justify-center transition-colors"
            aria-label="Close bill modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Action Toolbar */}
        <div className="py-2.5 px-1 flex flex-wrap items-center justify-between gap-2 border-b border-stone-200 shrink-0 bg-stone-50/60 rounded-xl mt-2">
          <div className="flex items-center gap-1.5">
            <button
              onClick={handlePrint}
              className="px-3 py-1.5 bg-brand-crimson hover:bg-brand-crimson-dark text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-xs transition-all active:scale-95"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Bill</span>
            </button>

            <button
              onClick={handleDownload}
              disabled={isDownloading}
              className="px-3 py-1.5 bg-white hover:bg-stone-100 text-stone-800 border border-stone-300 rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-2xs transition-all active:scale-95 disabled:opacity-50"
            >
              <Download className="w-3.5 h-3.5 text-stone-600" />
              <span>{isDownloading ? 'Saving...' : 'Download'}</span>
            </button>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={handleCopyLink}
              className="px-2.5 py-1.5 bg-white hover:bg-stone-100 text-stone-700 border border-stone-300 rounded-lg text-xs font-medium flex items-center gap-1 transition-all"
              title="Copy link to bill"
            >
              {copiedLink ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-700 font-bold text-[11px]">Link Copied</span>
                </>
              ) : (
                <>
                  <Share2 className="w-3.5 h-3.5 text-stone-500" />
                  <span className="text-[11px]">Share</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Scrollable Receipt Area with Authentic Unrolling Entrance */}
        <div className="flex-1 overflow-y-auto py-3 px-1 no-scrollbar">
          <div className="animate-receipt-unroll origin-top">
            <ShopReceipt order={order} />
          </div>
        </div>

        {/* Bottom Helper Bar */}
        <div className="pt-2.5 px-1 border-t border-stone-200 text-center shrink-0 flex items-center justify-between text-[11px] text-stone-500 font-mono">
          <span>Official Bharathi Supermarket Receipt</span>
          <button
            onClick={handlePrint}
            className="text-brand-crimson hover:underline font-bold"
          >
            Print Receipt
          </button>
        </div>
      </div>
    </div>
  );
};
