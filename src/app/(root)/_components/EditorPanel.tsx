"use client"; // Marks this component as a client-side component (important in Next.js App Router).

// Importing various hooks and components required for this file.
import { useCodeEditorStore } from "@/store/useCodeEditorStore"; // Zustand state for editor values
import { useEffect, useState } from "react"; // React hooks for side effects and local state
import { defineMonacoThemes, LANGUAGE_CONFIG } from "../_constants"; // Theme and language-related configs
import { Editor } from "@monaco-editor/react"; // Monaco code editor component
import { motion } from "framer-motion"; // For button animations
import Image from "next/image"; // Next.js optimized image component
import { RotateCcwIcon, ShareIcon, TypeIcon } from "lucide-react"; // Icons
import { useClerk } from "@clerk/nextjs"; // Clerk authentication
import { EditorPanelSkeleton } from "./EditorPanelSkeleton"; // Loading UI
import useMounted from "@/hooks/useMounted"; // Custom hook to check if component has mounted (for SSR safety)
import ShareSnippetDialog from "./ShareSnippetDialog"; // Share dialog component

function EditorPanel() {
  const clerk = useClerk(); // Clerk object for auth status
  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false); // Controls share dialog visibility

  // Global state from Zustand store
  const { language, theme, fontSize, editor, setFontSize, setEditor } = useCodeEditorStore();

  const mounted = useMounted(); // Ensures we only render after component mounts (avoids hydration mismatch)

  // Effect: Load code from localStorage when language changes or editor mounts
  useEffect(() => {
    if (!editor) return;

    const savedCode = localStorage.getItem(`editor-code-${language}`); // Tries to load previously saved code
    const defaultCode = LANGUAGE_CONFIG[language]?.defaultCode || ""; // Fallback code from constants
    const currentCode = editor.getValue(); // Current code in editor

    // Only use saved code if it is valid (doesn’t contain legacy placeholder)
    const isSavedCodeValid = savedCode && !savedCode.includes("Python Playground");

    const finalCode = isSavedCodeValid ? savedCode : defaultCode;

    // If the code in the editor is different from finalCode, update it
    if (currentCode !== finalCode) {
      editor.setValue(finalCode);
    }
  }, [language, editor]);

  // Effect: Load saved font size from localStorage
  useEffect(() => {
    const savedFontSize = localStorage.getItem("editor-font-size");
    if (savedFontSize) setFontSize(parseInt(savedFontSize));
  }, [setFontSize]);

  // Reset button → sets editor to default code and removes local storage version
  const handleRefresh = () => {
    const defaultCode = LANGUAGE_CONFIG[language].defaultCode;
    if (editor) editor.setValue(defaultCode);
    localStorage.removeItem(`editor-code-${language}`);
  };

  // Called whenever the user types or edits code
  const handleEditorChange = (value: string | undefined) => {
    if (value) {
      localStorage.setItem(`editor-code-${language}`, value); // Persist current code
    }
  };

  // Called when user adjusts font size slider
  const handleFontSizeChange = (newSize: number) => {
    const size = Math.min(Math.max(newSize, 12), 24); // Keep within 12–24
    setFontSize(size); // Update global state
    localStorage.setItem("editor-font-size", size.toString()); // Persist font size
  };

  if (!mounted) return null; // Prevent rendering on server

  return (
    <div className="relative">
      {/* Main Container */}
      <div className="relative bg-[#12121a]/90 backdrop-blur rounded-xl border border-white/[0.05] p-6">
        
        {/* Header Section with Icon + Title + Controls */}
        <div className="flex items-center justify-between mb-4">
          {/* Logo and Title */}
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-[#1e1e2e] ring-1 ring-white/5">
              <Image src={"/" + language + ".png"} alt="Logo" width={24} height={24} />
            </div>
            <div>
              <h2 className="text-sm font-medium text-white">Code Editor</h2>
              <p className="text-xs text-gray-500">Write and execute your code</p>
            </div>
          </div>

          {/* Right-side Controls: Font Size, Reset, Share */}
          <div className="flex items-center gap-3">
            
            {/* Font Size Control */}
            <div className="flex items-center gap-3 px-3 py-2 bg-[#1e1e2e] rounded-lg ring-1 ring-white/5">
              <TypeIcon className="size-4 text-gray-400" />
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min="12"
                  max="24"
                  value={fontSize}
                  onChange={(e) => handleFontSizeChange(parseInt(e.target.value))}
                  className="w-20 h-1 bg-gray-600 rounded-lg cursor-pointer"
                  aria-label="Font size selector"
                />
                <span className="text-sm font-medium text-gray-400 min-w-[2rem] text-center">
                  {fontSize}
                </span>
              </div>
            </div>

            {/* Refresh Button */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleRefresh}
              className="p-2 bg-[#1e1e2e] hover:bg-[#2a2a3a] rounded-lg ring-1 ring-white/5 transition-colors"
              aria-label="Reset to default code"
            >
              <RotateCcwIcon className="size-4 text-gray-400" />
            </motion.button>

            {/* Share Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setIsShareDialogOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg overflow-hidden bg-gradient-to-r
               from-blue-500 to-blue-600 opacity-90 hover:opacity-100 transition-opacity"
            >
              <ShareIcon className="size-4 text-white" />
              <span className="text-sm font-medium text-white ">Share</span>
            </motion.button>
          </div>
        </div>

        {/* Main Monaco Editor Panel */}
        <div className="relative group rounded-xl overflow-hidden ring-1 ring-white/[0.05]">
          {/* If Clerk is ready → show editor */}
          {clerk.loaded && (
            <Editor
              key={language} // Force re-render on language change
              height="600px"
              language={LANGUAGE_CONFIG[language].monacoLanguage}
              onChange={handleEditorChange}
              theme={theme}
              beforeMount={defineMonacoThemes}
              onMount={(editor) => setEditor(editor)}
              options={{
                minimap: { enabled: false },
                fontSize,
                automaticLayout: true,
                scrollBeyondLastLine: false,
                padding: { top: 16, bottom: 16 },
                renderWhitespace: "selection",
                fontFamily: '"Fira Code", "Cascadia Code", Consolas, monospace',
                fontLigatures: true,
                cursorBlinking: "smooth",
                smoothScrolling: true,
                contextmenu: true,
                renderLineHighlight: "all",
                lineHeight: 1.6,
                letterSpacing: 0.5,
                roundedSelection: true,
                scrollbar: {
                  verticalScrollbarSize: 8,
                  horizontalScrollbarSize: 8,
                },
              }}
            />
          )}

          {/* Else → show loading skeleton */}
          {!clerk.loaded && <EditorPanelSkeleton />}
        </div>
      </div>

      {/* Dialog shown when Share button is clicked */}
      {isShareDialogOpen && <ShareSnippetDialog onClose={() => setIsShareDialogOpen(false)} />}
    </div>
  );
}

export default EditorPanel;
