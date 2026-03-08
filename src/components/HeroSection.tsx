import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Flame, Sparkles } from "lucide-react";
import { Button } from "./ui/button";

const FloatingParticle = ({ delay, x, y, size }: { delay: number; x: string; y: string; size: number }) => (
  <motion.div
    className="absolute rounded-full bg-primary/20"
    style={{ left: x, top: y, width: size, height: size }}
    animate={{
      y: [0, -30, 0],
      opacity: [0.2, 0.5, 0.2],
      scale: [1, 1.2, 1],
    }}
    transition={{
      duration: 4 + Math.random() * 2,
      delay,
      repeat: Infinity,
      ease: "easeInOut",
    }}
  />
);

const HeroSection = () => {
  const [username, setUsername] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleaned = username.trim().replace(/^https?:\/\/(www\.)?github\.com\//, "").replace(/\/$/, "");
    if (cleaned) {
      navigate(`/roast/${cleaned}`);
    }
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
      {/* Background effects */}
      <div className="absolute inset-0 bg-grid opacity-30" />
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px]"
        animate={{ scale: [1, 1.1, 1], opacity: [0.04, 0.08, 0.04] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute top-1/3 right-1/4 w-[300px] h-[300px] bg-glow-secondary/5 rounded-full blur-[100px]"
        animate={{ scale: [1, 1.15, 1], opacity: [0.03, 0.07, 0.03] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
      />

      {/* Floating particles */}
      <FloatingParticle delay={0} x="15%" y="25%" size={6} />
      <FloatingParticle delay={1.2} x="80%" y="30%" size={4} />
      <FloatingParticle delay={0.6} x="60%" y="70%" size={5} />
      <FloatingParticle delay={2} x="25%" y="65%" size={3} />
      <FloatingParticle delay={1.5} x="75%" y="55%" size={7} />
      <FloatingParticle delay={0.8} x="40%" y="20%" size={4} />

      <div className="container relative mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto max-w-3xl"
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            whileHover={{ scale: 1.05 }}
            className="mb-8 inline-flex items-center gap-2 rounded-full border border-glow bg-secondary px-4 py-1.5 text-sm cursor-default"
          >
            <motion.div
              animate={{ rotate: [0, 15, -15, 0] }}
              transition={{ duration: 3, repeat: Infinity, repeatDelay: 2 }}
            >
              <Sparkles className="h-3.5 w-3.5 text-primary" />
            </motion.div>
            <span className="text-muted-foreground">AI-Powered Developer Roasts</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="mb-6 text-5xl font-extrabold leading-[1.1] tracking-tight sm:text-6xl lg:text-7xl"
          >
            Get Your GitHub{" "}
            <motion.span
              className="text-gradient inline-block"
              animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
              transition={{ duration: 5, repeat: Infinity }}
            >
              Roasted by AI
            </motion.span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45, duration: 0.5 }}
            className="mb-10 text-lg text-muted-foreground max-w-xl mx-auto leading-relaxed"
          >
            Discover how strong your developer profile really is. Get a humorous roast, 
            a professional score, and actionable improvement tips.
          </motion.p>

          {/* Input */}
          <motion.form
            onSubmit={handleSubmit}
            id="roast-input"
            className="mx-auto max-w-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55, duration: 0.5 }}
          >
            <motion.div
              animate={isFocused ? { borderColor: "hsl(150, 80%, 55%)", boxShadow: "0 0 30px -8px hsl(150, 80%, 55%, 0.25)" } : {}}
              className="flex gap-3 rounded-xl border border-border bg-card p-2 shadow-card transition-all duration-300"
            >
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                placeholder="Enter GitHub username..."
                className="flex-1 bg-transparent px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
              />
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                <Button variant="hero" size="lg" type="submit" className="gap-2">
                  <Flame className="h-4 w-4" />
                  Roast Me
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </motion.div>
            </motion.div>
          </motion.form>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="mt-4 text-xs text-muted-foreground"
          >
            Free • No signup required • Results in seconds
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
