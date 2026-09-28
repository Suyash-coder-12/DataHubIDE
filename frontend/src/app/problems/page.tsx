"use client";

import { CheckCircle2, Circle, Search, Lock, Compass, Target, Star, MoreHorizontal, Layers, Library, BookOpen } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ProblemsPage() {
  const problems = [
    { id: 1614, title: 'Maximum Nesting Depth', difficulty: 'Easy', acceptance: '85.6%', solved: true, premium: true },
    { id: 1, title: 'Two Sum', difficulty: 'Easy', acceptance: '57.9%', solved: false, premium: true },
    { id: 2, title: 'Add Two Numbers', difficulty: 'Medium', acceptance: '49.4%', solved: false, premium: false },
    { id: 3, title: 'Longest Substring', difficulty: 'Medium', acceptance: '39.9%', solved: true, premium: true },
    { id: 4, title: 'Median of Sorted Arrays', difficulty: 'Hard', acceptance: '47.7%', solved: true, premium: true },
    { id: 5, title: 'Longest Palindromic', difficulty: 'Medium', acceptance: '38.7%', solved: true, premium: true },
    { id: 6, title: 'Zigzag Conversion', difficulty: 'Medium', acceptance: '55.2%', solved: true, premium: false },
    { id: 7, title: 'Reverse Integer', difficulty: 'Medium', acceptance: '32.6%', solved: true, premium: false },
  ];

  const topics = [
    { name: 'Array', count: 2261 }, { name: 'String', count: 896 }, { name: 'Hash Table', count: 837 },
    { name: 'Math', count: 708 }, { name: 'Dynamic Programming', count: 682 }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  return (
    <div className="min-h-screen bg-[#fafbfc] text-gray-800 font-sans relative overflow-hidden md:pl-28 pt-6 pb-24 md:pb-6 pr-4 md:pr-6 pl-4">
      {/* Background Liquid Blobs (Light Mode) */}
      <motion.div 
        animate={{ scale: [1, 1.1, 1], rotate: [0, 90, 0] }} 
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        className="absolute top-[-10%] left-[10%] w-[50%] h-[50%] rounded-full bg-blue-400/20 blur-[120px] pointer-events-none" 
      />
      <motion.div 
        animate={{ scale: [1, 1.2, 1], rotate: [0, -90, 0] }} 
        transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
        className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] rounded-full bg-emerald-300/20 blur-[150px] pointer-events-none" 
      />

      <div className="max-w-7xl mx-auto flex gap-6 relative z-10 h-[calc(100vh-48px)]">
        
        {/* Left Sidebar - Light Glass Panel */}
        <motion.div 
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 20 }}
          className="w-64 hidden lg:flex flex-col gap-6"
        >
          <div className="bg-white/60 backdrop-blur-3xl border border-gray-200/50 rounded-3xl p-5 shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex-shrink-0">
            <div className="flex items-center text-gray-800 font-bold text-lg mb-4 px-2">
              <Library className="h-5 w-5 mr-2 text-blue-500" /> Library
            </div>
            <div className="space-y-1.5">
              <SidebarItem icon={<Target className="h-4 w-4 text-emerald-500" />} text="Quest" />
              <SidebarItem icon={<Compass className="h-4 w-4 text-purple-500" />} text="Explore" />
              <SidebarItem icon={<BookOpen className="h-4 w-4 text-cyan-500" />} text="Study Plan" />
            </div>
          </div>

          <div className="bg-white/60 backdrop-blur-3xl border border-gray-200/50 rounded-3xl p-5 shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex-1 overflow-y-auto custom-scrollbar">
            <div className="flex items-center justify-between text-sm font-bold text-gray-500 mb-3 px-2">
              My Lists
              <button className="hover:text-gray-800"><MoreHorizontal className="h-4 w-4" /></button>
            </div>
            <div className="space-y-1.5">
              <SidebarItem icon={<Star className="h-4 w-4 text-yellow-500" fill="currentColor" />} text="Favorites" rightIcon={<Lock className="h-3 w-3 text-gray-400" />} />
              <SidebarItem icon={<Layers className="h-4 w-4 text-orange-500" />} text="Must Do" />
            </div>
          </div>
        </motion.div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col gap-6 overflow-hidden">
          
          {/* Liquid Banners */}
          <motion.div 
            initial={{ y: -30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 20, delay: 0.1 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-shrink-0"
          >
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="bg-gradient-to-br from-indigo-50 to-purple-50 backdrop-blur-2xl border border-purple-100 rounded-3xl p-6 relative overflow-hidden h-36 flex flex-col justify-between cursor-pointer shadow-[0_8px_30px_rgb(0,0,0,0.04)] group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-purple-300/30 rounded-full blur-[30px] -mr-10 -mt-10 group-hover:bg-purple-400/40 transition-colors"></div>
              <div className="relative z-10">
                <div className="text-gray-900 font-extrabold text-xl tracking-tight">Unlock Full Experience</div>
                <div className="text-purple-600 font-semibold text-sm mt-1">Premium Algorithms & Insights</div>
                <div className="text-purple-700 font-bold mt-3 bg-white w-max px-3 py-1 rounded-full text-sm shadow-sm">₹583/mo</div>
              </div>
            </motion.div>

            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="bg-gradient-to-br from-cyan-50 to-blue-50 backdrop-blur-2xl border border-blue-100 rounded-3xl p-6 relative overflow-hidden h-36 flex flex-col justify-between cursor-pointer shadow-[0_8px_30px_rgb(0,0,0,0.04)] group">
              <div className="absolute bottom-0 right-0 w-40 h-40 bg-cyan-300/20 rounded-full blur-[40px] group-hover:bg-cyan-400/30 transition-colors"></div>
              <div className="relative z-10">
                <div className="text-gray-900 font-extrabold text-xl tracking-tight">System Design Course</div>
                <div className="text-cyan-700 font-semibold text-sm mt-1">Master large scale architectures</div>
                <button className="mt-3 bg-gray-900 text-white px-4 py-1.5 rounded-full text-sm font-bold shadow-md hover:shadow-xl hover:-translate-y-0.5 transition-all w-max">Start Now</button>
              </div>
            </motion.div>
          </motion.div>

          {/* Filters & Table Container */}
          <motion.div 
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 20, delay: 0.2 }}
            className="bg-white/60 backdrop-blur-3xl border border-gray-200/50 rounded-3xl flex-1 flex flex-col overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.04)]"
          >
            {/* Header / Search */}
            <div className="p-4 flex flex-wrap items-center justify-between border-b border-gray-200/50 gap-4">
              <div className="flex items-center space-x-2 overflow-x-auto no-scrollbar pb-1">
                <button className="bg-gray-900 text-white px-4 py-2 rounded-full text-sm font-bold shadow-md whitespace-nowrap">All Topics</button>
                {topics.map(t => (
                  <button key={t.name} className="bg-white hover:bg-gray-50 border border-gray-200 px-4 py-2 rounded-full text-sm text-gray-600 font-semibold whitespace-nowrap shadow-sm hover:shadow transition-all">
                    {t.name} <span className="text-xs text-gray-400 ml-1">{t.count}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="p-4 flex justify-between items-center bg-gray-50/50 border-b border-gray-100">
              <div className="relative group">
                <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                <input type="text" placeholder="Search problems..." className="bg-white text-gray-800 pl-10 pr-4 py-2 rounded-full border border-gray-200 focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/10 focus:outline-none w-72 text-sm transition-all shadow-sm font-medium" />
              </div>
              <div className="flex items-center text-sm font-bold text-gray-600 bg-white px-4 py-2 rounded-full border border-gray-200 shadow-sm">
                <Circle className="h-3 w-3 text-emerald-500 mr-2" fill="currentColor" /> 67 Solved
              </div>
            </div>

            {/* Glass Table */}
            <div className="flex-1 overflow-y-auto custom-scrollbar p-3">
              <div className="grid grid-cols-12 text-xs font-bold text-gray-400 uppercase tracking-wider px-4 py-3 mb-2">
                <div className="col-span-1 text-center">Status</div>
                <div className="col-span-6">Title</div>
                <div className="col-span-2 text-center">Acceptance</div>
                <div className="col-span-3 text-center">Difficulty</div>
              </div>
              
              <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-2">
                {problems.map((prob) => (
                  <motion.div variants={itemVariants} whileHover={{ scale: 1.01, backgroundColor: 'rgba(255,255,255,1)' }} key={prob.id} className="grid grid-cols-12 items-center px-4 py-3.5 bg-white/50 border border-gray-100 hover:border-gray-200 rounded-2xl transition-all cursor-pointer shadow-sm hover:shadow-md group">
                    <div className="col-span-1 flex justify-center">
                      {prob.solved ? <CheckCircle2 className="w-5 h-5 text-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.3)] rounded-full" /> : <div className="w-2 h-2 rounded-full bg-gray-200 group-hover:bg-gray-300 transition-colors" />}
                    </div>
                    <div className="col-span-6 flex items-center">
                      <span className="font-bold text-gray-700 group-hover:text-gray-900 transition-colors truncate">{prob.id}. {prob.title}</span>
                      {prob.premium && <Lock className="w-3.5 h-3.5 text-yellow-500 ml-2" />}
                    </div>
                    <div className="col-span-2 text-center text-sm text-gray-500 font-mono font-semibold">{prob.acceptance}</div>
                    <div className="col-span-3 flex justify-center">
                      <span className={`px-3 py-1 rounded-full text-xs font-extrabold shadow-sm
                        ${prob.difficulty === 'Easy' ? 'bg-emerald-50 text-emerald-600 border border-emerald-200' : ''}
                        ${prob.difficulty === 'Medium' ? 'bg-yellow-50 text-yellow-600 border border-yellow-200' : ''}
                        ${prob.difficulty === 'Hard' ? 'bg-red-50 text-red-600 border border-red-200' : ''}
                      `}>
                        {prob.difficulty}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

function SidebarItem({ icon, text, rightIcon }: { icon: React.ReactNode, text: string, rightIcon?: React.ReactNode }) {
  return (
    <motion.div 
      whileHover={{ x: 4, backgroundColor: 'rgba(255,255,255,0.8)' }}
      className="flex items-center justify-between px-3 py-2.5 rounded-xl cursor-pointer text-gray-600 hover:text-gray-900 transition-colors border border-transparent hover:border-gray-100 hover:shadow-sm"
    >
      <div className="flex items-center">
        <div className="mr-3">{icon}</div>
        <span className="text-sm font-semibold">{text}</span>
      </div>
      {rightIcon && rightIcon}
    </motion.div>
  );
}
