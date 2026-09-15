"use client";

import React, { useState, useRef } from 'react';
import MonacoEditor from './EditorPane/MonacoEditor';
import XtermTerminal, { TerminalRef } from './TerminalPane/XtermTerminal';
import LanguageSelector from './Sidebar/LanguageSelector';

export default function IDEWorkspace() {
  const [activeFile, setActiveFile] = useState('main.c');
  const [isRunning, setIsRunning] = useState(false);
  const editorRefOuter = useRef<any>(null);
  const terminalRefOuter = useRef<TerminalRef | null>(null);

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
      const response = await fetch('/api/run', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
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
    <div className="flex h-screen w-full bg-[#181a1f] text-[#abb2bf] font-sans overflow-hidden">
      
      {/* Sidebar / Language Selector */}
      <LanguageSelector activeFile={activeFile} setActiveFile={setActiveFile} />

      {/* Main Split Area */}
      <div className="flex-1 flex min-w-0">
        
        {/* Left Pane: Code Editor */}
        <div className="flex-1 flex flex-col min-w-0 border-r border-[#282c34]">
          {/* Editor Header */}
          <div className="h-12 bg-[#21252b] flex items-center justify-between px-4">
             <div className="text-sm font-semibold">{activeFile}</div>
             <button 
               onClick={handleRunCode}
               disabled={isRunning}
               className={`text-white px-4 py-1.5 text-sm rounded transition-colors shadow-sm font-medium flex items-center space-x-1 ${isRunning ? 'bg-gray-600' : 'bg-[#007acc] hover:bg-[#005f9e]'}`}>
               {isRunning ? (
                 <>
                   <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                   <span>Running</span>
                 </>
               ) : (
                 <>
                   <span>Run</span>
                   <svg className="w-4 h-4 ml-1" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" /></svg>
                 </>
               )}
             </button>
          </div>
          {/* Code Editor Container */}
          <div className="flex-1 relative bg-[#282c34]">
             <MonacoEditor activeFile={activeFile} editorRefOuter={editorRefOuter} />
          </div>
        </div>

        {/* Right Pane: Terminal / Output */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Terminal Header */}
          <div className="h-12 bg-[#21252b] flex items-center justify-between px-4">
             <div className="text-sm font-semibold">Output</div>
             <div className="flex space-x-2 text-[#5c6370]">
                {/* Placeholder Icons for right side of output */}
                <button className="hover:text-[#abb2bf]"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" /></svg></button>
                <button className="hover:text-[#abb2bf]"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" /></svg></button>
             </div>
          </div>
          {/* Terminal Container */}
          <div className="flex-1 relative bg-[#181a1f] p-2">
            <XtermTerminal terminalRefOuter={terminalRefOuter} />
          </div>
        </div>
        
      </div>
    </div>
  );
}
