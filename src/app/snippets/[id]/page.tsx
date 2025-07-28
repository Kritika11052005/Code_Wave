// Marks this file to run on the client-side only in Next.js
"use client"

// Imports React-related hooks and components for functionality
import { useQuery } from 'convex/react';
import { useParams } from 'next/navigation';
import React from 'react';

// Import API routes and types from Convex backend
import { api } from '../../../../convex/_generated/api';
import { Id } from '../../../../convex/_generated/dataModel';

// Component shown while snippet data is loading
import SnippetLoadingSkeleton from './_components/SnippetLoadingSkeleton';

// Icons used in the UI
import { Code, User, MessageSquare, Clock } from 'lucide-react';

// Monaco code editor component
import { Editor } from '@monaco-editor/react';

// Reusable navigation header component
import NavigationHeader from '@/components/NavigationHeader';

// Language configuration and theme setup
import { LANGUAGE_CONFIG } from '@/app/(root)/_constants';
import { defineMonacoThemes } from '@/app/(root)/_constants';

// Custom copy-to-clipboard button
import CopyButton from './_components/CopyButton';

// Comments section component
import Comments from './_components/Comments';

function SnippetDetailPage() {
  // Extracts the snippet ID from the current URL (e.g., /snippets/[id])
  const snippetId = useParams().id;

  // Fetches the snippet details using the ID
  const snippet = useQuery(api.snippets.getSnippetById, {
    snippetId: snippetId as Id<"snippets">
  });

  // Fetches comments for the snippet
  const comments = useQuery(api.snippets.getComments, {
    snippetId: snippetId as Id<"snippets">
  });

  // While snippet is still loading, show loading skeleton
  if (snippet === undefined) return <SnippetLoadingSkeleton />;

  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      {/* Top navigation bar */}
      <NavigationHeader />

      {/* Main content container */}
      <main className="max-w-[90rem] mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
        <div className="max-w-[1200px] mx-auto">

          {/* Snippet metadata and header */}
          <div className="bg-[#121218] border border-[#ffffff0a] rounded-2xl p-6 sm:p-8 mb-6 backdrop-blur-xl">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">

              {/* Snippet avatar and metadata */}
              <div className="flex items-center gap-4">
                {/* Language icon */}
                <div className="flex items-center justify-center size-12 rounded-xl bg-[#ffffff08] p-2.5">
                  <img
                    src={`/${snippet.language}.png`} // e.g. "/python.png"
                    alt={`${snippet.language} logo`}
                    className="w-full h-full object-contain"
                  />
                </div>

                {/* Snippet title, user, date, and comments count */}
                <div>
                  <h1 className="text-xl sm:text-2xl font-semibold text-white mb-2">
                    {snippet.title}
                  </h1>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">

                    {/* User name */}
                    <div className="flex items-center gap-2 text-[#8b8b8d]">
                      <User className="w-4 h-4" />
                      <span>{snippet.userName}</span>
                    </div>

                    {/* Creation date */}
                    <div className="flex items-center gap-2 text-[#8b8b8d]">
                      <Clock className="w-4 h-4" />
                      <span>{new Date(snippet._creationTime).toLocaleDateString()}</span>
                    </div>

                    {/* Comments count */}
                    <div className="flex items-center gap-2 text-[#8b8b8d]">
                      <MessageSquare className="w-4 h-4" />
                      <span>{comments?.length} comments</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Language badge */}
              <div className="inline-flex items-center px-3 py-1.5 bg-[#ffffff08] text-[#808086] rounded-lg text-sm font-medium">
                {snippet.language}
              </div>
            </div>
          </div>

          {/* Read-only Code Editor Section */}
          <div className="mb-8 rounded-2xl overflow-hidden border border-[#ffffff0a] bg-[#121218]">

            {/* Editor header with label + copy button */}
            <div className="flex items-center justify-between px-4 sm:px-6 py-4 border-b border-[#ffffff0a]">
              <div className="flex items-center gap-2 text-[#808086]">
                <Code className="w-4 h-4" />
                <span className="text-sm font-medium">Source Code</span>
              </div>

              {/* Button to copy code to clipboard */}
              <CopyButton code={snippet.code} />
            </div>

            {/* Monaco editor configuration */}
            <Editor
              height="600px"
              language={LANGUAGE_CONFIG[snippet.language].monacoLanguage}
              value={snippet.code}
              theme="vs-dark"
              beforeMount={defineMonacoThemes} // defines custom themes
              options={{
                minimap: { enabled: true },
                fontSize: 16,
                readOnly: true, // users cannot edit this editor
                automaticLayout: true,
                scrollBeyondLastLine: false,
                padding: { top: 16 },
                renderWhitespace: "selection", // shows spaces/tabs only when selected
                fontFamily: '"Fira Code", "Cascadia Code", Consolas, monospace',
                fontLigatures: true, // allows combined characters like !== to look pretty
              }}
            />
          </div>

          {/* Comment section */}
          <Comments snippetId={snippet._id} />
        </div>
      </main>
    </div>
  );
}

export default SnippetDetailPage;
