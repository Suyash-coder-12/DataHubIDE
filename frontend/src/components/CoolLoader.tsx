"use client";

import { motion } from 'framer-motion';
import { Code2 } from 'lucide-react';

export default function CoolLoader() {
  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#fafbfc]/80 backdrop-blur-xl">
      <div className="relative flex items-center justify-center">
        {/* Expanding Liquid Ripples */}
        <motion.div
          animate={{ scale: [1, 2.5, 3], opacity: [0.6, 0.2, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
          className="absolute w-24 h-24 bg-gradient-to-r from-blue-400 to-cyan-300 rounded-full"
        />
        <motion.div
          animate={{ scale: [1, 2.5, 3], opacity: [0.6, 0.2, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeOut", delay: 1 }}
          className="absolute w-24 h-24 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full"
        />
        
        {/* Core Levitating Logo */}
        <motion.div
          animate={{ y: [-10, 10, -10] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          className="relative z-10 w-28 h-28 rounded-[2rem] bg-white shadow-[0_20px_50px_rgba(59,130,246,0.3)] flex items-center justify-center border border-white/50"
        >
          <motion.div
             animate={{ rotate: 360 }}
             transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
             className="absolute inset-0 rounded-[2rem] bg-gradient-to-tr from-blue-500 via-cyan-400 to-emerald-400 opacity-20 blur-md"
          />
          <motion.div
            animate={{ scale: [1, 1.15, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            <Code2 className="h-12 w-12 text-blue-500" strokeWidth={2.5} />
          </motion.div>
        </motion.div>
      </div>

      {/* Loading Text */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ delay: 0.3, duration: 0.5 }}
        className="mt-12 flex flex-col items-center"
      >
        <div className="text-xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500 tracking-widest">
          DATAHUB IDE
        </div>
        <div className="mt-2 flex items-center space-x-1">
          <motion.span animate={{ opacity: [0, 1, 0] }} transition={{ duration: 1.5, repeat: Infinity, delay: 0 }} className="w-1.5 h-1.5 bg-blue-400 rounded-full" />
          <motion.span animate={{ opacity: [0, 1, 0] }} transition={{ duration: 1.5, repeat: Infinity, delay: 0.2 }} className="w-1.5 h-1.5 bg-cyan-400 rounded-full" />
          <motion.span animate={{ opacity: [0, 1, 0] }} transition={{ duration: 1.5, repeat: Infinity, delay: 0.4 }} className="w-1.5 h-1.5 bg-emerald-400 rounded-full" />
        </div>
      </motion.div>
    </div>
  );
}
