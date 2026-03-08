import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Flame, Star, TrendingUp, AlertTriangle, Lightbulb, FolderGit2, Loader2, Volume2, Square, Loader } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface RoastResult {
  roast: string;
  overallScore: number;
  scores: {
    codeQuality: number;
    projectOriginality: number;
    consistency: number;
    documentation: number;
  };
  strengths: string[];
  weaknesses: string[];
  suggestions: string[];
  projectIdeas: string[];
}

interface GitHubData {
  login: string;
  name: string;
  avatar_url: string;
  public_repos: number;
  followers: number;
  following: number;
  bio: string;
  repos: Array<{
    name: string;
    description: string;
    language: string;
    stargazers_count: number;
    forks_count: number;
    fork: boolean;
    updated_at: string;
  }>;
  languages: Record<string, number>;
}

const ScoreRing = ({ score, label, size = 80 }: { score: number; label: string; size?: number }) => {
  const radius = (size - 8) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  const color = score >= 70 ? "hsl(var(--primary))" : score >= 40 ? "hsl(40, 80%, 55%)" : "hsl(var(--destructive))";

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90">
          <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="hsl(var(--border))" strokeWidth="4" />
          <motion.circle
            cx={size / 2} cy={size / 2} r={radius} fill="none" stroke={color} strokeWidth="4"
            strokeLinecap="round" strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1.2, ease: "easeOut" }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-lg font-bold">{score}</span>
        </div>
      </div>
      <span className="text-xs text-muted-foreground text-center">{label}</span>
    </div>
  );
};

