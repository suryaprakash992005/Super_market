import React, { useState } from 'react';
import { X, ShieldCheck, CheckCircle2, AlertCircle, Loader2, QrCode, Smartphone, CreditCard } from 'lucide-react';
import { PaymentMethod } from '../../types';
import { formatCurrency } from '../../lib/utils';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  method: PaymentMethod;
  amount: number;
  orderNumber: string;
  onSuccess: (transactionId: string) => void;
  onFailure: (errorMsg: string) => void;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({
  isOpen,
  onClose,
  method,
  amount,
  orderNumber,
  onSuccess,
  onFailure,
}) => {
  const [tab, setTab] = useState<'upi' | 'card'>('upi');
  const [upiId, setUpiId] = useState('user@okhdfcbank');
  const [status, setStatus] = useState<'idle' | 'processing' | 'verifying' | 'success' | 'failed'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  if (!isOpen) return null;

  const getProviderDetails = () => {
    switch (method) {
      case 'razorpay':
        return {
          title: 'Razorpay Secure Checkout',
          color: 'bg-blue-600',
          badge: 'Razorpay Trusted Business',
          logoText: 'Razorpay',
        };
      case 'paytm':
        return {
          title: 'Paytm Payments Bank Gateway',
          color: 'bg-sky-600',
          badge: 'Paytm Secure UPI',
          logoText: 'Paytm',
        };
      case 'phonepe':
        return {
          title: 'PhonePe PG Gateway',
          color: 'bg-purple-700',
          badge: 'PhonePe Verified Gateway',
          logoText: 'PhonePe',
        };
      default:
        return {
          title: 'Secure Online Payment',
          color: 'bg-stone-800',
          badge: '256-Bit SSL Encrypted',
          logoText: 'Payment Gateway',
        };
    }
  };

  const provider = getProviderDetails();

  const handleSimulatePayment = (simulateSuccess: boolean) => {
    setStatus('processing');
    setErrorMessage('');

    setTimeout(() => {
      setStatus('verifying');

      setTimeout(() => {
        if (simulateSuccess) {
          setStatus('success');
          const txnId = `TXN-${method.toUpperCase()}-${Math.floor(1000000 + Math.random() * 9000000)}`;
          setTimeout(() => {
            onSuccess(txnId);
          }, 900);
        } else {
          setStatus('failed');
          setErrorMessage('Transaction was declined by bank or timed out. Please try again or choose Cash on Delivery.');
        }
      }, 1200);
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/70 backdrop-blur-xs">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden border border-surface-border">
        {/* Gateway Header */}
        <div className="p-4 border-b border-surface-border bg-stone-50 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className={`w-8 h-8 rounded-lg ${provider.color} text-white flex items-center justify-center font-bold text-xs shadow-xs`}>
              {provider.logoText.slice(0, 2).toUpperCase()}
            </div>
            <div>
              <h3 className="text-sm font-bold text-obsidian leading-none">{provider.title}</h3>
              <p className="text-[11px] text-muted mt-0.5">Order Ref: {orderNumber}</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            disabled={status === 'processing' || status === 'verifying'}
            className="text-stone-400 hover:text-stone-700 p-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Amount bar */}
        <div className="px-5 py-3 bg-stone-100/70 border-b border-surface-border flex items-center justify-between text-xs">
          <span className="text-stone-600 font-medium">Bharathi Store Supermarket Order</span>
          <span className="font-bold text-base text-obsidian">{formatCurrency(amount)}</span>
        </div>

        {/* Main Body */}
        <div className="p-5">
          {status === 'processing' && (
            <div className="py-10 flex flex-col items-center justify-center text-center space-y-3">
              <Loader2 className="w-10 h-10 text-brand-crimson animate-spin" />
              <p className="font-semibold text-stone-800 text-sm">Contacting {provider.logoText} Gateway...</p>
              <p className="text-xs text-muted max-w-xs">Please do not press back or refresh the page.</p>
            </div>
          )}

          {status === 'verifying' && (
            <div className="py-10 flex flex-col items-center justify-center text-center space-y-3">
              <Loader2 className="w-10 h-10 text-supermarket-fresh animate-spin" />
              <p className="font-semibold text-stone-800 text-sm">Verifying cryptographic bank signature...</p>
              <p className="text-xs text-muted">Securing payment state in Bharathi Store ledger...</p>
            </div>
          )}

          {status === 'success' && (
            <div className="py-8 flex flex-col items-center justify-center text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-green-100 text-supermarket-fresh flex items-center justify-center">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <h4 className="text-base font-bold text-stone-900">Payment Verified!</h4>
              <p className="text-xs text-muted">Order is confirmed and forwarded to the packaging aisle.</p>
            </div>
          )}

          {status === 'failed' && (
            <div className="py-6 flex flex-col items-center justify-center text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center">
                <AlertCircle className="w-7 h-7" />
              </div>
              <h4 className="text-sm font-bold text-stone-900">Payment Failed</h4>
              <p className="text-xs text-stone-600 max-w-xs">{errorMessage}</p>
              <div className="flex gap-2 pt-2">
                <button
                  onClick={() => setStatus('idle')}
                  className="px-4 py-2 bg-stone-900 text-white rounded-lg text-xs font-semibold hover:bg-stone-800"
                >
                  Retry Payment
                </button>
                <button
                  onClick={() => {
                    onClose();
                    onFailure('Customer cancelled or failed online payment.');
                  }}
                  className="px-4 py-2 border border-surface-border text-stone-700 rounded-lg text-xs font-semibold hover:bg-stone-50"
                >
                  Change Payment Method
                </button>
              </div>
            </div>
          )}

          {status === 'idle' && (
            <div className="space-y-4">
              {/* Payment Tab Switcher */}
              <div className="grid grid-cols-2 p-1 bg-stone-100 rounded-lg text-xs font-medium text-stone-700">
                <button
                  onClick={() => setTab('upi')}
                  className={`py-1.5 rounded-md flex items-center justify-center gap-1.5 transition-all ${tab === 'upi' ? 'bg-white shadow-xs text-obsidian font-semibold' : 'hover:text-stone-900'}`}
                >
                  <Smartphone className="w-3.5 h-3.5" />
                  <span>Instant UPI / QR</span>
                </button>
                <button
                  onClick={() => setTab('card')}
                  className={`py-1.5 rounded-md flex items-center justify-center gap-1.5 transition-all ${tab === 'card' ? 'bg-white shadow-xs text-obsidian font-semibold' : 'hover:text-stone-900'}`}
                >
                  <CreditCard className="w-3.5 h-3.5" />
                  <span>Cards / NetBanking</span>
                </button>
              </div>

              {tab === 'upi' ? (
                <div className="space-y-3">
                  {/* Mock QR box */}
                  <div className="p-4 bg-stone-50 border border-surface-border rounded-xl flex flex-col items-center text-center">
                    <div className="w-32 h-32 bg-white border border-stone-200 rounded-lg flex items-center justify-center p-2 shadow-xs mb-2">
                      <QrCode className="w-24 h-24 text-stone-800" />
                    </div>
                    <span className="text-[11px] text-muted">
                      Scan with Google Pay, PhonePe, Paytm, or BHIM
                    </span>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-stone-700 mb-1">
                      Or Pay with UPI ID / VPA
                    </label>
                    <input
                      type="text"
                      value={upiId}
                      onChange={(e) => setUpiId(e.target.value)}
                      placeholder="e.g. mobile@upi"
                      className="w-full text-xs px-3 py-2 border border-surface-border rounded-lg focus:border-brand-crimson"
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-2 text-xs">
                  <div>
                    <label className="block text-[11px] font-semibold text-stone-700 mb-1">Card Number</label>
                    <input
                      type="text"
                      placeholder="•••• •••• •••• 4242"
                      disabled
                      value="•••• •••• •••• 4242 (Test Gateway Card)"
                      className="w-full text-xs px-3 py-2 border border-surface-border rounded-lg bg-stone-50 text-stone-600"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[11px] font-semibold text-stone-700 mb-1">Valid Thru</label>
                      <input
                        type="text"
                        placeholder="MM / YY"
                        disabled
                        value="12 / 28"
                        className="w-full text-xs px-3 py-2 border border-surface-border rounded-lg bg-stone-50 text-stone-600"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-stone-700 mb-1">CVV</label>
                      <input
                        type="password"
                        placeholder="•••"
                        disabled
                        value="888"
                        className="w-full text-xs px-3 py-2 border border-surface-border rounded-lg bg-stone-50 text-stone-600"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="pt-2 space-y-2">
                <button
                  onClick={() => handleSimulatePayment(true)}
                  className="w-full py-2.5 bg-supermarket-fresh text-white rounded-lg text-xs font-semibold tracking-wide flex items-center justify-center gap-1.5 hover:bg-green-700 transition-colors shadow-sm"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>Authorize Payment of {formatCurrency(amount)}</span>
                </button>

                {/* QA Simulation Switch for Testing Payment Failure */}
                <button
                  onClick={() => handleSimulatePayment(false)}
                  className="w-full py-1.5 text-[11px] text-red-600 hover:bg-red-50 rounded transition-colors"
                >
                  Test Payment Failure Flow (QA Simulation)
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer Security Badge */}
        <div className="p-3 bg-stone-50 border-t border-surface-border flex items-center justify-center gap-1.5 text-[11px] text-muted">
          <ShieldCheck className="w-3.5 h-3.5 text-supermarket-fresh" />
          <span>PCI-DSS Level 1 Compliant 256-bit Bank Encryption</span>
        </div>
      </div>
    </div>
  );
};
