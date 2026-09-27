import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ChevronRight, ChevronLeft, Store, MapPin, Leaf, ShieldCheck, Clock, Truck, ShoppingBag } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { ProductCard } from '../components/common/ProductCard';
import { HeroBannerCarousel, MobileHeroBannerCarousel } from '../components/common/HeroBannerCarousel';
import { cn } from '../lib/utils';

const SectionHeader: React.FC<{
  label: string; title: string;
  viewAllHref?: string; viewAllLabel?: string;
  className?: string; dark?: boolean;
}> = ({ label, title, viewAllHref, viewAllLabel = 'View All', className, dark }) => (
  <div className={cn('flex items-end justify-between gap-4 mb-5 sm:mb-7', className)}>
    <div>
      <span className={cn('block text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.16em] mb-1', dark ? 'text-amber-400' : 'text-brand-crimson')}>{label}</span>
      <h2 className={cn('font-serif text-xl sm:text-3xl font-bold tracking-tight', dark ? 'text-white' : 'text-obsidian')}>{title}</h2>
    </div>
    {viewAllHref && (
      <Link to={viewAllHref} className={cn('flex items-center gap-1 text-xs font-bold shrink-0 transition-colors group', dark ? 'text-amber-400 hover:text-amber-300' : 'text-brand-crimson hover:text-[#a80d25]')}>
        <span>{viewAllLabel}</span>
        <ChevronRight className='w-3.5 h-3.5 transform group-hover:translate-x-0.5 transition-transform' />
      </Link>
    )}
  </div>
);

const RailNav: React.FC<{ onLeft: () => void; onRight: () => void; dark?: boolean; }> = ({ onLeft, onRight, dark }) => (
  <div className='hidden sm:flex items-center gap-1.5'>
    <button onClick={onLeft} aria-label='Scroll left' className={cn('w-8 h-8 rounded-full flex items-center justify-center transition-colors border', dark ? 'bg-white/10 hover:bg-white/20 border-white/15 text-white' : 'bg-white hover:bg-stone-50 border-surface-border text-stone-700 shadow-xs')}><ChevronLeft className='w-4 h-4' /></button>
    <button onClick={onRight} aria-label='Scroll right' className={cn('w-8 h-8 rounded-full flex items-center justify-center transition-colors border', dark ? 'bg-white/10 hover:bg-white/20 border-white/15 text-white' : 'bg-white hover:bg-stone-50 border-surface-border text-stone-700 shadow-xs')}><ChevronRight className='w-4 h-4' /></button>
  </div>
);

