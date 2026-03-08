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

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.12, duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  }),
};

const FeaturesSection = () => (
  <section id="features" className="relative py-32">
    <div className="container mx-auto px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.6 }}
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
            custom={i}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-40px" }}
            variants={cardVariants}
            whileHover={{ y: -6, transition: { duration: 0.25 } }}
            className="group rounded-xl border border-border bg-card p-6 shadow-card hover:border-glow hover:shadow-glow transition-[border-color,box-shadow] duration-300 cursor-default"
          >
            <motion.div
              className="mb-4 inline-flex rounded-lg bg-gradient-primary p-2.5"
              whileHover={{ rotate: [0, -10, 10, 0], transition: { duration: 0.4 } }}
            >
              <feature.icon className="h-5 w-5 text-primary-foreground" />
            </motion.div>
            <h3 className="mb-2 text-lg font-semibold group-hover:text-primary transition-colors duration-300">{feature.title}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default FeaturesSection;
