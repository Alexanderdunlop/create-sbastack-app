import { runCommand } from "./process.js";

export async function initGit(targetDir: string): Promise<void> {
  if (await isInsideGitWorkTree(targetDir)) {
    return;
  }

  await runCommand("git", ["init"], targetDir);
  await runCommand(
    "git",
    [
      "add",
      "-A",
      "--",
      ".",
      ":(exclude)node_modules",
      ":(exclude).next",
      ":(exclude)out",
      ":(exclude)build",
      ":(exclude)coverage",
      ":(exclude).vercel",
    ],
    targetDir,
  );
  await runCommand("git", ["commit", "-m", "Initial commit"], targetDir);
}

async function isInsideGitWorkTree(targetDir: string): Promise<boolean> {
  try {
    await runCommand("git", ["rev-parse", "--is-inside-work-tree"], targetDir, {
      stdio: "ignore",
    });
    return true;
  } catch {
    return false;
  }
}
