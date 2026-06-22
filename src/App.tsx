import { useConvexAuth } from "convex/react";
import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { LandingPage } from "./components/LandingPage";
import { AuthPage } from "./components/AuthPage";
import { Dashboard } from "./components/Dashboard";
import { GuestCamera } from "./components/GuestCamera";
import { Gallery } from "./components/Gallery";
import { PricingPage } from "./components/PricingPage";
import { EventDetail } from "./components/EventDetail";

type Page = "landing" | "auth" | "dashboard" | "pricing" | "camera" | "gallery" | "event";

export default function App() {
  const { isAuthenticated, isLoading } = useConvexAuth();
  const [page, setPage] = useState<Page>("landing");
  const [eventCode, setEventCode] = useState<string | null>(null);
  const [eventId, setEventId] = useState<string | null>(null);

  useEffect(() => {
    const path = window.location.pathname;
    const hash = window.location.hash;

    if (path.startsWith("/e/")) {
      const code = path.split("/e/")[1]?.split("/")[0];
      if (code) {
        setEventCode(code.toUpperCase());
        if (path.includes("/gallery")) {
          setPage("gallery");
        } else {
          setPage("camera");
        }
      }
    } else if (hash === "#pricing") {
      setPage("pricing");
    } else if (hash === "#auth") {
      setPage("auth");
    } else if (hash === "#dashboard") {
      if (isAuthenticated) setPage("dashboard");
      else setPage("auth");
    } else if (hash.startsWith("#event/")) {
      const id = hash.split("#event/")[1];
      if (id) {
        setEventId(id);
        setPage("event");
      }
    }
  }, [isAuthenticated]);

  const navigate = (newPage: Page, data?: string) => {
    if (newPage === "camera" && data) {
      setEventCode(data);
      window.history.pushState({}, "", `/e/${data}`);
    } else if (newPage === "gallery" && data) {
      setEventCode(data);
      window.history.pushState({}, "", `/e/${data}/gallery`);
    } else if (newPage === "event" && data) {
      setEventId(data);
      window.history.pushState({}, "", `#event/${data}`);
    } else if (newPage === "pricing") {
      window.history.pushState({}, "", "#pricing");
    } else if (newPage === "auth") {
      window.history.pushState({}, "", "#auth");
    } else if (newPage === "dashboard") {
      window.history.pushState({}, "", "#dashboard");
    } else if (newPage === "landing") {
      window.history.pushState({}, "", "/");
    }
    setPage(newPage);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center gap-4"
        >
          <div className="w-16 h-16 border-4 border-amber-400/30 border-t-amber-400 rounded-full animate-spin" />
          <p className="text-amber-200/60 font-medium tracking-wide">Loading...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <AnimatePresence mode="wait">
      {page === "landing" && (
        <motion.div
          key="landing"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <LandingPage
            onNavigate={navigate}
            isAuthenticated={isAuthenticated}
          />
        </motion.div>
      )}
      {page === "auth" && (
        <motion.div
          key="auth"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <AuthPage onNavigate={navigate} />
        </motion.div>
      )}
      {page === "dashboard" && isAuthenticated && (
        <motion.div
          key="dashboard"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <Dashboard onNavigate={navigate} />
        </motion.div>
      )}
      {page === "pricing" && (
        <motion.div
          key="pricing"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <PricingPage onNavigate={navigate} isAuthenticated={isAuthenticated} />
        </motion.div>
      )}
      {page === "camera" && eventCode && (
        <motion.div
          key="camera"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <GuestCamera eventCode={eventCode} onNavigate={navigate} />
        </motion.div>
      )}
      {page === "gallery" && eventCode && (
        <motion.div
          key="gallery"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <Gallery eventCode={eventCode} onNavigate={navigate} />
        </motion.div>
      )}
      {page === "event" && eventId && isAuthenticated && (
        <motion.div
          key="event"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <EventDetail eventId={eventId} onNavigate={navigate} />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
