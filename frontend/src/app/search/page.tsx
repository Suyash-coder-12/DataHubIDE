"use client";

import { useState } from 'react';
import axios from 'axios';
import Link from 'next/link';
import { Search as SearchIcon, User } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const { token } = useAuthStore();

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query) return;
    
    try {
      const res = await axios.get(`http://localhost:8080/api/users/search?q=${query}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setResults(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-corporate-blue-900 dark:text-white">Find Friends</h1>
      
      <form onSubmit={handleSearch} className="mb-8 flex space-x-4">
        <div className="flex-1 relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <SearchIcon className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-3 border border-gray-300 dark:border-corporate-blue-600 rounded-lg shadow-sm focus:ring-corporate-blue-500 focus:border-corporate-blue-500 bg-white dark:bg-corporate-blue-800 text-gray-900 dark:text-white"
            placeholder="Search by Student ID..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <button
          type="submit"
          className="px-6 py-3 border border-transparent text-base font-medium rounded-lg shadow-sm text-white bg-corporate-blue-600 hover:bg-corporate-blue-700"
        >
          Search
        </button>
      </form>

      <div className="bg-white dark:bg-corporate-blue-800 rounded-xl shadow-lg border border-gray-200 dark:border-corporate-blue-700 overflow-hidden">
        {results.length > 0 ? (
          <ul className="divide-y divide-gray-200 dark:divide-corporate-blue-700">
            {results.map((user) => (
              <li key={user.id} className="hover:bg-gray-50 dark:hover:bg-corporate-blue-900 transition-colors">
                <Link href={`/profile?id=${user.id}`} className="block px-6 py-4">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="h-12 w-12 rounded-full bg-corporate-red-500 flex items-center justify-center text-white font-bold text-xl">
                        {user.student_id.substring(0, 2).toUpperCase()}
                      </div>
                    </div>
                    <div className="ml-4">
                      <div className="text-lg font-medium text-gray-900 dark:text-white">
                        {user.name || user.student_id}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        @{user.student_id}
                      </div>
                    </div>
                    <div className="ml-auto">
                      <User className="h-5 w-5 text-gray-400" />
                    </div>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <div className="p-8 text-center text-gray-500 dark:text-gray-400">
            No users found. Try searching for a different Student ID.
          </div>
        )}
      </div>
    </div>
  );
}
