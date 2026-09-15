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

    // Initialize Xterm.js
    const term = new Terminal({
      cursorBlink: true,
      theme: {
        background: '#0d1117',
        foreground: '#c9d1d9',
        cursor: '#58a6ff',
        selectionBackground: 'rgba(88, 166, 255, 0.3)',
      },
      fontFamily: "'JetBrains Mono', 'Fira Code', 'Courier New', monospace",
      fontSize: 13,
    });
    
    const fitAddon = new FitAddon();
    term.loadAddon(fitAddon);

    term.open(terminalRef.current);
    fitAddon.fit();
    termRef.current = term;

    // Simulate boot sequence for the UI preview
    term.writeln('\x1b[1;32mCloud IDE Workspace initialized.\x1b[0m');
    term.writeln('Connecting to container workspace-dev-123...');
    term.writeln('Connected successfully.');
    term.write('\r\ndeveloper@workspace:~$ ');

    // Handle resize
    const handleResize = () => fitAddon.fit();
    window.addEventListener('resize', handleResize);

    // Expose methods to parent
    if (terminalRefOuter) {
      terminalRefOuter.current = {
        write: (text: string) => term.write(text),
        writeln: (text: string) => term.writeln(text),
        clear: () => term.clear(),
      };
    }

    return () => {
      window.removeEventListener('resize', handleResize);
      if (terminalRefOuter) terminalRefOuter.current = null;
      term.dispose();
    };
  }, []);

  return (
    <div className="absolute inset-0 p-2" ref={terminalRef}></div>
  );
}
