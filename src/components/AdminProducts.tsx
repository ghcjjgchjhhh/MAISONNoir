import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Product, ProductVariant } from '../types';
import { 
  Plus, 
  Search, 
  Filter, 
  Edit, 
  Copy, 
  Trash2, 
  Star, 
  Eye, 
  EyeOff, 
  PackagePlus, 
  X, 
  Sparkles, 
  Check, 
  Image as ImageIcon,
  ArrowUpDown,
  Tag,
  Boxes
} from 'lucide-react';

export const AdminProducts: React.FC = () => {
  const { 
    products, 
    addProduct, 
    updateProduct, 
    deleteProduct, 
    duplicateProduct, 
    togglePublishProduct, 
    toggleFeaturedProduct, 
    openRestockModal,
    storeSettings,
    adminSearchQuery,
    setAdminActiveTab
  } = useApp();

  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [stockFilter, setStockFilter] = useState<string>('all');
  const [localSearch, setLocalSearch] = useState<string>('');
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Form State
  const [formName, setFormName] = useState('');
  const [formBrand, setFormBrand] = useState('UrbanWear Atelier');
  const [formCat, setFormCat] = useState<'men' | 'women' | 'accessories' | 'unisex'>('men');
  const [formPrice, setFormPrice] = useState<number>(50);
  const [formDiscountPrice, setFormDiscountPrice] = useState<number | undefined>(undefined);
  const [formSku, setFormSku] = useState('');
  const [formTag, setFormTag] = useState('');
  const [formImg, setFormImg] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formMaterial, setFormMaterial] = useState('');
  const [formWeight, setFormWeight] = useState('');
  const [formMinThreshold, setFormMinThreshold] = useState<number>(5);
  const [formStatus, setFormStatus] = useState<'published' | 'draft'>('published');
  const [formIsFeatured, setFormIsFeatured] = useState<boolean>(false);
  
  // Variants Matrix
  const [formVariants, setFormVariants] = useState<ProductVariant[]>([]);

  const threshold = storeSettings.lowStockThreshold || 5;

  const handleOpenAddModal = () => {
    setEditingProduct(null);
    setFormName('');
    setFormBrand('UrbanWear Atelier');
    setFormCat('men');
    setFormPrice(58);
    setFormDiscountPrice(undefined);
    setFormSku(`UW-${Math.floor(100 + Math.random() * 900)}`);
    setFormTag('New');
    setFormImg('https://images.unsplash.com/photo-1556905055-8f358a7a47b2?q=80&w=800&auto=format&fit=crop');
    setFormDescription('Contemporary relaxed silhouette cut from premium heavyweight cotton.');
    setFormMaterial('100% Organic Cotton');
    setFormWeight('0.5 kg');
    setFormMinThreshold(5);
    setFormStatus('published');
    setFormIsFeatured(false);
    
    // Default 4 variants
    const sampleVariants: ProductVariant[] = [
      { id: 'v1', size: 'S', color: 'Black', sku: 'UW-VAR-S', stock: 10, price: 58 },
      { id: 'v2', size: 'M', color: 'Black', sku: 'UW-VAR-M', stock: 15, price: 58 },
      { id: 'v3', size: 'L', color: 'Black', sku: 'UW-VAR-L', stock: 8, price: 58 },
      { id: 'v4', size: 'XL', color: 'Black', sku: 'UW-VAR-XL', stock: 5, price: 58 }
    ];
    setFormVariants(sampleVariants);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (product: Product) => {
    setEditingProduct(product);
    setFormName(product.name);
    setFormBrand(product.brand || 'UrbanWear Atelier');
    setFormCat(product.cat);
    setFormPrice(product.price);
    setFormDiscountPrice(product.discountPrice);
    setFormSku(product.sku || `UW-${product.id}`);
    setFormTag(product.tag || '');
    setFormImg(product.img);
    setFormDescription(product.description || '');
    setFormMaterial(product.material || '');
    setFormWeight(product.weight || '');
    setFormMinThreshold(product.minStockThreshold || 5);
    setFormStatus(product.status === 'draft' ? 'draft' : 'published');
    setFormIsFeatured(!!product.isFeatured);
    
    if (product.variants && product.variants.length > 0) {
      setFormVariants([...product.variants]);
    } else {
      setFormVariants([
        { id: `v-${product.id}`, size: 'Standard', color: 'Default', sku: product.sku || `UW-${product.id}`, stock: product.stock, price: product.price }
      ]);
    }
    setIsModalOpen(true);
  };

  const handleAddVariantRow = () => {
    const newId = `var-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`;
    setFormVariants([
      ...formVariants,
      {
        id: newId,
        size: 'M',
        color: 'Black',
        sku: `${formSku || 'UW'}-${formVariants.length + 1}`,
        stock: 10,
        price: formPrice
      }
    ]);
  };

  const handleRemoveVariantRow = (id: string) => {
    if (formVariants.length <= 1) return;
    setFormVariants(formVariants.filter(v => v.id !== id));
  };

  const handleUpdateVariantField = (id: string, field: keyof ProductVariant, value: any) => {
    setFormVariants(formVariants.map(v => v.id === id ? { ...v, [field]: value } : v));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const calculatedTotalStock = formVariants.reduce((sum, v) => sum + Number(v.stock || 0), 0);
    const uniqueSizes = Array.from(new Set(formVariants.map(v => v.size)));
    const uniqueColors = Array.from(new Set(formVariants.map(v => v.color)));

    if (editingProduct) {
      updateProduct({
        ...editingProduct,
        name: formName,
        brand: formBrand,
        cat: formCat,
        price: Number(formPrice),
        discountPrice: formDiscountPrice ? Number(formDiscountPrice) : undefined,
        sku: formSku,
        tag: formTag,
        img: formImg,
        description: formDescription,
        material: formMaterial,
        weight: formWeight,
        minStockThreshold: Number(formMinThreshold),
        status: formStatus,
        isFeatured: formIsFeatured,
        sizes: uniqueSizes,
        colors: uniqueColors,
        variants: formVariants,
        stock: calculatedTotalStock
      });
    } else {
      addProduct({
        name: formName,
        brand: formBrand,
        cat: formCat,
        price: Number(formPrice),
        discountPrice: formDiscountPrice ? Number(formDiscountPrice) : undefined,
        sku: formSku,
        tag: formTag,
        img: formImg,
        description: formDescription,
        material: formMaterial,
        weight: formWeight,
        minStockThreshold: Number(formMinThreshold),
        status: formStatus,
        isFeatured: formIsFeatured,
        sizes: uniqueSizes,
        colors: uniqueColors,
        variants: formVariants,
        stock: calculatedTotalStock
      });
    }
    setIsModalOpen(false);
  };

  // Filter Products
  const query = (adminSearchQuery || localSearch).toLowerCase().trim();
  const filteredProducts = products.filter(p => {
    // Search query
    if (query) {
      const matchName = p.name.toLowerCase().includes(query);
      const matchSku = (p.sku || '').toLowerCase().includes(query);
      const matchCat = p.cat.toLowerCase().includes(query);
      const matchBrand = (p.brand || '').toLowerCase().includes(query);
      if (!matchName && !matchSku && !matchCat && !matchBrand) return false;
    }

    // Category
    if (categoryFilter !== 'all' && p.cat !== categoryFilter) return false;

    // Stock
    if (stockFilter === 'out_of_stock' && p.stock !== 0) return false;
    if (stockFilter === 'low_stock' && (p.stock === 0 || p.stock > threshold)) return false;
    if (stockFilter === 'in_stock' && p.stock <= threshold) return false;

    return true;
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50">
            Product Catalog & Matrix
          </h1>
          <p className="text-xs text-neutral-500 dark:text-neutral-400">
            Manage your clothing inventory, size-color variants, pricing, and stock levels.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={() => setAdminActiveTab('add_product')}
            className="flex items-center justify-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-md shadow-indigo-500/20 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Add Product (Full Studio)</span>
          </button>
          <button
            onClick={handleOpenAddModal}
            className="px-3.5 py-2.5 border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-xl text-xs font-semibold text-neutral-700 dark:text-neutral-300 transition-colors"
          >
            Quick Add
          </button>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="p-4 bg-white dark:bg-[#121212] border border-neutral-200/90 dark:border-neutral-800 rounded-2xl shadow-sm flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400 pointer-events-none" />
          <input
            type="text"
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            placeholder="Search by product name, SKU, brand..."
            className="w-full pl-10 pr-4 py-2 bg-neutral-100/80 dark:bg-neutral-900/80 border border-transparent focus:border-indigo-500 rounded-xl text-xs text-neutral-900 dark:text-neutral-100 focus:outline-none"
          />
        </div>

        {/* Filter Dropdowns */}
        <div className="flex items-center gap-2 overflow-x-auto text-xs">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-2 bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl font-medium text-neutral-700 dark:text-neutral-300 focus:outline-none"
          >
            <option value="all">All Categories</option>
            <option value="men">Men</option>
            <option value="women">Women</option>
            <option value="unisex">Unisex</option>
            <option value="accessories">Accessories</option>
          </select>

          <select
            value={stockFilter}
            onChange={(e) => setStockFilter(e.target.value)}
            className="px-3 py-2 bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl font-medium text-neutral-700 dark:text-neutral-300 focus:outline-none"
          >
            <option value="all">All Stock Status</option>
            <option value="in_stock">🟢 Normal Stock (&gt; {threshold})</option>
            <option value="low_stock">🟠 Low Stock (1 - {threshold})</option>
            <option value="out_of_stock">🔴 Out of Stock (0)</option>
          </select>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white dark:bg-[#121212] border border-neutral-200/90 dark:border-neutral-800 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-neutral-100 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/50 text-neutral-400 font-semibold uppercase tracking-wider text-[10px]">
                <th className="py-3.5 px-4 font-semibold">Product</th>
                <th className="py-3.5 px-3 font-semibold">Category</th>
                <th className="py-3.5 px-3 font-semibold">SKU</th>
                <th className="py-3.5 px-3 font-semibold">Price</th>
                <th className="py-3.5 px-3 font-semibold">Variants</th>
                <th className="py-3.5 px-3 font-semibold">Total Stock</th>
                <th className="py-3.5 px-3 font-semibold">Status</th>
                <th className="py-3.5 px-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800/60 font-medium">
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-neutral-400">
                    No products found matching your filters.
                  </td>
                </tr>
              ) : (
                filteredProducts.map((p) => {
                  const isOut = p.stock === 0;
                  const isLow = p.stock > 0 && p.stock <= threshold;
                  const variantCount = p.variants ? p.variants.length : 1;

                  return (
                    <tr key={p.id} className="hover:bg-neutral-50/60 dark:hover:bg-neutral-850/40 transition-colors">
                      {/* Product Name & Img */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <img 
                            src={p.img} 
                            alt={p.name} 
                            className="w-11 h-11 object-cover rounded-xl border border-neutral-200 dark:border-neutral-700 shrink-0" 
                          />
                          <div className="min-w-0">
                            <div className="flex items-center gap-1.5">
                              <span className="font-bold text-neutral-900 dark:text-neutral-100 truncate max-w-[180px] sm:max-w-[240px]">
                                {p.name}
                              </span>
                              {p.isFeatured && (
                                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400 shrink-0" />
                              )}
                            </div>
                            <span className="text-[10px] text-neutral-400 block truncate">
                              {p.brand || 'UrbanWear'} · {p.tag || 'Standard'}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="py-3.5 px-3 uppercase tracking-wider text-[10px] font-bold text-neutral-500">
                        {p.cat}
                      </td>

                      {/* SKU */}
                      <td className="py-3.5 px-3 font-mono text-[11px] text-neutral-600 dark:text-neutral-400">
                        {p.sku || `UW-${p.id}`}
                      </td>

                      {/* Price */}
                      <td className="py-3.5 px-3">
                        <div className="font-bold text-neutral-900 dark:text-neutral-100">
                          ${p.price.toFixed(2)}
                        </div>
                        {p.discountPrice && (
                          <span className="text-[10px] text-rose-500 line-through">
                            ${p.discountPrice.toFixed(2)}
                          </span>
                        )}
                      </td>

                      {/* Variants Count */}
                      <td className="py-3.5 px-3">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-neutral-100 dark:bg-neutral-800 text-[10px] font-semibold text-neutral-700 dark:text-neutral-300">
                          <Boxes className="w-3 h-3 text-neutral-400" />
                          <span>{variantCount} vars</span>
                        </span>
                      </td>

                      {/* Stock Level with Pill Indicator */}
                      <td className="py-3.5 px-3">
                        <div className="flex items-center gap-2">
                          <span className={`
                            px-2 py-0.5 rounded-full text-[10px] font-bold inline-flex items-center gap-1
                            ${isOut ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400' :
                              isLow ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400' :
                              'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'}
                          `}>
                            <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                            <span>{p.stock} units</span>
                          </span>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-3">
                        <button
                          onClick={() => togglePublishProduct(p.id)}
                          className={`
                            px-2 py-0.5 rounded-md text-[10px] font-bold capitalize transition-colors
                            ${p.status === 'published' 
                              ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400 hover:bg-blue-500/20' 
                              : 'bg-neutral-200 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400'}
                          `}
                        >
                          {p.status || 'published'}
                        </button>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => openRestockModal(p)}
                            title="Quick Restock"
                            className="p-1.5 hover:bg-emerald-50 dark:hover:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 rounded-lg transition-colors"
                          >
                            <PackagePlus className="w-4 h-4" />
                          </button>

                          <button
                            onClick={() => handleOpenEditModal(p)}
                            title="Edit Product & Variants"
                            className="p-1.5 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-600 dark:text-neutral-300 rounded-lg transition-colors"
                          >
                            <Edit className="w-4 h-4" />
                          </button>

                          <button
                            onClick={() => duplicateProduct(p.id)}
                            title="Duplicate Product"
                            className="p-1.5 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-600 dark:text-neutral-300 rounded-lg transition-colors"
                          >
                            <Copy className="w-4 h-4" />
                          </button>

                          <button
                            onClick={() => toggleFeaturedProduct(p.id)}
                            title="Toggle Featured"
                            className={`p-1.5 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors ${p.isFeatured ? 'text-amber-500' : 'text-neutral-400'}`}
                          >
                            <Star className="w-4 h-4" />
                          </button>

                          <button
                            onClick={() => {
                              if (confirm(`Are you sure you want to delete "${p.name}"?`)) {
                                deleteProduct(p.id);
                              }
                            }}
                            title="Delete Product"
                            className="p-1.5 hover:bg-rose-50 dark:hover:bg-rose-950/20 text-rose-500 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Product Add/Edit Modal */}
      {isModalOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm overflow-y-auto animate-fade-in"
          role="dialog"
        >
          <div className="relative w-full max-w-3xl bg-white dark:bg-[#121212] border border-neutral-200 dark:border-neutral-800 rounded-2xl shadow-2xl overflow-hidden my-8 text-neutral-900 dark:text-neutral-100">
            
            {/* Modal Header */}
            <div className="p-5 border-b border-neutral-100 dark:border-neutral-800 flex items-center justify-between bg-neutral-50/50 dark:bg-neutral-900/40">
              <div>
                <h3 className="text-base font-bold tracking-tight">
                  {editingProduct ? 'Edit Product & Variants' : 'Create New Clothing Product'}
                </h3>
                <p className="text-xs text-neutral-500">Configure catalog metadata, images, and Size x Color stock matrix.</p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 text-neutral-400 hover:text-neutral-700 dark:hover:text-white rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
              
              {/* Basic Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-500 mb-1">
                    Product Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    placeholder="e.g. Classic Oversized Hoodie"
                    className="w-full px-3.5 py-2.5 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl text-xs font-medium focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-500 mb-1">
                    Brand / Collection
                  </label>
                  <input
                    type="text"
                    value={formBrand}
                    onChange={(e) => setFormBrand(e.target.value)}
                    placeholder="e.g. UrbanWear Atelier"
                    className="w-full px-3.5 py-2.5 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl text-xs font-medium focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-500 mb-1">
                    Category *
                  </label>
                  <select
                    value={formCat}
                    onChange={(e) => setFormCat(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl text-xs font-medium focus:outline-none focus:border-indigo-500"
                  >
                    <option value="men">Men's Apparel</option>
                    <option value="women">Women's Apparel</option>
                    <option value="unisex">Unisex Streetwear</option>
                    <option value="accessories">Accessories</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-500 mb-1">
                    Base SKU Code *
                  </label>
                  <input
                    type="text"
                    required
                    value={formSku}
                    onChange={(e) => setFormSku(e.target.value)}
                    placeholder="e.g. UW-HD-001"
                    className="w-full px-3.5 py-2.5 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl text-xs font-mono focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              {/* Pricing & Tag */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-500 mb-1">
                    Price ($ USD) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    required
                    value={formPrice}
                    onChange={(e) => setFormPrice(parseFloat(e.target.value) || 0)}
                    className="w-full px-3.5 py-2.5 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl text-xs font-bold focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-500 mb-1">
                    Sale / Discount Price ($)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={formDiscountPrice || ''}
                    onChange={(e) => setFormDiscountPrice(e.target.value ? parseFloat(e.target.value) : undefined)}
                    placeholder="Optional"
                    className="w-full px-3.5 py-2.5 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl text-xs font-medium focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-500 mb-1">
                    Badge / Tag
                  </label>
                  <input
                    type="text"
                    value={formTag}
                    onChange={(e) => setFormTag(e.target.value)}
                    placeholder="e.g. Best Seller, New, Limited"
                    className="w-full px-3.5 py-2.5 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl text-xs font-medium focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              {/* Image URL & Description */}
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-500 mb-1">
                    Primary Image URL *
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="url"
                      required
                      value={formImg}
                      onChange={(e) => setFormImg(e.target.value)}
                      placeholder="https://images.unsplash.com/..."
                      className="flex-1 px-3.5 py-2.5 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl text-xs focus:outline-none focus:border-indigo-500 font-mono"
                    />
                    {formImg && (
                      <img src={formImg} alt="Preview" className="w-10 h-10 object-cover rounded-xl border border-neutral-200 dark:border-neutral-700" />
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-500 mb-1">
                    Description
                  </label>
                  <textarea
                    rows={3}
                    value={formDescription}
                    onChange={(e) => setFormDescription(e.target.value)}
                    placeholder="Detailed description of tailoring, fabric, and styling..."
                    className="w-full px-3.5 py-2.5 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl text-xs focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              {/* Size x Color Variant Matrix (Section 2.15) */}
              <div className="p-4 bg-neutral-50 dark:bg-neutral-900/60 border border-neutral-200 dark:border-neutral-800 rounded-xl space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-neutral-900 dark:text-neutral-100 flex items-center gap-1.5">
                      <Boxes className="w-4 h-4 text-indigo-500" />
                      <span>Size & Color Variant Matrix</span>
                    </h4>
                    <p className="text-[11px] text-neutral-500">
                      Each variant tracks independent stock counts. Total product stock is auto-calculated.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleAddVariantRow}
                    className="px-2.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Variant</span>
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="text-neutral-400 font-semibold uppercase text-[10px] border-b border-neutral-200 dark:border-neutral-800">
                        <th className="pb-2">Size</th>
                        <th className="pb-2">Color</th>
                        <th className="pb-2">SKU</th>
                        <th className="pb-2">Stock</th>
                        <th className="pb-2">Price ($)</th>
                        <th className="pb-2 text-right">Remove</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-200/50 dark:divide-neutral-800/50">
                      {formVariants.map((v) => (
                        <tr key={v.id}>
                          <td className="py-2 pr-2">
                            <input
                              type="text"
                              value={v.size}
                              onChange={(e) => handleUpdateVariantField(v.id, 'size', e.target.value)}
                              className="w-16 px-2 py-1 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded text-xs"
                              placeholder="M"
                            />
                          </td>
                          <td className="py-2 pr-2">
                            <input
                              type="text"
                              value={v.color}
                              onChange={(e) => handleUpdateVariantField(v.id, 'color', e.target.value)}
                              className="w-24 px-2 py-1 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded text-xs"
                              placeholder="Black"
                            />
                          </td>
                          <td className="py-2 pr-2">
                            <input
                              type="text"
                              value={v.sku}
                              onChange={(e) => handleUpdateVariantField(v.id, 'sku', e.target.value)}
                              className="w-28 px-2 py-1 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded text-xs font-mono"
                              placeholder="SKU-1"
                            />
                          </td>
                          <td className="py-2 pr-2">
                            <input
                              type="number"
                              min="0"
                              value={v.stock}
                              onChange={(e) => handleUpdateVariantField(v.id, 'stock', parseInt(e.target.value) || 0)}
                              className="w-20 px-2 py-1 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded text-xs font-bold"
                            />
                          </td>
                          <td className="py-2 pr-2">
                            <input
                              type="number"
                              min="0"
                              step="0.01"
                              value={v.price || formPrice}
                              onChange={(e) => handleUpdateVariantField(v.id, 'price', parseFloat(e.target.value) || 0)}
                              className="w-20 px-2 py-1 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded text-xs"
                            />
                          </td>
                          <td className="py-2 text-right">
                            <button
                              type="button"
                              onClick={() => handleRemoveVariantRow(v.id)}
                              disabled={formVariants.length <= 1}
                              className="p-1 text-neutral-400 hover:text-rose-500 disabled:opacity-30"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="pt-2 text-right text-xs font-bold text-neutral-700 dark:text-neutral-300">
                  Total Calculated Stock: <span className="text-indigo-600 dark:text-indigo-400 font-black">{formVariants.reduce((sum, v) => sum + Number(v.stock || 0), 0)} Units</span>
                </div>
              </div>

              {/* Status & Options */}
              <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-neutral-100 dark:border-neutral-800">
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2 text-xs font-semibold cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formIsFeatured}
                      onChange={(e) => setFormIsFeatured(e.target.checked)}
                      className="rounded text-indigo-600 focus:ring-indigo-500"
                    />
                    <span>Feature on Storefront</span>
                  </label>

                  <div className="flex items-center gap-2">
                    <span className="text-xs text-neutral-500 font-semibold">Publish Status:</span>
                    <select
                      value={formStatus}
                      onChange={(e) => setFormStatus(e.target.value as any)}
                      className="px-2 py-1 bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded text-xs"
                    >
                      <option value="published">Published</option>
                      <option value="draft">Draft</option>
                    </select>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 border border-neutral-200 dark:border-neutral-700 rounded-xl text-xs font-semibold text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-md shadow-indigo-500/20"
                  >
                    {editingProduct ? 'Save Product Changes' : 'Create Product'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
