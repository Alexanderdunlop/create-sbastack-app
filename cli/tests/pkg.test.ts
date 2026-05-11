import { describe, expect, it } from "vitest";
import { mergePackageJson, toPackageName } from "../src/utils/pkg.js";

describe("mergePackageJson", () => {
  it("deep merges package manager fields while preserving overlay values", () => {
    expect(
      mergePackageJson(
        {
          name: "base",
          scripts: {
            dev: "next dev",
          },
          dependencies: {
            next: "^15.0.0",
          },
          devDependencies: {
            typescript: "^5.0.0",
          },
        },
        {
          name: "app",
          scripts: {
            db: "drizzle-kit push",
          },
          dependencies: {
            drizzle: "^1.0.0",
          },
        },
      ),
    ).toEqual({
      name: "app",
      scripts: {
        dev: "next dev",
        db: "drizzle-kit push",
      },
      dependencies: {
        next: "^15.0.0",
        drizzle: "^1.0.0",
      },
      devDependencies: {
        typescript: "^5.0.0",
      },
    });
  });
});

describe("toPackageName", () => {
  it("normalizes arbitrary project names into npm package names", () => {
    expect(toPackageName("My SBA App!")).toBe("my-sba-app");
  });
});
