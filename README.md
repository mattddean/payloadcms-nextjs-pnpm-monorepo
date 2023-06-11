# PayloadCMS Next.js PNPM Monorepo Example

A PayloadCMS Next.js monorepo example, using pnpm as its package manager, with an emphasis on end-to-end typesafety.

Next.js queries PayloadCMS with [gqty](https://gqty.dev/).

## Getting Started

1. Set up .env file

   ```sh
   cp .env.example .env
   ```

   Obtain environment variables from a teammate and put them in `.env`.

1. Install colima and docker

   ```sh
   brew install colima
   brew install docker
   ```

1. Start colima

   ```sh
   colima start
   ```

1. Start dev servers and watchers. This will start the next dev server, the payload server, and a mongodb container for payload. It'll also register some file watchers such that when changes are made, generated files are rebuilt.

   ```sh
   pnpm i
   pnpm dev
   ```

1. Go to http://localhost:3004 and http://localhost:3005

## Troubleshooting

1. mongodb docker container won't start

   - Error message: Cannot connect to the Docker daemon at unix:///Users/you/.colima/default/docker.sock. Is the docker daemon running?
   - Solution: Run `colima start`

## Deploy PayloadCMS app to Payload Cloud

Use the following build configuration to install your dependencies with pnpm and to build and serve your PayloadCMS app with Turborepo.

<img width="1008" alt="Screenshot 2023-06-11 at 4 04 45 PM" src="https://github.com/mattddean/payloadcms-nextjs-pnpm-monorepo/assets/29106809/d3923953-3e7a-476c-bb26-d78febc98c63">

## Deploy Next.js app to Vercel

Vercel has built-in Turborepo support. Use the following following build configuration to install your dependencies with pnpm and to build your Next.js app with Turborepo.

<img width="957" alt="Screenshot 2023-06-11 at 3 59 52 PM" src="https://github.com/mattddean/payloadcms-nextjs-pnpm-monorepo/assets/29106809/f1cfc335-d444-4c01-9c38-dc32d36fccc6">
