import path from "node:path";
import { cancel, intro, isCancel, outro, spinner, text } from "@clack/prompts";
import { Command } from "commander";
import pc from "picocolors";
import { scaffoldProject } from "./scaffolder.js";

interface CliOptions {
  skipInstall?: boolean;
  skipGit?: boolean;
  usePnpm?: boolean;
}

export async function runCli(argv = process.argv): Promise<void> {
  const program = new Command()
    .name("create-sbastack-app")
    .description("Scaffold a new sbastack app")
    .argument("[project-name]", "Name of the project to create")
    .option("--skip-install", "Do not install dependencies")
    .option("--skip-git", "Do not initialize a git repository")
    .option("--use-pnpm", "Use pnpm instead of npm in the generated project")
    .version("0.1.0")
    .parse(argv);

  const options = program.opts<CliOptions>();
  let projectName = program.args[0];

  intro(pc.cyan("create-sbastack-app v0.1.0"));

  if (!projectName) {
    const result = await text({
      message: "What's your project name?",
      placeholder: "my-app",
      defaultValue: "my-app",
      validate(value) {
        if (!value?.trim()) {
          return "Project name is required.";
        }
      },
    });

    if (isCancel(result)) {
      cancel("Cancelled.");
      process.exit(0);
    }

    projectName = result;
  }

  const targetDir = path.resolve(process.cwd(), projectName);
  const s = spinner();

  try {
    s.start("Creating project...");
    await scaffoldProject({
      projectName,
      targetDir,
      packageManager: options.usePnpm ? "pnpm" : "npm",
      skipInstall: options.skipInstall ?? false,
      skipGit: options.skipGit ?? false,
    });
    s.stop("Created project.");
  } catch (error) {
    s.stop("Project creation failed.");
    cancel(error instanceof Error ? error.message : "Unknown error");
    process.exit(1);
  }

  outro(`${pc.green("Done!")} Next steps:
  cd ${projectName}
  ${options.skipInstall ? (options.usePnpm ? "pnpm install" : "npm install") : ""}
  ${options.usePnpm ? "pnpm dev" : "npm run dev"}`);
}
