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
    <div className="w-14 bg-white border-r border-gray-200 flex flex-col items-center py-4 space-y-4 shrink-0 shadow-sm z-10">
      {LANGUAGES.map((lang) => (
        <button
          key={lang.id}
          onClick={() => setActiveFile(lang.name)}
          title={lang.label}
          className={`w-10 h-10 flex items-center justify-center rounded-xl font-bold text-xs transition-all ${
            activeFile === lang.name 
              ? 'bg-blue-50 text-blue-600 shadow-sm border border-blue-100' 
              : 'text-gray-400 hover:text-blue-500 hover:bg-gray-50'
          }`}
        >
          {lang.icon}
        </button>
      ))}
    </div>
  );
}
