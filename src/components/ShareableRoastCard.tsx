import { useRef, useState } from "react";
import html2canvas from "html2canvas";
import { Download, Share2, Twitter, Linkedin, Flame } from "lucide-react";
import { Button } from "./ui/button";
import { toast } from "sonner";

interface ShareableRoastCardProps {
  username: string;
  name: string;
  avatarUrl: string;
  roast: string;
  overallScore: number;
  scores: {
    codeQuality: number;
    projectOriginality: number;
    consistency: number;
    documentation: number;
  };
}

const ScoreBar = ({ label, score }: { label: string; score: number }) => {
  const color = score >= 70 ? "#4ade80" : score >= 40 ? "#facc15" : "#f87171";
  return (
    <div className="flex items-center gap-3">
      <span style={{ color: "#94a3b8", fontSize: 11, width: 90, flexShrink: 0 }}>{label}</span>
      <div style={{ flex: 1, height: 6, background: "#1e293b", borderRadius: 3 }}>
        <div style={{ width: `${score}%`, height: "100%", background: color, borderRadius: 3 }} />
      </div>
      <span style={{ color: "#e2e8f0", fontSize: 12, fontWeight: 600, width: 28, textAlign: "right" }}>{score}</span>
    </div>
  );
};

const ShareableRoastCard = ({
  username,
  name,
  avatarUrl,
  roast,
  overallScore,
  scores,
}: ShareableRoastCardProps) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const generateImage = async (): Promise<HTMLCanvasElement | null> => {
    if (!cardRef.current) return null;
    setIsGenerating(true);
    try {
      const canvas = await html2canvas(cardRef.current, {
        backgroundColor: null,
        scale: 2,
        useCORS: true,
        logging: false,
      });
      return canvas;
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = async () => {
    const canvas = await generateImage();
    if (!canvas) return;
    const link = document.createElement("a");
    link.download = `gitroast-${username}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
    toast.success("Roast card downloaded!");
  };

  const handleShareTwitter = () => {
    const text = encodeURIComponent(
      `I just got roasted by GitRoast AI! 🔥\n\nMy GitHub Score: ${overallScore}/100\n\nGet yours at`
    );
    const url = encodeURIComponent(window.location.href);
    window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`, "_blank");
  };

  const handleShareLinkedIn = () => {
    const url = encodeURIComponent(window.location.href);
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${url}`, "_blank");
  };

  const scoreColor = overallScore >= 70 ? "#4ade80" : overallScore >= 40 ? "#facc15" : "#f87171";

  return (
    <div>
      {/* The card to capture */}
      <div
        ref={cardRef}
        style={{
          width: 560,
          padding: 40,
          background: "linear-gradient(145deg, #0a0f1a 0%, #111827 50%, #0f172a 100%)",
          borderRadius: 20,
          fontFamily: "'Inter', system-ui, sans-serif",
          color: "#e2e8f0",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Decorative glow */}
        <div
          style={{
            position: "absolute",
            top: -60,
            right: -60,
            width: 200,
            height: 200,
            background: "radial-gradient(circle, rgba(74, 222, 128, 0.12) 0%, transparent 70%)",
            borderRadius: "50%",
          }}
        />

        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 20 }}>🔥</span>
            <span style={{ fontWeight: 700, fontSize: 16, letterSpacing: "-0.02em" }}>GitRoast AI</span>
          </div>
          <span style={{ color: "#64748b", fontSize: 11 }}>gitroast.ai</span>
        </div>

        {/* Profile */}
        <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 24 }}>
          <img
            src={avatarUrl}
            alt={username}
            crossOrigin="anonymous"
            style={{ width: 48, height: 48, borderRadius: "50%", border: "2px solid #1e293b" }}
          />
          <div>
            <div style={{ fontWeight: 700, fontSize: 16 }}>{name}</div>
            <div style={{ color: "#64748b", fontSize: 13 }}>@{username}</div>
          </div>
          <div style={{ marginLeft: "auto", textAlign: "center" }}>
            <div style={{ fontSize: 32, fontWeight: 800, color: scoreColor, lineHeight: 1 }}>{overallScore}</div>
            <div style={{ color: "#64748b", fontSize: 10, marginTop: 2 }}>/ 100</div>
          </div>
        </div>

        {/* Roast text */}
        <div
          style={{
            background: "rgba(30, 41, 59, 0.6)",
            borderRadius: 12,
            padding: "16px 18px",
            marginBottom: 24,
            borderLeft: "3px solid #4ade80",
          }}
        >
          <p
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 12,
              lineHeight: 1.7,
              color: "#cbd5e1",
              fontStyle: "italic",
              margin: 0,
            }}
          >
            "{roast.length > 280 ? roast.slice(0, 277) + "..." : roast}"
          </p>
        </div>

        {/* Score bars */}
        <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 20 }}>
          <ScoreBar label="Code Quality" score={scores.codeQuality} />
          <ScoreBar label="Originality" score={scores.projectOriginality} />
          <ScoreBar label="Consistency" score={scores.consistency} />
          <ScoreBar label="Documentation" score={scores.documentation} />
        </div>

        {/* Footer */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ color: "#475569", fontSize: 10, fontStyle: "italic" }}>
            "Because every developer deserves the truth."
          </span>
          <span style={{ color: "#475569", fontSize: 10 }}>by BrandNest</span>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex flex-wrap items-center gap-3 mt-6">
        <Button variant="hero" size="sm" onClick={handleDownload} disabled={isGenerating} className="gap-2">
          <Download className="h-4 w-4" />
          Download Card
        </Button>
        <Button variant="hero-outline" size="sm" onClick={handleShareTwitter} className="gap-2">
          <Twitter className="h-4 w-4" />
          Share on X
        </Button>
        <Button variant="hero-outline" size="sm" onClick={handleShareLinkedIn} className="gap-2">
          <Linkedin className="h-4 w-4" />
          Share on LinkedIn
        </Button>
      </div>
    </div>
  );
};

export default ShareableRoastCard;
