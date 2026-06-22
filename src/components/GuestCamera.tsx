import { useState, useRef, useEffect, useCallback } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { motion, AnimatePresence } from "framer-motion";
import { Camera, Image, RefreshCw, X, Zap, Sparkles } from "lucide-react";
import { Footer } from "./Footer";

interface Props {
  eventCode: string;
  onNavigate: (page: "landing" | "auth" | "dashboard" | "pricing" | "camera" | "gallery" | "event", data?: string) => void;
}

function getOrCreateGuestId(): string {
  const key = "flashback_guest_id";
  let id = localStorage.getItem(key);
  if (!id) {
    id = `guest_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
    localStorage.setItem(key, id);
  }
  return id;
}

export function GuestCamera({ eventCode, onNavigate }: Props) {
  const event = useQuery(api.events.getByShareCode, { shareCode: eventCode });
  const guestId = getOrCreateGuestId();
  const guestInfo = useQuery(api.photos.getGuestInfo, event ? { guestId, eventId: event._id } : "skip");
  const generateUploadUrl = useMutation(api.photos.generateUploadUrl);
  const savePhoto = useMutation(api.photos.savePhoto);

  const [stream, setStream] = useState<MediaStream | null>(null);
  const [facingMode, setFacingMode] = useState<"user" | "environment">("environment");
  const [capturing, setCapturing] = useState(false);
  const [showFlash, setShowFlash] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [guestName, setGuestName] = useState("");
  const [showNamePrompt, setShowNamePrompt] = useState(true);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const startCamera = useCallback(async () => {
    try {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }

      const newStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode, width: { ideal: 1920 }, height: { ideal: 1080 } },
        audio: false,
      });

      setStream(newStream);
      if (videoRef.current) {
        videoRef.current.srcObject = newStream;
      }
      setError(null);
    } catch (err) {
      setError("Camera access denied. Please allow camera permissions.");
    }
  }, [facingMode, stream]);

  useEffect(() => {
    if (!showNamePrompt) {
      startCamera();
    }
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [showNamePrompt, facingMode]);

  const switchCamera = () => {
    setFacingMode(prev => prev === "user" ? "environment" : "user");
  };

  const capturePhoto = async () => {
    if (!videoRef.current || !canvasRef.current || !event || capturing) return;
    if (guestInfo && guestInfo.photosTaken >= guestInfo.maxPhotos) return;

    setCapturing(true);
    setShowFlash(true);

    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.drawImage(video, 0, 0);
    }

    setTimeout(() => setShowFlash(false), 200);

    try {
      const blob = await new Promise<Blob>((resolve, reject) => {
        canvas.toBlob((b) => {
          if (b) resolve(b);
          else reject(new Error("Failed to capture photo"));
        }, "image/jpeg", 0.9);
      });

      const uploadUrl = await generateUploadUrl();
      const result = await fetch(uploadUrl, {
        method: "POST",
        headers: { "Content-Type": blob.type },
        body: blob,
      });

      const { storageId } = await result.json();
      await savePhoto({
        eventId: event._id,
        guestId,
        storageId,
        guestName: guestName || undefined,
      });

      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 2000);
    } catch (err) {
      setError("Failed to save photo. Please try again.");
    } finally {
      setCapturing(false);
    }
  };

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
        <p className="text-white/60 mb-6 text-center">This event doesn't exist or the code is incorrect.</p>
        <button
          onClick={() => onNavigate("landing")}
          className="bg-white/10 hover:bg-white/20 px-6 py-3 rounded-full"
        >
          Go Home
        </button>
      </div>
    );
  }

  const photosRemaining = guestInfo ? guestInfo.maxPhotos - guestInfo.photosTaken : event.photoLimit;

  // Name prompt
  if (showNamePrompt) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col">
        <div className="fixed inset-0 pointer-events-none opacity-[0.03]" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }} />

        <div className="flex-1 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-sm text-center"
          >
            <div className="text-6xl mb-4">{event.coverEmoji}</div>
            <h1 className="text-2xl md:text-3xl font-bold mb-2">{event.name}</h1>
            <p className="text-white/60 mb-8 text-sm md:text-base">You have {photosRemaining} photos to take</p>

            <input
              type="text"
              value={guestName}
              onChange={(e) => setGuestName(e.target.value)}
              placeholder="Your name (optional)"
              className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white placeholder:text-white/40 focus:outline-none focus:border-amber-400/50 mb-4 text-center text-lg"
            />

            <button
              onClick={() => setShowNamePrompt(false)}
              className="w-full bg-gradient-to-r from-amber-400 to-rose-500 text-black py-4 rounded-2xl font-bold text-lg hover:shadow-lg hover:shadow-amber-500/25 transition-all flex items-center justify-center gap-2"
            >
              <Camera className="w-5 h-5" />
              Open Camera
            </button>

            {event.isRevealed && (
              <button
                onClick={() => onNavigate("gallery", eventCode)}
                className="w-full mt-3 bg-white/10 hover:bg-white/20 text-white py-3 rounded-xl font-semibold transition-colors flex items-center justify-center gap-2"
              >
                <Image className="w-5 h-5" />
                View Gallery
              </button>
            )}
          </motion.div>
        </div>

        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      {/* Hidden canvas for capture */}
      <canvas ref={canvasRef} className="hidden" />

      {/* Camera view */}
      <div className="flex-1 relative overflow-hidden">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="absolute inset-0 w-full h-full object-cover"
        />

        {/* Flash effect */}
        <AnimatePresence>
          {showFlash && (
            <motion.div
              initial={{ opacity: 1 }}
              animate={{ opacity: 0 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-white z-50"
            />
          )}
        </AnimatePresence>

        {/* Success overlay */}
        <AnimatePresence>
          {showSuccess && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="absolute inset-0 flex items-center justify-center z-40 bg-black/50"
            >
              <div className="bg-gradient-to-br from-amber-400 to-rose-500 rounded-full p-6">
                <Sparkles className="w-12 h-12 text-black" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Top bar */}
        <div className="absolute top-0 left-0 right-0 p-4 flex items-center justify-between z-30 bg-gradient-to-b from-black/50 to-transparent">
          <button
            onClick={() => onNavigate("landing")}
            className="p-2 bg-black/30 backdrop-blur-sm rounded-full"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="bg-black/30 backdrop-blur-sm rounded-full px-4 py-2 flex items-center gap-2">
            <Zap className="w-4 h-4 text-amber-400" />
            <span className="font-bold">{photosRemaining}</span>
            <span className="text-white/60 text-sm">left</span>
          </div>

          <button
            onClick={switchCamera}
            className="p-2 bg-black/30 backdrop-blur-sm rounded-full"
          >
            <RefreshCw className="w-5 h-5" />
          </button>
        </div>

        {/* Error message */}
        {error && (
          <div className="absolute top-20 left-4 right-4 bg-rose-500/90 backdrop-blur-sm rounded-xl p-4 z-30 text-center">
            {error}
          </div>
        )}

        {/* Bottom controls */}
        <div className="absolute bottom-0 left-0 right-0 p-6 pb-8 z-30 bg-gradient-to-t from-black/70 to-transparent">
          <div className="flex items-center justify-center gap-8">
            {event.isRevealed && (
              <button
                onClick={() => onNavigate("gallery", eventCode)}
                className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center"
              >
                <Image className="w-6 h-6" />
              </button>
            )}

            <button
              onClick={capturePhoto}
              disabled={capturing || photosRemaining <= 0}
              className="w-20 h-20 bg-white rounded-full flex items-center justify-center disabled:opacity-50 disabled:scale-95 transition-all hover:scale-105 active:scale-95 shadow-lg shadow-white/20"
            >
              <div className="w-16 h-16 border-4 border-black/20 rounded-full flex items-center justify-center">
                <Camera className="w-7 h-7 text-black" />
              </div>
            </button>

            {event.isRevealed ? (
              <div className="w-14 h-14" /> // Spacer for symmetry
            ) : (
              <div className="w-14 h-14 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center">
                <span className="text-xs text-white/60 text-center leading-tight">
                  Photos<br />hidden
                </span>
              </div>
            )}
          </div>

          {photosRemaining <= 0 && (
            <p className="text-center mt-4 text-amber-400 text-sm">
              You've used all your photos!
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
