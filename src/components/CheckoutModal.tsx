import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { PaymentMethod, DeliveryDetails, Order } from '../types';
import { 
  X, 
  Truck, 
  CreditCard, 
  Building2, 
  CheckCircle2, 
  Copy, 
  Check, 
  ArrowRight, 
  Clock, 
  Phone, 
  MapPin, 
  ShieldCheck,
  LayoutDashboard
} from 'lucide-react';

export const CheckoutModal: React.FC = () => {
  const { 
    isCheckoutOpen, 
    setIsCheckoutOpen, 
    cart, 
    cartSubtotal, 
    shippingFee, 
    cartTotal, 
    placeOrder, 
    calculateDiscount,
    user,
    isAdmin,
    setCurrentView,
    selectedPaymentMethod,
    setSelectedPaymentMethod,
    openPolicyModal
  } = useApp();

  const [deliveryDetails, setDeliveryDetails] = useState<DeliveryDetails>({
    fullName: user?.name || '',
    phone: '',
    altPhone: '',
    address: '',
    city: 'Lagos',
    state: 'Lagos',
    deliveryWindow: 'Morning (9am - 1pm)',
    notes: ''
  });

  // Credit Card fields (if chosen)
  const [ccData, setCcData] = useState({ number: '', name: user?.name || '', exp: '', cvv: '' });
  const [cardFlipped, setCardFlipped] = useState(false);
  const [copiedBank, setCopiedBank] = useState(false);

  // Submission state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [completedOrder, setCompletedOrder] = useState<Order | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [discountCode, setDiscountCode] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState(0);

  if (!isCheckoutOpen) return null;

  const handleInputChange = (field: keyof DeliveryDetails, value: string) => {
    setDeliveryDetails(prev => ({ ...prev, [field]: value }));
    setFormError(null);
  };

  const handleCopyBank = () => {
    const text = "Account Name: Maison Noir Luxury Ltd\nBank: First Atlantic Bank\nAccount Number: 0123456789\nSort Code: 058-152\nIBAN: NG29 FABL 0123 4567 8901";
    navigator.clipboard.writeText(text);
    setCopiedBank(true);
    setTimeout(() => setCopiedBank(false), 2000);
  };

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!deliveryDetails.fullName.trim()) {
      setFormError('Please enter your full name.');
      return;
    }
    if (!deliveryDetails.phone.trim()) {
      setFormError('Please provide a mobile phone number for courier delivery verification.');
      return;
    }
    if (!deliveryDetails.address.trim()) {
      setFormError('Please enter your full delivery street address.');
      return;
    }
    if (!deliveryDetails.city.trim()) {
      setFormError('Please enter your city.');
      return;
    }

    setIsSubmitting(true);
    setFormError(null);

    // Realistic placement delay
    setTimeout(async () => {
      try {
        const order = await placeOrder(deliveryDetails, selectedPaymentMethod, discountCode);
        setCompletedOrder(order);
      } catch (err) {
        setFormError('An error occurred placing your order. Please try again.');
      } finally {
        setIsSubmitting(false);
      }
    }, 1200);
  };

  const closeCheckout = () => {
    setIsCheckoutOpen(false);
    setCompletedOrder(null);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 modal-safe animate-fade-in">
      <div 
        className="relative w-full max-w-4xl bg-white dark:bg-[#111111] border border-neutral-200 dark:border-neutral-800 shadow-2xl rounded-sm overflow-hidden flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between bg-neutral-50/50 dark:bg-neutral-900/30">
          <div>
            <span className="text-[10px] uppercase tracking-[0.25em] font-semibold text-neutral-400 block">
              Maison Noir Concierge
            </span>
            <h2 className="font-serif text-xl sm:text-2xl font-medium text-neutral-900 dark:text-neutral-100">
              {completedOrder ? 'Order Confirmation' : 'Delivery & Payment Details'}
            </h2>
          </div>
          <button
            onClick={closeCheckout}
            className="p-2 text-neutral-400 hover:text-black dark:hover:text-white transition-colors"
            aria-label="Close checkout"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-8">
          {completedOrder ? (
            /* Order Success Receipt */
            <div className="py-6 text-center max-w-xl mx-auto space-y-6 animate-fade-in">
              <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-9 h-9" />
              </div>

              <div>
                <span className="text-xs uppercase tracking-[0.3em] font-bold text-emerald-600 dark:text-emerald-400 block mb-1">
                  Order Successfully Dispatched
                </span>
                <h3 className="font-serif text-3xl font-medium text-neutral-900 dark:text-neutral-100">
                  Receipt #{completedOrder.id}
                </h3>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-2">
                  Thank you, {completedOrder.customer.fullName}. Your timeless pieces are being packaged at our atelier.
                </p>
              </div>

              {/* Delivery Recap Card */}
              <div className="p-5 bg-neutral-50 dark:bg-neutral-900/60 border border-neutral-200 dark:border-neutral-800 rounded-sm text-left text-xs space-y-3">
                <div className="flex justify-between items-center pb-3 border-b border-neutral-200 dark:border-neutral-800">
                  <span className="text-neutral-500 uppercase tracking-wider font-medium">Payment Protocol</span>
                  <span className="font-bold text-neutral-900 dark:text-neutral-100 uppercase tracking-wider">
                    {completedOrder.paymentMethod === 'cod' ? '💵 Payment on Delivery' : completedOrder.paymentMethod.toUpperCase()}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                  <div>
                    <span className="text-neutral-400 uppercase tracking-wider text-[10px] block mb-1">Delivery Destination</span>
                    <p className="font-semibold text-neutral-800 dark:text-neutral-200">{completedOrder.customer.address}</p>
                    <p className="text-neutral-600 dark:text-neutral-400">{completedOrder.customer.city}, {completedOrder.customer.state}</p>
                  </div>
                  <div>
                    <span className="text-neutral-400 uppercase tracking-wider text-[10px] block mb-1">Contact Dispatch</span>
                    <p className="font-semibold text-neutral-800 dark:text-neutral-200">{completedOrder.customer.phone}</p>
                    <p className="text-neutral-600 dark:text-neutral-400">Window: {completedOrder.customer.deliveryWindow}</p>
                  </div>
                </div>

                {completedOrder.customer.notes && (
                  <div className="pt-2 border-t border-neutral-100 dark:border-neutral-800 text-neutral-500 italic">
                    Note: &ldquo;{completedOrder.customer.notes}&rdquo;
                  </div>
                )}

                <div className="pt-3 border-t border-neutral-200 dark:border-neutral-800 flex justify-between font-bold text-sm">
                  <span>Total Due on Arrival</span>
                  <span>${completedOrder.total.toFixed(2)}</span>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
                {isAdmin && (
                  <button
                    onClick={() => {
                      closeCheckout();
                      setCurrentView('admin');
                    }}
                    className="px-6 py-3 bg-amber-500 hover:bg-amber-600 text-black font-bold text-xs uppercase tracking-[0.2em] rounded-none flex items-center justify-center gap-2 shadow-md"
                  >
                    <LayoutDashboard className="w-4 h-4" />
                    <span>View in Admin HQ</span>
                  </button>
                )}
                
                <button
                  onClick={closeCheckout}
                  className="px-8 py-3 bg-black text-white hover:bg-neutral-800 dark:bg-white dark:text-black text-xs uppercase tracking-[0.2em] font-semibold"
                >
                  Continue Browsing
                </button>
              </div>
            </div>
          ) : (
            /* Checkout Form & Order Summary */
            <form onSubmit={handleSubmitOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              
              {/* Left Column: Payment Method & Delivery Details Form (7 cols) */}
              <div className="lg:col-span-7 space-y-6">
                
                {/* 1. Payment Method Selection */}
                <div>
                  <label className="block text-xs uppercase tracking-[0.2em] font-bold text-neutral-800 dark:text-neutral-200 mb-3">
                    1. Select Payment Method
                  </label>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {/* Pay on Delivery Option */}
                    <button
                      type="button"
                      onClick={() => setSelectedPaymentMethod('cod')}
                      id="method-cod-btn"
                      className={`p-3.5 text-left border rounded-sm transition-all flex flex-col justify-between gap-2 ${
                        selectedPaymentMethod === 'cod'
                          ? 'border-black dark:border-white bg-neutral-50 dark:bg-neutral-900 ring-1 ring-black dark:ring-white'
                          : 'border-neutral-200 dark:border-neutral-800 hover:border-neutral-400'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <Truck className={`w-4 h-4 ${selectedPaymentMethod === 'cod' ? 'text-amber-500' : 'text-neutral-400'}`} />
                        {selectedPaymentMethod === 'cod' && <span className="w-2 h-2 rounded-full bg-black dark:bg-white"></span>}
                      </div>
                      <div>
                        <p className="text-xs font-bold text-neutral-900 dark:text-neutral-100">Pay on Delivery</p>
                        <p className="text-[10px] text-neutral-500 leading-tight mt-0.5">Cash or POS card when courier arrives</p>
                      </div>
                    </button>

                    {/* Card Payment Option */}
                    <button
                      type="button"
                      onClick={() => setSelectedPaymentMethod('card')}
                      id="method-card-btn"
                      className={`p-3.5 text-left border rounded-sm transition-all flex flex-col justify-between gap-2 ${
                        selectedPaymentMethod === 'card'
                          ? 'border-black dark:border-white bg-neutral-50 dark:bg-neutral-900 ring-1 ring-black dark:ring-white'
                          : 'border-neutral-200 dark:border-neutral-800 hover:border-neutral-400'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <CreditCard className="w-4 h-4 text-neutral-400" />
                        {selectedPaymentMethod === 'card' && <span className="w-2 h-2 rounded-full bg-black dark:bg-white"></span>}
                      </div>
                      <div>
                        <p className="text-xs font-bold text-neutral-900 dark:text-neutral-100">Credit / Debit Card</p>
                        <p className="text-[10px] text-neutral-500 leading-tight mt-0.5">Instant Visa & MasterCard checkout</p>
                      </div>
                    </button>

                    {/* Bank Transfer Option */}
                    <button
                      type="button"
                      onClick={() => setSelectedPaymentMethod('bank')}
                      id="method-bank-btn"
                      className={`p-3.5 text-left border rounded-sm transition-all flex flex-col justify-between gap-2 ${
                        selectedPaymentMethod === 'bank'
                          ? 'border-black dark:border-white bg-neutral-50 dark:bg-neutral-900 ring-1 ring-black dark:ring-white'
                          : 'border-neutral-200 dark:border-neutral-800 hover:border-neutral-400'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <Building2 className="w-4 h-4 text-neutral-400" />
                        {selectedPaymentMethod === 'bank' && <span className="w-2 h-2 rounded-full bg-black dark:bg-white"></span>}
                      </div>
                      <div>
                        <p className="text-xs font-bold text-neutral-900 dark:text-neutral-100">Bank Wire</p>
                        <p className="text-[10px] text-neutral-500 leading-tight mt-0.5">Direct transfer to atelier account</p>
                      </div>
                    </button>
                  </div>
                </div>

                {/* Sub-panels for selected payment methods */}
                {selectedPaymentMethod === 'cod' && (
                  <div className="p-4 bg-amber-500/10 border border-amber-500/20 text-xs text-amber-900 dark:text-amber-300 rounded-sm flex items-start gap-3">
                    <Truck className="w-4 h-4 shrink-0 mt-0.5" />
                    <div>
                      <strong className="block font-semibold">Doorstep Inspection & Payment:</strong>
                      You do not pay anything today. When our dispatch arrives, examine your luxury garments, ensure proper sizing, and settle via cash or POS card terminal.
                    </div>
                  </div>
                )}

                {selectedPaymentMethod === 'bank' && (
                  <div className="p-4 bg-neutral-50 dark:bg-neutral-900/70 border border-neutral-200 dark:border-neutral-800 rounded-sm text-xs space-y-2">
                    <div className="flex justify-between items-center pb-2 border-b border-neutral-200 dark:border-neutral-800 font-semibold">
                      <span>Maison Noir Atelier Treasury</span>
                      <button
                        type="button"
                        onClick={handleCopyBank}
                        className="text-[11px] text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white flex items-center gap-1 font-mono"
                      >
                        {copiedBank ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copiedBank ? 'Copied' : 'Copy All'}</span>
                      </button>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-neutral-600 dark:text-neutral-400 font-mono text-[11px]">
                      <div>Bank: <strong>First Atlantic Bank</strong></div>
                      <div>Account: <strong>0123456789</strong></div>
                      <div>Name: <strong>Maison Noir Ltd</strong></div>
                      <div>Sort: <strong>058-152</strong></div>
                    </div>
                  </div>
                )}

                {selectedPaymentMethod === 'card' && (
                  <div className="space-y-4 pt-1">
                    {/* 3D Card Preview */}
                    <div className="w-full max-w-sm mx-auto aspect-[1.586] rounded-xl bg-gradient-to-tr from-neutral-950 via-neutral-900 to-neutral-800 text-white p-5 shadow-xl flex flex-col justify-between border border-neutral-700">
                      <div className="flex justify-between items-start">
                        <div className="w-10 h-7 rounded bg-amber-400/80"></div>
                        <span className="font-serif italic text-lg tracking-wider">Maison Noir</span>
                      </div>
                      <div className="font-mono text-base tracking-[0.2em]">
                        {ccData.number ? ccData.number.padEnd(16, '•').match(/.{1,4}/g)?.join(' ') : '•••• •••• •••• ••••'}
                      </div>
                      <div className="flex justify-between items-end text-[11px] uppercase tracking-wider">
                        <div>
                          <span className="text-[9px] text-neutral-400 block">Cardholder</span>
                          <span className="font-semibold">{ccData.name || 'CLIENT NAME'}</span>
                        </div>
                        <div>
                          <span className="text-[9px] text-neutral-400 block">Expires</span>
                          <span className="font-semibold">{ccData.exp || 'MM/YY'}</span>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-xs">
                      <div className="col-span-2">
                        <label className="block text-[10px] uppercase tracking-wider text-neutral-500 mb-1">Card Number</label>
                        <input
                          type="text"
                          maxLength={16}
                          placeholder="16-digit card number"
                          value={ccData.number}
                          onChange={(e) => setCcData({ ...ccData, number: e.target.value.replace(/\D/g, '') })}
                          className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-xs focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] uppercase tracking-wider text-neutral-500 mb-1">Expiry Date</label>
                        <input
                          type="text"
                          maxLength={5}
                          placeholder="MM/YY"
                          value={ccData.exp}
                          onChange={(e) => setCcData({ ...ccData, exp: e.target.value })}
                          className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-xs focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] uppercase tracking-wider text-neutral-500 mb-1">CVV</label>
                        <input
                          type="password"
                          maxLength={3}
                          placeholder="3 digits"
                          value={ccData.cvv}
                          onChange={(e) => setCcData({ ...ccData, cvv: e.target.value.replace(/\D/g, '') })}
                          className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-xs focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* 2. Customer & Delivery Address Details Form */}
                <div className="pt-2">
                  <label className="block text-xs uppercase tracking-[0.2em] font-bold text-neutral-800 dark:text-neutral-200 mb-3">
                    2. Delivery Location & Courier Details
                  </label>

                  <div className="space-y-3">
                    {/* Full Name */}
                    <div>
                      <label className="block text-[11px] uppercase tracking-wider text-neutral-600 dark:text-neutral-400 mb-1 font-medium">
                        Full Recipient Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Ifeanyi Anoma"
                        value={deliveryDetails.fullName}
                        onChange={(e) => handleInputChange('fullName', e.target.value)}
                        className="w-full px-3.5 py-2.5 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-xs text-neutral-900 dark:text-neutral-100 focus:outline-none focus:border-black dark:focus:border-white"
                      />
                    </div>

                    {/* Phone Numbers */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] uppercase tracking-wider text-neutral-600 dark:text-neutral-400 mb-1 font-medium">
                          Mobile Phone Number <span className="text-red-500">*</span>
                        </label>
                        <div className="relative flex items-center">
                          <Phone className="w-3.5 h-3.5 absolute left-3 text-neutral-400" />
                          <input
                            type="tel"
                            required
                            placeholder="+234 800 000 0000"
                            value={deliveryDetails.phone}
                            onChange={(e) => handleInputChange('phone', e.target.value)}
                            className="w-full pl-9 pr-3 py-2.5 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-xs text-neutral-900 dark:text-neutral-100 focus:outline-none focus:border-black dark:focus:border-white"
                          />
                        </div>
                        <span className="text-[10px] text-neutral-400 mt-0.5 block">Courier will call before arrival</span>
                      </div>

                      <div>
                        <label className="block text-[11px] uppercase tracking-wider text-neutral-600 dark:text-neutral-400 mb-1 font-medium">
                          Alternative Phone (Optional)
                        </label>
                        <input
                          type="tel"
                          placeholder="Secondary number"
                          value={deliveryDetails.altPhone}
                          onChange={(e) => handleInputChange('altPhone', e.target.value)}
                          className="w-full px-3.5 py-2.5 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-xs text-neutral-900 dark:text-neutral-100 focus:outline-none"
                        />
                      </div>
                    </div>

                    {/* Street Address */}
                    <div>
                      <label className="block text-[11px] uppercase tracking-wider text-neutral-600 dark:text-neutral-400 mb-1 font-medium">
                        Street Address / Apartment / Estate <span className="text-red-500">*</span>
                      </label>
                      <div className="relative flex items-center">
                        <MapPin className="w-3.5 h-3.5 absolute left-3 text-neutral-400" />
                        <input
                          type="text"
                          required
                          placeholder="e.g. 14 Adeola Odeku St, Flat 4B"
                          value={deliveryDetails.address}
                          onChange={(e) => handleInputChange('address', e.target.value)}
                          className="w-full pl-9 pr-3 py-2.5 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-xs text-neutral-900 dark:text-neutral-100 focus:outline-none focus:border-black dark:focus:border-white"
                        />
                      </div>
                    </div>

                    {/* City & State */}
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] uppercase tracking-wider text-neutral-600 dark:text-neutral-400 mb-1 font-medium">
                          City / District <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Victoria Island"
                          value={deliveryDetails.city}
                          onChange={(e) => handleInputChange('city', e.target.value)}
                          className="w-full px-3.5 py-2.5 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-xs text-neutral-900 dark:text-neutral-100 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] uppercase tracking-wider text-neutral-600 dark:text-neutral-400 mb-1 font-medium">
                          State / Province <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Lagos"
                          value={deliveryDetails.state}
                          onChange={(e) => handleInputChange('state', e.target.value)}
                          className="w-full px-3.5 py-2.5 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-xs text-neutral-900 dark:text-neutral-100 focus:outline-none"
                        />
                      </div>
                    </div>

                    {/* Delivery Window */}
                    <div>
                      <label className="block text-[11px] uppercase tracking-wider text-neutral-600 dark:text-neutral-400 mb-1 font-medium flex items-center gap-1.5">
                        <Clock className="w-3 h-3 text-neutral-400" />
                        Preferred Delivery Window
                      </label>
                      <select
                        value={deliveryDetails.deliveryWindow}
                        onChange={(e) => handleInputChange('deliveryWindow', e.target.value)}
                        className="w-full px-3.5 py-2.5 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-xs text-neutral-900 dark:text-neutral-100 focus:outline-none cursor-pointer"
                      >
                        <option value="Morning (9am - 1pm)">Morning (9am - 1pm)</option>
                        <option value="Afternoon (1pm - 5pm)">Afternoon (1pm - 5pm)</option>
                        <option value="Express Same-Day">Express Same-Day Priority Dispatch</option>
                      </select>
                    </div>

                    {/* Special Instructions / Notes */}
                    <div>
                      <label className="block text-[11px] uppercase tracking-wider text-neutral-600 dark:text-neutral-400 mb-1 font-medium">
                        Courier Instructions / Security Gate Notes (Optional)
                      </label>
                      <textarea
                        rows={2}
                        placeholder="e.g. Leave with security desk, call upon arrival at gate 2"
                        value={deliveryDetails.notes}
                        onChange={(e) => handleInputChange('notes', e.target.value)}
                        className="w-full px-3.5 py-2 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-xs text-neutral-900 dark:text-neutral-100 focus:outline-none resize-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Error Banner */}
                {formError && (
                  <div className="p-3 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/60 text-xs text-red-600 dark:text-red-400 rounded-sm">
                    {formError}
                  </div>
                )}
              </div>

              {/* Right Column: Order Summary & Place Order Button (5 cols) */}
              <div className="lg:col-span-5 bg-neutral-50/80 dark:bg-neutral-900/40 p-5 sm:p-6 border border-neutral-200 dark:border-neutral-800 rounded-sm flex flex-col justify-between space-y-6">
                <div>
                  <h3 className="font-serif text-lg font-medium text-neutral-900 dark:text-neutral-100 mb-4 pb-3 border-b border-neutral-200 dark:border-neutral-800">
                    Order Summary ({cart.reduce((s, i) => s + i.qty, 0)} pieces)
                  </h3>

                  {/* Items List */}
                  <div className="max-h-56 overflow-y-auto space-y-3 pr-1 divide-y divide-neutral-100 dark:divide-neutral-800/60">
                    {cart.map((item) => (
                      <div key={`${item.product.id}-${item.size}`} className="pt-3 first:pt-0 flex items-center gap-3">
                        <img
                          src={item.product.img}
                          alt={item.product.name}
                          className="w-12 h-16 object-cover bg-neutral-200 shrink-0"
                        />
                        <div className="flex-1 text-xs min-w-0">
                          <p className="font-serif font-medium text-neutral-900 dark:text-neutral-100 truncate">
                            {item.product.name}
                          </p>
                          <p className="text-[10px] text-neutral-400">
                            Size: {item.size} · Qty: {item.qty}
                          </p>
                          <p className="font-semibold text-neutral-800 dark:text-neutral-200 mt-1">
                            ${(item.product.price * item.qty).toFixed(2)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Totals Breakdown */}
                  <div className="flex gap-2 pt-4">
                    <input value={discountCode} onChange={event => { setDiscountCode(event.target.value.toUpperCase()); setAppliedDiscount(0); }} placeholder="Promotion code" className="min-w-0 flex-1 border border-neutral-300 dark:border-neutral-700 bg-transparent px-3 py-2 text-xs" />
                    <button type="button" onClick={() => { const amount = calculateDiscount(discountCode, cartSubtotal); setAppliedDiscount(amount); setFormError(amount ? null : 'This promotion code is invalid or not available for this order.'); }} className="border border-neutral-900 dark:border-neutral-100 px-3 py-2 text-[10px] font-bold uppercase">Apply</button>
                  </div>
                  <div className="space-y-2 text-xs pt-4 mt-4 border-t border-neutral-200 dark:border-neutral-800">
                    <div className="flex justify-between text-neutral-500">
                      <span>Subtotal</span>
                      <span>${cartSubtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-neutral-500">
                      <span>Courier Delivery</span>
                      <span>{shippingFee === 0 ? <strong className="text-emerald-600">Free Express</strong> : `$${shippingFee.toFixed(2)}`}</span>
                    </div>
                    {appliedDiscount > 0 && <div className="flex justify-between text-emerald-600"><span>Promotion</span><span>-${appliedDiscount.toFixed(2)}</span></div>}
                    <div className="flex justify-between text-base font-bold text-neutral-900 dark:text-neutral-100 pt-3 border-t border-neutral-200 dark:border-neutral-800">
                      <span>Total</span>
                      <span>${Math.max(0, cartTotal - appliedDiscount).toFixed(2)}</span>
                    </div>
                  </div>

                  {/* Protection Badges */}
                  <div className="mt-6 pt-4 border-t border-neutral-200 dark:border-neutral-800 text-[11px] text-neutral-500 space-y-2">
                    <button
                      type="button"
                      onClick={() => openPolicyModal('14')}
                      className="w-full flex items-center justify-between text-left hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors py-0.5"
                    >
                      <div className="flex items-center gap-2">
                        <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>Complimentary size exchange within 14 days</span>
                      </div>
                      <span className="text-[10px] underline opacity-75">View Policy</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => openPolicyModal('12')}
                      className="w-full flex items-center justify-between text-left hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors py-0.5"
                    >
                      <div className="flex items-center gap-2">
                        <Truck className="w-4 h-4 text-amber-500 shrink-0" />
                        <span>Zero upfront payment required for Pay on Delivery</span>
                      </div>
                      <span className="text-[10px] underline opacity-75">View Terms</span>
                    </button>
                  </div>
                </div>

                {/* Final Submit Button & Agreement */}
                <div>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    id="confirm-checkout-btn"
                    className="w-full py-4 bg-black text-white hover:bg-neutral-800 dark:bg-white dark:text-black dark:hover:bg-neutral-200 text-xs uppercase tracking-[0.2em] font-bold transition-all flex items-center justify-center gap-2 shadow-xl disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <span>Registering Order with Atelier...</span>
                    ) : (
                      <>
                        <span>
                          {selectedPaymentMethod === 'cod' ? 'Confirm & Place Order (Pay on Delivery)' : 'Place Order'}
                        </span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>

                  <p className="mt-2 text-center text-[10px] text-neutral-400 dark:text-neutral-500 leading-tight">
                    By placing this order, you agree to our{' '}
                    <button
                      type="button"
                      onClick={() => openPolicyModal('all')}
                      className="underline hover:text-black dark:hover:text-white"
                    >
                      Store Policy &amp; Terms
                    </button>.
                  </p>
                </div>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
