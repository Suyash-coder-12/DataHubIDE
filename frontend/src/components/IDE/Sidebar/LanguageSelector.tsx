"use client";

import React from 'react';

export const LANGUAGES = [
  { id: 'c', name: 'main.c', label: 'C', icon: 'C' },
  { id: 'cpp', name: 'main.cpp', label: 'C++', icon: 'C++' },
  { id: 'python', name: 'main.py', label: 'Python', icon: 'PY' },
  { id: 'javascript', name: 'index.js', label: 'JavaScript', icon: 'JS' },
  { id: 'go', name: 'main.go', label: 'Go', icon: 'GO' },
];

interface LanguageSelectorProps {
  activeFile: string;
  setActiveFile: (filename: string) => void;
}

export default function LanguageSelector({ activeFile, setActiveFile }: LanguageSelectorProps) {
  return (
    <div className="w-14 bg-[#181a1f] border-r border-[#282c34] flex flex-col items-center py-4 space-y-4 shrink-0">
      {LANGUAGES.map((lang) => (
        <button
          key={lang.id}
          onClick={() => setActiveFile(lang.name)}
          title={lang.label}
          className={`w-10 h-10 flex items-center justify-center rounded-md font-bold text-xs transition-colors ${
            activeFile === lang.name 
              ? 'bg-[#282c34] text-white border-l-2 border-blue-500 rounded-none w-full' 
              : 'text-[#5c6370] hover:text-white hover:bg-[#282c34]'
          }`}
        >
          {lang.icon}
        </button>
      ))}
    </div>
  );
}
