import { FSWatcher, defineConfig } from 'turbowatch'

export default defineConfig({
  Watcher: FSWatcher,
  project: __dirname,
  triggers: [
    {
      expression: ['allof', ['not', ['dirname', 'node_modules']], ['not', ['match', 'payload-types.ts', 'basename']], ['match', '*.ts', 'basename']],
      name: 'payload',
      onChange: async ({ spawn }) => {
        // start/restart payload dev server
        await spawn`pnpm dev:payload`
      },
      // this is the persistent payload server
      persistent: true,
      // start the payload server before any code changes are made
      initialRun: true,
    },
  ],
})
