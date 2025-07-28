import React from 'react'
// Importing types and hooks
import { Id } from '../../convex/_generated/dataModel' // Custom type for Convex IDs
import { useAuth } from '@clerk/nextjs' // Clerk auth hook
import { useMutation, useQuery } from 'convex/react'; // Convex hooks for mutations and queries
import { api } from '../../convex/_generated/api'; // Convex API generated routes
import { Star } from 'lucide-react'; // Star icon

// Component takes a snippetId as a prop
function StarButton({ snippetId }: { snippetId: Id<"snippets"> }) {
  const { isSignedIn } = useAuth(); // Check if user is signed in

  // Query to check if the snippet is already starred by the current user
  const isStarred = useQuery(api.snippets.isSnippetStarred, { snippetId });

  // Query to get total number of stars on the snippet
  const starCount = useQuery(api.snippets.getSnippetStarCount, { snippetId });

  // Mutation function to toggle star
  const star = useMutation(api.snippets.starSnippet);

  // Called when user clicks the star button
  const handleStar = async () => {
    if (!isSignedIn) return; // If not signed in, do nothing
    await star({ snippetId }); // Call Convex mutation to star/unstar the snippet
  };

  return (
    <button
      onClick={handleStar}
      className={`group flex items-center gap-1.5 px-3 py-1.5 rounded-lg 
        transition-all duration-200 
        ${isStarred
          ? "bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20" // Highlight if already starred
          : "bg-gray-500/10 text-gray-400 hover:bg-gray-500/20" // Neutral style if not starred
        }`}
    >
      {/* Star icon changes style if starred */}
      <Star
        className={`w-4 h-4 
          ${isStarred 
            ? "fill-yellow-500" // Filled star if starred
            : "fill-none group-hover:fill-gray-400" // Empty star otherwise
          }`}
      />
      {/* Display number of stars */}
      <span className={`text-xs font-medium 
        ${isStarred ? "text-yellow-500" : "text-gray-400"}`}>
        {starCount}
      </span>
    </button>
  );
}

export default StarButton
