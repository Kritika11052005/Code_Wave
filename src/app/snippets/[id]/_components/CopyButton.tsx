"use client" // Enables client-side rendering in Next.js

import React, { useState } from 'react'; // Import React and the useState hook
import { Check, Copy } from 'lucide-react'; // Import icons for UI feedback

// This component takes a prop called `code`, which is a string of text to be copied
function CopyButton({ code }: { code: string }) {
    // This state tracks whether the user has clicked and copied the code
    const [copied, setIsCopied] = useState(false);

    // Function that copies the code to the user's clipboard
    const copyToClipboard = async () => {
        await navigator.clipboard.writeText(code); // Copy code to clipboard
        setIsCopied(true);                         // Show checkmark icon
        setTimeout(() => setIsCopied(false), 2000); // Revert icon back after 2 seconds
    };

    return (
        <button
            onClick={copyToClipboard}              // Trigger copy when clicked
            type="button"
            className="p-2 hover:bg-white/10 rounded-lg transition-all duration-200 group relative"
        >
            {/* Show checkmark icon if recently copied, else show copy icon */}
            {copied ? (
                <Check className="size-4 text-green-400" />  // Success icon (copied)
            ) : (
                <Copy className="size-4 text-gray-400 group-hover:text-gray-300" /> // Default icon
            )}
        </button>
    );
}

export default CopyButton;
