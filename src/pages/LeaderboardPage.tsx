import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Trophy, Flame, ArrowLeft, Crown, Medal, Award, TrendingUp, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

interface LeaderboardEntry {
  id: string;
  github_username: string;
  github_name: string | null;
  avatar_url: string | null;
  roast: string;
  overall_score: number;
  code_quality_score: number;
  originality_score: number;
  consistency_score: number;
  documentation_score: number;
  created_at: string;
}

const rankIcons = [
  <Crown className="h-5 w-5 text-yellow-400" />,
  <Medal className="h-5 w-5 text-gray-300" />,
  <Award className="h-5 w-5 text-amber-600" />,
];

const LeaderboardPage = () => {
  const navigate = useNavigate();
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [recentEntries, setRecentEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<"top" | "recent">("top");

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const fetchLeaderboard = async () => {
    try {
      const [topRes, recentRes] = await Promise.all([
        supabase
          .from("roast_results")
          .select("*")
          .order("overall_score", { ascending: false })
          .limit(50),
        supabase
          .from("roast_results")
          .select("*")
          .order("created_at", { ascending: false })
          .limit(50),
      ]);

      if (topRes.data) setEntries(topRes.data);
      if (recentRes.data) setRecentEntries(recentRes.data);
    } catch (err) {
      console.error("Failed to fetch leaderboard:", err);
    } finally {
      setLoading(false);
    }
  };

  const scoreColor = (score: number) =>
    score >= 70 ? "text-primary" : score >= 40 ? "text-yellow-400" : "text-destructive";

  const activeEntries = tab === "top" ? entries : recentEntries;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border/50 bg-background/80 backdrop-blur-xl">
        <div className="container mx-auto px-6 py-4 flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate("/")}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-primary" />
            <h1 className="text-xl font-bold">Leaderboard</h1>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8 max-w-3xl">
        {/* Tabs */}
        <div className="flex gap-2 mb-8">
          <Button
            variant={tab === "top" ? "hero" : "hero-outline"}
            size="sm"
            onClick={() => setTab("top")}
            className="gap-2"
          >
            <TrendingUp className="h-4 w-4" />
            Top Scores
          </Button>
          <Button
            variant={tab === "recent" ? "hero" : "hero-outline"}
            size="sm"
            onClick={() => setTab("recent")}
            className="gap-2"
          >
            <Clock className="h-4 w-4" />
            Recent Roasts
          </Button>
        </div>

        {loading ? (
          <div className="text-center py-20">
            <Flame className="h-8 w-8 text-primary animate-pulse mx-auto mb-4" />
            <p className="text-muted-foreground">Loading leaderboard...</p>
          </div>
        ) : activeEntries.length === 0 ? (
          <div className="text-center py-20">
            <Trophy className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-lg font-semibold mb-2">No roasts yet</p>
            <p className="text-muted-foreground mb-6">Be the first to get roasted!</p>
            <Button variant="hero" onClick={() => navigate("/")}>
              Roast My GitHub
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            {activeEntries.map((entry, i) => (
              <motion.div
                key={entry.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03 }}
                onClick={() => navigate(`/roast/${entry.github_username}`)}
                className="group flex items-center gap-4 rounded-xl border border-border bg-card p-4 hover:border-glow cursor-pointer transition-colors"
              >
                {/* Rank */}
                <div className="flex h-8 w-8 items-center justify-center shrink-0">
                  {tab === "top" && i < 3 ? (
                    rankIcons[i]
                  ) : (
                    <span className="text-sm font-mono text-muted-foreground">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                  )}
                </div>

                {/* Avatar */}
                <img
                  src={entry.avatar_url || `https://github.com/${entry.github_username}.png`}
                  alt={entry.github_username}
                  className="h-10 w-10 rounded-full border border-border shrink-0"
                />

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-sm truncate">
                      {entry.github_name || entry.github_username}
                    </span>
                    <span className="text-xs text-muted-foreground">@{entry.github_username}</span>
                  </div>
                  <p className="text-xs text-muted-foreground truncate mt-0.5 font-mono italic">
                    "{entry.roast.slice(0, 80)}..."
                  </p>
                </div>

                {/* Score */}
                <div className="text-right shrink-0">
                  <div className={`text-2xl font-extrabold ${scoreColor(entry.overall_score)}`}>
                    {entry.overall_score}
                  </div>
                  <div className="text-[10px] text-muted-foreground">/100</div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default LeaderboardPage;
