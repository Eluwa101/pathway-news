// Import Deno's HTTP server module to handle incoming requests
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

// CORS headers for cross-origin access
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Main Edge Function
serve(async (req) => {
  // Handle preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Parse request body
    const { userInput, conversationHistory } = await req.json();

    const GEMINI_API_KEY = Deno.env.get("GEMINI_API_KEY");
    if (!GEMINI_API_KEY) throw new Error("Missing GEMINI_API_KEY");

    // === Base system prompt ===
    const systemPrompt = `
You are a warm, professional Christian career advisor affiliated with
The Church of Jesus Christ of Latter-day Saints. You help BYU-Pathway
students discover career paths through faith, skill-building, and prayer.
Give concise, short, or long appropriate answers when necessary, spiritually grounded, and practical answers.
`;

    // === Message structure ===
    let messages = [];

    // Specialized prompts
    if (userInput.startsWith("GENERATE_CAREER_PLAN:")) {
      const preferences = userInput.replace("GENERATE_CAREER_PLAN:", "");

      const planPrompt = `
Based on the user's preferences below, create a focused 2–3 page career plan.

User Preferences:
${preferences}

→ Include:
1. Career Match Analysis
2. Top 3 Career Paths
3. 90-Day Action Plan
4. Key Skills to Develop
5. 6-Month Milestones
6. 1-Year Vision
7. Faith Integration

Use bullet points, numbered steps, and concise language.
`;

      messages = [
        { role: "user", parts: [{ text: systemPrompt }] },
        { role: "user", parts: [{ text: planPrompt }] },
      ];
    } else if (userInput.startsWith("GENERATE_SUMMARY:")) {
      const plan = userInput.replace("GENERATE_SUMMARY:", "");

      const summaryPrompt = `
Summarize the following career plan into a clear 300–500 word executive summary.

Career Plan:
${plan}

→ Include:
- Top career paths
- 3–5 key actions
- Skills to develop
- Timeline overview
Use markdown-friendly bullets and headers.
`;

      messages = [
        { role: "user", parts: [{ text: systemPrompt }] },
        { role: "user", parts: [{ text: summaryPrompt }] },
      ];
    } else {
      // Normal conversation
      const historyParts =
        (conversationHistory || []).map((m: any) => ({
          role: m.role,
          parts: [{ text: m.content }],
        })) ?? [];

      messages = [
        { role: "user", parts: [{ text: systemPrompt }] },
        ...historyParts,
        { role: "user", parts: [{ text: userInput }] },
      ];
    }

    // === Gemini API call ===
    const MODEL = "gemini-2.0-flash";
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contents: messages }),
      }
    );

    if (!response.ok) {
      const errText = await response.text();
      console.error("Gemini error:", response.status, errText);
      return new Response(
        JSON.stringify({ error: "Gemini request failed", details: errText }),
        { status: response.status, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // === Extract response ===
    const data = await response.json();
    const aiResponse =
      data?.candidates?.[0]?.content?.parts?.[0]?.text ??
      "No response from Gemini";

    // === Return success ===
    return new Response(JSON.stringify({ response: aiResponse }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error in career-advisor function:", error);
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : "Unknown error",
      }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
