import { Box } from "@upstash/box";
import { type UIMessage, type UIMessageChunk } from "ai";
import { getWritable } from "workflow";
import { buildPrompt } from "@/lib/chat";

export async function boxChat(messages: UIMessage[]) {
  "use workflow";

  await streamBoxAgent(messages);
}

async function streamBoxAgent(messages: UIMessage[]) {
  "use step";

  const boxId = process.env.UPSTASH_BOX_ID;

  if (!boxId) {
    throw new Error("Set UPSTASH_BOX_ID before starting the chat workflow.");
  }

  const writable = getWritable<UIMessageChunk>();
  const writer = writable.getWriter();
  const textId = "box-agent-response";

  await writer.write({ type: "start" });
  await writer.write({ type: "start-step" });
  await writer.write({ type: "text-start", id: textId });

  try {
    const box = await Box.get(boxId);
    const run = await box.agent.stream({
      prompt: buildPrompt(messages),
    });

    for await (const chunk of run) {
      if (chunk.type === "text-delta") {
        await writer.write({
          type: "text-delta",
          id: textId,
          delta: chunk.text,
        });
      }
    }

    await writer.write({ type: "text-end", id: textId });
    await writer.write({ type: "finish-step" });
    await writer.write({ type: "finish", finishReason: "stop" });
  } catch (error) {
    await writer.write({
      type: "error",
      errorText: error instanceof Error ? error.message : "The Box agent failed.",
    });
  } finally {
    await writer.close();
  }
}
