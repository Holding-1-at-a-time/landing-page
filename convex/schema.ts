// convex/schema.ts
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
    signUp: defineTable({
        _id: v.id('signup'),
        userId: v.id('users'),
        createdAt: v.number(),
        name: v.string(),
        email: v.string(),
        companyName: v.string(),
        businessSize: v.union(v.literal('solo'), v.literal('small'), v.literal('medium'), v.literal('large')),
        address: v.string(),
        mainChallenge: v.union(v.literal('scheduling'), v.literal('customer'), v.literal('analytics'), v.literal('growth')),
        plan: v.union(v.literal('starter'), v.literal('pro'), v.literal('enterprise')),
        agreeTerms: v.boolean(),
    })
        .index("by_userId", ["userId"])
        .index("by_name_email_createdAt_name", ["name", "email", "createdAt", "name"])
        .index("by_name_email_createdAt_name_businessSize", ["name", "email", "createdAt", "name", "businessSize"])
        .index("by_name_email_createdAt_name_companyName", ["name", "email", "createdAt", "name", "companyName"])
        .index("by_name_email_createdAt_name_businessSize_companyName", ["name", "email", "createdAt", "name", "businessSize", "companyName"]),

    users: defineTable({
        _id: v.id('users'),
        userId: v.id('users'),
        createdAt: v.number(),
        name: v.string(),
        email: v.string(),
        companyName: v.string(),
        businessSize: v.union(v.literal('solo'), v.literal('small'), v.literal('medium'), v.literal('large')),
        address: v.string(),
        mainChallenge: v.union(v.literal('scheduling'), v.literal('customer'), v.literal('analytics'), v.literal('growth')),
        plan: v.union(v.literal('starter'), v.literal('pro'), v.literal('enterprise')),
        agreeTerms: v.boolean(),
    })
    
        .index("by_userId", ["userId"])
    
        .index("by_name_email_createdAt_name", ["name", "email", "createdAt", "name"])
        .index("by_name_email_createdAt_name_businessSize", ["name", "email", "createdAt", "name", "businessSize"])
        .index("by_name_email_createdAt_name_companyName", ["name", "email", "createdAt", "name", "companyName"])
        .index("by_name_email_createdAt_name_businessSize_companyName", ["name", "email", "createdAt", "name", "businessSize", "companyName"]),

    usersEmbedding: defineTable({
        _id: v.id('usersEmbedding'),
        userId: v.id('users'),
        createdAt: v.number(),
        name: v.string(),
        email: v.string(),
        companyName: v.string(),
        businessSize: v.union(v.literal('solo'), v.literal('small'), v.literal('medium'), v.literal('large')),
        address: v.string(),
        mainChallenge: v.union(v.literal('scheduling'), v.literal('customer'), v.literal('analytics'), v.literal('growth')),
        plan: v.union(v.literal('starter'), v.literal('pro'), v.literal('enterprise')),
        agreeTerms: v.boolean(),
        embedding: v.array(v.float64()),
    })
        .vectorIndex("by_embedding", {
            vectorField: "embedding",
            dimensions: 1536,
            filterFields: ["userId", "companyName", "businessSize", "name", "mainChallenge"],
        })
});