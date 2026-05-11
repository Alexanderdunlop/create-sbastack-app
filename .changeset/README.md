# Changesets

This repo uses [Changesets](https://github.com/changesets/changesets) to manage CLI releases.

Run `pnpm changeset` when you make a notable change. When you are ready to release, run `pnpm changeset:version`, commit the generated version and changelog changes, then run `pnpm release` to publish the CLI package.
