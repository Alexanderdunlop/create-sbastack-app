# create-sbastack-app

## 0.4.0

### Minor Changes

- Switch the generated chat template to Vercel Workflow streaming with Upstash Box.

## 0.3.1

### Patch Changes

- Fix generated app setup so existing git worktrees are not reinitialized, generated dependency/build directories are excluded from initial staging, `.gitignore` is created reliably, and the chat workflow route accepts direct browser requests without QStash signature verification.

## 0.3.0

### Minor Changes

- 8e5aa29: Add Upstash Workflow and Box support to the generated chat API template.

## 0.2.0

### Minor Changes

- Generate a chat UI starter app with an AI Gateway-backed chat route.
