"use client";

import React, { useRef, useEffect } from 'react';
import Editor from '@monaco-editor/react';

interface MonacoEditorProps {
  activeFile: string;
  editorRefOuter?: React.MutableRefObject<any>;
}

const TEMPLATES: Record<string, string> = {
  'main.c': `#include <stdio.h>\n\nint main() {\n    printf("Start small. Ship something.\\n");\n    return 0;\n}`,
  'main.cpp': `#include <iostream>\n\nint main() {\n    std::cout << "Start small. Ship something.\\n";\n    return 0;\n}`,
  'main.py': `print("Start small. Ship something.")`,
  'index.js': `console.log("Start small. Ship something.");`,
  'main.go': `package main\n\nimport "fmt"\n\nfunc main() {\n    fmt.Println("Start small. Ship something.")\n}`,
};

export default function MonacoEditorComponent({ activeFile, editorRefOuter }: MonacoEditorProps) {
  const editorRef = useRef<any>(null);

  function handleEditorDidMount(editor: any, monaco: any) {
    editorRef.current = editor;
    if (editorRefOuter) {
      editorRefOuter.current = editor;
    }
  }

  // Update editor value when active file changes
  useEffect(() => {
    if (editorRef.current) {
      const currentModel = editorRef.current.getModel();
      const newLanguage = getLanguage(activeFile);
      const newContent = TEMPLATES[activeFile] || "";
      
      // We overwrite the code when switching tabs to act as a default template for now
      editorRef.current.setValue(newContent);
      
      // Update model language if necessary (monaco doesn't auto-update if value is set manually sometimes)
      if (currentModel && monacoRef.current) {
        monacoRef.current.editor.setModelLanguage(currentModel, newLanguage);
      }
    }
  }, [activeFile]);

  const monacoRef = useRef<any>(null);
  
  function handleBeforeMount(monaco: any) {
    monacoRef.current = monaco;
  }

  const getLanguage = (filename: string) => {
    if (filename.endsWith('.go')) return 'go';
    if (filename.endsWith('.c')) return 'c';
    if (filename.endsWith('.cpp')) return 'cpp';
    if (filename.endsWith('.js') || filename.endsWith('.jsx')) return 'javascript';
    if (filename.endsWith('.ts') || filename.endsWith('.tsx')) return 'typescript';
    if (filename.endsWith('.py')) return 'python';
    return 'plaintext';
  };

  return (
    <div className="absolute inset-0">
      <Editor
        height="100%"
        language={getLanguage(activeFile)}
        theme="vs-dark"
        defaultValue={TEMPLATES[activeFile] || ""}
        onMount={handleEditorDidMount}
        beforeMount={handleBeforeMount}
        options={{
          minimap: { enabled: false },
          fontSize: 14,
          fontFamily: "'JetBrains Mono', 'Fira Code', 'Courier New', monospace",
          scrollBeyondLastLine: false,
          smoothScrolling: true,
          cursorBlinking: "smooth",
          padding: { top: 16 }
        }}
      />
    </div>
  );
}
