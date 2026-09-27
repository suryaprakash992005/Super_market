import React from 'react';
import { Link } from 'react-router-dom';
import { 
  DollarSign, 
  ShoppingBag, 
  Clock, 
  Boxes, 
  AlertTriangle, 
  CheckCircle2, 
  ArrowRight,
  TrendingUp,
  Package
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { formatCurrency, formatDate } from '../../lib/utils';

export const AdminDashboard: React.FC = () => {
  const { orders, products, updateOrderStatus } = useStore();

  // Calculate real operational figures from current state
  const totalRevenue = orders
    .filter(o => o.paymentStatus === 'paid')
    .reduce((sum, o) => sum + o.total, 0);

  const pendingOrders = orders.filter(o => o.status === 'placed' || o.status === 'confirmed' || o.status === 'packed');
  const deliveredOrders = orders.filter(o => o.status === 'delivered');
  const lowStockProducts = products.filter(p => p.stockQuantity <= 30);

  return (
    <div className="space-y-6 max-w-7xl">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Revenue */}
        <div className="bg-white p-5 rounded-2xl border border-surface-border shadow-subtle flex flex-col justify-between">
          <div className="flex items-center justify-between text-stone-600 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-muted">Verified Revenue</span>
            <div className="w-8 h-8 rounded-lg bg-green-50 text-supermarket-fresh flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div>
            <span className="font-serif text-2xl sm:text-3xl font-bold text-obsidian">
              {formatCurrency(totalRevenue)}
            </span>
            <p className="text-[11px] text-muted mt-1">From completed & paid orders</p>
          </div>
        </div>

        {/* Total Orders */}
        <div className="bg-white p-5 rounded-2xl border border-surface-border shadow-subtle flex flex-col justify-between">
          <div className="flex items-center justify-between text-stone-600 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-muted">All Orders</span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <div>
            <span className="font-serif text-2xl sm:text-3xl font-bold text-obsidian">
              {orders.length}
            </span>
            <p className="text-[11px] text-supermarket-fresh font-medium mt-1">
              {deliveredOrders.length} delivered successfully
            </p>
          </div>
        </div>

        {/* Pending Fulfillment */}
        <div className="bg-white p-5 rounded-2xl border border-surface-border shadow-subtle flex flex-col justify-between">
          <div className="flex items-center justify-between text-stone-600 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-muted">Pending Orders</span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div>
            <span className="font-serif text-2xl sm:text-3xl font-bold text-amber-700">
              {pendingOrders.length}
            </span>
            <p className="text-[11px] text-muted mt-1">Require packaging / dispatch</p>
          </div>
        </div>

        {/* Inventory Alert */}
        <div className="bg-white p-5 rounded-2xl border border-surface-border shadow-subtle flex flex-col justify-between">
          <div className="flex items-center justify-between text-stone-600 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-muted">Low Stock Alert</span>
            <div className="w-8 h-8 rounded-lg bg-red-50 text-brand-crimson flex items-center justify-center">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div>
            <span className="font-serif text-2xl sm:text-3xl font-bold text-brand-crimson">
              {lowStockProducts.length}
            </span>
            <p className="text-[11px] text-muted mt-1">Products below safety threshold</p>
          </div>
        </div>
      </div>

      {/* Grid: Recent Orders and Low Stock Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Recent Orders Table */}
        <div className="lg:col-span-8 bg-white rounded-2xl border border-surface-border p-5 shadow-subtle space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-surface-border">
            <h2 className="font-serif text-base font-bold text-obsidian flex items-center gap-2">
              <ShoppingBag className="w-4 h-4 text-brand-crimson" />
              <span>Recent Supermarket Orders</span>
            </h2>
            <Link
              to="/admin/orders"
              className="text-xs font-semibold text-brand-crimson hover:underline flex items-center gap-1"
            >
              <span>Manage Pipeline</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b border-surface-border text-muted uppercase text-[10px]">
                  <th className="py-2.5 px-3">Order</th>
                  <th className="py-2.5 px-3">Customer</th>
                  <th className="py-2.5 px-3">Items</th>
                  <th className="py-2.5 px-3">Total</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3 text-right">Quick Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-border/60">
                {orders.slice(0, 5).map((order) => (
                  <tr key={order.id} className="hover:bg-stone-50">
                    <td className="py-3 px-3 font-semibold text-stone-900">
                      #{order.orderNumber}
                    </td>
                    <td className="py-3 px-3">
                      <p className="font-medium text-obsidian">{order.customerName}</p>
                      <span className="text-[10px] text-muted">{order.customerPhone}</span>
                    </td>
                    <td className="py-3 px-3 text-stone-600">
                      {order.items.length} items
                    </td>
                    <td className="py-3 px-3 font-bold text-obsidian">
                      {formatCurrency(order.total)}
                    </td>
                    <td className="py-3 px-3">
                      <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                        order.status === 'delivered' 
                          ? 'bg-green-100 text-supermarket-fresh' 
                          : order.status === 'out_for_delivery'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}>
                        {order.status.replace(/_/g, ' ')}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right">
                      {order.status !== 'delivered' && (
                        <button
                          onClick={() => {
                            const nextStatus = 
                              order.status === 'placed' ? 'confirmed' :
                              order.status === 'confirmed' ? 'packed' :
                              order.status === 'packed' ? 'out_for_delivery' : 'delivered';
                            updateOrderStatus(order.id, nextStatus);
                          }}
                          className="px-2 py-1 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded font-semibold text-[10px]"
                        >
                          Advance Status
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Low Stock Watchlist */}
        <div className="lg:col-span-4 bg-white rounded-2xl border border-surface-border p-5 shadow-subtle space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-surface-border">
            <h2 className="font-serif text-base font-bold text-obsidian flex items-center gap-2">
              <Boxes className="w-4 h-4 text-brand-crimson" />
              <span>Restock Watchlist</span>
            </h2>
            <Link
              to="/admin/inventory"
              className="text-xs font-semibold text-brand-crimson hover:underline"
            >
              Inventory &rarr;
            </Link>
          </div>

          <div className="space-y-2.5">
            {lowStockProducts.slice(0, 5).map((p) => (
              <div key={p.id} className="p-3 bg-stone-50 rounded-xl border border-surface-border flex items-center justify-between text-xs">
                <div className="min-w-0 pr-2">
                  <p className="font-medium text-obsidian truncate">{p.name}</p>
                  <span className="text-[11px] text-muted">{p.unit} • {formatCurrency(p.price)}</span>
                </div>
                <div className="text-right shrink-0">
                  <span className="font-bold text-red-600 block">
                    {p.stockQuantity} left
                  </span>
                  <span className="text-[10px] text-muted uppercase">Restock soon</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
