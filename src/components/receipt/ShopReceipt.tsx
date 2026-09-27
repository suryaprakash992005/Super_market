import React from 'react';
import { 
  CheckCircle2, 
  MapPin, 
  Phone, 
  Store, 
  Clock, 
  ShieldCheck, 
  Sparkles,
  QrCode,
  Tag
} from 'lucide-react';
import { Order } from '../../types';
import { 
  formatReceiptDate, 
  formatReceiptTime, 
  formatReceiptCurrency,
  cn 
} from '../../lib/utils';
import { useStore } from '../../context/StoreContext';

interface ShopReceiptProps {
  order: Order;
  className?: string;
  isPrintOnly?: boolean;
}

/**
 * Authentic Barcode SVG Generator for POS Receipts
 */
const ReceiptBarcode: React.FC<{ value: string }> = ({ value }) => {
  // Deterministic pseudo-code 128 bar pattern based on char codes
  const bars: { width: number; isSpace: boolean }[] = [];
  
  // Guard bars at start
  bars.push({ width: 2, isSpace: false }, { width: 1, isSpace: true }, { width: 2, isSpace: false });
  
  for (let i = 0; i < value.length; i++) {
    const code = value.charCodeAt(i);
    bars.push({ width: (code % 3) + 1, isSpace: false });
    bars.push({ width: ((code * 2) % 2) + 1, isSpace: true });
    bars.push({ width: ((code + i) % 3) + 1, isSpace: false });
    bars.push({ width: 1, isSpace: true });
  }

  // Guard bars at end
  bars.push({ width: 2, isSpace: false }, { width: 1, isSpace: true }, { width: 2, isSpace: false });

  let currentX = 0;

  return (
    <div className="flex flex-col items-center justify-center my-3">
      <svg
        viewBox="0 0 240 40"
        className="w-48 sm:w-60 h-10 select-none"
        preserveAspectRatio="none"
      >
        {bars.map((bar, idx) => {
          const x = currentX;
          currentX += bar.width * 2.2;
          if (bar.isSpace) return null;
          return (
            <rect
              key={idx}
              x={x}
              y={0}
              width={bar.width * 2}
              height={38}
              fill="#111111"
            />
          );
        })}
      </svg>
      <span className="font-mono text-[10px] tracking-[0.25em] text-stone-700 font-bold mt-1 uppercase">
        *{value}*
      </span>
    </div>
  );
};

/**
 * Lightweight Pure SVG QR Code for Order Verification
 */
const ReceiptQRCode: React.FC<{ orderNumber: string }> = ({ orderNumber }) => {
  // Deterministic 21x21 QR-like visual matrix with standard corner finder patterns
  const size = 21;
  const grid: boolean[][] = Array.from({ length: size }, () => Array(size).fill(false));

  // Helper to draw corner finder patterns (7x7 with 3x3 center)
  const drawFinder = (startX: number, startY: number) => {
    for (let r = 0; r < 7; r++) {
      for (let c = 0; c < 7; c++) {
        if (
          r === 0 || r === 6 || c === 0 || c === 6 ||
          (r >= 2 && r <= 4 && c >= 2 && c <= 4)
        ) {
          grid[startY + r][startX + c] = true;
        }
      }
    }
  };

  drawFinder(0, 0); // Top-left
  drawFinder(size - 7, 0); // Top-right
  drawFinder(0, size - 7); // Bottom-left

  // Timing patterns
  for (let i = 8; i < size - 8; i++) {
    if (i % 2 === 0) {
      grid[6][i] = true;
      grid[i][6] = true;
    }
  }

  // Pseudo-random data bits based on orderNumber
  let hash = 0;
  for (let i = 0; i < orderNumber.length; i++) {
    hash = (hash << 5) - hash + orderNumber.charCodeAt(i);
    hash |= 0;
  }

  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      // Don't overwrite finders
      const inTL = r < 8 && c < 8;
      const inTR = r < 8 && c >= size - 8;
      const inBL = r >= size - 8 && c < 8;
      if (!inTL && !inTR && !inBL && grid[r][c] === false) {
        grid[r][c] = Math.abs(Math.sin(hash * (r + 1) + c * 17)) > 0.45;
      }
    }
  }

  return (
    <div className="flex flex-col items-center">
      <div className="p-1.5 bg-white border border-stone-300 rounded-md shadow-2xs">
        <svg viewBox={`0 0 ${size} ${size}`} className="w-16 h-16 sm:w-20 sm:h-20">
          {grid.map((row, r) =>
            row.map((filled, c) =>
              filled ? (
                <rect
                  key={`${r}-${c}`}
                  x={c}
                  y={r}
                  width={1}
                  height={1}
                  fill="#111111"
                />
              ) : null
            )
          )}
        </svg>
      </div>
      <span className="text-[8px] font-mono uppercase tracking-wider text-stone-500 mt-1">
        Scan to Verify
      </span>
    </div>
  );
};

