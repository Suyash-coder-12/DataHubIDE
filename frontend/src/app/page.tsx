"use client";

import dynamic from 'next/dynamic';

const IDEWorkspace = dynamic(() => import('@/components/IDE/IDEWorkspace'), { ssr: false });

export default function Home() {
  return (
    <main className="flex min-h-screen bg-[#0d1117] text-white overflow-hidden">
      <IDEWorkspace />
    </main>
  );
}