const RoastPage = () => {
  const { username } = useParams<{ username: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [githubData, setGithubData] = useState<GitHubData | null>(null);
  const [result, setResult] = useState<RoastResult | null>(null);
  const [loadingPhase, setLoadingPhase] = useState("Fetching GitHub data...");
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [isLoadingAudio, setIsLoadingAudio] = useState(false);
  const [audioRef, setAudioRef] = useState<HTMLAudioElement | null>(null);

  const playRoast = async () => {
    if (isPlayingAudio && audioRef) {
      audioRef.pause();
      audioRef.currentTime = 0;
      setIsPlayingAudio(false);
      return;
    }

    if (!result?.roast) return;
    setIsLoadingAudio(true);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/elevenlabs-tts`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          },
          body: JSON.stringify({ text: result.roast }),
        }
      );

      if (!response.ok) throw new Error("TTS request failed");

      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);
      setAudioRef(audio);
      
      audio.onended = () => {
        setIsPlayingAudio(false);
        URL.revokeObjectURL(audioUrl);
      };

      await audio.play();
      setIsPlayingAudio(true);
    } catch (err) {
      console.error(err);
      toast.error("Failed to generate voice. Try again.");
    } finally {
      setIsLoadingAudio(false);
    }
  };

  useEffect(() => {
    if (username) fetchAndRoast(username);
  }, [username]);

  const fetchAndRoast = async (user: string) => {
    try {
      // Fetch GitHub profile
      const profileRes = await fetch(`https://api.github.com/users/${user}`);
      if (!profileRes.ok) throw new Error("GitHub user not found");
      const profile = await profileRes.json();

      setLoadingPhase("Analyzing repositories...");
      const reposRes = await fetch(`https://api.github.com/users/${user}/repos?per_page=100&sort=updated`);
      const repos = await reposRes.json();

      const languages: Record<string, number> = {};
      repos.forEach((r: any) => {
        if (r.language) languages[r.language] = (languages[r.language] || 0) + 1;
      });

      const ghData: GitHubData = {
        login: profile.login,
        name: profile.name || profile.login,
        avatar_url: profile.avatar_url,
        public_repos: profile.public_repos,
        followers: profile.followers,
        following: profile.following,
        bio: profile.bio || "",
        repos: repos.map((r: any) => ({
          name: r.name,
          description: r.description || "",
          language: r.language || "Unknown",
          stargazers_count: r.stargazers_count,
          forks_count: r.forks_count,
          fork: r.fork,
          updated_at: r.updated_at,
        })),
        languages,
      };
      setGithubData(ghData);

      setLoadingPhase("AI is cooking your roast...");

      const { data, error } = await supabase.functions.invoke("github-roast", {
        body: { githubData: ghData },
      });

      if (error) throw error;
      setResult(data);
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Failed to generate roast");
      navigate("/");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <div className="mb-6 relative">
            <Loader2 className="h-12 w-12 text-primary animate-spin mx-auto" />
          </div>
          <p className="text-lg font-semibold mb-2">{loadingPhase}</p>
          <p className="text-sm text-muted-foreground">This may take a few seconds...</p>
        </motion.div>
      </div>
    );
  }

  if (!result || !githubData) return null;

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-6 py-8 max-w-4xl">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button variant="ghost" size="icon" onClick={() => navigate("/")}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex items-center gap-3">
            <img src={githubData.avatar_url} alt={githubData.login} className="h-10 w-10 rounded-full border border-border" />
            <div>
              <h1 className="text-xl font-bold">{githubData.name}</h1>
              <p className="text-sm text-muted-foreground">@{githubData.login}</p>
            </div>
          </div>
        </div>

        {/* Overall Score */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl border border-glow bg-card p-8 mb-6 shadow-glow text-center"
        >
          <h2 className="text-sm font-mono text-primary mb-4 uppercase tracking-wider">GitHub Score</h2>
          <ScoreRing score={result.overallScore} label="" size={120} />
          <p className="mt-2 text-2xl font-extrabold">{result.overallScore}<span className="text-muted-foreground text-lg">/100</span></p>
        </motion.div>

        {/* Sub Scores */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6"
        >
          <div className="rounded-xl border border-border bg-card p-4 flex flex-col items-center">
            <ScoreRing score={result.scores.codeQuality} label="Code Quality" />
          </div>
          <div className="rounded-xl border border-border bg-card p-4 flex flex-col items-center">
            <ScoreRing score={result.scores.projectOriginality} label="Originality" />
          </div>
          <div className="rounded-xl border border-border bg-card p-4 flex flex-col items-center">
            <ScoreRing score={result.scores.consistency} label="Consistency" />
          </div>
          <div className="rounded-xl border border-border bg-card p-4 flex flex-col items-center">
            <ScoreRing score={result.scores.documentation} label="Documentation" />
          </div>
        </motion.div>

        {/* Roast */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="rounded-2xl border border-glow bg-card p-8 mb-6"
        >
          <div className="flex items-center gap-2 mb-4">
            <Flame className="h-5 w-5 text-primary" />
            <h2 className="font-bold text-lg">The Roast</h2>
          </div>
          <p className="font-mono text-sm leading-relaxed text-secondary-foreground italic">
            "{result.roast}"
          </p>
        </motion.div>

        {/* Strengths & Weaknesses */}
        <div className="grid gap-6 md:grid-cols-2 mb-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="rounded-xl border border-border bg-card p-6"
          >
            <div className="flex items-center gap-2 mb-4">
              <Star className="h-5 w-5 text-primary" />
              <h3 className="font-semibold">Strengths</h3>
            </div>
            <ul className="space-y-2">
              {result.strengths.map((s, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-secondary-foreground">
                  <TrendingUp className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                  {s}
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="rounded-xl border border-border bg-card p-6"
          >
            <div className="flex items-center gap-2 mb-4">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              <h3 className="font-semibold">Weaknesses</h3>
            </div>
            <ul className="space-y-2">
              {result.weaknesses.map((w, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-secondary-foreground">
                  <AlertTriangle className="h-4 w-4 text-destructive shrink-0 mt-0.5" />
                  {w}
                </li>
              ))}
            </ul>
          </motion.div>
        </div>

        {/* Suggestions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="rounded-xl border border-border bg-card p-6 mb-6"
        >
          <div className="flex items-center gap-2 mb-4">
            <Lightbulb className="h-5 w-5 text-primary" />
            <h3 className="font-semibold">Improvement Suggestions</h3>
          </div>
          <ul className="space-y-2">
            {result.suggestions.map((s, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-secondary-foreground">
                <span className="text-primary font-mono text-xs mt-0.5">{String(i + 1).padStart(2, "0")}</span>
                {s}
              </li>
            ))}
          </ul>
        </motion.div>

        {/* Project Ideas */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
          className="rounded-xl border border-border bg-card p-6 mb-8"
        >
          <div className="flex items-center gap-2 mb-4">
            <FolderGit2 className="h-5 w-5 text-primary" />
            <h3 className="font-semibold">Recommended Project Ideas</h3>
          </div>
          <ul className="space-y-2">
            {result.projectIdeas.map((p, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-secondary-foreground">
                <span className="text-primary">→</span>
                {p}
              </li>
            ))}
          </ul>
        </motion.div>

        {/* Back button */}
        <div className="text-center pb-8">
          <Button variant="hero-outline" onClick={() => navigate("/")}>
            Roast Another Profile
          </Button>
        </div>
      </div>
    </div>
  );
};

export default RoastPage;
