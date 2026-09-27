import React, { useState } from 'react';
import { X, ShieldCheck, Mail, Lock, User, Phone, CheckCircle2, ArrowRight } from 'lucide-react';
import { useStore } from '../../context/StoreContext';

export const AuthModal: React.FC = () => {
  const { isAuthModalOpen, setIsAuthModalOpen, login } = useStore();
  const [mode, setMode] = useState<'login' | 'register' | 'forgot'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [successNotice, setSuccessNotice] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isAuthModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      if (mode === 'forgot') {
        setSuccessNotice(`Password reset instructions sent to ${email}`);
        setTimeout(() => {
          setSuccessNotice('');
          setMode('login');
        }, 2000);
      } else {
        login(email, email.includes('admin') ? 'admin' : 'customer');
      }
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/70 backdrop-blur-xs">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden border border-surface-border">
        {/* Top brand header */}
        <div className="p-4 border-b border-surface-border bg-stone-50 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-brand-crimson text-white flex items-center justify-center font-serif font-bold text-lg">
              B
            </div>
            <div>
              <h3 className="text-sm font-bold text-obsidian">
                {mode === 'login' && 'Sign in to Bharathi Store'}
                {mode === 'register' && 'Create Customer Account'}
                {mode === 'forgot' && 'Reset Your Password'}
              </h3>
              <p className="text-[11px] text-muted">Access your orders, fast checkout & saved addresses</p>
            </div>
          </div>
          <button
            onClick={() => setIsAuthModalOpen(false)}
            className="text-stone-400 hover:text-stone-700 p-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          {successNotice ? (
            <div className="p-4 bg-green-50 text-supermarket-fresh rounded-xl border border-green-200 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 shrink-0" />
              <span>{successNotice}</span>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-3.5">
              {mode === 'register' && (
                <>
                  <div>
                    <label className="block text-xs font-medium text-stone-700 mb-1">Full Name</label>
                    <div className="relative">
                      <User className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        required
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="e.g. Meenakshi Sundaram"
                        className="w-full text-xs pl-9 pr-3 py-2 border border-surface-border rounded-lg focus:border-brand-crimson focus:outline-hidden"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-stone-700 mb-1">Phone Number (For Order Delivery SMS)</label>
                    <div className="relative">
                      <Phone className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="tel"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+91 98421 XXXXX"
                        className="w-full text-xs pl-9 pr-3 py-2 border border-surface-border rounded-lg focus:border-brand-crimson focus:outline-hidden"
                      />
                    </div>
                  </div>
                </>
              )}

              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1">Email Address</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full text-xs pl-9 pr-3 py-2 border border-surface-border rounded-lg focus:border-brand-crimson focus:outline-hidden"
                  />
                </div>
              </div>

              {mode !== 'forgot' && (
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="block text-xs font-medium text-stone-700">Password</label>
                    {mode === 'login' && (
                      <button
                        type="button"
                        onClick={() => setMode('forgot')}
                        className="text-[11px] text-brand-crimson hover:underline"
                      >
                        Forgot password?
                      </button>
                    )}
                  </div>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full text-xs pl-9 pr-3 py-2 border border-surface-border rounded-lg focus:border-brand-crimson focus:outline-hidden"
                    />
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 bg-brand-crimson text-white rounded-lg text-xs font-semibold hover:bg-brand-crimson-dark transition-all duration-150 flex items-center justify-center gap-1.5 shadow-sm active:scale-[0.99]"
              >
                <span>
                  {loading 
                    ? 'Processing...' 
                    : mode === 'login' 
                    ? 'Sign In to Account' 
                    : mode === 'register' 
                    ? 'Create My Account' 
                    : 'Send Reset Link'}
                </span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </form>
          )}

          {/* Quick toggle demo credentials */}
          <div className="mt-4 pt-4 border-t border-surface-border text-center text-xs space-y-2">
            {mode === 'login' ? (
              <p className="text-muted">
                New to Bharathi Store?{' '}
                <button
                  type="button"
                  onClick={() => setMode('register')}
                  className="font-semibold text-brand-crimson hover:underline"
                >
                  Create an account
                </button>
              </p>
            ) : (
              <p className="text-muted">
                Already registered?{' '}
                <button
                  type="button"
                  onClick={() => setMode('login')}
                  className="font-semibold text-brand-crimson hover:underline"
                >
                  Sign In
                </button>
              </p>
            )}

            {/* Quick Demo Fill Buttons for Testing */}
            <div className="pt-2 flex justify-center gap-2 text-[11px]">
              <button
                type="button"
                onClick={() => {
                  setEmail('karthik@example.com');
                  setPassword('password123');
                  login('karthik@example.com', 'customer');
                }}
                className="px-2 py-1 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded transition-colors"
              >
                Quick Customer Login
              </button>
              <button
                type="button"
                onClick={() => {
                  setEmail('admin@bharathistore.com');
                  setPassword('adminpass');
                  login('admin@bharathistore.com', 'admin');
                }}
                className="px-2 py-1 bg-brand-crimson-tint hover:bg-red-100 text-brand-crimson rounded font-semibold transition-colors"
              >
                Quick Admin Login
              </button>
            </div>
          </div>
        </div>

        <div className="p-3 bg-stone-50 border-t border-surface-border flex items-center justify-center gap-1.5 text-[11px] text-muted">
          <ShieldCheck className="w-3.5 h-3.5 text-supermarket-fresh" />
          <span>Bharathi Store Customer Security Guarantee</span>
        </div>
      </div>
    </div>
  );
};
