"use client";

import React, { useRef, useEffect } from "react";
import * as monaco from "monaco-editor";

interface MonacoCodeEditorProps {
  value: string;
  onChange: (value: string) => void;
  language?: string;
  theme?: string;
  height?: string;
  readOnly?: boolean;
}

const MonacoCodeEditor: React.FC<MonacoCodeEditorProps> = ({
  value,
  onChange,
  language = "javascript",
  theme = "vs-dark",
  height = "400px",
  readOnly = false,
}) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const monacoRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);

  useEffect(() => {
    if (editorRef.current) {
      // Dispose previous editor if exists
      if (monacoRef.current) {
        monacoRef.current.dispose();
      }

      // Create new editor
      monacoRef.current = monaco.editor.create(editorRef.current, {
        value,
        language,
        theme,
        fontSize: 14,
        fontFamily: "Fira Code, Monaco, Consolas, monospace",
        automaticLayout: true,
        minimap: { enabled: false },
        scrollBeyondLastLine: false,
        wordWrap: "on",
        lineNumbers: "on",
        renderLineHighlight: "line",
        selectOnLineNumbers: true,
        roundedSelection: false,
        readOnly,
        cursorStyle: "line",
        tabSize: 2,
        insertSpaces: true,
      });

      // Handle content changes
      if (!readOnly) {
        monacoRef.current.onDidChangeModelContent(() => {
          const currentValue = monacoRef.current?.getValue() || "";
          onChange(currentValue);
        });
      }
    }

    return () => {
      if (monacoRef.current) {
        monacoRef.current.dispose();
      }
    };
  }, [language, theme, readOnly]);

  // Update value when prop changes
  useEffect(() => {
    if (monacoRef.current && monacoRef.current.getValue() !== value) {
      monacoRef.current.setValue(value);
    }
  }, [value]);

  return (
    <div
      ref={editorRef}
      style={{ height, width: "100%" }}
      className="border border-gray-300 rounded-lg overflow-hidden"
    />
  );
};

export default MonacoCodeEditor;
