import React, { useState, useMemo } from 'react';
import { Layers, Plus, Edit, Trash2, X, Search, Image as ImageIcon, ChevronRight } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { Category } from '../../types';
import { cn } from '../../lib/utils';

export const AdminCategories: React.FC = () => {
  const { categories, updateCategory, products } = useStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [editingCat, setEditingCat] = useState<Category | null>(null);
  const [name, setName] = useState('');
  const [icon, setIcon] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  const filteredCategories = useMemo(() => {
    if (!searchTerm.trim()) return categories;
    const q = searchTerm.toLowerCase();
    return categories.filter(c => 
      c.name.toLowerCase().includes(q) || 
      c.slug.toLowerCase().includes(q) ||
      (c.description && c.description.toLowerCase().includes(q)) ||
      (c.subcategories && c.subcategories.some(s => s.name.toLowerCase().includes(q)))
    );
  }, [categories, searchTerm]);

  const handleEdit = (c: Category) => {
    setEditingCat(c);
    setName(c.name);
    setIcon(c.icon || '');
    setDescription(c.description || '');
    setImageUrl(c.imageUrl);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingCat) {
      updateCategory(editingCat.id, {
        name,
        icon,
        description,
        imageUrl,
      });
      setEditingCat(null);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-surface-border pb-4">
        <div>
          <h2 className="font-serif text-2xl font-bold text-obsidian flex items-center gap-2">
            <span>Supermarket Aisles & Hierarchy</span>
            <span className="text-xs bg-stone-100 text-stone-700 px-2.5 py-0.5 rounded-full font-sans font-semibold">
              {categories.length} Departments
            </span>
          </h2>
          <p className="text-xs text-muted mt-0.5">
            Manage 32 store departments (A to AF), subcategory associations, imagery, and icons.
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-72">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
          <input
            type="text"
            placeholder="Search departments or subcategories..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-8 pr-3 py-2 bg-white border border-surface-border rounded-xl text-xs text-stone-800 placeholder-stone-400 focus:outline-hidden focus:border-brand-crimson"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredCategories.map((c) => {
          const count = products.filter(p => p.category === c.slug || p.subcategoryId === c.id).length;
          const subCount = c.subcategories ? c.subcategories.length : 0;

          return (
            <div key={c.id} className="bg-white rounded-2xl border border-surface-border p-4 shadow-subtle flex flex-col justify-between space-y-4 hover:border-brand-crimson/30 transition-all">
              <div className="space-y-3">
                <div className="relative aspect-video rounded-xl overflow-hidden bg-stone-100 border border-surface-border">
                  <img src={c.imageUrl} alt={c.name} className="w-full h-full object-cover" />
                  <div className="absolute top-2 left-2 bg-stone-900/80 backdrop-blur-xs text-white text-[11px] font-bold px-2 py-0.5 rounded flex items-center gap-1.5">
                    {c.icon && <span>{c.icon}</span>}
                    <span>/{c.slug}</span>
                  </div>
                  <span className="absolute bottom-2 right-2 bg-brand-crimson text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full shadow-xs">
                    {count} Products
                  </span>
                </div>

                <div>
                  <div className="flex items-center justify-between">
                    <h3 className="font-serif font-bold text-base text-obsidian flex items-center gap-1.5">
                      {c.icon && <span>{c.icon}</span>}
                      <span>{c.name}</span>
                    </h3>
                    <span className="text-[10px] text-stone-500 font-semibold bg-stone-100 px-2 py-0.5 rounded">
                      {subCount} Sub-aisles
                    </span>
                  </div>
                  <p className="text-xs text-muted mt-1 line-clamp-2 leading-relaxed">{c.description}</p>
                </div>

                {/* Subcategory Chips preview */}
                {c.subcategories && c.subcategories.length > 0 && (
                  <div className="pt-2 border-t border-surface-border/60">
                    <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block mb-1">
                      Subcategories:
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {c.subcategories.slice(0, 5).map((s) => (
                        <span key={s.id} className="inline-flex items-center gap-1 bg-stone-50 border border-surface-border text-stone-700 text-[10px] font-medium px-2 py-0.5 rounded-md">
                          {s.icon && <span>{s.icon}</span>}
                          <span>{s.name}</span>
                        </span>
                      ))}
                      {c.subcategories.length > 5 && (
                        <span className="text-[10px] text-stone-400 font-medium self-center pl-1">
                          +{c.subcategories.length - 5} more
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>

              <div className="pt-3 border-t border-surface-border flex items-center justify-between">
                <span className="text-[11px] text-muted font-mono">id: {c.id}</span>
                <button
                  type="button"
                  onClick={() => handleEdit(c)}
                  className="px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
                >
                  <Edit className="w-3.5 h-3.5 text-stone-600" />
                  <span>Edit Department</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Edit Category Modal */}
      {editingCat && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 border border-surface-border shadow-2xl space-y-4 animate-scaleUp">
            <div className="flex items-center justify-between pb-3 border-b border-surface-border">
              <h3 className="font-serif font-bold text-base text-obsidian flex items-center gap-2">
                {editingCat.icon && <span>{editingCat.icon}</span>}
                <span>Edit Department: {editingCat.name}</span>
              </h3>
              <button 
                type="button"
                onClick={() => setEditingCat(null)} 
                className="w-8 h-8 rounded-full bg-stone-100 flex items-center justify-center text-stone-500 hover:text-stone-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-medium text-stone-700 mb-1">Aisle Display Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 border border-surface-border rounded-xl text-xs focus:outline-hidden focus:border-brand-crimson"
                />
              </div>

              <div>
                <label className="block font-medium text-stone-700 mb-1">Emoji / Department Icon</label>
                <input
                  type="text"
                  placeholder="e.g. 🌾 or 🥦"
                  value={icon}
                  onChange={(e) => setIcon(e.target.value)}
                  className="w-full px-3 py-2 border border-surface-border rounded-xl text-xs focus:outline-hidden focus:border-brand-crimson"
                />
              </div>

              <div>
                <label className="block font-medium text-stone-700 mb-1">Aisle Image URL (R2 or CDN)</label>
                <input
                  type="url"
                  required
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className="w-full px-3 py-2 border border-surface-border rounded-xl text-xs focus:outline-hidden focus:border-brand-crimson"
                />
              </div>

              <div>
                <label className="block font-medium text-stone-700 mb-1">Description</label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3 py-2 border border-surface-border rounded-xl text-xs focus:outline-hidden focus:border-brand-crimson"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-brand-crimson text-white rounded-full font-bold hover:bg-brand-crimson-dark shadow-sm transition-all"
                >
                  Save Department
                </button>
                <button
                  type="button"
                  onClick={() => setEditingCat(null)}
                  className="px-5 py-2.5 border border-surface-border rounded-full text-stone-700 hover:bg-stone-50"
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
