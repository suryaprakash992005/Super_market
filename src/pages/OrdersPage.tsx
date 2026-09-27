import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Package, ChevronRight, RotateCcw, Clock, ShoppingBag, FileText, Navigation } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { formatCurrency, formatDate, formatReceiptTime } from '../lib/utils';
import { Order } from '../types';
import { ShopReceiptModal } from '../components/receipt/ShopReceiptModal';

export const OrdersPage: React.FC = () => {
  const { orders, reorder } = useStore();
  const [selectedReceiptOrder, setSelectedReceiptOrder] = useState<Order | null>(null);

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">
      {/* Real Shop Bill Modal */}
      <ShopReceiptModal
        order={selectedReceiptOrder}
        isOpen={Boolean(selectedReceiptOrder)}
        onClose={() => setSelectedReceiptOrder(null)}
      />

      <div className="border-b border-surface-border pb-4">
        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-obsidian">
          My Supermarket Orders
        </h1>
        <p className="text-xs text-muted mt-0.5">
          Track active deliveries, download real shop receipts, and reorder grocery essentials.
        </p>
      </div>

      {orders.length === 0 ? (
        <div className="bg-white rounded-2xl border border-surface-border p-12 text-center space-y-4 shadow-subtle max-w-md mx-auto">
          <div className="w-16 h-16 rounded-full bg-stone-100 flex items-center justify-center text-stone-400 mx-auto">
            <Package className="w-8 h-8" />
          </div>
          <h2 className="font-serif text-lg font-bold text-obsidian">No orders placed yet</h2>
          <p className="text-xs text-muted">
            Once you complete a supermarket purchase, your order status and digital receipt will appear here.
          </p>
          <Link
            to="/products"
            className="px-5 py-2.5 bg-brand-crimson text-white rounded-lg text-xs font-semibold hover:bg-brand-crimson-dark inline-block shadow-sm"
          >
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order.id}
              className="bg-white rounded-2xl border border-surface-border p-5 shadow-subtle hover:shadow-card transition-shadow space-y-4"
            >
              {/* Order Card Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-surface-border/60 pb-3 text-xs">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-obsidian">Order #{order.orderNumber}</span>
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
                  <span className="text-[11px] text-muted flex items-center gap-1 mt-0.5">
                    <Clock className="w-3 h-3 text-brand-crimson" />
                    <span>Placed {formatDate(order.createdAt)} ({formatReceiptTime(order.createdAt)} IST)</span>
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  {/* Dedicated Real Shop Bill Button */}
                  <button
                    onClick={() => setSelectedReceiptOrder(order)}
                    className="px-3 py-1.5 bg-red-50 hover:bg-red-100 text-brand-crimson border border-red-200/80 rounded-lg font-bold text-xs flex items-center gap-1.5 transition-colors shadow-2xs active:scale-95"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>View Bill</span>
                  </button>

                  <button
                    onClick={() => reorder(order.id)}
                    className="px-3 py-1.5 border border-surface-border bg-stone-50 rounded-lg text-stone-700 hover:bg-stone-100 font-semibold text-xs flex items-center gap-1 transition-colors"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>Reorder</span>
                  </button>

                  <Link
                    to={`/orders/${order.id}`}
                    className="px-3.5 py-1.5 bg-brand-crimson hover:bg-brand-crimson-dark text-white rounded-lg font-bold text-xs flex items-center gap-1.5 transition-all shadow-xs active:scale-95"
                  >
                    <Navigation className="w-3.5 h-3.5" />
                    <span>Track Order</span>
                  </Link>
                </div>
              </div>

              {/* Order Items Preview */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3 overflow-x-auto py-1">
                  {order.items.slice(0, 4).map((item, idx) => (
                    <div key={idx} className="flex items-center gap-2 shrink-0 border border-surface-border/60 rounded-lg p-1.5 bg-stone-50">
                      <img
                        src={item.imageUrl}
                        alt={item.name}
                        className="w-10 h-10 rounded object-cover"
                      />
                      <div className="text-[11px] max-w-[120px] truncate">
                        <p className="font-medium text-obsidian truncate">{item.name}</p>
                        <span className="text-muted">{item.quantity} × {item.unit}</span>
                      </div>
                    </div>
                  ))}
                  {order.items.length > 4 && (
                    <span className="text-xs text-muted font-medium shrink-0 pl-1">
                      +{order.items.length - 4} more
                    </span>
                  )}
                </div>

                <div className="text-left sm:text-right shrink-0">
                  <span className="text-[11px] text-muted block">Total Bill</span>
                  <span className="font-serif text-lg font-bold text-obsidian">
                    {formatCurrency(order.total)}
                  </span>
                  <span className="text-[10px] text-stone-500 block uppercase">
                    {order.paymentMethod.replace(/_/g, ' ')} • {order.paymentStatus}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
