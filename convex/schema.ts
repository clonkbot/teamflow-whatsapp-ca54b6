import { defineSchema, defineTable } from "convex/server";
import { authTables } from "@convex-dev/auth/server";
import { v } from "convex/values";

export default defineSchema({
  ...authTables,

  // Team members
  teamMembers: defineTable({
    userId: v.id("users"),
    name: v.string(),
    role: v.string(),
    phone: v.optional(v.string()),
    whatsappConnected: v.boolean(),
    status: v.union(v.literal("online"), v.literal("offline"), v.literal("away")),
    avatar: v.optional(v.string()),
    createdAt: v.number(),
  }).index("by_user", ["userId"]),

  // WhatsApp conversations
  conversations: defineTable({
    teamId: v.optional(v.id("teamMembers")),
    userId: v.id("users"),
    contactName: v.string(),
    contactPhone: v.string(),
    lastMessage: v.string(),
    lastMessageAt: v.number(),
    unreadCount: v.number(),
    isGroup: v.boolean(),
    createdAt: v.number(),
  }).index("by_user", ["userId"])
    .index("by_last_message", ["userId", "lastMessageAt"]),

  // Messages within conversations
  messages: defineTable({
    conversationId: v.id("conversations"),
    userId: v.id("users"),
    content: v.string(),
    sender: v.union(v.literal("user"), v.literal("contact")),
    status: v.union(v.literal("sent"), v.literal("delivered"), v.literal("read")),
    messageType: v.union(v.literal("text"), v.literal("image"), v.literal("document"), v.literal("voice")),
    createdAt: v.number(),
  }).index("by_conversation", ["conversationId", "createdAt"]),

  // WhatsApp integration settings
  integrationSettings: defineTable({
    userId: v.id("users"),
    whatsappBusinessId: v.optional(v.string()),
    webhookUrl: v.optional(v.string()),
    apiKey: v.optional(v.string()),
    isConnected: v.boolean(),
    connectedAt: v.optional(v.number()),
  }).index("by_user", ["userId"]),

  // Team activity logs
  activityLogs: defineTable({
    userId: v.id("users"),
    action: v.string(),
    details: v.string(),
    createdAt: v.number(),
  }).index("by_user", ["userId", "createdAt"]),
});
