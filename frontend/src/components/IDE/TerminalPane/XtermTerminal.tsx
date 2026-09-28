"use client";

import React, { useEffect, useRef } from 'react';
import { Terminal } from 'xterm';
import { FitAddon } from 'xterm-addon-fit';
import 'xterm/css/xterm.css';

export interface TerminalRef {
  write: (text: string) => void;
  writeln: (text: string) => void;
  clear: () => void;
}

interface XtermProps {
  terminalRefOuter?: React.MutableRefObject<TerminalRef | null>;
}

export default function XtermTerminal({ terminalRefOuter }: XtermProps) {
  const terminalRef = useRef<HTMLDivElement>(null);
  const termRef = useRef<Terminal | null>(null);

  useEffect(() => {
    if (!terminalRef.current) return;
    
    let isMounted = true;

    // Initialize Xterm.js with Light Theme
    const term = new Terminal({
      cursorBlink: true,
      theme: {
        background: '#ffffff',
        foreground: '#334155', // slate-700
        cursor: '#3b82f6', // blue-500
        selectionBackground: 'rgba(59, 130, 246, 0.3)',
      },
      fontFamily: "'JetBrains Mono', 'Fira Code', 'Courier New', monospace",
      fontSize: 14,
    });
    
    const fitAddon = new FitAddon();
    term.loadAddon(fitAddon);

    termRef.current = term;

    let isOpened = false;

    const safeFit = () => {
      if (!isMounted) return;
      try {
        if (isOpened && terminalRef.current && terminalRef.current.clientWidth > 0) {
          if (term.element && term.element.clientWidth > 0) {
            fitAddon.fit();
          }
        }
      } catch (e) {
        console.warn("xterm fit error:", e);
      }
    };

    // Use ResizeObserver for reliable resizing and to delay term.open
    const resizeObserver = new ResizeObserver((entries) => {
      if (!isMounted) return;
      if (!terminalRef.current) return;
      
      const { width, height } = entries[0].contentRect;
      
      if (width > 0 && height > 0) {
        if (!isOpened) {
          try {
            term.open(terminalRef.current);
            isOpened = true;
            
            // Write initial welcome text
            term.writeln('\x1b[1;34mDataHubIDE Cloud Workspace initialized.\x1b[0m');
            term.writeln('Connecting to secure container...');
            term.writeln('Connected successfully.');
            term.write('\r\ndeveloper@datahub:~$ ');
          } catch(e) {
            console.error("Error opening terminal", e);
          }
        }
        
        // requestAnimationFrame avoids layout thrashing
        requestAnimationFrame(() => {
           if (isMounted) safeFit();
        });
      }
    });
    
    resizeObserver.observe(terminalRef.current);

    // Handle user typing for interactive terminal feel
    let inputBuffer = '';
    term.onData(e => {
      if (!isMounted) return;
      switch (e) {
        case '\r': // Enter
          term.writeln('');
          if (inputBuffer.trim() === 'clear') {
            term.clear();
          } else if (inputBuffer.trim() !== '') {
            term.writeln(`\x1b[31mbash: ${inputBuffer}: command not found\x1b[0m`);
          }
          inputBuffer = '';
          term.write('developer@datahub:~$ ');
          break;
        case '\x7F': // Backspace
          if (inputBuffer.length > 0) {
            inputBuffer = inputBuffer.slice(0, -1);
            term.write('\b \b');
          }
          break;
        default: // Normal chars
          if (e.length === 1 && e.charCodeAt(0) >= 32 && e.charCodeAt(0) <= 126) {
            inputBuffer += e;
            term.write(e);
          }
      }
    });

    if (terminalRefOuter) {
      terminalRefOuter.current = {
        write: (text: string) => isMounted && term.write(text),
        writeln: (text: string) => isMounted && term.writeln(text),
        clear: () => isMounted && term.clear(),
      };
    }

    return () => {
      isMounted = false;
      resizeObserver.disconnect();
      if (terminalRefOuter) terminalRefOuter.current = null;
      try {
        term.dispose();
      } catch(e) {}
    };
  }, []);

  return (
    <div className="absolute inset-0 p-3 bg-white" ref={terminalRef}></div>
  );
}
