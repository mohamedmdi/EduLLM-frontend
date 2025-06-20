import { useState, useCallback } from "react";
import { getUserId, isAuthenticated, generateUserId, setUserAuth } from "@/lib/auth-utils";

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
  experimental_attachments?: {
    name?: string;
    url?: string;
    contentType?: string;
  }[];
};

export function useChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };  const handleSubmit = async (
    e: React.FormEvent,
    options?: { experimental_attachments?: FileList; customText?: string; locale?: string }  ) => {    e.preventDefault();
    const textToUse = options?.customText ?? input;
    let textForBackend = textToUse;
    
    // Add language instruction for backend but keep it hidden from UI
    if (options?.locale && !options?.customText) {
      const languageInstructions = {
        en: "Please respond in English.",
        fr: "Veuillez répondre en français.",
        ar: "يرجى الرد باللغة العربية."
      };
      const languageInstruction = languageInstructions[options.locale as keyof typeof languageInstructions] || languageInstructions.en;
      textForBackend = `${textToUse}\n\n${languageInstruction}`;
    }
    
    if (!textToUse.trim() && !options?.experimental_attachments?.length) return;

    // Get user ID for backend request - supports both authenticated and guest users
    let userId = getUserId();
    if (!userId) {
      // Create a guest user ID if not authenticated
      if (!isAuthenticated()) {
        userId = generateUserId('guest');
        setUserAuth(userId, 'guest');
      } else {
        console.error("User authentication failed");
        return;
      }
    }    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: "user",
      content: textToUse.trim(), // Display the original text without language instruction
      experimental_attachments: options?.experimental_attachments
        ? Array.from(options.experimental_attachments).map((file) => ({
            name: file.name,
            contentType: file.type,
            url: URL.createObjectURL(file),
          }))
        : undefined,
    };
    setMessages((prev) => [...prev, userMessage]);
    // Only clear input if we're using the actual input, not custom text
    if (!options?.customText) {
      setInput("");
    }
    setIsLoading(true);
    setIsSubmitting(true);    try {      const formData = new FormData();      
      formData.append("query", textForBackend); // Send text with language instruction to backend
      formData.append("userId", userId); // Include user ID
      if (options?.locale) {
        formData.append("locale", options.locale); // Include language preference
      }

      if (options?.experimental_attachments) {
        Array.from(options.experimental_attachments).forEach((file) => {
          formData.append("file", file);
        });
      }

      const res = await fetch("/api/chat", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const reader = res.body?.getReader();
      const decoder = new TextDecoder();
      let aiResponse = "";
      if (reader) {
        setIsLoading(false);
        setIsSubmitting(false);
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          aiResponse += decoder.decode(value);
          setMessages((prev) => [
            ...prev.filter(
              (m) => m.role !== "assistant" || m.id !== "streaming"
            ),
            {
              id: "streaming",
              role: "assistant",
              content: aiResponse,
            },
          ]);
        }        // Finalize the message
        setMessages((prev) => [
          ...prev.filter((m) => m.role !== "assistant" || m.id !== "streaming"),
          {
            id: crypto.randomUUID(),
            role: "assistant",
            content: aiResponse.trim(),
          },
        ]);
      }
    } catch (err) {
      console.error("Chat error:", err);
      setIsLoading(false);
      setIsSubmitting(false);
      
      // Add an error message to the chat
      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          role: "assistant",
          content: "Sorry, I'm having trouble connecting right now. Please try again in a moment.",
        },
      ]);
    }
  };// Function to send an initializing prompt - wrapped in useCallback to avoid dependency issues
  const sendInitialPrompt = useCallback(async (prompt: string) => {
    let userId = getUserId();
    if (!userId) {
      if (!isAuthenticated()) {
        userId = generateUserId('guest');
        setUserAuth(userId, 'guest');
      } else {
        console.error("User authentication failed");
        return;
      }
    }
    
    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: "user", 
      content: prompt,
    };
    
    setMessages((prev) => {
      // Only add the message if it doesn't already exist to prevent duplicates
      const exists = prev.some(m => m.role === "user" && m.content === prompt);
      return exists ? prev : [...prev, userMessage];
    });
    
    setIsLoading(true);
    setIsSubmitting(true);
    
    try {
      const formData = new FormData();
      formData.append("query", userMessage.content);
      formData.append("userId", userId);
      
      const res = await fetch("/api/chat", {
        method: "POST",
        body: formData,
      });
      
      const reader = res.body?.getReader();
      const decoder = new TextDecoder();
      let aiResponse = "";
      
      if (reader) {
        setIsLoading(false);
        setIsSubmitting(false);
        
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          aiResponse += decoder.decode(value);
          
          setMessages((prev) => [
            ...prev.filter(
              (m) => m.role !== "assistant" || m.id !== "streaming"
            ),
            {
              id: "streaming",
              role: "assistant",
              content: aiResponse,
            },
          ]);
        }
        
        setMessages((prev) => [
          ...prev.filter((m) => m.role !== "assistant" || m.id !== "streaming"),
          {
            id: crypto.randomUUID(),
            role: "assistant",
            content: aiResponse.trim(),
          },
        ]);
      }
    } catch (err) {
      console.error("Chat error:", err);
      setIsLoading(false);
      setIsSubmitting(false);
    }
  }, []); // Empty dependency array since it doesn't depend on any props or state
  // Function to clear all messages and reset the chat
  const clearMessages = () => {
    setMessages([]);
    setInput("");
    setIsLoading(false);
    setIsSubmitting(false);
  };

  return {
    messages,
    input,
    isLoading,
    isSubmitting,
    handleInputChange,
    handleSubmit,
    sendInitialPrompt, // export the new function
    clearMessages, // export the clear function
  };
}
