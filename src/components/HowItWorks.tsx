import { motion } from "framer-motion";
import { Link2, Cpu, Trophy } from "lucide-react";

const steps = [
  { icon: Link2, step: "01", title: "Paste your GitHub profile", description: "Enter your GitHub username or profile URL." },
  { icon: Cpu, step: "02", title: "AI analyzes your repos", description: "We fetch your data and run it through our AI engine." },
  { icon: Trophy, step: "03", title: "Get roasted & improve", description: "Receive your score, roast, and personalized improvement plan." },
];

const HowItWorks = () => (
  <section id="how-it-works" className="relative py-32 border-t border-border/50">
    <div className="container mx-auto px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.6 }}
        className="text-center mb-16"
      >
        <h2 className="text-3xl font-bold sm:text-4xl mb-4">
          How it <span className="text-gradient">works</span>
        </h2>
        <p className="text-muted-foreground">Three simple steps to your developer truth.</p>
      </motion.div>

      <div className="grid gap-8 md:grid-cols-3 max-w-4xl mx-auto">
        {steps.map((s, i) => (
          <motion.div
            key={s.step}
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ delay: i * 0.15, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            whileHover={{ y: -4, transition: { duration: 0.2 } }}
            className="relative text-center"
          >
            {/* Connector line */}
            {i < steps.length - 1 && (
              <motion.div
                className="hidden md:block absolute top-8 left-[calc(50%+40px)] w-[calc(100%-80px)] h-px bg-border"
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 + 0.4, duration: 0.6 }}
                style={{ originX: 0 }}
              />
            )}
            <motion.div
              className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-2xl border border-glow bg-secondary"
              whileHover={{
                borderColor: "hsl(150, 80%, 55%)",
                boxShadow: "0 0 20px -5px hsl(150, 80%, 55%, 0.3)",
                transition: { duration: 0.3 },
              }}
            >
              <s.icon className="h-7 w-7 text-primary" />
            </motion.div>
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 + 0.2 }}
              className="mb-2 text-xs font-mono text-primary"
            >
              {s.step}
            </motion.div>
            <h3 className="mb-2 text-lg font-semibold">{s.title}</h3>
            <p className="text-sm text-muted-foreground">{s.description}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default HowItWorks;
