"use client" // This component runs on the browser

import { getExecutionResult, useCodeEditorStore } from '@/store/useCodeEditorStore'
import { useUser } from '@clerk/nextjs'
import { useMutation } from 'convex/react'
import { motion } from 'framer-motion' // Used for animation effects
import { Play, Loader2 } from 'lucide-react'
import React from 'react'
import { api } from '../../../../convex/_generated/api'

// This is the "Run Code" button in the UI
function RunButton() {
  const { user } = useUser(); // Get logged-in user
  const { runCode, language, isRunning } = useCodeEditorStore(); // Get state and methods from store
  const saveExecution = useMutation(api.codeExecutions.saveExecution); // Convex mutation to store result

  // This function is called when the Run button is clicked
  const handleRun = async () => {
    await runCode(); // Run the code from the editor
    const result = getExecutionResult(); // Get the output and error from the run

    // If user is logged in and result is available, save to database
    if (user && result) {
      await saveExecution({
        language, // Language used
        code: result.code, // The actual code
        output: result.output, // Output from execution
        error: result.error || undefined, // Optional error
      });
    }
  }

  return (
    <motion.button
      onClick={handleRun}
      disabled={isRunning} // Disable while code is running
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="group relative inline-flex items-center gap-2.5 px-5 py-2.5 ..."
    >
      {/* Background with gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-500 ..." />

      <div className="relative flex items-center gap-2.5">
        {isRunning ? (
          <>
            {/* If currently running, show loader */}
            <div className="relative">
              <Loader2 className="w-4 h-4 animate-spin text-white/70" />
              <div className="absolute inset-0 blur animate-pulse" />
            </div>
            <span className="text-sm font-medium text-white/90">Executing...</span>
          </>
        ) : (
          <>
            {/* If idle, show play icon */}
            <div className="relative flex items-center justify-center w-4 h-4">
              <Play className="w-4 h-4 text-white/90 group-hover:scale-110 ..." />
            </div>
            <span className="text-sm font-medium text-white/90 group-hover:text-white">
              Run Code
            </span>
          </>
        )}
      </div>
    </motion.button>
  )
}

export default RunButton
