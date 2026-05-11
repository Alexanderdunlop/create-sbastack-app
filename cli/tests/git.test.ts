import { beforeEach, describe, expect, it, vi } from "vitest";
import { initGit } from "../src/utils/git.js";
import { runCommand } from "../src/utils/process.js";

vi.mock("../src/utils/process.js", () => ({
  runCommand: vi.fn(),
}));

const runCommandMock = vi.mocked(runCommand);

describe("initGit", () => {
  beforeEach(() => {
    runCommandMock.mockReset();
  });

  it("skips git initialization when the target is already inside a worktree", async () => {
    runCommandMock.mockResolvedValueOnce();

    await initGit("/tmp/app");

    expect(runCommandMock).toHaveBeenCalledTimes(1);
    expect(runCommandMock).toHaveBeenCalledWith(
      "git",
      ["rev-parse", "--is-inside-work-tree"],
      "/tmp/app",
      { stdio: "ignore" },
    );
  });

  it("excludes generated dependency and build directories when staging a new repository", async () => {
    runCommandMock.mockRejectedValueOnce(new Error("not a worktree"));
    runCommandMock.mockResolvedValue();

    await initGit("/tmp/app");

    expect(runCommandMock).toHaveBeenNthCalledWith(2, "git", ["init"], "/tmp/app");
    expect(runCommandMock).toHaveBeenNthCalledWith(
      3,
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
      "/tmp/app",
    );
    expect(runCommandMock).toHaveBeenNthCalledWith(4, "git", ["commit", "-m", "Initial commit"], "/tmp/app");
  });
});
