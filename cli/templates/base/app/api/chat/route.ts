import { Box, type WebhookPayload } from "@upstash/box";
import { serve } from "@upstash/workflow/nextjs";
import { type UIMessage } from "ai";

type ChatWorkflowPayload = {
  messages: UIMessage[];
  boxId?: string;
};

type ChatWorkflowResult =
  | {
      output: string;
      boxId: string;
      runId?: string;
    }
  | {
      error: string;
    };

function getText(message: UIMessage) {
  return message.parts
    .map((part) => (part.type === "text" ? part.text : ""))
    .join("");
}

function buildPrompt(messages: UIMessage[]) {
  const conversation = messages
    .map((message) => `${message.role}: ${getText(message)}`)
    .join("\n\n");

  return `You are a helpful assistant responding to this chat conversation:\n\n${conversation}`;
}

export const { POST } = serve<ChatWorkflowPayload, ChatWorkflowResult>(
  async (context) => {
    const { messages, boxId: payloadBoxId } = context.requestPayload;
    const boxId = payloadBoxId ?? context.env.UPSTASH_BOX_ID;

    if (!boxId) {
      throw new Error("Set UPSTASH_BOX_ID or include boxId in the chat payload.");
    }

    const webhook = await context.createWebhook("sdk-agent-webhook-step");

    await context.run("generate-sdk-code", async () => {
      const box = await Box.get(boxId);

      await box.agent.run({
        prompt: buildPrompt(messages),
        webhook: { url: webhook.webhookUrl },
      });
    });

    const result = await context.waitForWebhook("wait-agent", webhook, "1h");

    if (result.timeout) {
      return { error: "Timed out waiting for the Box agent." };
    }

    const payload = (await result.request.json()) as WebhookPayload;

    if (payload.status === "failed") {
      return { error: payload.error ?? "The Box agent failed." };
    }

    return {
      output: payload.output ?? "",
      boxId: payload.box_id,
      runId: payload.run_id,
    };
  },
  {
    // The chat UI posts to this route directly, so requests are not QStash-signed.
    receiver: undefined,
  },
);
