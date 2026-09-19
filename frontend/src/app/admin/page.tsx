"use client";

import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuthStore } from '@/store/authStore';
import { useRouter } from 'next/navigation';
import { Trash2, LogOut } from 'lucide-react';

export default function AdminPage() {
  const [users, setUsers] = useState<any[]>([]);
  const { token, role, logout } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (role !== 'admin') {
      router.push('/');
      return;
    }

    const fetchUsers = async () => {
      try {
        const res = await axios.get('http://localhost:8080/api/admin/users', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUsers(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchUsers();
  }, [role, token, router]);

  const handleDelete = async (targetId: number) => {
    if (!confirm('Are you sure you want to delete this user?')) return;
    
    try {
      await axios.post('http://localhost:8080/api/admin/users/delete', { target_user_id: targetId }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsers(users.filter(u => u.id !== targetId));
    } catch (err) {
      console.error(err);
      alert('Failed to delete user');
    }
  };

  if (role !== 'admin') return null;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-corporate-blue-900 dark:text-white">Admin Dashboard</h1>
        <button
          onClick={() => {
            logout();
            router.push('/admin/login');
          }}
          className="flex items-center hover:text-corporate-red-400 px-3 py-2 rounded-md text-sm font-medium transition-colors text-corporate-blue-900 dark:text-white"
        >
          <LogOut className="h-4 w-4 mr-1" />
          Logout
        </button>
      </div>
      
      <div className="bg-white dark:bg-corporate-blue-800 rounded-xl shadow-lg border border-gray-200 dark:border-corporate-blue-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-corporate-blue-700">
            <thead className="bg-gray-50 dark:bg-corporate-blue-900">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Student ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Role</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Total Contributions</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-corporate-blue-800 divide-y divide-gray-200 dark:divide-corporate-blue-700">
              {users.map((user) => (
                <tr key={user.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                    {user.student_id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                    {user.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${user.role === 'admin' ? 'bg-corporate-red-100 text-corporate-red-800' : 'bg-green-100 text-green-800'}`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                    {user.total_contributions}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    {user.role !== 'admin' && (
                      <button onClick={() => handleDelete(user.id)} className="text-red-600 hover:text-red-900 flex items-center justify-end w-full">
                        <Trash2 className="h-4 w-4 mr-1" /> Delete
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
