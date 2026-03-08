import { motion } from "framer-motion";
import { Brain, BarChart3, Target, Lightbulb } from "lucide-react";

const features = [
  {
    icon: Brain,
    title: "AI Profile Analysis",
    description: "Deep analysis of your repos, languages, commit patterns, and overall profile strength.",
  },
  {
    icon: BarChart3,
    title: "Developer Score Dashboard",
    description: "Visual scoring across code quality, originality, consistency, and documentation.",
  },
  {
    icon: Target,
    title: "Developer Roast Engine",
    description: "Witty, playful roasts that highlight what's great and what needs work.",
  },
  {
    icon: Lightbulb,
    title: "Improvement Roadmap",
    description: "Actionable suggestions with recommended project ideas to level up your profile.",
  },
];

const FeaturesSection = () => (
  <section id="features" className="relative py-32">
    <div className="container mx-auto px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-16"
      >
        <h2 className="text-3xl font-bold sm:text-4xl mb-4">
          Everything you need to <span className="text-gradient">level up</span>
        </h2>
        <p className="text-muted-foreground max-w-lg mx-auto">
          More than just a roast — a complete developer profile analysis toolkit.
        </p>
      </motion.div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {features.map((feature, i) => (
          <motion.div
            key={feature.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="group rounded-xl border border-border bg-card p-6 shadow-card hover:border-glow transition-colors"
          >
            <div className="mb-4 inline-flex rounded-lg bg-gradient-primary p-2.5">
              <feature.icon className="h-5 w-5 text-primary-foreground" />
            </div>
            <h3 className="mb-2 text-lg font-semibold">{feature.title}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default FeaturesSection;
