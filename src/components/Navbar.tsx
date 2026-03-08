import { Flame, Github } from "lucide-react";
import { Button } from "./ui/button";

const Navbar = () => {
  const scrollToInput = () => {
    document.getElementById("roast-input")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
      <div className="container mx-auto flex h-16 items-center justify-between px-6">
        <div className="flex items-center gap-2">
          <Flame className="h-6 w-6 text-primary" />
          <span className="text-lg font-bold tracking-tight">GitRoast AI</span>
        </div>
        <div className="hidden md:flex items-center gap-8">
          <a href="#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Features</a>
          <a href="#how-it-works" className="text-sm text-muted-foreground hover:text-foreground transition-colors">How it works</a>
          <a href="#pricing" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Pricing</a>
        </div>
        <Button variant="hero" size="sm" onClick={scrollToInput}>
          Roast My GitHub
        </Button>
      </div>
    </nav>
  );
};

export default Navbar;
