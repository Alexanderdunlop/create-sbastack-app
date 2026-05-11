import path from "node:path";
import { fileURLToPath } from "node:url";
import fs from "fs-extra";
import { installDependencies } from "./installers/index.js";
import type { PackageJson, ScaffoldOptions } from "./types.js";
import { assertTargetDirectory, replaceTemplateVariables } from "./utils/fs.js";
import { initGit } from "./utils/git.js";
import { mergePackageJson, toPackageName } from "./utils/pkg.js";

const distDir = path.dirname(fileURLToPath(import.meta.url));
const packageRoot = path.resolve(distDir, "..");
const defaultTemplateDir = path.join(packageRoot, "templates", "base");

export async function scaffoldProject(options: ScaffoldOptions): Promise<void> {
  const targetDir = path.resolve(options.targetDir);
  const templateDir = options.templateDir ?? defaultTemplateDir;
  const packageName = toPackageName(options.projectName);

  await assertTargetDirectory(targetDir);
  await fs.ensureDir(targetDir);
  await fs.copy(templateDir, targetDir, {
    overwrite: true,
    errorOnExist: false,
  });
  await writeGitignore(targetDir);

  await writePackageJson(targetDir, {
    name: packageName,
  });

  await replaceTemplateVariables(targetDir, {
    PROJECT_NAME: options.projectName,
    PACKAGE_NAME: packageName,
  });

  if (!options.skipInstall) {
    await installDependencies(targetDir, options.packageManager);
  }

  if (!options.skipGit) {
    await initGit(targetDir);
  }
}

async function writePackageJson(targetDir: string, overrides: PackageJson): Promise<void> {
  const packageJsonPath = path.join(targetDir, "package.json");
  const basePackageJson = (await fs.readJson(packageJsonPath)) as PackageJson;
  const packageJson = mergePackageJson(basePackageJson, overrides);

  await fs.writeJson(packageJsonPath, packageJson, { spaces: 2 });
}

async function writeGitignore(targetDir: string): Promise<void> {
  const packageSafeTemplatePath = path.join(targetDir, "gitignore");

  if (await fs.pathExists(packageSafeTemplatePath)) {
    await fs.move(packageSafeTemplatePath, path.join(targetDir, ".gitignore"), {
      overwrite: true,
    });
  }
}
