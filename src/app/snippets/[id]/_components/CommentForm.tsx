// Import React and useState hook from the React library
import React, { useState } from 'react'
// Import CommentContent component (used for preview mode)
import CommentContent from './CommentContent';
// Import icons used in the form
import { CodeIcon, SendIcon } from "lucide-react";

// Define the type of props this component expects
interface CommentFormProps {
  onSubmit: (comment: string) => Promise<void>; // A function to call when form is submitted
  isSubmitting: boolean; // Indicates if the form is currently submitting
}

// Define the functional component CommentForm with props
function CommentForm({ isSubmitting, onSubmit }: CommentFormProps) {
  // comment: stores the current text user types
  const [comment, setComment] = useState("");

  // isPreview: whether the user is in Preview mode or Edit mode
  const [isPreview, setIsPreview] = useState(false);

  // Placeholder for key handling (not implemented right now)
  const handleKeyDown = () => {}

  // Called when the form is submitted
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevents the page from refreshing

    // If the comment is only spaces or empty, stop here
    if (!comment.trim()) return;

    // Call the parent function to submit the comment
    await onSubmit(comment);

    // Clear the input box after successful submit
    setComment("");

    // Return to edit mode after submitting
    setIsPreview(false);
  }

  return (
    // The entire form. onSubmit is handled by handleSubmit function
    <form onSubmit={handleSubmit} className="mb-8">
      {/* The container box for the comment area */}
      <div className="bg-[#0a0a0f] rounded-xl border border-[#ffffff0a] overflow-hidden">

        {/* --- HEADER --- */}
        {/* This section has the Preview/Edit toggle button */}
        <div className="flex justify-end gap-2 px-4 pt-2">
          <button
            type="button"
            onClick={() => setIsPreview(!isPreview)} // Switches between preview/edit
            className={`text-sm px-3 py-1 rounded-md transition-colors ${isPreview ? "bg-blue-500/10 text-blue-400" : "hover:bg-[#ffffff08] text-gray-400"
              }`}
          >
            {/* Shows either "Preview" or "Edit" depending on the mode */}
            {isPreview ? "Edit" : "Preview"}
          </button>
        </div>

        {/* --- BODY --- */}
        {/* Shows either the text input (Edit mode) or preview output */}
        {isPreview ? (
          // Preview mode: shows formatted comment preview
          <div className="min-h-[120px] p-4 text-[#e1e1e3">
            <CommentContent content={comment} />
          </div>
        ) : (
          // Edit mode: user types here
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)} // Updates comment state
            onKeyDown={handleKeyDown} // Placeholder for keyboard shortcuts
            placeholder="Add to the discussion..."
            className="w-full bg-transparent border-0 text-[#e1e1e3] placeholder:text-[#808086] outline-none 
            resize-none min-h-[120px] p-4 font-mono text-sm"
          />
        )}

        {/* --- FOOTER --- */}
        {/* Bottom section with code hint and submit button */}
        <div className="flex items-center justify-between gap-4 px-4 py-3 bg-[#080809] border-t border-[#ffffff0a]">
          
          {/* Info note about formatting (only visible on larger screens) */}
          <div className="hidden sm:block text-xs text-[#808086] space-y-1">
            <div className="flex items-center gap-2">
              <CodeIcon className="w-3.5 h-3.5" />
              <span>Format code with ```language</span>
            </div>
            <div className="text-[#808086]/60 pl-5">
              Tab key inserts spaces • Preview your comment before posting
            </div>
          </div>

          {/* Submit button */}
          <button
            type="submit"
            disabled={isSubmitting || !comment.trim()} // Disable if submitting or comment is empty
            className="flex items-center gap-2 px-4 py-2 bg-[#3b82f6] text-white rounded-lg hover:bg-[#2563eb] disabled:opacity-50 disabled:cursor-not-allowed transition-all ml-auto"
          >
            {/* Show loading spinner if submitting */}
            {isSubmitting ? (
              <>
                <div
                  className="w-4 h-4 border-2 border-white/30 
                border-t-white rounded-full animate-spin"
                />
                <span>Posting...</span>
              </>
            ) : (
              // Normal submit state
              <>
                <SendIcon className="w-4 h-4" />
                <span>Comment</span>
              </>
            )}
          </button>
        </div>
      </div>
    </form>
  )
}

export default CommentForm
