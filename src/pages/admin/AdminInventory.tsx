import React, { useState } from 'react';
import { Boxes, Plus, Minus, AlertTriangle, CheckCircle2, Search } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { formatCurrency } from '../../lib/utils';

export const AdminInventory: React.FC = () => {
  const { products, updateProduct } = useStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterLowStockOnly, setFilterLowStockOnly] = useState(false);

  const filtered = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLowStock = filterLowStockOnly ? p.stockQuantity <= 30 : true;
    return matchesSearch && matchesLowStock;
  });

  const handleAdjustStock = (productId: string, delta: number) => {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    const newQty = Math.max(0, product.stockQuantity + delta);
    updateProduct(productId, {
      stockQuantity: newQty,
      inStock: newQty > 0,
    });
  };

  const handleManualStock = (productId: string, value: number) => {
    const validValue = Math.max(0, isNaN(value) ? 0 : value);
    updateProduct(productId, {
      stockQuantity: validValue,
      inStock: validValue > 0,
    });
  };

  return (
    <div className="space-y-6 max-w-7xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-serif text-2xl font-bold text-obsidian">Supermarket Inventory & Stock</h2>
          <p className="text-xs text-muted mt-0.5">Real-time stock controls, low-stock thresholds, and quick-replenish actions.</p>
        </div>

        <label className="flex items-center gap-2 text-xs font-semibold text-stone-800 bg-white border border-surface-border px-3 py-2 rounded-xl shadow-xs cursor-pointer">
          <input
            type="checkbox"
            checked={filterLowStockOnly}
            onChange={(e) => setFilterLowStockOnly(e.target.checked)}
            className="rounded text-brand-crimson focus:ring-brand-crimson"
          />
          <AlertTriangle className="w-4 h-4 text-amber-600" />
          <span>Show Low Stock Only (&le;30 units)</span>
        </label>
      </div>

      {/* Search */}
      <div className="bg-white p-4 rounded-2xl border border-surface-border shadow-subtle flex gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search items by name to adjust stock..."
            className="w-full pl-9 pr-3 py-2 text-xs border border-surface-border rounded-lg"
          />
        </div>
      </div>

      {/* Inventory Table */}
      <div className="bg-white rounded-2xl border border-surface-border overflow-hidden shadow-subtle">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="bg-stone-50 border-b border-surface-border text-muted uppercase text-[10px]">
                <th className="py-3 px-4">Item Details</th>
                <th className="py-3 px-4">Aisle</th>
                <th className="py-3 px-4">Unit</th>
                <th className="py-3 px-4">Current Stock</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Stock Adjustments</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-border">
              {filtered.map((p) => (
                <tr key={p.id} className="hover:bg-stone-50">
                  <td className="py-3 px-4 flex items-center gap-3">
                    <img
                      src={p.images[0]}
                      alt={p.name}
                      className="w-9 h-9 rounded-lg object-cover border border-surface-border shrink-0"
                    />
                    <div className="min-w-0 max-w-[220px]">
                      <p className="font-semibold text-obsidian truncate">{p.name}</p>
                      <span className="text-[10px] text-muted">{formatCurrency(p.price)}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-stone-600">{p.categoryName}</td>
                  <td className="py-3 px-4 font-medium">{p.unit}</td>
                  <td className="py-3 px-4">
                    <input
                      type="number"
                      min={0}
                      value={p.stockQuantity}
                      onChange={(e) => handleManualStock(p.id, parseInt(e.target.value))}
                      className="w-20 px-2 py-1 border border-surface-border rounded font-bold text-center text-xs focus:border-brand-crimson"
                    />
                  </td>
                  <td className="py-3 px-4">
                    {p.stockQuantity === 0 ? (
                      <span className="bg-red-100 text-red-700 px-2 py-0.5 rounded-full text-[10px] font-bold">
                        OUT OF STOCK
                      </span>
                    ) : p.stockQuantity <= 30 ? (
                      <span className="bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-1 w-fit">
                        <AlertTriangle className="w-3 h-3" />
                        <span>LOW STOCK</span>
                      </span>
                    ) : (
                      <span className="bg-green-100 text-supermarket-fresh px-2 py-0.5 rounded-full text-[10px] font-bold">
                        ADEQUATE
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="inline-flex items-center gap-1">
                      <button
                        onClick={() => handleAdjustStock(p.id, -5)}
                        className="px-2 py-1 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded text-[11px] font-semibold"
                        title="Deduct 5"
                      >
                        -5
                      </button>
                      <button
                        onClick={() => handleAdjustStock(p.id, 10)}
                        className="px-2 py-1 bg-green-50 hover:bg-green-100 text-supermarket-fresh border border-green-200 rounded text-[11px] font-semibold"
                        title="Add 10"
                      >
                        +10
                      </button>
                      <button
                        onClick={() => handleAdjustStock(p.id, 50)}
                        className="px-2 py-1 bg-brand-crimson-tint hover:bg-red-100 text-brand-crimson border border-brand-crimson/20 rounded text-[11px] font-bold"
                        title="Bulk Restock 50"
                      >
                        +50 Restock
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
