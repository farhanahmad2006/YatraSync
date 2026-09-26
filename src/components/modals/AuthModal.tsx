import React, { useState, useEffect } from 'react';
import { X, User, Store, ArrowRight, ShieldCheck, Phone, CheckCircle2, Lock, ArrowLeft, Car, Building2, KeyRound, AlertTriangle, Mail, Activity } from 'lucide-react';
import { UserSession, TourOperatorSubRole, UserRoleCategory, normalizeUserRole } from '../../types';

export type AuthMode = 'signin' | 'register';
export type MainAuthCategory = 'traveler' | 'partner';
export type PartnerTypeCategory = 'tour_operator' | 'hotel_partner';
export type LoginMethod = 'otp' | 'password';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (session: UserSession) => void;
  initialRole?: 'traveler' | 'host' | 'partner' | 'tour_operator' | 'hotel_partner';
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onLogin,
  initialRole = 'traveler'
}) => {
  // Auth Mode: Sign In | Register
  const [authMode, setAuthMode] = useState<AuthMode>('signin');
  // Login Method: OTP | Password
  const [loginMethod, setLoginMethod] = useState<LoginMethod>('password');

  // Main Category: Traveler | Partner
  const [mainCategory, setMainCategory] = useState<MainAuthCategory>(
    initialRole === 'traveler' ? 'traveler' : 'partner'
  );
  
  // Partner Category: Tour Operator | Hotel Partner
  const [partnerType, setPartnerType] = useState<PartnerTypeCategory>(
    initialRole === 'hotel_partner' ? 'hotel_partner' : 'tour_operator'
  );

  // Tour Operator Sub-role: Guide | Driver | Guide + Driver
  const [operatorSubRole, setOperatorSubRole] = useState<TourOperatorSubRole>('GUIDE_DRIVER');

  const [name, setName] = useState('');
  const [loginId, setLoginId] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState(['', '', '', '']);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [step, setStep] = useState<'credentials' | 'otp'>('credentials');
  const [isLoading, setIsLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Sync state when initialRole changes
  useEffect(() => {
    if (initialRole === 'traveler') {
      setMainCategory('traveler');
    } else if (initialRole === 'hotel_partner') {
      setMainCategory('partner');
      setPartnerType('hotel_partner');
      setAuthMode('signin');
    } else {
      setMainCategory('partner');
      setPartnerType('tour_operator');
      setAuthMode('signin');
    }
  }, [initialRole]);

  // Reset form on open/close
  useEffect(() => {
    if (isOpen) {
      setStep('credentials');
      setErrorMsg('');
      setIsLoading(false);
      setOtp(['', '', '', '']);
      setPassword('');
      setSessionId(null);
      if (mainCategory === 'partner') {
        setAuthMode('signin');
      }
    }
  }, [isOpen, mainCategory]);

  // OTP Countdown timer
  useEffect(() => {
    let interval: any = null;
    if (step === 'otp' && resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    } else if (resendTimer === 0) {
      setCanResend(true);
    }
    return () => clearInterval(interval);
  }, [step, resendTimer]);

  if (!isOpen) return null;

  const resetFormAndClose = () => {
    setStep('credentials');
    setOtp(['', '', '', '']);
    setErrorMsg('');
    setIsLoading(false);
    setPassword('');
    setSessionId(null);
    onClose();
  };

  const isSignInMode = mainCategory === 'partner' || authMode === 'signin';

  const handleSendOtpOrLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isSignInMode) {
      const identifier = loginId.trim() || phone.trim();
      if (!identifier) {
        setErrorMsg('Please enter your Login ID, Email, or Mobile number');
        return;
      }
      if (loginMethod === 'password') {
        if (!password.trim()) {
          setErrorMsg('Please enter your account password');
          return;
        }
        executeUserLogin(identifier, undefined, password.trim());
        return;
      }
      
      // OTP mode
      setErrorMsg('');
      setIsLoading(true);
      try {
        const res = await fetch('/api/v1/auth/request-otp', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            phone_or_email: identifier,
            purpose: 'LOGIN'
          })
        });
        const data = await res.json().catch(() => ({}));
        if (res.ok) {
          setSessionId(data.session_id);
          setStep('otp');
          setResendTimer(30);
          setCanResend(false);
        } else {
          setErrorMsg(data.detail || data.message || 'Could not request OTP. Please verify your credentials.');
        }
      } catch (err) {
        setErrorMsg('Unable to reach server. Please check your connection.');
      } finally {
        setIsLoading(false);
      }
      return;
    }

    // Register mode
    if (!name.trim()) {
      setErrorMsg('Please enter your Full Name');
      return;
    }
    if (!phone.trim() && !email.trim()) {
      setErrorMsg('Please provide a Mobile Number or Email Address');
      return;
    }
    if (!password.trim()) {
      setErrorMsg('Please create an account password');
      return;
    }

    executeUserLogin(phone.trim() || email.trim(), undefined, password.trim());
  };

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) value = value[value.length - 1];
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 3) {
      const nextInput = document.getElementById(`auth-otp-input-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`auth-otp-input-${index - 1}`);
      prevInput?.focus();
    }
  };

  const executeUserLogin = async (credentialKey: string, enteredOtp?: string, pwdKey?: string) => {
    setErrorMsg('');
    setIsLoading(true);

    try {
      const endpoint = authMode === 'signin' ? '/api/v1/auth/login' : '/api/v1/auth/register';
      const payload = authMode === 'signin' ? {
        phone_or_email: credentialKey,
        session_id: sessionId,
        password: pwdKey,
        otp: enteredOtp
      } : {
        name: name.trim(),
        phone: phone.trim() || credentialKey,
        email: email.trim() || (credentialKey.includes('@') ? credentialKey : undefined),
        password: pwdKey,
        otp: enteredOtp,
        session_id: sessionId,
        role: mainCategory === 'partner' ? (partnerType === 'hotel_partner' ? 'HOTEL_OWNER' : partnerType === 'tour_operator' ? 'TOUR_OPERATOR' : 'TRANSPORT_ADMIN') : 'CUSTOMER',
        operator_sub_role: operatorSubRole
      };

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        const errorDetail = typeof data.detail === 'string' 
          ? data.detail 
          : (data.detail?.detail || data.detail?.message || data.message || 'Authentication failed. Please check your credentials.');
        setErrorMsg(errorDetail);
        setIsLoading(false);
        return;
      }

      // Authentic User Record from Database
      const dbUser = data.user;
      if (!dbUser) {
        setErrorMsg('Authentication error: Incomplete user response from database.');
        setIsLoading(false);
        return;
      }

      // Map backend database role to canonical UserRoleCategory
      const sessionRole: UserRoleCategory = normalizeUserRole(dbUser.role);

      const session: UserSession = {
        id: dbUser.id,
        name: dbUser.name,
        phone: dbUser.phone || dbUser.mobile,
        email: dbUser.email,
        role: sessionRole,
        operatorSubRole: dbUser.operatorSubRole,
        partnerId: dbUser.partnerId,
        hotelPropertyId: dbUser.hotelPropertyId,
        onboardingStatus: 'COMPLETED',
        verificationStatus: 'VERIFIED'
      };

      if (data.access_token) {
        localStorage.setItem('safarsetu_token', data.access_token);
      }
      localStorage.setItem('safarsetu_user', JSON.stringify(session));

      setIsLoading(false);
      onLogin(session);
      onClose();
    } catch (err) {
      console.error("Backend auth connection error:", err);
      setErrorMsg('Unable to connect to authentication server. Please check your network.');
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    const enteredOtp = otp.join('');
    
    if (enteredOtp.length < 4) {
      setErrorMsg('Please enter the complete 4-digit OTP code');
      return;
    }

    const credentialKey = loginId.trim() || phone.trim() || email.trim() || name.trim();
    if (!credentialKey) {
      setErrorMsg('Please enter your mobile or email');
      return;
    }

    executeUserLogin(credentialKey, enteredOtp);
  };

  const handleResendOtp = async () => {
    setResendTimer(30);
    setCanResend(false);
    setOtp(['', '', '', '']);
    const identifier = loginId.trim() || phone.trim() || email.trim();
    try {
      const res = await fetch('/api/v1/auth/request-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone_or_email: identifier,
          purpose: authMode === 'signin' ? 'LOGIN' : 'REGISTRATION'
        })
      });
      if (res.ok) {
        const data = await res.json();
        setSessionId(data.session_id);
      }
    } catch (e) {
      console.warn("Resend OTP request error:", e);
    }
    setErrorMsg('A new 4-digit OTP code has been requested.');
    setTimeout(() => setErrorMsg(''), 4000);
  };

  return (
    <div 
      id="auth-modal-backdrop" 
      className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200"
    >
      <div 
        id="auth-modal-box" 
        className="bg-white w-full max-w-md rounded-3xl overflow-hidden shadow-2xl border border-slate-200 flex flex-col text-left transition-all duration-300 max-h-[92vh] overflow-y-auto"
      >
        
        {/* Top Header Banner */}
        <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 p-6 text-white relative">
          
          {/* Close Button */}
          <button
            onClick={resetFormAndClose}
            className="absolute top-5 right-5 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-xs text-white flex items-center justify-center transition cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-4 h-4" />
          </button>

          {/* UPPER LEFT CORNER: TRAVELER vs PARTNER TOGGLE SWITCH */}
          <div className="flex items-center gap-2 mb-4">
            <div className="inline-flex p-1 bg-white/10 backdrop-blur-md rounded-2xl border border-white/15">
              <button
                type="button"
                onClick={() => {
                  setMainCategory('traveler');
                  setErrorMsg('');
                }}
                className={`px-4 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                  mainCategory === 'traveler' 
                    ? 'bg-white text-slate-950 shadow-xs' 
                    : 'text-white/80 hover:text-white'
                }`}
              >
                <User className="w-3.5 h-3.5" />
                <span>Traveler</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setMainCategory('partner');
                  setAuthMode('signin');
                  setErrorMsg('');
                }}
                className={`px-4 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                  mainCategory === 'partner' 
                    ? 'bg-orange-600 text-white shadow-xs' 
                    : 'text-white/80 hover:text-white'
                }`}
              >
                <Store className="w-3.5 h-3.5" />
                <span>Partner</span>
              </button>
            </div>
          </div>

          <h3 className="font-serif font-bold text-2xl text-white tracking-tight">
            {step === 'credentials' 
              ? (mainCategory === 'partner' ? "YatraSync Partner Access" : "YatraSync Traveler Access") 
              : "Verify OTP Code"
            }
          </h3>
          <p className="text-xs text-slate-300 mt-1 leading-relaxed">
            {step === 'credentials'
              ? (mainCategory === 'partner' 
                  ? "Sign in to manage your verified hotel property or tour fleet operations" 
                  : "Explore India with zero-commission local experiences and curated trips")
              : "Enter the 4-digit verification code sent to your phone"
            }
          </p>

        </div>

        {/* Form Body */}
        <div className="p-6 space-y-5 bg-white">
          
          {errorMsg && (
            <div className="p-3.5 rounded-xl border text-xs font-medium flex items-center gap-2 bg-red-50 border-red-300 text-red-900 font-bold animate-in fade-in">
              <AlertTriangle className="w-4 h-4 shrink-0 text-red-600" />
              <span>{errorMsg}</span>
            </div>
          )}

          {step === 'credentials' ? (
            <form onSubmit={handleSendOtpOrLogin} className="space-y-4">

              {/* SIGN IN vs REGISTER TOGGLE SWITCH (Travelers only) */}
              {mainCategory === 'traveler' ? (
                <div className="p-1 bg-slate-950 rounded-2xl flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => { setAuthMode('signin'); setErrorMsg(''); }}
                    className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition text-center cursor-pointer ${
                      authMode === 'signin' 
                        ? 'bg-orange-600 text-white shadow-sm' 
                        : 'text-slate-300 hover:text-white'
                    }`}
                  >
                    Sign In
                  </button>

                  <button
                    type="button"
                    onClick={() => { setAuthMode('register'); setErrorMsg(''); }}
                    className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition text-center cursor-pointer ${
                      authMode === 'register' 
                        ? 'bg-orange-600 text-white shadow-sm' 
                        : 'text-slate-300 hover:text-white'
                    }`}
                  >
                    Register
                  </button>
                </div>
              ) : (
                <div className="px-3.5 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800 flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-orange-600" />
                    <span>Partner Portal Sign In</span>
                  </span>
                  <span className="text-[10px] font-semibold text-slate-500 bg-slate-200/70 px-2 py-0.5 rounded-md">
                    Admin Assigned
                  </span>
                </div>
              )}
              
              {/* Partner Category Selector (If Partner chosen) */}
              {mainCategory === 'partner' && (
                <div className="space-y-2">
                  <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider">
                    SELECT YOUR PARTNER CATEGORY:
                  </label>
                  <div className="grid grid-cols-2 gap-2.5">
                    <button
                      type="button"
                      onClick={() => setPartnerType('tour_operator')}
                      className={`p-3 rounded-2xl border text-left transition flex flex-col justify-between cursor-pointer ${
                        partnerType === 'tour_operator'
                          ? 'bg-amber-50/70 border-amber-400 ring-2 ring-amber-500/80 text-amber-950 font-bold shadow-2xs'
                          : 'bg-slate-50 border-slate-200 hover:bg-slate-100 text-slate-700'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <div className="w-8 h-8 rounded-xl bg-orange-100 flex items-center justify-center text-orange-600">
                          <Car className="w-4 h-4" />
                        </div>
                        <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${partnerType === 'tour_operator' ? 'border-orange-600 bg-orange-600' : 'border-slate-300'}`}>
                          {partnerType === 'tour_operator' && <div className="w-1.5 h-1.5 rounded-full bg-white"></div>}
                        </div>
                      </div>
                      <div>
                        <span className="block font-bold text-xs">Tour Operator</span>
                        <span className="block text-[10px] text-slate-500 font-normal leading-tight mt-0.5">Guide and drive travellers throughout their tour.</span>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPartnerType('hotel_partner')}
                      className={`p-3 rounded-2xl border text-left transition flex flex-col justify-between cursor-pointer ${
                        partnerType === 'hotel_partner'
                          ? 'bg-amber-50/70 border-amber-400 ring-2 ring-amber-500/80 text-amber-950 font-bold shadow-2xs'
                          : 'bg-slate-50 border-slate-200 hover:bg-slate-100 text-slate-700'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <div className="w-8 h-8 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600">
                          <Building2 className="w-4 h-4" />
                        </div>
                        <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${partnerType === 'hotel_partner' ? 'border-orange-600 bg-orange-600' : 'border-slate-300'}`}>
                          {partnerType === 'hotel_partner' && <div className="w-1.5 h-1.5 rounded-full bg-white"></div>}
                        </div>
                      </div>
                      <div>
                        <span className="block font-bold text-xs">Hotel Partner</span>
                        <span className="block text-[10px] text-slate-500 font-normal leading-tight mt-0.5">List and manage your hotel or property.</span>
                      </div>
                    </button>
                  </div>

                  {/* Clear Admin Assignment Guidance */}
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/90 text-[11px] text-slate-700 flex items-center gap-2">
                    <KeyRound className="w-3.5 h-3.5 text-orange-600 shrink-0" />
                    <span>
                      {partnerType === 'hotel_partner'
                        ? "Hotel Partner credentials are assigned by the Hotel Admin. Use assigned email & password to login."
                        : "Tour Operator credentials are assigned by the Transport Admin. Use assigned email & password to login."
                      }
                    </span>
                  </div>
                </div>
              )}

              {/* INPUT FIELDS: Strictly Sign-in for Partner Category */}
              {isSignInMode ? (
                /* SIGN IN INPUTS */
                <div className="space-y-3">
                  
                  {/* Verification Mode Selector: Password vs OTP */}
                  <div className="flex items-center justify-between text-[11px] font-bold text-slate-700 pt-1">
                    <span>VERIFY IDENTITY VIA:</span>
                    <div className="flex bg-slate-100 p-0.5 rounded-lg border border-slate-200">
                      <button
                        type="button"
                        onClick={() => setLoginMethod('password')}
                        className={`px-2.5 py-1 rounded-md transition cursor-pointer ${loginMethod === 'password' ? 'bg-white text-orange-600 font-extrabold shadow-2xs' : 'text-slate-500'}`}
                      >
                        Password
                      </button>
                      <button
                        type="button"
                        onClick={() => setLoginMethod('otp')}
                        className={`px-2.5 py-1 rounded-md transition cursor-pointer ${loginMethod === 'otp' ? 'bg-white text-orange-600 font-extrabold shadow-2xs' : 'text-slate-500'}`}
                      >
                        OTP
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1">
                      Login ID / Email / Mobile <span className="text-orange-600">*</span>
                    </label>
                    <div className="relative flex items-center">
                      <User className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
                      <input
                        type="text"
                        value={loginId}
                        onChange={(e) => setLoginId(e.target.value)}
                        placeholder={partnerType === 'hotel_partner' ? "e.g. owner_a@munnartea.in or 919447188990" : "e.g. transport@storyteller.in or 919876543210"}
                        className="w-full pl-10 pr-3 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:bg-white transition shadow-2xs"
                        required
                      />
                    </div>
                  </div>

                  {loginMethod === 'password' && (
                    <div>
                      <label className="block text-xs font-bold text-slate-800 mb-1">
                        Account Password <span className="text-orange-600">*</span>
                      </label>
                      <div className="relative flex items-center">
                        <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
                        <input
                          type="password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="Enter your account password"
                          className="w-full pl-10 pr-3 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:bg-white transition shadow-2xs"
                          required
                        />
                      </div>
                    </div>
                  )}

                </div>
              ) : (
                /* REGISTER INPUTS (Traveler only) */
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1">
                      Full Name <span className="text-orange-600">*</span>
                    </label>
                    <div className="relative flex items-center">
                      <User className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g. Rajesh Kumar"
                        className="w-full pl-10 pr-3 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:bg-white transition shadow-2xs"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1">
                      Email Address <span className="text-orange-600">*</span>
                    </label>
                    <div className="relative flex items-center">
                      <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="e.g. rajesh@example.com"
                        className="w-full pl-10 pr-3 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:bg-white transition shadow-2xs"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1">
                      Mobile Number <span className="text-orange-600">*</span>
                    </label>
                    <div className="flex items-center gap-2">
                      <div className="px-3.5 py-3 bg-slate-100 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 shrink-0 flex items-center gap-1">
                        <span>IN</span>
                        <span>+91</span>
                      </div>
                      <div className="relative flex-1 flex items-center">
                        <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
                        <input
                          type="tel"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="9876543210"
                          className="w-full pl-10 pr-3 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:bg-white transition shadow-2xs"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1">
                      Create Password <span className="text-orange-600">*</span>
                    </label>
                    <div className="relative flex items-center">
                      <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
                      <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Create a strong account password"
                        className="w-full pl-10 pr-3 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:bg-white transition shadow-2xs"
                        required
                      />
                    </div>
                  </div>

                </div>
              )}

              {/* DigiLocker / Network Badge */}
              <div className="p-3 rounded-2xl bg-emerald-50/80 border border-emerald-200/90 text-emerald-900 flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-xl bg-emerald-100 flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-4 h-4 text-emerald-700" />
                </div>
                <div className="text-[11px] leading-tight">
                  <span className="font-bold block text-emerald-950">
                    {mainCategory === 'partner' ? "Official YatraSync Partner Network" : "Aadhaar & DigiLocker Verified"}
                  </span>
                  <span className="text-emerald-700">
                    {mainCategory === 'partner'
                      ? "Direct property asset management & fleet operations. Access provisioned by platform admins."
                      : "Instant identity sync & zero-commission travel guarantee."}
                  </span>
                </div>
              </div>

              {/* Primary CTA Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 bg-orange-600 hover:bg-orange-700 active:scale-[0.99] text-white rounded-xl font-bold text-xs tracking-wider uppercase shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    <span>Processing...</span>
                  </span>
                ) : (
                  <>
                    <span>
                      {isSignInMode 
                        ? (loginMethod === 'password' ? "SIGN IN WITH PASSWORD" : "GET LOGIN OTP") 
                        : "REGISTER ACCOUNT"
                      }
                    </span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

            </form>
          ) : (
            /* STEP 2: OTP Verification Flow */
            <form onSubmit={handleVerifyOtp} className="space-y-5">
              
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span className="text-slate-700 font-medium">OTP sent to <strong>{loginId || phone || email || name || 'User'}</strong></span>
                </div>
                <button
                  type="button"
                  onClick={() => { setStep('credentials'); setErrorMsg(''); }}
                  className="text-orange-700 font-bold hover:underline flex items-center gap-1 text-[11px] cursor-pointer"
                >
                  <ArrowLeft className="w-3 h-3" />
                  <span>Edit</span>
                </button>
              </div>

              {/* 4 Digit OTP Boxes */}
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-2 text-center">
                  Enter 4-Digit Verification Code
                </label>
                <div className="flex justify-center gap-3">
                  {[0, 1, 2, 3].map((index) => (
                    <input
                      key={index}
                      id={`auth-otp-input-${index}`}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={otp[index]}
                      onChange={(e) => handleOtpChange(index, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(index, e)}
                      className="w-12 h-14 bg-slate-50 border-2 border-slate-200 focus:border-orange-500 focus:bg-white rounded-xl text-center text-xl font-bold text-slate-900 focus:outline-none transition shadow-2xs"
                      autoFocus={index === 0}
                      required
                    />
                  ))}
                </div>
              </div>

              {/* Resend Timer */}
              <div className="flex items-center justify-between text-xs text-slate-600 pt-1">
                <span>Didn't receive code?</span>
                {canResend ? (
                  <button
                    type="button"
                    onClick={handleResendOtp}
                    className="text-orange-700 font-bold hover:underline cursor-pointer"
                  >
                    Resend Code
                  </button>
                ) : (
                  <span className="font-semibold text-slate-600">
                    Resend in <strong className="text-slate-800">{resendTimer}s</strong>
                  </span>
                )}
              </div>

              {/* Primary Verify Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 bg-slate-950 hover:bg-orange-600 active:scale-[0.99] text-white rounded-xl font-bold text-xs tracking-wider uppercase shadow-md transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    <span>Verifying Code...</span>
                  </span>
                ) : (
                  <>
                    <Lock className="w-3.5 h-3.5 text-orange-500" />
                    <span>Verify & Continue</span>
                  </>
                )}
              </button>

            </form>
          )}

          {/* Footer Disclaimer */}
          <p className="text-[10px] text-slate-600 text-center leading-relaxed pt-2 border-t border-slate-100">
            By proceeding, you agree to YatraSync's{' '}
            <span className="text-slate-700 font-bold hover:underline cursor-pointer">Terms of Service</span> &{' '}
            <span className="text-slate-700 font-bold hover:underline cursor-pointer">Privacy Policy</span>.
          </p>

        </div>

      </div>
    </div>
  );
};
