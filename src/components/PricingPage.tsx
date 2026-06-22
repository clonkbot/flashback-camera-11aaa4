import { motion } from "framer-motion";
import { ArrowLeft, Check, Sparkles, Camera } from "lucide-react";
import { Footer } from "./Footer";

interface Props {
  onNavigate: (page: "landing" | "auth" | "dashboard" | "pricing" | "camera" | "gallery" | "event", data?: string) => void;
  isAuthenticated: boolean;
}

const plans = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    description: "Perfect for small gatherings",
    features: [
      "1 active event",
      "Up to 50 total photos",
      "10 photos per guest",
      "Basic gallery",
      "QR code sharing",
    ],
    cta: "Get Started",
    popular: false,
    gradient: "from-white/10 to-white/5",
  },
  {
    name: "Starter",
    price: "$19",
    period: "per event",
    description: "Great for parties & birthdays",
    features: [
      "Unlimited events",
      "Up to 500 total photos",
      "25 photos per guest",
      "HD photo quality",
      "Custom branding",
      "Priority support",
    ],
    cta: "Choose Starter",
    popular: true,
    gradient: "from-amber-500/20 to-rose-500/20",
  },
  {
    name: "Pro",
    price: "$49",
    period: "per event",
    description: "Perfect for weddings & big events",
    features: [
      "Unlimited events",
      "Up to 2,000 total photos",
      "50 photos per guest",
      "4K photo quality",
      "Custom branding",
      "Video messages",
      "Bulk download",
      "Dedicated support",
    ],
    cta: "Choose Pro",
    popular: false,
    gradient: "from-violet-500/20 to-purple-500/20",
  },
];

export function PricingPage({ onNavigate, isAuthenticated }: Props) {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col">
      {/* Grain overlay */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.03]" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
      }} />

      {/* Gradient orbs */}
      <div className="fixed top-0 right-1/4 w-[500px] h-[500px] bg-amber-500/10 rounded-full blur-[150px] -translate-y-1/2" />
      <div className="fixed bottom-0 left-1/4 w-[400px] h-[400px] bg-rose-500/10 rounded-full blur-[150px] translate-y-1/2" />

      {/* Header */}
      <header className="relative z-10 p-4 md:p-6 lg:p-8">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <button
            onClick={() => onNavigate("landing")}
            className="flex items-center gap-2 text-white/60 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="hidden sm:inline">Back</span>
          </button>

          <div className="flex items-center gap-2 md:gap-3">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-amber-400 to-rose-500 rounded-2xl flex items-center justify-center shadow-lg shadow-amber-500/20">
              <Camera className="w-5 h-5 md:w-6 md:h-6 text-black" />
            </div>
            <span className="text-xl md:text-2xl font-bold tracking-tight">flashback</span>
          </div>

          <div className="w-20" /> {/* Spacer */}
        </div>
      </header>

      <main className="relative z-10 flex-1 px-4 md:px-6 lg:px-8 py-8 md:py-12 lg:py-16">
        <div className="max-w-6xl mx-auto">
          {/* Hero */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12 md:mb-16"
          >
            <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-4 py-2 mb-6">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span className="text-sm text-white/80">Simple, transparent pricing</span>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-4">
              Choose your plan
            </h1>
            <p className="text-base md:text-lg text-white/60 max-w-xl mx-auto">
              Start free and scale as you grow. No hidden fees, no surprises.
            </p>
          </motion.div>

          {/* Pricing cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
            {plans.map((plan, i) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + i * 0.1 }}
                className={`relative bg-gradient-to-br ${plan.gradient} backdrop-blur-sm border rounded-3xl p-6 md:p-8 ${
                  plan.popular ? "border-amber-400/50 ring-2 ring-amber-400/20" : "border-white/10"
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="bg-gradient-to-r from-amber-400 to-rose-500 text-black text-xs font-bold px-4 py-1.5 rounded-full">
                      Most Popular
                    </span>
                  </div>
                )}

                <div className="mb-6">
                  <h3 className="text-xl md:text-2xl font-bold mb-2">{plan.name}</h3>
                  <p className="text-white/50 text-sm">{plan.description}</p>
                </div>

                <div className="mb-6">
                  <span className="text-4xl md:text-5xl font-black">{plan.price}</span>
                  <span className="text-white/50 ml-2 text-sm">{plan.period}</span>
                </div>

                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3">
                      <div className="w-5 h-5 bg-emerald-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Check className="w-3 h-3 text-emerald-400" />
                      </div>
                      <span className="text-white/80 text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => isAuthenticated ? onNavigate("dashboard") : onNavigate("auth")}
                  className={`w-full py-3.5 rounded-xl font-bold transition-all text-sm md:text-base ${
                    plan.popular
                      ? "bg-gradient-to-r from-amber-400 to-rose-500 text-black hover:shadow-lg hover:shadow-amber-500/25 hover:scale-[1.02]"
                      : "bg-white/10 hover:bg-white/20 text-white"
                  }`}
                >
                  {plan.cta}
                </button>
              </motion.div>
            ))}
          </div>

          {/* FAQ teaser */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-center mt-12 md:mt-16"
          >
            <p className="text-white/40 text-sm">
              Questions? Reach out to support@flashback.camera
            </p>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
