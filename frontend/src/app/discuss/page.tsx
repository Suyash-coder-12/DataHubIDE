"use client";

import { motion } from 'framer-motion';
import { MessageSquare, Heart, MessageCircle, Share2, TrendingUp, Search } from 'lucide-react';

export default function DiscussPage() {
  const posts = [
    { title: 'How to prepare for System Design Interviews in 2026?', author: 'TechLead', likes: 1240, comments: 89, tags: ['System Design', 'Interview'] },
    { title: 'Google Interview Experience - L4 SWE (Offer)', author: 'CodeNinja', likes: 892, comments: 142, tags: ['Interview Experience', 'Google'] },
    { title: 'Dynamic Programming Patterns you must know', author: 'AlgoMaster', likes: 3205, comments: 412, tags: ['Algorithms', 'DP'] },
    { title: 'Amazon OA Discussion 2026', author: 'SDE1_Dream', likes: 450, comments: 320, tags: ['Amazon', 'OA'] },
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
      {/* Background Liquid Blobs */}
      <motion.div 
        animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 0] }} 
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        className="absolute top-0 right-0 w-[50%] h-[500px] rounded-full bg-emerald-300/20 blur-[120px] pointer-events-none" 
      />
      <motion.div 
        animate={{ scale: [1, 1.3, 1], rotate: [0, -90, 0] }} 
        transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
        className="absolute bottom-0 left-0 w-[40%] h-[400px] rounded-[100%] bg-blue-400/20 blur-[100px] pointer-events-none" 
      />

      <div className="max-w-7xl mx-auto relative z-10 flex flex-col lg:flex-row gap-6">
        
        <div className="flex-1 space-y-6">
          <motion.div initial={{ y: -30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ type: "spring" }} className="flex justify-between items-end">
            <div>
              <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight flex items-center">
                <MessageSquare className="h-8 w-8 text-blue-500 mr-3" />
                Discussions
              </h1>
              <p className="text-gray-500 mt-2 font-medium">Join the community, share experiences, and learn together.</p>
            </div>
            <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 px-6 rounded-xl shadow-lg hover:shadow-blue-500/30 transition-all hover:-translate-y-0.5">
              New Post
            </button>
          </motion.div>

          {/* Search Bar */}
          <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="relative group">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
            <input type="text" placeholder="Search posts, tags, authors..." className="w-full bg-white border border-gray-200 text-gray-800 py-3 pl-12 pr-4 rounded-2xl focus:outline-none focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] font-medium transition-all" />
          </motion.div>

          <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-4">
            {posts.map((post, i) => (
              <motion.div variants={itemVariants} whileHover={{ scale: 1.01 }} key={i} className="bg-white/60 backdrop-blur-3xl border border-gray-200/50 p-5 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] cursor-pointer group hover:bg-white transition-all">
                <div className="flex justify-between items-start mb-3">
                  <h2 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2 pr-4">{post.title}</h2>
                  <div className="flex-shrink-0 flex items-center text-xs font-bold text-gray-500 bg-gray-100 px-3 py-1 rounded-lg">
                    By {post.author}
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  {post.tags.map(tag => (
                    <span key={tag} className="bg-blue-50 text-blue-600 border border-blue-100 text-xs font-bold px-3 py-1 rounded-full">{tag}</span>
                  ))}
                </div>

                <div className="flex items-center space-x-6 text-gray-400 font-bold text-sm">
                  <span className="flex items-center group-hover:text-pink-500 transition-colors"><Heart className="w-4 h-4 mr-1.5" /> {post.likes}</span>
                  <span className="flex items-center group-hover:text-blue-500 transition-colors"><MessageCircle className="w-4 h-4 mr-1.5" /> {post.comments}</span>
                  <span className="flex items-center hover:text-gray-600 transition-colors"><Share2 className="w-4 h-4 mr-1.5" /> Share</span>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>

        <motion.div initial={{ x: 50, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ type: "spring", delay: 0.2 }} className="w-full lg:w-80 space-y-6">
          <div className="bg-white/60 backdrop-blur-3xl border border-gray-200/50 p-6 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
            <h3 className="font-extrabold text-gray-900 mb-4 flex items-center text-lg"><TrendingUp className="w-5 h-5 text-blue-500 mr-2" /> Trending Tags</h3>
            <div className="flex flex-wrap gap-2">
              {['Amazon', 'Google', 'System Design', 'DP', 'OA', 'Interview Experience', 'Graphs'].map(tag => (
                <span key={tag} className="bg-gray-50 border border-gray-200 hover:bg-gray-100 text-gray-700 text-xs font-bold px-3 py-1.5 rounded-xl cursor-pointer transition-colors shadow-sm">{tag}</span>
              ))}
            </div>
          </div>
        </motion.div>

      </div>
    </div>
  );
}
