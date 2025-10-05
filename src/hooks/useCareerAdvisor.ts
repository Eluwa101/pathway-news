// React hooks and utilities
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

// Message interface defining the structure of chat messages
interface Message {
  role: "user" | "assistant"; // Message sender: user or AI assistant
  content: string; // The actual message text
}

// Custom hook for managing AI career advisor functionality
export const useCareerAdvisor = () => {
  // State to store conversation messages
  const [messages, setMessages] = useState<Message[]>([]);
  // Loading state for API calls
  const [isLoading, setIsLoading] = useState(false);
  // Toast notifications for user feedback
  const { toast } = useToast();

  // Function to send a message to the AI and get a response
  const sendMessage = async (userInput: string) => {
    // Validate input is not empty
    if (!userInput.trim()) return;

    // Create user message object and add to conversation
    const userMessage: Message = { role: "user", content: userInput };
    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      // Invoke Supabase edge function to communicate with AI
      const { data, error } = await supabase.functions.invoke("career-advisor", {
        body: {
          userInput,
          conversationHistory: messages, // Send full conversation for context
        },
      });

      if (error) throw error;

      // If response received, add AI message to conversation
      if (data?.response) {
        const assistantMessage: Message = {
          role: "assistant",
          content: data.response,
        };
        setMessages((prev) => [...prev, assistantMessage]);
      }
    } catch (error: any) {
      // Log error for debugging
      console.error("Error calling career advisor:", error);
      
      // Handle rate limiting error
      if (error.message?.includes("429")) {
        toast({
          title: "Rate Limit Exceeded",
          description: "Please wait a moment before sending another message.",
          variant: "destructive",
        });
      } else if (error.message?.includes("402")) {
        // Handle payment/billing error
        toast({
          title: "Payment Required",
          description: "Please contact support to continue using AI features.",
          variant: "destructive",
        });
      } else {
        // Handle generic errors
        toast({
          title: "Error",
          description: "Failed to get AI response. Please try again.",
          variant: "destructive",
        });
      }
    } finally {
      // Always reset loading state
      setIsLoading(false);
    }
  };

  // Function to clear all messages in the conversation
  const clearConversation = () => {
    setMessages([]);
  };

  // Function to generate a comprehensive career plan based on user preferences
  const generateCareerPlan = async (preferences: any): Promise<string> => {
    setIsLoading(true);
    
    try {
      // Format preferences into a readable text format for the AI
      const preferencesText = `
Interests: ${preferences.interests.join(", ")}
Skills: ${preferences.skills.join(", ")}
Industry: ${preferences.industry}
Work Style: ${preferences.workStyle}
Timeline: ${preferences.timeframe}
Goals: ${preferences.goals}
Plan Type: ${preferences.planType}
      `;

      // Call edge function with special GENERATE_CAREER_PLAN prefix
      const { data, error } = await supabase.functions.invoke("career-advisor", {
        body: {
          userInput: `GENERATE_CAREER_PLAN:${preferencesText}`,
          conversationHistory: [], // Empty history for fresh plan generation
        },
      });

      if (error) throw error;

      // Return the generated career plan
      if (data?.response) {
        return data.response;
      }
      
      throw new Error("No response from AI");
    } catch (error: any) {
      // Log error for debugging
      console.error("Error generating career plan:", error);
      
      // Handle rate limiting error
      if (error.message?.includes("429")) {
        toast({
          title: "Rate Limit Exceeded",
          description: "Please wait a moment before generating another plan.",
          variant: "destructive",
        });
      } else if (error.message?.includes("402")) {
        toast({
          title: "Payment Required",
          description: "Please contact support to continue using AI features.",
          variant: "destructive",
        });
      } else {
        // Handle generic errors
        toast({
          title: "Error",
          description: "Failed to generate career plan. Please try again.",
          variant: "destructive",
        });
      }
      
      throw error;
    } finally {
      // Always reset loading state
      setIsLoading(false);
    }
  };

  // Function to generate a summary from an existing career plan
  const generateSummary = async (careerPlan: string): Promise<string> => {
    setIsLoading(true);
    
    try {
      // Call edge function with GENERATE_SUMMARY prefix
      const { data, error } = await supabase.functions.invoke("career-advisor", {
        body: {
          userInput: `GENERATE_SUMMARY:${careerPlan}`,
          conversationHistory: [], // Empty history for summary generation
        },
      });

      if (error) throw error;

      // Return the generated summary
      if (data?.response) {
        return data.response;
      }
      
      throw new Error("No response from AI");
    } catch (error: any) {
      // Log error for debugging
      console.error("Error generating summary:", error);
      
      // Handle rate limiting error
      if (error.message?.includes("429")) {
        toast({
          title: "Rate Limit Exceeded",
          description: "Please wait a moment before generating a summary.",
          variant: "destructive",
        });
      } else if (error.message?.includes("402")) {
        toast({
          title: "Payment Required",
          description: "Please contact support to continue using AI features.",
          variant: "destructive",
        });
      } else {
        // Handle generic errors
        toast({
          title: "Error",
          description: "Failed to generate summary. Please try again.",
          variant: "destructive",
        });
      }
      
      throw error;
    } finally {
      // Always reset loading state
      setIsLoading(false);
    }
  };

  // Return all hook functions and state for use in components
  return {
    messages, // Conversation history
    isLoading, // Loading state for UI feedback
    sendMessage, // Send chat message
    clearConversation, // Clear chat history
    generateCareerPlan, // Generate full career plan
    generateSummary, // Generate plan summary
  };
};
