export const getMonacoLanguage = (languageId: string): string => {
  const languageMap: { [key: string]: string } = {
    "63": "javascript",
    "71": "python",
    "62": "java",
    "54": "cpp",
    "50": "c",
    "51": "csharp",
    "78": "kotlin",
    "60": "go",
    "72": "ruby",
    "68": "php",
    "75": "typescript",
    "76": "rust",
    "77": "swift",
    javascript: "javascript",
    python: "python",
    java: "java",
    cpp: "cpp",
    c: "c",
    csharp: "csharp",
    kotlin: "kotlin",
    go: "go",
    ruby: "ruby",
    php: "php",
    typescript: "typescript",
    rust: "rust",
    swift: "swift",
  };

  return languageMap[languageId] || "javascript";
};
