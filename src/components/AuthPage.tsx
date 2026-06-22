import { useState } from "react";
import { useAuthActions } from "@convex-dev/auth/react";
import { motion } from "framer-motion";
import { Camera, ArrowLeft, Mail, Lock, Loader2 } from "lucide-react";
import { Footer } from "./Footer";

interface Props {
  onNavigate: (page: "landing" | "auth" | "dashboard" | "pricing" | "camera" | "gallery" | "event", data?: string) => void;
}

export function AuthPage({ onNavigate }: Props) {
  const { signIn } = useAuthActions();
  const [flow, setFlow] = useState<"signIn" | "signUp">("signUp");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);

    try {
      await signIn("password", formData);
      onNavigate("dashboard");
    } catch (err) {
      setError(flow === "signIn" ? "Invalid email or password" : "Could not create account. Try a different email.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col">
      {/* Grain overlay */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.03]" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
      }} />

      {/* Gradient orb */}
      <div className="fixed top-1/3 left-1/2 w-[500px] h-[500px] bg-amber-500/15 rounded-full blur-[150px] -translate-x-1/2 -translate-y-1/2" />

      <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-4 py-8 md:py-12">
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => onNavigate("landing")}
          className="absolute top-4 md:top-8 left-4 md:left-8 flex items-center gap-2 text-white/60 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="hidden sm:inline">Back</span>
        </motion.button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          {/* Logo */}
          <div className="flex flex-col items-center mb-8 md:mb-10">
            <div className="w-14 h-14 md:w-16 md:h-16 bg-gradient-to-br from-amber-400 to-rose-500 rounded-2xl flex items-center justify-center shadow-lg shadow-amber-500/20 mb-4 md:mb-6">
              <Camera className="w-7 h-7 md:w-8 md:h-8 text-black" />
            </div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
              {flow === "signIn" ? "Welcome back" : "Create your account"}
            </h1>
            <p className="text-white/50 mt-2 text-sm md:text-base">
              {flow === "signIn" ? "Sign in to manage your events" : "Start creating memorable events"}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
              <input
                name="email"
                type="email"
                placeholder="Email address"
                required
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-12 py-4 text-white placeholder:text-white/40 focus:outline-none focus:border-amber-400/50 focus:ring-2 focus:ring-amber-400/20 transition-all"
              />
            </div>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
              <input
                name="password"
                type="password"
                placeholder="Password"
                required
                minLength={6}
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-12 py-4 text-white placeholder:text-white/40 focus:outline-none focus:border-amber-400/50 focus:ring-2 focus:ring-amber-400/20 transition-all"
              />
            </div>
            <input name="flow" type="hidden" value={flow} />

            {error && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-rose-400 text-sm text-center bg-rose-500/10 border border-rose-500/20 rounded-xl py-3 px-4"
              >
                {error}
              </motion.p>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-amber-400 to-rose-500 text-black py-4 rounded-2xl font-bold text-lg hover:shadow-lg hover:shadow-amber-500/25 transition-all hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  {flow === "signIn" ? "Signing in..." : "Creating account..."}
                </>
              ) : (
                flow === "signIn" ? "Sign In" : "Create Account"
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => setFlow(flow === "signIn" ? "signUp" : "signIn")}
              className="text-white/60 hover:text-white transition-colors text-sm"
            >
              {flow === "signIn" ? "Don't have an account? " : "Already have an account? "}
              <span className="text-amber-400 font-semibold">
                {flow === "signIn" ? "Sign up" : "Sign in"}
              </span>
            </button>
          </div>
        </motion.div>
      </div>

      <Footer />
    </div>
  );
}
