import { useState } from "react";
import { getUserId, isAuthenticated } from "@/lib/auth-utils";

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
  };
    const handleSubmit = async (
    e: React.FormEvent,
    options?: { experimental_attachments?: FileList }
  ) => {
    e.preventDefault();
    if (!input.trim() && !options?.experimental_attachments?.length) return;

    // Get user ID for backend request - supports both authenticated and guest users
    let userId = getUserId();
    if (!userId) {      // Create a guest user ID if not authenticated
      if (!isAuthenticated()) {
        userId = `guest_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
      } else {
        console.error("User authentication failed");
        return;
      }
    }

    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: "user",
      content: input.trim(),
      experimental_attachments: options?.experimental_attachments
        ? Array.from(options.experimental_attachments).map((file) => ({
            name: file.name,
            contentType: file.type,
            url: URL.createObjectURL(file),
          }))
        : undefined,
    };    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);
    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("query", userMessage.content);
      formData.append("userId", userId); // Include user ID
      
      if (options?.experimental_attachments?.[0]) {
        formData.append("file", options.experimental_attachments[0]);
      }

      const res = await fetch("/api/chat", {
        method: "POST",
        body: formData,
      });

      const reader = res.body?.getReader();
      const decoder = new TextDecoder();
      let aiResponse = "";      if (reader) {
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

        // Finalize the message
        setMessages((prev) => [
          ...prev.filter((m) => m.role !== "assistant" || m.id !== "streaming"),
          {
            id: crypto.randomUUID(),
            role: "assistant",
            content: aiResponse.trim(),
          },
        ]);
      }    } catch (err) {
      console.error("Chat error:", err);
      setIsLoading(false);
      setIsSubmitting(false);
    }
  };
  return {
    messages,
    input,
    isLoading,
    isSubmitting,
    handleInputChange,
    handleSubmit,
  };
}
