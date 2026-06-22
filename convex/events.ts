import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

function generateShareCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

const PLAN_LIMITS = {
  free: { maxPhotosPerGuest: 10, maxTotalPhotos: 50 },
  starter: { maxPhotosPerGuest: 25, maxTotalPhotos: 500 },
  pro: { maxPhotosPerGuest: 50, maxTotalPhotos: 2000 },
};

export const list = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];

    const events = await ctx.db
      .query("events")
      .withIndex("by_host", (q) => q.eq("hostId", userId))
      .order("desc")
      .collect();

    const eventsWithCounts = await Promise.all(
      events.map(async (event) => {
        const photos = await ctx.db
          .query("photos")
          .withIndex("by_event", (q) => q.eq("eventId", event._id))
          .collect();
        return { ...event, photoCount: photos.length };
      })
    );

    return eventsWithCounts;
  },
});

export const get = query({
  args: { id: v.id("events") },
  handler: async (ctx, args) => {
    const event = await ctx.db.get(args.id);
    if (!event) return null;

    const photos = await ctx.db
      .query("photos")
      .withIndex("by_event", (q) => q.eq("eventId", args.id))
      .collect();

    return { ...event, photoCount: photos.length };
  },
});

export const getByShareCode = query({
  args: { shareCode: v.string() },
  handler: async (ctx, args) => {
    const event = await ctx.db
      .query("events")
      .withIndex("by_share_code", (q) => q.eq("shareCode", args.shareCode.toUpperCase()))
      .first();

    if (!event) return null;

    const photos = await ctx.db
      .query("photos")
      .withIndex("by_event", (q) => q.eq("eventId", event._id))
      .collect();

    return { ...event, photoCount: photos.length };
  },
});

export const create = mutation({
  args: {
    name: v.string(),
    description: v.optional(v.string()),
    eventDate: v.optional(v.number()),
    coverEmoji: v.string(),
    revealMode: v.union(
      v.literal("instant"),
      v.literal("scheduled"),
      v.literal("manual")
    ),
    revealAt: v.optional(v.number()),
    plan: v.union(v.literal("free"), v.literal("starter"), v.literal("pro")),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    let shareCode = generateShareCode();
    let existing = await ctx.db
      .query("events")
      .withIndex("by_share_code", (q) => q.eq("shareCode", shareCode))
      .first();

    while (existing) {
      shareCode = generateShareCode();
      existing = await ctx.db
        .query("events")
        .withIndex("by_share_code", (q) => q.eq("shareCode", shareCode))
        .first();
    }

    return await ctx.db.insert("events", {
      hostId: userId,
      name: args.name,
      description: args.description,
      eventDate: args.eventDate,
      coverEmoji: args.coverEmoji,
      shareCode,
      photoLimit: PLAN_LIMITS[args.plan].maxPhotosPerGuest,
      revealMode: args.revealMode,
      revealAt: args.revealAt,
      isRevealed: args.revealMode === "instant",
      plan: args.plan,
      createdAt: Date.now(),
    });
  },
});

export const reveal = mutation({
  args: { id: v.id("events") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const event = await ctx.db.get(args.id);
    if (!event || event.hostId !== userId) throw new Error("Not authorized");

    await ctx.db.patch(args.id, {
      isRevealed: true,
      revealedAt: Date.now(),
    });
  },
});

export const update = mutation({
  args: {
    id: v.id("events"),
    name: v.optional(v.string()),
    description: v.optional(v.string()),
    revealMode: v.optional(
      v.union(v.literal("instant"), v.literal("scheduled"), v.literal("manual"))
    ),
    revealAt: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const event = await ctx.db.get(args.id);
    if (!event || event.hostId !== userId) throw new Error("Not authorized");

    const updates: Record<string, unknown> = {};
    if (args.name !== undefined) updates.name = args.name;
    if (args.description !== undefined) updates.description = args.description;
    if (args.revealMode !== undefined) updates.revealMode = args.revealMode;
    if (args.revealAt !== undefined) updates.revealAt = args.revealAt;

    await ctx.db.patch(args.id, updates);
  },
});

export const remove = mutation({
  args: { id: v.id("events") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const event = await ctx.db.get(args.id);
    if (!event || event.hostId !== userId) throw new Error("Not authorized");

    // Delete all photos for this event
    const photos = await ctx.db
      .query("photos")
      .withIndex("by_event", (q) => q.eq("eventId", args.id))
      .collect();

    for (const photo of photos) {
      await ctx.storage.delete(photo.storageId);
      await ctx.db.delete(photo._id);
    }

    // Delete all guests for this event
    const guests = await ctx.db
      .query("guests")
      .withIndex("by_event", (q) => q.eq("eventId", args.id))
      .collect();

    for (const guest of guests) {
      await ctx.db.delete(guest._id);
    }

    await ctx.db.delete(args.id);
  },
});
