/* eslint-disable @next/next/no-img-element */
// We are importing required modules and icons

import { useQuery } from "convex/react";
import {
  Activity, Code2, Star, Timer,
  TrendingUp, Trophy, UserIcon, Zap
} from "lucide-react"; // Icon set

import { motion } from "framer-motion"; // For animation

import { UserResource } from "@clerk/types"; // Type from Clerk (auth)
import { Id } from "../../../../convex/_generated/dataModel"; // Type for Convex DB ID
import { api } from "../../../../convex/_generated/api"; // API routes for Convex

// Props passed to this component
interface ProfileHeaderProps {
  userStats: {
    totalExecutions: number; // total code runs by the user
    languageCount: number; // number of different languages used
    languages: string[];
    last24hours: number; // code runs in last 24 hours
    favoriteLanguage: string;
    languageStats: Record<string, number>;
    mostStarredLanguage: string;
  };
  userData: {
    _id: Id<"users">;
    _creationTime: number;
    proSince?: number;
    lemonSqueezyCustomerId?: string;
    lemonSqueezyOrderId?: string;
    name: string;
    userId: string;
    email: string;
    isPro: boolean; // if user has a Pro subscription
  };
  user: UserResource; // user data from Clerk
}

// This is the main React component that displays the profile header
function ProfileHeader({ userStats, userData, user }: ProfileHeaderProps) {
  // Fetches starred snippets from Convex
  const starredSnippets = useQuery(api.snippets.getStarredSnippets);

  // Define all the stats we want to display
  const STATS = [
    {
      label: "Code Executions",
      value: userStats?.totalExecutions ?? 0,
      icon: Activity,
      color: "from-blue-500 to-cyan-500",
      gradient: "group-hover:via-blue-400",
      description: "Total code runs",
      metric: {
        label: "Last 24h",
        value: userStats?.last24hours ?? 0,
        icon: Timer,
      },
    },
    {
      label: "Starred Snippets",
      value: starredSnippets?.length ?? 0,
      icon: Star,
      color: "from-yellow-500 to-orange-500",
      gradient: "group-hover:via-yellow-400",
      description: "Saved for later",
      metric: {
        label: "Most starred",
        value: userStats?.mostStarredLanguage ?? "N/A",
        icon: Trophy,
      },
    },
    {
      label: "Languages Used", 
      value: userStats?.languageCount ?? 0,
      icon: Code2,
      color: "from-purple-500 to-pink-500",
      gradient: "group-hover:via-purple-400",
      description: "Different languages",
      metric: {
        label: "Most used",
        value: userStats?.favoriteLanguage ?? "N/A",
        icon: TrendingUp,
      },
    },
  ];

  return (
    // Outer container with gradient background and borders
    <div className="relative mb-8 bg-gradient-to-br from-[#12121a] to-[#1a1a2e] rounded-2xl p-8 border border-gray-800/50 overflow-hidden">
      {/* Background grid pattern */}
      <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:32px]" />

      {/* Profile image and user info */}
      <div className="relative flex items-center gap-8">
        <div className="relative group">
          {/* Blurred glow behind image */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full blur-xl opacity-50 group-hover:opacity-75 transition-opacity" />
          {/* Actual profile picture */}
          <img
            src={user.imageUrl}
            alt="Profile"
            className="w-24 h-24 rounded-full border-4 border-gray-800/50 relative z-10 group-hover:scale-105 transition-transform"
          />
          {/* Zap icon for Pro members */}
          {userData.isPro && (
            <div className="absolute -top-2 -right-2 bg-gradient-to-r from-purple-500 to-purple-600 p-2 rounded-full z-20 shadow-lg animate-pulse">
              <Zap className="w-4 h-4 text-white" />
            </div>
          )}
        </div>

        {/* Username and Email */}
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl font-bold text-white">{userData.name}</h1>
            {userData.isPro && (
              <span className="px-3 py-1 bg-purple-500/10 text-purple-400 rounded-full text-sm font-medium">
                Pro Member
              </span>
            )}
          </div>
          <p className="text-gray-400 flex items-center gap-2">
            <UserIcon className="w-4 h-4" />
            {userData.email}
          </p>
        </div>
      </div>

      {/* Statistic Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        {STATS.map((stat, index) => (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            key={index}
            className="group relative bg-gradient-to-br from-black/40 to-black/20 rounded-2xl overflow-hidden"
          >
            {/* Hover Glow */}
            <div
              className={`absolute inset-0 bg-gradient-to-r ${stat.color} opacity-0 group-hover:opacity-10 transition-all duration-500 ${stat.gradient}`}
            />

            {/* Stat Content */}
            <div className="relative p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-medium text-gray-400">{stat.description}</span>
                  </div>
                  <h3 className="text-2xl font-bold text-white tracking-tight">
                    {/* Format number if it's a number */}
                    {typeof stat.value === "number" ? stat.value.toLocaleString() : stat.value}
                  </h3>
                  <p className="text-sm text-gray-400 mt-1">{stat.label}</p>
                </div>

                {/* Icon on right side */}
                <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.color} bg-opacity-10`}>
                  <stat.icon className="w-5 h-5 text-white" />
                </div>
              </div>

              {/* Extra metric (e.g., Most Used: JS) */}
              <div className="flex items-center gap-2 pt-4 border-t border-gray-800/50">
                <stat.metric.icon className="w-4 h-4 text-gray-500" />
                <span className="text-sm text-gray-400">{stat.metric.label}:</span>
                <span className="text-sm font-medium text-white">{stat.metric.value}</span>
              </div>
            </div>

            {/* Shine on hover */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full duration-1000 transition-transform" />
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export default ProfileHeader; // Exporting component
