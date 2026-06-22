import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { motion } from "framer-motion";
import { ArrowLeft, Download, Camera, Clock, Image } from "lucide-react";
import { Footer } from "./Footer";

interface Props {
  eventCode: string;
  onNavigate: (page: "landing" | "auth" | "dashboard" | "pricing" | "camera" | "gallery" | "event", data?: string) => void;
}

export function Gallery({ eventCode, onNavigate }: Props) {
  const event = useQuery(api.events.getByShareCode, { shareCode: eventCode });
  const photos = useQuery(api.photos.listForEvent, event ? { eventId: event._id } : "skip");

  if (event === undefined) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-amber-400/30 border-t-amber-400 rounded-full animate-spin" />
      </div>
    );
  }

  if (event === null) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col items-center justify-center p-4">
        <div className="text-5xl mb-4">🎭</div>
        <h1 className="text-2xl font-bold mb-2">Event Not Found</h1>
        <p className="text-white/60 mb-6">This event doesn't exist or the code is incorrect.</p>
        <button
          onClick={() => onNavigate("landing")}
          className="bg-white/10 hover:bg-white/20 px-6 py-3 rounded-full"
        >
          Go Home
        </button>
      </div>
    );
  }

  if (!event.isRevealed) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col">
        <div className="fixed inset-0 pointer-events-none opacity-[0.03]" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }} />

        <div className="flex-1 flex flex-col items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-md"
          >
            <div className="w-20 h-20 md:w-24 md:h-24 mx-auto bg-gradient-to-br from-amber-500/20 to-rose-500/20 rounded-3xl flex items-center justify-center mb-6">
              <Clock className="w-10 h-10 md:w-12 md:h-12 text-amber-400" />
            </div>
            <h1 className="text-2xl md:text-3xl font-bold mb-4">Photos Not Yet Revealed</h1>
            <p className="text-white/60 mb-2 text-sm md:text-base">
              The host hasn't revealed the photos yet.
            </p>
            <p className="text-white/40 mb-8 text-sm">
              Check back later or wait for the big reveal!
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={() => onNavigate("camera", eventCode)}
                className="bg-gradient-to-r from-amber-400 to-rose-500 text-black px-6 py-3 rounded-full font-bold flex items-center justify-center gap-2"
              >
                <Camera className="w-5 h-5" />
                Take Photos
              </button>
              <button
                onClick={() => onNavigate("landing")}
                className="bg-white/10 hover:bg-white/20 px-6 py-3 rounded-full font-semibold"
              >
                Go Home
              </button>
            </div>
          </motion.div>
        </div>

        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col">
      <div className="fixed inset-0 pointer-events-none opacity-[0.03]" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
      }} />

      {/* Header */}
      <header className="relative z-10 p-4 md:p-6 border-b border-white/5">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <button
            onClick={() => onNavigate("camera", eventCode)}
            className="flex items-center gap-2 text-white/60 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="hidden sm:inline">Back to Camera</span>
          </button>

          <div className="flex items-center gap-3">
            <span className="text-2xl">{event.coverEmoji}</span>
            <h1 className="text-lg md:text-xl font-bold truncate max-w-[150px] sm:max-w-none">{event.name}</h1>
          </div>

          <div className="w-20" /> {/* Spacer for centering */}
        </div>
      </header>

      <main className="relative z-10 flex-1 px-4 md:px-6 py-6 md:py-8">
        <div className="max-w-6xl mx-auto">
          {photos === undefined ? (
            <div className="flex items-center justify-center py-20">
              <div className="w-10 h-10 border-4 border-amber-400/30 border-t-amber-400 rounded-full animate-spin" />
            </div>
          ) : photos.length === 0 ? (
            <div className="text-center py-16 md:py-20">
              <div className="w-20 h-20 md:w-24 md:h-24 mx-auto bg-white/5 rounded-3xl flex items-center justify-center mb-6">
                <Image className="w-10 h-10 md:w-12 md:h-12 text-white/30" />
              </div>
              <h2 className="text-xl md:text-2xl font-bold mb-3">No photos yet</h2>
              <p className="text-white/50 mb-6 text-sm md:text-base">Be the first to capture a moment!</p>
              <button
                onClick={() => onNavigate("camera", eventCode)}
                className="bg-gradient-to-r from-amber-400 to-rose-500 text-black px-6 py-3 rounded-full font-bold flex items-center justify-center gap-2 mx-auto"
              >
                <Camera className="w-5 h-5" />
                Take Photos
              </button>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between mb-6">
                <p className="text-white/60 text-sm md:text-base">{photos.length} photos</p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 md:gap-3">
                {photos.map((photo: { _id: string; url: string | null; guestName?: string }, i: number) => (
                  <motion.div
                    key={photo._id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.02 }}
                    className="aspect-square rounded-xl md:rounded-2xl overflow-hidden relative group bg-white/5"
                  >
                    {photo.url ? (
                      <>
                        <img
                          src={photo.url}
                          alt=""
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 p-2">
                          {photo.guestName && (
                            <span className="text-xs text-white/80 text-center">{photo.guestName}</span>
                          )}
                          <a
                            href={photo.url}
                            download={`photo-${photo._id}.jpg`}
                            className="bg-white/20 hover:bg-white/30 p-2 rounded-full transition-colors"
                          >
                            <Download className="w-5 h-5" />
                          </a>
                        </div>
                      </>
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <div className="w-6 h-6 border-2 border-amber-400/30 border-t-amber-400 rounded-full animate-spin" />
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            </>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
