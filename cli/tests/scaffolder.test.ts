import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import { scaffoldProject } from "../src/scaffolder.js";

const tempDirs: string[] = [];

afterEach(async () => {
  await Promise.all(tempDirs.map((dir) => fs.rm(dir, { recursive: true, force: true })));
  tempDirs.length = 0;
});

describe("scaffoldProject", () => {
  it("copies the base template and replaces template variables", async () => {
    const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), "create-sbastack-app-"));
    tempDirs.push(tempDir);

    const targetDir = path.join(tempDir, "my-app");

    await scaffoldProject({
      projectName: "My App",
      targetDir,
      packageManager: "npm",
      skipInstall: true,
      skipGit: true,
    });

    const packageJson = JSON.parse(await fs.readFile(path.join(targetDir, "package.json"), "utf8")) as {
      name: string;
      dependencies: Record<string, string>;
    };
    const page = await fs.readFile(path.join(targetDir, "app/page.tsx"), "utf8");
    const chatRoute = await fs.readFile(path.join(targetDir, "app/api/chat/route.ts"), "utf8");
    const chatStreamRoute = await fs.readFile(
      path.join(targetDir, "app/api/chat/[runId]/stream/route.ts"),
      "utf8",
    );
    const chatHelper = await fs.readFile(path.join(targetDir, "lib/chat.ts"), "utf8");
    const boxChatWorkflow = await fs.readFile(path.join(targetDir, "workflow/box-chat.ts"), "utf8");
    const nextConfig = await fs.readFile(path.join(targetDir, "next.config.ts"), "utf8");
    const envExample = await fs.readFile(path.join(targetDir, ".env.example"), "utf8");
    const gitignore = await fs.readFile(path.join(targetDir, ".gitignore"), "utf8");
    const layout = await fs.readFile(path.join(targetDir, "app/layout.tsx"), "utf8");
    const readme = await fs.readFile(path.join(targetDir, "README.md"), "utf8");
    const favicon = await fs.stat(path.join(targetDir, "app/favicon.ico"));

    expect(packageJson.name).toBe("my-app");
    expect(packageJson.dependencies.next).toBe("16.2.6");
    expect(packageJson.dependencies.ai).toBe("^7.0.0-canary.130");
    expect(packageJson.dependencies["@ai-sdk/react"]).toBe("^4.0.0-canary.131");
    expect(packageJson.dependencies["@ai-sdk/workflow"]).toBe("^1.0.0-canary.46");
    expect(packageJson.dependencies["@upstash/box"]).toBe("^0.4.0");
    expect(packageJson.dependencies.workflow).toBe("^4.2.4");
    expect(packageJson.dependencies).not.toHaveProperty("@upstash/workflow");
    expect(packageJson).not.toHaveProperty("peerDependencies");
    expect(packageJson).not.toHaveProperty("optionalDependencies");
    await expect(fs.stat(path.join(targetDir, "src"))).rejects.toThrow();
    expect(favicon.isFile()).toBe(true);
    expect(page).toContain("WorkflowChatTransport");
    expect(page).toContain("sendMessage({ text: input })");
    expect(chatRoute).toContain("start(boxChat, [messages])");
    expect(chatRoute).toContain("createUIMessageStreamResponse");
    expect(chatRoute).toContain("x-workflow-run-id");
    expect(chatStreamRoute).toContain("getRun(runId)");
    expect(chatStreamRoute).toContain("startIndex");
    expect(chatHelper).toContain("buildPrompt");
    expect(boxChatWorkflow).toContain('"use workflow"');
    expect(boxChatWorkflow).toContain('"use step"');
    expect(boxChatWorkflow).toContain("getWritable<UIMessageChunk>");
    expect(boxChatWorkflow).toContain('type: "finish"');
    expect(boxChatWorkflow).toContain('finishReason: "stop"');
    expect(nextConfig).toContain("withWorkflow(nextConfig)");
    expect(envExample).not.toContain("AI_GATEWAY_API_KEY=");
    expect(envExample).not.toContain("QSTASH_TOKEN=");
    expect(envExample).toContain("UPSTASH_BOX_API_KEY=");
    expect(envExample).toContain("UPSTASH_BOX_ID=");
    expect(gitignore).toContain("/node_modules");
    await expect(fs.stat(path.join(targetDir, "gitignore"))).rejects.toThrow();
    expect(layout).toContain('title: "Create Next App"');
    expect(readme).toContain("bootstrapped with [`create-next-app`]");
    expect(page).not.toContain("{{PROJECT_NAME}}");
  });

  it("rejects non-empty target directories", async () => {
    const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), "create-sbastack-app-"));
    tempDirs.push(tempDir);

    const targetDir = path.join(tempDir, "existing");
    await fs.mkdir(targetDir);
    await fs.writeFile(path.join(targetDir, "file.txt"), "content");

    await expect(
      scaffoldProject({
        projectName: "Existing",
        targetDir,
        packageManager: "npm",
        skipInstall: true,
        skipGit: true,
      }),
    ).rejects.toThrow("already exists and is not empty");
  });
});
