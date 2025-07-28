// Import type definition for Metadata used by Next.js
import type { Metadata } from "next";

// Import Google fonts Geist and Geist_Mono (from Next.js font optimization)
import { Geist, Geist_Mono } from "next/font/google";

// Import global CSS styles
import "./globals.css";

// Import ClerkProvider to manage authentication and UI for logged-in users
import { ClerkProvider } from "@clerk/nextjs";

// Import a custom provider for Convex client (handles Convex backend connection)
import ConvexClientProviders from "@/components/providers/ConvexClientProviders";

// Import the footer component for layout
import Footer from "@/components/Footer";

// Import toaster (pop-up notification system)
import { Toaster } from "react-hot-toast";

// Import the Clerk dark theme
import { dark } from "@clerk/themes";

// Load Geist Sans font and make its CSS variable available
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"], // Include only Latin characters (smaller size)
});

// Load Geist Mono font and make its CSS variable available
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Define static metadata for this app (used in page titles and meta tags)
export const metadata: Metadata = {
  title: "Code_Wave",               // Title shown in browser tab
  description: "A modern, responsive in-browser code editor.", // Page description
  icons: {
  icon: [
    { url: "/favicon.ico", sizes: "any" }
  ]
},
};

// RootLayout is a special layout component used in Next.js App Router
export default function RootLayout({
  children, // All inner content passed from page components
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // Wrap entire app with ClerkProvider (needed for authentication features)
    <ClerkProvider
      appearance={{
        baseTheme: dark,           // Set default theme to dark mode
        variables: {
          colorPrimary: "#6366f1", // Accent color (used for buttons, etc.)
          colorText: "#ffffff",    // Main text color (white for dark background)
        },
      }}
    >
      <html lang="en">
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen
          bg-gradient-to-br from-[#1a1a2e] via-[#162447] to-[#2a1a3d] text-gray-100 flex flex-col
          `}
        >
          {/* Provide Convex client access to all components inside */}
          <ConvexClientProviders>
            {children} {/* Render all inner pages and components */}
          </ConvexClientProviders>

          {/* Show a consistent footer at the bottom */}
          <Footer />

          {/* Enable toast notifications (pop-ups for success/error messages) */}
          <Toaster />
        </body>
      </html>
    </ClerkProvider>
  );
}
