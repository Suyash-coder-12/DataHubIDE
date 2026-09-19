"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import Link from 'next/link';
import axios from 'axios';

export default function LoginPage() {
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
      login(res.data.token, res.data.student_id, res.data.role, res.data.user_id);
      router.push('/');
    } catch (err: any) {
      setError(err.response?.data || 'Login failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-corporate-blue-900">
      <div className="max-w-md w-full p-8 bg-white dark:bg-corporate-blue-800 rounded-xl shadow-lg border border-gray-200 dark:border-corporate-blue-700">
        <h2 className="text-3xl font-bold text-center mb-8 text-corporate-blue-900 dark:text-white">Sign In</h2>
        
        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Student ID</label>
            <input
              type="text"
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-corporate-blue-600 rounded-md shadow-sm focus:outline-none focus:ring-corporate-blue-500 focus:border-corporate-blue-500 dark:bg-corporate-blue-900 dark:text-white"
              value={studentId}
              onChange={(e) => setStudentId(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Password</label>
            <input
              type="password"
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-corporate-blue-600 rounded-md shadow-sm focus:outline-none focus:ring-corporate-blue-500 focus:border-corporate-blue-500 dark:bg-corporate-blue-900 dark:text-white"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-corporate-blue-600 hover:bg-corporate-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-corporate-blue-500 transition-colors"
          >
            Sign in
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-gray-600 dark:text-gray-400">
          Don't have an account?{' '}
          <Link href="/register" className="font-medium text-corporate-red-500 hover:text-corporate-red-600">
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
}
