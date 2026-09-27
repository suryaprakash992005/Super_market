/**
 * Cloudflare R2 Media Storage Adapter
 * Handles asset URL resolution, pre-signed upload generation contracts, and asset optimization.
 */

const R2_PUBLIC_URL = import.meta.env.VITE_R2_PUBLIC_URL || 'https://media.bharathistore.com';

export interface R2UploadResult {
  url: string;
  key: string;
  size: number;
  type: string;
}

export function getR2ImageUrl(keyOrUrl: string): string {
  if (!keyOrUrl) return '';
  if (keyOrUrl.startsWith('http://') || keyOrUrl.startsWith('https://') || keyOrUrl.startsWith('data:')) {
    return keyOrUrl;
  }
  const cleanKey = keyOrUrl.startsWith('/') ? keyOrUrl.slice(1) : keyOrUrl;
  return `${R2_PUBLIC_URL}/${cleanKey}`;
}

/**
 * Upload an image to Cloudflare R2 via secure backend endpoint or local simulation
 */
export async function uploadToR2(file: File, folder: 'products' | 'banners' | 'gallery' = 'products'): Promise<R2UploadResult> {
  // In production, frontend requests a pre-signed URL from edge function, then PUTs the file to R2
  // For immediate client-side operation, we generate an object URL or convert to an optimized data preview
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const resultUrl = reader.result as string;
      const key = `${folder}/${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
      resolve({
        url: resultUrl,
        key,
        size: file.size,
        type: file.type,
      });
    };
    reader.readAsDataURL(file);
  });
}
