import express from 'express'
import payload from 'payload'
import { env } from './env'

const app = express()

// Redirect root to Admin panel
app.get('/', (_, res) => {
  res.redirect('/admin')
})

const start = async (): Promise<void> => {
  await payload.init({
    secret: env.PAYLOAD_SECRET,
    mongoURL: env.MONGODB_URI,
    express: app,
    onInit: () => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
      payload.logger.info(`Payload Admin URL: ${payload.getAdminURL()}`)
    },
  })

  app.listen(env.PORT)
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
  payload.logger.info(`Payload is listening on port ${env.PORT}`)
}

start().catch(console.error)
