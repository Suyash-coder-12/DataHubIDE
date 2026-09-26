"use client";

import Link from 'next/link';
import { useAuthStore } from '@/store/authStore';
import { useRouter, usePathname } from 'next/navigation';
import { LogOut, User, Search, Code, Shield } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function Navigation() {
  const { token, studentId, role, logout, userId } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (token && !userId) {
      // Old token without userId, force re-login
      logout();
      router.push('/login');
    }
  }, [token, userId, logout, router]);

  if (!mounted || !token || pathname.startsWith('/admin')) return null;

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <nav className="bg-corporate-blue-900 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-14">
          <div className="flex items-center space-x-8">
            <Link href="/" className="flex items-center space-x-2">
              <Code className="h-6 w-6 text-corporate-red-500" />
              <span className="font-bold text-xl tracking-tight">DataHub<span className="text-corporate-red-500">IDE</span></span>
            </Link>
            
            <div className="hidden md:flex space-x-1">
              <Link href="/problems" className="hover:text-corporate-red-400 px-3 py-2 rounded-md text-sm font-medium transition-colors">Problems</Link>
              <Link href="/contest" className="hover:text-corporate-red-400 px-3 py-2 rounded-md text-sm font-medium transition-colors">Contest</Link>
              <Link href="/discuss" className="hover:text-corporate-red-400 px-3 py-2 rounded-md text-sm font-medium transition-colors">Discuss</Link>
              <Link href="/interview" className="hover:text-corporate-red-400 px-3 py-2 rounded-md text-sm font-medium transition-colors">Interview</Link>
              <Link href="/store" className="hover:text-corporate-red-400 px-3 py-2 rounded-md text-sm font-medium transition-colors">Store</Link>
              
              <div className="w-px h-5 bg-gray-600 my-auto mx-2"></div>
              
              <Link href="/search" className="flex items-center hover:text-corporate-red-400 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                <Search className="h-4 w-4 mr-1" />
                Find Friends
              </Link>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <Link href={`/profile?id=${userId}`} className="flex items-center hover:text-corporate-red-400 px-3 py-2 rounded-md text-sm font-medium transition-colors">
              <User className="h-4 w-4 mr-2" />
              {studentId}
            </Link>
            <button
              onClick={handleLogout}
              className="flex items-center hover:text-corporate-red-400 px-3 py-2 rounded-md text-sm font-medium transition-colors"
            >
              <LogOut className="h-4 w-4 mr-1" />
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
