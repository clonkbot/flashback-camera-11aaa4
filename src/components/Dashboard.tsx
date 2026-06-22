import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { useAuthActions } from "@convex-dev/auth/react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";
import { motion, AnimatePresence } from "framer-motion";
import { Camera, Plus, LogOut, Image, Users, Calendar, Share2, Eye, Clock, Trash2, X, Sparkles } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { Footer } from "./Footer";

interface Props {
  onNavigate: (page: "landing" | "auth" | "dashboard" | "pricing" | "camera" | "gallery" | "event", data?: string) => void;
}

const EMOJIS = ["🎉", "💒", "🎂", "🎊", "🥳", "💍", "🎈", "🌸", "✨", "🎭", "🎪", "🌴"];

export function Dashboard({ onNavigate }: Props) {
  const { signOut } = useAuthActions();
  const events = useQuery(api.events.list);
  const createEvent = useMutation(api.events.create);
  const deleteEvent = useMutation(api.events.remove);

  const [showCreate, setShowCreate] = useState(false);
  const [showShare, setShowShare] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const handleCreate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsCreating(true);
    const formData = new FormData(e.currentTarget);

    await createEvent({
      name: formData.get("name") as string,
      description: formData.get("description") as string || undefined,
      eventDate: formData.get("eventDate") ? new Date(formData.get("eventDate") as string).getTime() : undefined,
      coverEmoji: formData.get("emoji") as string || "🎉",
      revealMode: formData.get("revealMode") as "instant" | "scheduled" | "manual",
      revealAt: formData.get("revealAt") ? new Date(formData.get("revealAt") as string).getTime() : undefined,
      plan: "free",
    });

    setIsCreating(false);
    setShowCreate(false);
  };

  const handleDelete = async (id: Id<"events">) => {
    await deleteEvent({ id });
    setDeleteConfirm(null);
  };

  const shareEvent = events?.find((evt: { _id: string }) => evt._id === showShare);
  const shareUrl = shareEvent ? `${window.location.origin}/e/${shareEvent.shareCode}` : "";

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col">
      {/* Grain overlay */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.03]" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
      }} />

      {/* Header */}
      <header className="relative z-10 flex items-center justify-between p-4 md:p-6 lg:p-8 border-b border-white/5">
        <div className="flex items-center gap-2 md:gap-3">
          <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-amber-400 to-rose-500 rounded-2xl flex items-center justify-center shadow-lg shadow-amber-500/20">
            <Camera className="w-5 h-5 md:w-6 md:h-6 text-black" />
          </div>
          <span className="text-xl md:text-2xl font-bold tracking-tight">flashback</span>
        </div>
        <button
          onClick={() => signOut()}
          className="flex items-center gap-2 text-white/60 hover:text-white transition-colors px-3 py-2 hover:bg-white/5 rounded-xl"
        >
          <LogOut className="w-5 h-5" />
          <span className="hidden sm:inline">Sign out</span>
        </button>
      </header>

      <main className="relative z-10 flex-1 px-4 md:px-6 lg:px-8 py-6 md:py-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8 md:mb-10">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">Your Events</h1>
              <p className="text-white/50 mt-1 text-sm md:text-base">Create and manage your photo events</p>
            </div>
            <button
              onClick={() => setShowCreate(true)}
              className="bg-gradient-to-r from-amber-400 to-rose-500 text-black px-5 md:px-6 py-3 rounded-full font-bold flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-amber-500/25 transition-all hover:scale-105"
            >
              <Plus className="w-5 h-5" />
              New Event
            </button>
          </div>

          {events === undefined ? (
            <div className="flex items-center justify-center py-20">
              <div className="w-10 h-10 border-4 border-amber-400/30 border-t-amber-400 rounded-full animate-spin" />
            </div>
          ) : events.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-16 md:py-20"
            >
              <div className="w-20 h-20 md:w-24 md:h-24 mx-auto bg-white/5 rounded-3xl flex items-center justify-center mb-6">
                <Sparkles className="w-10 h-10 md:w-12 md:h-12 text-white/30" />
              </div>
              <h3 className="text-xl md:text-2xl font-bold mb-3">No events yet</h3>
              <p className="text-white/50 mb-6 text-sm md:text-base">Create your first event to start collecting memories</p>
              <button
                onClick={() => setShowCreate(true)}
                className="bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-full font-semibold transition-colors"
              >
                Create Event
              </button>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {events.map((event: { _id: string; coverEmoji: string; name: string; photoCount: number; eventDate?: number; isRevealed: boolean; revealMode: string; plan: string }, i: number) => (
                <motion.div
                  key={event._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="bg-white/5 border border-white/10 rounded-3xl p-5 md:p-6 hover:border-white/20 transition-all group"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="text-4xl md:text-5xl">{event.coverEmoji}</div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setShowShare(event._id)}
                        className="p-2 hover:bg-white/10 rounded-xl transition-colors"
                        title="Share"
                      >
                        <Share2 className="w-5 h-5 text-white/60" />
                      </button>
                      <button
                        onClick={() => setDeleteConfirm(event._id)}
                        className="p-2 hover:bg-rose-500/20 rounded-xl transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-5 h-5 text-white/60 hover:text-rose-400" />
                      </button>
                    </div>
                  </div>

                  <h3 className="text-lg md:text-xl font-bold mb-2 truncate">{event.name}</h3>

                  <div className="flex items-center gap-4 text-xs md:text-sm text-white/50 mb-4">
                    <span className="flex items-center gap-1.5">
                      <Image className="w-4 h-4" />
                      {event.photoCount} photos
                    </span>
                    {event.eventDate && (
                      <span className="flex items-center gap-1.5">
                        <Calendar className="w-4 h-4" />
                        {new Date(event.eventDate).toLocaleDateString()}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2 mb-5">
                    {event.isRevealed ? (
                      <span className="flex items-center gap-1.5 text-xs bg-emerald-500/20 text-emerald-400 px-3 py-1.5 rounded-full">
                        <Eye className="w-3.5 h-3.5" />
                        Revealed
                      </span>
                    ) : (
                      <span className="flex items-center gap-1.5 text-xs bg-amber-500/20 text-amber-400 px-3 py-1.5 rounded-full">
                        <Clock className="w-3.5 h-3.5" />
                        {event.revealMode === "scheduled" ? "Scheduled" : "Hidden"}
                      </span>
                    )}
                    <span className="text-xs bg-white/10 text-white/60 px-3 py-1.5 rounded-full uppercase">
                      {event.plan}
                    </span>
                  </div>

                  <button
                    onClick={() => onNavigate("event", event._id)}
                    className="w-full bg-white/10 hover:bg-white/20 text-white py-3 rounded-xl font-semibold transition-colors text-sm md:text-base"
                  >
                    Manage Event
                  </button>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Create Modal */}
      <AnimatePresence>
        {showCreate && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowCreate(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-[#141414] border border-white/10 rounded-3xl p-6 md:p-8 w-full max-w-lg max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl md:text-2xl font-bold">Create Event</h2>
                <button
                  onClick={() => setShowCreate(false)}
                  className="p-2 hover:bg-white/10 rounded-xl transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreate} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-white/70 mb-2">Event Name</label>
                  <input
                    name="name"
                    type="text"
                    required
                    placeholder="Sarah & John's Wedding"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-amber-400/50"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-white/70 mb-2">Description (optional)</label>
                  <textarea
                    name="description"
                    placeholder="A brief description of your event..."
                    rows={2}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-amber-400/50 resize-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-white/70 mb-2">Event Date (optional)</label>
                  <input
                    name="eventDate"
                    type="date"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-400/50"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-white/70 mb-2">Cover Emoji</label>
                  <div className="flex flex-wrap gap-2">
                    {EMOJIS.map((emoji) => (
                      <label key={emoji} className="cursor-pointer">
                        <input
                          type="radio"
                          name="emoji"
                          value={emoji}
                          defaultChecked={emoji === "🎉"}
                          className="sr-only peer"
                        />
                        <span className="block text-2xl md:text-3xl p-2 rounded-xl hover:bg-white/10 peer-checked:bg-amber-500/20 peer-checked:ring-2 peer-checked:ring-amber-400/50 transition-all">
                          {emoji}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-white/70 mb-2">Photo Reveal</label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    {[
                      { value: "manual", label: "Manual", desc: "You decide when" },
                      { value: "scheduled", label: "Scheduled", desc: "Set a date/time" },
                      { value: "instant", label: "Instant", desc: "Show immediately" },
                    ].map((opt) => (
                      <label key={opt.value} className="cursor-pointer">
                        <input
                          type="radio"
                          name="revealMode"
                          value={opt.value}
                          defaultChecked={opt.value === "manual"}
                          className="sr-only peer"
                        />
                        <div className="p-3 md:p-4 rounded-xl border border-white/10 hover:border-white/20 peer-checked:border-amber-400/50 peer-checked:bg-amber-500/10 transition-all text-center">
                          <div className="font-semibold text-sm">{opt.label}</div>
                          <div className="text-[10px] md:text-xs text-white/50 mt-0.5">{opt.desc}</div>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isCreating}
                  className="w-full bg-gradient-to-r from-amber-400 to-rose-500 text-black py-4 rounded-xl font-bold text-lg hover:shadow-lg hover:shadow-amber-500/25 transition-all disabled:opacity-50"
                >
                  {isCreating ? "Creating..." : "Create Event"}
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Share Modal */}
      <AnimatePresence>
        {showShare && shareEvent && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowShare(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-[#141414] border border-white/10 rounded-3xl p-6 md:p-8 w-full max-w-sm text-center"
            >
              <h2 className="text-xl md:text-2xl font-bold mb-2">{shareEvent.name}</h2>
              <p className="text-white/50 mb-6 text-sm">Share this with your guests</p>

              <div className="bg-white p-4 md:p-6 rounded-2xl mb-6 mx-auto w-fit">
                <QRCodeSVG value={shareUrl} size={180} />
              </div>

              <div className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 mb-4 font-mono text-sm md:text-lg tracking-wider">
                {shareEvent.shareCode}
              </div>

              <button
                onClick={() => {
                  navigator.clipboard.writeText(shareUrl);
                }}
                className="w-full bg-white/10 hover:bg-white/20 text-white py-3 rounded-xl font-semibold transition-colors text-sm md:text-base"
              >
                Copy Link
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Confirm Modal */}
      <AnimatePresence>
        {deleteConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setDeleteConfirm(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-[#141414] border border-white/10 rounded-3xl p-6 md:p-8 w-full max-w-sm text-center"
            >
              <div className="w-14 h-14 md:w-16 md:h-16 mx-auto bg-rose-500/20 rounded-2xl flex items-center justify-center mb-4">
                <Trash2 className="w-7 h-7 md:w-8 md:h-8 text-rose-400" />
              </div>
              <h2 className="text-xl md:text-2xl font-bold mb-2">Delete Event?</h2>
              <p className="text-white/50 mb-6 text-sm">This will permanently delete all photos and data.</p>
              <div className="flex gap-3">
                <button
                  onClick={() => setDeleteConfirm(null)}
                  className="flex-1 bg-white/10 hover:bg-white/20 text-white py-3 rounded-xl font-semibold transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDelete(deleteConfirm as Id<"events">)}
                  className="flex-1 bg-rose-500 hover:bg-rose-600 text-white py-3 rounded-xl font-semibold transition-colors"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
}
