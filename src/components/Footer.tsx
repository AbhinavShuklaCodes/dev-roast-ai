import { Flame, Github, Twitter } from "lucide-react";

const Footer = () => (
  <footer className="border-t border-border/50 py-12">
    <div className="container mx-auto px-6">
      <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
        <div className="flex items-center gap-2">
          <Flame className="h-5 w-5 text-primary" />
          <span className="font-bold">GitRoast AI</span>
          <span className="text-sm text-muted-foreground">by BrandNest</span>
        </div>
        <p className="text-sm text-muted-foreground italic">
          "Because every developer deserves the truth."
        </p>
        <div className="flex items-center gap-4">
          <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground transition-colors">
            <Github className="h-5 w-5" />
          </a>
          <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground transition-colors">
            <Twitter className="h-5 w-5" />
          </a>
        </div>
      </div>
      <div className="mt-8 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} BrandNest. All rights reserved.
      </div>
    </div>
  </footer>
);

export default Footer;
