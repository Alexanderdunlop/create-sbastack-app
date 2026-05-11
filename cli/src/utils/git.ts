import { runCommand } from "./process.js";

export async function initGit(targetDir: string): Promise<void> {
  await runCommand("git", ["init"], targetDir);
  await runCommand("git", ["add", "."], targetDir);
  await runCommand("git", ["commit", "-m", "Initial commit"], targetDir);
}
