// Import function to get the current authenticated user from Clerk
import { currentUser } from '@clerk/nextjs/server'

// Import Convex HTTP client to make server queries from the client
import { ConvexHttpClient } from 'convex/browser'

// Import React (required for using JSX)
import React from 'react'

// Import backend API functions (like getUser)
import { api } from '../../../../convex/_generated/api'

// Import navigation and UI components
import Link from 'next/link'
import { Blocks, Computer, Code2, Sparkles } from 'lucide-react'

// Clerk UI wrapper that only renders content if user is signed in
import { SignedIn } from '@clerk/nextjs'

// Import custom components
import ThemeSelector from './ThemeSelector'
import LanguageSelector from './LanguageSelector'
import RunButton from './RunButton'
import HeaderProfileBtn from './HeaderProfileBtn'

// Declare the Header component (async because it fetches user data)
async function Header() {
    // Create a new Convex client using the public URL
    const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!)

    // Get the currently logged-in user from Clerk
    const user = await currentUser()

    // Query Convex to check if this user exists and whether they are a Pro user
    const convexUser = await convex.query(api.users.getUser, {
        userId: user?.id || "" // Pass userId or empty string if user is undefined
    })

    // Log the convex user data to the console (for debugging)
    console.log({ convexUser })

    return (
        // Outer wrapper with a high z-index to appear above other content
        <div className='relative z-10'>
            {/* Main header bar with glassy background and border */}
            <div className='flex items-center lg:justify-between justify-center bg-[#0a0a0f]/90 backdrop-blur-xl p-6 mb-4 rounded-lg border-b border-gray-800/50'>

                {/* Left side of header: Logo + Navigation (only shown on large screens) */}
                <div className='hidden lg:flex items-center gap-8'>
                    {/* Logo link that takes you to the homepage */}
                    <Link href="/" className='flex items-center gap-3 group relative'>
                        {/* Glowing hover effect behind the logo */}
                        <div
                            className="absolute -inset-2 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-lg opacity-0 
                            group-hover:opacity-100 transition-all duration-500 blur-xl"
                        />

                        {/* Main logo icon with styling and hover animation */}
                        <div
                            className="relative bg-gradient-to-br from-[#1a1a2e] to-[#0a0a0f] p-2 rounded-xl ring-1 ring-white/10 group-hover:ring-white/20 transition-all"
                        >
                            <Computer className="size-6 text-blue-400 transform -rotate-6 group-hover:rotate-0 transition-transform duration-500" />
                        </div>

                        {/* Logo text and subtitle */}
                        <div className="flex flex-col">
                            <span className="block text-lg font-semibold bg-gradient-to-r from-blue-400 via-blue-300 to-purple-400 text-transparent bg-clip-text">
                                Code_Wave
                            </span>
                            <span className="block text-xs text-blue-400/60 font-medium">
                                Interactive Code Editor
                            </span>
                        </div>
                    </Link>

                    {/* Navigation link to the Snippets page */}
                    <nav className="flex items-center space-x-1">
                        <Link
                            href="/snippets"
                            className="relative group flex items-center gap-2 px-4 py-1.5 rounded-lg text-gray-300 bg-gray-800/50 
                            hover:bg-blue-500/10 border border-gray-800 hover:border-blue-500/50 transition-all duration-300 shadow-lg overflow-hidden"
                        >
                            {/* Glowing background on hover */}
                            <div
                                className="absolute inset-0 bg-gradient-to-r from-blue-500/10 
                                to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity"
                            />
                            {/* Snippets icon */}
                            <Code2 className="w-4 h-4 relative z-10 group-hover:rotate-3 transition-transform" />
                            {/* Text label */}
                            <span
                                className="text-sm font-medium relative z-10 group-hover:text-white transition-colors"
                            >
                                Snippets
                            </span>
                        </Link>
                    </nav>
                </div>

                {/* Right side of header: Theme selector, language selector, Pro button, run button, profile button */}
                <div className="flex items-center gap-4">
                    {/* Theme and language switchers */}
                    <div className="flex items-center gap-3">
                        <ThemeSelector />
                        <LanguageSelector hasAccess={Boolean(convexUser?.isPro)} />
                        {/* Pass `true` if user is Pro, otherwise `false` */}
                    </div>

                    {/* Show "Pro" upgrade button if user is NOT Pro */}
                    {!convexUser?.isPro && (
                        <Link
                            href="/pricing"
                            className="flex items-center gap-2 px-4 py-1.5 rounded-lg border border-amber-500/20 hover:border-amber-500/40 bg-gradient-to-r from-amber-500/10 
                            to-orange-500/10 hover:from-amber-500/20 hover:to-orange-500/20 
                            transition-all duration-300"
                        >
                            <Sparkles className="w-4 h-4 text-amber-400 hover:text-amber-300" />
                            <span className="text-sm font-medium text-amber-400/90 hover:text-amber-300">
                                Pro
                            </span>
                        </Link>
                    )}

                    {/* Only show the Run button if the user is signed in */}
                    <SignedIn>
                        <RunButton />
                    </SignedIn>

                    {/* Vertical divider and user profile menu */}
                    <div className='pl-3 border-l border-gray-800'>
                        <HeaderProfileBtn />
                    </div>
                </div>
            </div>
        </div>
    )
}

// Export the Header component so it can be used in other files
export default Header
