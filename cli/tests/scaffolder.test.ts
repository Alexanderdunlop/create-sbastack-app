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
    const envExample = await fs.readFile(path.join(targetDir, ".env.example"), "utf8");
    const layout = await fs.readFile(path.join(targetDir, "app/layout.tsx"), "utf8");
    const readme = await fs.readFile(path.join(targetDir, "README.md"), "utf8");
    const favicon = await fs.stat(path.join(targetDir, "app/favicon.ico"));

    expect(packageJson.name).toBe("my-app");
    expect(packageJson.dependencies.next).toBe("16.2.6");
    expect(packageJson.dependencies.ai).toBe("6.0.177");
    expect(packageJson.dependencies["@ai-sdk/react"]).toBe("3.0.179");
    expect(packageJson.dependencies["@upstash/box"]).toBe("^0.4.0");
    expect(packageJson.dependencies["@upstash/workflow"]).toBe("^1.2.1");
    expect(packageJson).not.toHaveProperty("peerDependencies");
    expect(packageJson).not.toHaveProperty("optionalDependencies");
    await expect(fs.stat(path.join(targetDir, "src"))).rejects.toThrow();
    expect(favicon.isFile()).toBe(true);
    expect(page).toContain('api: "/api/chat"');
    expect(page).toContain("sendMessage({ text: input })");
    expect(chatRoute).toContain('@upstash/workflow/nextjs');
    expect(chatRoute).toContain("Box.get(boxId)");
    expect(chatRoute).toContain('context.waitForWebhook("wait-agent", webhook, "1h")');
    expect(envExample).toContain("AI_GATEWAY_API_KEY=");
    expect(envExample).toContain("QSTASH_TOKEN=");
    expect(envExample).toContain("UPSTASH_BOX_API_KEY=");
    expect(envExample).toContain("UPSTASH_BOX_ID=");
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
