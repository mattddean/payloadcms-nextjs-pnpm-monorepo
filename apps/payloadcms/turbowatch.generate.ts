import { FSWatcher, defineConfig } from 'turbowatch'

export default defineConfig({
  Watcher: FSWatcher,
  project: __dirname,
  triggers: [
    {
      expression: ['allof', ['not', ['dirname', 'node_modules']], ['not', ['match', 'payload-types.ts', 'basename']], ['match', '*.ts', 'basename']],
      name: 'generate',
      onChange: async ({ spawn }) => {
        await Promise.all([
          // regenerate gql schema and gqty client for website
          spawn`pnpm generate-gql-schema && cd ../nextjs && pnpm generate-gqty-payloadcms && cd -`,
          // regenerate typescript types
          spawn`pnpm generate-types`,
        ])
      },
      // these scripts are not persistent; they just generate files and die
      persistent: false,
      // we run these commands as turborepo dependencies of the payload#dev command, so we don't need to run them again until there are changes
      initialRun: false,
    },
  ],
})
