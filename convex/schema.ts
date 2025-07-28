import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

// Define the schema for the entire Convex backend
export default defineSchema({
    // Table for storing user information
    users: defineTable({
        userId: v.string(), // Clerk user ID
        email: v.string(), // User's email address
        name: v.string(), // User's name
        isPro: v.boolean(), // Indicates if the user is a Pro subscriber
        proSince: v.optional(v.number()), // Timestamp when user became Pro
        lemonSqueezyCustomerId: v.optional(v.string()), // Optional LemonSqueezy customer ID
        lemonSqueezyOrderId: v.optional(v.string()), // Optional LemonSqueezy order ID
    }).index("by_user_id", ["userId"]), // Index to query users by their userId

    // Table to store code executions by users
    codeExecutions: defineTable({
        userId: v.string(), // ID of the user who executed the code
        language: v.string(), // Programming language used
        code: v.string(), // Code submitted
        output: v.optional(v.string()), // Output (if any)
        error: v.optional(v.string()), // Error (if any)
    }).index("by_user_id", ["userId"]), // Index for fetching executions by user

    // Table to store code snippets
    snippets: defineTable({
        userId: v.string(), // User who created the snippet
        title: v.string(), // Title of the snippet
        language: v.string(), // Language of the code snippet
        code: v.string(), // Actual code
        userName: v.string(), // Name of the snippet's author
    }).index("by_user_id", ["userId"]), // Index for getting snippets by user

    // Table to store comments on snippets
    snippetComments: defineTable({
        snippetId: v.id("snippets"), // ID of the snippet being commented on
        userId: v.string(), // ID of the user who commented
        userName: v.string(), // Name of the commenter
        content: v.string(), // Comment content
    }).index("by_snippet_id", ["snippetId"]), // Index to fetch comments by snippet

    // Table to manage stars/likes for snippets
    stars: defineTable({
        userId: v.string(), // ID of the user who starred
        snippetId: v.id("snippets"), // ID of the starred snippet
    })
        .index("by_user_id", ["userId"]) // Index to find stars by user
        .index("by_snippet_id", ["snippetId"]) // Index to find stars on a snippet
        .index("by_user_id_and_snippet_id", ["userId", "snippetId"]), // Composite index to prevent duplicate stars
});
