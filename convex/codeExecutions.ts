// Importing ConvexError for throwing custom errors, and `v` to define argument types
import { ConvexError, v } from "convex/values";

// `mutation` is a Convex function to define a database write operation
import { mutation } from "./_generated/server";

// Define a mutation named `saveExecution`
export const saveExecution = mutation({
    // Define the expected arguments (input data)
    args: {
        language: v.string(),              // Required: Programming language used
        code: v.string(),                  // Required: Source code submitted
        error: v.optional(v.string()),     // Optional: Error output, if any
        output: v.optional(v.string()),    // Optional: Standard output from execution
    },

    // The actual function that runs when this mutation is called
    handler: async (ctx, args) => {
        // Get the currently logged-in user's identity
        const identity = await ctx.auth.getUserIdentity();

        // If user is not logged in, throw an error and stop
        if (!identity) throw new ConvexError("Not authenticated");

        // Try to find the user in the "users" table using the userId
        const user = await ctx.db
            .query("users")
            .withIndex("by_user_id")
            .filter((q) => q.eq(q.field("userId"), identity.subject))  // Match userId with identity.subject
            .first(); // Get the first match only

        // List of languages that are allowed for all users (even free users)
        const freeLanguages = ["javascript", "python", "cpp"];

        // Check if the chosen language is one of the free ones
        const isLanguageFree = freeLanguages.includes(args.language);

        // If the user is NOT a Pro user AND the language is NOT free
        // Then they are not allowed to use this language
        if (!user?.isPro && !isLanguageFree) {
            throw new ConvexError("Pro Subscription required to use this language");
        }

        // Insert the execution result into the "codeExecutions" table
        await ctx.db.insert("codeExecutions", {
            ...args, // Save all the provided input values
            userId: identity.subject, // Also store the user's ID with the record
        });
    }
});
