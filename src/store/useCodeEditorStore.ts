// Import configuration for supported languages (like runtimes and versions)
import { LANGUAGE_CONFIG } from "@/app/(root)/_constants";
// Zustand is a small global state-management library
import { create } from "zustand";
// Type definition for our code editor state
import { CodeEditorState } from "../types";
// Monaco is the code editor used in VSCode and here in your app
import * as monaco from "monaco-editor";

// This function returns initial settings for the editor
// It checks if we're in a browser (window exists), and then loads saved values
const getInitialState = () => {
  if (typeof window === "undefined") {
    // If server-side (like during SSR), return default values
    return {
      language: "javascript",
      fontSize: 16,
      theme: "vs-dark",
    };
  }

  // Load saved values from localStorage or use defaults
  const savedLanguage = localStorage.getItem("editor-language") || "javascript";
  const savedTheme = localStorage.getItem("editor-theme") || "vs-dark";
  const savedFontSize = localStorage.getItem("editor-font-size") || "16";

  return {
    language: savedLanguage,
    theme: savedTheme,
    fontSize: Number(savedFontSize), // Convert fontSize to a number
  };
};

// Zustand store setup: useCodeEditorStore is the global state container
export const useCodeEditorStore = create<CodeEditorState>((set, get) => {
  const initialState = getInitialState(); // Get language, theme, fontSize

  return {
    ...initialState,         // Start with loaded values
    output: "",              // Output after code runs
    isRunning: false,        // Shows if code is currently executing
    error: null,             // Stores error messages (if any)
    editor: null,            // Monaco editor instance (real object)
    executionResult: null,   // Complete execution result: code + output + error

    // Get the current code from the editor (or empty string if not available)
    getCode: () => {
      const editor = get().editor;
      return editor ? editor.getValue() : "";
    },

    // Save the editor instance so other methods can use it
    setEditor: (editorInstance: monaco.editor.IStandaloneCodeEditor) => {
      // Try loading previously saved code for current language
      const savedCode = localStorage.getItem(`editor-code-${get().language}`);
      if (savedCode) editorInstance.setValue(savedCode); // Restore it into editor
      set({ editor: editorInstance }); // Save editor to store
    },

    // Called when user changes the language in dropdown
    setLanguage: (language: string) => {
      const currentEditor = get().editor;
      const prevLanguage = get().language;

      // Save the current code for old language before switching
      if (currentEditor) {
        const currentCode = currentEditor.getValue();
        localStorage.setItem(`editor-code-${prevLanguage}`, currentCode);
      }

      // Save new selected language and reset output + error
      localStorage.setItem("editor-language", language);
      set({ language, output: "", error: null });

      // Load any code saved earlier for this new language
      const savedCode = localStorage.getItem(`editor-code-${language}`);
      if (savedCode && currentEditor) {
        currentEditor.setValue(savedCode);
      }
    },

    // Save selected theme to localStorage and update state
    setTheme: (theme: string) => {
      localStorage.setItem("editor-theme", theme);
      set({ theme });
    },

    // Save selected font size to localStorage and update state
    setFontSize: (fontSize: number) => {
      localStorage.setItem("editor-font-size", fontSize.toString());
      set({ fontSize });
    },

    // Called when user clicks "Run Code" button
    runCode: async () => {
      const { language, getCode } = get();
      const code = getCode(); // Get the user's code from the editor

      if (!code) {
        // Show error if user hasn't typed anything
        set({ error: "Please enter some code" });
        return;
      }

      // Mark that code is running
      set({ isRunning: true, error: null, output: "" });

      try {
        // Get runtime (language name + version) for current language
        const runtime = LANGUAGE_CONFIG[language].pistonRuntime;

        // Send code to Piston API to execute remotely
        const response = await fetch("https://emkc.org/api/v2/piston/execute", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            language: runtime.language,
            version: runtime.version,
            files: [{ content: code }],
          }),
        });

        // Convert API response into JSON
        const data = await response.json();

        // Handle error from Piston like { message: "error text" }
        if (data.message) {
          set({
            error: data.message,
            executionResult: { code, output: "", error: data.message },
          });
          return;
        }

        // If there’s a compile error (for compiled languages like C++)
        if (data.compile && data.compile.code !== 0) {
          const error = data.compile.stderr || data.compile.output;
          set({
            error,
            executionResult: { code, output: "", error },
          });
          return;
        }

        // If there’s a runtime error (code ran but crashed)
        if (data.run && data.run.code !== 0) {
          const error = data.run.stderr || data.run.output;
          set({
            error,
            executionResult: { code, output: "", error },
          });
          return;
        }

        // If no error, take final output (remove extra newlines)
        const output = data.run.output?.trim() || "";

        // Save successful result
        set({
          output,
          error: null,
          executionResult: { code, output, error: null },
        });
      } catch (err) {
        // If something goes wrong (network, API crash, etc.)
        const message = err instanceof Error ? err.message : "Error running code";
        set({
          error: message,
          executionResult: { code, output: "", error: message },
        });
      } finally {
        // Always set running to false when done (even if there was error)
        set({ isRunning: false });
      }
    },
  };
});

// This allows other files to access execution result directly (without React hook)
export const getExecutionResult = () => useCodeEditorStore.getState().executionResult;
