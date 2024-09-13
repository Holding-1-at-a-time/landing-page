import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const createUser = mutation({
    args: {
        _id: v.id('signup'),        userId: v.id('users'),
        createdAt: v.number(),
        name: v.string(),
        email: v.string(),
        companyName: v.string(),
        businessSize: v.union(v.literal("solo"), v.literal("small"), v.literal("medium"), v.literal("large")),
        agreeTerms: v.boolean(),
        industry: v.string(),
        mainChallenge: v.union(v.literal("scheduling"), v.literal("customer"), v.literal("analytics"), v.literal("growth")),
        plan: v.union(v.literal("starter"), v.literal("enterprise")),
        address: v.string(), // Add this line
    },
    handler: async (ctx, args) => {
        const userId = await ctx.db.insert("users", args);
        return userId;
    },
});

export const getUserByEmail = query({
    args: { email: v.string() },
    handler: async (ctx, args) => {
        return await ctx.db
            .query("users")
            .withIndex("by_name_email_createdAt_name", (q) => q.eq("name", args.email))
            .first();
    },
});

export const getUserById = query({
    args: { userId: v.id('users') },
    handler: async (ctx, args) => {
        return await ctx.db
            .query("users")
            .first();
    },
});




export const updateUser = mutation({
    args: {
        userId: v.id('users'),
        name: v.string(),
        email: v.string(),
        companyName: v.string(),
        businessSize: v.union(v.literal("solo"), v.literal("small"), v.literal("medium"), v.literal("large")),
        industry: v.string(),
        mainChallenge: v.union(v.literal("scheduling"), v.literal("customer"), v.literal("analytics"), v.literal("growth")),
        plan: v.union(v.literal("starter"), v.literal("enterprise")),
        agreeTerms: v.boolean(),
    },
    handler: async (ctx, args) => {
        ctx.db
            .query("users")
    },
});