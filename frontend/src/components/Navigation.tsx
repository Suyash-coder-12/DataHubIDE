"use client";

import Link from 'next/link';
import { useAuthStore } from '@/store/authStore';
import { useRouter, usePathname } from 'next/navigation';
import { Search, Flame, Bell, Book, ClipboardList, Coins, Settings, LogOut, Code, User, Sun, Sparkles, MessageSquare, Briefcase } from 'lucide-react';
import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Navigation() {
  const { token, studentId, logout, userId } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
    if (token && !userId) {
      logout();
      router.push('/login');
    }

    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [token, userId, logout, router]);

  if (!mounted || !token || pathname.startsWith('/admin')) return null;

  return (
    <div className="fixed z-50 flex pointer-events-none bottom-4 left-1/2 -translate-x-1/2 w-[95%] md:w-auto md:left-0 md:top-0 md:-translate-x-0 md:h-full md:items-center md:pl-6">
      <motion.nav 
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 20 }}
        className="bg-white/80 backdrop-blur-3xl border border-gray-200/50 shadow-[0_8px_40px_rgba(0,0,0,0.08)] text-gray-700 
          flex flex-row md:flex-col justify-around md:justify-between items-center py-3 md:py-8 px-4 md:px-0 
          w-full md:w-20 rounded-[2rem] md:rounded-[2.5rem] h-auto md:h-[90vh] pointer-events-auto transition-all"
      >
        
        {/* Top: Logo & Main Nav */}
        <div className="flex flex-row md:flex-col items-center space-x-1 md:space-x-0 md:space-y-8 w-auto md:w-full">
          {/* Logo (Hidden on mobile to save space) */}
          <Link href="/" className="hidden md:flex flex-col items-center group mb-2">
            <motion.div 
              whileHover={{ rotate: 180, scale: 1.1 }}
              transition={{ type: "spring", stiffness: 200, damping: 10 }}
              className="h-12 w-12 rounded-full bg-gradient-to-tr from-blue-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-cyan-500/20"
            >
              <Code className="h-6 w-6 text-white" />
            </motion.div>
          </Link>
          
          {/* Main Links */}
          <div className="flex flex-row md:flex-col space-x-2 sm:space-x-4 md:space-x-0 md:space-y-6 w-full items-center">
            <NavIcon href="/problems" active={pathname.includes('problems')} icon={<ClipboardList className="h-5 w-5 md:h-6 md:w-6" />} label="Problems" />
            <NavIcon href="/contest" active={pathname.includes('contest')} icon={<Book className="h-5 w-5 md:h-6 md:w-6" />} label="Contest" />
            <NavIcon href="/discuss" active={pathname.includes('discuss')} icon={<MessageSquare className="h-5 w-5 md:h-6 md:w-6" />} label="Discuss" />
            <NavIcon href="/interview" active={pathname.includes('interview')} icon={<Briefcase className="h-5 w-5 md:h-6 md:w-6" />} label="Interview" />
          </div>
        </div>
        
        {/* Separator on mobile */}
        <div className="h-8 w-px bg-gray-200 md:hidden mx-1"></div>

        {/* Bottom: Actions & Profile */}
        <div className="flex flex-row md:flex-col items-center space-x-2 sm:space-x-4 md:space-x-0 md:space-y-6 w-auto md:w-full relative" ref={profileRef}>
          <div className="hidden md:block h-px w-8 bg-gray-200 rounded-full"></div>
          
          <div className="hidden sm:flex md:flex items-center space-x-2 md:space-x-0 md:flex-col md:space-y-6">
             <IconButton icon={<Search className="h-5 w-5 md:h-6 md:w-6" />} label="Search" />
             <div className="relative">
                <IconButton icon={<Bell className="h-5 w-5 md:h-6 md:w-6" />} label="Notifications" />
                <span className="absolute -top-1 -right-1 h-3 w-3 md:h-4 md:w-4 rounded-full bg-red-500 text-[8px] md:text-[10px] font-bold text-white flex items-center justify-center shadow-[0_0_8px_rgba(239,68,68,0.4)]">3</span>
             </div>
             <IconButton icon={<Flame className="h-5 w-5 md:h-6 md:w-6 text-orange-500" />} label="Streak" />
          </div>
          
          {/* Profile Button */}
          <motion.button 
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="md:mt-2 flex items-center justify-center focus:outline-none rounded-full ring-2 ring-transparent hover:ring-cyan-500/30 transition-all group"
          >
            <div className="h-8 w-8 md:h-10 md:w-10 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center text-white overflow-hidden shadow-md">
              <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${studentId || 'default'}`} alt="Avatar" className="h-full w-full object-cover" />
            </div>
          </motion.button>

          {/* Profile Dropdown */}
          <AnimatePresence>
            {isProfileOpen && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
                className="absolute right-0 bottom-16 md:right-auto md:left-20 md:bottom-0 mb-2 w-72 bg-white/90 backdrop-blur-3xl border border-gray-200/50 rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.1)] p-2 z-50 text-gray-700 md:origin-bottom-left origin-bottom-right"
              >
                <div className="p-3 flex items-center space-x-3 rounded-2xl hover:bg-gray-50 transition-colors cursor-pointer mb-2" onClick={() => { setIsProfileOpen(false); router.push(`/profile?id=${userId}`); }}>
                  <div className="h-12 w-12 rounded-full overflow-hidden bg-gradient-to-br from-indigo-100 to-purple-100 shadow-sm border border-white">
                     <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${studentId || 'default'}`} alt="Avatar" className="h-full w-full object-cover" />
                  </div>
                  <div>
                    <div className="text-gray-900 font-bold text-base">{studentId}</div>
                    <div className="text-blue-500 text-xs mt-0.5 flex items-center font-semibold"><Sparkles className="h-3 w-3 mr-1" /> Premium Active</div>
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-2 mb-2">
                  <GridItem icon={<ClipboardList className="h-5 w-5 text-emerald-500" />} text="My Lists" />
                  <GridItem icon={<Book className="h-5 w-5 text-blue-500" />} text="Notebook" />
                  <GridItem icon={<Coins className="h-5 w-5 text-yellow-500" />} text="Points" />
                </div>

                <div className="space-y-1">
                  <MenuItem icon={<Settings className="h-4 w-4 text-gray-500" />} text="Settings" />
                  <MenuItem icon={<Sun className="h-4 w-4 text-gray-500" />} text="Appearance" />
                  <div className="h-px bg-gray-100 my-1 mx-2"></div>
                  <MenuItem icon={<LogOut className="h-4 w-4 text-red-500" />} text="Sign Out" onClick={logout} textClass="text-red-500 font-semibold hover:bg-red-50" />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.nav>
    </div>
  );
}

