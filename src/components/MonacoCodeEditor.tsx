import React from "react";
import { Editor } from "@monaco-editor/react";

interface MonacoCodeEditorProps {
  value: string;
  onChange: (value: string) => void;
  language?: string;
  theme?: string;
  height?: string;
  readOnly?: boolean;
  className?: string;
}

const MonacoCodeEditor: React.FC<MonacoCodeEditorProps> = ({
  value,
  onChange,
  language = "javascript",
  theme = "vs-dark",
  height = "400px",
  readOnly = false,
  className = "",
}) => {
  const handleEditorChange = (value: string | undefined) => {
    onChange(value || "");
  };

  const handleEditorDidMount = (editor: any, monaco: any) => {
    // Ensure scrollbars are always visible
    editor.updateOptions({
      scrollbar: {
        vertical: "visible" as const,
        horizontal: "visible" as const,
        verticalScrollbarSize: 14,
        horizontalScrollbarSize: 14,
        arrowSize: 30,
      },
      minimap: { enabled: false },
      overviewRulerLanes: 0,
      scrollBeyondLastLine: true,
      automaticLayout: true,
    });

    // Force a layout update
    setTimeout(() => {
      editor.layout();
    }, 100);
  };

  const editorOptions = {
    fontSize: 14,
    fontFamily: "Fira Code, Monaco, Consolas, 'Courier New', monospace",
    automaticLayout: true,
    minimap: { enabled: false },
    scrollBeyondLastLine: true,
    wordWrap: "on" as const,
    lineNumbers: "on" as const,
    renderLineHighlight: "line" as const,
    selectOnLineNumbers: true,
    roundedSelection: false,
    readOnly,
    cursorStyle: "line" as const,
    tabSize: 2,
    insertSpaces: true,
    bracketPairColorization: { enabled: true },
    suggest: {
      showKeywords: true,
      showSnippets: true,
    },
    quickSuggestions: {
      other: true,
      comments: true,
      strings: true,
    },
    acceptSuggestionOnCommitCharacter: true,
    acceptSuggestionOnEnter: "on" as const,
    accessibilitySupport: "auto" as const,
    scrollbar: {
      vertical: "visible" as const,
      horizontal: "visible" as const,
      verticalScrollbarSize: 14,
      horizontalScrollbarSize: 14,
      arrowSize: 30,
      useShadows: false,
      verticalHasArrows: true,
      horizontalHasArrows: true,
      alwaysConsumeMouseWheel: true,
    },
    overviewRulerLanes: 0,
  };

  return (
    <div className={`${className}`} style={{ height, width: "100%" }}>
      <Editor
        height={height}
        language={language}
        value={value}
        onChange={handleEditorChange}
        theme={theme}
        options={editorOptions}
        onMount={handleEditorDidMount}
        loading={
          <div className="flex items-center justify-center h-full bg-gray-900">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-2"></div>
              <p className="text-gray-400">Loading Monaco Editor...</p>
            </div>
          </div>
        }
      />
    </div>
  );
};

export default MonacoCodeEditor;
