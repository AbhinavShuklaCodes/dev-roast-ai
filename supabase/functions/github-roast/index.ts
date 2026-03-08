import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { githubData } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const { login, name, public_repos, followers, bio, repos, languages } = githubData;

    const totalStars = repos.reduce((sum: number, r: any) => sum + r.stargazers_count, 0);
    const totalForks = repos.reduce((sum: number, r: any) => sum + r.forks_count, 0);
    const forkedRepos = repos.filter((r: any) => r.fork).length;
    const originalRepos = repos.length - forkedRepos;
    const languageList = Object.entries(languages).sort((a: any, b: any) => b[1] - a[1]).map(([lang]) => lang);

    const profileSummary = `
GitHub Username: ${login}
Name: ${name}
Bio: ${bio || "No bio"}
Public Repos: ${public_repos}
Followers: ${followers}
Total Stars: ${totalStars}
Total Forks: ${totalForks}
Original Repos: ${originalRepos}
Forked Repos: ${forkedRepos}
Languages: ${languageList.join(", ") || "None"}
Top Repos: ${repos.slice(0, 10).map((r: any) => `${r.name} (${r.language || "?"}, ★${r.stargazers_count})`).join("; ")}
    `.trim();

    const systemPrompt = `You are GitRoast AI, a witty and insightful AI that analyzes GitHub developer profiles. 
You generate humorous but not offensive roasts, along with professional feedback.
Your tone is playful, clever, and encouraging — like a funny senior developer giving feedback.
You MUST respond with valid JSON only, no markdown, no code fences.`;

    const userPrompt = `Analyze this GitHub profile and respond with a JSON object (no markdown):

${profileSummary}

Return this exact JSON structure:
{
  "roast": "A funny 3-5 sentence roast of their GitHub profile",
  "overallScore": <number 0-100>,
  "scores": {
    "codeQuality": <number 0-100>,
    "projectOriginality": <number 0-100>,
    "consistency": <number 0-100>,
    "documentation": <number 0-100>
  },
  "strengths": ["strength1", "strength2", "strength3"],
  "weaknesses": ["weakness1", "weakness2", "weakness3"],
  "suggestions": ["suggestion1", "suggestion2", "suggestion3", "suggestion4"],
  "projectIdeas": ["idea1", "idea2", "idea3"]
}`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limited. Please try again in a moment." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      throw new Error("AI gateway error");
    }

    const aiResponse = await response.json();
    let content = aiResponse.choices?.[0]?.message?.content || "";
    
    const parsed = extractJsonFromResponse(content);

    // Save to database for leaderboard
    try {
      const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
      const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
      const supabase = createClient(supabaseUrl, supabaseServiceKey);

      await supabase.from("roast_results").insert({
        github_username: login,
        github_name: name,
        avatar_url: githubData.avatar_url,
        roast: parsed.roast,
        overall_score: parsed.overallScore,
        code_quality_score: parsed.scores?.codeQuality || 0,
        originality_score: parsed.scores?.projectOriginality || 0,
        consistency_score: parsed.scores?.consistency || 0,
        documentation_score: parsed.scores?.documentation || 0,
        strengths: parsed.strengths || [],
        weaknesses: parsed.weaknesses || [],
        suggestions: parsed.suggestions || [],
        project_ideas: parsed.projectIdeas || [],
      });
    } catch (dbErr) {
      console.error("Failed to save roast result:", dbErr);
      // Don't fail the request if DB save fails
    }

    return new Response(JSON.stringify(parsed), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("github-roast error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
