// Import necessary icons from lucide-react and types
import { Trash2Icon, UserIcon } from "lucide-react";
import { Id } from "../../../../../convex/_generated/dataModel";
import CommentContent from "./CommentContent";

// Define the props that the Comment component needs
interface CommentProps {
  comment: {
    _id: Id<"snippetComments">;       // Unique ID of this comment
    _creationTime: number;           // When the comment was created (timestamp)
    userId: string;                  // ID of the user who wrote the comment
    userName: string;                // Name of the user who wrote the comment
    snippetId: Id<"snippets">;       // The ID of the code snippet this comment belongs to
    content: string;                // The actual comment text
  };
  onDelete: (commentId: Id<"snippetComments">) => void; // Function to delete comment
  isDeleting: boolean;                                // Whether deletion is in progress
  currentUserId?: string;                             // ID of current logged-in user
}

// Main functional component
function Comment({ comment, currentUserId, isDeleting, onDelete }: CommentProps) {
  return (
    <div className="group">
      {/* Outer comment container with hover effects */}
      <div className="bg-[#0a0a0f] rounded-xl p-6 border border-[#ffffff0a] hover:border-[#ffffff14] transition-all">
        
        {/* Top row: user info on the left, delete button on the right */}
        <div className="flex items-start sm:items-center justify-between gap-4 mb-4">
          {/* Left side: User avatar and name */}
          <div className="flex items-center gap-3">
            {/* Circle avatar with user icon */}
            <div className="w-9 h-9 rounded-full bg-[#ffffff08] flex items-center justify-center flex-shrink-0">
              <UserIcon className="w-4 h-4 text-[#808086]" />
            </div>

            {/* User name and date */}
            <div className="min-w-0">
              <span className="block text-[#e1e1e3] font-medium truncate">
                {comment.userName} {/* Name of the comment author */}
              </span>
              <span className="block text-sm text-[#808086]">
                {new Date(comment._creationTime).toLocaleDateString()} {/* Display readable date */}
              </span>
            </div>
          </div>

          {/* Right side: show delete button if current user is the comment author */}
          {comment.userId === currentUserId && (
            <button
              onClick={() => onDelete(comment._id)} // Delete this comment
              disabled={isDeleting} // Disable while deleting
              className="opacity-0 group-hover:opacity-100 p-2 hover:bg-red-500/10 rounded-lg transition-all"
              title="Delete comment"
            >
              <Trash2Icon className="w-4 h-4 text-red-400" />
            </button>
          )}
        </div>

        {/* Actual comment content rendered below user info */}
        <CommentContent content={comment.content} />
      </div>
    </div>
  );
}

export default Comment;
