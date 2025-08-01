// Import the currently logged-in user from Clerk
import { currentUser } from '@clerk/nextjs/server'

// Import Convex client to make API calls
import { ConvexHttpClient } from 'convex/browser';
import { api } from '../../../convex/_generated/api';

// Import components used in the Pricing Page
import ProPlanView from './_components/ProPlanView';
import NavigationHeader from "@/components/NavigationHeader";
import { ENTERPRISE_FEATURES, FEATURES } from './constants';
import { Star } from "lucide-react";
import FeatureCategory from './_components/FeatureCategory';
import FeatureItem from './_components/FeatureItem';
import { SignedIn, SignedOut } from "@clerk/nextjs";
import UpgradeButton from './_components/UpgradeButton';
import LoginButton from '@/components/LoginButton';

// Async component for pricing page
async function PricingPage() {
    // Get the logged-in user from Clerk
    const user = await currentUser();

    // Initialize Convex HTTP client
    const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

    // Get user info from Convex database
    const convexUser = await convex.query(api.users.getUser, {
        userId: user?.id || ""
    })

    // If user already has Pro plan, show the Pro plan view directly
    if (convexUser?.isPro) return <ProPlanView />

    // Otherwise, render the full pricing page
    return (
        <div className="relative min-h-screen bg-[#0a0a0f] selection:bg-blue-500/20 selection:text-blue-200">
            {/* Top navigation bar */}
            <NavigationHeader />

            <main className="relative pt-32 pb-24 px-4">
                <div className="max-w-7xl mx-auto">
                    
                    {/* Hero section with heading and subtext */}
                    <div className="text-center mb-24">
                        <div className="relative inline-block">
                            {/* Glowing gradient border behind heading */}
                            <div className="absolute -inset-px bg-gradient-to-r from-blue-500 to-purple-500 blur-xl opacity-10" />
                            <h1 className="relative text-5xl md:text-6xl lg:text-7xl font-semibold bg-gradient-to-r from-gray-100 to-gray-300 text-transparent bg-clip-text mb-8">
                                Elevate Your <br /> Development Experience
                            </h1>
                        </div>
                        <p className="text-xl text-gray-400 max-w-3xl mx-auto">
                            Join the next generation of developers with our professional suite of tools
                        </p>
                    </div>

                    {/* Enterprise Features grid */}
                    <section className="w-full flex justify-center">
                        <div className="flex flex-wrap justify-center gap-8 mb-24 max-w-6xl px-4">
                            {ENTERPRISE_FEATURES.map((feature) => (
                                <div
                                    key={feature.label}
                                    className="group relative bg-gradient-to-b from-[#12121a] to-[#0a0a0f] 
                                    rounded-2xl p-6 hover:scale-[1.02] transition-all duration-300 
                                    w-full sm:w-80 md:w-72 lg:w-80"
                                >
                                    {/* Icon + Feature details */}
                                    <div className="relative">
                                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500/10 to-purple-500/10 
                                            flex items-center justify-center mb-4 ring-1 ring-gray-800/60 group-hover:ring-blue-500/20"
                                        >
                                            <feature.icon className="w-6 h-6 text-blue-400" />
                                        </div>
                                        <h3 className="text-lg font-medium text-white mb-2">{feature.label}</h3>
                                        <p className="text-gray-400">{feature.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Pricing Card */}
                    <div className="relative max-w-4xl mx-auto">
                        {/* Outer gradient border effect */}
                        <div className="absolute -inset-px bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl blur opacity-10" />
                        <div className="relative bg-[#12121a]/90 backdrop-blur-xl rounded-2xl">
                            {/* Top and bottom border lines */}
                            <div className="absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent" />
                            <div className="absolute inset-x-0 -bottom-px h-px bg-gradient-to-r from-transparent via-purple-500/50 to-transparent" />

                            <div className="relative p-8 md:p-12">
                                {/* Pricing header with icon, title, and amount */}
                                <div className="text-center mb-12">
                                    <div className="inline-flex p-3 rounded-xl bg-gradient-to-br from-blue-500/10 to-purple-500/10 ring-1 ring-gray-800/60 mb-6">
                                        <Star className="w-8 h-8 text-blue-400" />
                                    </div>
                                    <h2 className="text-3xl font-semibold text-white mb-4">Lifetime Pro Access</h2>
                                    <div className="flex items-baseline justify-center gap-2 mb-4">
                                        <span className="text-2xl text-gray-400">₹</span>
                                        <span className="text-6xl font-semibold bg-gradient-to-r from-gray-100 to-gray-300 text-transparent bg-clip-text">
                                            45
                                        </span>
                                        <span className="text-xl text-gray-400">one-time</span>
                                    </div>
                                    <p className="text-gray-400 text-lg">Unlock the full potential of Code_Wave</p>
                                </div>

                                {/* Features grid with 3 columns */}
                                <div className="grid md:grid-cols-3 gap-12 mb-12">
                                    <FeatureCategory label="Development">
                                        {FEATURES.development.map((feature, idx) => (
                                            <FeatureItem key={idx}>{feature}</FeatureItem>
                                        ))}
                                    </FeatureCategory>

                                    <FeatureCategory label="Collaboration">
                                        {FEATURES.collaboration.map((feature, idx) => (
                                            <FeatureItem key={idx}>{feature}</FeatureItem>
                                        ))}
                                    </FeatureCategory>

                                    <FeatureCategory label="Deployment">
                                        {FEATURES.proOnly.map((feature, idx) => (
                                            <FeatureItem key={idx}>{feature}</FeatureItem>
                                        ))}
                                    </FeatureCategory>
                                </div>

                                {/* Call to Action */}
                                <div className="flex justify-center">
                                    {/* Show UpgradeButton if user is signed in, else show LoginButton */}
                                    <SignedIn>
                                        <UpgradeButton />
                                    </SignedIn>

                                    <SignedOut>
                                        <LoginButton />
                                    </SignedOut>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}

export default PricingPage;
