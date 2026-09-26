"use client";

import { Briefcase, FileText, Video, Target, ArrowRight } from 'lucide-react';

export default function InterviewPage() {
  return (
    <div className="min-h-screen p-8 bg-gray-50 dark:bg-gray-900 transition-colors">
      <div className="max-w-6xl mx-auto space-y-10">
        
        <div className="text-center max-w-2xl mx-auto space-y-4">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white">Crush Your Next Interview</h1>
          <p className="text-gray-500 dark:text-gray-400 text-lg">
            Comprehensive tools, mock assessments, and curated company-specific questions to help you land your dream job.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Mock Assessments */}
          <div className="bg-white dark:bg-corporate-blue-800 rounded-2xl p-8 shadow-sm border border-gray-200 dark:border-corporate-blue-700 flex flex-col">
            <div className="w-14 h-14 bg-red-100 dark:bg-red-900/30 text-corporate-red-600 dark:text-red-400 rounded-xl flex items-center justify-center mb-6">
              <FileText className="w-7 h-7" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">Online Assessments</h2>
            <p className="text-gray-500 dark:text-gray-400 mb-8 flex-1">
              Simulate real company online assessments. Timed environments with strict anti-cheat measures to test your readiness.
            </p>
            <button className="flex items-center justify-between w-full py-3 px-6 bg-gray-50 dark:bg-corporate-blue-900 rounded-xl font-semibold text-gray-800 dark:text-white hover:bg-gray-100 dark:hover:bg-corporate-blue-700 transition-colors group">
              Start Assessment
              <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-gray-800 dark:group-hover:text-white transition-colors" />
            </button>
          </div>

          {/* Company Prep */}
          <div className="bg-white dark:bg-corporate-blue-800 rounded-2xl p-8 shadow-sm border border-gray-200 dark:border-corporate-blue-700 flex flex-col">
            <div className="w-14 h-14 bg-blue-100 dark:bg-blue-900/30 text-corporate-blue-600 dark:text-blue-400 rounded-xl flex items-center justify-center mb-6">
              <Briefcase className="w-7 h-7" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">Company Playbooks</h2>
            <p className="text-gray-500 dark:text-gray-400 mb-8 flex-1">
              Top questions asked by Google, Meta, Amazon, and more over the last 6 months. Focus your practice effectively.
            </p>
            <button className="flex items-center justify-between w-full py-3 px-6 bg-gray-50 dark:bg-corporate-blue-900 rounded-xl font-semibold text-gray-800 dark:text-white hover:bg-gray-100 dark:hover:bg-corporate-blue-700 transition-colors group">
              Explore Companies
              <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-gray-800 dark:group-hover:text-white transition-colors" />
            </button>
          </div>

          {/* Mock Interviews */}
          <div className="bg-white dark:bg-corporate-blue-800 rounded-2xl p-8 shadow-sm border border-gray-200 dark:border-corporate-blue-700 flex flex-col">
            <div className="w-14 h-14 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-xl flex items-center justify-center mb-6">
              <Video className="w-7 h-7" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">Mock Interviews</h2>
            <p className="text-gray-500 dark:text-gray-400 mb-8 flex-1">
              Practice 1-on-1 with peers anonymously. Give and receive actionable feedback on communication and coding skills.
            </p>
            <button className="flex items-center justify-between w-full py-3 px-6 bg-gray-50 dark:bg-corporate-blue-900 rounded-xl font-semibold text-gray-800 dark:text-white hover:bg-gray-100 dark:hover:bg-corporate-blue-700 transition-colors group">
              Find a Peer
              <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-gray-800 dark:group-hover:text-white transition-colors" />
            </button>
          </div>

          {/* System Design */}
          <div className="bg-white dark:bg-corporate-blue-800 rounded-2xl p-8 shadow-sm border border-gray-200 dark:border-corporate-blue-700 flex flex-col">
            <div className="w-14 h-14 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-xl flex items-center justify-center mb-6">
              <Target className="w-7 h-7" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">System Design</h2>
            <p className="text-gray-500 dark:text-gray-400 mb-8 flex-1">
              Architect scalable solutions. Case studies and interactive whiteboarding sessions for senior engineering roles.
            </p>
            <button className="flex items-center justify-between w-full py-3 px-6 bg-gray-50 dark:bg-corporate-blue-900 rounded-xl font-semibold text-gray-800 dark:text-white hover:bg-gray-100 dark:hover:bg-corporate-blue-700 transition-colors group">
              Start Designing
              <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-gray-800 dark:group-hover:text-white transition-colors" />
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
