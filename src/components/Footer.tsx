// Import icons from lucide-react (icon pack)
import { Blocks, Github, Mail, Linkedin, Computer } from "lucide-react";

// Import Link from Next.js (not used in this file but imported anyway)
import Link from "next/link";

// Define the Footer component
function Footer() {
    return (
        // Footer HTML element (semantic, for screen readers and SEO)
        <footer className="relative border-t border-gray-400/50 mt-auto">
            {/* Thin horizontal line at the top of footer with gradient */}
            <div className="absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-gray-900 to-transparent" />

            {/* Container to center and pad content */}
            <div className="max-w-7xl mx-auto px-4 py-8">
                {/* Flex container to arrange items in a row (or column on small screens) */}
                <div className="flex flex-col md:flex-row items-center justify-between gap-4">

                    {/* Section showing the site author's name with a computer icon */}
                    <div className="flex items-center gap-2 text-gray-400">
                        <Computer className="size-5" /> {/* Renders a computer icon */}
                        <span>Built by Kritika Benjwal</span> {/* Text label */}
                    </div>

                    {/* Section showing clickable social media links */}
                    <div className="flex items-center gap-4">
                        {/* GitHub link */}
                        <a
                            href="https://github.com/Kritika11052005"
                            target="_blank" // Open in new tab
                            rel="noopener noreferrer" // Prevent security risk
                            className="text-gray-400 hover:text-gray-300 transition-colors"
                            aria-label="GitHub" // Screen reader label
                        >
                            <Github className="size-5" />
                        </a>

                        {/* Email link (opens Gmail with pre-filled address) */}
                        <a
                            href="https://mail.google.com/mail/?view=cm&fs=1&to=ananya.benjwal@gmail.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-gray-400 hover:text-gray-300 transition-colors"
                            aria-label="Email"
                        >
                            <Mail className="size-5" />
                        </a>

                        {/* LinkedIn link */}
                        <a
                            href="https://www.linkedin.com/in/kritika-benjwal/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-gray-400 hover:text-gray-300 transition-colors"
                            aria-label="LinkedIn"
                        >
                            <Linkedin className="size-5" />
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
}

// Export the Footer so it can be used in other files
export default Footer;
