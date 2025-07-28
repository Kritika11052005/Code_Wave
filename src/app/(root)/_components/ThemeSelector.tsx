"use client";

// Import state from Zustand store to access theme and change it
import { useCodeEditorStore } from '@/store/useCodeEditorStore';
import React, { useEffect, useRef, useState } from 'react'

// List of available themes
import { THEMES } from '../_constants';

// Animation library for UI transitions
import { AnimatePresence, motion } from 'framer-motion';

// Icons for each theme
import { CircleOff, Cloud, Github, Laptop, Moon, Palette, Sun } from "lucide-react";

// Custom hook that tells if component is mounted (important for SSR)
import useMounted from '@/hooks/useMounted';

// Mapping of theme IDs to icons for display
const THEME_ICONS: Record<string, React.ReactNode> = {
    "vs-dark": <Moon className="size-4" />,
    "vs-light": <Sun className="size-4" />,
    "github-dark": <Github className="size-4" />,
    monokai: <Laptop className="size-4" />,
    "solarized-dark": <Cloud className="size-4" />,
};

function ThemeSelector() {
    // State to control whether dropdown is open
    const [isOpen, setIsOpen] = useState(false);

    // Tells whether the component is mounted (to avoid hydration issues)
    const mounted = useMounted();

    // Get current theme and function to update it from store
    const { theme, setTheme } = useCodeEditorStore();

    // Reference to dropdown element, used for detecting clicks outside
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Find the currently selected theme object from the THEMES list
    const currentTheme = THEMES.find((t) => t.id === theme);

    // Close dropdown if user clicks outside it
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef && !dropdownRef.current?.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Avoid rendering until component is mounted
    if (!mounted) return null;

    return (
        <div className='relative' ref={dropdownRef}>
            {/* Button to open dropdown */}
            <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setIsOpen(!isOpen)}
                className='w-48 group relative flex items-center gap-2 px-4 py-2.5 bg-[#1e1e2e]/80 hover:bg-[#262637] rounded-lg transition-all duration-200 border border-gray-800/50 hover:border-gray-700'
            >
                {/* Animated gradient background */}
                <div className='absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity' />

                {/* Icon for palette */}
                <Palette className="w-4 h-4 text-gray-400 group-hover:text-gray-300 transition-colors" />

                {/* Current theme label */}
                <span className="text-gray-300 min-w-[80px] text-left group-hover:text-white transition-colors">
                    {currentTheme?.label}
                </span>

                {/* Circle with theme color */}
                <div
                    className="relative w-4 h-4 rounded-full border border-gray-600 group-hover:border-gray-500 transition-colors"
                    style={{ background: currentTheme?.color }}
                />
            </motion.button>

            {/* Dropdown menu with theme options */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 8, scale: 0.96 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.96 }}
                        transition={{ duration: 0.2 }}
                        className="absolute top-full left-0 mt-2 w-full min-w-[240px] bg-[#1e1e2e]/95 
                            backdrop-blur-xl rounded-xl border border-[#313244] shadow-2xl py-2 z-50"
                    >
                        {/* Header for dropdown */}
                        <div className="px-2 pb-2 mb-2 border-b border-gray-800/50">
                            <p className="text-xs font-medium text-gray-400 px-2">Select Theme</p>
                        </div>

                        {/* List of all theme options */}
                        {THEMES.map((t, index) => (
                            <motion.button
                                key={t.id}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: index * 0.1 }}
                                onClick={() => setTheme(t.id)}
                                className={`
                                    relative group w-full flex items-center gap-3 px-3 py-2.5 hover:bg-[#262637] transition-all duration-200
                                    ${theme === t.id ? "bg-blue-500/10 text-blue-400" : "text-gray-300"}
                                `}
                            >
                                {/* Gradient background on hover */}
                                <div
                                    className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 opacity-0 
                                        group-hover:opacity-100 transition-opacity"
                                />

                                {/* Icon for the theme */}
                                <div
                                    className={`
                                        flex items-center justify-center size-8 rounded-lg
                                        ${theme === t.id ? "bg-blue-500/10 text-blue-400" : "bg-gray-800/50 text-gray-400"}
                                        group-hover:scale-110 transition-all duration-200
                                    `}
                                >
                                    {THEME_ICONS[t.id] || <CircleOff className="w-4 h-4" />}
                                </div>

                                {/* Theme label */}
                                <span className="flex-1 text-left group-hover:text-white transition-colors">
                                    {t.label}
                                </span>

                                {/* Color indicator dot */}
                                <div
                                    className="relative size-4 rounded-full border border-gray-600 
                                        group-hover:border-gray-500 transition-colors"
                                    style={{ background: t.color }}
                                />

                                {/* Blue border if theme is currently selected */}
                                {theme === t.id && (
                                    <motion.div
                                        className="absolute inset-0 border-2 border-blue-500/30 rounded-lg"
                                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                    />
                                )}
                            </motion.button>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

export default ThemeSelector;
