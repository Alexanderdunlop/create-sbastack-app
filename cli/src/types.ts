export type PackageManager = "npm" | "pnpm";

export interface ScaffoldOptions {
  projectName: string;
  targetDir: string;
  packageManager: PackageManager;
  skipInstall: boolean;
  skipGit: boolean;
  templateDir?: string;
}

export interface PackageJson {
  name?: string;
  version?: string;
  private?: boolean;
  type?: string;
  scripts?: Record<string, string>;
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
  [key: string]: unknown;
}
