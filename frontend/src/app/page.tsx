"use client";

import dynamic from 'next/dynamic';

const IDEWorkspace = dynamic(() => import('@/components/IDE/IDEWorkspace'), { ssr: false });

export default function Home() {
  return (
    <main className="flex flex-col min-h-screen bg-[#0d1117] text-white overflow-hidden">
      <div className="flex-1 overflow-hidden">
        <IDEWorkspace />
      </div>
      <footer className="text-center py-2 text-sm text-gray-500 bg-[#161b22] border-t border-[#30363d]">
        Designed and developed by Suyash Rathod
      </footer>
    </main>
  );
}
