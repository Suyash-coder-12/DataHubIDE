"use client";

import { CheckCircle2, Circle, ListFilter } from 'lucide-react';

export default function ProblemsPage() {
  const problems = [
    { id: 1, title: 'Two Sum', difficulty: 'Easy', acceptance: '53.2%', solved: true },
    { id: 2, title: 'Add Two Numbers', difficulty: 'Medium', acceptance: '42.6%', solved: true },
    { id: 3, title: 'Longest Substring Without Repeating Characters', difficulty: 'Medium', acceptance: '34.8%', solved: false },
    { id: 4, title: 'Median of Two Sorted Arrays', difficulty: 'Hard', acceptance: '40.2%', solved: false },
    { id: 5, title: 'Longest Palindromic Substring', difficulty: 'Medium', acceptance: '33.9%', solved: false },
    { id: 6, title: 'Zigzag Conversion', difficulty: 'Medium', acceptance: '48.1%', solved: false },
    { id: 7, title: 'Reverse Integer', difficulty: 'Medium', acceptance: '28.5%', solved: false },
  ];

  return (
    <div className="min-h-screen p-8 bg-gray-50 dark:bg-gray-900 transition-colors">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Problems</h1>
          <button className="flex items-center px-4 py-2 bg-white dark:bg-corporate-blue-800 border border-gray-200 dark:border-corporate-blue-700 rounded-lg text-sm font-medium hover:bg-gray-50 dark:hover:bg-corporate-blue-700 transition-colors">
            <ListFilter className="w-4 h-4 mr-2" /> Filter
          </button>
        </div>

        <div className="bg-white dark:bg-corporate-blue-800 border border-gray-200 dark:border-corporate-blue-700 rounded-xl overflow-hidden shadow-sm">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 dark:bg-corporate-blue-900/50 border-b border-gray-200 dark:border-corporate-blue-700 text-sm font-semibold text-gray-600 dark:text-gray-300">
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Title</th>
                <th className="px-6 py-4">Acceptance</th>
                <th className="px-6 py-4">Difficulty</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-corporate-blue-700">
              {problems.map((prob) => (
                <tr key={prob.id} className="hover:bg-gray-50 dark:hover:bg-corporate-blue-900/30 transition-colors cursor-pointer">
                  <td className="px-6 py-4">
                    {prob.solved ? (
                      <CheckCircle2 className="w-5 h-5 text-green-500" />
                    ) : (
                      <Circle className="w-5 h-5 text-gray-300 dark:text-gray-600" />
                    )}
                  </td>
                  <td className="px-6 py-4 font-medium text-gray-900 dark:text-white hover:text-corporate-blue-600 dark:hover:text-corporate-blue-400">
                    {prob.id}. {prob.title}
                  </td>
                  <td className="px-6 py-4 text-gray-600 dark:text-gray-400">{prob.acceptance}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold
                      ${prob.difficulty === 'Easy' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : ''}
                      ${prob.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' : ''}
                      ${prob.difficulty === 'Hard' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' : ''}
                    `}>
                      {prob.difficulty}
                    </span>
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
