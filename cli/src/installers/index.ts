import type { PackageManager } from "../types.js";
import { runCommand } from "../utils/process.js";

export async function installDependencies(targetDir: string, packageManager: PackageManager): Promise<void> {
  await runCommand(packageManager, ["install"], targetDir);
}
