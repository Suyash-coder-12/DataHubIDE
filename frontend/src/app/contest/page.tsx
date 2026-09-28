"use client";

import { motion } from 'framer-motion';
import { Trophy, Clock, Users, Star, ArrowRight, PlayCircle, BarChart2 } from 'lucide-react';

export default function ContestPage() {
  const contests = [
    { title: 'Weekly Contest 401', date: 'Sunday 8:00 AM GMT+5:30', participants: 25420, active: true },
    { title: 'Biweekly Contest 132', date: 'Saturday 8:00 PM GMT+5:30', participants: 18231, active: false },
    { title: 'Weekly Contest 400', date: 'Ended', participants: 31092, active: false },
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
    <div className="min-h-screen bg-[#fafbfc] text-gray-800 font-sans relative overflow-hidden md:pl-28 pt-8 pb-24 md:pb-10 pr-4 md:pr-6 pl-4">
      {/* Animated Liquid Backgrounds */}
      <motion.div 
        animate={{ scale: [1, 1.1, 1], rotate: [0, 90, 0] }} 
        transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
        className="absolute top-0 left-[20%] w-[60%] h-[500px] rounded-[100%] bg-gradient-to-b from-orange-300/20 to-transparent blur-[120px] pointer-events-none" 
      />
      <motion.div 
        animate={{ scale: [1, 1.2, 1], rotate: [0, -90, 0] }} 
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        className="absolute bottom-0 right-0 w-[50%] h-[500px] rounded-full bg-purple-300/20 blur-[150px] pointer-events-none" 
      />

      <div className="max-w-7xl mx-auto relative z-10 flex flex-col lg:flex-row gap-6">
        
        <div className="flex-1 space-y-6">
          <motion.div initial={{ y: -30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ type: "spring" }}>
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight flex items-center">
              <Trophy className="h-8 w-8 text-orange-500 mr-3" />
              Global Contests
            </h1>
            <p className="text-gray-500 mt-2 font-medium">Compete with the best minds worldwide and climb the leaderboard.</p>
          </motion.div>

          <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-4">
            {contests.map((c, i) => (
              <motion.div variants={itemVariants} whileHover={{ scale: 1.02 }} key={i} className="bg-white/60 backdrop-blur-3xl border border-gray-200/50 p-6 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex flex-col sm:flex-row items-start sm:items-center justify-between cursor-pointer group">
                <div>
                  <div className="flex items-center space-x-3 mb-2">
                    <h2 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">{c.title}</h2>
                    {c.active && <span className="bg-orange-100 text-orange-600 text-xs font-bold px-2 py-1 rounded-full animate-pulse shadow-sm">Upcoming</span>}
                  </div>
                  <div className="flex items-center space-x-6 text-sm text-gray-500 font-medium">
                    <span className="flex items-center"><Clock className="w-4 h-4 mr-1.5" /> {c.date}</span>
                    <span className="flex items-center"><Users className="w-4 h-4 mr-1.5" /> {c.participants.toLocaleString()}</span>
                  </div>
                </div>
                <button className="mt-4 sm:mt-0 bg-blue-50 text-blue-600 border border-blue-100 hover:bg-blue-500 hover:text-white px-5 py-2 rounded-xl font-bold transition-all shadow-sm group-hover:shadow flex items-center">
                  View Details <ArrowRight className="w-4 h-4 ml-1.5" />
                </button>
              </motion.div>
            ))}
          </motion.div>
        </div>

        <motion.div initial={{ x: 50, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ type: "spring", delay: 0.2 }} className="w-full lg:w-80 space-y-6">
          <div className="bg-gradient-to-br from-orange-50 to-red-50 border border-orange-100 p-6 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
            <h3 className="font-extrabold text-lg flex items-center text-gray-900 mb-4"><Star className="w-5 h-5 text-orange-500 mr-2" fill="currentColor" /> My Rating</h3>
            <div className="text-4xl font-black text-gray-900 mb-2">1,842</div>
            <div className="text-sm font-bold text-emerald-600 flex items-center">
               Top 8% Globally
            </div>
          </div>

          <div className="bg-white/60 backdrop-blur-3xl border border-gray-200/50 p-6 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
             <h3 className="font-extrabold text-lg text-gray-900 mb-4 flex items-center"><PlayCircle className="w-5 h-5 text-blue-500 mr-2" /> Virtual Contests</h3>
             <p className="text-sm text-gray-500 mb-4 font-medium">Practice past contests in a simulated environment to improve your speed.</p>
             <button className="w-full bg-gray-900 text-white font-bold py-2.5 rounded-xl hover:bg-gray-800 transition-colors shadow-md">
               Start Virtual Contest
             </button>
          </div>
        </motion.div>

      </div>
    </div>
  );
}
