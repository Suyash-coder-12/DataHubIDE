"use client";

import dynamic from 'next/dynamic';

const IDEWorkspace = dynamic(() => import('@/components/IDE/IDEWorkspace'), { ssr: false });

export default function Home() {
  return (
    <main className="flex flex-col min-h-screen bg-[#fafbfc] text-gray-900 overflow-hidden md:pl-28 pt-4 pb-24 md:pb-4 pr-4 pl-4 md:pl-0">
      <div className="flex-1 overflow-hidden rounded-[2rem] shadow-[0_8px_40px_rgb(0,0,0,0.06)] border border-gray-200/50 bg-white relative">
        <IDEWorkspace />
      </div>
    </main>
  );
}
