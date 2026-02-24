import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

export const getSettings = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return null;

    return await ctx.db
      .query("integrationSettings")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .first();
  },
});

export const saveSettings = mutation({
  args: {
    whatsappBusinessId: v.optional(v.string()),
    webhookUrl: v.optional(v.string()),
    apiKey: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const existing = await ctx.db
      .query("integrationSettings")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .first();

    if (existing) {
      await ctx.db.patch(existing._id, {
        ...args,
      });
      return existing._id;
    }

    return await ctx.db.insert("integrationSettings", {
      userId,
      ...args,
      isConnected: false,
    });
  },
});

export const connect = mutation({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const settings = await ctx.db
      .query("integrationSettings")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .first();

    if (settings) {
      await ctx.db.patch(settings._id, {
        isConnected: true,
        connectedAt: Date.now(),
      });

      await ctx.db.insert("activityLogs", {
        userId,
        action: "whatsapp_connected",
        details: "WhatsApp Business API connected successfully",
        createdAt: Date.now(),
      });
    }
  },
});

export const disconnect = mutation({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const settings = await ctx.db
      .query("integrationSettings")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .first();

    if (settings) {
      await ctx.db.patch(settings._id, {
        isConnected: false,
        connectedAt: undefined,
      });
    }
  },
});
