"use client";

import { useEffect } from 'react';
import SnakeGame from '@/components/SnakeGame';

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen bg-[#0d1117] flex items-center justify-center p-4">
      <SnakeGame />
    </div>
  );
}