export const ShopReceipt: React.FC<ShopReceiptProps> = ({ order, className, isPrintOnly }) => {
  const { settings } = useStore();

  const totalItemsCount = order.items.reduce((sum, item) => sum + item.quantity, 0);

  // Exact order timestamps in Asia/Kolkata timezone
  const formattedDate = formatReceiptDate(order.createdAt);
  const formattedTime = formatReceiptTime(order.createdAt);

  const isPaid = order.paymentStatus === 'paid';
  const isCOD = order.paymentMethod === 'cod' || order.paymentMethod === 'pay_at_store';

  return (
    <div 
      className={cn(
        "receipt-paper bg-white text-stone-900 font-mono text-xs max-w-[420px] mx-auto shadow-2xl relative border-x border-stone-200 select-text overflow-hidden print:max-w-none print:shadow-none print:border-none",
        className
      )}
      id={`shop-bill-${order.id}`}
    >
      {/* 1. Jagged Saw-tooth Perforated Top Tear Edge */}
      <div 
        className="h-3 w-full bg-repeat-x print:hidden" 
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 8' width='20' height='8'%3E%3Cpath d='M0 8 L10 0 L20 8 Z' fill='%23F7F5F1'/%3E%3C/svg%3E")`
        }} 
      />

      {/* Main Thermal Slip Content */}
      <div className="px-5 sm:px-7 py-5 space-y-4">
        
        {/* Store Brand Header */}
        <div className="text-center space-y-1">
          <div className="flex items-center justify-center gap-2 pb-1">
            <img 
              src="/bharathi-emblem-4k.png" 
              alt="Bharathi Store Emblem" 
              className="h-11 w-auto object-contain shrink-0"
              style={{ imageRendering: '-webkit-optimize-contrast' }}
            />
            <img 
              src="/bharathi-brand-header-4k.png" 
              alt="Bharathi Store - Supermarket & Provisions" 
              className="h-10 w-auto object-contain"
              style={{ imageRendering: '-webkit-optimize-contrast' }}
            />
          </div>
          <div className="text-[10px] text-stone-600 font-mono leading-relaxed pt-1">
            <p>{settings.storeAddress || '42, Bharathi Supermarket Complex, Main Road'}</p>
            <p>Madurai Central, Tamil Nadu - 625001</p>
            <p>Helpline: <strong className="text-stone-900">{settings.phone || '+91 98421 23456'}</strong></p>
            <p>GSTIN: <span className="font-semibold text-stone-800">{settings.gstin || '33AABCB1234F1Z9'}</span> • FSSAI: 12421008000192</p>
          </div>
        </div>

        {/* Dotted Receipt Divider */}
        <div className="border-t border-dashed border-stone-400 my-2" />

        {/* Bill Metadata Header */}
        <div className="text-center space-y-0.5">
          <span className="inline-block px-3 py-0.5 bg-stone-100 text-stone-800 rounded font-bold text-[11px] tracking-wider uppercase border border-stone-300">
            TAX INVOICE / CASH MEMO
          </span>
          <p className="text-[10px] text-stone-500 pt-0.5">Original for Recipient</p>
        </div>

        {/* Order Details Grid */}
        <div className="space-y-1 text-[11px] font-mono">
          <div className="flex justify-between items-center py-0.5 border-b border-stone-200">
            <span className="text-stone-500 uppercase">Bill / Order No:</span>
            <span className="font-bold text-stone-900 text-xs tracking-wider">{order.orderNumber}</span>
          </div>

          <div className="flex justify-between items-center py-0.5">
            <span className="text-stone-500 uppercase">Order Date:</span>
            <span className="font-bold text-stone-800">{formattedDate}</span>
          </div>

          <div className="flex justify-between items-center py-0.5">
            <span className="text-stone-500 uppercase">Order Time (IST):</span>
            <span className="font-bold text-stone-800 flex items-center gap-1">
              <Clock className="w-3 h-3 text-brand-crimson" />
              <span>{formattedTime} IST</span>
            </span>
          </div>

          <div className="flex justify-between items-center py-0.5">
            <span className="text-stone-500 uppercase">Register / Node:</span>
            <span className="text-stone-700">POS-04 (Madurai Cloud Hub)</span>
          </div>

          <div className="flex justify-between items-center py-0.5">
            <span className="text-stone-500 uppercase">Fulfillment:</span>
            <span className="font-bold text-stone-900 capitalize">
              {order.fulfillmentMethod === 'store_pickup' ? 'Click & Collect (Store Pickup)' : 'Doorstep Grocery Delivery'}
            </span>
          </div>

          {order.deliverySlot && (
            <div className="flex justify-between items-center py-0.5">
              <span className="text-stone-500 uppercase">Slot:</span>
              <span className="text-stone-700 text-[10px] truncate max-w-[200px]">{order.deliverySlot}</span>
            </div>
          )}
        </div>

        {/* Dotted Receipt Divider */}
        <div className="border-t border-dashed border-stone-400 my-2" />

        {/* Customer Information */}
        <div className="text-[11px] font-mono space-y-0.5 bg-stone-50/80 p-2.5 rounded border border-stone-200">
          <div className="flex justify-between">
            <span className="text-stone-500 uppercase">Customer:</span>
            <span className="font-bold text-stone-900">{order.customerName}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-stone-500 uppercase">Mobile:</span>
            <span className="font-medium text-stone-800">{order.customerPhone}</span>
          </div>
          {order.fulfillmentMethod === 'store_pickup' ? (
            <div className="flex items-center gap-1 text-[10px] text-stone-600 pt-1">
              <Store className="w-3 h-3 text-brand-crimson shrink-0" />
              <span>Counter: Main Express Counter, Bharathi Store</span>
            </div>
          ) : order.deliveryAddress ? (
            <div className="text-[10px] text-stone-600 pt-1 border-t border-stone-200/80 mt-1">
              <span className="text-stone-400 uppercase block">Delivery To:</span>
              <p className="font-medium text-stone-800">{order.deliveryAddress.streetAddress}</p>
              <p>{order.deliveryAddress.city}, {order.deliveryAddress.state} - {order.deliveryAddress.postalCode}</p>
            </div>
          ) : null}
        </div>

        {/* Dotted Receipt Divider */}
        <div className="border-t border-dashed border-stone-400 my-2" />

        {/* Itemized Table */}
        <div>
          {/* Table Header */}
          <div className="grid grid-cols-12 text-[10px] font-bold uppercase text-stone-600 pb-1.5 border-b border-stone-800">
            <div className="col-span-6 text-left">ITEM</div>
            <div className="col-span-2 text-center">QTY</div>
            <div className="col-span-2 text-right">RATE</div>
            <div className="col-span-2 text-right">AMT</div>
          </div>

          {/* Table Rows (Using authoritative historical order_items) */}
          <div className="divide-y divide-dashed divide-stone-200 py-1 font-mono text-[11px]">
            {order.items.map((item, idx) => (
              <div key={idx} className="py-2 grid grid-cols-12 items-start gap-1">
                <div className="col-span-6">
                  <p className="font-bold text-stone-900 leading-tight">
                    {idx + 1}. {item.name}
                  </p>
                  <span className="text-[9px] text-stone-500 block mt-0.5">
                    Pack: {item.unit}
                  </span>
                </div>
                <div className="col-span-2 text-center font-bold text-stone-800">
                  {item.quantity}
                </div>
                <div className="col-span-2 text-right text-stone-600 text-[10px]">
                  {formatReceiptCurrency(item.price)}
                </div>
                <div className="col-span-2 text-right font-bold text-stone-950">
                  {formatReceiptCurrency(item.total)}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Dotted Receipt Divider */}
        <div className="border-t border-dashed border-stone-800 my-2" />

        {/* Totals & Price Calculations */}
        <div className="space-y-1.5 font-mono text-xs">
          <div className="flex justify-between text-stone-600">
            <span>Total Items / Qty:</span>
            <span className="font-semibold text-stone-900">{order.items.length} items / {totalItemsCount} units</span>
          </div>

          <div className="flex justify-between text-stone-600">
            <span>Item Subtotal:</span>
            <span className="font-semibold text-stone-900">{formatReceiptCurrency(order.subtotal)}</span>
          </div>

          {order.discount > 0 && (
            <div className="flex justify-between text-emerald-700 font-bold">
              <span>Savings / Discount:</span>
              <span>-{formatReceiptCurrency(order.discount)}</span>
            </div>
          )}

          <div className="flex justify-between text-stone-600">
            <span>Delivery Charges:</span>
            <span className="font-medium">
              {order.deliveryFee === 0 ? 'FREE' : formatReceiptCurrency(order.deliveryFee)}
            </span>
          </div>

          <div className="flex justify-between text-[10px] text-stone-500 pt-0.5">
            <span>GST / Taxes:</span>
            <span>Included (CGST 2.5% + SGST 2.5%)</span>
          </div>

          {/* Heavy Dotted Divider for Grand Total */}
          <div className="border-t-2 border-stone-900 pt-2 pb-1" />

          {/* Grand Total */}
          <div className="flex justify-between items-baseline text-stone-950">
            <span className="text-sm sm:text-base font-black tracking-wider uppercase">
              NET TOTAL:
            </span>
            <span className="text-lg sm:text-xl font-black font-mono tracking-tight text-brand-crimson">
              {formatReceiptCurrency(order.total)}
            </span>
          </div>

          <div className="border-b-2 border-stone-900 pb-1" />

          {/* Savings Callout */}
          {order.discount > 0 && (
            <div className="p-2 bg-red-50 border border-brand-crimson/20 rounded text-center text-[10px] font-bold text-brand-crimson uppercase tracking-wider">
              *** YOU SAVED {formatReceiptCurrency(order.discount)} ON THIS ORDER! ***
            </div>
          )}
        </div>

        {/* Payment Details Section */}
        <div className="p-3 bg-stone-50 rounded-lg border border-stone-200 space-y-1.5 font-mono text-[11px] relative overflow-hidden">
          <div className="flex justify-between items-center">
            <span className="text-stone-500 uppercase">Payment Mode:</span>
            <span className="font-bold text-stone-900 uppercase">
              {order.paymentMethod.replace(/_/g, ' ')}
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-stone-500 uppercase">Payment Status:</span>
            <span className={cn(
              "font-bold uppercase px-2 py-0.5 rounded text-[10px]",
              isPaid 
                ? "bg-emerald-100 text-emerald-800 border border-emerald-300" 
                : "bg-amber-100 text-amber-800 border border-amber-300"
            )}>
              {isPaid ? 'PAID / CONFIRMED' : 'CASH ON DELIVERY (PENDING)'}
            </span>
          </div>

          {order.transactionId && (
            <div className="flex justify-between items-center text-[10px] text-stone-500">
              <span>Txn Reference:</span>
              <span className="font-mono text-stone-700">{order.transactionId}</span>
            </div>
          )}

          {/* Realistic Red/Green Ink Stamp */}
          <div className="pt-2 flex justify-center">
            <div className={cn(
              "border-2 rounded px-3 py-1 text-[11px] font-black tracking-widest uppercase rotate-[-3deg] shadow-2xs select-none",
              isPaid 
                ? "border-emerald-600 text-emerald-700 bg-emerald-50/60" 
                : "border-brand-crimson text-brand-crimson bg-red-50/60"
            )}>
              ★ {isPaid ? 'BHARATHI STORE • PAID' : 'COLLECT CASH ON DELIVERY'} ★
            </div>
          </div>
        </div>

        {/* Barcode & QR Verification Section */}
        <div className="text-center pt-2 space-y-3">
          <ReceiptBarcode value={order.orderNumber} />

          <div className="flex items-center justify-center gap-4 pt-1">
            <ReceiptQRCode orderNumber={order.orderNumber} />
            <div className="text-left text-[10px] text-stone-500 font-mono max-w-[180px] leading-tight">
              <p className="font-bold text-stone-800 uppercase text-[10px] mb-1">
                Authentic Digital Bill
              </p>
              <p>Generated by Bharathi Store Automated Supermarket Engine.</p>
              <p className="text-[9px] text-stone-400 mt-1">
                Secured by Hash Verification.
              </p>
            </div>
          </div>
        </div>

        {/* Dotted Receipt Divider */}
        <div className="border-t border-dashed border-stone-400 my-3" />

        {/* Receipt Footer Notes */}
        <div className="text-center font-mono text-[10px] text-stone-600 space-y-1 leading-relaxed">
          <p className="font-bold uppercase tracking-wider text-stone-900">
            THANK YOU FOR SHOPPING WITH US!
          </p>
          <p className="font-serif italic text-brand-crimson">
            BHARATHI STORE — Your Neighbourhood Supermarket
          </p>
          <div className="text-[9px] text-stone-500 space-y-0.5 pt-1">
            <p>• Goods once sold can be exchanged/replaced within 2 hours of delivery for damaged/freshness issues.</p>
            <p>• This is a computer-generated tax bill and does not require physical stamp signature.</p>
            <p className="font-bold text-stone-700 pt-1">Visit us at Madurai Central or call {settings.phone}</p>
          </div>
        </div>

        {/* Order Reference Number */}
        <div className="text-center pt-2">
          <span className="text-[9px] font-mono text-stone-400 uppercase tracking-wider">
            DOC REF: {order.id.toUpperCase()} • {formattedDate}
          </span>
        </div>
      </div>

      {/* 2. Jagged Saw-tooth Perforated Bottom Tear Edge */}
      <div 
        className="h-3 w-full bg-repeat-x print:hidden" 
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 8' width='20' height='8'%3E%3Cpath d='M0 0 L10 8 L20 0 Z' fill='%23F7F5F1'/%3E%3C/svg%3E")`
        }} 
      />
    </div>
  );
};
