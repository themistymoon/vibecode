import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const trackVisitor = mutation({
  args: {
    userAgent: v.optional(v.string()),
    referrer: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("visitors", {
      timestamp: Date.now(),
      userAgent: args.userAgent,
      referrer: args.referrer,
    });
  },
});

export const trackInteraction = mutation({
  args: {
    section: v.string(),
    action: v.string(),
    metadata: v.optional(v.object({
      duration: v.optional(v.number()),
      scrollDepth: v.optional(v.number()),
    })),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("interactions", {
      section: args.section,
      action: args.action,
      timestamp: Date.now(),
      metadata: args.metadata,
    });
  },
});

export const getVisitorCount = query({
  args: {},
  handler: async (ctx) => {
    const visitors = await ctx.db.query("visitors").collect();
    return visitors.length;
  },
});
