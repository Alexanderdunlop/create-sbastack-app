import { createUIMessageStreamResponse } from "ai";
import { type NextRequest } from "next/server";
import { getRun } from "workflow/api";

type RouteContext = {
  params: Promise<{
    runId: string;
  }>;
};

export async function GET(
  request: NextRequest,
  context: RouteContext,
) {
  const { runId } = await context.params;
  const startIndex = Number(new URL(request.url).searchParams.get("startIndex") ?? "0");
  const run = await getRun(runId);

  return createUIMessageStreamResponse({
    stream: run.getReadable({ startIndex }),
    headers: {
      "x-workflow-run-id": runId,
    },
  });
}
