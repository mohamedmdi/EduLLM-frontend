import { useState } from "react";

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

type Attachment = {
  name?: string;
  contentType?: string;
  url?: string;
};

export function useChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  const handleSubmit = async (
    e: React.FormEvent,
    options?: { experimental_attachments?: FileList | undefined }
  ) => {
    e.preventDefault();
    if (!input.trim() && !options?.experimental_attachments?.length) return;

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
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append("query", userMessage.content);
      if (options?.experimental_attachments?.[0]) {
        formData.append("file", options.experimental_attachments[0]);
      }

      const res = await fetch("/api/chat", {
        method: "POST",
        body: formData,
      });

      const reader = res.body?.getReader();
      const decoder = new TextDecoder();
      let aiResponse = "";

      if (reader) {
        setIsLoading(false);
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
      }
    } catch (err) {
      console.error("Chat error:", err);
    } finally {
    }
  };

  return {
    messages,
    input,
    isLoading,
    handleInputChange,
    handleSubmit,
  };
}
