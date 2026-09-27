import React, { useState } from 'react';
import { 
  Package, 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  X, 
  Check, 
  Upload, 
  AlertCircle,
  Eye
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { Product, CategoryId } from '../../types';
import { formatCurrency } from '../../lib/utils';
import { uploadToR2 } from '../../lib/r2Storage';

export const AdminProducts: React.FC = () => {
  const { products, categories, addProduct, updateProduct, deleteProduct } = useStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Form State
  const [name, setName] = useState('');
  const [category, setCategory] = useState<CategoryId>('fruits-vegetables');
  const [price, setPrice] = useState<number>(50);
  const [mrp, setMrp] = useState<number>(65);
  const [unit, setUnit] = useState('1 kg');
  const [stockQuantity, setStockQuantity] = useState<number>(50);
  const [origin, setOrigin] = useState('Local Farm Direct');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [isFeatured, setIsFeatured] = useState(false);
  const [isDailyStaple, setIsDailyStaple] = useState(false);
  const [isDeal, setIsDeal] = useState(false);
  const [inStock, setInStock] = useState(true);
  const [uploading, setUploading] = useState(false);

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.categoryName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || p.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const openAddModal = () => {
    setEditingProduct(null);
    setName('');
    setCategory('fruits-vegetables');
    setPrice(50);
    setMrp(65);
    setUnit('1 kg');
    setStockQuantity(50);
    setOrigin('Local Farm Direct');
    setDescription('');
    setImageUrl('https://images.unsplash.com/photo-1610348725531-843dff563e2c?auto=format&fit=crop&w=800&q=80');
    setIsFeatured(false);
    setIsDailyStaple(false);
    setIsDeal(false);
    setInStock(true);
    setIsModalOpen(true);
  };

  const openEditModal = (p: Product) => {
    setEditingProduct(p);
    setName(p.name);
    setCategory(p.category);
    setPrice(p.price);
    setMrp(p.mrp);
    setUnit(p.unit);
    setStockQuantity(p.stockQuantity);
    setOrigin(p.origin);
    setDescription(p.description);
    setImageUrl(p.images[0] || '');
    setIsFeatured(p.isFeatured || false);
    setIsDailyStaple(p.isDailyStaple || false);
    setIsDeal(p.isDeal || false);
    setInStock(p.inStock);
    setIsModalOpen(true);
  };

  const handleImageFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const res = await uploadToR2(file, 'products');
      setImageUrl(res.url);
    } catch (err) {
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const categoryName = categories.find(c => c.slug === category)?.name || 'General Groceries';

    if (editingProduct) {
      updateProduct(editingProduct.id, {
        name,
        category,
        categoryName,
        price,
        mrp,
        unit,
        stockQuantity,
        origin,
        description,
        images: [imageUrl || editingProduct.images[0]],
        isFeatured,
        isDailyStaple,
        isDeal,
        inStock,
      });
    } else {
      addProduct({
        name,
        slug: name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        category,
        categoryName,
        price,
        mrp,
        unit,
        stockQuantity,
        origin,
        description,
        images: [imageUrl || 'https://images.unsplash.com/photo-1610348725531-843dff563e2c?auto=format&fit=crop&w=800&q=80'],
        isFeatured,
        isDailyStaple,
        isDeal,
        inStock,
        rating: 4.8,
        reviewCount: 1,
      });
    }

    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6 max-w-7xl">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-serif text-2xl font-bold text-obsidian">Supermarket Products Catalog</h2>
          <p className="text-xs text-muted mt-0.5">Manage live stock, prices, weights, and product images.</p>
        </div>
        <button
          onClick={openAddModal}
          className="px-4 py-2.5 bg-brand-crimson hover:bg-brand-crimson-dark text-white rounded-xl text-xs font-semibold flex items-center gap-2 shadow-sm self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Product</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-surface-border shadow-subtle flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by product name, category..."
            className="w-full pl-9 pr-3 py-2 text-xs border border-surface-border rounded-lg"
          />
        </div>

        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="text-xs px-3 py-2 border border-surface-border rounded-lg bg-stone-50 text-stone-700"
        >
          <option value="all">All Aisles ({products.length})</option>
          {categories.map((c) => (
            <option key={c.id} value={c.slug}>{c.name}</option>
          ))}
        </select>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-2xl border border-surface-border overflow-hidden shadow-subtle">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="bg-stone-50 border-b border-surface-border text-muted uppercase text-[10px]">
                <th className="py-3 px-4">Item</th>
                <th className="py-3 px-4">Department</th>
                <th className="py-3 px-4">Price / MRP</th>
                <th className="py-3 px-4">Unit</th>
                <th className="py-3 px-4">Stock</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-border">
              {filteredProducts.map((p) => (
                <tr key={p.id} className="hover:bg-stone-50">
                  <td className="py-3 px-4 flex items-center gap-3">
                    <img
                      src={p.images[0]}
                      alt={p.name}
                      className="w-10 h-10 rounded-lg object-cover border border-surface-border shrink-0"
                    />
                    <div className="min-w-0 max-w-[200px]">
                      <p className="font-semibold text-obsidian truncate">{p.name}</p>
                      <span className="text-[10px] text-muted truncate block">{p.origin}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-stone-700">
                    {p.categoryName}
                  </td>
                  <td className="py-3 px-4">
                    <span className="font-bold text-obsidian">{formatCurrency(p.price)}</span>
                    {p.mrp > p.price && (
                      <span className="text-[10px] text-muted line-through ml-1.5">
                        {formatCurrency(p.mrp)}
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-4 font-medium text-stone-600">
                    {p.unit}
                  </td>
                  <td className="py-3 px-4">
                    <span className={`font-bold ${p.stockQuantity <= 30 ? 'text-red-600' : 'text-stone-800'}`}>
                      {p.stockQuantity} units
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                      p.inStock ? 'bg-green-100 text-supermarket-fresh' : 'bg-red-100 text-red-700'
                    }`}>
                      {p.inStock ? 'Active' : 'Out of Stock'}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right space-x-2">
                    <button
                      onClick={() => openEditModal(p)}
                      className="p-1.5 text-stone-600 hover:text-brand-crimson hover:bg-stone-100 rounded-lg"
                      title="Edit Product"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => {
                        if (confirm(`Are you sure you want to delete ${p.name}?`)) {
                          deleteProduct(p.id);
                        }
                      }}
                      className="p-1.5 text-stone-400 hover:text-red-600 hover:bg-red-50 rounded-lg"
                      title="Delete Product"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Product Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-2xl w-full border border-surface-border shadow-2xl p-6 my-8 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-surface-border">
              <h3 className="font-serif text-lg font-bold text-obsidian">
                {editingProduct ? 'Edit Supermarket Product' : 'Add New Product to Supermarket'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-stone-400 hover:text-stone-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="sm:col-span-2">
                  <label className="block font-semibold text-stone-700 mb-1">Product Title</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Pure Cold Pressed Gingelly Oil"
                    className="w-full px-3 py-2 border border-surface-border rounded-lg"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Department / Aisle</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full px-3 py-2 border border-surface-border rounded-lg bg-stone-50"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.slug}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Pack Size / Unit</label>
                  <input
                    type="text"
                    required
                    value={unit}
                    onChange={(e) => setUnit(e.target.value)}
                    placeholder="e.g. 1 kg, 500 ml, Pack of 6"
                    className="w-full px-3 py-2 border border-surface-border rounded-lg"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Sale Price (₹)</label>
                  <input
                    type="number"
                    required
                    min={0}
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-surface-border rounded-lg"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">MRP (₹ - For Discount)</label>
                  <input
                    type="number"
                    required
                    min={price}
                    value={mrp}
                    onChange={(e) => setMrp(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-surface-border rounded-lg"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Initial Stock Count</label>
                  <input
                    type="number"
                    required
                    min={0}
                    value={stockQuantity}
                    onChange={(e) => setStockQuantity(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-surface-border rounded-lg"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Origin / Farm Location</label>
                  <input
                    type="text"
                    value={origin}
                    onChange={(e) => setOrigin(e.target.value)}
                    placeholder="e.g. Ooty Farm Select"
                    className="w-full px-3 py-2 border border-surface-border rounded-lg"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-semibold text-stone-700 mb-1">Image URL (or Cloudflare R2 Upload)</label>
                  <div className="flex gap-2">
                    <input
                      type="url"
                      value={imageUrl}
                      onChange={(e) => setImageUrl(e.target.value)}
                      placeholder="https://images.unsplash.com/..."
                      className="flex-1 px-3 py-2 border border-surface-border rounded-lg"
                    />
                    <label className="px-3 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-lg cursor-pointer flex items-center gap-1">
                      <Upload className="w-3.5 h-3.5" />
                      <span>{uploading ? 'Uploading...' : 'Upload File'}</span>
                      <input type="file" accept="image/*" className="hidden" onChange={handleImageFileChange} />
                    </label>
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-semibold text-stone-700 mb-1">Description</label>
                  <textarea
                    rows={3}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Short description of taste, origin, and everyday usage..."
                    className="w-full px-3 py-2 border border-surface-border rounded-lg"
                  />
                </div>
              </div>

              {/* Toggles */}
              <div className="flex flex-wrap gap-4 pt-2 border-t border-surface-border">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={inStock}
                    onChange={(e) => setInStock(e.target.checked)}
                    className="text-brand-crimson"
                  />
                  <span className="font-medium">In Stock</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isFeatured}
                    onChange={(e) => setIsFeatured(e.target.checked)}
                    className="text-brand-crimson"
                  />
                  <span className="font-medium">Featured Showcase</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isDailyStaple}
                    onChange={(e) => setIsDailyStaple(e.target.checked)}
                    className="text-brand-crimson"
                  />
                  <span className="font-medium">Daily Staple</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isDeal}
                    onChange={(e) => setIsDeal(e.target.checked)}
                    className="text-brand-crimson"
                  />
                  <span className="font-medium">Special Offer</span>
                </label>
              </div>

              <div className="flex gap-2 pt-3 border-t border-surface-border">
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-brand-crimson text-white rounded-xl font-semibold hover:bg-brand-crimson-dark shadow-sm"
                >
                  {editingProduct ? 'Update Product' : 'Create Product'}
                </button>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 border border-surface-border rounded-xl text-stone-700 hover:bg-stone-50"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
