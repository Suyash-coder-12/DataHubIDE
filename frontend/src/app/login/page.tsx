"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { motion, AnimatePresence } from 'framer-motion';
import { Code, Eye, EyeOff, Loader2, Sparkles, Building2, GraduationCap, BookOpen, AlertCircle, Laptop, ShieldCheck } from 'lucide-react';
import { auth, db, googleProvider } from '@/lib/firebase';
import { signInWithPopup } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import Link from 'next/link';

export default function LoginPage() {
  const router = useRouter();
  const login = useAuthStore((state) => state.login);
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const roles = ['Student', 'Faculty', 'Admin'];
  const [selectedRole, setSelectedRole] = useState('Student');
  
  const [idValue, setIdValue] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Onboarding state
  const [isOnboarding, setIsOnboarding] = useState(false);
  const [firebaseUser, setFirebaseUser] = useState<any>(null);
  
  const [formData, setFormData] = useState({
    college: '',
    year: '',
    branch: ''
  });

  const handleManualLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    // Simulate backend login for the manual flow
    setTimeout(() => {
      if (idValue && password) {
        login('dummy_token', idValue, selectedRole.toLowerCase(), 1);
        router.push('/');
      } else {
        setError('Please enter valid credentials');
      }
      setIsLoading(false);
    }, 1000);
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    setError('');
    
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      setFirebaseUser(user);
      
      const userDocRef = doc(db, 'users', user.uid);
      const userDoc = await getDoc(userDocRef);
      
      if (userDoc.exists() && userDoc.data().college) {
        const data = userDoc.data();
        login(user.uid, data.studentId || user.email?.split('@')[0] || 'Unknown', data.role || 'student', 1);
        router.push('/');
      } else {
        setIsOnboarding(true);
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to authenticate with Google');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOnboardingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!firebaseUser) return;
    
    setIsLoading(true);
    try {
      const userDocRef = doc(db, 'users', firebaseUser.uid);
      await setDoc(userDocRef, {
        email: firebaseUser.email,
        name: firebaseUser.displayName,
        photoURL: firebaseUser.photoURL,
        role: selectedRole.toLowerCase(),
        ...formData,
        studentId: idValue || firebaseUser.email?.split('@')[0],
        createdAt: new Date().toISOString()
      }, { merge: true });
      
      login(firebaseUser.uid, idValue || firebaseUser.email?.split('@')[0], selectedRole.toLowerCase(), 1);
      router.push('/');
    } catch (err: any) {
      console.error(err);
      setError('Failed to save profile details');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex w-full bg-white font-sans selection:bg-teal-500/30">
      
      {/* Left Side: Form Container */}
      <div className="w-full lg:w-1/2 flex flex-col relative z-10 px-6 sm:px-12 md:px-24 pt-8 pb-12 overflow-y-auto">
        
        {/* Logo */}
        <div className="flex items-center space-x-2 text-teal-600 mb-16">
          <div className="bg-teal-600 p-1.5 rounded-lg">
            <Code className="text-white w-5 h-5" />
          </div>
          <span className="text-xl font-black tracking-tight text-gray-900">DataHub</span>
        </div>

        <div className="flex-1 flex flex-col justify-center max-w-md w-full mx-auto">
          {!isOnboarding ? (
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
              <h1 className="text-3xl font-bold text-gray-900 mb-2 tracking-tight">Hi there, good to see you back!</h1>
              <p className="text-gray-500 mb-8 text-sm">Log in to your account and start securing your digital life.</p>

              {/* Error Message */}
              <AnimatePresence>
                {error && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                    className="mb-6 overflow-hidden"
                  >
                    <div className="p-3 bg-red-50 border border-red-100 text-red-600 rounded-lg text-sm font-medium flex items-center">
                      <AlertCircle className="w-4 h-4 mr-2 flex-shrink-0" />
                      {error}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Role Selector */}
              <div className="flex bg-gray-100 p-1 rounded-xl mb-6">
                {roles.map((role) => (
                  <button
                    key={role}
                    type="button"
                    onClick={() => setSelectedRole(role)}
                    className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all ${
                      selectedRole === role 
                        ? 'bg-white text-gray-900 shadow-sm' 
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    {role}
                  </button>
                ))}
              </div>

              <form onSubmit={handleManualLogin} className="space-y-4">
                <div>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      value={idValue}
                      onChange={(e) => setIdValue(e.target.value)}
                      className="peer w-full px-4 pt-6 pb-2 bg-white border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-colors placeholder-transparent"
                      placeholder={`${selectedRole} ID`}
                    />
                    <label className="absolute left-4 top-2 text-xs font-semibold text-gray-400 peer-placeholder-shown:text-sm peer-placeholder-shown:top-4 peer-focus:top-2 peer-focus:text-xs peer-focus:text-teal-600 transition-all">
                      {selectedRole} ID
                    </label>
                  </div>
                </div>

                <div>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="peer w-full px-4 pt-6 pb-2 bg-white border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-colors placeholder-transparent pr-12"
                      placeholder="Password"
                    />
                    <label className="absolute left-4 top-2 text-xs font-semibold text-gray-400 peer-placeholder-shown:text-sm peer-placeholder-shown:top-4 peer-focus:top-2 peer-focus:text-xs peer-focus:text-teal-600 transition-all">
                      Password
                    </label>
                    <button 
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                <div className="flex justify-end pt-1">
                  <a href="#" className="text-sm font-bold text-teal-600 hover:text-teal-700">Forgot your password?</a>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3.5 px-4 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl shadow-lg shadow-teal-500/30 transition-all focus:ring-4 focus:ring-teal-500/20 mt-4 flex items-center justify-center"
                >
                  {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Log in'}
                </button>
              </form>

              <div className="flex items-center my-8">
                <div className="flex-1 border-t border-gray-200"></div>
                <span className="px-4 text-xs font-bold text-gray-400 uppercase tracking-wider">OR</span>
                <div className="flex-1 border-t border-gray-200"></div>
              </div>

              <div className="space-y-3">
                <button
                  onClick={handleGoogleLogin}
                  disabled={isLoading}
                  className="w-full py-3 px-4 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 font-bold rounded-xl transition-all flex items-center justify-center shadow-sm"
                >
                  <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  </svg>
                  Continue with Google
                </button>
              </div>

              <p className="mt-10 text-center text-sm font-medium text-gray-500">
                Don't have an account yet?{' '}
                <Link href="/register" className="font-bold text-teal-600 hover:text-teal-700">Get Started</Link>
              </p>
            </motion.div>
          ) : (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
              <h1 className="text-3xl font-bold text-gray-900 mb-2 tracking-tight">Almost there!</h1>
              <p className="text-gray-500 mb-8 text-sm">Fill in these details to complete your {selectedRole} profile.</p>

              <form onSubmit={handleOnboardingSubmit} className="space-y-4">
                <div>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      value={formData.college}
                      onChange={(e) => setFormData({...formData, college: e.target.value})}
                      className="peer w-full px-4 pt-6 pb-2 bg-white border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-colors placeholder-transparent"
                      placeholder="College / University"
                    />
                    <label className="absolute left-4 top-2 text-xs font-semibold text-gray-400 peer-placeholder-shown:text-sm peer-placeholder-shown:top-4 peer-focus:top-2 peer-focus:text-xs peer-focus:text-teal-600 transition-all">
                      College / University
                    </label>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="relative">
                      <input
                        type="number"
                        min="2000" max="2040"
                        required
                        value={formData.year}
                        onChange={(e) => setFormData({...formData, year: e.target.value})}
                        className="peer w-full px-4 pt-6 pb-2 bg-white border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-colors placeholder-transparent"
                        placeholder="Year"
                      />
                      <label className="absolute left-4 top-2 text-xs font-semibold text-gray-400 peer-placeholder-shown:text-sm peer-placeholder-shown:top-4 peer-focus:top-2 peer-focus:text-xs peer-focus:text-teal-600 transition-all">
                        Graduation Year
                      </label>
                    </div>
                  </div>
                  <div>
                    <div className="relative">
                      <input
                        type="text"
                        required
                        value={formData.branch}
                        onChange={(e) => setFormData({...formData, branch: e.target.value})}
                        className="peer w-full px-4 pt-6 pb-2 bg-white border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-colors placeholder-transparent"
                        placeholder="Branch"
                      />
                      <label className="absolute left-4 top-2 text-xs font-semibold text-gray-400 peer-placeholder-shown:text-sm peer-placeholder-shown:top-4 peer-focus:top-2 peer-focus:text-xs peer-focus:text-teal-600 transition-all">
                        Branch / Major
                      </label>
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3.5 px-4 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl shadow-lg shadow-teal-500/30 transition-all focus:ring-4 focus:ring-teal-500/20 mt-4 flex items-center justify-center"
                >
                  {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Complete Setup'}
                </button>
              </form>
            </motion.div>
          )}
        </div>
      </div>

      {/* Right Side: Surfshark / Apple Liquid Gradient Concentric Theme */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-[#020b14] overflow-hidden items-center justify-center">
        
        {/* Deep background mesh */}
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>

        {/* Concentric blurred circles forming a liquid tunnel effect */}
        <motion.div 
          animate={{ scale: [1, 1.05, 1], rotate: [0, 5, 0] }} 
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          className="absolute w-[140%] aspect-square rounded-full bg-cyan-950 blur-[40px] opacity-80"
        ></motion.div>
        
        <motion.div 
          animate={{ scale: [1, 1.1, 1], rotate: [0, -5, 0] }} 
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          className="absolute w-[110%] aspect-square rounded-full bg-teal-900 blur-[40px] opacity-90"
        ></motion.div>
        
        <motion.div 
          animate={{ scale: [1, 1.05, 1], rotate: [0, 10, 0] }} 
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute w-[80%] aspect-square rounded-full bg-teal-700 blur-[30px]"
        ></motion.div>
        
        <motion.div 
          animate={{ scale: [1, 1.1, 1] }} 
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute w-[50%] aspect-square rounded-full bg-teal-500 blur-[20px] shadow-[0_0_100px_rgba(20,184,166,0.8)]"
        ></motion.div>

        {/* Central Element / Glass Icon */}
        <div className="relative z-10 p-8 rounded-3xl bg-white/10 backdrop-blur-3xl border border-white/20 shadow-2xl flex items-center justify-center transform rotate-12 hover:rotate-0 transition-all duration-500 cursor-pointer group">
           <Code className="w-24 h-24 text-white drop-shadow-xl group-hover:scale-110 transition-transform duration-500" />
        </div>
      </div>
    </div>
  );
}
