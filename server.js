import express from 'express'
import morgan from 'morgan'
import initRoutes from './routes'

export function init (mocks = null) {
  const app = express()
  app.use(morgan('dev'))

  initRoutes(app)

  app.use(mocks ? mocks.errorHandler : (err, req, res, next) => { // ERROR HANDLING
    const status = err.status ||
      isNaN(Number(err.message)) ? 400 : Number(err.message)
    res.status(status).send(err.message || err.toString())
  })
  return app
}

if (process.env.NODE_ENV !== 'test') {
  const host = process.env.HOST || '127.0.0.1'
  const port = process.env.PORT || 3000

  init().listen(port, host, (err) => {
    if (err) throw err
    console.log(`frodo do magic on ${host}:${port}`)
  })
}
