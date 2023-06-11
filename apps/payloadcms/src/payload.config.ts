import path from 'path'
import { payloadCloud } from '@payloadcms/plugin-cloud'
import { buildConfig } from 'payload/config'
import { usersCollection } from './collections/users'
import { env } from './env'

const mockModulePath = path.resolve(__dirname, './empty-module-mock.js')

export default buildConfig({
  admin: {
    user: usersCollection.slug,
    components: {},
    webpack: (config) => ({
      ...config,
      resolve: {
        ...config.resolve,
        alias: {
          ...(config.resolve.alias || {}),
          express: mockModulePath,
        },
      },
    }),
  },
  serverURL: env.PAYLOAD_PUBLIC_SERVER_URL,
  collections: [usersCollection],
  globals: [],
  typescript: {
    outputFile: path.resolve(__dirname, 'payload-types.ts'),
  },
  graphQL: {
    schemaOutputFile: path.resolve(__dirname, 'generated-schema.graphql'),
  },
  plugins: [payloadCloud()],
})
