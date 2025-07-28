// Import 'v' for validating function arguments (Convex schema values)
import { v } from "convex/values";

// Import 'mutation' and 'query' to define server-side database functions
import { mutation, query } from "./_generated/server";

// Define a mutation to sync a user (create if not already present)
export const syncUser = mutation({
    args: {
        userId: v.string(), // Unique ID of the user (from Clerk)
        email: v.string(),  // User's email address
        name: v.string(),   // User's name
    },
    handler: async (ctx, args) => {
        // Search for a user with the same userId
        const existingUser = await ctx.db.query("users")
            .filter(q => q.eq(q.field("userId"), args.userId))
            .first();

        // If user does not already exist, insert them into the database
        if (!existingUser) {
            await ctx.db.insert("users", {
                userId: args.userId,
                email: args.email,
                name: args.name,
                isPro: false, // By default, new users are not "Pro"
            });
        }
    }
});

// Define a query to get a user's data by userId
export const getUser = query({
    args: { userId: v.string() }, // Required argument: userId
    handler: async (ctx, args) => {
        // If no userId was passed, return null (nothing)
        if (!args.userId) return null;

        // Search for the user in the database using the 'by_user_id' index
        const user = await ctx.db
            .query("users")
            .withIndex("by_user_id") // Assumes an index on userId exists
            .filter((q) => q.eq(q.field("userId"), args.userId))
            .first();

        // If user not found, return null
        if (!user) return null;

        // Return the user object
        return user;
    }
});

// Define a mutation to upgrade a user to "Pro"
export const upgradeToPro = mutation({
    args: {
        email: v.string(),                   // Email used to find the user
        lemonSqueezyCustomerId: v.string(), // ID from Lemon Squeezy system
        lemonSqueezyOrderId: v.string(),    // Order ID from Lemon Squeezy
        amount: v.number(),                 // Payment amount (not used directly here)
    },
    handler: async (ctx, args) => {
        // Search for the user by email address
        const user = await ctx.db
            .query("users")
            .filter((q) => q.eq(q.field("email"), args.email))
            .first();

        // If no matching user found, throw an error
        if (!user) throw new Error("User not found");

        // Update that user's record to reflect "Pro" status
        await ctx.db.patch(user._id, {
            isPro: true,                          // Set isPro to true
            proSince: Date.now(),                // Store the timestamp of the upgrade
            lemonSqueezyCustomerId: args.lemonSqueezyCustomerId, // Save Lemon Squeezy customer ID
            lemonSqueezyOrderId: args.lemonSqueezyOrderId,       // Save Lemon Squeezy order ID
        });

        // Return a success result
        return { success: true };
    },
});
