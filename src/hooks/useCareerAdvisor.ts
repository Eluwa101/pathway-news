import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export const useCareerAdvisor = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const sendMessage = async (userInput: string) => {
    if (!userInput.trim()) return;

    const userMessage: Message = { role: "user", content: userInput };
    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke("career-advisor", {
        body: {
          userInput,
          conversationHistory: messages,
        },
      });

      if (error) throw error;

      if (data?.response) {
        const assistantMessage: Message = {
          role: "assistant",
          content: data.response,
        };
        setMessages((prev) => [...prev, assistantMessage]);
      }
    } catch (error: any) {
      console.error("Error calling career advisor:", error);
      
      if (error.message?.includes("429")) {
        toast({
          title: "Rate Limit Exceeded",
          description: "Please wait a moment before sending another message.",
          variant: "destructive",
        });
      } else if (error.message?.includes("402")) {
        toast({
          title: "Payment Required",
          description: "Please contact support to continue using AI features.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Error",
          description: "Failed to get AI response. Please try again.",
          variant: "destructive",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const clearConversation = () => {
    setMessages([]);
  };

  const generateCareerPlan = async (preferences: any): Promise<string> => {
    setIsLoading(true);
    
    try {
      const preferencesText = `
Interests: ${preferences.interests.join(", ")}
Skills: ${preferences.skills.join(", ")}
Industry: ${preferences.industry}
Work Style: ${preferences.workStyle}
Timeline: ${preferences.timeframe}
Goals: ${preferences.goals}
Plan Type: ${preferences.planType}
      `;

      const { data, error } = await supabase.functions.invoke("career-advisor", {
        body: {
          userInput: `GENERATE_CAREER_PLAN:${preferencesText}`,
          conversationHistory: [],
        },
      });

      if (error) throw error;

      if (data?.response) {
        return data.response;
      }
      
      throw new Error("No response from AI");
    } catch (error: any) {
      console.error("Error generating career plan:", error);
      
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
        toast({
          title: "Error",
          description: "Failed to generate career plan. Please try again.",
          variant: "destructive",
        });
      }
      
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    messages,
    isLoading,
    sendMessage,
    clearConversation,
    generateCareerPlan,
  };
};
