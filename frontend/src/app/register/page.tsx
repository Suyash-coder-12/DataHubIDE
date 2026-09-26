"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { Code, ArrowRight, Lock, User, Loader2 } from 'lucide-react';

export default function RegisterPage() {
  const [studentId, setStudentId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Artificial delay for smooth animation demonstration
    await new Promise(r => setTimeout(r, 600));

    try {
      await axios.post('http://localhost:8080/api/auth/register', {
        student_id: studentId,
        password: password,
      });
      
      // Success animation delay
      setTimeout(() => router.push('/login'), 400);
    } catch (err: any) {
      setError(err.response?.data || 'Registration failed');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 relative overflow-hidden selection:bg-corporate-red-500 selection:text-white">
      {/* Animated Background Shapes */}
      <motion.div 
        animate={{ 
          scale: [1, 1.3, 1],
          rotate: [0, -90, 0],
        }}
        transition={{ duration: 22, repeat: Infinity, ease: "linear" }}
        className="absolute -top-[20%] -right-[10%] w-[50%] h-[50%] rounded-full bg-red-100/40 blur-3xl pointer-events-none"
      />
      <motion.div 
        animate={{ 
          scale: [1, 1.4, 1],
          rotate: [0, 90, 0],
        }}
        transition={{ duration: 28, repeat: Infinity, ease: "linear" }}
        className="absolute -bottom-[20%] -left-[10%] w-[60%] h-[60%] rounded-full bg-orange-100/40 blur-3xl pointer-events-none"
      />

      <motion.div 
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="max-w-md w-full p-10 bg-white/80 backdrop-blur-xl rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white relative z-10 mx-4"
      >
        <div className="text-center mb-10">
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
            className="w-16 h-16 bg-gradient-to-tr from-corporate-red-600 to-corporate-red-400 rounded-2xl mx-auto flex items-center justify-center shadow-lg shadow-corporate-red-500/30 mb-6"
          >
            <Code className="w-8 h-8 text-white" />
          </motion.div>
          <motion.h2 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-3xl font-bold text-gray-900 tracking-tight"
          >
            Create account
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-gray-500 mt-2"
          >
            Join the platform and start coding
          </motion.p>
        </div>
        
        <AnimatePresence>
          {error && (
            <motion.div 
              initial={{ opacity: 0, height: 0, y: -10 }}
              animate={{ opacity: 1, height: 'auto', y: 0 }}
              exit={{ opacity: 0, height: 0, y: -10 }}
              className="mb-6 overflow-hidden"
            >
              <div className="p-4 bg-red-50 border border-red-100 text-red-600 rounded-xl text-sm font-medium flex items-center relative">
                <div className="w-1 h-full bg-red-500 rounded-full mr-3 absolute left-0 top-0 bottom-0" />
                <span className="ml-2">{error}</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <form onSubmit={handleSubmit} className="space-y-5">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
          >
            <label className="block text-sm font-semibold text-gray-700 mb-1.5 ml-1">Student ID</label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-corporate-red-500 transition-colors">
                <User className="h-5 w-5" />
              </div>
              <input
                type="text"
                required
                className="block w-full pl-11 pr-4 py-3.5 bg-gray-50/50 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-corporate-red-500/20 focus:border-corporate-red-500 transition-all duration-300"
                placeholder="e.g. 2026BTECS0001"
                value={studentId}
                onChange={(e) => setStudentId(e.target.value)}
              />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
          >
            <label className="block text-sm font-semibold text-gray-700 mb-1.5 ml-1">Password</label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-corporate-red-500 transition-colors">
                <Lock className="h-5 w-5" />
              </div>
              <input
                type="password"
                required
                className="block w-full pl-11 pr-4 py-3.5 bg-gray-50/50 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-corporate-red-500/20 focus:border-corporate-red-500 transition-all duration-300"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="pt-2"
          >
            <motion.button
              whileHover={{ scale: 1.02, translateY: -2 }}
              whileTap={{ scale: 0.98 }}
              disabled={isLoading}
              type="submit"
              className="w-full flex justify-center items-center py-3.5 px-4 rounded-xl shadow-lg shadow-corporate-red-500/25 text-sm font-bold text-white bg-corporate-red-500 hover:bg-corporate-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-corporate-red-500 transition-all overflow-hidden relative"
            >
              <AnimatePresence mode="wait">
                {isLoading ? (
                  <motion.div
                    key="loading"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="flex items-center"
                  >
                    <Loader2 className="w-5 h-5 animate-spin" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="text"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="flex items-center"
                  >
                    Create Account <ArrowRight className="ml-2 w-4 h-4" />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          </motion.div>
        </form>

        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
          className="mt-8 text-center text-sm text-gray-500 font-medium"
        >
          Already have an account?{' '}
          <Link href="/login" className="font-bold text-corporate-blue-600 hover:text-corporate-blue-700 transition-colors relative group">
            Sign in
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-corporate-blue-600 group-hover:w-full transition-all duration-300" />
          </Link>
        </motion.p>
      </motion.div>
    </div>
  );
}
