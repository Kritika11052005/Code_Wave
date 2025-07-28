// Importing React and useState to manage component state
import React, { useState } from 'react'

// Importing Convex ID type for typesafety (snippetId is of type Id<"snippets">)
import { Id } from '../../../../../convex/_generated/dataModel'

// Getting currently logged-in user from Clerk
import { useUser } from '@clerk/nextjs'

// Convex hooks to call functions: one to fetch data (useQuery) and others to send data (useMutation)
import { useMutation, useQuery } from 'convex/react';

// Importing the Convex API definition
import { api } from '../../../../../convex/_generated/api';

// Toast is used to show small notification popups (for errors)
import toast from 'react-hot-toast';

// Icon used for comments header
import { MessageSquare } from 'lucide-react';

// A prebuilt Clerk SignIn modal trigger
import { SignInButton } from '@clerk/nextjs';

// Importing 2 custom components: each individual comment and the form to write a comment
import Comment from './Comment';
import CommentForm from './CommentForm';

// Main component to show and handle the comment section for a snippet
function Comments({ snippetId }: { snippetId: Id<"snippets"> }) {
  // Get the currently logged-in user (or null if signed out)
  const { user } = useUser();

  // Local state to know when a comment is being submitted (used to disable the form during submit)
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Local state to track which comment is being deleted (used to show a loading spinner only on that one)
  const [deletingCommentId, setIsDeletingCommentId] = useState<string | null>(null);

  // Fetch all comments related to this snippet from Convex DB
  const comments = useQuery(api.snippets.getComments, { snippetId }) || [];

  // Function to send a new comment to Convex backend
  const addComment = useMutation(api.snippets.addComment);

  // Function to delete a comment in Convex backend
  const deleteComment = useMutation(api.snippets.deleteComment);

  // Called when user submits a comment
  const handleSubmitComment = async (content: string) => {
    setIsSubmitting(true); // Start loading state
    try {
      await addComment({ snippetId, content }); // Try to submit comment
    } catch (error) {
      toast.error("Something went wrong"); // Show error if failed
    } finally {
      setIsSubmitting(false); // Stop loading state
    }
  }

  // Called when user deletes a comment
  const handleDeleteComment = async (commentId: Id<"snippetComments">) => {
    setIsDeletingCommentId(commentId); // Mark which comment is being deleted
    try {
      await deleteComment({ commentId }); // Try to delete
    } catch (error) {
      toast.error("Something went wrong"); // Show error if failed
    } finally {
      setIsDeletingCommentId(null); // Reset delete state
    }
  }

  return (
    // Main container with dark theme and rounded border
    <div className="bg-[#121218] border border-[#ffffff0a] rounded-2xl overflow-hidden">
      
      {/* Header section for the comment area */}
      <div className="px-6 sm:px-8 py-6 border-b border-[#ffffff0a]">
        <h2 className="text-lg font-semibold text-white flex items-center gap-2">
          <MessageSquare className="w-5 h-5" />
          Discussion ({comments.length}) {/* Show number of comments */}
        </h2>
      </div>

      {/* Body of comment section */}
      <div className="p-6 sm:p-8">

        {/* If user is signed in, show comment input form */}
        {user ? (
          <CommentForm 
            onSubmit={handleSubmitComment} 
            isSubmitting={isSubmitting} 
          />
        ) : (
          // If user is NOT signed in, show sign-in prompt with SignInButton
          <div className="bg-[#0a0a0f] rounded-xl p-6 text-center mb-8 border border-[#ffffff0a]">
            <p className="text-[#808086] mb-4">Sign in to join the discussion</p>
            <SignInButton mode="modal">
              <button className="px-6 py-2 bg-[#3b82f6] text-white rounded-lg hover:bg-[#2563eb] transition-colors">
                Sign In
              </button>
            </SignInButton>
          </div>
        )}

        {/* List of comments */}
        <div className="space-y-6">
          {comments.map((comment) => (
            <Comment
              key={comment._id}                        // Unique key
              comment={comment}                        // Pass comment data
              onDelete={handleDeleteComment}           // Handle delete
              isDeleting={deletingCommentId === comment._id}  // Show loading if being deleted
              currentUserId={user?.id}                 // Pass current user id to check if user can delete
            />
          ))}
        </div>
      </div>
    </div>
  )
}

// Export the component so it can be used in SnippetDetailPage
export default Comments
