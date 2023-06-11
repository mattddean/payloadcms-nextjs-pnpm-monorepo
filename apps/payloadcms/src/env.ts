import { createEnv } from '@t3-oss/env-core'
import { z } from 'zod'

export const env = createEnv({
  clientPrefix: 'PAYLOAD_PUBLIC_',
  /**
   * Specify your server-side environment variables schema here. This way you can ensure the app isn't built with
   * invalid env vars.
   * t3-env will run `typeof window === 'undefined'` to determine if the current environment is a server environment
   * and if it isn't, it will throw an error when trying to access one of these server-only environment variables.
   */
  server: {
    PAYLOAD_SECRET: z.string(),
    MONGODB_URI: z.string(),
    PORT: z.string(),
  },
  /**
   * Specify your client-side environment variables schema here.
   * For them to be exposed to the client, prefix them with `PAYLOAD_PUBLIC_`.
   */
  client: {
    PAYLOAD_PUBLIC_SERVER_URL: z.string(),
  },
  /**
   * Destructure all variables from `process.env` to make sure they aren't tree-shaken away.
   */
  runtimeEnvStrict: {
    PAYLOAD_SECRET: process.env.PAYLOAD_SECRET,
    MONGODB_URI: process.env.MONGODB_URI,
    PORT: process.env.PORT,
    PAYLOAD_PUBLIC_SERVER_URL: process.env.PAYLOAD_PUBLIC_SERVER_URL,
  },
  skipValidation: !!process.env.CI || !!process.env.SKIP_ENV_VALIDATION,
})
