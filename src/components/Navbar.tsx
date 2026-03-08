import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { Flame, Trophy } from "lucide-react";
import { Button } from "./ui/button";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollToInput = () => {
    if (location.pathname !== "/") {
      navigate("/");
      return;
    }
    document.getElementById("roast-input")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className={`fixed top-0 left-0 right-0 z-50 border-b transition-all duration-300 ${
        scrolled
          ? "border-border/50 bg-background/90 backdrop-blur-xl shadow-card"
          : "border-transparent bg-transparent"
      }`}
    >
      <div className="container mx-auto flex h-16 items-center justify-between px-6">
        <motion.button
          onClick={() => navigate("/")}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          className="flex items-center gap-2"
        >
          <motion.div
            animate={{ rotate: [0, -8, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity, repeatDelay: 4 }}
          >
            <Flame className="h-6 w-6 text-primary" />
          </motion.div>
          <span className="text-lg font-bold tracking-tight">GitRoast AI</span>
        </motion.button>

        <div className="hidden md:flex items-center gap-8">
          {[
            { label: "Features", href: "#features" },
            { label: "How it works", href: "#how-it-works" },
            
          ].map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="relative text-sm text-muted-foreground hover:text-foreground transition-colors group"
            >
              {link.label}
              <span className="absolute -bottom-1 left-0 h-px w-0 bg-primary transition-all duration-300 group-hover:w-full" />
            </a>
          ))}
          <button
            onClick={() => navigate("/leaderboard")}
            className="relative text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1.5 group"
          >
            <Trophy className="h-3.5 w-3.5" />
            Leaderboard
            <span className="absolute -bottom-1 left-0 h-px w-0 bg-primary transition-all duration-300 group-hover:w-full" />
          </button>
        </div>

        <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}>
          <Button variant="hero" size="sm" onClick={scrollToInput}>
            Roast My GitHub
          </Button>
        </motion.div>
      </div>
    </motion.nav>
  );
};

export default Navbar;
