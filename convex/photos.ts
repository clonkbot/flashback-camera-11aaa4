import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const listForEvent = query({
  args: { eventId: v.id("events") },
  handler: async (ctx, args) => {
    const event = await ctx.db.get(args.eventId);
    if (!event) return [];

    const photos = await ctx.db
      .query("photos")
      .withIndex("by_event", (q) => q.eq("eventId", args.eventId))
      .order("desc")
      .collect();

    // If not revealed, only return metadata (no URLs)
    if (!event.isRevealed) {
      return photos.map((p) => ({
        _id: p._id,
        eventId: p.eventId,
        guestName: p.guestName,
        takenAt: p.takenAt,
        url: null,
      }));
    }

    // If revealed, include URLs
    return await Promise.all(
      photos.map(async (p) => ({
        _id: p._id,
        eventId: p.eventId,
        guestName: p.guestName,
        takenAt: p.takenAt,
        url: await ctx.storage.getUrl(p.storageId),
      }))
    );
  },
});

export const generateUploadUrl = mutation({
  args: {},
  handler: async (ctx) => {
    return await ctx.storage.generateUploadUrl();
  },
});

export const savePhoto = mutation({
  args: {
    eventId: v.id("events"),
    guestId: v.string(),
    storageId: v.id("_storage"),
    guestName: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const event = await ctx.db.get(args.eventId);
    if (!event) throw new Error("Event not found");

    // Check/update guest record
    let guest = await ctx.db
      .query("guests")
      .withIndex("by_guest_id", (q) => q.eq("guestId", args.guestId))
      .first();

    if (!guest) {
      await ctx.db.insert("guests", {
        eventId: args.eventId,
        guestId: args.guestId,
        name: args.guestName,
        photosTaken: 1,
        maxPhotos: event.photoLimit,
        lastActiveAt: Date.now(),
      });
    } else {
      if (guest.photosTaken >= guest.maxPhotos) {
        throw new Error("Photo limit reached");
      }
      await ctx.db.patch(guest._id, {
        photosTaken: guest.photosTaken + 1,
        lastActiveAt: Date.now(),
        name: args.guestName || guest.name,
      });
    }

    return await ctx.db.insert("photos", {
      eventId: args.eventId,
      guestId: args.guestId,
      guestName: args.guestName,
      storageId: args.storageId,
      takenAt: Date.now(),
    });
  },
});

export const getGuestInfo = query({
  args: { guestId: v.string(), eventId: v.id("events") },
  handler: async (ctx, args) => {
    const guest = await ctx.db
      .query("guests")
      .withIndex("by_guest_id", (q) => q.eq("guestId", args.guestId))
      .first();

    if (!guest || guest.eventId !== args.eventId) {
      const event = await ctx.db.get(args.eventId);
      return {
        photosTaken: 0,
        maxPhotos: event?.photoLimit ?? 10,
        name: null,
      };
    }

    return {
      photosTaken: guest.photosTaken,
      maxPhotos: guest.maxPhotos,
      name: guest.name,
    };
  },
});