function NavIcon({ href, active, icon, label }: { href: string, active: boolean, icon: React.ReactNode, label: string }) {
  return (
    <Link href={href} className="relative group flex items-center justify-center w-10 h-10 md:w-12 md:h-12">
      <motion.div 
        whileHover={{ scale: 1.15 }}
        whileTap={{ scale: 0.9 }}
        className={`flex items-center justify-center w-full h-full rounded-[1rem] md:rounded-[1.25rem] transition-all duration-300 ${active ? 'bg-blue-50 text-blue-600 shadow-sm border border-blue-100/50 md:scale-110' : 'text-gray-400 hover:text-blue-500 hover:bg-blue-50/50'}`}
      >
        {icon}
      </motion.div>
      {/* Tooltip (Hidden on Mobile) */}
      <div className="hidden md:block absolute left-14 px-3 py-1.5 bg-gray-900/90 backdrop-blur-md text-white text-xs font-bold rounded-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 whitespace-nowrap shadow-xl">
        {label}
        <div className="absolute top-1/2 -left-1 -translate-y-1/2 border-y-[4px] border-y-transparent border-r-[4px] border-r-gray-900/90"></div>
      </div>
    </Link>
  );
}

function IconButton({ icon, label }: { icon: React.ReactNode, label: string }) {
  return (
    <motion.button 
      whileHover={{ scale: 1.15 }}
      whileTap={{ scale: 0.9 }}
      className="relative group w-10 h-10 md:w-12 md:h-12 flex items-center justify-center rounded-[1rem] md:rounded-[1.25rem] transition-all text-gray-400 hover:text-blue-500 hover:bg-blue-50/50"
    >
      {icon}
      {/* Tooltip (Hidden on Mobile) */}
      <div className="hidden md:block absolute left-14 px-3 py-1.5 bg-gray-900/90 backdrop-blur-md text-white text-xs font-bold rounded-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 whitespace-nowrap shadow-xl">
        {label}
        <div className="absolute top-1/2 -left-1 -translate-y-1/2 border-y-[4px] border-y-transparent border-r-[4px] border-r-gray-900/90"></div>
      </div>
    </motion.button>
  );
}

function GridItem({ icon, text }: { icon: React.ReactNode, text: string }) {
  return (
    <motion.div 
      whileHover={{ scale: 1.05, y: -2 }}
      whileTap={{ scale: 0.95 }}
      className="flex flex-col items-center justify-center p-3 rounded-2xl bg-gray-50 border border-gray-100 hover:bg-white hover:shadow-md transition-all cursor-pointer group"
    >
      <div className="mb-1.5">{icon}</div>
      <span className="text-[10px] text-gray-500 font-bold group-hover:text-gray-900 transition-colors">{text}</span>
    </motion.div>
  );
}

function MenuItem({ icon, text, onClick, textClass = "text-gray-600 font-medium" }: { icon: React.ReactNode, text: string, onClick?: () => void, textClass?: string }) {
  return (
    <motion.div 
      whileHover={{ x: 4, backgroundColor: 'rgba(243,244,246,0.8)' }}
      onClick={onClick} 
      className={`flex items-center px-4 py-2.5 rounded-xl cursor-pointer transition-colors ${textClass}`}
    >
      <div className="mr-3">{icon}</div>
      <span className="text-sm">{text}</span>
    </motion.div>
  );
}
