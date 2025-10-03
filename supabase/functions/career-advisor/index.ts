import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { userInput, conversationHistory } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const systemPrompt = `You are a Christian career counselor and advisor specializing in helping theology students and young Christians find their calling and career path. Your role is to:

1. Provide personalized career guidance based on spiritual gifts, interests, and skills
2. Suggest relevant career paths in ministry, missions, education, counseling, and other fields
3. Offer practical advice on career development, education, and skill-building
4. Help students discern God's calling in their lives
5. Provide encouragement and biblical wisdom for career decisions

Keep responses conversational, encouraging, and Christ-centered. Always consider both spiritual and practical aspects of career development.`;

    let messages = [];
    
    // Check if this is a career plan generation request
    if (userInput.startsWith("GENERATE_CAREER_PLAN:")) {
      const preferencesData = userInput.replace("GENERATE_CAREER_PLAN:", "");
      const careerPlanPrompt = `Based on the following user preferences, create a comprehensive, detailed, and highly personalized career plan. This should NOT be a generic template - analyze each preference deeply and create specific, actionable recommendations tailored to this individual's unique combination of interests, skills, and goals.

User Preferences:
${preferencesData}

Generate a comprehensive career plan that includes:

1. Personalized Career Analysis - Deep analysis of how their interests, skills, and goals interconnect
2. Specific Career Paths - 3-5 specific job titles/roles that match their unique profile (not generic categories)
3. Detailed Action Plan - Concrete, sequential steps with specific timelines and milestones
4. Skills Development Roadmap - Specific courses, certifications, or experiences to pursue
5. Industry-Specific Networking Strategy - Where and how to connect with the right people
6. Short-term Goals (0-6 months) - Immediate, actionable steps they can take this week
7. Medium-term Goals (6-12 months) - Measurable milestones with success criteria
8. Long-term Vision (1-5 years) - Career progression path with alternative routes
9. Potential Challenges & Solutions - Specific obstacles they may face and how to overcome them
10. Resources & Opportunities - Specific programs, organizations, or opportunities relevant to their path
11. Faith Integration - How their faith can guide and strengthen their career journey

Format using clean markdown with:
- Use bullet points (-) for lists, NOT asterisks
- Use numbered lists (1., 2., 3.) for sequential steps
- Separate each major section with a horizontal rule (---)
- Use ## for section headers
- Keep formatting clean and professional

Make this plan deeply personal, specific, and actionable. Include actual numbers, dates, and tangible outcomes. Reference their specific skills and interests throughout.`;

      messages = [
        { role: "system", content: systemPrompt },
        { role: "user", content: careerPlanPrompt }
      ];
    } else if (userInput.startsWith("GENERATE_SUMMARY:")) {
      const careerPlanData = userInput.replace("GENERATE_SUMMARY:", "");
      const summaryPrompt = `Based on the following comprehensive career plan, generate a concise executive summary that captures the key points, main recommendations, and critical action items.

Career Plan:
${careerPlanData}

Create a summary that includes:
- Key career paths identified
- Top 3-5 immediate action items
- Essential skills to develop
- Timeline overview

Format using clean markdown with:
- Use bullet points (-) for lists, NOT asterisks
- Use numbered lists (1., 2., 3.) for action items
- Use ## for section headers
- Keep it concise (300-500 words maximum)

Make the summary actionable and easy to scan.`;

      messages = [
        { role: "system", content: systemPrompt },
        { role: "user", content: summaryPrompt }
      ];
    } else {
      messages = [
        { role: "system", content: systemPrompt },
        ...(conversationHistory || []),
        { role: "user", content: userInput }
      ];
    }

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages,
        stream: false,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "Payment required. Please contact support." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      throw new Error("AI gateway error");
    }

    const data = await response.json();
    const aiResponse = data.choices[0].message.content;

    return new Response(
      JSON.stringify({ response: aiResponse }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error in career-advisor function:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
