"use client"; 
// This tells Next.js that this component should run on the client (browser), not the server.

import { ChevronDown, ChevronUp } from "lucide-react"; 
// These are icon components used to visually indicate "Show More" or "Show Less".

import { useState } from "react"; 
// React hook to manage local component state.

import SyntaxHighlighter from "react-syntax-highlighter"; 
// A library to show code with colored syntax highlighting.

import { atomOneDark } from "react-syntax-highlighter/dist/esm/styles/hljs"; 
// A specific dark color theme used for highlighting code.

// Define the shape of props this component expects
interface CodeBlockProps {
  code: string;      // The actual code that will be displayed
  language: string;  // The programming language used (e.g., 'javascript')
}

// Define the functional component
const CodeBlock = ({ code, language }: CodeBlockProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  // This variable keeps track of whether the full code block is shown or not

  const lines = code.split("\n");
  // Break the code string into an array of lines

  const displayCode = isExpanded ? code : lines.slice(0, 6).join("\n");
  // If the block is expanded, show all lines. 
  // Otherwise, show only the first 6 lines.

  return (
    <div className="relative">
      {/* Code display using SyntaxHighlighter with styling */}
      <SyntaxHighlighter
        language={language.toLowerCase()}
        style={atomOneDark}
        customStyle={{
          padding: "1rem",                // Space inside the box
          borderRadius: "0.5rem",         // Rounded corners
          background: "rgba(0, 0, 0, 0.4)", // Semi-transparent dark background
          margin: 0,
        }}
      >
        {displayCode}
      </SyntaxHighlighter>

      {/* If the code has more than 6 lines, show the toggle button */}
      {lines.length > 6 && (
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="absolute bottom-2 right-2 px-2 py-1 
          bg-blue-500/20 text-blue-400 rounded text-xs 
          flex items-center gap-1 hover:bg-blue-500/30 
          transition-colors"
        >
          {/* Button text and icon depending on expanded state */}
          {isExpanded ? (
            <>
              Show Less <ChevronUp className="w-3 h-3" />
            </>
          ) : (
            <>
              Show More <ChevronDown className="w-3 h-3" />
            </>
          )}
        </button>
      )}
    </div>
  );
};

export default CodeBlock;
// Export the component so it can be used in other parts of the app
