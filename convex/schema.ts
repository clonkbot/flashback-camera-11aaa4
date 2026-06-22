import { defineSchema, defineTable } from "convex/server";
import { authTables } from "@convex-dev/auth/server";
import { v } from "convex/values";

export default defineSchema({
  ...authTables,

  events: defineTable({
    hostId: v.id("users"),
    name: v.string(),
    description: v.optional(v.string()),
    eventDate: v.optional(v.number()),
    coverEmoji: v.string(),
    shareCode: v.string(),
    photoLimit: v.number(),
    revealMode: v.union(
      v.literal("instant"),
      v.literal("scheduled"),
      v.literal("manual")
    ),
    revealAt: v.optional(v.number()),
    isRevealed: v.boolean(),
    revealedAt: v.optional(v.number()),
    plan: v.union(v.literal("free"), v.literal("starter"), v.literal("pro")),
    createdAt: v.number(),
  })
    .index("by_host", ["hostId"])
    .index("by_share_code", ["shareCode"]),

  photos: defineTable({
    eventId: v.id("events"),
    guestId: v.string(),
    guestName: v.optional(v.string()),
    storageId: v.id("_storage"),
    takenAt: v.number(),
  })
    .index("by_event", ["eventId"])
    .index("by_guest", ["guestId"]),

  guests: defineTable({
    eventId: v.id("events"),
    guestId: v.string(),
    name: v.optional(v.string()),
    photosTaken: v.number(),
    maxPhotos: v.number(),
    lastActiveAt: v.number(),
  })
    .index("by_event", ["eventId"])
    .index("by_guest_id", ["guestId"]),
});
