import type { PackageJson } from "../types.js";

const MERGED_OBJECT_KEYS = [
  "scripts",
  "dependencies",
  "devDependencies",
  "peerDependencies",
  "optionalDependencies",
] as const;

export function mergePackageJson(base: PackageJson, overlay: PackageJson): PackageJson {
  const merged: PackageJson = {
    ...base,
    ...overlay,
  };

  for (const key of MERGED_OBJECT_KEYS) {
    const value = {
      ...(base[key] ?? {}),
      ...(overlay[key] ?? {}),
    };

    if (Object.keys(value).length > 0) {
      merged[key] = value;
    } else {
      delete merged[key];
    }
  }

  return merged;
}

export function toPackageName(projectName: string): string {
  return projectName
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9._-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-");
}
