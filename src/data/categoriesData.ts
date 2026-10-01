import { Category } from '../types';

export const COMPREHENSIVE_CATEGORIES: Category[] = [
  // A. Fruits & Vegetables
  {
    id: 'cat-fruits-veg',
    name: 'Fruits & Vegetables',
    slug: 'fruits-vegetables',
    parentId: null,
    description: 'Direct farm-fresh orchard fruits, leafy vegetables, root crops, and native greens graded at dawn.',
    imageUrl: 'https://images.unsplash.com/photo-1610348725531-843dff563e2c?auto=format&fit=crop&w=600&q=80',
    icon: 'Apple',
    displayOrder: 1,
    isActive: true,
    itemCount: 5,
    featured: true,
    subcategories: [
      { id: 'sub-fresh-fruits', name: 'Fresh Fruits', slug: 'fresh-fruits', parentId: 'cat-fruits-veg', description: 'Sweet orchard fruits', imageUrl: 'https://images.unsplash.com/photo-1619566636858-adf3ef46400b?auto=format&fit=crop&w=400&q=75', icon: 'Citrus', displayOrder: 1, isActive: true, itemCount: 0 },
      { id: 'sub-seasonal-fruits', name: 'Seasonal Fruits', slug: 'seasonal-fruits', parentId: 'cat-fruits-veg', description: 'Alphonso, Banganapalli mangoes & berries', imageUrl: 'https://images.unsplash.com/photo-1553279768-865429fa0078?auto=format&fit=crop&w=400&q=75', icon: 'Sun', displayOrder: 2, isActive: true, itemCount: 0 },
      { id: 'sub-apples-pears', name: 'Apples & Pears', slug: 'apples-pears', parentId: 'cat-fruits-veg', description: 'Shimla & Washington crisp apples', imageUrl: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?auto=format&fit=crop&w=400&q=75', icon: 'Apple', displayOrder: 3, isActive: true, itemCount: 0 },
      { id: 'sub-bananas', name: 'Bananas', slug: 'bananas', parentId: 'cat-fruits-veg', description: 'Robusta, Poovan & Red Bananas', imageUrl: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?auto=format&fit=crop&w=400&q=75', icon: 'Banana', displayOrder: 4, isActive: true, itemCount: 0 },
      { id: 'sub-citrus-fruits', name: 'Citrus Fruits', slug: 'citrus-fruits', parentId: 'cat-fruits-veg', description: 'Juicy Nagpur oranges & limes', imageUrl: 'https://images.unsplash.com/photo-1582979512210-99b6a53386f9?auto=format&fit=crop&w=400&q=75', icon: 'Citrus', displayOrder: 5, isActive: true, itemCount: 0 },
      { id: 'sub-fresh-veg', name: 'Fresh Vegetables', slug: 'fresh-vegetables', parentId: 'cat-fruits-veg', description: 'Daily handpicked farm vegetables', imageUrl: 'https://images.unsplash.com/photo-1566385101042-1a0aa0c1268c?auto=format&fit=crop&w=400&q=75', icon: 'Carrot', displayOrder: 6, isActive: true, itemCount: 1 },
      { id: 'sub-leafy-veg', name: 'Leafy Vegetables', slug: 'leafy-vegetables', parentId: 'cat-fruits-veg', description: 'Palak, Keerai, Methi & Fresh Greens', imageUrl: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?auto=format&fit=crop&w=400&q=75', icon: 'Leaf', displayOrder: 7, isActive: true, itemCount: 1 },
      { id: 'sub-root-veg', name: 'Root Vegetables', slug: 'root-vegetables', parentId: 'cat-fruits-veg', description: 'Ooty carrots, beetroot, radishes', imageUrl: 'https://images.unsplash.com/photo-1598170845058-32b9d6a5c317?auto=format&fit=crop&w=400&q=75', icon: 'Carrot', displayOrder: 8, isActive: true, itemCount: 1 },
      { id: 'sub-onions-potatoes', name: 'Onions & Potatoes', slug: 'onions-potatoes', parentId: 'cat-fruits-veg', description: 'Sambar shallots, red onions & baby potatoes', imageUrl: 'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?auto=format&fit=crop&w=400&q=75', icon: 'CircleDot', displayOrder: 9, isActive: true, itemCount: 1 },
      { id: 'sub-tomatoes', name: 'Tomatoes', slug: 'tomatoes', parentId: 'cat-fruits-veg', description: 'Nattu Thakkali & Hybrid Vine Tomatoes', imageUrl: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=400&q=75', icon: 'Dot', displayOrder: 10, isActive: true, itemCount: 1 },
      { id: 'sub-herbs-greens', name: 'Herbs & Fresh Greens', slug: 'herbs-fresh-greens', parentId: 'cat-fruits-veg', description: 'Coriander, curry leaves, mint & ginger', imageUrl: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=400&q=75', icon: 'Sprout', displayOrder: 11, isActive: true, itemCount: 0 },
    ]
  },

  // B. Rice, Atta & Grains
  {
    id: 'cat-rice-atta',
    name: 'Rice, Atta & Grains',
    slug: 'rice-atta-grains',
    parentId: null,
    description: 'Traditional Sona Masoori, fragrant Basmati, Sharbati whole wheat flours, and unpolished millets.',
    imageUrl: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=600&q=80',
    icon: 'Wheat',
    displayOrder: 2,
    isActive: true,
    itemCount: 3,
    featured: true,
    subcategories: [
      { id: 'sub-everyday-rice', name: 'Everyday Rice', slug: 'everyday-rice', parentId: 'cat-rice-atta', description: 'Sona Masoori, Ponni & Boiled Rice', imageUrl: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=400&q=75', icon: 'Grain', displayOrder: 1, isActive: true, itemCount: 1 },
      { id: 'sub-ponni-rice', name: 'Ponni Rice', slug: 'ponni-rice', parentId: 'cat-rice-atta', description: 'Deluxe Thanjavur Ponni Rice', imageUrl: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=400&q=75', icon: 'Wheat', displayOrder: 2, isActive: true, itemCount: 0 },
      { id: 'sub-idli-rice', name: 'Idli Rice', slug: 'idli-rice', parentId: 'cat-rice-atta', description: 'Short grain parboiled idli rice', imageUrl: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=400&q=75', icon: 'Disc', displayOrder: 3, isActive: true, itemCount: 0 },
      { id: 'sub-basmati-rice', name: 'Basmati Rice', slug: 'basmati-rice', parentId: 'cat-rice-atta', description: 'Long-grain aged royal basmati', imageUrl: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=400&q=75', icon: 'Sparkles', displayOrder: 4, isActive: true, itemCount: 1 },
      { id: 'sub-wheat-flour', name: 'Wheat Flour / Atta', slug: 'wheat-flour-atta', parentId: 'cat-rice-atta', description: '100% Sharbati whole wheat chakki atta', imageUrl: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=400&q=75', icon: 'Package', displayOrder: 5, isActive: true, itemCount: 1 },
      { id: 'sub-rava-sooji', name: 'Rava / Sooji', slug: 'rava-sooji', parentId: 'cat-rice-atta', description: 'Roasted Bombay rava & bansi sooji', imageUrl: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=400&q=75', icon: 'Layers', displayOrder: 6, isActive: true, itemCount: 0 },
      { id: 'sub-besan-flours', name: 'Besan & Other Flours', slug: 'besan-flours', parentId: 'cat-rice-atta', description: 'Gram flour, rice flour & maida', imageUrl: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=400&q=75', icon: 'Box', displayOrder: 7, isActive: true, itemCount: 0 },
      { id: 'sub-millets-grains', name: 'Millets (Ragi, Jowar, Bajra)', slug: 'millets-grains', parentId: 'cat-rice-atta', description: 'Nutrient-rich ancient grains', imageUrl: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=400&q=75', icon: 'Sun', displayOrder: 8, isActive: true, itemCount: 0 },
    ]
  },

  // C. Dals, Pulses & Legumes
  {
    id: 'cat-dals-pulses',
    name: 'Dals, Pulses & Legumes',
    slug: 'dals-pulses-legumes',
    parentId: null,
    description: 'Unpolished protein-rich Toor, Moong, Urad, Chana dals, Kabuli chana, and Rajma.',
    imageUrl: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=600&q=80',
    icon: 'Bean',
    displayOrder: 3,
    isActive: true,
    itemCount: 1,
    featured: true,
    subcategories: [
      { id: 'sub-toor-dal', name: 'Toor Dal', slug: 'toor-dal', parentId: 'cat-dals-pulses', description: 'Unpolished premium yellow pigeon peas', imageUrl: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=400&q=75', icon: 'Circle', displayOrder: 1, isActive: true, itemCount: 1 },
      { id: 'sub-moong-dal', name: 'Moong Dal', slug: 'moong-dal', parentId: 'cat-dals-pulses', description: 'Split yellow and whole green gram', imageUrl: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=400&q=75', icon: 'Circle', displayOrder: 2, isActive: true, itemCount: 0 },
      { id: 'sub-urad-dal', name: 'Urad Dal', slug: 'urad-dal', parentId: 'cat-dals-pulses', description: 'Whole & split white urad for soft idlis', imageUrl: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=400&q=75', icon: 'Disc', displayOrder: 3, isActive: true, itemCount: 0 },
      { id: 'sub-chana-dal', name: 'Chana Dal', slug: 'chana-dal', parentId: 'cat-dals-pulses', description: 'Bengal gram dal for cooking and vadai', imageUrl: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=400&q=75', icon: 'Circle', displayOrder: 4, isActive: true, itemCount: 0 },
      { id: 'sub-chickpeas-rajma', name: 'Chickpeas & Rajma', slug: 'chickpeas-rajma', parentId: 'cat-dals-pulses', description: 'Kabuli chana, kala chana, red rajma', imageUrl: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=400&q=75', icon: 'Layers', displayOrder: 5, isActive: true, itemCount: 0 },
    ]
  },

  // D. Cooking Oils & Ghee
  {
    id: 'cat-oils-ghee',
    name: 'Cooking Oils & Ghee',
    slug: 'cooking-oils-ghee',
    parentId: null,
    description: 'Cold-pressed gingelly, groundnut, and coconut oils alongside authentic cultured Desi cow ghee.',
    imageUrl: 'https://images.unsplash.com/photo-1589927986089-35812388d1f4?auto=format&fit=crop&w=600&q=80',
    icon: 'Flame',
    displayOrder: 4,
    isActive: true,
    itemCount: 1,
    featured: true,
    subcategories: [
      { id: 'sub-cooking-ghee', name: 'Cooking Ghee', slug: 'cooking-ghee', parentId: 'cat-oils-ghee', description: 'Traditional bilona churned A2 cow ghee', imageUrl: 'https://images.unsplash.com/photo-1589927986089-35812388d1f4?auto=format&fit=crop&w=400&q=75', icon: 'Sparkles', displayOrder: 1, isActive: true, itemCount: 1 },
      { id: 'sub-groundnut-oil', name: 'Groundnut Oil', slug: 'groundnut-oil', parentId: 'cat-oils-ghee', description: 'Cold-pressed marachekku peanut oil', imageUrl: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=400&q=75', icon: 'Droplet', displayOrder: 2, isActive: true, itemCount: 0 },
      { id: 'sub-sesame-oil', name: 'Sesame / Gingelly Oil', slug: 'sesame-oil', parentId: 'cat-oils-ghee', description: 'Authentic Idhayam style gingelly oil', imageUrl: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=400&q=75', icon: 'Droplet', displayOrder: 3, isActive: true, itemCount: 0 },
      { id: 'sub-coconut-oil', name: 'Coconut Oil for Cooking', slug: 'coconut-oil-cooking', parentId: 'cat-oils-ghee', description: 'Pure expelled coconut cooking oil', imageUrl: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=400&q=75', icon: 'Droplet', displayOrder: 4, isActive: true, itemCount: 0 },
      { id: 'sub-sunflower-oil', name: 'Sunflower Oil', slug: 'sunflower-oil', parentId: 'cat-oils-ghee', description: 'Refined sunflower cooking oils', imageUrl: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=400&q=75', icon: 'Sun', displayOrder: 5, isActive: true, itemCount: 0 },
    ]
  },

  // E. Spices & Masala
  {
    id: 'cat-spices-masala',
    name: 'Spices & Masala',
    slug: 'spices-masalas',
    parentId: null,
    description: 'High-curcumin Salem turmeric, whole Idukki cardamom, aromatic garam masalas & pure sambar powders.',
    imageUrl: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=600&q=80',
    icon: 'Sparkles',
    displayOrder: 5,
    isActive: true,
    itemCount: 2,
    featured: true,
    subcategories: [
      { id: 'sub-powdered-spices', name: 'Chilli, Turmeric & Coriander Powder', slug: 'powdered-spices', parentId: 'cat-spices-masala', description: 'Single origin pure spice powders', imageUrl: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=400&q=75', icon: 'Sparkles', displayOrder: 1, isActive: true, itemCount: 1 },
      { id: 'sub-whole-spices', name: 'Whole Spices', slug: 'whole-spices', parentId: 'cat-spices-masala', description: 'Cardamom, cloves, cinnamon, pepper, cumin', imageUrl: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=400&q=75', icon: 'Box', displayOrder: 2, isActive: true, itemCount: 1 },
      { id: 'sub-sambar-rasam', name: 'Sambar & Rasam Powders', slug: 'sambar-rasam-powders', parentId: 'cat-spices-masala', description: 'Traditional South Indian culinary blends', imageUrl: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=400&q=75', icon: 'Flame', displayOrder: 3, isActive: true, itemCount: 0 },
      { id: 'sub-kitchen-blends', name: 'Garam Masala & Biryani Blends', slug: 'kitchen-masala-blends', parentId: 'cat-spices-masala', description: 'Rich aromatic cooking masalas', imageUrl: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=400&q=75', icon: 'ChefHat', displayOrder: 4, isActive: true, itemCount: 0 },
      { id: 'sub-hing-tamarind', name: 'Asafoetida / Hing & Tamarind', slug: 'hing-tamarind', parentId: 'cat-spices-masala', description: 'Compounded hing & aged dark tamarind', imageUrl: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=400&q=75', icon: 'Check', displayOrder: 5, isActive: true, itemCount: 0 },
    ]
  },

  // F. Sugar, Salt & Sweeteners
  {
    id: 'cat-sugar-salt',
    name: 'Sugar, Salt & Sweeteners',
    slug: 'sugar-salt-sweeteners',
    parentId: null,
    description: 'Sulphur-free white sugar, traditional country jaggery, natural pink Himalayan salt, and raw honey.',
    imageUrl: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=600&q=80',
    icon: 'Package',
    displayOrder: 6,
    isActive: true,
    itemCount: 0,
    featured: false,
    subcategories: [
      { id: 'sub-sugar', name: 'White & Brown Sugar', slug: 'sugar-types', parentId: 'cat-sugar-salt', description: 'Clean refined sugar crystals', imageUrl: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=400&q=75', icon: 'Box', displayOrder: 1, isActive: true, itemCount: 0 },
      { id: 'sub-jaggery', name: 'Jaggery & Jaggery Powder', slug: 'jaggery-vellam', parentId: 'cat-sugar-salt', description: 'Natural unrefined cane and palm jaggery', imageUrl: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=400&q=75', icon: 'Sun', displayOrder: 2, isActive: true, itemCount: 0 },
      { id: 'sub-salts', name: 'Iodised, Rock & Pink Salt', slug: 'salts', parentId: 'cat-sugar-salt', description: 'Pure cooking salts and mineral salts', imageUrl: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=400&q=75', icon: 'Circle', displayOrder: 3, isActive: true, itemCount: 0 },
      { id: 'sub-honey', name: 'Honey & Natural Sweeteners', slug: 'honey-sweeteners', parentId: 'cat-sugar-salt', description: 'Forest honey and natural sweeteners', imageUrl: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=400&q=75', icon: 'Heart', displayOrder: 4, isActive: true, itemCount: 0 },
    ]
  },

  // G. Dry Fruits, Nuts & Seeds
  {
    id: 'cat-dry-fruits',
    name: 'Dry Fruits, Nuts & Seeds',
    slug: 'gourmet-organic',
    parentId: null,
    description: 'California almonds, jumbo W240 cashews, Kashmiri walnuts, Munakka raisins, and chia seeds.',
    imageUrl: 'https://images.unsplash.com/photo-1508061253366-f7da158b6d46?auto=format&fit=crop&w=600&q=80',
    icon: 'Nut',
    displayOrder: 7,
    isActive: true,
    itemCount: 1,
    featured: true,
    subcategories: [
      { id: 'sub-almonds-badam', name: 'Badam / Almonds', slug: 'almonds-badam', parentId: 'cat-dry-fruits', description: 'Crunchy California almonds (50g to 1kg)', imageUrl: 'https://images.unsplash.com/photo-1508061253366-f7da158b6d46?auto=format&fit=crop&w=400&q=75', icon: 'Nut', displayOrder: 1, isActive: true, itemCount: 0 },
      { id: 'sub-cashews', name: 'Cashews / Mundhiri', slug: 'cashews', parentId: 'cat-dry-fruits', description: 'Premium whole W240 cashew nuts', imageUrl: 'https://images.unsplash.com/photo-1508061253366-f7da158b6d46?auto=format&fit=crop&w=400&q=75', icon: 'Nut', displayOrder: 2, isActive: true, itemCount: 0 },
      { id: 'sub-walnuts-raisins', name: 'Walnuts & Raisins', slug: 'walnuts-raisins', parentId: 'cat-dry-fruits', description: 'Kashmiri walnut kernels & Kishmish', imageUrl: 'https://images.unsplash.com/photo-1508061253366-f7da158b6d46?auto=format&fit=crop&w=400&q=75', icon: 'Sun', displayOrder: 3, isActive: true, itemCount: 1 },
      { id: 'sub-dates-figs', name: 'Dates & Dry Figs / Anjeer', slug: 'dates-figs', parentId: 'cat-dry-fruits', description: 'Arabian dates and plump Turkish figs', imageUrl: 'https://images.unsplash.com/photo-1508061253366-f7da158b6d46?auto=format&fit=crop&w=400&q=75', icon: 'Circle', displayOrder: 4, isActive: true, itemCount: 0 },
      { id: 'sub-seeds-makhana', name: 'Chia, Flax Seeds & Makhana', slug: 'seeds-makhana', parentId: 'cat-dry-fruits', description: 'Superfood seeds and roasted foxnuts', imageUrl: 'https://images.unsplash.com/photo-1508061253366-f7da158b6d46?auto=format&fit=crop&w=400&q=75', icon: 'Sparkles', displayOrder: 5, isActive: true, itemCount: 0 },
    ]
  },

  // H. Biscuits, Cookies & Bakery Snacks
  {
    id: 'cat-biscuits-bakery',
    name: 'Biscuits, Cookies & Bakery',
    slug: 'biscuits-cookies-bakery',
    parentId: null,
    description: 'Cream biscuits, Marie, digestive crackers, oven-baked rusk, khari, and tea toast.',
    imageUrl: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?auto=format&fit=crop&w=600&q=80',
    icon: 'Cookie',
    displayOrder: 8,
    isActive: true,
    itemCount: 0,
    featured: false,
    subcategories: [
      { id: 'sub-marie-digestive', name: 'Marie & Digestive Biscuits', slug: 'marie-digestive', parentId: 'cat-biscuits-bakery', description: 'Crisp tea biscuits', imageUrl: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?auto=format&fit=crop&w=400&q=75', icon: 'Cookie', displayOrder: 1, isActive: true, itemCount: 0 },
      { id: 'sub-cream-cookies', name: 'Cream Biscuits & Cookies', slug: 'cream-cookies', parentId: 'cat-biscuits-bakery', description: 'Chocolate cream, bourbon & butter cookies', imageUrl: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?auto=format&fit=crop&w=400&q=75', icon: 'Heart', displayOrder: 2, isActive: true, itemCount: 0 },
      { id: 'sub-rusk-toast', name: 'Rusk, Toast & Khari', slug: 'rusk-toast', parentId: 'cat-biscuits-bakery', description: 'Crispy suji rusk and tea toast', imageUrl: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?auto=format&fit=crop&w=400&q=75', icon: 'Box', displayOrder: 3, isActive: true, itemCount: 0 },
    ]
  },

  // I. Chocolates, Candies & Sweets
  {
    id: 'cat-chocolates-sweets',
    name: 'Chocolates & Sweets',
    slug: 'chocolates-candies-sweets',
    parentId: null,
    description: 'Dark & milk chocolate bars, eclairs, traditional Indian sweet packs, and festive gift boxes.',
    imageUrl: 'https://images.unsplash.com/photo-1549007994-cb92caebd54b?auto=format&fit=crop&w=600&q=80',
    icon: 'Gift',
    displayOrder: 9,
    isActive: true,
    itemCount: 0,
    featured: false,
    subcategories: [
      { id: 'sub-chocolate-bars', name: 'Chocolate Bars & Wafers', slug: 'chocolate-bars', parentId: 'cat-chocolates-sweets', description: 'Milk & dark chocolates', imageUrl: 'https://images.unsplash.com/photo-1549007994-cb92caebd54b?auto=format&fit=crop&w=400&q=75', icon: 'Gift', displayOrder: 1, isActive: true, itemCount: 0 },
      { id: 'sub-indian-sweets', name: 'Indian Sweets & Mithai', slug: 'indian-sweets', parentId: 'cat-chocolates-sweets', description: 'Gulab jamun, soan papdi, halwa packs', imageUrl: 'https://images.unsplash.com/photo-1549007994-cb92caebd54b?auto=format&fit=crop&w=400&q=75', icon: 'Sparkles', displayOrder: 2, isActive: true, itemCount: 0 },
      { id: 'sub-candies-mints', name: 'Candies, Toffees & Mints', slug: 'candies-mints', parentId: 'cat-chocolates-sweets', description: 'Flavoured toffees and mouth fresheners', imageUrl: 'https://images.unsplash.com/photo-1549007994-cb92caebd54b?auto=format&fit=crop&w=400&q=75', icon: 'Circle', displayOrder: 3, isActive: true, itemCount: 0 },
    ]
  },

  // J. Chips, Snacks & Namkeen
  {
    id: 'cat-chips-snacks',
    name: 'Chips, Snacks & Namkeen',
    slug: 'chips-snacks-namkeen',
    parentId: null,
    description: 'Crispy Manapparai murukku, spicy mixture, banana chips, potato wafers, and roasted peanuts.',
    imageUrl: 'https://images.unsplash.com/photo-1566478989037-eec170784d0b?auto=format&fit=crop&w=600&q=80',
    icon: 'Utensils',
    displayOrder: 10,
    isActive: true,
    itemCount: 1,
    featured: true,
    subcategories: [
      { id: 'sub-murukku-mixture', name: 'Murukku & South Indian Namkeen', slug: 'murukku-mixture', parentId: 'cat-chips-snacks', description: 'Traditional butter murukku, ribbon pakoda & mixture', imageUrl: 'https://images.unsplash.com/photo-1566478989037-eec170784d0b?auto=format&fit=crop&w=400&q=75', icon: 'Utensils', displayOrder: 1, isActive: true, itemCount: 1 },
      { id: 'sub-potato-chips', name: 'Potato & Banana Chips', slug: 'potato-banana-chips', parentId: 'cat-chips-snacks', description: 'Nendran banana chips and crispy wafers', imageUrl: 'https://images.unsplash.com/photo-1566478989037-eec170784d0b?auto=format&fit=crop&w=400&q=75', icon: 'Layers', displayOrder: 2, isActive: true, itemCount: 0 },
      { id: 'sub-roasted-snacks', name: 'Roasted Peanuts & Healthy Snacks', slug: 'roasted-healthy-snacks', parentId: 'cat-chips-snacks', description: 'Salted peanuts, puffed rice & roasted snacks', imageUrl: 'https://images.unsplash.com/photo-1566478989037-eec170784d0b?auto=format&fit=crop&w=400&q=75', icon: 'Nut', displayOrder: 3, isActive: true, itemCount: 0 },
    ]
  },

  // K. Tea, Coffee & Hot Beverages
  {
    id: 'cat-tea-coffee',
    name: 'Tea, Coffee & Hot Beverages',
    slug: 'snacks-beverages',
    parentId: null,
    description: 'Signature Madurai royal blend filter coffee, Nilgiri orthodox black teas, green tea, and cocoa drinks.',
    imageUrl: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=600&q=80',
    icon: 'Coffee',
    displayOrder: 11,
    isActive: true,
    itemCount: 2,
    featured: true,
    subcategories: [
      { id: 'sub-filter-coffee', name: 'Filter Coffee & Coffee Powders', slug: 'filter-coffee-powders', parentId: 'cat-tea-coffee', description: 'Freshly roasted plantation coffee with chicory', imageUrl: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=400&q=75', icon: 'Coffee', displayOrder: 1, isActive: true, itemCount: 1 },
      { id: 'sub-tea-leaves', name: 'Tea & Green Tea', slug: 'tea-leaves-bags', parentId: 'cat-tea-coffee', description: 'Estate orthodox leaves & herbal infusion bags', imageUrl: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=400&q=75', icon: 'Leaf', displayOrder: 2, isActive: true, itemCount: 1 },
      { id: 'sub-malt-chocolate-drinks', name: 'Malt & Chocolate Drinks', slug: 'malt-chocolate-drinks', parentId: 'cat-tea-coffee', description: 'Horlicks, Boost & Bournvita mixes', imageUrl: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=400&q=75', icon: 'Package', displayOrder: 3, isActive: true, itemCount: 0 },
    ]
  },

  // L. Cold Drinks, Juices & Beverages
  {
    id: 'cat-cold-drinks',
    name: 'Cold Drinks & Juices',
    slug: 'cold-drinks-juices',
    parentId: null,
    description: 'Refreshing tender coconut water, fruit juices, soda, lemon squash, and sparkling drinks.',
    imageUrl: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&w=600&q=80',
    icon: 'GlassWater',
    displayOrder: 12,
    isActive: true,
    itemCount: 0,
    featured: false,
    subcategories: [
      { id: 'sub-fruit-juices', name: 'Fruit Juices & Nectars', slug: 'fruit-juices', parentId: 'cat-cold-drinks', description: 'Real fruit pulps and cold pressed juices', imageUrl: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&w=400&q=75', icon: 'Citrus', displayOrder: 1, isActive: true, itemCount: 0 },
      { id: 'sub-coconut-water', name: 'Tender Coconut Water', slug: 'coconut-water', parentId: 'cat-cold-drinks', description: 'Packaged natural coconut water', imageUrl: 'https://images.unsplash.com/photo-1550989460-0adf9ea622e2?auto=format&fit=crop&w=400&q=75', icon: 'Droplet', displayOrder: 2, isActive: true, itemCount: 0 },
      { id: 'sub-soda-syrups', name: 'Soda, Squash & Syrups', slug: 'soda-syrups', parentId: 'cat-cold-drinks', description: 'Nannari syrup, rose milk mix & soda', imageUrl: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&w=400&q=75', icon: 'GlassWater', displayOrder: 3, isActive: true, itemCount: 0 },
    ]
  },

  // M. Breakfast & Cereals
  {
    id: 'cat-breakfast',
    name: 'Breakfast & Cereals',
    slug: 'breakfast-cereals',
    parentId: null,
    description: 'Rolled oats, corn flakes, muesli, traditional instant upma mixes, fruit jams & peanut butter.',
    imageUrl: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=600&q=80',
    icon: 'Sun',
    displayOrder: 13,
    isActive: true,
    itemCount: 0,
    featured: false,
    subcategories: [
      { id: 'sub-oats-cornflakes', name: 'Oats & Corn Flakes', slug: 'oats-cornflakes', parentId: 'cat-breakfast', description: 'High fiber breakfast oats and flakes', imageUrl: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=400&q=75', icon: 'Sun', displayOrder: 1, isActive: true, itemCount: 0 },
      { id: 'sub-jams-spreads', name: 'Jams, Honey & Peanut Butter', slug: 'jams-spreads', parentId: 'cat-breakfast', description: 'Mixed fruit jam & creamy peanut spreads', imageUrl: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=400&q=75', icon: 'Heart', displayOrder: 2, isActive: true, itemCount: 0 },
      { id: 'sub-instant-breakfast-mix', name: 'Instant Dosa & Idli Mixes', slug: 'instant-breakfast-mixes', parentId: 'cat-breakfast', description: 'MTR & Aachi instant breakfast mixes', imageUrl: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=400&q=75', icon: 'Layers', displayOrder: 3, isActive: true, itemCount: 0 },
    ]
  },

  // N. Noodles, Pasta & Instant Foods
  {
    id: 'cat-instant-foods',
    name: 'Noodles, Pasta & Instant Foods',
    slug: 'noodles-pasta-instant-foods',
    parentId: null,
    description: 'Instant noodles, durum wheat pasta, vermicelli, papad, fryums, and ready-to-cook meal kits.',
    imageUrl: 'https://images.unsplash.com/photo-1612927601601-6638404737ce?auto=format&fit=crop&w=600&q=80',
    icon: 'Utensils',
    displayOrder: 14,
    isActive: true,
    itemCount: 0,
    featured: false,
    subcategories: [
      { id: 'sub-instant-noodles', name: 'Instant Noodles & Vermicelli', slug: 'instant-noodles-vermicelli', parentId: 'cat-instant-foods', description: 'Maggi, Yippee & roasted semiya', imageUrl: 'https://images.unsplash.com/photo-1612927601601-6638404737ce?auto=format&fit=crop&w=400&q=75', icon: 'Utensils', displayOrder: 1, isActive: true, itemCount: 0 },
      { id: 'sub-pasta-macaroni', name: 'Pasta & Macaroni', slug: 'pasta-macaroni', parentId: 'cat-instant-foods', description: '100% semolina pasta shapes', imageUrl: 'https://images.unsplash.com/photo-1551462147-ff29053bfc14?auto=format&fit=crop&w=400&q=75', icon: 'Box', displayOrder: 2, isActive: true, itemCount: 0 },
      { id: 'sub-papad-fryums', name: 'Papad & Fryums', slug: 'papad-fryums', parentId: 'cat-instant-foods', description: 'Appalam, vathal, and fryums', imageUrl: 'https://images.unsplash.com/photo-1612927601601-6638404737ce?auto=format&fit=crop&w=400&q=75', icon: 'Disc', displayOrder: 3, isActive: true, itemCount: 0 },
    ]
  },

  // O. Sauces, Pickles & Condiments
  {
    id: 'cat-sauces-pickles',
    name: 'Sauces, Pickles & Condiments',
    slug: 'sauces-pickles-condiments',
    parentId: null,
    description: 'Authentic South Indian mango, lime & garlic pickles, tomato ketchups, and ginger-garlic paste.',
    imageUrl: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=600&q=80',
    icon: 'Package',
    displayOrder: 15,
    isActive: true,
    itemCount: 0,
    featured: false,
    subcategories: [
      { id: 'sub-indian-pickles', name: 'Indian Pickles (Oorugai)', slug: 'indian-pickles', parentId: 'cat-sauces-pickles', description: 'Cut mango, lime, garlic and gongura pickles', imageUrl: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=400&q=75', icon: 'Jar', displayOrder: 1, isActive: true, itemCount: 0 },
      { id: 'sub-ketchup-sauces', name: 'Tomato Ketchup & Sauces', slug: 'ketchup-sauces', parentId: 'cat-sauces-pickles', description: 'Table sauces and dips', imageUrl: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=400&q=75', icon: 'Droplet', displayOrder: 2, isActive: true, itemCount: 0 },
      { id: 'sub-cooking-pastes', name: 'Ginger-Garlic Paste & Chutneys', slug: 'cooking-pastes', parentId: 'cat-sauces-pickles', description: 'Fresh aromatics for culinary prep', imageUrl: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=400&q=75', icon: 'Layers', displayOrder: 3, isActive: true, itemCount: 0 },
    ]
  },

  // P. Dairy, Eggs & Refrigerated Products
  {
    id: 'cat-dairy-eggs',
    name: 'Dairy, Eggs & Refrigerated',
    slug: 'dairy-bakery',
    parentId: null,
    description: 'Farm-fresh milk, set curd, malai paneer, artisanal butter, fresh eggs, and artisan bakery loaves.',
    imageUrl: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=600&q=80',
    icon: 'Milk',
    displayOrder: 16,
    isActive: true,
    itemCount: 4,
    featured: true,
    subcategories: [
      { id: 'sub-fresh-milk-curd', name: 'Milk, Curd & Buttermilk', slug: 'milk-curd-dahi', parentId: 'cat-dairy-eggs', description: 'Fresh Cow Milk, Set Dahi & Moru', imageUrl: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=400&q=75', icon: 'Milk', displayOrder: 1, isActive: true, itemCount: 1 },
      { id: 'sub-paneer-cheese', name: 'Paneer, Butter & Cheese', slug: 'paneer-butter-cheese', parentId: 'cat-dairy-eggs', description: 'Malai paneer slabs and table butter', imageUrl: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=400&q=75', icon: 'Square', displayOrder: 2, isActive: true, itemCount: 2 },
      { id: 'sub-fresh-bread', name: 'Bakery Breads & Buns', slug: 'breads-buns', parentId: 'cat-dairy-eggs', description: 'Whole wheat bread, pav buns & tea toast', imageUrl: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=400&q=75', icon: 'Cookie', displayOrder: 3, isActive: true, itemCount: 1 },
      { id: 'sub-eggs', name: 'Farm Eggs', slug: 'farm-eggs', parentId: 'cat-dairy-eggs', description: 'Farm-fresh brown and country eggs', imageUrl: 'https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?auto=format&fit=crop&w=400&q=75', icon: 'Egg', displayOrder: 4, isActive: true, itemCount: 0 },
    ]
  },

  // Q. Frozen Foods & Ice Cream
  {
    id: 'cat-frozen-foods',
    name: 'Frozen Foods & Ice Cream',
    slug: 'frozen-foods-ice-cream',
    parentId: null,
    description: 'Frozen green peas, Malabar parottas, French fries, and premium ice cream tubs for home delivery.',
    imageUrl: 'https://images.unsplash.com/photo-1497034825429-c343d7c6a68f?auto=format&fit=crop&w=600&q=80',
    icon: 'Snowflake',
    displayOrder: 17,
    isActive: true,
    itemCount: 0,
    featured: false,
    subcategories: [
      { id: 'sub-ice-creams', name: 'Ice Cream Tubs & Cones', slug: 'ice-cream-tubs', parentId: 'cat-frozen-foods', description: 'Amul, Kwality Wall\'s & Arun ice creams', imageUrl: 'https://images.unsplash.com/photo-1497034825429-c343d7c6a68f?auto=format&fit=crop&w=400&q=75', icon: 'Snowflake', displayOrder: 1, isActive: true, itemCount: 0 },
      { id: 'sub-frozen-veg-snacks', name: 'Frozen Veg, Parottas & Snacks', slug: 'frozen-snacks-parotta', parentId: 'cat-frozen-foods', description: 'Frozen peas, sweet corn & ready parottas', imageUrl: 'https://images.unsplash.com/photo-1497034825429-c343d7c6a68f?auto=format&fit=crop&w=400&q=75', icon: 'Layers', displayOrder: 2, isActive: true, itemCount: 0 },
    ]
  },

  // R. Personal Care & Bath
  {
    id: 'cat-personal-care',
    name: 'Personal Care & Bath',
    slug: 'personal-care',
    parentId: null,
    description: 'Herbal bathing soaps, body wash, gentle hand washes, talcum powders, and grooming essentials.',
    imageUrl: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=600&q=80',
    icon: 'Sparkles',
    displayOrder: 18,
    isActive: true,
    itemCount: 2,
    featured: false,
    subcategories: [
      { id: 'sub-bath-soaps', name: 'Bath Soaps & Body Wash', slug: 'bath-soaps-bodywash', parentId: 'cat-personal-care', description: 'Pure neem, sandal & herbal glycerine soaps', imageUrl: 'https://images.unsplash.com/photo-1607006314180-877f8ceea25b?auto=format&fit=crop&w=400&q=75', icon: 'Sparkles', displayOrder: 1, isActive: true, itemCount: 1 },
      { id: 'sub-handwash-sanitizers', name: 'Hand Wash & Sanitizers', slug: 'handwash-sanitizers', parentId: 'cat-personal-care', description: 'Moisturizing germ protection handwashes', imageUrl: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=400&q=75', icon: 'Shield', displayOrder: 2, isActive: true, itemCount: 0 },
      { id: 'sub-body-lotions', name: 'Body Lotions & Talc', slug: 'body-lotions-talc', parentId: 'cat-personal-care', description: 'Gokul Santol talc and hydrating lotions', imageUrl: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=400&q=75', icon: 'Heart', displayOrder: 3, isActive: true, itemCount: 0 },
    ]
  },

  // S. Hair Care
  {
    id: 'cat-hair-care',
    name: 'Hair Care',
    slug: 'hair-care',
    parentId: null,
    description: 'Nourishing coconut hair oils, herbal anti-dandruff shampoos, conditioners, and hair styling.',
    imageUrl: 'https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?auto=format&fit=crop&w=600&q=80',
    icon: 'Scissors',
    displayOrder: 19,
    isActive: true,
    itemCount: 1,
    featured: false,
    subcategories: [
      { id: 'sub-hair-oil', name: 'Hair Oils', slug: 'hair-oils', parentId: 'cat-hair-care', description: 'Pure virgin coconut and herbal oils', imageUrl: 'https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?auto=format&fit=crop&w=400&q=75', icon: 'Droplet', displayOrder: 1, isActive: true, itemCount: 1 },
      { id: 'sub-shampoo-conditioner', name: 'Shampoo & Conditioners', slug: 'shampoos-conditioners', parentId: 'cat-hair-care', description: 'Gentle cleansing and nourishing formulas', imageUrl: 'https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?auto=format&fit=crop&w=400&q=75', icon: 'Sparkles', displayOrder: 2, isActive: true, itemCount: 0 },
    ]
  },

  // T. Oral Care
  {
    id: 'cat-oral-care',
    name: 'Oral Care',
    slug: 'oral-care',
    parentId: null,
    description: 'Ayurvedic & herbal toothpastes, soft-bristle toothbrushes, mouthwashes, and tongue cleaners.',
    imageUrl: 'https://images.unsplash.com/photo-1559591937-e62fb330bc1f?auto=format&fit=crop&w=600&q=80',
    icon: 'Smile',
    displayOrder: 20,
    isActive: true,
    itemCount: 0,
    featured: false,
    subcategories: [
      { id: 'sub-toothpaste', name: 'Toothpaste & Toothpowder', slug: 'toothpastes', parentId: 'cat-oral-care', description: 'Dabur Red, Vicco, Colgate & herbal pastes', imageUrl: 'https://images.unsplash.com/photo-1559591937-e62fb330bc1f?auto=format&fit=crop&w=400&q=75', icon: 'Smile', displayOrder: 1, isActive: true, itemCount: 0 },
      { id: 'sub-toothbrushes', name: 'Toothbrushes & Mouthwash', slug: 'toothbrushes-mouthwash', parentId: 'cat-oral-care', description: 'Soft bristle brushes and dental rinses', imageUrl: 'https://images.unsplash.com/photo-1559591937-e62fb330bc1f?auto=format&fit=crop&w=400&q=75', icon: 'Sparkles', displayOrder: 2, isActive: true, itemCount: 0 },
    ]
  },

  // U. Skin Care & Beauty
  {
    id: 'cat-skin-care',
    name: 'Skin Care & Beauty',
    slug: 'skin-care-beauty',
    parentId: null,
    description: 'Moisturizers, sunscreens, face washes, rosewater toners, and gentle lip balms.',
    imageUrl: 'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&w=600&q=80',
    icon: 'Sparkles',
    displayOrder: 21,
    isActive: true,
    itemCount: 0,
    featured: false,
    subcategories: [
      { id: 'sub-face-wash', name: 'Face Wash & Cleansers', slug: 'face-wash-cleansers', parentId: 'cat-skin-care', description: 'Himalaya Neem and foaming cleansers', imageUrl: 'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&w=400&q=75', icon: 'Sparkles', displayOrder: 1, isActive: true, itemCount: 0 },
      { id: 'sub-creams-moisturizers', name: 'Creams, Moisturisers & Sunscreen', slug: 'creams-sunscreen', parentId: 'cat-skin-care', description: 'Daily hydration and sun protection', imageUrl: 'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&w=400&q=75', icon: 'Sun', displayOrder: 2, isActive: true, itemCount: 0 },
    ]
  },

  // V. Feminine Hygiene
  {
    id: 'cat-feminine-hygiene',
    name: 'Feminine Hygiene',
    slug: 'feminine-hygiene',
    parentId: null,
    description: 'Sanitary pads, pantyliners, intimate washes, and gentle personal care supplies.',
    imageUrl: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=600&q=80',
    icon: 'Heart',
    displayOrder: 22,
    isActive: true,
    itemCount: 0,
    featured: false,
    subcategories: [
      { id: 'sub-sanitary-pads', name: 'Sanitary Pads & Pantyliners', slug: 'sanitary-pads', parentId: 'cat-feminine-hygiene', description: 'Whisper, Stayfree & cotton pads', imageUrl: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=400&q=75', icon: 'Heart', displayOrder: 1, isActive: true, itemCount: 0 },
      { id: 'sub-intimate-hygiene', name: 'Intimate Care & Wipes', slug: 'intimate-hygiene', parentId: 'cat-feminine-hygiene', description: 'pH balanced cleansers and soothing wipes', imageUrl: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=400&q=75', icon: 'Shield', displayOrder: 2, isActive: true, itemCount: 0 },
    ]
  },

  // W. Baby & Infant Care
  {
    id: 'cat-baby-care',
    name: 'Baby & Infant Care',
    slug: 'baby-infant-care',
    parentId: null,
    description: 'Soft diaper pants, fragrance-free baby wipes, gentle soaps, baby oils, and baby laundry care.',
    imageUrl: 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?auto=format&fit=crop&w=600&q=80',
    icon: 'Baby',
    displayOrder: 23,
    isActive: true,
    itemCount: 0,
    featured: false,
    subcategories: [
      { id: 'sub-diapers-wipes', name: 'Baby Diapers & Wipes', slug: 'baby-diapers-wipes', parentId: 'cat-baby-care', description: 'Pampers, MamyPoko and soft wipes', imageUrl: 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?auto=format&fit=crop&w=400&q=75', icon: 'Baby', displayOrder: 1, isActive: true, itemCount: 0 },
      { id: 'sub-baby-bath-skin', name: 'Baby Soaps, Shampoo & Oil', slug: 'baby-bath-skin', parentId: 'cat-baby-care', description: 'Himalaya & Johnson\'s gentle baby care', imageUrl: 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?auto=format&fit=crop&w=400&q=75', icon: 'Heart', displayOrder: 2, isActive: true, itemCount: 0 },
    ]
  },

  // X. Laundry & Fabric Care
  {
    id: 'cat-laundry-care',
    name: 'Laundry & Fabric Care',
    slug: 'laundry-fabric-care',
    parentId: null,
    description: 'Detergent powders, liquid wash, fabric conditioners, stain removers, and washing bars.',
    imageUrl: 'https://images.unsplash.com/photo-1517677208171-0bc6725a3e60?auto=format&fit=crop&w=600&q=80',
    icon: 'Shirt',
    displayOrder: 24,
    isActive: true,
    itemCount: 0,
    featured: false,
    subcategories: [
      { id: 'sub-detergent-powder-liquid', name: 'Detergent Powder & Liquid', slug: 'detergent-powder-liquid', parentId: 'cat-laundry-care', description: 'Surf Excel, Ariel & Tide wash', imageUrl: 'https://images.unsplash.com/photo-1517677208171-0bc6725a3e60?auto=format&fit=crop&w=400&q=75', icon: 'Shirt', displayOrder: 1, isActive: true, itemCount: 0 },
      { id: 'sub-fabric-conditioner', name: 'Fabric Conditioners & Bars', slug: 'fabric-conditioners-bars', parentId: 'cat-laundry-care', description: 'Comfort softener and detergent bars', imageUrl: 'https://images.unsplash.com/photo-1517677208171-0bc6725a3e60?auto=format&fit=crop&w=400&q=75', icon: 'Sparkles', displayOrder: 2, isActive: true, itemCount: 0 },
    ]
  },

  // Y. Home Cleaning & Household Supplies
  {
    id: 'cat-home-cleaning',
    name: 'Home Cleaning & Supplies',
    slug: 'household-cleaning',
    parentId: null,
    description: 'Herbal citrus dishwashing gels, neem floor cleaners, toilet disinfectants, scrubbers & mops.',
    imageUrl: 'https://images.unsplash.com/photo-1583947215259-38e31be8751f?auto=format&fit=crop&w=600&q=80',
    icon: 'Sparkles',
    displayOrder: 25,
    isActive: true,
    itemCount: 2,
    featured: false,
    subcategories: [
      { id: 'sub-dishwash', name: 'Dishwash Liquids, Bars & Scrubs', slug: 'dishwash-cleaning', parentId: 'cat-home-cleaning', description: 'Vim, Pril & Scotch-Brite scrubbers', imageUrl: 'https://images.unsplash.com/photo-1583947215259-38e31be8751f?auto=format&fit=crop&w=400&q=75', icon: 'Sparkles', displayOrder: 1, isActive: true, itemCount: 1 },
      { id: 'sub-floor-toilet-cleaners', name: 'Floor, Toilet & Surface Cleaners', slug: 'floor-surface-cleaners', parentId: 'cat-home-cleaning', description: 'Lizol, Harpic & neem disinfectants', imageUrl: 'https://images.unsplash.com/photo-1583947215259-38e31be8751f?auto=format&fit=crop&w=400&q=75', icon: 'Shield', displayOrder: 2, isActive: true, itemCount: 1 },
      { id: 'sub-pest-control', name: 'Mosquito Repellents & Air Fresheners', slug: 'pest-control-fresheners', parentId: 'cat-home-cleaning', description: 'Goodknight refills, Odonil & room sprays', imageUrl: 'https://images.unsplash.com/photo-1583947215259-38e31be8751f?auto=format&fit=crop&w=400&q=75', icon: 'Wind', displayOrder: 3, isActive: true, itemCount: 0 },
    ]
  },

  // Z. Paper, Tissue & Disposable Products
  {
    id: 'cat-paper-tissue',
    name: 'Paper, Tissue & Disposables',
    slug: 'paper-tissue-disposables',
    parentId: null,
    description: 'Kitchen rolls, facial tissues, toilet rolls, paper napkins, aluminium foils, and garbage bags.',
    imageUrl: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=600&q=80',
    icon: 'Package',
    displayOrder: 26,
    isActive: true,
    itemCount: 0,
    featured: false,
    subcategories: [
      { id: 'sub-tissue-paper', name: 'Kitchen Rolls & Napkins', slug: 'kitchen-rolls-napkins', parentId: 'cat-paper-tissue', description: 'Absorbent paper rolls and soft napkins', imageUrl: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=400&q=75', icon: 'Box', displayOrder: 1, isActive: true, itemCount: 0 },
      { id: 'sub-foil-garbage-bags', name: 'Aluminium Foil & Garbage Bags', slug: 'foil-garbage-bags', parentId: 'cat-paper-tissue', description: 'Food wraps and oxo-biodegradable bags', imageUrl: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=400&q=75', icon: 'Shield', displayOrder: 2, isActive: true, itemCount: 0 },
    ]
  },

  // AA. Kitchen & Dining Essentials
  {
    id: 'cat-kitchen-dining',
    name: 'Kitchen & Dining Essentials',
    slug: 'kitchen-dining-essentials',
    parentId: null,
    description: 'Airtight storage containers, water bottles, stainless steel lunch boxes, and kitchen tools.',
    imageUrl: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?auto=format&fit=crop&w=600&q=80',
    icon: 'Utensils',
    displayOrder: 27,
    isActive: true,
    itemCount: 0,
    featured: false,
    subcategories: [
      { id: 'sub-storage-containers', name: 'Food Storage Jars & Containers', slug: 'storage-jars-containers', parentId: 'cat-kitchen-dining', description: 'Glass and BPA-free pantry containers', imageUrl: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?auto=format&fit=crop&w=400&q=75', icon: 'Box', displayOrder: 1, isActive: true, itemCount: 0 },
      { id: 'sub-water-bottles-flasks', name: 'Water Bottles & Flasks', slug: 'bottles-flasks', parentId: 'cat-kitchen-dining', description: 'Insulated steel bottles and daily flasks', imageUrl: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?auto=format&fit=crop&w=400&q=75', icon: 'GlassWater', displayOrder: 2, isActive: true, itemCount: 0 },
    ]
  },

  // AB. Pooja & Spiritual Needs
  {
    id: 'cat-pooja-spiritual',
    name: 'Pooja & Spiritual Needs',
    slug: 'pooja-spiritual-needs',
    parentId: null,
    description: 'Pure agarbatti, aromatic dhoop, pachai karpooram, cotton thiri wicks, pooja oil & kumkum.',
    imageUrl: 'https://images.unsplash.com/photo-1609137144813-7d9921338f24?auto=format&fit=crop&w=600&q=80',
    icon: 'Flame',
    displayOrder: 28,
    isActive: true,
    itemCount: 0,
    featured: false,
    subcategories: [
      { id: 'sub-agarbatti-camphor', name: 'Agarbatti, Dhoop & Camphor', slug: 'agarbatti-camphor', parentId: 'cat-pooja-spiritual', description: 'Cycle pure agarbatti and natural camphor', imageUrl: 'https://images.unsplash.com/photo-1609137144813-7d9921338f24?auto=format&fit=crop&w=400&q=75', icon: 'Flame', displayOrder: 1, isActive: true, itemCount: 0 },
      { id: 'sub-pooja-oil-wicks', name: 'Pooja Oil, Cotton Wicks & Kumkum', slug: 'pooja-oil-wicks-kumkum', parentId: 'cat-pooja-spiritual', description: 'Deepam lamp oils, thiri wicks & manjal', imageUrl: 'https://images.unsplash.com/photo-1609137144813-7d9921338f24?auto=format&fit=crop&w=400&q=75', icon: 'Sparkles', displayOrder: 2, isActive: true, itemCount: 0 },
    ]
  },

  // AC. Stationery & School Essentials
  {
    id: 'cat-stationery',
    name: 'Stationery & School Essentials',
    slug: 'stationery-school-essentials',
    parentId: null,
    description: 'School notebooks, ball pens, pencils, geometry sets, craft scissors, glue, and office paper.',
    imageUrl: 'https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?auto=format&fit=crop&w=600&q=80',
    icon: 'BookOpen',
    displayOrder: 29,
    isActive: true,
    itemCount: 0,
    featured: false,
    subcategories: [
      { id: 'sub-notebooks-pens', name: 'Notebooks, Pens & Pencils', slug: 'notebooks-pens-pencils', parentId: 'cat-stationery', description: 'Classmate notebooks and gel pens', imageUrl: 'https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?auto=format&fit=crop&w=400&q=75', icon: 'BookOpen', displayOrder: 1, isActive: true, itemCount: 0 },
      { id: 'sub-school-supplies', name: 'School & Craft Supplies', slug: 'school-craft-supplies', parentId: 'cat-stationery', description: 'Crayons, glue, geometry sets and rulers', imageUrl: 'https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?auto=format&fit=crop&w=400&q=75', icon: 'Scissors', displayOrder: 2, isActive: true, itemCount: 0 },
    ]
  },

  // AD. Pet Care
  {
    id: 'cat-pet-care',
    name: 'Pet Care',
    slug: 'pet-care',
    parentId: null,
    description: 'Nutritious dog and cat foods, pet treats, feeding bowls, grooming brushes, and pet hygiene.',
    imageUrl: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&w=600&q=80',
    icon: 'Heart',
    displayOrder: 30,
    isActive: true,
    itemCount: 0,
    featured: false,
    subcategories: [
      { id: 'sub-dog-cat-food', name: 'Dog & Cat Food', slug: 'dog-cat-food', parentId: 'cat-pet-care', description: 'Pedigree, Whiskas & dry kibble', imageUrl: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&w=400&q=75', icon: 'Heart', displayOrder: 1, isActive: true, itemCount: 0 },
      { id: 'sub-pet-treats-hygiene', name: 'Pet Treats & Hygiene', slug: 'pet-treats-hygiene', parentId: 'cat-pet-care', description: 'Chew sticks and pet grooming', imageUrl: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&w=400&q=75', icon: 'Sparkles', displayOrder: 2, isActive: true, itemCount: 0 },
    ]
  },

  // AE. Organic & Healthy Foods
  {
    id: 'cat-organic-healthy',
    name: 'Organic & Healthy Foods',
    slug: 'organic-healthy-foods',
    parentId: null,
    description: 'Certified organic unpolished pulses, cold-pressed virgin oils, natural jaggery, and healthy seeds.',
    imageUrl: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=600&q=80',
    icon: 'Leaf',
    displayOrder: 31,
    isActive: true,
    itemCount: 0,
    featured: false,
    subcategories: [
      { id: 'sub-organic-grains-pulses', name: 'Organic Grains & Pulses', slug: 'organic-grains-pulses', parentId: 'cat-organic-healthy', description: 'Certified chemical-free staples', imageUrl: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=400&q=75', icon: 'Leaf', displayOrder: 1, isActive: true, itemCount: 0 },
      { id: 'sub-healthy-seeds-mixes', name: 'Healthy Trail Mixes & Superfoods', slug: 'healthy-trail-mixes', parentId: 'cat-organic-healthy', description: 'Omega-rich roasted mixes', imageUrl: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=400&q=75', icon: 'Sun', displayOrder: 2, isActive: true, itemCount: 0 },
    ]
  },

  // AF. Seasonal & Special Collections
  {
    id: 'cat-seasonal-specials',
    name: 'Seasonal & Special Collections',
    slug: 'seasonal-special-collections',
    parentId: null,
    description: 'Festival essentials, Pongal specials, Diwali sweets hampers, and monthly family grocery saver packs.',
    imageUrl: 'https://images.unsplash.com/photo-1607082349566-187342175e2f?auto=format&fit=crop&w=600&q=80',
    icon: 'Sparkles',
    displayOrder: 32,
    isActive: true,
    itemCount: 0,
    featured: false,
    subcategories: [
      { id: 'sub-monthly-grocery-packs', name: 'Monthly Grocery Saver Packs', slug: 'monthly-grocery-packs', parentId: 'cat-seasonal-specials', description: 'Curated monthly family ration bundles', imageUrl: 'https://images.unsplash.com/photo-1607082349566-187342175e2f?auto=format&fit=crop&w=400&q=75', icon: 'Box', displayOrder: 1, isActive: true, itemCount: 0 },
      { id: 'sub-festival-specials', name: 'Festival & Pongal Specials', slug: 'festival-specials', parentId: 'cat-seasonal-specials', description: 'Sugarcane, jaggery, pooja samagri & sweet packs', imageUrl: 'https://images.unsplash.com/photo-1607082349566-187342175e2f?auto=format&fit=crop&w=400&q=75', icon: 'Sparkles', displayOrder: 2, isActive: true, itemCount: 0 },
    ]
  },
];
