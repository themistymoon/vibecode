import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { authTables } from "@convex-dev/auth/server";

const applicationTables = {
  visitors: defineTable({
    timestamp: v.number(),
    userAgent: v.optional(v.string()),
    referrer: v.optional(v.string()),
  }),
  interactions: defineTable({
    section: v.string(),
    action: v.string(),
    timestamp: v.number(),
    metadata: v.optional(v.object({
      duration: v.optional(v.number()),
      scrollDepth: v.optional(v.number()),
    })),
  }),
};

export default defineSchema({
  ...authTables,
  ...applicationTables,
});
