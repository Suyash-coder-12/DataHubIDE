"use client";

import { ShoppingBag, Star } from 'lucide-react';

export default function StorePage() {
  const items = [
    { name: "DataHub Classic T-Shirt", price: 6000, img: "👕", tag: "Best Seller" },
    { name: "Premium Hoodie", price: 12000, img: "🧥", tag: "New" },
    { name: "Algorithm Flashcards", price: 4000, img: "📇" },
    { name: "Laptop Sticker Pack", price: 1500, img: "💻" },
    { name: "Coffee Mug", price: 3000, img: "☕" },
    { name: "1 Month Premium", price: 8000, img: "⭐" },
  ];

  return (
    <div className="min-h-screen p-8 bg-gray-50 dark:bg-gray-900 transition-colors">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-center bg-white dark:bg-corporate-blue-800 p-8 rounded-2xl shadow-sm border border-gray-200 dark:border-corporate-blue-700">
          <div className="flex items-center mb-4 md:mb-0">
            <div className="w-16 h-16 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400 rounded-full flex items-center justify-center mr-6">
              <ShoppingBag className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Redeem Store</h1>
              <p className="text-gray-500 dark:text-gray-400">Exchange your hard-earned DataHub coins for exclusive swag.</p>
            </div>
          </div>
          <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-xl p-4 flex flex-col items-center min-w-[150px]">
            <span className="text-sm font-semibold text-orange-800 dark:text-orange-400 uppercase tracking-wider mb-1">Your Balance</span>
            <div className="flex items-center text-3xl font-black text-gray-900 dark:text-white">
              <Star className="w-6 h-6 text-yellow-500 mr-2 fill-yellow-500" /> 1,450
            </div>
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item, idx) => (
            <div key={idx} className="bg-white dark:bg-corporate-blue-800 rounded-2xl border border-gray-200 dark:border-corporate-blue-700 overflow-hidden shadow-sm hover:shadow-md transition-shadow group flex flex-col">
              <div className="h-48 bg-gray-100 dark:bg-corporate-blue-900 flex items-center justify-center text-6xl relative">
                {item.tag && (
                  <span className="absolute top-4 right-4 px-3 py-1 bg-corporate-red-500 text-white text-xs font-bold rounded-full shadow-sm">
                    {item.tag}
                  </span>
                )}
                {item.img}
              </div>
              <div className="p-6 flex-1 flex flex-col">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">{item.name}</h3>
                <div className="flex items-center text-lg font-bold text-gray-700 dark:text-gray-300 mb-6 mt-auto">
                  <Star className="w-5 h-5 text-yellow-500 mr-1.5 fill-yellow-500" /> {item.price.toLocaleString()}
                </div>
                <button className="w-full py-2.5 bg-gray-50 dark:bg-corporate-blue-900 text-gray-900 dark:text-white font-semibold rounded-xl border border-gray-200 dark:border-corporate-blue-700 hover:bg-gray-100 dark:hover:bg-corporate-blue-700 transition-colors">
                  Redeem
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
