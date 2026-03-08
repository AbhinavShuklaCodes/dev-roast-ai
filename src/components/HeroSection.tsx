import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Flame, Sparkles } from "lucide-react";
import { Button } from "./ui/button";

const HeroSection = () => {
  const [username, setUsername] = useState("");
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
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px]" />
      <div className="absolute top-1/3 right-1/4 w-[300px] h-[300px] bg-glow-secondary/5 rounded-full blur-[100px]" />

      <div className="container relative mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-3xl"
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="mb-8 inline-flex items-center gap-2 rounded-full border border-glow bg-secondary px-4 py-1.5 text-sm"
          >
            <Sparkles className="h-3.5 w-3.5 text-primary" />
            <span className="text-muted-foreground">AI-Powered Developer Roasts</span>
          </motion.div>

          <h1 className="mb-6 text-5xl font-extrabold leading-[1.1] tracking-tight sm:text-6xl lg:text-7xl">
            Get Your GitHub{" "}
            <span className="text-gradient">Roasted by AI</span>
          </h1>

          <p className="mb-10 text-lg text-muted-foreground max-w-xl mx-auto leading-relaxed">
            Discover how strong your developer profile really is. Get a humorous roast, 
            a professional score, and actionable improvement tips.
          </p>

          {/* Input */}
          <form onSubmit={handleSubmit} id="roast-input" className="mx-auto max-w-lg">
            <div className="flex gap-3 rounded-xl border border-border bg-card p-2 shadow-card">
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter GitHub username..."
                className="flex-1 bg-transparent px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
              />
              <Button variant="hero" size="lg" type="submit" className="gap-2">
                <Flame className="h-4 w-4" />
                Roast Me
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </form>

          <p className="mt-4 text-xs text-muted-foreground">
            Free • No signup required • Results in seconds
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
