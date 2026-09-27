import React, { useState } from 'react';
import { Layers, Plus, Edit, Trash2, X, Image as ImageIcon } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { Category } from '../../types';

export const AdminCategories: React.FC = () => {
  const { categories, updateCategory, products } = useStore();
  const [editingCat, setEditingCat] = useState<Category | null>(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  const handleEdit = (c: Category) => {
    setEditingCat(c);
    setName(c.name);
    setDescription(c.description);
    setImageUrl(c.imageUrl);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingCat) {
      updateCategory(editingCat.id, {
        name,
        description,
        imageUrl,
      });
      setEditingCat(null);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-serif text-2xl font-bold text-obsidian">Supermarket Aisles & Categories</h2>
          <p className="text-xs text-muted mt-0.5">Manage store departments, imagery, and product associations.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map((c) => {
          const count = products.filter(p => p.category === c.slug).length;

          return (
            <div key={c.id} className="bg-white rounded-2xl border border-surface-border p-4 shadow-subtle flex flex-col justify-between space-y-3">
              <div className="space-y-3">
                <div className="relative aspect-video rounded-xl overflow-hidden bg-stone-100 border border-surface-border">
                  <img src={c.imageUrl} alt={c.name} className="w-full h-full object-cover" />
                  <span className="absolute bottom-2 right-2 bg-stone-900/80 text-white text-[10px] font-bold px-2 py-0.5 rounded">
                    {count} Products
                  </span>
                </div>

                <div>
                  <h3 className="font-serif font-bold text-base text-obsidian">{c.name}</h3>
                  <p className="text-xs text-muted mt-1 line-clamp-2">{c.description}</p>
                </div>
              </div>

              <div className="pt-3 border-t border-surface-border flex items-center justify-between">
                <span className="text-[11px] text-muted font-mono">slug: /{c.slug}</span>
                <button
                  onClick={() => handleEdit(c)}
                  className="px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors"
                >
                  <Edit className="w-3.5 h-3.5" />
                  <span>Edit</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Edit Category Modal */}
      {editingCat && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 border border-surface-border shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-surface-border">
              <h3 className="font-bold text-sm text-obsidian">Edit Aisle: {editingCat.name}</h3>
              <button onClick={() => setEditingCat(null)} className="text-stone-400 hover:text-stone-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-3 text-xs">
              <div>
                <label className="block font-medium text-stone-700 mb-1">Aisle Display Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 border border-surface-border rounded-lg"
                />
              </div>

              <div>
                <label className="block font-medium text-stone-700 mb-1">Aisle Image URL (R2 or CDN)</label>
                <input
                  type="url"
                  required
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className="w-full px-3 py-2 border border-surface-border rounded-lg"
                />
              </div>

              <div>
                <label className="block font-medium text-stone-700 mb-1">Description</label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3 py-2 border border-surface-border rounded-lg"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  className="flex-1 py-2 bg-brand-crimson text-white rounded-lg font-semibold hover:bg-brand-crimson-dark"
                >
                  Save Changes
                </button>
                <button
                  type="button"
                  onClick={() => setEditingCat(null)}
                  className="px-4 py-2 border border-surface-border rounded-lg text-stone-700"
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
