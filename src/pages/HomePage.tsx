import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowRight, 
  ChevronRight, 
  ChevronLeft, 
  Store, 
  MapPin, 
  Leaf, 
  ShieldCheck, 
  Clock, 
  Truck, 
  ShoppingBag, 
  Sparkles,
  Award,
  BadgePercent
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { ProductCard } from '../components/common/ProductCard';
import { HeroBannerCarousel, MobileHeroBannerCarousel } from '../components/common/HeroBannerCarousel';
import { cn } from '../lib/utils';

const SectionHeader: React.FC<{
  label: string; 
  title: string;
  viewAllHref?: string; 
  viewAllLabel?: string;
  className?: string; 
  dark?: boolean;
}> = ({ label, title, viewAllHref, viewAllLabel = 'View All', className, dark }) => (
  <div className={cn('flex items-end justify-between gap-4 mb-4 sm:mb-6', className)}>
    <div>
      <span className={cn('block text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.16em] mb-1', dark ? 'text-amber-400' : 'text-brand-crimson')}>
        {label}
      </span>
      <h2 className={cn('font-serif text-xl sm:text-3xl font-bold tracking-tight', dark ? 'text-white' : 'text-obsidian')}>
        {title}
      </h2>
    </div>
    {viewAllHref && (
      <Link 
        to={viewAllHref} 
        className={cn(
          'flex items-center gap-1 text-xs font-bold shrink-0 transition-colors group', 
          dark ? 'text-amber-400 hover:text-amber-300' : 'text-brand-crimson hover:text-brand-crimson-dark'
        )}
      >
        <span>{viewAllLabel}</span>
        <ChevronRight className='w-3.5 h-3.5 transform group-hover:translate-x-0.5 transition-transform' />
      </Link>
    )}
  </div>
);

const RailNav: React.FC<{ onLeft: () => void; onRight: () => void; dark?: boolean; }> = ({ onLeft, onRight, dark }) => (
  <div className='hidden sm:flex items-center gap-1.5'>
    <button 
      onClick={onLeft} 
      aria-label='Scroll left' 
      className={cn(
        'w-8 h-8 rounded-full flex items-center justify-center transition-colors border shadow-xs', 
        dark ? 'bg-white/10 hover:bg-white/20 border-white/15 text-white' : 'bg-white hover:bg-stone-50 border-surface-border text-stone-700'
      )}
    >
      <ChevronLeft className='w-4 h-4' />
    </button>
    <button 
      onClick={onRight} 
      aria-label='Scroll right' 
      className={cn(
        'w-8 h-8 rounded-full flex items-center justify-center transition-colors border shadow-xs', 
        dark ? 'bg-white/10 hover:bg-white/20 border-white/15 text-white' : 'bg-white hover:bg-stone-50 border-surface-border text-stone-700'
      )}
    >
      <ChevronRight className='w-4 h-4' />
    </button>
  </div>
);

