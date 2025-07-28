import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { paginationOptsValidator } from "convex/server";
import { languages } from "monaco-editor";

// Create a new code snippet
export const createSnippet = mutation({
    args: {
        title: v.string(),
        language: v.string(),
        code: v.string(),
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) throw new Error("Not Authenticated");

        const user = await ctx.db
            .query("users")
            .withIndex("by_user_id")
            .filter((q) => q.eq(q.field("userId"), identity.subject))
            .first();

        if (!user) throw new Error("User not found");

        const snippetId = await ctx.db.insert("snippets", {
            userId: identity.subject,
            userName: user?.name,
            title: args.title,
            language: args.language,
            code: args.code
        });

        return snippetId;
    }
});

// Get all snippets, sorted from newest to oldest
export const getSnippets = query({
    handler: async (ctx) => {
        return await ctx.db.query("snippets").order("desc").collect();
    }
});

// Check if current user has starred a specific snippet
export const isSnippetStarred = query({
    args: { snippetId: v.id("snippets") },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) return false;

        const star = await ctx.db
            .query("stars")
            .withIndex("by_user_id_and_snippet_id")
            .filter(
                (q) => q.eq(q.field("userId"), identity.subject) &&
                        q.eq(q.field("snippetId"), args.snippetId)
            ).first();

        return !!star;
    }
});

// Get the number of stars for a snippet
export const getSnippetStarCount = query({
    args: { snippetId: v.id("snippets") },
    handler: async (ctx, args) => {
        const stars = await ctx.db
            .query("stars")
            .withIndex("by_snippet_id")
            .filter((q) => q.eq(q.field("snippetId"), args.snippetId))
            .collect();

        return stars.length;
    },
});

// Delete a snippet along with its comments and stars
export const deleteSnippet = mutation({
    args: { snippetId: v.id("snippets") },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) throw new Error("Not Authenticated");

        const snippet = await ctx.db.get(args.snippetId);
        if (!snippet) throw new Error("Snippet not found");
        if (snippet.userId !== identity.subject) throw new Error("Not authorized");

        const comments = await ctx.db
            .query("snippetComments")
            .withIndex("by_snippet_id")
            .filter((q) => q.eq(q.field("snippetId"), args.snippetId))
            .collect();

        for (const comment of comments) {
            await ctx.db.delete(comment._id);
        }

        const stars = await ctx.db
            .query("stars")
            .withIndex("by_snippet_id")
            .filter((q) => q.eq(q.field("snippetId"), args.snippetId))
            .collect();

        for (const star of stars) {
            await ctx.db.delete(star._id);
        }

        await ctx.db.delete(args.snippetId);
    }
});

// Toggle a star for a snippet by the current user
export const starSnippet = mutation({
    args: { snippetId: v.id("snippets") },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) throw new Error("Not authenticated");

        const existing = await ctx.db
            .query("stars")
            .withIndex("by_user_id_and_snippet_id")
            .filter((q) => q.eq(q.field("userId"), identity.subject) &&
                            q.eq(q.field("snippetId"), args.snippetId))
            .first();

        if (existing) {
            await ctx.db.delete(existing._id);
        } else {
            await ctx.db.insert("stars", {
                userId: identity.subject,
                snippetId: args.snippetId,
            });
        }
    }
});

// Get a specific snippet by ID
export const getSnippetById = query({
    args: { snippetId: v.id("snippets") },
    handler: async (ctx, args) => {
        const snippet = await ctx.db.get(args.snippetId);
        if (!snippet) throw new Error("Snippet not found");
        return snippet;
    }
});

// Get all comments for a specific snippet
export const getComments = query({
    args: { snippetId: v.id("snippets") },
    handler: async (ctx, args) => {
        const comments = await ctx.db
            .query("snippetComments")
            .withIndex("by_snippet_id")
            .filter((q) => q.eq(q.field("snippetId"), args.snippetId))
            .order("desc")
            .collect();

        return comments;
    }
});

// Add a new comment to a snippet
export const addComment = mutation({
    args: {
        snippetId: v.id("snippets"),
        content: v.string(),
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) throw new Error("Not authenticated");

        const user = await ctx.db
            .query("users")
            .withIndex("by_user_id")
            .filter((q) => q.eq(q.field("userId"), identity.subject))
            .first();

        if (!user) throw new Error("User not found");

        return await ctx.db.insert("snippetComments", {
            snippetId: args.snippetId,
            userId: identity.subject,
            userName: user.name,
            content: args.content,
        });
    }
});

// Delete a comment if the current user is the author
export const deleteComment = mutation({
    args: { commentId: v.id("snippetComments") },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) throw new Error("Not authenticated");

        const comment = await ctx.db.get(args.commentId);
        if (!comment) throw new Error("Comment not found");

        if (comment.userId !== identity.subject) {
            throw new Error("Not authorized to delete this comment");
        }

        await ctx.db.delete(args.commentId);
    },
});

// Get all snippets that the user has starred
export const getStarredSnippets = query({
    handler: async (ctx) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) return [];

        const stars = await ctx.db
            .query("stars")
            .withIndex("by_user_id")
            .filter((q) => q.eq(q.field("userId"), identity.subject))
            .collect();

        const snippets = await Promise.all(stars.map((star) => ctx.db.get(star.snippetId)));
        return snippets.filter((snippet) => snippet !== null);
    }
});

// Get paginated list of code executions by user
export const getUserExecutions = query({
    args: {
        userId: v.string(),
        paginationOpts: paginationOptsValidator,
    },
    handler: async (ctx, args) => {
        return await ctx.db
            .query("codeExecutions")
            .withIndex("by_user_id")
            .filter((q) => q.eq(q.field("userId"), args.userId))
            .order("desc")
            .paginate(args.paginationOpts);
    }
});

// Get statistics about a user's activity
export const getUserStats = query({
    args: { userId: v.string() },
    handler: async (ctx, args) => {
        const executions = await ctx.db
            .query("codeExecutions")
            .withIndex("by_user_id")
            .filter((q) => q.eq(q.field("userId"), args.userId))
            .collect();

        const starredSnippets = await ctx.db
            .query("stars")
            .withIndex("by_user_id")
            .filter((q) => q.eq(q.field("userId"), args.userId))
            .collect();

        const snippetIds = starredSnippets.map((star) => star.snippetId);
        const snippetDetails = await Promise.all(snippetIds.map((id) => ctx.db.get(id)));

        const starredLanguage = snippetDetails.filter(Boolean).reduce((acc, curr) => {
            if (curr?.language) {
                acc[curr.language] = (acc[curr.language] || 0) + 1;
            }
            return acc;
        }, {} as Record<string, number>);

        const mostStarredLanguage = Object.entries(starredLanguage).sort(([, a], [, b]) => b - a)[0]?.[0] ?? "N/A";

        const last24hours = executions.filter(
            (e) => e._creationTime > Date.now() - 24 * 60 * 60 * 1000
        ).length;

        const languageStats = executions.reduce((acc, curr) => {
            acc[curr.language] = (acc[curr.language] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);

        const languages = Object.keys(languageStats);
        const favoriteLanguage = languages.length
            ? languages.reduce((a, b) => (languageStats[a] > languageStats[b] ? a : b))
            : "N/A";

        return {
            totalExecutions: executions.length,
            languageCount: languages.length,
            languages,
            last24hours,
            favoriteLanguage,
            languageStats,
            mostStarredLanguage,
        };
    }
});