export const HomePage: React.FC = () => {
  const { products, banners } = useStore();
  const freshProduce   = products.filter(p => p.category === 'fruits-vegetables');
  const dailyStaples   = products.filter(p => p.isDailyStaple);
  const dealProducts   = products.filter(p => p.isDeal);
  const bestsellers    = products.filter(p => p.rating >= 4.7 || p.reviewCount > 80);
  const dairyProducts  = products.filter(p => p.category === 'dairy-bakery');
  const freshRef       = useRef<HTMLDivElement>(null);
  const staplesRef     = useRef<HTMLDivElement>(null);
  const dealsRef       = useRef<HTMLDivElement>(null);
  const bestsellersRef = useRef<HTMLDivElement>(null);
  const dairyRef       = useRef<HTMLDivElement>(null);

  const scrollRail = (ref: React.RefObject<HTMLDivElement | null>, dir: 'left' | 'right') => {
    if (ref.current) ref.current.scrollBy({ left: dir === 'left' ? -380 : 380, behavior: 'smooth' });
  };

  const quickCats = [
    { name: 'Fresh Produce',    img: 'https://images.unsplash.com/photo-1610348725531-843dff563e2c?auto=format&fit=crop&w=400&q=75', slug: 'fruits-vegetables' },
    { name: 'Dairy & Bakery',   img: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=400&q=75', slug: 'dairy-bakery' },
    { name: 'Staples & Grains', img: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=400&q=75', slug: 'staples-grains' },
    { name: 'Spices & Masalas', img: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=400&q=75', slug: 'spices-masalas' },
    { name: 'Snacks & Drinks',  img: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=400&q=75', slug: 'snacks-beverages' },
    { name: 'Household',        img: 'https://images.unsplash.com/photo-1583947215259-38e31be8751f?auto=format&fit=crop&w=400&q=75', slug: 'household-cleaning' },
    { name: 'Personal Care',    img: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=400&q=75', slug: 'personal-care' },
    { name: 'Dry Fruits',       img: 'https://images.unsplash.com/photo-1508061253366-f7da158b6d46?auto=format&fit=crop&w=400&q=75', slug: 'gourmet-organic' },
  ];

  return (
    <div className='font-sans selection:bg-brand-crimson selection:text-white bg-[#F7F5F1]'>

      {/* ══ MOBILE ══ */}
      <div className='md:hidden'>
        <div className='mx-4 mt-2 px-3.5 py-2 bg-white border border-surface-border rounded-xl flex items-center justify-between text-[11px] shadow-xs'>
          <div className='flex items-center gap-1.5 font-semibold text-stone-700'>
            <span className='w-2 h-2 rounded-full bg-emerald-500 animate-pulse' />
            <span>Express Delivery Available</span>
          </div>
          <span className='text-brand-crimson font-bold'>Free on ₹499+</span>
        </div>
        <div className='mt-3'><MobileHeroBannerCarousel banners={banners} /></div>
        <div className='mt-5'>
          <div className='px-4 flex items-center justify-between mb-3'>
            <h3 className='font-serif text-base font-bold text-obsidian'>Shop by Department</h3>
            <Link to='/categories' className='text-[11px] font-bold text-brand-crimson flex items-center gap-0.5'>All <ChevronRight className='w-3.5 h-3.5' /></Link>
          </div>
          <div className='flex gap-3 overflow-x-auto px-4 pb-2 no-scrollbar'>
            {quickCats.map(cat => (
              <Link key={cat.slug} to={'/products?category=' + cat.slug} className='flex flex-col items-center gap-1.5 shrink-0 group'>
                <div className='w-[68px] h-[68px] rounded-2xl overflow-hidden border border-surface-border shadow-xs bg-stone-100'>
                  <img src={cat.img} alt={cat.name} className='w-full h-full object-cover group-active:scale-95 transition-transform duration-200' />
                </div>
                <span className='text-[10px] font-semibold text-stone-700 text-center leading-tight max-w-[72px]'>{cat.name}</span>
              </Link>
            ))}
          </div>
        </div>
        {freshProduce.length > 0 && (
          <div className='mt-7 px-4'>
            <div className='flex items-center justify-between mb-3'>
              <div><p className='text-[10px] font-bold uppercase tracking-widest text-emerald-700'>5:00 AM Farm Harvest</p><h3 className='font-serif text-lg font-bold text-obsidian'>Fresh Produce</h3></div>
              <Link to='/products?category=fruits-vegetables' className='text-xs font-bold text-brand-crimson flex items-center gap-0.5'>See All <ChevronRight className='w-3.5 h-3.5' /></Link>
            </div>
            <div className='flex gap-3 overflow-x-auto -mx-4 px-4 pb-3 no-scrollbar'>
              {freshProduce.slice(0,8).map(p => <div key={p.id} className='w-[155px] shrink-0'><ProductCard product={p} /></div>)}
            </div>
          </div>
        )}
        {dailyStaples.length > 0 && (
          <div className='mt-7 px-4'>
            <div className='flex items-center justify-between mb-3'>
              <div><p className='text-[10px] font-bold uppercase tracking-widest text-brand-crimson'>Kitchen Essentials</p><h3 className='font-serif text-lg font-bold text-obsidian'>Daily Staples</h3></div>
              <Link to='/products?category=staples-grains' className='text-xs font-bold text-brand-crimson flex items-center gap-0.5'>See All <ChevronRight className='w-3.5 h-3.5' /></Link>
            </div>
            <div className='flex gap-3 overflow-x-auto -mx-4 px-4 pb-3 no-scrollbar'>
              {dailyStaples.slice(0,8).map(p => <div key={p.id} className='w-[155px] shrink-0'><ProductCard product={p} /></div>)}
            </div>
          </div>
        )}
        {dealProducts.length > 0 && (
          <div className='mt-7 mx-4 rounded-2xl bg-stone-900 text-white p-4'>
            <div className='flex items-center justify-between mb-3'>
              <div><p className='text-[10px] font-bold uppercase tracking-widest text-amber-400'>Limited Stock</p><h3 className='font-serif text-lg font-bold text-white'>Deals &amp; Savings</h3></div>
              <Link to='/products?deal=true' className='text-xs font-bold text-amber-400 flex items-center gap-0.5'>See All <ChevronRight className='w-3.5 h-3.5' /></Link>
            </div>
            <div className='flex gap-3 overflow-x-auto -mx-2 px-2 pb-3 no-scrollbar'>
              {dealProducts.slice(0,8).map(p => <div key={p.id} className='w-[155px] shrink-0 text-obsidian'><ProductCard product={p} /></div>)}
            </div>
          </div>
        )}
        <div className='mt-8 mx-4 grid grid-cols-2 gap-3 pb-6'>
          {[
            { icon: <Truck className='w-4 h-4' />, title: 'Local Delivery', desc: 'Within your area' },
            { icon: <Store className='w-4 h-4' />, title: 'Store Pickup', desc: 'Ready in 15 min' },
            { icon: <Leaf className='w-4 h-4' />, title: 'Farm Fresh', desc: 'Graded at 5 AM' },
            { icon: <ShieldCheck className='w-4 h-4' />, title: 'Quality Promise', desc: 'No compromise' },
          ].map(item => (
            <div key={item.title} className='flex items-start gap-3 p-3.5 bg-white rounded-xl border border-surface-border'>
              <div className='w-8 h-8 rounded-lg bg-red-50 text-brand-crimson flex items-center justify-center shrink-0'>{item.icon}</div>
              <div><p className='text-xs font-bold text-obsidian'>{item.title}</p><p className='text-[10px] text-stone-500'>{item.desc}</p></div>
            </div>
          ))}
        </div>
      </div>

      {/* ══ DESKTOP ══ */}
      <div className='hidden md:block'>
        <HeroBannerCarousel banners={banners} />

        <div className='bg-white border-y border-surface-border py-3 overflow-hidden'>
          <div className='animate-marquee whitespace-nowrap flex items-center gap-10 text-[10px] font-bold uppercase tracking-[0.18em] text-stone-500'>
            <span>• PURE UNPOLISHED DALS</span><span>• SALEM HIGH-CURCUMIN TURMERIC</span>
            <span>• A2 DESI COW MILK DAILY</span><span>• COLD-PRESSED MARACHEKKU OILS</span>
            <span>• FRESH VEGETABLES HARVESTED AT 5:00 AM</span><span>• FREE LOCAL DELIVERY OVER ₹499</span>
            <span>• CLICK &amp; COLLECT READY IN 15 MINUTES</span><span>• IN-STORE QUALITY VERIFIED DAILY</span>
            <span>• PURE UNPOLISHED DALS</span><span>• SALEM HIGH-CURCUMIN TURMERIC</span>
            <span>• A2 DESI COW MILK DAILY</span><span>• COLD-PRESSED MARACHEKKU OILS</span>
            <span>• FRESH VEGETABLES HARVESTED AT 5:00 AM</span><span>• FREE LOCAL DELIVERY OVER ₹499</span>
            <span>• CLICK &amp; COLLECT READY IN 15 MINUTES</span><span>• IN-STORE QUALITY VERIFIED DAILY</span>
          </div>
        </div>

        <div className='space-y-20 sm:space-y-28 pb-24 mt-14'>

          {/* Quick Categories */}
          <section className='max-w-7xl mx-auto px-6'>
            <SectionHeader label='Organized Supermarket Aisles' title='Shop by Department' viewAllHref='/categories' viewAllLabel='Browse All Departments' />
            <div className='grid grid-cols-4 lg:grid-cols-8 gap-4'>
              {quickCats.map(cat => (
                <Link key={cat.slug} to={'/products?category='+cat.slug} className='group flex flex-col items-center gap-2.5 text-center'>
                  <div className='w-full aspect-square rounded-2xl overflow-hidden border border-surface-border shadow-sm bg-stone-100 group-hover:shadow-md transition-shadow duration-300'>
                    <img src={cat.img} alt={cat.name} className='w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out' loading='lazy' />
                  </div>
                  <span className='text-[11px] sm:text-xs font-semibold text-stone-700 group-hover:text-brand-crimson transition-colors leading-tight'>{cat.name}</span>
                </Link>
              ))}
            </div>
          </section>

          {/* Bento */}
          <section className='max-w-7xl mx-auto px-6'>
            <SectionHeader label='Curated Departments' title='Explore Every Aisle' viewAllHref='/categories' viewAllLabel='Full Directory' />
            <div className='grid grid-cols-12 gap-5'>
              <Link to='/products?category=fruits-vegetables' className='col-span-7 group relative rounded-2xl overflow-hidden min-h-[420px] flex flex-col justify-between p-8 bg-stone-900 text-white shadow-md'>
                <img src='https://images.unsplash.com/photo-1610348725531-843dff563e2c?auto=format&fit=crop&w=1200&q=80' alt='Fresh Produce' className='absolute inset-0 w-full h-full object-cover brightness-[0.6] group-hover:scale-[1.03] transition-transform duration-700 ease-out' loading='lazy' />
                <div className='absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/10' />
                <div className='relative z-10'><span className='px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm text-[10px] font-bold uppercase tracking-wider text-stone-100'>Direct from Dindigul &amp; Nilgiris</span></div>
                <div className='relative z-10 space-y-2'>
                  <h3 className='font-serif text-2xl sm:text-3xl font-bold text-white leading-tight'>Fruits &amp; Fresh Vegetables</h3>
                  <p className='text-sm text-stone-300 max-w-md'>Country tomatoes, native shallots, orchard fruits, and crisp greens graded daily at 5:00 AM.</p>
                  <div className='pt-2 flex items-center gap-2 text-xs font-semibold text-red-300 group-hover:text-white transition-colors'><span>Enter Fresh Produce</span><ArrowRight className='w-4 h-4 group-hover:translate-x-1 transition-transform' /></div>
                </div>
              </Link>
              <div className='col-span-5 flex flex-col gap-5'>
                <Link to='/products?category=dairy-bakery' className='group relative rounded-2xl overflow-hidden min-h-[198px] flex flex-col justify-end p-6 bg-stone-900 text-white shadow-md'>
                  <img src='https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=800&q=80' alt='Dairy' className='absolute inset-0 w-full h-full object-cover brightness-[0.6] group-hover:scale-[1.03] transition-transform duration-700' loading='lazy' />
                  <div className='absolute inset-0 bg-gradient-to-t from-black/75 via-black/30 to-transparent' />
                  <div className='relative z-10 space-y-1'><span className='text-[10px] font-bold uppercase tracking-wider text-amber-300'>Daily Farm Fresh</span><h3 className='font-serif text-xl font-bold text-white'>Dairy &amp; Fresh Bakery</h3><p className='text-xs text-stone-200'>A2 cow milk, malai paneer, thick dahi &amp; artisan loaves.</p></div>
                </Link>
                <Link to='/products?category=staples-grains' className='group relative rounded-2xl overflow-hidden min-h-[198px] flex flex-col justify-end p-6 bg-stone-900 text-white shadow-md'>
                  <img src='https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=800&q=80' alt='Staples' className='absolute inset-0 w-full h-full object-cover brightness-[0.6] group-hover:scale-[1.03] transition-transform duration-700' loading='lazy' />
                  <div className='absolute inset-0 bg-gradient-to-t from-black/75 via-black/30 to-transparent' />
                  <div className='relative z-10 space-y-1'><span className='text-[10px] font-bold uppercase tracking-wider text-amber-300'>Unpolished &amp; Pure</span><h3 className='font-serif text-xl font-bold text-white'>Staples &amp; Kitchen Grains</h3><p className='text-xs text-stone-200'>Native rice, unpolished dals &amp; wood-pressed oils.</p></div>
                </Link>
              </div>
              {[
                { slug:'spices-masalas',   label:'Traditional Spices',      desc:'Salem turmeric, peppercorn & sambar masalas.',  img:'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=600&q=75' },
                { slug:'snacks-beverages', label:'Filter Coffee & Savouries', desc:'Peaberry blend & Manapparai murukku.',         img:'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=600&q=75' },
                { slug:'gourmet-organic',  label:'Gourmet & Dry Fruits',    desc:'W240 cashews & Kurinji raw forest honey.',      img:'https://images.unsplash.com/photo-1508061253366-f7da158b6d46?auto=format&fit=crop&w=600&q=75' },
              ].map(cat => (
                <Link key={cat.slug} to={'/products?category='+cat.slug} className='col-span-4 group relative rounded-2xl overflow-hidden min-h-[200px] flex flex-col justify-end p-5 bg-stone-900 text-white shadow-sm'>
                  <img src={cat.img} alt={cat.label} className='absolute inset-0 w-full h-full object-cover brightness-[0.6] group-hover:scale-[1.04] transition-transform duration-700' loading='lazy' />
                  <div className='absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent' />
                  <div className='relative z-10'><h3 className='font-serif text-lg font-bold text-white'>{cat.label}</h3><p className='text-[11px] text-stone-300 mt-0.5'>{cat.desc}</p></div>
                </Link>
              ))}
            </div>
          </section>

          {/* Fresh Produce Rail */}
          {freshProduce.length > 0 && (
            <section className='max-w-7xl mx-auto px-6'>
              <div className='flex items-end justify-between mb-5 sm:mb-7'>
                <SectionHeader label='5:00 AM Direct Farm Harvest' title='Fresh Fruits & Vegetables' className='mb-0' />
                <div className='flex items-center gap-2 ml-4'>
                  <Link to='/products?category=fruits-vegetables' className='text-xs font-bold text-brand-crimson flex items-center gap-0.5 mr-2'>See All <ChevronRight className='w-3.5 h-3.5' /></Link>
                  <RailNav onLeft={() => scrollRail(freshRef,'left')} onRight={() => scrollRail(freshRef,'right')} />
                </div>
              </div>
              <div ref={freshRef} className='flex gap-5 overflow-x-auto pb-4 no-scrollbar scroll-smooth'>
                {freshProduce.map(p => <div key={p.id} className='w-[250px] shrink-0'><ProductCard product={p} /></div>)}
              </div>
            </section>
          )}

          {/* Editorial promo */}
          <section className='max-w-7xl mx-auto px-6'>
            <div className='grid grid-cols-12 gap-0 rounded-2xl overflow-hidden bg-white border border-surface-border shadow-sm'>
              <div className='col-span-5 p-10 xl:p-14 space-y-5 flex flex-col justify-center'>
                <span className='text-[10px] font-bold uppercase tracking-[0.18em] text-brand-crimson'>The Bharathi Store Standard</span>
                <h2 className='font-serif text-3xl xl:text-4xl font-bold text-obsidian tracking-tight leading-tight'>Where Supermarket Scale Meets Handpicked Care.</h2>
                <p className='text-sm text-stone-600 leading-relaxed'>Every item passes through a verifiable freshness chain — from co-operative Tamil Nadu farms, to our 5:00 AM grading dock, to your kitchen table.</p>
                <div className='pt-2 flex items-center gap-4'>
                  <Link to='/about' className='inline-flex items-center gap-2 px-6 py-3 bg-obsidian text-white text-xs font-semibold rounded-full tracking-wider uppercase hover:bg-stone-800 transition-colors'>Our Story <ArrowRight className='w-3.5 h-3.5' /></Link>
                  <Link to='/about#pickup' className='text-xs font-semibold text-brand-crimson hover:underline flex items-center gap-1'>Click &amp; Collect <ArrowRight className='w-3 h-3' /></Link>
                </div>
              </div>
              <div className='col-span-7 relative min-h-[400px] overflow-hidden'>
                <img src='https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1000&q=80' alt='Bharathi Store Market' className='absolute inset-0 w-full h-full object-cover hover:scale-[1.02] transition-transform duration-700' loading='lazy' />
              </div>
            </div>
          </section>

          {/* Staples Rail */}
          {dailyStaples.length > 0 && (
            <section className='max-w-7xl mx-auto px-6'>
              <div className='flex items-end justify-between mb-5 sm:mb-7'>
                <SectionHeader label='Kitchen Essentials' title='Daily Staples & Grains' className='mb-0' />
                <div className='flex items-center gap-2 ml-4'>
                  <Link to='/products?category=staples-grains' className='text-xs font-bold text-brand-crimson flex items-center gap-0.5 mr-2'>See All <ChevronRight className='w-3.5 h-3.5' /></Link>
                  <RailNav onLeft={() => scrollRail(staplesRef,'left')} onRight={() => scrollRail(staplesRef,'right')} />
                </div>
              </div>
              <div ref={staplesRef} className='flex gap-5 overflow-x-auto pb-4 no-scrollbar scroll-smooth'>
                {dailyStaples.map(p => <div key={p.id} className='w-[250px] shrink-0'><ProductCard product={p} /></div>)}
              </div>
            </section>
          )}

          {/* Deals Rail */}
          {dealProducts.length > 0 && (
            <section className='max-w-7xl mx-auto px-6'>
              <div className='bg-stone-900 rounded-2xl p-8 sm:p-10 shadow-md'>
                <div className='flex items-end justify-between mb-6'>
                  <SectionHeader label='Limited Daily Stock' title='Supermarket Deals & Savings' dark className='mb-0' />
                  <div className='flex items-center gap-2 ml-4'>
                    <Link to='/products?deal=true' className='text-xs font-bold text-amber-400 flex items-center gap-0.5 mr-2'>See All <ChevronRight className='w-3.5 h-3.5' /></Link>
                    <RailNav dark onLeft={() => scrollRail(dealsRef,'left')} onRight={() => scrollRail(dealsRef,'right')} />
                  </div>
                </div>
                <div ref={dealsRef} className='flex gap-5 overflow-x-auto pb-4 no-scrollbar scroll-smooth -mx-2 px-2'>
                  {dealProducts.map(p => <div key={p.id} className='w-[250px] shrink-0 text-obsidian'><ProductCard product={p} /></div>)}
                </div>
              </div>
            </section>
          )}

          {/* Bestsellers Rail */}
          {bestsellers.length > 0 && (
            <section className='max-w-7xl mx-auto px-6'>
              <div className='flex items-end justify-between mb-5 sm:mb-7'>
                <SectionHeader label='Neighbourhood Favourites' title='Top Rated Provisions' className='mb-0' />
                <div className='flex items-center gap-2 ml-4'>
                  <Link to='/products' className='text-xs font-bold text-brand-crimson flex items-center gap-0.5 mr-2'>See All <ChevronRight className='w-3.5 h-3.5' /></Link>
                  <RailNav onLeft={() => scrollRail(bestsellersRef,'left')} onRight={() => scrollRail(bestsellersRef,'right')} />
                </div>
              </div>
              <div ref={bestsellersRef} className='flex gap-5 overflow-x-auto pb-4 no-scrollbar scroll-smooth'>
                {bestsellers.map(p => <div key={p.id} className='w-[250px] shrink-0'><ProductCard product={p} /></div>)}
              </div>
            </section>
          )}

          {/* Dark pantry promo */}
          <section className='max-w-7xl mx-auto px-6'>
            <div className='relative rounded-2xl overflow-hidden min-h-[340px] flex flex-col justify-center text-white px-10 sm:px-16 py-12' style={{background:'linear-gradient(120deg,#111 60%,#1a0507 100%)'}}>
              <img src='https://images.unsplash.com/photo-1628102491629-778571d893a3?auto=format&fit=crop&w=1400&q=80' alt='Premium Pantry' className='absolute inset-0 w-full h-full object-cover brightness-[0.35] mix-blend-luminosity' loading='lazy' />
              <div className='absolute inset-0 bg-gradient-to-r from-black/90 via-black/70 to-transparent' />
              <div className='relative z-10 max-w-xl'>
                <span className='text-[10px] font-bold uppercase tracking-[0.18em] text-brand-crimson'>Premium Pantry Collection</span>
                <h2 className='mt-3 font-serif text-3xl sm:text-4xl font-bold text-white leading-tight tracking-tight'>Quality Ingredients<br />for Every Kitchen.</h2>
                <p className='mt-4 text-sm text-stone-300 leading-relaxed'>From premium Basmati to artisanal masalas and cold-pressed oils. Stock your pantry with ingredients that make a real difference.</p>
                <div className='mt-7 flex items-center gap-4'>
                  <Link to='/products' className='inline-flex items-center gap-2 px-7 py-3.5 bg-brand-crimson hover:bg-[#a80d25] text-white text-sm font-semibold rounded-full tracking-wide uppercase shadow-lg shadow-brand-crimson/30 transition-colors active:scale-95'>Shop Premium Range <ArrowRight className='w-4 h-4' /></Link>
                  <Link to='/categories' className='text-sm font-semibold text-stone-300 hover:text-white underline transition-colors'>Browse Departments</Link>
                </div>
              </div>
            </div>
          </section>

          {/* Dairy Rail */}
          {dairyProducts.length > 0 && (
            <section className='max-w-7xl mx-auto px-6'>
              <div className='flex items-end justify-between mb-5 sm:mb-7'>
                <SectionHeader label='Farm Fresh Daily' title='Dairy & Bakery' className='mb-0' />
                <div className='flex items-center gap-2 ml-4'>
                  <Link to='/products?category=dairy-bakery' className='text-xs font-bold text-brand-crimson flex items-center gap-0.5 mr-2'>See All <ChevronRight className='w-3.5 h-3.5' /></Link>
                  <RailNav onLeft={() => scrollRail(dairyRef,'left')} onRight={() => scrollRail(dairyRef,'right')} />
                </div>
              </div>
              <div ref={dairyRef} className='flex gap-5 overflow-x-auto pb-4 no-scrollbar scroll-smooth'>
                {dairyProducts.map(p => <div key={p.id} className='w-[250px] shrink-0'><ProductCard product={p} /></div>)}
              </div>
            </section>
          )}

          {/* Freshness Chain */}
          <section className='bg-white border-y border-surface-border py-16 sm:py-20'>
            <div className='max-w-7xl mx-auto px-6'>
              <div className='max-w-xl mb-14'>
                <span className='text-[10px] font-bold uppercase tracking-[0.18em] text-brand-crimson'>Guaranteed Freshness Chain</span>
                <h2 className='mt-2 font-serif text-3xl sm:text-4xl font-bold text-obsidian tracking-tight'>From Regional Farms to Your Kitchen Table.</h2>
              </div>
              <div className='grid grid-cols-2 lg:grid-cols-4 gap-10'>
                {[
                  {n:'01',title:'Co-Op Farm Sourcing',body:'Vegetables, fruits, and seeds sourced directly from dedicated growers across Tamil Nadu and Nilgiris.'},
                  {n:'02',title:'5:00 AM Quality Grading',body:'Hand-sorted at our central receiving dock. Overripe or subpar items are rejected before shelving.'},
                  {n:'03',title:'Insulated Crate Packing',body:'Dairy and perishables packed in thermal-insulated containers to maintain temperature until delivery.'},
                  {n:'04',title:'Doorstep or 15-Min Pickup',body:'Delivered safely within your slot, or collected instantly packed at our express counter.'},
                ].map(step => (
                  <div key={step.n} className='group space-y-3'>
                    <span className='font-serif text-5xl font-bold text-stone-200 group-hover:text-brand-crimson transition-colors block'>{step.n}</span>
                    <h3 className='font-serif text-base font-bold text-obsidian'>{step.title}</h3>
                    <p className='text-xs text-stone-600 leading-relaxed'>{step.body}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Delivery & Pickup */}
          <section className='max-w-7xl mx-auto px-6'>
            <div className='grid grid-cols-2 gap-5'>
              <div className='relative rounded-2xl overflow-hidden min-h-[280px] flex flex-col justify-end p-8 bg-stone-900 text-white shadow-md'>
                <img src='https://images.unsplash.com/photo-1526367790999-0150786686a2?auto=format&fit=crop&w=800&q=75' alt='Local Delivery' className='absolute inset-0 w-full h-full object-cover brightness-[0.45]' loading='lazy' />
                <div className='absolute inset-0 bg-gradient-to-t from-black/80 to-transparent' />
                <div className='relative z-10 space-y-2'>
                  <div className='w-10 h-10 rounded-xl bg-brand-crimson/90 flex items-center justify-center'><Truck className='w-5 h-5 text-white' /></div>
                  <h3 className='font-serif text-2xl font-bold text-white'>Local Delivery</h3>
                  <p className='text-sm text-stone-300'>Order online and we deliver fresh groceries to your door. Free on orders above ₹499.</p>
                  <Link to='/products' className='mt-3 inline-flex items-center gap-2 text-xs font-bold text-white/80 hover:text-white underline'>Order for Delivery <ArrowRight className='w-3.5 h-3.5' /></Link>
                </div>
              </div>
              <div className='relative rounded-2xl overflow-hidden min-h-[280px] flex flex-col justify-end p-8 bg-stone-900 text-white shadow-md'>
                <img src='https://images.unsplash.com/photo-1578916171728-46686eac8d58?auto=format&fit=crop&w=800&q=75' alt='Store Pickup' className='absolute inset-0 w-full h-full object-cover brightness-[0.45]' loading='lazy' />
                <div className='absolute inset-0 bg-gradient-to-t from-black/80 to-transparent' />
                <div className='relative z-10 space-y-2'>
                  <div className='w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center'><Store className='w-5 h-5 text-white' /></div>
                  <h3 className='font-serif text-2xl font-bold text-white'>Click &amp; Collect</h3>
                  <p className='text-sm text-stone-300'>Order online, walk in to our express counter, and collect your packed order in 15 minutes.</p>
                  <Link to='/about' className='mt-3 inline-flex items-center gap-2 text-xs font-bold text-white/80 hover:text-white underline'>How It Works <ArrowRight className='w-3.5 h-3.5' /></Link>
                </div>
              </div>
            </div>
          </section>

          {/* Why Bharathi */}
          <section className='max-w-7xl mx-auto px-6'>
            <div className='grid grid-cols-12 gap-10 lg:gap-16 items-start'>
              <div className='col-span-5 space-y-5 sticky top-24'>
                <span className='text-[10px] font-bold uppercase tracking-[0.18em] text-brand-crimson'>The Bharathi Store Commitment</span>
                <h2 className='font-serif text-3xl sm:text-4xl font-bold text-obsidian tracking-tight leading-tight'>A Culture of Quality Across Every Basket.</h2>
                <p className='text-sm text-stone-600 leading-relaxed'>We started Bharathi Store with a clear philosophy: grocery shopping should be honest, consistent, and dependable. We do not polish our grains for cosmetic shine.</p>
                <Link to='/about' className='inline-flex items-center gap-2 text-xs font-semibold text-brand-crimson hover:underline'>Read our sourcing standards &rarr;</Link>
              </div>
              <div className='col-span-7 grid grid-cols-2 gap-4'>
                {[
                  { icon:<Leaf className='w-5 h-5'/>,    bg:'bg-emerald-50 text-emerald-700', title:'Zero Synthetic Polish',  body:'All toor dal, urad dal, and traditional rices retain their natural nutrient bran and grain integrity.' },
                  { icon:<Clock className='w-5 h-5'/>,   bg:'bg-sky-50 text-sky-600',          title:'Instant Replacement',    body:'If any vegetable or dairy item does not meet your quality standards, we replace or refund without quibbles.' },
                  { icon:<Store className='w-5 h-5'/>,   bg:'bg-stone-100 text-stone-700',     title:'Physical & Digital',     body:'The accountability of a real brick-and-mortar supermarket backed by seamless modern digital ordering.' },
                  { icon:<ShieldCheck className='w-5 h-5'/>, bg:'bg-amber-50 text-amber-700', title:'Verified Payments',      body:'Razorpay, PhonePe, and Paytm verified gateways, plus Cash on Delivery upon physical inspection.' },
                  { icon:<MapPin className='w-5 h-5'/>,  bg:'bg-red-50 text-brand-crimson',    title:'Local Delivery Area',    body:'We serve local neighbourhoods in Madurai — your groceries are never far away.' },
                  { icon:<ShoppingBag className='w-5 h-5'/>, bg:'bg-purple-50 text-purple-700', title:'Curated Selection',    body:'Every product on our shelf has been selected with care. We prefer fewer, better products over excess choice.' },
                ].map(item => (
                  <div key={item.title} className='p-6 bg-white rounded-2xl border border-surface-border space-y-3 hover:shadow-sm transition-shadow'>
                    <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center', item.bg)}>{item.icon}</div>
                    <h3 className='font-bold text-sm text-obsidian'>{item.title}</h3>
                    <p className='text-xs text-stone-500 leading-relaxed'>{item.body}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Store Experience */}
          <section className='max-w-7xl mx-auto px-6'>
            <div className='grid grid-cols-12 gap-0 rounded-2xl overflow-hidden border border-surface-border shadow-sm bg-white'>
              <div className='col-span-6 relative min-h-[380px]'>
                <img src='https://images.unsplash.com/photo-1578916171728-46686eac8d58?auto=format&fit=crop&w=900&q=80' alt='Bharathi Store' className='absolute inset-0 w-full h-full object-cover' loading='lazy' />
              </div>
              <div className='col-span-6 flex flex-col justify-center p-10 xl:p-14 space-y-5'>
                <span className='text-[10px] font-bold uppercase tracking-[0.18em] text-brand-crimson'>Visit Bharathi Store</span>
                <h2 className='font-serif text-3xl font-bold text-obsidian tracking-tight leading-tight'>More Than Just Online Shopping.</h2>
                <p className='text-sm text-stone-600 leading-relaxed'>Discover our supermarket experience — browse everyday essentials in-person, enjoy fresh produce displays, and shop the way you prefer.</p>
                <div className='flex items-center gap-3 flex-wrap text-xs text-stone-600'>
                  <div className='flex items-center gap-1.5'><MapPin className='w-4 h-4 text-brand-crimson' /><span>Madurai Central</span></div>
                  <span className='text-stone-300'>·</span>
                  <div className='flex items-center gap-1.5'><Clock className='w-4 h-4 text-brand-crimson' /><span>Open 7:00 AM – 10:00 PM</span></div>
                </div>
                <div className='flex items-center gap-3'>
                  <Link to='/about' className='inline-flex items-center gap-2 px-6 py-3 bg-obsidian text-white text-xs font-semibold rounded-full tracking-wider uppercase hover:bg-stone-800 transition-colors'>Visit Store Info <ArrowRight className='w-3.5 h-3.5' /></Link>
                  <Link to='/products' className='inline-flex items-center gap-2 px-6 py-3 border border-surface-border text-xs font-semibold rounded-full text-stone-700 hover:bg-stone-50 tracking-wider uppercase transition-colors'>Order Online</Link>
                </div>
              </div>
            </div>
          </section>

          {/* Final CTA */}
          <section className='max-w-7xl mx-auto px-6'>
            <div className='bg-brand-crimson rounded-2xl px-10 sm:px-16 py-14 text-white text-center'>
              <span className='text-[10px] font-bold uppercase tracking-[0.18em] text-white/70'>Bharathi Store · Madurai</span>
              <h2 className='mt-3 font-serif text-3xl sm:text-4xl font-bold text-white tracking-tight'>Your Everyday Supermarket,<br />Online &amp; In-Store.</h2>
              <p className='mt-4 text-sm text-white/80 max-w-lg mx-auto leading-relaxed'>Shop fresh produce, daily staples, dairy, and household essentials. Delivered locally or collect from our express counter.</p>
              <div className='mt-8 flex flex-wrap items-center justify-center gap-4'>
                <Link to='/products' className='inline-flex items-center gap-2 px-8 py-3.5 bg-white text-brand-crimson text-sm font-bold rounded-full tracking-wide uppercase hover:bg-stone-100 shadow-lg transition-colors active:scale-95'>Start Shopping <ArrowRight className='w-4 h-4' /></Link>
                <Link to='/categories' className='inline-flex items-center gap-2 px-7 py-3.5 bg-white/15 hover:bg-white/25 border border-white/25 text-white text-sm font-semibold rounded-full tracking-wide uppercase transition-colors active:scale-95'>Browse Categories</Link>
              </div>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
};