export const HomePage: React.FC = () => {
  const { products, banners } = useStore();

  // Inventory segmentation
  const bestsellers          = products.filter(p => p.rating >= 4.8 || p.reviewCount > 80);
  const dailyStaples         = products.filter(p => p.isDailyStaple);
  const freshProduce         = products.filter(p => p.category === 'fruits-vegetables');
  const dairyProducts        = products.filter(p => p.category === 'dairy-bakery');
  const snacksAndBeverages   = products.filter(p => p.category === 'snacks-beverages');
  const spicesAndOils        = products.filter(p => p.category === 'spices-masalas');
  const gourmetDryFruits     = products.filter(p => p.category === 'gourmet-organic');
  const personalAndHome      = products.filter(p => p.category === 'personal-care' || p.category === 'household-cleaning');
  const dealProducts         = products.filter(p => p.isDeal);

  // Rail scroll refs
  const bestsellersRef   = useRef<HTMLDivElement>(null);
  const staplesRef       = useRef<HTMLDivElement>(null);
  const freshRef         = useRef<HTMLDivElement>(null);
  const dairyRef         = useRef<HTMLDivElement>(null);
  const snacksRef        = useRef<HTMLDivElement>(null);
  const spicesRef        = useRef<HTMLDivElement>(null);
  const gourmetRef       = useRef<HTMLDivElement>(null);
  const homeRef          = useRef<HTMLDivElement>(null);
  const dealsRef         = useRef<HTMLDivElement>(null);

  const scrollRail = (ref: React.RefObject<HTMLDivElement | null>, dir: 'left' | 'right') => {
    if (ref.current) {
      ref.current.scrollBy({ left: dir === 'left' ? -360 : 360, behavior: 'smooth' });
    }
  };

  // Curated Quick Category Shortcuts with modern supermarket imagery
  const quickShortcuts = [
    { name: 'Fresh Produce',    slug: 'fruits-vegetables',       img: 'https://images.unsplash.com/photo-1610348725531-843dff563e2c?auto=format&fit=crop&w=300&q=80' },
    { name: 'Dairy & Bakery',   slug: 'dairy-bakery',            img: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=300&q=80' },
    { name: 'Staples & Grains', slug: 'staples-grains',          img: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=300&q=80' },
    { name: 'Spices & Masalas', slug: 'spices-masalas',          img: 'https://images.unsplash.com/photo-1589927986089-35812388d1f4?auto=format&fit=crop&w=300&q=80' },
    { name: 'Snacks & Drinks',  slug: 'snacks-beverages',        img: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=300&q=80' },
    { name: 'Household',        slug: 'household-cleaning',      img: 'https://images.unsplash.com/photo-1583947215259-38e31be8751f?auto=format&fit=crop&w=300&q=80' },
    { name: 'Personal Care',    slug: 'personal-care',           img: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=300&q=80' },
    { name: 'Dry Fruits',       slug: 'gourmet-organic',         img: 'https://images.unsplash.com/photo-1508061253366-f7da158b6d46?auto=format&fit=crop&w=300&q=80' },
    { name: 'Namkeen & Chips',  slug: 'chips-snacks-namkeen',    img: 'https://images.unsplash.com/photo-1566478989037-eec170784d0b?auto=format&fit=crop&w=300&q=80' },
    { name: 'Pooja Needs',      slug: 'pooja-spiritual-needs',   img: 'https://images.unsplash.com/photo-1609137144813-7d9921338f24?auto=format&fit=crop&w=300&q=80' },
    { name: 'Biscuits & Bakery',slug: 'biscuits-cookies-bakery', img: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?auto=format&fit=crop&w=300&q=80' },
    { name: 'Cold Drinks',      slug: 'cold-drinks-juices',      img: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=300&q=80' },
  ];

  return (
    <div className='font-sans selection:bg-brand-crimson selection:text-white bg-[#F7F5F1]'>

      {/* ═════════════════════════════════════════════════════════ */}
      {/* ══ MOBILE HOME EXPERIENCE (< md)                       ══ */}
      {/* ═════════════════════════════════════════════════════════ */}
      <div className='md:hidden pb-12'>

        {/* 1. Location & Free Delivery Guarantee Strip */}
        <div className='mx-3 mt-2 px-3.5 py-2 bg-white border border-surface-border rounded-xl flex items-center justify-between text-[11px] shadow-2xs'>
          <div className='flex items-center gap-1.5 font-semibold text-stone-700'>
            <span className='w-2 h-2 rounded-full bg-emerald-500 animate-pulse' />
            <span>Madurai Central Store</span>
          </div>
          <span className='text-brand-crimson font-bold'>Free delivery over ₹499</span>
        </div>

        {/* 2. Horizontal Category Shortcuts - Continuous Scrolling Animation (Mobile) */}
        <div className='mt-3.5 relative overflow-hidden'>
          <div className='px-4 flex items-center justify-between mb-2.5'>
            <h3 className='font-serif text-sm font-bold text-obsidian uppercase tracking-wide flex items-center gap-1.5'>
              <span>Explore Aisles</span>
              <span className='w-1.5 h-1.5 rounded-full bg-brand-crimson animate-pulse' />
            </h3>
            <Link to='/categories' className='text-[11px] font-bold text-brand-crimson flex items-center gap-0.5'>
              All Departments ({quickShortcuts.length}+) <ChevronRight className='w-3 h-3' />
            </Link>
          </div>
          
          <div className='relative overflow-hidden py-1'>
            {/* Left and Right Edge Fade Gradients */}
            <div className='absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-[#F7F5F1] to-transparent pointer-events-none z-10' />
            <div className='absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-[#F7F5F1] to-transparent pointer-events-none z-10' />

            {/* Continuous Marquee Rail */}
            <div className='animate-category-marquee flex gap-3 items-center select-none'>
              {[...quickShortcuts, ...quickShortcuts].map((cat, idx) => (
                <Link 
                  key={`m-${cat.slug}-${idx}`} 
                  to={'/products?category=' + cat.slug} 
                  className='flex flex-col items-center gap-1.5 shrink-0 group active:scale-95 transition-transform'
                >
                  <div className='w-[68px] h-[68px] rounded-2xl overflow-hidden border border-surface-border shadow-2xs bg-white group-hover:border-brand-crimson group-active:scale-95 transition-transform duration-200'>
                    <img 
                      src={cat.img} 
                      alt={cat.name} 
                      className='w-full h-full object-cover group-hover:scale-105 transition-transform duration-300' 
                      loading='lazy'
                    />
                  </div>
                  <span className='text-[10px] font-semibold text-stone-700 text-center leading-tight max-w-[72px] truncate group-hover:text-brand-crimson transition-colors'>
                    {cat.name}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* 3. Main Campaign Banner Carousel */}
        <div className='mt-3'>
          <MobileHeroBannerCarousel banners={banners} />
        </div>

        {/* 4. Bestsellers Rail (Neighbourhood Favourites) */}
        {bestsellers.length > 0 && (
          <div className='mt-6 px-4'>
            <div className='flex items-center justify-between mb-3'>
              <div>
                <p className='text-[10px] font-bold uppercase tracking-widest text-brand-crimson flex items-center gap-1'>
                  <Award className='w-3 h-3' />
                  <span>Neighbourhood Favourites</span>
                </p>
                <h3 className='font-serif text-lg font-bold text-obsidian'>Bestselling Provisions</h3>
              </div>
              <Link to='/products' className='text-xs font-bold text-brand-crimson flex items-center gap-0.5'>
                View all <ChevronRight className='w-3.5 h-3.5' />
              </Link>
            </div>
            <div className='flex gap-3 overflow-x-auto -mx-4 px-4 pb-3 no-scrollbar items-stretch'>
              {bestsellers.slice(0, 8).map(p => (
                <div key={p.id} className='w-[165px] xs:w-[178px] shrink-0 flex flex-col'>
                  <ProductCard product={p} />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 5. Daily Essentials / Kitchen Staples Rail */}
        {dailyStaples.length > 0 && (
          <div className='mt-6 px-4'>
            <div className='flex items-center justify-between mb-3'>
              <div>
                <p className='text-[10px] font-bold uppercase tracking-widest text-brand-crimson'>Kitchen Essentials</p>
                <h3 className='font-serif text-lg font-bold text-obsidian'>Daily Kitchen Staples</h3>
              </div>
              <Link to='/products?staple=true' className='text-xs font-bold text-brand-crimson flex items-center gap-0.5'>
                See All <ChevronRight className='w-3.5 h-3.5' />
              </Link>
            </div>
            <div className='flex gap-3 overflow-x-auto -mx-4 px-4 pb-3 no-scrollbar items-stretch'>
              {dailyStaples.slice(0, 8).map(p => (
                <div key={p.id} className='w-[165px] xs:w-[178px] shrink-0 flex flex-col'>
                  <ProductCard product={p} />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 6. Fresh Produce Harvest Rail */}
        {freshProduce.length > 0 && (
          <div className='mt-6 px-4'>
            <div className='flex items-center justify-between mb-3'>
              <div>
                <p className='text-[10px] font-bold uppercase tracking-widest text-emerald-700'>5:00 AM Farm Graded</p>
                <h3 className='font-serif text-lg font-bold text-obsidian'>Fresh Fruits & Vegetables</h3>
              </div>
              <Link to='/products?category=fruits-vegetables' className='text-xs font-bold text-brand-crimson flex items-center gap-0.5'>
                See All <ChevronRight className='w-3.5 h-3.5' />
              </Link>
            </div>
            <div className='flex gap-3 overflow-x-auto -mx-4 px-4 pb-3 no-scrollbar items-stretch'>
              {freshProduce.slice(0, 8).map(p => (
                <div key={p.id} className='w-[165px] xs:w-[178px] shrink-0 flex flex-col'>
                  <ProductCard product={p} />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 7. Dairy & Fresh Bakery Rail */}
        {dairyProducts.length > 0 && (
          <div className='mt-6 px-4'>
            <div className='flex items-center justify-between mb-3'>
              <div>
                <p className='text-[10px] font-bold uppercase tracking-widest text-amber-700'>Chilled & Farm Fresh</p>
                <h3 className='font-serif text-lg font-bold text-obsidian'>Dairy & Fresh Bakery</h3>
              </div>
              <Link to='/products?category=dairy-bakery' className='text-xs font-bold text-brand-crimson flex items-center gap-0.5'>
                See All <ChevronRight className='w-3.5 h-3.5' />
              </Link>
            </div>
            <div className='flex gap-3 overflow-x-auto -mx-4 px-4 pb-3 no-scrollbar items-stretch'>
              {dairyProducts.slice(0, 8).map(p => (
                <div key={p.id} className='w-[165px] xs:w-[178px] shrink-0 flex flex-col'>
                  <ProductCard product={p} />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 8. Snacks, Coffee & Beverages Rail */}
        {snacksAndBeverages.length > 0 && (
          <div className='mt-6 px-4'>
            <div className='flex items-center justify-between mb-3'>
              <div>
                <p className='text-[10px] font-bold uppercase tracking-widest text-stone-600'>Madurai Filter Coffee & Crunch</p>
                <h3 className='font-serif text-lg font-bold text-obsidian'>Snacks & Beverages</h3>
              </div>
              <Link to='/products?category=snacks-beverages' className='text-xs font-bold text-brand-crimson flex items-center gap-0.5'>
                See All <ChevronRight className='w-3.5 h-3.5' />
              </Link>
            </div>
            <div className='flex gap-3 overflow-x-auto -mx-4 px-4 pb-3 no-scrollbar items-stretch'>
              {snacksAndBeverages.slice(0, 8).map(p => (
                <div key={p.id} className='w-[165px] xs:w-[178px] shrink-0 flex flex-col'>
                  <ProductCard product={p} />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 9. Special Deals Section */}
        {dealProducts.length > 0 && (
          <div className='mt-7 mx-4 rounded-2xl bg-stone-900 text-white p-4 shadow-md'>
            <div className='flex items-center justify-between mb-3'>
              <div>
                <p className='text-[10px] font-bold uppercase tracking-widest text-amber-400 flex items-center gap-1'>
                  <BadgePercent className='w-3.5 h-3.5' />
                  <span>Pantry Savings</span>
                </p>
                <h3 className='font-serif text-lg font-bold text-white'>Special Grocery Offers</h3>
              </div>
              <Link to='/products?deal=true' className='text-xs font-bold text-amber-400 flex items-center gap-0.5'>
                See All <ChevronRight className='w-3.5 h-3.5' />
              </Link>
            </div>
            <div className='flex gap-3 overflow-x-auto -mx-2 px-2 pb-3 no-scrollbar items-stretch'>
              {dealProducts.slice(0, 8).map(p => (
                <div key={p.id} className='w-[165px] xs:w-[178px] shrink-0 flex flex-col text-obsidian'>
                  <ProductCard product={p} />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 10. Store Assurances & Madurai Central Guarantee */}
        <div className='mt-8 mx-4 grid grid-cols-2 gap-2.5 pb-4'>
          {[
            { icon: <Truck className='w-4 h-4' />, title: 'Doorstep Delivery', desc: 'Madurai Central & nearby' },
            { icon: <Store className='w-4 h-4' />, title: '15-Min Pickup', desc: 'Packed & ready at store' },
            { icon: <Leaf className='w-4 h-4' />, title: '5:00 AM Freshness', desc: 'Farm-graded daily' },
            { icon: <ShieldCheck className='w-4 h-4' />, title: 'Quality Guarantee', desc: 'Zero unpolished grains' },
          ].map(item => (
            <div key={item.title} className='flex items-start gap-2.5 p-3 bg-white rounded-xl border border-surface-border'>
              <div className='w-7 h-7 rounded-lg bg-red-50 text-brand-crimson flex items-center justify-center shrink-0'>
                {item.icon}
              </div>
              <div>
                <p className='text-xs font-bold text-obsidian'>{item.title}</p>
                <p className='text-[10px] text-stone-500 leading-tight mt-0.5'>{item.desc}</p>
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* ═════════════════════════════════════════════════════════ */}
      {/* ══ DESKTOP HOME EXPERIENCE (md+)                       ══ */}
      {/* ═════════════════════════════════════════════════════════ */}
      <div className='hidden md:block'>
        
        {/* Hero Promotional Banner Carousel */}
        <HeroBannerCarousel banners={banners} />

        {/* Marquee Ticker */}
        <div className='bg-white border-y border-surface-border py-3 overflow-hidden select-none'>
          <div className='animate-marquee whitespace-nowrap flex items-center gap-10 text-[10px] font-bold uppercase tracking-[0.18em] text-stone-500'>
            <span>• PURE UNPOLISHED DALS</span>
            <span>• SALEM HIGH-CURCUMIN TURMERIC</span>
            <span>• A2 DESI COW MILK DAILY</span>
            <span>• COLD-PRESSED MARACHEKKU OILS</span>
            <span>• FRESH PRODUCE GRADED AT 5:00 AM</span>
            <span>• FREE LOCAL DELIVERY OVER ₹499</span>
            <span>• CLICK &amp; COLLECT READY IN 15 MINUTES</span>
            <span>• IN-STORE QUALITY VERIFIED DAILY</span>
            <span>• PURE UNPOLISHED DALS</span>
            <span>• SALEM HIGH-CURCUMIN TURMERIC</span>
            <span>• A2 DESI COW MILK DAILY</span>
            <span>• COLD-PRESSED MARACHEKKU OILS</span>
          </div>
        </div>

        <div className='space-y-16 sm:space-y-24 pb-24 mt-10 sm:mt-14'>

          {/* Quick Categories Bar - Continuous Scrolling Animation */}
          <section className='max-w-7xl mx-auto px-4 sm:px-6 relative'>
            <SectionHeader 
              label='Organized Supermarket Aisles' 
              title='Shop by Department' 
              viewAllHref='/categories' 
              viewAllLabel='Browse All 32 Departments' 
            />
            <div className='relative overflow-hidden py-3'>
              {/* Left and Right Edge Fade Gradients */}
              <div className='absolute left-0 top-0 bottom-0 w-16 sm:w-24 bg-gradient-to-r from-[#F7F5F1] to-transparent pointer-events-none z-10' />
              <div className='absolute right-0 top-0 bottom-0 w-16 sm:w-24 bg-gradient-to-l from-[#F7F5F1] to-transparent pointer-events-none z-10' />

              {/* Continuous Infinite Scrolling Conveyor */}
              <div className='animate-category-marquee flex gap-4 sm:gap-6 items-center select-none'>
                {[...quickShortcuts, ...quickShortcuts].map((cat, idx) => (
                  <Link 
                    key={`d-${cat.slug}-${idx}`} 
                    to={'/products?category=' + cat.slug} 
                    className='group flex flex-col items-center gap-2 text-center shrink-0 active:scale-95 transition-transform duration-200'
                  >
                    <div className='w-20 h-20 sm:w-24 sm:h-24 aspect-square rounded-2xl overflow-hidden border border-stone-200/90 shadow-2xs bg-white group-hover:border-brand-crimson group-hover:shadow-lg group-hover:scale-105 transition-all duration-300 relative'>
                      <img 
                        src={cat.img} 
                        alt={cat.name} 
                        className='w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 ease-out' 
                        loading='lazy' 
                      />
                    </div>
                    <span className='text-[11px] sm:text-xs font-semibold text-stone-700 group-hover:text-brand-crimson transition-colors leading-tight max-w-[88px] sm:max-w-[100px] truncate'>
                      {cat.name}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          </section>

          {/* Bestsellers Rail */}
          {bestsellers.length > 0 && (
            <section className='max-w-7xl mx-auto px-6'>
              <div className='flex items-end justify-between mb-5 sm:mb-6'>
                <SectionHeader 
                  label='Top Customer Rated' 
                  title='Bestselling Supermarket Provisions' 
                  viewAllHref='/products'
                  className='mb-0' 
                />
                <div className='flex items-center gap-2 ml-4'>
                  <RailNav 
                    onLeft={() => scrollRail(bestsellersRef, 'left')} 
                    onRight={() => scrollRail(bestsellersRef, 'right')} 
                  />
                </div>
              </div>
              <div ref={bestsellersRef} className='flex gap-5 overflow-x-auto pb-4 no-scrollbar scroll-smooth items-stretch'>
                {bestsellers.map(p => (
                  <div key={p.id} className='w-[225px] sm:w-[235px] shrink-0 flex flex-col'>
                    <ProductCard product={p} />
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Curated Bento Department Showcase */}
          <section className='max-w-7xl mx-auto px-6'>
            <SectionHeader 
              label='Curated Departments' 
              title='Explore Every Aisle' 
              viewAllHref='/categories' 
              viewAllLabel='Full Directory' 
            />
            <div className='grid grid-cols-12 gap-5'>
              <Link 
                to='/products?category=fruits-vegetables' 
                className='col-span-7 group relative rounded-2xl overflow-hidden min-h-[380px] flex flex-col justify-between p-8 bg-stone-900 text-white shadow-md'
              >
                <img 
                  src='https://images.unsplash.com/photo-1610348725531-843dff563e2c?auto=format&fit=crop&w=1200&q=80' 
                  alt='Fresh Produce' 
                  className='absolute inset-0 w-full h-full object-cover brightness-[0.55] group-hover:scale-[1.03] transition-transform duration-700 ease-out' 
                  loading='lazy' 
                />
                <div className='absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-black/10' />
                <div className='relative z-10'>
                  <span className='px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm text-[10px] font-bold uppercase tracking-wider text-stone-100'>
                    Direct from Regional Growers
                  </span>
                </div>
                <div className='relative z-10 space-y-2'>
                  <h3 className='font-serif text-2xl sm:text-3xl font-bold text-white leading-tight'>
                    Fruits &amp; Fresh Vegetables
                  </h3>
                  <p className='text-sm text-stone-300 max-w-md'>
                    Country tomatoes, native shallots, orchard fruits, and crisp greens graded daily at 5:00 AM.
                  </p>
                  <div className='pt-2 flex items-center gap-2 text-xs font-semibold text-red-300 group-hover:text-white transition-colors'>
                    <span>Enter Fresh Produce</span>
                    <ArrowRight className='w-4 h-4 group-hover:translate-x-1 transition-transform' />
                  </div>
                </div>
              </Link>
              <div className='col-span-5 flex flex-col gap-5'>
                <Link 
                  to='/products?category=dairy-bakery' 
                  className='group relative rounded-2xl overflow-hidden flex-1 min-h-[175px] flex flex-col justify-end p-6 bg-stone-900 text-white shadow-md'
                >
                  <img 
                    src='https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=800&q=80' 
                    alt='Dairy' 
                    className='absolute inset-0 w-full h-full object-cover brightness-[0.55] group-hover:scale-[1.03] transition-transform duration-700' 
                    loading='lazy' 
                  />
                  <div className='absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent' />
                  <div className='relative z-10 space-y-1'>
                    <span className='text-[10px] font-bold uppercase tracking-wider text-amber-300'>Daily Farm Fresh</span>
                    <h3 className='font-serif text-xl font-bold text-white'>Dairy &amp; Fresh Bakery</h3>
                    <p className='text-xs text-stone-200'>A2 cow milk, malai paneer, thick dahi &amp; bakery loaves.</p>
                  </div>
                </Link>
                <Link 
                  to='/products?category=staples-grains' 
                  className='group relative rounded-2xl overflow-hidden flex-1 min-h-[175px] flex flex-col justify-end p-6 bg-stone-900 text-white shadow-md'
                >
                  <img 
                    src='https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=800&q=80' 
                    alt='Staples' 
                    className='absolute inset-0 w-full h-full object-cover brightness-[0.55] group-hover:scale-[1.03] transition-transform duration-700' 
                    loading='lazy' 
                  />
                  <div className='absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent' />
                  <div className='relative z-10 space-y-1'>
                    <span className='text-[10px] font-bold uppercase tracking-wider text-amber-300'>Unpolished &amp; Pure</span>
                    <h3 className='font-serif text-xl font-bold text-white'>Staples &amp; Kitchen Grains</h3>
                    <p className='text-xs text-stone-200'>Native rice, unpolished dals &amp; cold-pressed oils.</p>
                  </div>
                </Link>
              </div>
            </div>
          </section>

          {/* Fresh Produce Rail */}
          {freshProduce.length > 0 && (
            <section className='max-w-7xl mx-auto px-6'>
              <div className='flex items-end justify-between mb-5 sm:mb-6'>
                <SectionHeader 
                  label='5:00 AM Harvest' 
                  title='Fresh Fruits & Vegetables' 
                  viewAllHref='/products?category=fruits-vegetables'
                  className='mb-0' 
                />
                <div className='flex items-center gap-2 ml-4'>
                  <RailNav 
                    onLeft={() => scrollRail(freshRef, 'left')} 
                    onRight={() => scrollRail(freshRef, 'right')} 
                  />
                </div>
              </div>
              <div ref={freshRef} className='flex gap-5 overflow-x-auto pb-4 no-scrollbar scroll-smooth items-stretch'>
                {freshProduce.map(p => (
                  <div key={p.id} className='w-[225px] sm:w-[235px] shrink-0 flex flex-col'>
                    <ProductCard product={p} />
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Daily Kitchen Staples Rail */}
          {dailyStaples.length > 0 && (
            <section className='max-w-7xl mx-auto px-6'>
              <div className='flex items-end justify-between mb-5 sm:mb-6'>
                <SectionHeader 
                  label='Kitchen Essentials' 
                  title='Daily Staples, Rice & Flours' 
                  viewAllHref='/products?category=staples-grains'
                  className='mb-0' 
                />
                <div className='flex items-center gap-2 ml-4'>
                  <RailNav 
                    onLeft={() => scrollRail(staplesRef, 'left')} 
                    onRight={() => scrollRail(staplesRef, 'right')} 
                  />
                </div>
              </div>
              <div ref={staplesRef} className='flex gap-5 overflow-x-auto pb-4 no-scrollbar scroll-smooth items-stretch'>
                {dailyStaples.map(p => (
                  <div key={p.id} className='w-[225px] sm:w-[235px] shrink-0 flex flex-col'>
                    <ProductCard product={p} />
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Supermarket Deals Section */}
          {dealProducts.length > 0 && (
            <section className='max-w-7xl mx-auto px-6'>
              <div className='bg-stone-900 rounded-2xl p-8 sm:p-10 shadow-md'>
                <div className='flex items-end justify-between mb-6'>
                  <SectionHeader 
                    label='Limited Stock' 
                    title='Supermarket Deals & Pantry Savings' 
                    dark 
                    viewAllHref='/products?deal=true'
                    className='mb-0' 
                  />
                  <div className='flex items-center gap-2 ml-4'>
                    <RailNav 
                      dark 
                      onLeft={() => scrollRail(dealsRef, 'left')} 
                      onRight={() => scrollRail(dealsRef, 'right')} 
                    />
                  </div>
                </div>
                <div ref={dealsRef} className='flex gap-5 overflow-x-auto pb-4 no-scrollbar scroll-smooth items-stretch'>
                  {dealProducts.map(p => (
                    <div key={p.id} className='w-[225px] sm:w-[235px] shrink-0 flex flex-col text-obsidian'>
                      <ProductCard product={p} />
                    </div>
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* Dairy & Fresh Bakery Rail */}
          {dairyProducts.length > 0 && (
            <section className='max-w-7xl mx-auto px-6'>
              <div className='flex items-end justify-between mb-5 sm:mb-6'>
                <SectionHeader 
                  label='Cold Chain' 
                  title='Dairy, Paneer & Artisan Bakery' 
                  viewAllHref='/products?category=dairy-bakery'
                  className='mb-0' 
                />
                <div className='flex items-center gap-2 ml-4'>
                  <RailNav 
                    onLeft={() => scrollRail(dairyRef, 'left')} 
                    onRight={() => scrollRail(dairyRef, 'right')} 
                  />
                </div>
              </div>
              <div ref={dairyRef} className='flex gap-5 overflow-x-auto pb-4 no-scrollbar scroll-smooth items-stretch'>
                {dairyProducts.map(p => (
                  <div key={p.id} className='w-[225px] sm:w-[235px] shrink-0 flex flex-col'>
                    <ProductCard product={p} />
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Snacks & Filter Coffee Rail */}
          {snacksAndBeverages.length > 0 && (
            <section className='max-w-7xl mx-auto px-6'>
              <div className='flex items-end justify-between mb-5 sm:mb-6'>
                <SectionHeader 
                  label='Traditional Flavours' 
                  title='Filter Coffee, Teas & Savouries' 
                  viewAllHref='/products?category=snacks-beverages'
                  className='mb-0' 
                />
                <div className='flex items-center gap-2 ml-4'>
                  <RailNav 
                    onLeft={() => scrollRail(snacksRef, 'left')} 
                    onRight={() => scrollRail(snacksRef, 'right')} 
                  />
                </div>
              </div>
              <div ref={snacksRef} className='flex gap-5 overflow-x-auto pb-4 no-scrollbar scroll-smooth items-stretch'>
                {snacksAndBeverages.map(p => (
                  <div key={p.id} className='w-[225px] sm:w-[235px] shrink-0 flex flex-col'>
                    <ProductCard product={p} />
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Store Service Assurances Grid */}
          <section className='max-w-7xl mx-auto px-6'>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-5'>
              <div className='relative rounded-2xl overflow-hidden min-h-[260px] flex flex-col justify-end p-8 bg-stone-900 text-white shadow-md'>
                <img 
                  src='https://images.unsplash.com/photo-1526367790999-0150786686a2?auto=format&fit=crop&w=800&q=75' 
                  alt='Local Delivery' 
                  className='absolute inset-0 w-full h-full object-cover brightness-[0.45]' 
                  loading='lazy' 
                />
                <div className='absolute inset-0 bg-gradient-to-t from-black/85 to-transparent' />
                <div className='relative z-10 space-y-2'>
                  <div className='w-9 h-9 rounded-xl bg-brand-crimson flex items-center justify-center'>
                    <Truck className='w-5 h-5 text-white' />
                  </div>
                  <h3 className='font-serif text-2xl font-bold text-white'>Local Supermarket Delivery</h3>
                  <p className='text-xs sm:text-sm text-stone-300'>Delivering across Madurai Central. Free doorstep delivery on orders above ₹499.</p>
                  <Link to='/products' className='mt-2 inline-flex items-center gap-1.5 text-xs font-bold text-white hover:underline'>
                    <span>Order for Delivery</span>
                    <ArrowRight className='w-3.5 h-3.5' />
                  </Link>
                </div>
              </div>

              <div className='relative rounded-2xl overflow-hidden min-h-[260px] flex flex-col justify-end p-8 bg-stone-900 text-white shadow-md'>
                <img 
                  src='https://images.unsplash.com/photo-1578916171728-46686eac8d58?auto=format&fit=crop&w=800&q=75' 
                  alt='Store Pickup' 
                  className='absolute inset-0 w-full h-full object-cover brightness-[0.45]' 
                  loading='lazy' 
                />
                <div className='absolute inset-0 bg-gradient-to-t from-black/85 to-transparent' />
                <div className='relative z-10 space-y-2'>
                  <div className='w-9 h-9 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center'>
                    <Store className='w-5 h-5 text-white' />
                  </div>
                  <h3 className='font-serif text-2xl font-bold text-white'>15-Minute Click &amp; Collect</h3>
                  <p className='text-xs sm:text-sm text-stone-300'>Order online and collect your packed groceries ready at our express counter.</p>
                  <Link to='/about' className='mt-2 inline-flex items-center gap-1.5 text-xs font-bold text-white hover:underline'>
                    <span>Store Hours &amp; Directions</span>
                    <ArrowRight className='w-3.5 h-3.5' />
                  </Link>
                </div>
              </div>
            </div>
          </section>

          {/* Final Brand Call to Action Banner */}
          <section className='max-w-7xl mx-auto px-6'>
            <div className='bg-brand-crimson rounded-2xl px-8 sm:px-16 py-12 text-white text-center shadow-lg'>
              <span className='text-[10px] font-bold uppercase tracking-[0.18em] text-white/80'>
                EVERYDAY ESSENTIALS • A BETTER TOMORROW
              </span>
              <h2 className='mt-2.5 font-serif text-2xl sm:text-4xl font-bold text-white tracking-tight'>
                Bharathi Store · Madurai Central
              </h2>
              <p className='mt-3 text-xs sm:text-sm text-white/85 max-w-lg mx-auto leading-relaxed'>
                Shop unpolished dals, cold-pressed oils, fresh morning harvest, and pantry provisions from Madurai&apos;s trusted supermarket.
              </p>
              <div className='mt-6 flex flex-wrap items-center justify-center gap-3'>
                <Link 
                  to='/products' 
                  className='inline-flex items-center gap-2 px-7 py-3 bg-white text-brand-crimson text-xs font-bold rounded-full uppercase tracking-wider hover:bg-stone-100 shadow-md transition-colors active:scale-95'
                >
                  Start Shopping <ArrowRight className='w-3.5 h-3.5' />
                </Link>
                <Link 
                  to='/categories' 
                  className='inline-flex items-center gap-2 px-6 py-3 bg-white/15 hover:bg-white/25 border border-white/25 text-white text-xs font-semibold rounded-full uppercase tracking-wider transition-colors active:scale-95'
                >
                  Browse All Categories
                </Link>
              </div>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
};
