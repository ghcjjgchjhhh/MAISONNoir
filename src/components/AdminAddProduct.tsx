import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { ProductVariant } from '../types';
import { 
  Shirt, 
  Upload, 
  X, 
  Check, 
  AlertCircle, 
  Sparkles, 
  DollarSign, 
  Tag, 
  Layers, 
  ArrowLeft, 
  Star, 
  ChevronLeft, 
  ChevronRight, 
  Plus, 
  Trash2, 
  Eye, 
  CheckCircle2, 
  HelpCircle,
  TrendingUp,
  Image as ImageIcon
} from 'lucide-react';

const STANDARD_SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
const PRESET_COLORS = [
  { name: 'Obsidian Black', hex: '#121212' },
  { name: 'Bone White', hex: '#f8f8f6' },
  { name: 'Crimson Red', hex: '#dc2626' },
  { name: 'Navy Blue', hex: '#1e3a8a' },
  { name: 'Forest Green', hex: '#166534' },
  { name: 'Charcoal Grey', hex: '#374151' },
  { name: 'Sand Camel', hex: '#c2a688' },
  { name: 'Emerald Green', hex: '#047857' }
];

const PRESET_IMAGE_GALLERY = [
  { label: 'Hoodie (Black)', url: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?q=80&w=800&auto=format&fit=crop' },
  { label: 'T-Shirt (White)', url: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=800&auto=format&fit=crop' },
  { label: 'Cargo Pants (Olive)', url: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?q=80&w=800&auto=format&fit=crop' },
  { label: 'Wool Coat (Charcoal)', url: 'https://images.unsplash.com/photo-1544441893-675973e31985?q=80&w=800&auto=format&fit=crop' },
  { label: 'Silk Dress (Emerald)', url: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?q=80&w=800&auto=format&fit=crop' },
  { label: 'Varsity Jacket (Navy)', url: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?q=80&w=800&auto=format&fit=crop' },
  { label: 'Minimalist Crew (Black)', url: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?q=80&w=800&auto=format&fit=crop' },
  { label: 'Denim Jacket (Indigo)', url: 'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?q=80&w=800&auto=format&fit=crop' }
];

export const AdminAddProduct: React.FC = () => {
  const { addProduct, setAdminActiveTab, storeSettings, showToast } = useApp();
  const currency = storeSettings.currencySymbol || '$';

  // Product Information State
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [brand, setBrand] = useState('UrbanWear Atelier');
  const [cat, setCat] = useState<'men' | 'women' | 'accessories' | 'unisex'>('men');
  const [subcategory, setSubcategory] = useState('Hoodies & Sweatshirts');
  const [sku, setSku] = useState('');
  const [tag, setTag] = useState('New Drop');
  const [gender, setGender] = useState<'men' | 'women' | 'unisex'>('men');
  const [status, setStatus] = useState<'published' | 'draft'>('published');
  const [isFeatured, setIsFeatured] = useState(false);

  // Images State
  const [images, setImages] = useState<string[]>([
    'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?q=80&w=800&auto=format&fit=crop'
  ]);
  const [imageUrlInput, setImageUrlInput] = useState('');
  const [dragActive, setDragActive] = useState(false);

  // Pricing State
  const [regularPrice, setRegularPrice] = useState<number | ''>(65);
  const [salePrice, setSalePrice] = useState<number | ''>(52);
  const [costPrice, setCostPrice] = useState<number | ''>(28);

  // Sizes & Colors State
  const [selectedSizes, setSelectedSizes] = useState<string[]>(['S', 'M', 'L', 'XL']);
  const [customSizeInput, setCustomSizeInput] = useState('');
  const [selectedColors, setSelectedColors] = useState<{ name: string; hex: string }[]>([
    { name: 'Obsidian Black', hex: '#121212' },
    { name: 'Bone White', hex: '#f8f8f6' }
  ]);
  const [customColorName, setCustomColorName] = useState('');
  const [customColorHex, setCustomColorHex] = useState('#4f46e5');

  // Variant Matrix State: Record<`${color}_${size}`, number>
  const [variantStocks, setVariantStocks] = useState<Record<string, number>>({
    'Obsidian Black_S': 10,
    'Obsidian Black_M': 10,
    'Obsidian Black_L': 4,
    'Obsidian Black_XL': 2,
    'Bone White_S': 8,
    'Bone White_M': 7,
    'Bone White_L': 3,
    'Bone White_XL': 1
  });

  // Inventory Threshold
  const [minStockThreshold, setMinStockThreshold] = useState<number>(5);

  // Form Validation & Success State
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Auto calculate discount percentage
  const discountCalculation = useMemo(() => {
    const reg = typeof regularPrice === 'number' ? regularPrice : 0;
    const sale = typeof salePrice === 'number' ? salePrice : 0;
    if (reg > 0 && sale > 0 && sale < reg) {
      const pct = Math.round(((reg - sale) / reg) * 100);
      const savings = reg - sale;
      return { percentage: pct, savings };
    }
    return null;
  }, [regularPrice, salePrice]);

  // Profit and margin calculations
  const profitCalculation = useMemo(() => {
    const effectivePrice = typeof salePrice === 'number' && salePrice > 0 ? salePrice : (typeof regularPrice === 'number' ? regularPrice : 0);
    const cost = typeof costPrice === 'number' ? costPrice : 0;
    if (effectivePrice > 0 && cost > 0) {
      const profit = effectivePrice - cost;
      const margin = Math.round((profit / effectivePrice) * 100);
      return { profit, margin };
    }
    return null;
  }, [regularPrice, salePrice, costPrice]);

  // Total stock across matrix
  const totalStock = useMemo(() => {
    let sum = 0;
    selectedColors.forEach(c => {
      selectedSizes.forEach(s => {
        const key = `${c.name}_${s}`;
        sum += (variantStocks[key] || 0);
      });
    });
    return sum;
  }, [selectedColors, selectedSizes, variantStocks]);

  // Image manipulation helpers
  const handleAddImageUrl = (urlToAdd?: string) => {
    const target = urlToAdd || imageUrlInput.trim();
    if (!target) return;
    if (images.includes(target)) {
      showToast('Image already added to gallery', 'info');
      return;
    }
    setImages(prev => [...prev, target]);
    if (!urlToAdd) setImageUrlInput('');
  };

  const handleRemoveImage = (index: number) => {
    if (images.length <= 1) {
      showToast('A product requires at least one image', 'error');
      return;
    }
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSetMainImage = (index: number) => {
    if (index === 0) return;
    setImages(prev => {
      const item = prev[index];
      const remaining = prev.filter((_, i) => i !== index);
      return [item, ...remaining];
    });
    showToast('Cover image updated');
  };

  const handleMoveImage = (index: number, direction: 'left' | 'right') => {
    const targetIndex = direction === 'left' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= images.length) return;
    setImages(prev => {
      const copy = [...prev];
      const temp = copy[index];
      copy[index] = copy[targetIndex];
      copy[targetIndex] = temp;
      return copy;
    });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    // Simulate image read to dataURL or local objectURL
    Array.from(files).forEach((file: File) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setImages(prev => [...prev, event.target!.result as string]);
        }
      };
      reader.readAsDataURL(file);
    });
    showToast(`${files.length} image(s) uploaded.`);
  };

  // Size helpers
  const toggleSize = (sz: string) => {
    if (selectedSizes.includes(sz)) {
      if (selectedSizes.length <= 1) {
        showToast('At least one size is required', 'error');
        return;
      }
      setSelectedSizes(prev => prev.filter(s => s !== sz));
    } else {
      setSelectedSizes(prev => [...prev, sz]);
    }
  };

  const addCustomSize = () => {
    const clean = customSizeInput.trim().toUpperCase();
    if (!clean) return;
    if (!selectedSizes.includes(clean)) {
      setSelectedSizes(prev => [...prev, clean]);
    }
    setCustomSizeInput('');
  };

  // Color helpers
  const togglePresetColor = (colorObj: { name: string; hex: string }) => {
    const exists = selectedColors.some(c => c.name === colorObj.name);
    if (exists) {
      if (selectedColors.length <= 1) {
        showToast('At least one color is required', 'error');
        return;
      }
      setSelectedColors(prev => prev.filter(c => c.name !== colorObj.name));
    } else {
      setSelectedColors(prev => [...prev, colorObj]);
    }
  };

  const addCustomColor = () => {
    const cleanName = customColorName.trim();
    if (!cleanName) return;
    if (selectedColors.some(c => c.name.toLowerCase() === cleanName.toLowerCase())) {
      showToast('Color already exists', 'info');
      return;
    }
    setSelectedColors(prev => [...prev, { name: cleanName, hex: customColorHex }]);
    setCustomColorName('');
  };

  const removeColor = (colorName: string) => {
    if (selectedColors.length <= 1) {
      showToast('At least one color is required', 'error');
      return;
    }
    setSelectedColors(prev => prev.filter(c => c.name !== colorName));
  };

  const updateVariantStock = (colorName: string, sizeName: string, stockVal: number) => {
    const key = `${colorName}_${sizeName}`;
    setVariantStocks(prev => ({
      ...prev,
      [key]: Math.max(0, stockVal)
    }));
  };

  const autoGenerateSku = () => {
    const prefix = (brand || 'UW').split(' ').map(w => w[0]).join('').toUpperCase().substring(0, 3);
    const catCode = (cat || 'MEN').substring(0, 2).toUpperCase();
    const rand = Math.floor(100 + Math.random() * 900);
    const generated = `${prefix}-${catCode}-${rand}`;
    setSku(generated);
    showToast(`SKU generated: ${generated}`);
  };

  // Validation
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!name.trim()) newErrors.name = 'Product name is required';
    if (!brand.trim()) newErrors.brand = 'Brand name is required';
    if (typeof regularPrice !== 'number' || regularPrice <= 0) newErrors.regularPrice = 'Valid regular price is required';
    if (images.length === 0) newErrors.images = 'At least one product image is required';
    if (selectedSizes.length === 0) newErrors.sizes = 'At least one size is required';
    if (selectedColors.length === 0) newErrors.colors = 'At least one color is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePublish = (targetStatus: 'published' | 'draft') => {
    if (!validateForm()) {
      showToast('Please complete all required fields', 'error');
      return;
    }

    // Build variants matrix
    const generatedVariants: ProductVariant[] = [];
    const baseSku = sku || `UW-${Math.floor(100 + Math.random() * 900)}`;

    selectedColors.forEach(c => {
      selectedSizes.forEach(s => {
        const key = `${c.name}_${s}`;
        const stockQty = variantStocks[key] !== undefined ? variantStocks[key] : 10;
        const colorAbbr = c.name.substring(0, 3).toUpperCase();
        generatedVariants.push({
          id: `var-${Date.now()}-${colorAbbr}-${s}`,
          size: s,
          color: c.name,
          sku: `${baseSku}-${colorAbbr}-${s}`,
          stock: stockQty,
          price: typeof salePrice === 'number' && salePrice > 0 ? salePrice : (regularPrice as number)
        });
      });
    });

    const newProductData = {
      name: name.trim(),
      price: regularPrice as number,
      discountPrice: typeof salePrice === 'number' && salePrice > 0 ? salePrice : undefined,
      costPrice: typeof costPrice === 'number' && costPrice > 0 ? costPrice : undefined,
      cat: cat,
      brand: brand.trim(),
      subcategory: subcategory,
      sku: baseSku,
      tag: tag.trim() || undefined,
      gender: gender,
      img: images[0],
      additionalImages: images.slice(1),
      stock: totalStock,
      description: description.trim() || 'Premium clothing tailored with precision and contemporary streetwear styling.',
      sizes: selectedSizes,
      colors: selectedColors.map(c => c.name),
      material: '100% Premium Cotton',
      variants: generatedVariants,
      status: targetStatus,
      isFeatured: isFeatured,
      minStockThreshold: minStockThreshold,
      createdAt: new Date().toISOString().split('T')[0]
    };

    addProduct(newProductData);
    setSuccessMessage(`✓ Product "${name}" successfully ${targetStatus === 'published' ? 'published' : 'saved as draft'}.`);
    showToast(`✓ Product successfully ${targetStatus === 'published' ? 'published' : 'saved as draft'}.`, 'success');

    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="space-y-8 pb-20 max-w-6xl mx-auto">
      {/* Top Header & Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-200 dark:border-neutral-800 pb-5">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setAdminActiveTab('products')}
            className="p-2 text-neutral-500 hover:text-neutral-900 dark:hover:text-white rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-850 transition-colors"
            title="Back to Catalog"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-black tracking-tight text-neutral-900 dark:text-white">
                Add New Product
              </h1>
              <span className="px-2.5 py-0.5 text-[10px] font-bold uppercase rounded-full bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800">
                Catalog Studio
              </span>
            </div>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
              Configure product details, multi-image gallery, dynamic pricing, and size × color inventory matrix.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => handlePublish('draft')}
            className="px-4 py-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-xs font-bold text-neutral-700 dark:text-neutral-300 transition-colors"
          >
            Save Draft
          </button>
          <button
            type="button"
            onClick={() => handlePublish('published')}
            className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-lg shadow-indigo-600/25 transition-all transform active:scale-95"
          >
            <Sparkles className="w-4 h-4" />
            <span>Publish Product</span>
          </button>
        </div>
      </div>

      {/* Success Notification Banner */}
      {successMessage && (
        <div className="p-4 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 rounded-2xl flex items-center justify-between animate-fadeIn">
          <div className="flex items-center gap-3 text-emerald-800 dark:text-emerald-200 text-xs font-semibold">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>{successMessage}</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setAdminActiveTab('products')}
              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold"
            >
              View in Catalog
            </button>
            <button
              onClick={() => {
                setSuccessMessage(null);
                setName('');
                setDescription('');
                setImages(['https://images.unsplash.com/photo-1556905055-8f358a7a47b2?q=80&w=800&auto=format&fit=crop']);
              }}
              className="px-3 py-1.5 bg-white dark:bg-neutral-800 border border-emerald-300 dark:border-emerald-700 text-neutral-800 dark:text-neutral-200 rounded-lg text-xs font-bold"
            >
              Add Another
            </button>
          </div>
        </div>
      )}

      {/* Main Grid: Left 2 Cols (Form) & Right 1 Col (Summary/Live Preview) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Section 1: Product Information */}
          <div className="bg-white dark:bg-[#111111] border border-neutral-200 dark:border-neutral-800/80 rounded-2xl p-6 shadow-sm space-y-5">
            <div className="flex items-center justify-between border-b border-neutral-100 dark:border-neutral-800 pb-3">
              <h2 className="text-sm font-bold text-neutral-900 dark:text-neutral-100 flex items-center gap-2 uppercase tracking-wider">
                <Shirt className="w-4 h-4 text-indigo-600" />
                <span>1. Product Information</span>
              </h2>
              <span className="text-[11px] text-neutral-400">Core details & categorization</span>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 mb-1.5">
                  Product Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Heavyweight Boxy Graphic Hoodie"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (errors.name) setErrors(prev => ({ ...prev, name: '' }));
                  }}
                  className={`w-full px-4 py-2.5 rounded-xl border text-sm font-medium bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-white transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500/20 ${
                    errors.name ? 'border-rose-500 ring-1 ring-rose-500/30' : 'border-neutral-200 dark:border-neutral-750'
                  }`}
                />
                {errors.name && <p className="text-[11px] text-rose-500 font-semibold mt-1">{errors.name}</p>}
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 mb-1.5">
                  Product Description
                </label>
                <textarea
                  rows={3}
                  placeholder="Describe material composition, drape, fit, silhouette, craftsmanship..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-750 text-xs font-medium bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 mb-1.5">
                    Brand Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={brand}
                    onChange={(e) => setBrand(e.target.value)}
                    placeholder="e.g. UrbanWear Atelier"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-750 text-xs font-medium bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 mb-1.5">
                    Gender Segment
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {(['men', 'women', 'unisex'] as const).map(g => (
                      <button
                        key={g}
                        type="button"
                        onClick={() => setGender(g)}
                        className={`py-2 px-3 text-xs font-bold rounded-xl border capitalize transition-all ${
                          gender === g
                            ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                            : 'bg-neutral-50 dark:bg-neutral-900 border-neutral-200 dark:border-neutral-750 text-neutral-600 dark:text-neutral-400'
                        }`}
                      >
                        {g}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 mb-1.5">
                    Main Category
                  </label>
                  <select
                    value={cat}
                    onChange={(e) => setCat(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-750 text-xs font-medium bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  >
                    <option value="men">Men's Apparel</option>
                    <option value="women">Women's Collection</option>
                    <option value="unisex">Unisex / Streetwear</option>
                    <option value="accessories">Accessories & Goods</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 mb-1.5">
                    Subcategory
                  </label>
                  <input
                    type="text"
                    value={subcategory}
                    onChange={(e) => setSubcategory(e.target.value)}
                    placeholder="e.g. Hoodies, T-Shirts, Outerwear, Pants"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-750 text-xs font-medium bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-bold text-neutral-700 dark:text-neutral-300">
                      Master SKU
                    </label>
                    <button
                      type="button"
                      onClick={autoGenerateSku}
                      className="text-[11px] font-bold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400"
                    >
                      ⚡ Auto Generate
                    </button>
                  </div>
                  <input
                    type="text"
                    value={sku}
                    onChange={(e) => setSku(e.target.value.toUpperCase())}
                    placeholder="e.g. UW-HD-001"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-750 text-xs font-mono font-medium bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-white uppercase focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 mb-1.5">
                    Product Badge / Tag
                  </label>
                  <input
                    type="text"
                    value={tag}
                    onChange={(e) => setTag(e.target.value)}
                    placeholder="e.g. New Drop, Best Seller, Limited"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-750 text-xs font-medium bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  />
                </div>
              </div>

              {/* Status & Featured Toggle */}
              <div className="pt-2 border-t border-neutral-100 dark:border-neutral-800 flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold text-neutral-700 dark:text-neutral-300">Product Status:</span>
                  <div className="flex items-center rounded-xl bg-neutral-100 dark:bg-neutral-850 p-1 border border-neutral-200 dark:border-neutral-750">
                    <button
                      type="button"
                      onClick={() => setStatus('draft')}
                      className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
                        status === 'draft' ? 'bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white shadow-sm' : 'text-neutral-500'
                      }`}
                    >
                      Draft
                    </button>
                    <button
                      type="button"
                      onClick={() => setStatus('published')}
                      className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
                        status === 'published' ? 'bg-indigo-600 text-white shadow-sm' : 'text-neutral-500'
                      }`}
                    >
                      Published
                    </button>
                  </div>
                </div>

                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={isFeatured}
                    onChange={(e) => setIsFeatured(e.target.checked)}
                    className="w-4 h-4 text-indigo-600 rounded border-neutral-300 focus:ring-indigo-500"
                  />
                  <span className="text-xs font-bold text-neutral-800 dark:text-neutral-200 flex items-center gap-1.5">
                    <Star className={`w-3.5 h-3.5 ${isFeatured ? 'text-amber-500 fill-amber-500' : 'text-neutral-400'}`} />
                    Mark as Featured Product
                  </span>
                </label>
              </div>
            </div>
          </div>

          {/* Section 2: Product Images */}
          <div className="bg-white dark:bg-[#111111] border border-neutral-200 dark:border-neutral-800/80 rounded-2xl p-6 shadow-sm space-y-5">
            <div className="flex items-center justify-between border-b border-neutral-100 dark:border-neutral-800 pb-3">
              <h2 className="text-sm font-bold text-neutral-900 dark:text-neutral-100 flex items-center gap-2 uppercase tracking-wider">
                <ImageIcon className="w-4 h-4 text-indigo-600" />
                <span>2. Product Images & Gallery</span>
              </h2>
              <span className="text-[11px] text-neutral-400">{images.length} Image(s) Attached</span>
            </div>

            {/* Image Preview Grid with Reorder and Set Main */}
            <div className="space-y-3">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {images.map((imgUrl, index) => {
                  const isMain = index === 0;
                  return (
                    <div
                      key={index}
                      className={`group relative rounded-xl overflow-hidden border transition-all ${
                        isMain
                          ? 'border-indigo-600 ring-2 ring-indigo-500/30'
                          : 'border-neutral-200 dark:border-neutral-800'
                      } bg-neutral-100 dark:bg-neutral-900 aspect-[3/4] flex flex-col`}
                    >
                      <img
                        src={imgUrl}
                        alt={`Product ${index + 1}`}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />

                      {/* Main Badge */}
                      {isMain && (
                        <div className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-indigo-600 text-white text-[10px] font-bold shadow-md flex items-center gap-1">
                          <Star className="w-2.5 h-2.5 fill-current" /> Cover
                        </div>
                      )}

                      {/* Action Bar Overlay */}
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-2">
                        <div className="flex justify-end gap-1">
                          <button
                            type="button"
                            onClick={() => handleRemoveImage(index)}
                            className="p-1 rounded-lg bg-rose-600 text-white hover:bg-rose-700 shadow"
                            title="Remove image"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <div className="flex items-center justify-between gap-1">
                          <div className="flex items-center gap-1">
                            {index > 0 && (
                              <button
                                type="button"
                                onClick={() => handleMoveImage(index, 'left')}
                                className="p-1 rounded-md bg-white/90 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 hover:bg-white"
                                title="Move backward"
                              >
                                <ChevronLeft className="w-3 h-3" />
                              </button>
                            )}
                            {index < images.length - 1 && (
                              <button
                                type="button"
                                onClick={() => handleMoveImage(index, 'right')}
                                className="p-1 rounded-md bg-white/90 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 hover:bg-white"
                                title="Move forward"
                              >
                                <ChevronRight className="w-3 h-3" />
                              </button>
                            )}
                          </div>

                          {!isMain && (
                            <button
                              type="button"
                              onClick={() => handleSetMainImage(index)}
                              className="px-2 py-1 rounded-md bg-indigo-600 text-white text-[10px] font-bold hover:bg-indigo-700"
                            >
                              Set Cover
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Upload or Add by URL */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                {/* Drag and Drop / File Picker */}
                <label
                  onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
                  onDragLeave={() => setDragActive(false)}
                  onDrop={(e) => {
                    e.preventDefault();
                    setDragActive(false);
                    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
                      Array.from(e.dataTransfer.files).forEach((file: File) => {
                        const reader = new FileReader();
                        reader.onload = (ev) => {
                          if (ev.target?.result) setImages(prev => [...prev, ev.target!.result as string]);
                        };
                        reader.readAsDataURL(file);
                      });
                    }
                  }}
                  className={`border-2 border-dashed rounded-xl p-4 flex flex-col items-center justify-center cursor-pointer transition-colors ${
                    dragActive
                      ? 'border-indigo-500 bg-indigo-50/50 dark:bg-indigo-950/20'
                      : 'border-neutral-300 dark:border-neutral-750 hover:bg-neutral-50 dark:hover:bg-neutral-850'
                  }`}
                >
                  <Upload className="w-5 h-5 text-neutral-400 mb-1" />
                  <span className="text-xs font-bold text-neutral-700 dark:text-neutral-200">
                    Upload from Device
                  </span>
                  <span className="text-[10px] text-neutral-400">
                    Drag & drop or click (PNG, JPG, WebP)
                  </span>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>

                {/* Add Image URL */}
                <div className="flex flex-col justify-center space-y-2 border border-neutral-200 dark:border-neutral-750 rounded-xl p-3 bg-neutral-50 dark:bg-neutral-900">
                  <label className="text-xs font-bold text-neutral-700 dark:text-neutral-300">
                    Add Image via Web Link
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="url"
                      placeholder="https://images.unsplash.com/..."
                      value={imageUrlInput}
                      onChange={(e) => setImageUrlInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddImageUrl();
                        }
                      }}
                      className="flex-1 px-3 py-1.5 rounded-lg border border-neutral-300 dark:border-neutral-700 text-xs bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => handleAddImageUrl()}
                      className="px-3 py-1.5 bg-neutral-900 hover:bg-neutral-800 dark:bg-white dark:hover:bg-neutral-200 text-white dark:text-neutral-900 rounded-lg text-xs font-bold shrink-0"
                    >
                      Add
                    </button>
                  </div>
                </div>
              </div>

              {/* Fast Preset Image Picker for Clothing */}
              <div className="pt-2">
                <span className="text-[11px] font-bold text-neutral-500 uppercase tracking-wider block mb-2">
                  Instant Fashion Presets (1-Click Add):
                </span>
                <div className="flex flex-wrap gap-2">
                  {PRESET_IMAGE_GALLERY.map((p, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleAddImageUrl(p.url)}
                      className="px-2.5 py-1 rounded-lg text-[11px] font-medium border border-neutral-200 dark:border-neutral-750 bg-white dark:bg-neutral-850 hover:border-indigo-500 hover:text-indigo-600 transition-colors"
                    >
                      + {p.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: Pricing & Cost Analysis */}
          <div className="bg-white dark:bg-[#111111] border border-neutral-200 dark:border-neutral-800/80 rounded-2xl p-6 shadow-sm space-y-5">
            <div className="flex items-center justify-between border-b border-neutral-100 dark:border-neutral-800 pb-3">
              <h2 className="text-sm font-bold text-neutral-900 dark:text-neutral-100 flex items-center gap-2 uppercase tracking-wider">
                <DollarSign className="w-4 h-4 text-emerald-600" />
                <span>3. Pricing & Profit Margin</span>
              </h2>
              <span className="text-[11px] text-neutral-400">Currency: {currency} ({storeSettings.currency})</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 mb-1.5">
                  Regular Price ({currency}) <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-2.5 text-neutral-400 text-xs font-bold">
                    {currency}
                  </span>
                  <input
                    type="number"
                    min="1"
                    step="0.01"
                    value={regularPrice}
                    onChange={(e) => {
                      const v = e.target.value === '' ? '' : Number(e.target.value);
                      setRegularPrice(v);
                      if (errors.regularPrice) setErrors(prev => ({ ...prev, regularPrice: '' }));
                    }}
                    placeholder="e.g. 50000"
                    className="w-full pl-8 pr-3.5 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-750 text-sm font-bold bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  />
                </div>
                {errors.regularPrice && <p className="text-[11px] text-rose-500 font-semibold mt-1">{errors.regularPrice}</p>}
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 mb-1.5">
                  Sale / Discount Price ({currency})
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-2.5 text-neutral-400 text-xs font-bold">
                    {currency}
                  </span>
                  <input
                    type="number"
                    min="1"
                    step="0.01"
                    value={salePrice}
                    onChange={(e) => {
                      const v = e.target.value === '' ? '' : Number(e.target.value);
                      setSalePrice(v);
                    }}
                    placeholder="e.g. 40000"
                    className="w-full pl-8 pr-3.5 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-750 text-sm font-bold bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  />
                </div>
                <span className="text-[10px] text-neutral-400 block mt-1">Leave blank if not on sale</span>
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 mb-1.5">
                  Cost Price ({currency}) <span className="text-neutral-400 font-normal">(Internal)</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-2.5 text-neutral-400 text-xs font-bold">
                    {currency}
                  </span>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={costPrice}
                    onChange={(e) => {
                      const v = e.target.value === '' ? '' : Number(e.target.value);
                      setCostPrice(v);
                    }}
                    placeholder="e.g. 25000"
                    className="w-full pl-8 pr-3.5 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-750 text-sm font-bold bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  />
                </div>
                <span className="text-[10px] text-neutral-400 block mt-1">For profit margin calculation</span>
              </div>
            </div>

            {/* Real-time Calculation Badges (Discount % and Profit Margin) */}
            <div className="p-4 rounded-xl bg-neutral-50 dark:bg-neutral-850 border border-neutral-200 dark:border-neutral-800 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-600 flex items-center justify-center font-bold text-xs">
                  %
                </div>
                <div>
                  <span className="text-[11px] text-neutral-400 font-semibold block">Automatic Discount:</span>
                  {discountCalculation ? (
                    <span className="text-sm font-black text-emerald-600 dark:text-emerald-400">
                      {discountCalculation.percentage}% OFF{' '}
                      <span className="text-xs font-medium text-neutral-500">
                        (Customer saves {currency}{discountCalculation.savings.toLocaleString()})
                      </span>
                    </span>
                  ) : (
                    <span className="text-xs font-medium text-neutral-400">No discount applied</span>
                  )}
                </div>
              </div>

              {profitCalculation && (
                <div className="flex items-center gap-3 border-l border-neutral-200 dark:border-neutral-750 pl-4">
                  <div className="w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-600 flex items-center justify-center font-bold text-xs">
                    <TrendingUp className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[11px] text-neutral-400 font-semibold block">Estimated Profit Margin:</span>
                    <span className="text-sm font-black text-indigo-600 dark:text-indigo-400">
                      {profitCalculation.margin}% Margin{' '}
                      <span className="text-xs font-medium text-neutral-500">
                        ({currency}{profitCalculation.profit.toLocaleString()} net per unit)
                      </span>
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Section 4: Sizes, Colors & Separate Variant Inventory Matrix */}
          <div className="bg-white dark:bg-[#111111] border border-neutral-200 dark:border-neutral-800/80 rounded-2xl p-6 shadow-sm space-y-6">
            <div className="flex items-center justify-between border-b border-neutral-100 dark:border-neutral-800 pb-3">
              <h2 className="text-sm font-bold text-neutral-900 dark:text-neutral-100 flex items-center gap-2 uppercase tracking-wider">
                <Layers className="w-4 h-4 text-indigo-600" />
                <span>4. Sizes & Colors Matrix</span>
              </h2>
              <span className="text-[11px] font-bold text-neutral-600 dark:text-neutral-300">
                Total Units: <span className="text-indigo-600 dark:text-indigo-400 font-black">{totalStock}</span>
              </span>
            </div>

            {/* Size Selector */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300">
                Select Sizes <span className="text-rose-500">*</span>
              </label>
              <div className="flex flex-wrap items-center gap-2">
                {STANDARD_SIZES.map(sz => {
                  const active = selectedSizes.includes(sz);
                  return (
                    <button
                      key={sz}
                      type="button"
                      onClick={() => toggleSize(sz)}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                        active
                          ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 border-neutral-900 dark:border-white shadow-sm'
                          : 'bg-neutral-50 dark:bg-neutral-900 text-neutral-600 dark:text-neutral-400 border-neutral-200 dark:border-neutral-750'
                      }`}
                    >
                      {sz}
                    </button>
                  );
                })}

                {/* Custom Sizes Added */}
                {selectedSizes
                  .filter(s => !STANDARD_SIZES.includes(s))
                  .map(customSz => (
                    <button
                      key={customSz}
                      type="button"
                      onClick={() => toggleSize(customSz)}
                      className="px-3 py-1.5 rounded-xl text-xs font-bold bg-indigo-600 text-white border border-indigo-600 flex items-center gap-1.5"
                    >
                      <span>{customSz}</span>
                      <X className="w-3 h-3" />
                    </button>
                  ))}

                {/* Add Custom Size Input */}
                <div className="flex items-center gap-1.5">
                  <input
                    type="text"
                    placeholder="Custom (e.g. 34)"
                    value={customSizeInput}
                    onChange={(e) => setCustomSizeInput(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addCustomSize(); } }}
                    className="w-28 px-3 py-1.5 rounded-xl border border-neutral-300 dark:border-neutral-700 text-xs bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-white"
                  />
                  <button
                    type="button"
                    onClick={addCustomSize}
                    className="p-1.5 bg-neutral-200 dark:bg-neutral-800 rounded-lg text-neutral-700 dark:text-neutral-300 hover:bg-neutral-300"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Color Selector */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300">
                Select Colors <span className="text-rose-500">*</span>
              </label>
              <div className="flex flex-wrap items-center gap-2">
                {PRESET_COLORS.map(c => {
                  const active = selectedColors.some(sc => sc.name === c.name);
                  return (
                    <button
                      key={c.name}
                      type="button"
                      onClick={() => togglePresetColor(c)}
                      className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                        active
                          ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-900 dark:text-indigo-200 shadow-sm'
                          : 'border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 text-neutral-600 dark:text-neutral-400'
                      }`}
                    >
                      <span
                        className="w-3.5 h-3.5 rounded-full border border-black/10 shrink-0"
                        style={{ backgroundColor: c.hex }}
                      />
                      <span>{c.name}</span>
                    </button>
                  );
                })}
              </div>

              {/* Add Custom Color */}
              <div className="flex items-center gap-2 pt-1">
                <input
                  type="color"
                  value={customColorHex}
                  onChange={(e) => setCustomColorHex(e.target.value)}
                  className="w-8 h-8 rounded-lg cursor-pointer border-0 bg-transparent"
                />
                <input
                  type="text"
                  placeholder="Add custom color name (e.g. Sage Mint)"
                  value={customColorName}
                  onChange={(e) => setCustomColorName(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addCustomColor(); } }}
                  className="px-3 py-1.5 rounded-xl border border-neutral-300 dark:border-neutral-700 text-xs bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-white"
                />
                <button
                  type="button"
                  onClick={addCustomColor}
                  className="px-3 py-1.5 bg-neutral-800 text-white dark:bg-neutral-200 dark:text-neutral-900 rounded-xl text-xs font-bold"
                >
                  + Add Color
                </button>
              </div>
            </div>

            {/* Separate Inventory Table for Each Color / Size Combination */}
            <div className="pt-3">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-xs font-bold text-neutral-900 dark:text-neutral-100 uppercase tracking-wider">
                  Color × Size Inventory Matrix
                </h3>
                <span className="text-[11px] text-neutral-400">
                  Configure specific stock per variant
                </span>
              </div>

              <div className="border border-neutral-200 dark:border-neutral-800 rounded-xl overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-neutral-50 dark:bg-neutral-850 text-neutral-500 font-bold border-b border-neutral-200 dark:border-neutral-800">
                    <tr>
                      <th className="px-4 py-2.5">Variant</th>
                      <th className="px-4 py-2.5">Color Swatch</th>
                      <th className="px-4 py-2.5">Size</th>
                      <th className="px-4 py-2.5">Stock Available</th>
                      <th className="px-4 py-2.5">Status Alert</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-100 dark:divide-neutral-850 font-medium">
                    {selectedColors.flatMap(c =>
                      selectedSizes.map(s => {
                        const key = `${c.name}_${s}`;
                        const currentStock = variantStocks[key] !== undefined ? variantStocks[key] : 10;
                        const isLow = currentStock > 0 && currentStock <= minStockThreshold;
                        const isOut = currentStock === 0;

                        return (
                          <tr key={key} className="hover:bg-neutral-50/60 dark:hover:bg-neutral-850/40">
                            <td className="px-4 py-2.5 font-bold text-neutral-900 dark:text-white">
                              {c.name} / {s}
                            </td>
                            <td className="px-4 py-2.5">
                              <div className="flex items-center gap-2">
                                <span
                                  className="w-3.5 h-3.5 rounded-full border border-black/10"
                                  style={{ backgroundColor: c.hex }}
                                />
                                <span className="text-neutral-500 text-[11px]">{c.name}</span>
                              </div>
                            </td>
                            <td className="px-4 py-2.5 font-bold text-neutral-700 dark:text-neutral-300">
                              {s}
                            </td>
                            <td className="px-4 py-2.5">
                              <input
                                type="number"
                                min="0"
                                value={currentStock}
                                onChange={(e) => updateVariantStock(c.name, s, Number(e.target.value))}
                                className="w-20 px-2.5 py-1 rounded-lg border border-neutral-300 dark:border-neutral-700 text-xs font-bold text-neutral-900 dark:text-white bg-white dark:bg-neutral-900"
                              />
                            </td>
                            <td className="px-4 py-2.5">
                              {isOut ? (
                                <span className="px-2 py-0.5 rounded-md bg-rose-50 dark:bg-rose-950/40 text-rose-600 font-bold text-[10px]">
                                  🔴 Out of Stock
                                </span>
                              ) : isLow ? (
                                <span className="px-2 py-0.5 rounded-md bg-amber-50 dark:bg-amber-950/40 text-amber-600 font-bold text-[10px]">
                                  🟠 Low Stock ({currentStock})
                                </span>
                              ) : (
                                <span className="px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 font-bold text-[10px]">
                                  🟢 Healthy ({currentStock})
                                </span>
                              )}
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Threshold warning config */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/40 text-xs">
              <div className="flex items-center gap-2 text-amber-900 dark:text-amber-200 font-medium">
                <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                <span>Trigger automatic low-stock warning when stock drops to or below:</span>
              </div>
              <div className="flex items-center gap-1.5 font-bold">
                <input
                  type="number"
                  min="1"
                  max="50"
                  value={minStockThreshold}
                  onChange={(e) => setMinStockThreshold(Number(e.target.value))}
                  className="w-14 px-2 py-1 rounded-lg border border-amber-300 dark:border-amber-800 text-center text-xs font-bold bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white"
                />
                <span className="text-amber-900 dark:text-amber-200">units</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Live Storefront Card Preview & Final Actions */}
        <div className="space-y-6">
          {/* Card Preview */}
          <div className="bg-white dark:bg-[#111111] border border-neutral-200 dark:border-neutral-800/80 rounded-2xl p-5 shadow-sm space-y-4 sticky top-6">
            <div className="flex items-center justify-between border-b border-neutral-100 dark:border-neutral-800 pb-2.5">
              <span className="text-xs font-bold text-neutral-900 dark:text-neutral-100 uppercase tracking-wider flex items-center gap-1.5">
                <Eye className="w-4 h-4 text-indigo-600" />
                <span>Live Store Preview</span>
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400">
                {status === 'published' ? '🟢 Published' : '⚪ Draft'}
              </span>
            </div>

            {/* The Clothing Card as seen by customer */}
            <div className="rounded-xl overflow-hidden border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/60 transition-all hover:shadow-md">
              <div className="relative aspect-[3/4] bg-neutral-200 dark:bg-neutral-800 overflow-hidden">
                {images[0] ? (
                  <img
                    src={images[0]}
                    alt="Preview"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-neutral-400 text-xs">
                    No image uploaded
                  </div>
                )}

                {/* Badge */}
                {tag && (
                  <span className="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-full bg-neutral-900/80 backdrop-blur-md text-white text-[10px] font-bold uppercase tracking-wider">
                    {tag}
                  </span>
                )}

                {/* Discount Tag */}
                {discountCalculation && (
                  <span className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-full bg-rose-600 text-white text-[10px] font-black shadow">
                    -{discountCalculation.percentage}%
                  </span>
                )}
              </div>

              <div className="p-4 space-y-2">
                <div className="text-[10px] font-bold uppercase text-neutral-400 tracking-wider">
                  {brand || 'Brand Name'}
                </div>
                <h4 className="text-sm font-bold text-neutral-900 dark:text-white line-clamp-1">
                  {name || 'Untiled Apparel Piece'}
                </h4>

                <div className="flex items-baseline gap-2">
                  <span className="text-sm font-black text-neutral-900 dark:text-white">
                    {currency}{typeof salePrice === 'number' && salePrice > 0 ? salePrice.toLocaleString() : (typeof regularPrice === 'number' ? regularPrice.toLocaleString() : '0')}
                  </span>
                  {typeof salePrice === 'number' && salePrice > 0 && typeof regularPrice === 'number' && (
                    <span className="text-xs text-neutral-400 line-through">
                      {currency}{regularPrice.toLocaleString()}
                    </span>
                  )}
                </div>

                {/* Sizes and Color Chips */}
                <div className="pt-2 border-t border-neutral-200/60 dark:border-neutral-800 flex items-center justify-between text-[11px] text-neutral-500">
                  <div className="flex items-center gap-1 font-bold">
                    <span>Sizes:</span>
                    <span className="text-neutral-700 dark:text-neutral-300">
                      {selectedSizes.slice(0, 4).join(', ')}{selectedSizes.length > 4 ? '...' : ''}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    {selectedColors.slice(0, 3).map(c => (
                      <span
                        key={c.name}
                        className="w-2.5 h-2.5 rounded-full border border-black/20"
                        style={{ backgroundColor: c.hex }}
                        title={c.name}
                      />
                    ))}
                    {selectedColors.length > 3 && (
                      <span className="text-[9px] font-bold">+{selectedColors.length - 3}</span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Publishing Controls */}
            <div className="pt-2 space-y-2">
              <button
                type="button"
                onClick={() => handlePublish('published')}
                className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-md shadow-indigo-600/20 transition-all flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                <span>Publish to Storefront</span>
              </button>
              <button
                type="button"
                onClick={() => handlePublish('draft')}
                className="w-full py-2.5 bg-neutral-100 dark:bg-neutral-850 hover:bg-neutral-200 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300 rounded-xl text-xs font-bold transition-colors"
              >
                Save as Draft
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
