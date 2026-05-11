import { createUIMessageStreamResponse, type UIMessage } from "ai";
import { start } from "workflow/api";
import { boxChat } from "@/workflow/box-chat";

export async function POST(request: Request) {
  const { messages }: { messages: UIMessage[] } = await request.json();
  const run = await start(boxChat, [messages]);

  return createUIMessageStreamResponse({
    stream: run.readable,
    headers: {
      "x-workflow-run-id": run.runId,
    },
  });
}
