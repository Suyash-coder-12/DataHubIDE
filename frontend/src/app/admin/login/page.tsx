"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import axios from 'axios';

export default function AdminLoginPage() {
  const [studentId, setStudentId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();
  const login = useAuthStore((state) => state.login);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:8080/api/auth/login', {
        student_id: studentId,
        password: password,
      });
      
      if (res.data.role !== 'admin') {
        setError('Access denied: Admins only');
        return;
      }
      
      login(res.data.token, res.data.student_id, res.data.role, res.data.user_id);
      router.push('/admin');
    } catch (err: any) {
      setError(err.response?.data || 'Login failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-corporate-blue-900">
      <div className="max-w-md w-full p-8 bg-white dark:bg-corporate-blue-800 rounded-xl shadow-lg border border-gray-200 dark:border-corporate-blue-700">
        <h2 className="text-3xl font-bold text-center mb-8 text-corporate-red-500">Admin Login</h2>
        
        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Admin ID</label>
            <input
              type="text"
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-corporate-blue-600 rounded-md shadow-sm focus:outline-none focus:ring-corporate-red-500 focus:border-corporate-red-500 dark:bg-corporate-blue-900 dark:text-white"
              value={studentId}
              onChange={(e) => setStudentId(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Password</label>
            <input
              type="password"
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-corporate-blue-600 rounded-md shadow-sm focus:outline-none focus:ring-corporate-red-500 focus:border-corporate-red-500 dark:bg-corporate-blue-900 dark:text-white"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-corporate-red-600 hover:bg-corporate-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-corporate-red-500 transition-colors"
          >
            Authenticate
          </button>
        </form>
      </div>
    </div>
  );
}
