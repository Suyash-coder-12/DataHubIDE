"use client";

import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import MonacoEditor from './EditorPane/MonacoEditor';
import XtermTerminal, { TerminalRef } from './TerminalPane/XtermTerminal';
import LanguageSelector from './Sidebar/LanguageSelector';
import { motion } from 'framer-motion';
import { Play, Loader2, Maximize2, MoreHorizontal } from 'lucide-react';
import CoolLoader from '../CoolLoader';

export default function IDEWorkspace() {
  const [activeFile, setActiveFile] = useState('main.c');
  const [isRunning, setIsRunning] = useState(false);
  const [mounted, setMounted] = useState(false);
  const editorRefOuter = useRef<any>(null);
  const terminalRefOuter = useRef<TerminalRef | null>(null);
  const { token } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && !token) {
      router.push('/login');
    }
  }, [token, router, mounted]);

  if (!mounted || !token) return <CoolLoader />;

  const getLanguage = (filename: string) => {
    if (filename.endsWith('.go')) return 'go';
    if (filename.endsWith('.c')) return 'c';
    if (filename.endsWith('.cpp')) return 'cpp';
    if (filename.endsWith('.js') || filename.endsWith('.jsx')) return 'javascript';
    if (filename.endsWith('.ts') || filename.endsWith('.tsx')) return 'typescript';
    if (filename.endsWith('.py')) return 'python';
    return 'plaintext';
  };

  const handleRunCode = async () => {
    if (!editorRefOuter.current || !terminalRefOuter.current) return;
    
    const code = editorRefOuter.current.getValue();
    const language = getLanguage(activeFile);
    
    setIsRunning(true);
    terminalRefOuter.current.clear();
    terminalRefOuter.current.writeln(`\x1b[1;34m> Running ${activeFile}...\x1b[0m\r\n`);
    
    try {
      const response = await fetch('http://localhost:8080/api/run', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ language, code }),
      });
      
      const result = await response.json();
      
      if (result.error) {
        terminalRefOuter.current.writeln(`\x1b[1;31m${result.error.replace(/\n/g, '\r\n')}\x1b[0m`);
      }
      if (result.output) {
        terminalRefOuter.current.writeln(result.output.replace(/\n/g, '\r\n'));
      }
    } catch (error: any) {
      terminalRefOuter.current.writeln(`\x1b[1;31mError: ${error.message}\x1b[0m`);
    } finally {
      setIsRunning(false);
      terminalRefOuter.current.write('\r\n> ');
    }
  };

  return (
    <div className="flex h-full w-full bg-white text-gray-800 font-sans overflow-hidden rounded-[2rem]">
      
      {/* Sidebar / Language Selector */}
      <LanguageSelector activeFile={activeFile} setActiveFile={setActiveFile} />

      {/* Main Split Area */}
      <div className="flex-1 flex min-w-0">
        
        {/* Left Pane: Code Editor */}
        <div className="flex-1 flex flex-col min-w-0 border-r border-gray-200">
          {/* Editor Header */}
          <div className="h-14 bg-gray-50/80 backdrop-blur-md border-b border-gray-200 flex items-center justify-between px-4 text-gray-700">
             <div className="text-sm font-bold bg-white px-3 py-1.5 rounded-lg shadow-sm border border-gray-200">{activeFile}</div>
             <motion.button 
               whileHover={{ scale: 1.05 }}
               whileTap={{ scale: 0.95 }}
               onClick={handleRunCode}
               disabled={isRunning}
               className={`px-4 py-2 text-sm rounded-xl transition-all shadow-md font-bold flex items-center space-x-2 ${isRunning ? 'bg-gray-200 text-gray-500 shadow-none' : 'bg-blue-500 hover:bg-blue-600 text-white hover:shadow-blue-500/30'}`}>
               {isRunning ? (
                 <>
                   <Loader2 className="animate-spin h-4 w-4" />
                   <span>Running</span>
                 </>
               ) : (
                 <>
                   <Play className="h-4 w-4 fill-current" />
                   <span>Run Code</span>
                 </>
               )}
             </motion.button>
          </div>
          {/* Code Editor Container */}
          <div className="flex-1 relative bg-white">
             <MonacoEditor activeFile={activeFile} editorRefOuter={editorRefOuter} />
          </div>
        </div>

        {/* Right Pane: Terminal / Output */}
        <div className="flex-1 flex flex-col min-w-0 bg-[#fafbfc]">
          {/* Terminal Header */}
          <div className="h-14 bg-gray-50/80 backdrop-blur-md border-b border-gray-200 flex items-center justify-between px-4 text-gray-700">
             <div className="text-sm font-bold flex items-center">
                <span className="w-2 h-2 rounded-full bg-emerald-500 mr-2 shadow-[0_0_8px_rgb(16,185,129)]"></span>
                Console Output
             </div>
             <div className="flex space-x-2 text-gray-400">
                <motion.button whileHover={{ scale: 1.1, color: '#3b82f6' }} className="p-1.5 rounded-lg hover:bg-white hover:shadow-sm transition-all"><Maximize2 className="h-4 w-4" /></motion.button>
                <motion.button whileHover={{ scale: 1.1, color: '#3b82f6' }} className="p-1.5 rounded-lg hover:bg-white hover:shadow-sm transition-all"><MoreHorizontal className="h-4 w-4" /></motion.button>
             </div>
          </div>
          {/* Terminal Container */}
          <div className="flex-1 relative p-1">
            <XtermTerminal terminalRefOuter={terminalRefOuter} />
          </div>
        </div>
        
      </div>
    </div>
  );
}
