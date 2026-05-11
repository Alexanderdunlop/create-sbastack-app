import { type UIMessage } from "ai";

function getText(message: UIMessage) {
  return message.parts
    .map((part) => (part.type === "text" ? part.text : ""))
    .join("");
}

export function buildPrompt(messages: UIMessage[]) {
  const conversation = messages
    .map((message) => `${message.role}: ${getText(message)}`)
    .join("\n\n");

  return `You are a helpful assistant responding to this chat conversation:\n\n${conversation}`;
}
