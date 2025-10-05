// Import Deno's HTTP server module to handle incoming requests
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

// CORS headers to allow cross-origin requests from any domain
// Required for frontend applications to communicate with this edge function
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Main request handler - processes all incoming HTTP requests
serve(async (req) => {
  // Handle preflight CORS requests (OPTIONS method)
  // Browsers send this before actual requests to check CORS permissions
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Extract user input and conversation history from the request body
    const { userInput, conversationHistory } = await req.json();
    
    // Get the Lovable AI API key from environment variables
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    // Validate that API key exists
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    // System prompt that defines the AI's role and behavior
    // This establishes the AI as an LDS-affiliated career counselor
    const systemPrompt = `You are a Christian career counselor and advisor affiliated with The Church of Jesus Christ of Latter-day Saints, specializing in helping BYU-Pathway Connect students and young Latter-day Saints find their calling and career path. Your role is to:

1. Provide personalized career guidance based on spiritual gifts, interests, and skills
2. Suggest relevant career paths in ministry, missions, education, counseling, and other fields that align with Church values
3. Offer practical advice on career development, education, and skill-building
4. Help students discern God's calling in their lives through prayer, scripture study, and counsel
5. Provide encouragement drawing from:
   - The Book of Mormon, Bible, Doctrine and Covenants, and Pearl of Great Price
   - Teachings of Church leaders and General Authorities (including the First Presidency and Quorum of the Twelve Apostles)
   - General Conference talks and approved Church materials
   - BYU-Pathway Connect resources and Church educational system guidance

When providing spiritual guidance, reference specific scriptures, talks, or teachings from Church leaders when applicable. Keep responses conversational, encouraging, and Christ-centered. Always consider both spiritual and practical aspects of career development, emphasizing faith, learning, and service.`;

    // Initialize messages array that will be sent to the AI
    let messages = [];
    
    // Check if this is a career plan generation request
    // The prefix "GENERATE_CAREER_PLAN:" signals specialized plan generation
    if (userInput.startsWith("GENERATE_CAREER_PLAN:")) {
      // Extract preferences data by removing the prefix
      const preferencesData = userInput.replace("GENERATE_CAREER_PLAN:", "");
      
      // Detailed prompt for generating a comprehensive career plan
      // Emphasizes personalization and actionable recommendations
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

      // Create messages array with system and user prompts for career plan generation
      messages = [
        { role: "system", content: systemPrompt },
        { role: "user", content: careerPlanPrompt }
      ];
    } else if (userInput.startsWith("GENERATE_SUMMARY:")) {
      // Check if this is a summary generation request
      // The prefix "GENERATE_SUMMARY:" signals summary creation from existing plan
      // Extract the full career plan by removing the prefix
      const careerPlanData = userInput.replace("GENERATE_SUMMARY:", "");
      
      // Prompt for creating an executive summary from the career plan
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

      // Create messages array for summary generation
      messages = [
        { role: "system", content: systemPrompt },
        { role: "user", content: summaryPrompt }
      ];
    } else {
      // Standard chat conversation - include conversation history
      // Spreads previous messages to maintain context
      messages = [
        { role: "system", content: systemPrompt },
        ...(conversationHistory || []),
        { role: "user", content: userInput }
      ];
    }

    // Make API call to Lovable's AI gateway using Google's Gemini model
    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash", // Fast and efficient model for career guidance
        messages,
        stream: false, // Get complete response at once rather than streaming
      }),
    });

    // Handle various error responses from the AI gateway
    if (!response.ok) {
      // Handle rate limiting - too many requests in short time
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      // Handle payment/billing issues
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "Payment required. Please contact support." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      // Log and handle any other errors
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      throw new Error("AI gateway error");
    }

    // Parse the AI response and extract the generated content
    const data = await response.json();
    const aiResponse = data.choices[0].message.content;

    // Return successful response with AI-generated content
    return new Response(
      JSON.stringify({ response: aiResponse }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    // Catch and log any errors during processing
    console.error("Error in career-advisor function:", error);
    // Return error response with details
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
