"use client";

import { Trophy, Clock, Calendar, ChevronRight } from 'lucide-react';

export default function ContestPage() {
  return (
    <div className="min-h-screen p-8 bg-gray-50 dark:bg-gray-900 transition-colors">
      <div className="max-w-5xl mx-auto space-y-10">
        
        {/* Header Hero */}
        <div className="bg-gradient-to-r from-corporate-blue-800 to-corporate-blue-600 rounded-2xl p-10 text-white shadow-lg relative overflow-hidden">
          <div className="relative z-10">
            <h1 className="text-4xl font-bold mb-4">DataHub Weekly Contest 400</h1>
            <p className="text-corporate-blue-100 mb-8 max-w-xl text-lg">
              Compete with thousands of developers worldwide and win exclusive prizes. 
              Are you ready for the ultimate algorithmic challenge?
            </p>
            <div className="flex items-center space-x-6">
              <div className="flex flex-col">
                <span className="text-sm text-corporate-blue-200 uppercase font-bold tracking-wider">Starts in</span>
                <span className="text-2xl font-mono font-bold">12:45:00</span>
              </div>
              <button className="px-8 py-3 bg-white text-corporate-blue-800 font-bold rounded-full hover:bg-gray-100 transition-transform hover:scale-105">
                Register Now
              </button>
            </div>
          </div>
          <Trophy className="absolute -right-10 -bottom-10 w-64 h-64 text-white opacity-10 rotate-12" />
        </div>

        {/* Past Contests */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Past Contests</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[399, 398, 397, 396, 395, 394].map((num) => (
              <div key={num} className="bg-white dark:bg-corporate-blue-800 rounded-xl border border-gray-200 dark:border-corporate-blue-700 p-6 hover:shadow-md transition-shadow group cursor-pointer">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="font-bold text-lg text-gray-900 dark:text-white group-hover:text-corporate-blue-600 dark:group-hover:text-corporate-blue-400 transition-colors">
                    Weekly Contest {num}
                  </h3>
                  <span className="px-2 py-1 bg-gray-100 dark:bg-corporate-blue-900 text-xs font-semibold rounded text-gray-600 dark:text-gray-300">
                    Ended
                  </span>
                </div>
                <div className="space-y-2 text-sm text-gray-500 dark:text-gray-400 mb-6">
                  <div className="flex items-center"><Calendar className="w-4 h-4 mr-2" /> Sep 22, 2026</div>
                  <div className="flex items-center"><Clock className="w-4 h-4 mr-2" /> 1hr 30m</div>
                </div>
                <div className="flex items-center text-corporate-blue-600 dark:text-corporate-blue-400 font-medium text-sm group-hover:underline">
                  View Results <ChevronRight className="w-4 h-4 ml-1" />
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
