import { motion } from "framer-motion";
import { Camera, Users, Clock, Sparkles, Eye, Download } from "lucide-react";
import { Footer } from "./Footer";

interface Props {
  onNavigate: (page: "landing" | "auth" | "dashboard" | "pricing" | "camera" | "gallery" | "event", data?: string) => void;
  isAuthenticated: boolean;
}

export function LandingPage({ onNavigate, isAuthenticated }: Props) {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white overflow-hidden">
      {/* Grain overlay */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.03]" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
      }} />

      {/* Gradient orbs */}
      <div className="fixed top-0 left-1/4 w-[600px] h-[600px] bg-amber-500/10 rounded-full blur-[150px] -translate-y-1/2" />
      <div className="fixed bottom-0 right-1/4 w-[500px] h-[500px] bg-rose-500/10 rounded-full blur-[150px] translate-y-1/2" />

      {/* Navigation */}
      <nav className="relative z-10 flex items-center justify-between p-4 md:p-6 lg:p-8">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-2 md:gap-3"
        >
          <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-amber-400 to-rose-500 rounded-2xl flex items-center justify-center shadow-lg shadow-amber-500/20">
            <Camera className="w-5 h-5 md:w-6 md:h-6 text-black" />
          </div>
          <span className="text-xl md:text-2xl font-bold tracking-tight">flashback</span>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-2 md:gap-4"
        >
          <button
            onClick={() => onNavigate("pricing")}
            className="text-sm md:text-base text-white/70 hover:text-white transition-colors px-2 md:px-4 py-2"
          >
            Pricing
          </button>
          {isAuthenticated ? (
            <button
              onClick={() => onNavigate("dashboard")}
              className="bg-white text-black text-sm md:text-base px-4 md:px-6 py-2.5 rounded-full font-semibold hover:bg-amber-100 transition-colors"
            >
              Dashboard
            </button>
          ) : (
            <button
              onClick={() => onNavigate("auth")}
              className="bg-white text-black text-sm md:text-base px-4 md:px-6 py-2.5 rounded-full font-semibold hover:bg-amber-100 transition-colors"
            >
              Get Started
            </button>
          )}
        </motion.div>
      </nav>

      {/* Hero */}
      <main className="relative z-10 px-4 md:px-6 lg:px-8 pt-8 md:pt-16 lg:pt-24">
        <div className="max-w-6xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="inline-flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-4 md:px-5 py-2 md:py-2.5 mb-6 md:mb-8"
          >
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span className="text-xs md:text-sm text-white/80">The magic of waiting for your photos</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight leading-[0.95] mb-6 md:mb-8"
          >
            <span className="block">Digital disposable</span>
            <span className="block bg-gradient-to-r from-amber-300 via-rose-400 to-amber-300 bg-clip-text text-transparent">
              cameras for events
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-base md:text-xl text-white/60 max-w-2xl mx-auto mb-8 md:mb-12 leading-relaxed px-4"
          >
            Guests capture candid moments without seeing them. Photos stay hidden until you reveal them —
            bringing back the excitement of developing film.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-3 md:gap-4"
          >
            <button
              onClick={() => isAuthenticated ? onNavigate("dashboard") : onNavigate("auth")}
              className="w-full sm:w-auto bg-gradient-to-r from-amber-400 to-rose-500 text-black px-6 md:px-8 py-3.5 md:py-4 rounded-full font-bold text-base md:text-lg hover:shadow-lg hover:shadow-amber-500/25 transition-all hover:scale-105"
            >
              Create Your Event
            </button>
            <button
              onClick={() => onNavigate("pricing")}
              className="w-full sm:w-auto border border-white/20 text-white px-6 md:px-8 py-3.5 md:py-4 rounded-full font-semibold text-base md:text-lg hover:bg-white/5 transition-colors"
            >
              View Pricing
            </button>
          </motion.div>
        </div>

        {/* Feature cards */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="max-w-5xl mx-auto mt-16 md:mt-24 lg:mt-32 grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6"
        >
          {[
            {
              icon: Camera,
              title: "No App Required",
              description: "Guests scan a QR code and start snapping photos instantly from their browser",
              gradient: "from-amber-500/20 to-orange-500/20",
            },
            {
              icon: Eye,
              title: "Hidden Until Reveal",
              description: "Photos stay invisible until you choose to reveal them — instant, scheduled, or manual",
              gradient: "from-rose-500/20 to-pink-500/20",
            },
            {
              icon: Download,
              title: "Shared Gallery",
              description: "Once revealed, everyone can view and download the full collection of memories",
              gradient: "from-violet-500/20 to-purple-500/20",
            },
          ].map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 + i * 0.1 }}
              className={`relative bg-gradient-to-br ${feature.gradient} backdrop-blur-sm border border-white/10 rounded-3xl p-6 md:p-8 hover:border-white/20 transition-colors group`}
            >
              <div className="w-12 h-12 md:w-14 md:h-14 bg-white/10 rounded-2xl flex items-center justify-center mb-4 md:mb-6 group-hover:scale-110 transition-transform">
                <feature.icon className="w-6 h-6 md:w-7 md:h-7 text-white" />
              </div>
              <h3 className="text-lg md:text-xl font-bold mb-2 md:mb-3">{feature.title}</h3>
              <p className="text-sm md:text-base text-white/60 leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* How it works */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
          className="max-w-4xl mx-auto mt-24 md:mt-32 lg:mt-40 mb-16 md:mb-24"
        >
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-center mb-12 md:mb-16">How it works</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {[
              { step: "01", title: "Create Event", desc: "Set up your event in seconds", icon: Sparkles },
              { step: "02", title: "Share Link", desc: "Share QR code with guests", icon: Users },
              { step: "03", title: "Take Photos", desc: "Guests capture moments", icon: Camera },
              { step: "04", title: "Reveal", desc: "Unlock the gallery together", icon: Clock },
            ].map((item, i) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 + i * 0.1 }}
                className="text-center"
              >
                <div className="text-4xl md:text-5xl font-black text-white/10 mb-3 md:mb-4">{item.step}</div>
                <div className="w-14 h-14 md:w-16 md:h-16 mx-auto bg-gradient-to-br from-amber-400/20 to-rose-500/20 rounded-2xl flex items-center justify-center mb-3 md:mb-4">
                  <item.icon className="w-6 h-6 md:w-7 md:h-7 text-white/80" />
                </div>
                <h3 className="font-bold text-base md:text-lg mb-1 md:mb-2">{item.title}</h3>
                <p className="text-xs md:text-sm text-white/50">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
}
