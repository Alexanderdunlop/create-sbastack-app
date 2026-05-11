import path from "node:path";
import fs from "fs-extra";

const TEXT_FILE_EXTENSIONS = new Set([
  ".css",
  ".cjs",
  ".js",
  ".json",
  ".md",
  ".mjs",
  ".ts",
  ".tsx",
  ".txt",
  ".yml",
  ".yaml",
]);

export async function assertTargetDirectory(targetDir: string): Promise<void> {
  if (!(await fs.pathExists(targetDir))) {
    return;
  }

  const entries = await fs.readdir(targetDir);
  if (entries.length > 0) {
    throw new Error(`Target directory "${targetDir}" already exists and is not empty.`);
  }
}

export async function replaceTemplateVariables(
  targetDir: string,
  variables: Record<string, string>,
): Promise<void> {
  const files = await listFiles(targetDir);

  await Promise.all(
    files.filter(isTextFile).map(async (file) => {
      let contents = await fs.readFile(file, "utf8");

      for (const [key, value] of Object.entries(variables)) {
        contents = contents.replaceAll(`{{${key}}}`, value);
      }

      await fs.writeFile(file, contents);
    }),
  );
}

async function listFiles(dir: string): Promise<string[]> {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const files = await Promise.all(
    entries.map(async (entry) => {
      const fullPath = path.join(dir, entry.name);
      return entry.isDirectory() ? listFiles(fullPath) : [fullPath];
    }),
  );

  return files.flat();
}

function isTextFile(file: string): boolean {
  const basename = path.basename(file);

  return basename.startsWith(".") || TEXT_FILE_EXTENSIONS.has(path.extname(file));
}
