import { motion } from "framer-motion";
import { Flame, Quote } from "lucide-react";

const ExampleRoast = () => (
  <section className="relative py-32 border-t border-border/50">
    <div className="container mx-auto px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mx-auto max-w-2xl"
      >
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold sm:text-4xl mb-4">
            Example <span className="text-gradient">Roast</span>
          </h2>
          <p className="text-muted-foreground">Here's what a typical roast looks like.</p>
        </div>

        <div className="relative rounded-2xl border border-glow bg-card p-8 shadow-glow">
          <Quote className="absolute top-6 left-6 h-8 w-8 text-primary/20" />
          <div className="flex items-center gap-3 mb-6">
            <div className="h-10 w-10 rounded-full bg-gradient-primary flex items-center justify-center">
              <Flame className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <div className="font-semibold text-sm">GitRoast AI</div>
              <div className="text-xs text-muted-foreground">Roast Engine v2.0</div>
            </div>
          </div>
          <p className="text-foreground leading-relaxed italic font-mono text-sm">
            "Your GitHub has 32 repositories, but 20 of them are tutorial clones. 
            You've got more forks than a silverware drawer. Your commit messages read 
            like a diary of someone who discovers 'fix bug' is a valid sentence. 
            Time to stop watching YouTube tutorials and start shipping real products. 
            On the bright side, at least you're consistent — consistently mediocre."
          </p>
          <div className="mt-6 flex items-center gap-4">
            <div className="rounded-lg bg-secondary px-3 py-1.5 text-xs font-mono">
              Score: <span className="text-primary font-bold">42/100</span>
            </div>
            <div className="text-xs text-muted-foreground">— devuser123</div>
          </div>
        </div>
      </motion.div>
    </div>
  </section>
);

export default ExampleRoast;
