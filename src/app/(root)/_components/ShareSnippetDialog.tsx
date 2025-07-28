// Import necessary tools and libraries
import { useCodeEditorStore } from '@/store/useCodeEditorStore'; // Store to get editor state
import { useMutation } from 'convex/react'; // Hook to run Convex mutations
import React, { useState } from 'react' // React and useState for local state
import { api } from '../../../../convex/_generated/api'; // API endpoints from Convex
import { X } from 'lucide-react'; // Close icon
import toast from 'react-hot-toast'; // For showing popup messages

// This is the main component for the "Share Snippet" dialog box
function ShareSnippetDialog({ onClose }: { onClose: () => void }) {
    // Stores the snippet title entered by user
    const [title, setTitle] = useState("");

    // Controls the loading state while sharing
    const [isSharing, setIsSharing] = useState(false);

    // Access code and language from the code editor store
    const { language, getCode } = useCodeEditorStore();

    // This will call the API to create a new code snippet
    const createSnippet = useMutation(api.snippets.createSnippet)

    // Called when the user submits the form to share a snippet
    const handleShare = async (e: React.FormEvent) => {
        e.preventDefault(); // Stop the page from reloading
        setIsSharing(true); // Show loading

        try {
            const code = getCode(); // Get current code from editor
            await createSnippet({ title, language, code }); // Send snippet to server
            onClose(); // Close the dialog
            setTitle(""); // Reset the title field
            toast.success("Snippet shared successfully!") // Show success popup
        } catch (error) {
            toast.error("Error creating snippet"); // Show error popup
        } finally {
            setIsSharing(false); // Remove loading state
        }
    }

    // Return the dialog UI
    return (
        // Covers the screen with a dark background
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            {/* The main box where inputs and buttons are shown */}
            <div className="bg-[#1e1e2e] rounded-lg p-6 w-full max-w-md">
                {/* Header with title and close icon */}
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold text-white">Share Snippet</h2>
                    {/* Close button */}
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-300" aria-label="Close dialog">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Form to enter snippet title and share */}
                <form onSubmit={handleShare}>
                    <div className="mb-4">
                        <label htmlFor="title" className="block text-sm font-medium text-gray-400 mb-2">
                            Title
                        </label>
                        {/* Input for snippet title */}
                        <input
                            type="text"
                            id="title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)} // Update title
                            className="w-full px-3 py-2 bg-[#181825] border border-[#313244] rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter snippet title"
                            required
                        />
                    </div>

                    {/* Buttons: Cancel and Share */}
                    <div className="flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={onClose} // Close dialog without sharing
                            className="px-4 py-2 text-gray-400 hover:text-gray-300"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isSharing} // Disable if already sharing
                            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
                        >
                            {isSharing ? "Sharing..." : "Share"} {/* Button text changes during loading */}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

// Export the component so it can be used in other files
export default ShareSnippetDialog
