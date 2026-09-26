"use client";

import { MessageSquare, ArrowUp, Eye, Search, Filter } from 'lucide-react';

export default function DiscussPage() {
  const topics = [
    { title: "Dynamic Programming Patterns for Beginners", author: "suyash-coder-12", views: "14.2k", votes: 432, replies: 89, tags: ["Dynamic Programming", "Tutorial"] },
    { title: "How to prepare for FAANG interviews in 2026?", author: "tech_guru", views: "5.1k", votes: 215, replies: 45, tags: ["Interview", "FAANG"] },
    { title: "O(N) time and O(1) space solution for Problem #124", author: "algo_expert", views: "2.3k", votes: 154, replies: 21, tags: ["Solution", "Optimization"] },
    { title: "Is Rust becoming standard for systems interviews?", author: "rustacean", views: "8.9k", votes: 312, replies: 124, tags: ["Career", "Rust"] },
    { title: "Weekly Contest 400 Discussion", author: "admin", views: "1.2k", votes: 88, replies: 32, tags: ["Contest", "Official"] },
  ];

  return (
    <div className="min-h-screen p-8 bg-gray-50 dark:bg-gray-900 transition-colors">
      <div className="max-w-5xl mx-auto space-y-6">
        
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Discuss</h1>
          <button className="px-4 py-2 bg-corporate-blue-600 text-white font-medium rounded-lg hover:bg-corporate-blue-700 transition-colors shadow-sm">
            New Topic
          </button>
        </div>

        {/* Search & Filters */}
        <div className="flex space-x-4">
          <div className="flex-1 relative">
            <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search topics, tags, or authors..." 
              className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-corporate-blue-800 border border-gray-200 dark:border-corporate-blue-700 rounded-xl focus:ring-2 focus:ring-corporate-blue-500 focus:outline-none dark:text-white placeholder-gray-400 shadow-sm"
            />
          </div>
          <button className="flex items-center px-4 py-2 bg-white dark:bg-corporate-blue-800 border border-gray-200 dark:border-corporate-blue-700 rounded-xl text-gray-700 dark:text-gray-200 font-medium hover:bg-gray-50 dark:hover:bg-corporate-blue-700 shadow-sm transition-colors">
            <Filter className="w-4 h-4 mr-2" /> Tags
          </button>
        </div>

        {/* Topics List */}
        <div className="bg-white dark:bg-corporate-blue-800 rounded-xl border border-gray-200 dark:border-corporate-blue-700 shadow-sm overflow-hidden">
          <div className="divide-y divide-gray-100 dark:divide-corporate-blue-700">
            {topics.map((topic, idx) => (
              <div key={idx} className="p-5 hover:bg-gray-50 dark:hover:bg-corporate-blue-900/30 transition-colors flex items-start gap-4">
                <div className="flex flex-col items-center justify-center p-2 bg-gray-50 dark:bg-corporate-blue-900 rounded-lg min-w-[60px]">
                  <ArrowUp className="w-5 h-5 text-gray-400 mb-1 cursor-pointer hover:text-corporate-blue-500" />
                  <span className="font-bold text-gray-700 dark:text-gray-200">{topic.votes}</span>
                </div>
                
                <div className="flex-1 min-w-0">
                  <a href="#" className="text-lg font-semibold text-gray-900 dark:text-white hover:text-corporate-blue-600 dark:hover:text-corporate-blue-400 truncate block mb-1">
                    {topic.title}
                  </a>
                  <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                    <span className="font-medium text-gray-700 dark:text-gray-300">@{topic.author}</span>
                    <div className="flex space-x-2">
                      {topic.tags.map(tag => (
                        <span key={tag} className="px-2 py-0.5 bg-gray-100 dark:bg-corporate-blue-900 rounded text-xs text-gray-600 dark:text-gray-300">{tag}</span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-6 text-sm text-gray-400 shrink-0 mt-1">
                  <div className="flex items-center"><Eye className="w-4 h-4 mr-1.5" /> {topic.views}</div>
                  <div className="flex items-center"><MessageSquare className="w-4 h-4 mr-1.5" /> {topic.replies}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
