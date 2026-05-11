<h1 align="center">
  create-sbastack-app
</h1>

<div align="center">
<a href="https://www.npmjs.com/package/create-sbastack-app" target="_parent">
  <img alt="" src="https://img.shields.io/npm/dm/create-sbastack-app.svg" alt="npm downloads" />
</a>
 <a href="https://github.com/Alexanderdunlop/create-sbastack-app/stargazers" target="_parent">
  <img alt="" src="https://img.shields.io/github/stars/Alexanderdunlop/create-sbastack-app.svg?style=social&label=Star" alt="GitHub stars" />
</a>
</div>

## Table of contents

- <a href="#about">sbastack</a>
- <a href="#getting-started">Getting Started</a>
- <a href="#contributors">Contributors</a>

<h2 id="about">sbastack</h2>

A stack made by [Alex](https://substack.com/@alexjamesdunlop):

- [Next.js](https://nextjs.org)
- [ai sdk](https://ai-sdk.dev)
- [Upstash Workflow](https://upstash.com/docs/workflow)
- [Upstash Box](https://upstash.com/docs/box)

## Upstash Setup

The generated chat API uses Upstash Workflow and Upstash Box, so you need to configure both before running the app.

1. Get your QStash variables from the [QStash getting started guide](https://upstash.com/docs/qstash/overall/getstarted), then add them to `.env`:

```bash
QSTASH_TOKEN=your_qstash_token_here
QSTASH_CURRENT_SIGNING_KEY=your_qstash_current_signing_key_here
QSTASH_NEXT_SIGNING_KEY=your_qstash_next_signing_key_here
```

2. Follow the [Upstash Box quickstart](https://upstash.com/docs/box/overall/quickstart) to create an API key and a Box, then add:

```bash
UPSTASH_BOX_API_KEY=your_upstash_box_api_key_here
UPSTASH_BOX_ID=your_upstash_box_id_here
```

<h2 id="getting-started">Getting Started</h2>

To scaffold an app using `create-sbastack-app`, run any of the following four commands and answer the command prompt questions:

### npm

```bash
npm create sbastack-app@latest
```

### yarn

```bash
yarn create sbastack-app
```

### pnpm

```bash
pnpm create sbastack-app@latest
```

### bun

```bash
bun create sbastack-app@latest
```

<h2 id="contributors">Contributors</h2>

<a href="https://github.com/Alexanderdunlop/create-sbastack-app/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=Alexanderdunlop/create-sbastack-app" />
</a>

Made with [contrib.rocks](https://contrib.rocks).