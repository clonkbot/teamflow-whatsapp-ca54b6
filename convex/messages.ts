import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

export const list = query({
  args: { conversationId: v.id("conversations") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];

    const conversation = await ctx.db.get(args.conversationId);
    if (!conversation || conversation.userId !== userId) return [];

    return await ctx.db
      .query("messages")
      .withIndex("by_conversation", (q) => q.eq("conversationId", args.conversationId))
      .order("asc")
      .collect();
  },
});

export const send = mutation({
  args: {
    conversationId: v.id("conversations"),
    content: v.string(),
    messageType: v.union(v.literal("text"), v.literal("image"), v.literal("document"), v.literal("voice")),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const conversation = await ctx.db.get(args.conversationId);
    if (!conversation || conversation.userId !== userId) {
      throw new Error("Not found");
    }

    const messageId = await ctx.db.insert("messages", {
      conversationId: args.conversationId,
      userId,
      content: args.content,
      sender: "user",
      status: "sent",
      messageType: args.messageType,
      createdAt: Date.now(),
    });

    // Update conversation last message
    await ctx.db.patch(args.conversationId, {
      lastMessage: args.content,
      lastMessageAt: Date.now(),
    });

    // Log activity
    await ctx.db.insert("activityLogs", {
      userId,
      action: "message_sent",
      details: `Sent message to ${conversation.contactName}`,
      createdAt: Date.now(),
    });

    return messageId;
  },
});

// Simulate receiving a message (for demo purposes)
export const simulateReceive = mutation({
  args: {
    conversationId: v.id("conversations"),
    content: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const conversation = await ctx.db.get(args.conversationId);
    if (!conversation || conversation.userId !== userId) {
      throw new Error("Not found");
    }

    await ctx.db.insert("messages", {
      conversationId: args.conversationId,
      userId,
      content: args.content,
      sender: "contact",
      status: "delivered",
      messageType: "text",
      createdAt: Date.now(),
    });

    await ctx.db.patch(args.conversationId, {
      lastMessage: args.content,
      lastMessageAt: Date.now(),
      unreadCount: conversation.unreadCount + 1,
    });
  },
});
