import React, { useState } from 'react';
import { 
  ShoppingBag, 
  Search, 
  Clock, 
  Truck, 
  Package, 
  CheckCircle2, 
  X, 
  ChevronRight,
  Filter,
  Eye,
  MapPin,
  FileText
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { Order, OrderStatus, PaymentStatus } from '../../types';
import { formatCurrency, formatDate } from '../../lib/utils';
import { ShopReceiptModal } from '../../components/receipt/ShopReceiptModal';

export const AdminOrders: React.FC = () => {
  const { orders, updateOrderStatus, updateOrderPaymentStatus } = useStore();
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [receiptModalOrder, setReceiptModalOrder] = useState<Order | null>(null);

  const filteredOrders = orders.filter(o => {
    const matchesStatus = statusFilter === 'all' || o.status === statusFilter;
    const matchesSearch = 
      o.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.customerPhone.includes(searchTerm);
    return matchesStatus && matchesSearch;
  });

  const allStatuses: { key: OrderStatus; label: string }[] = [
    { key: 'placed', label: 'Placed' },
    { key: 'confirmed', label: 'Confirmed' },
    { key: 'packed', label: 'Packed' },
    { key: 'out_for_delivery', label: 'Out for Delivery / Ready' },
    { key: 'delivered', label: 'Delivered' },
    { key: 'cancelled', label: 'Cancelled' },
  ];

  return (
    <div className="space-y-6 max-w-7xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-serif text-2xl font-bold text-obsidian">Supermarket Order Fulfillment Pipeline</h2>
          <p className="text-xs text-muted mt-0.5">Live order packaging, delivery driver dispatch, and payment ledger.</p>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="bg-white p-4 rounded-2xl border border-surface-border shadow-subtle flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by order #, customer name, mobile..."
            className="w-full pl-9 pr-3 py-2 text-xs border border-surface-border rounded-lg"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="text-xs px-3 py-2 border border-surface-border rounded-lg bg-stone-50 text-stone-700 font-medium"
        >
          <option value="all">All Order Statuses ({orders.length})</option>
          <option value="placed">Placed</option>
          <option value="confirmed">Confirmed</option>
          <option value="packed">Packed</option>
          <option value="out_for_delivery">Out for Delivery</option>
          <option value="delivered">Delivered</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-2xl border border-surface-border overflow-hidden shadow-subtle">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="bg-stone-50 border-b border-surface-border text-muted uppercase text-[10px]">
                <th className="py-3 px-4">Order ID & Date</th>
                <th className="py-3 px-4">Customer Details</th>
                <th className="py-3 px-4">Fulfillment Type</th>
                <th className="py-3 px-4">Total & Payment</th>
                <th className="py-3 px-4">Current Status</th>
                <th className="py-3 px-4 text-right">Fulfillment Control</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-border">
              {filteredOrders.map((order) => (
                <tr key={order.id} className="hover:bg-stone-50">
                  <td className="py-3.5 px-4">
                    <span className="font-bold text-obsidian block">#{order.orderNumber}</span>
                    <span className="text-[10px] text-muted">{formatDate(order.createdAt)}</span>
                  </td>
                  <td className="py-3.5 px-4">
                    <p className="font-semibold text-obsidian">{order.customerName}</p>
                    <p className="text-[10px] text-muted">{order.customerPhone}</p>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="capitalize text-stone-700 font-medium block">
                      {order.fulfillmentMethod.replace(/_/g, ' ')}
                    </span>
                    <span className="text-[10px] text-brand-crimson">
                      {order.deliverySlot}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="font-bold text-obsidian block">{formatCurrency(order.total)}</span>
                    <span className={`text-[10px] font-semibold uppercase ${order.paymentStatus === 'paid' ? 'text-supermarket-fresh' : 'text-amber-700'}`}>
                      {order.paymentMethod} • {order.paymentStatus}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <select
                      value={order.status}
                      onChange={(e) => updateOrderStatus(order.id, e.target.value as OrderStatus)}
                      className={`text-[11px] font-bold uppercase px-2.5 py-1 rounded-lg border cursor-pointer ${
                        order.status === 'delivered' 
                          ? 'bg-green-50 text-supermarket-fresh border-green-200'
                          : order.status === 'cancelled'
                          ? 'bg-red-50 text-red-700 border-red-200'
                          : 'bg-amber-50 text-amber-800 border-amber-200'
                      }`}
                    >
                      {allStatuses.map((s) => (
                        <option key={s.key} value={s.key}>{s.label}</option>
                      ))}
                    </select>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => setReceiptModalOrder(order)}
                        className="px-2.5 py-1.5 bg-red-50 hover:bg-red-100 text-brand-crimson border border-red-200/80 rounded-lg text-xs font-bold flex items-center gap-1 transition-colors"
                        title="View official store receipt"
                      >
                        <FileText className="w-3.5 h-3.5" />
                        <span>Bill</span>
                      </button>
                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="px-2.5 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-lg text-xs font-semibold flex items-center gap-1"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Inspect</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Inspect Order Drawer / Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 border border-surface-border shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-surface-border">
              <div>
                <h3 className="font-bold text-sm text-obsidian">Order #{selectedOrder.orderNumber}</h3>
                <p className="text-[11px] text-muted">Placed {formatDate(selectedOrder.createdAt)}</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setReceiptModalOrder(selectedOrder)}
                  className="px-3 py-1.5 bg-brand-crimson hover:bg-brand-crimson-dark text-white rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors shadow-xs"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>View Bill</span>
                </button>
                <button onClick={() => setSelectedOrder(null)} className="text-stone-400 hover:text-stone-700 p-1">
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Customer Details */}
            <div className="p-3 bg-stone-50 rounded-xl border border-surface-border text-xs space-y-1">
              <p className="font-bold text-stone-900">{selectedOrder.customerName} ({selectedOrder.customerPhone})</p>
              {selectedOrder.deliveryAddress && (
                <p className="text-stone-600 flex items-start gap-1 mt-1">
                  <MapPin className="w-3.5 h-3.5 text-brand-crimson shrink-0 mt-0.5" />
                  <span>{selectedOrder.deliveryAddress.streetAddress}, {selectedOrder.deliveryAddress.city} {selectedOrder.deliveryAddress.postalCode}</span>
                </p>
              )}
            </div>

            {/* Line items list */}
            <div>
              <h4 className="text-xs font-bold text-stone-900 mb-2 uppercase tracking-wider">
                Packaging Checklist ({selectedOrder.items.length} items)
              </h4>
              <div className="divide-y divide-surface-border border border-surface-border rounded-xl overflow-hidden text-xs">
                {selectedOrder.items.map((item, idx) => (
                  <div key={idx} className="p-2.5 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <img src={item.imageUrl} alt={item.name} className="w-8 h-8 rounded object-cover border" />
                      <div>
                        <p className="font-semibold text-obsidian">{item.name}</p>
                        <span className="text-[10px] text-muted">{item.unit}</span>
                      </div>
                    </div>
                    <div className="text-right font-bold text-stone-900">
                      <span>{item.quantity} units</span>
                      <span className="text-[10px] text-muted block">{formatCurrency(item.total)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Change Payment Status */}
            <div className="flex items-center justify-between pt-3 border-t border-surface-border text-xs">
              <span className="font-semibold text-stone-700">Payment Status:</span>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    updateOrderPaymentStatus(selectedOrder.id, 'paid');
                    setSelectedOrder({ ...selectedOrder, paymentStatus: 'paid' });
                  }}
                  className={`px-3 py-1 rounded text-xs font-semibold ${selectedOrder.paymentStatus === 'paid' ? 'bg-supermarket-fresh text-white' : 'bg-stone-100 text-stone-700'}`}
                >
                  Mark Paid
                </button>
                <button
                  onClick={() => {
                    updateOrderPaymentStatus(selectedOrder.id, 'pending');
                    setSelectedOrder({ ...selectedOrder, paymentStatus: 'pending' });
                  }}
                  className={`px-3 py-1 rounded text-xs font-semibold ${selectedOrder.paymentStatus === 'pending' ? 'bg-amber-700 text-white' : 'bg-stone-100 text-stone-700'}`}
                >
                  Mark Pending
                </button>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={() => setSelectedOrder(null)}
                className="w-full py-2 bg-stone-900 text-white rounded-lg text-xs font-semibold hover:bg-stone-800"
              >
                Close Inspector
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Real Shop Bill Modal for Admin */}
      <ShopReceiptModal
        order={receiptModalOrder}
        isOpen={Boolean(receiptModalOrder)}
        onClose={() => setReceiptModalOrder(null)}
      />
    </div>
  );
};
