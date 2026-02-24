import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

export const list = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];
    return await ctx.db
      .query("teamMembers")
      .order("desc")
      .collect();
  },
});

export const getMyProfile = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return null;
    return await ctx.db
      .query("teamMembers")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .first();
  },
});

export const create = mutation({
  args: {
    name: v.string(),
    role: v.string(),
    phone: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const existing = await ctx.db
      .query("teamMembers")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .first();

    if (existing) {
      return existing._id;
    }

    return await ctx.db.insert("teamMembers", {
      userId,
      name: args.name,
      role: args.role,
      phone: args.phone,
      whatsappConnected: false,
      status: "online",
      createdAt: Date.now(),
    });
  },
});

export const updateStatus = mutation({
  args: {
    status: v.union(v.literal("online"), v.literal("offline"), v.literal("away")),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const member = await ctx.db
      .query("teamMembers")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .first();

    if (member) {
      await ctx.db.patch(member._id, { status: args.status });
    }
  },
});

export const connectWhatsApp = mutation({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const member = await ctx.db
      .query("teamMembers")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .first();

    if (member) {
      await ctx.db.patch(member._id, { whatsappConnected: true });
    }
  },
});
