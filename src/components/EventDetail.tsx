import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";
import { motion } from "framer-motion";
import { ArrowLeft, Image, Clock, Eye, Share2, ExternalLink, Download, Sparkles } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { Footer } from "./Footer";

interface Props {
  eventId: string;
  onNavigate: (page: "landing" | "auth" | "dashboard" | "pricing" | "camera" | "gallery" | "event", data?: string) => void;
}

export function EventDetail({ eventId, onNavigate }: Props) {
  const event = useQuery(api.events.get, { id: eventId as Id<"events"> });
  const photos = useQuery(api.photos.listForEvent, { eventId: eventId as Id<"events"> });
  const revealEvent = useMutation(api.events.reveal);

  if (event === undefined) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-amber-400/30 border-t-amber-400 rounded-full animate-spin" />
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col items-center justify-center p-4">
        <h1 className="text-2xl font-bold mb-4">Event not found</h1>
        <button
          onClick={() => onNavigate("dashboard")}
          className="bg-white/10 hover:bg-white/20 px-6 py-3 rounded-full"
        >
          Go to Dashboard
        </button>
      </div>
    );
  }

  const shareUrl = `${window.location.origin}/e/${event.shareCode}`;

  const handleReveal = async () => {
    await revealEvent({ id: eventId as Id<"events"> });
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col">
      {/* Grain overlay */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.03]" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
      }} />

      <header className="relative z-10 p-4 md:p-6 lg:p-8 border-b border-white/5">
        <button
          onClick={() => onNavigate("dashboard")}
          className="flex items-center gap-2 text-white/60 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Dashboard
        </button>
      </header>

      <main className="relative z-10 flex-1 px-4 md:px-6 lg:px-8 py-6 md:py-8">
        <div className="max-w-6xl mx-auto">
          {/* Event Header */}
          <div className="flex flex-col md:flex-row md:items-start gap-6 mb-8 md:mb-12">
            <div className="text-5xl md:text-6xl">{event.coverEmoji}</div>
            <div className="flex-1">
              <h1 className="text-3xl md:text-4xl font-bold mb-2">{event.name}</h1>
              {event.description && (
                <p className="text-white/60 mb-4 text-sm md:text-base">{event.description}</p>
              )}
              <div className="flex flex-wrap items-center gap-3">
                <span className="flex items-center gap-1.5 text-sm bg-white/10 text-white/70 px-3 py-1.5 rounded-full">
                  <Image className="w-4 h-4" />
                  {event.photoCount} photos
                </span>
                {event.isRevealed ? (
                  <span className="flex items-center gap-1.5 text-sm bg-emerald-500/20 text-emerald-400 px-3 py-1.5 rounded-full">
                    <Eye className="w-4 h-4" />
                    Photos Revealed
                  </span>
                ) : (
                  <span className="flex items-center gap-1.5 text-sm bg-amber-500/20 text-amber-400 px-3 py-1.5 rounded-full">
                    <Clock className="w-4 h-4" />
                    {event.revealMode === "scheduled" ? "Scheduled Reveal" : "Photos Hidden"}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Actions Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-8 md:mb-12">
            {/* Share Card */}
            <div className="bg-white/5 border border-white/10 rounded-3xl p-5 md:p-6">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <Share2 className="w-5 h-5 text-amber-400" />
                Share with Guests
              </h3>
              <div className="bg-white p-3 md:p-4 rounded-xl mb-4 w-fit mx-auto">
                <QRCodeSVG value={shareUrl} size={140} />
              </div>
              <div className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 mb-3 font-mono text-sm text-center">
                {event.shareCode}
              </div>
              <button
                onClick={() => navigator.clipboard.writeText(shareUrl)}
                className="w-full bg-white/10 hover:bg-white/20 text-white py-2.5 rounded-xl font-semibold transition-colors text-sm"
              >
                Copy Link
              </button>
            </div>

            {/* Reveal Card */}
            <div className="bg-white/5 border border-white/10 rounded-3xl p-5 md:p-6">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <Eye className="w-5 h-5 text-amber-400" />
                Photo Reveal
              </h3>
              {event.isRevealed ? (
                <div className="text-center py-4 md:py-6">
                  <div className="w-14 h-14 md:w-16 md:h-16 mx-auto bg-emerald-500/20 rounded-2xl flex items-center justify-center mb-4">
                    <Sparkles className="w-7 h-7 md:w-8 md:h-8 text-emerald-400" />
                  </div>
                  <p className="text-white/60 mb-4 text-sm">Photos are visible to everyone</p>
                  <button
                    onClick={() => onNavigate("gallery", event.shareCode)}
                    className="w-full bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 py-2.5 rounded-xl font-semibold transition-colors flex items-center justify-center gap-2 text-sm"
                  >
                    <ExternalLink className="w-4 h-4" />
                    View Gallery
                  </button>
                </div>
              ) : (
                <div className="text-center py-4 md:py-6">
                  <div className="w-14 h-14 md:w-16 md:h-16 mx-auto bg-amber-500/20 rounded-2xl flex items-center justify-center mb-4">
                    <Clock className="w-7 h-7 md:w-8 md:h-8 text-amber-400" />
                  </div>
                  <p className="text-white/60 mb-4 text-sm">Photos are currently hidden</p>
                  <button
                    onClick={handleReveal}
                    className="w-full bg-gradient-to-r from-amber-400 to-rose-500 text-black py-2.5 rounded-xl font-bold transition-all hover:shadow-lg hover:shadow-amber-500/25 text-sm"
                  >
                    Reveal All Photos
                  </button>
                </div>
              )}
            </div>

            {/* Stats Card */}
            <div className="bg-white/5 border border-white/10 rounded-3xl p-5 md:p-6">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <Image className="w-5 h-5 text-amber-400" />
                Event Stats
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-white/60 text-sm">Total Photos</span>
                  <span className="text-xl md:text-2xl font-bold">{event.photoCount}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-white/60 text-sm">Plan</span>
                  <span className="text-sm font-semibold uppercase bg-white/10 px-3 py-1 rounded-full">
                    {event.plan}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-white/60 text-sm">Photo Limit</span>
                  <span className="text-lg font-bold">{event.photoLimit}/guest</span>
                </div>
              </div>
            </div>
          </div>

          {/* Photo Grid Preview */}
          <div className="mb-8">
            <h2 className="text-xl md:text-2xl font-bold mb-4 md:mb-6">
              {event.isRevealed ? "Photos" : "Photo Preview (Hidden)"}
            </h2>
            {photos === undefined ? (
              <div className="flex items-center justify-center py-12">
                <div className="w-8 h-8 border-4 border-amber-400/30 border-t-amber-400 rounded-full animate-spin" />
              </div>
            ) : photos.length === 0 ? (
              <div className="text-center py-12 md:py-16 bg-white/5 border border-white/10 rounded-3xl">
                <div className="w-16 h-16 md:w-20 md:h-20 mx-auto bg-white/5 rounded-2xl flex items-center justify-center mb-4">
                  <Image className="w-8 h-8 md:w-10 md:h-10 text-white/30" />
                </div>
                <h3 className="text-lg font-semibold mb-2">No photos yet</h3>
                <p className="text-white/50 text-sm">Share the QR code to start collecting photos</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 md:gap-3">
                {photos.slice(0, 15).map((photo: { _id: string; url: string | null; guestName?: string }, i: number) => (
                  <motion.div
                    key={photo._id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.03 }}
                    className="aspect-square rounded-xl md:rounded-2xl overflow-hidden relative group"
                  >
                    {event.isRevealed && photo.url ? (
                      <>
                        <img
                          src={photo.url}
                          alt=""
                          className="w-full h-full object-cover"
                        />
                        <a
                          href={photo.url}
                          download
                          className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                        >
                          <Download className="w-6 h-6 text-white" />
                        </a>
                      </>
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-amber-500/20 to-rose-500/20 flex items-center justify-center">
                        <div className="text-2xl md:text-3xl opacity-50">?</div>
                      </div>
                    )}
                  </motion.div>
                ))}
                {photos.length > 15 && (
                  <div className="aspect-square rounded-xl md:rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
                    <span className="text-white/60 font-bold">+{photos.length - 15}</span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
