import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { Button } from "./ui/button";

const plans = [
  {
    name: "Free",
    price: "$0",
    description: "Get roasted for free",
    features: ["Basic GitHub roast", "Developer score", "Top 3 strengths & weaknesses", "Share on social media"],
    cta: "Get Started",
    variant: "hero-outline" as const,
  },
  {
    name: "Pro",
    price: "$9",
    period: "/month",
    description: "Deep profile intelligence",
    features: ["Advanced AI analysis", "Full improvement roadmap", "Recommended project ideas", "Unlimited roasts", "Priority processing"],
    cta: "Upgrade to Pro",
    variant: "hero" as const,
    popular: true,
  },
];

const PricingSection = () => (
  <section id="pricing" className="relative py-32 border-t border-border/50">
    <div className="container mx-auto px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.6 }}
        className="text-center mb-16"
      >
        <h2 className="text-3xl font-bold sm:text-4xl mb-4">
          Simple <span className="text-gradient">pricing</span>
        </h2>
        <p className="text-muted-foreground">Start free. Upgrade when you need more.</p>
      </motion.div>

      <div className="grid gap-6 md:grid-cols-2 max-w-3xl mx-auto">
        {plans.map((plan, i) => (
          <motion.div
            key={plan.name}
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ delay: i * 0.12, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            whileHover={{
              y: -6,
              transition: { duration: 0.25 },
            }}
            className={`relative rounded-2xl border p-8 transition-[box-shadow] duration-300 ${
              plan.popular ? "border-glow shadow-glow bg-card hover:shadow-[0_0_60px_-10px_hsl(150,80%,55%,0.35)]" : "border-border bg-card hover:shadow-card"
            }`}
          >
            {plan.popular && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
                className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-gradient-primary px-4 py-1 text-xs font-semibold text-primary-foreground"
              >
                Most Popular
              </motion.div>
            )}
            <h3 className="text-xl font-bold mb-1">{plan.name}</h3>
            <p className="text-sm text-muted-foreground mb-4">{plan.description}</p>
            <div className="mb-6">
              <span className="text-4xl font-extrabold">{plan.price}</span>
              {plan.period && <span className="text-muted-foreground text-sm">{plan.period}</span>}
            </div>
            <ul className="mb-8 space-y-3">
              {plan.features.map((f, fi) => (
                <motion.li
                  key={f}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 + fi * 0.05 + 0.2 }}
                  className="flex items-center gap-2 text-sm"
                >
                  <Check className="h-4 w-4 text-primary shrink-0" />
                  <span className="text-secondary-foreground">{f}</span>
                </motion.li>
              ))}
            </ul>
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button variant={plan.variant} className="w-full" size="lg">
                {plan.cta}
              </Button>
            </motion.div>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default PricingSection;
