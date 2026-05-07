async function sendMessageStreaming(message: string, history: ChatMessage[]) {
  const response = await fetch(
    `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/instapass-ai-chat`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: import.meta.env.VITE_SUPABASE_ANON_KEY,
        Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
      },
      body: JSON.stringify({
        message,
        history,
        stream: true,
      }),
    }
  );

  if (!response.ok || !response.body) {
    throw new Error("Streaming request failed.");
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let accumulated = "";

  // add placeholder assistant message first
  setMessages((prev) => [...prev, { role: "assistant", content: "" }]);

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    const chunk = decoder.decode(value, { stream: true });

    // Responses API sends SSE lines. We parse only output text deltas.
    const lines = chunk.split("\n").filter(Boolean);

    for (const line of lines) {
      if (!line.startsWith("data: ")) continue;

      const payload = line.replace("data: ", "").trim();
      if (payload === "[DONE]") continue;

      try {
        const parsed = JSON.parse(payload);

        // Responses streaming events may include delta text here
        const delta =
          parsed?.type === "response.output_text.delta"
            ? parsed?.delta ?? ""
            : "";

        if (delta) {
          accumulated += delta;

          setMessages((prev) => {
            const copy = [...prev];
            copy[copy.length - 1] = {
              role: "assistant",
              content: accumulated,
            };
            return copy;
          });
        }
      } catch {
        // ignore non-json fragments
      }
    }
  }
}