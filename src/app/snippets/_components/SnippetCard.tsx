"use client"
import React, { useState } from 'react'

import { Snippet } from '@/types'
import { useUser } from '@clerk/nextjs'
import { useMutation } from 'convex/react';
import { api } from '../../../../convex/_generated/api';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { Clock, StarIcon, Trash2, User } from 'lucide-react';
import toast from 'react-hot-toast';
import StarButton from '@/components/StarButton';

function SnippetCard({ snippet }: { snippet: Snippet }) {
  const { user } = useUser(); // Get current logged-in user
  const deleteSnippet = useMutation(api.snippets.deleteSnippet); // Hook for calling delete mutation
  const [isDeleting, setIsDeleting] = useState(false); // Track if delete is in progress

  const handleDelete = async () => {
    setIsDeleting(true); // Start loading spinner
    try {
      await deleteSnippet({ snippetId: snippet._id }); // Attempt deletion
    } catch (error) {
      console.log(error)
      toast.error("Error deleting snippet") // Show error toast on failure
    } finally {
      setIsDeleting(false); // Stop loading spinner
    }
  };

  return (
    <motion.div
      layout
      className="group relative"
      whileHover={{ y: -2 }} // Slight hover animation
      transition={{ duration: 0.2 }}
    >
      {/* Make entire card clickable and link to snippet details */}
      <Link href={`/snippets/${snippet._id}`} className="h-full block">
        <div
          className="relative h-full bg-[#1e1e2e]/80 backdrop-blur-sm rounded-xl 
          border border-[#313244]/50 hover:border-[#313244] 
          transition-all duration-300 overflow-hidden"
        >
          <div className="p-6">
            {/* Card Header with logo, language, and date */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                {/* Language Logo with gradient background */}
                <div className="relative">
                  <div
                    className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg blur opacity-20 
                  group-hover:opacity-30 transition-all duration-500"
                    area-hidden="true"
                  />
                  <div
                    className="relative p-2 rounded-lg bg-gradient-to-br from-blue-500/10 to-purple-500/10 group-hover:from-blue-500/20
                   group-hover:to-purple-500/20 transition-all duration-500"
                  >
                    <Image
                      src={`/${snippet.language}.png`} // Dynamic logo based on language
                      alt={`${snippet.language} logo`}
                      className="w-6 h-6 object-contain relative z-10"
                      width={24}
                      height={24}
                    />
                  </div>
                </div>

                {/* Language tag and creation time */}
                <div className="space-y-1">
                  <span className="px-3 py-1 bg-blue-500/10 text-blue-400 rounded-lg text-xs font-medium">
                    {snippet.language}
                  </span>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <Clock className="size-3" />
                    {new Date(snippet._creationTime).toLocaleDateString()} {/* Human-readable date */}
                  </div>
                </div>
              </div>

              {/* Top-right Star and Delete buttons */}
              <div
                className="absolute top-5 right-5 z-10 flex gap-4 items-center"
                onClick={(e) => e.preventDefault()} // Prevent link click from triggering
              >
                <StarButton snippetId={snippet._id} />

                {/* Show delete button only for snippet owner */}
                {user?.id === snippet.userId && (
                  <div className="z-10" onClick={(e) => e.preventDefault()}>
                    <button
                      onClick={handleDelete}
                      disabled={isDeleting}
                      className={`group flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all duration-200
                                  ${isDeleting
                          ? "bg-red-500/20 text-red-400 cursor-not-allowed"
                          : "bg-gray-500/10 text-gray-400 hover:bg-red-500/10 hover:text-red-400"
                        }
                                `}
                    >
                      {/* Show spinner or trash icon based on loading */}
                      {isDeleting ? (
                        <div className="size-3.5 border-2 border-red-400/30 border-t-red-400 rounded-full animate-spin" />
                      ) : (
                        <Trash2 className="size-3.5" />
                      )}
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Card Main Content */}
            <div className="space-y-4">
              <div>
                {/* Title */}
                <h2 className="text-xl font-semibold text-white mb-2 line-clamp-1 group-hover:text-blue-400 transition-colors">
                  {snippet.title}
                </h2>

                {/* Author Info */}
                <div className="flex items-center gap-3 text-sm text-gray-400">
                  <div className="flex items-center gap-2">
                    <div className="p-1 rounded-md bg-gray-800/50">
                      <User className="size-3" />
                    </div>
                    <span className="truncate max-w-[150px]">{snippet.userName}</span>
                  </div>
                </div>
              </div>

              {/* Code Preview Section */}
              <div className="relative group/code">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/15 to-purple-500/5 rounded-lg opacity-0 group-hover/code:opacity-100 transition-all" />
                <pre className="relative bg-black/30 rounded-lg p-4 overflow-hidden text-sm text-gray-300 font-mono line-clamp-3">
                  {snippet.code} {/* Show first 3 lines of code */}
                </pre>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}

export default SnippetCard
