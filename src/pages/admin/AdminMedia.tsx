import React, { useState } from 'react';
import { 
  Image as ImageIcon, 
  Upload, 
  Copy, 
  Check, 
  ExternalLink, 
  Trash2, 
  Cloud, 
  ShieldCheck, 
  Sparkles 
} from 'lucide-react';
import { uploadToR2, getR2ImageUrl } from '../../lib/r2Storage';
import { useStore } from '../../context/StoreContext';

interface MediaAsset {
  id: string;
  name: string;
  key: string;
  url: string;
  size: string;
  category: 'products' | 'banners' | 'supermarket';
}

export const AdminMedia: React.FC = () => {
  const { products, banners } = useStore();
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [uploading, setUploading] = useState<boolean>(false);

  // Initial media assets gathered from current catalog
  const [assets, setAssets] = useState<MediaAsset[]>(() => {
    const list: MediaAsset[] = [];
    products.slice(0, 8).forEach((p, idx) => {
      list.push({
        id: `r2-prod-${idx}`,
        name: `${p.name.slice(0, 24)}.jpg`,
        key: `products/${p.slug}.jpg`,
        url: p.images[0],
        size: '142 KB',
        category: 'products',
      });
    });
    banners.forEach((b, idx) => {
      list.push({
        id: `r2-ban-${idx}`,
        name: `${b.title.slice(0, 20)}.jpg`,
        key: `banners/${b.id}.jpg`,
        url: b.imageUrl,
        size: '420 KB',
        category: 'banners',
      });
    });
    return list;
  });

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const res = await uploadToR2(file, 'products');
      const newAsset: MediaAsset = {
        id: `r2-uploaded-${Date.now()}`,
        name: file.name,
        key: res.key,
        url: res.url,
        size: `${Math.round(file.size / 1024)} KB`,
        category: 'products',
      };
      setAssets(prev => [newAsset, ...prev]);
    } catch (err) {
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  const copyToClipboard = (url: string, id: string) => {
    navigator.clipboard.writeText(url);
    setCopiedKey(id);
    setTimeout(() => setCopiedKey(null), 1500);
  };

  return (
    <div className="space-y-6 max-w-7xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-serif text-2xl font-bold text-obsidian">Cloudflare R2 Object Storage</h2>
          <p className="text-xs text-muted mt-0.5">High-speed global CDN delivery for supermarket photos and promotional banners.</p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1 bg-amber-50 text-amber-800 border border-amber-200 rounded-full text-xs font-semibold flex items-center gap-1.5">
            <Cloud className="w-3.5 h-3.5 text-amber-600" />
            <span>R2 Bucket: bharathi-supermarket-media</span>
          </span>
        </div>
      </div>

      {/* Upload Box */}
      <div className="bg-white rounded-2xl border-2 border-dashed border-surface-border-strong p-8 text-center shadow-subtle hover:border-brand-crimson transition-colors">
        <div className="w-12 h-12 rounded-full bg-brand-crimson-tint text-brand-crimson flex items-center justify-center mx-auto mb-3">
          <Upload className="w-6 h-6" />
        </div>
        <h3 className="font-semibold text-sm text-obsidian">
          {uploading ? 'Compressing and uploading to Cloudflare R2...' : 'Upload Product or Banner Image'}
        </h3>
        <p className="text-xs text-muted max-w-sm mx-auto mt-1 mb-4">
          Files are automatically web-optimized and delivered through edge CDN without bloating PostgreSQL.
        </p>
        <label className="px-4 py-2 bg-brand-crimson hover:bg-brand-crimson-dark text-white rounded-xl text-xs font-semibold cursor-pointer inline-flex items-center gap-1.5 shadow-sm">
          <span>Choose Image to Upload</span>
          <input type="file" accept="image/*" className="hidden" onChange={handleFileUpload} />
        </label>
      </div>

      {/* Assets Grid */}
      <div className="bg-white rounded-2xl p-6 border border-surface-border shadow-subtle space-y-4">
        <h3 className="font-bold text-sm text-obsidian flex items-center gap-2">
          <ImageIcon className="w-4 h-4 text-brand-crimson" />
          <span>Active R2 CDN Assets ({assets.length})</span>
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {assets.map((asset) => (
            <div key={asset.id} className="border border-surface-border rounded-xl overflow-hidden group bg-stone-50 flex flex-col justify-between">
              <div className="relative aspect-video w-full overflow-hidden bg-stone-200">
                <img src={asset.url} alt={asset.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                <span className="absolute top-2 left-2 bg-black/70 text-white text-[9px] font-mono px-1.5 py-0.5 rounded">
                  {asset.size}
                </span>
              </div>

              <div className="p-2.5 bg-white space-y-2">
                <div className="min-w-0">
                  <p className="font-medium text-xs text-obsidian truncate">{asset.name}</p>
                  <p className="text-[10px] text-muted font-mono truncate">{asset.key}</p>
                </div>

                <button
                  onClick={() => copyToClipboard(asset.url, asset.id)}
                  className="w-full py-1.5 border border-surface-border bg-stone-50 hover:bg-stone-100 rounded-lg text-[11px] font-semibold text-stone-700 flex items-center justify-center gap-1.5 transition-colors"
                >
                  {copiedKey === asset.id ? (
                    <>
                      <Check className="w-3 h-3 text-supermarket-fresh" />
                      <span className="text-supermarket-fresh">CDN URL Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" />
                      <span>Copy CDN Link</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
