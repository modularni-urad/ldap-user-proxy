/* global describe before after */
// const fs = require('fs')
import chai from 'chai'
const chaiHttp = require('chai-http')
chai.use(chaiHttp)

const port = process.env.PORT || 3333
const g = {
  baseurl: `http://localhost:${port}`
}
function errorHandler (err, req, res, next) {
  console.log(err)
  const status = err.status ||
    isNaN(Number(err.message)) ? 400 : Number(err.message)
  res.status(status).send(err.message || err.toString())
}

describe('app', () => {
  before(done => {
    g.ldapServer = require('./utils/ldapServer').default
    const Server = require('../server')
    const app = Server.init({ errorHandler })
    g.server = app.listen(port, '127.0.0.1', (err) => {
      if (err) return done(err)
      setTimeout(done, 1000)
    })
  })
  after(done => {
    g.ldapServer.close()
    g.server.close(err => {
      return err ? done(err) : done()
    })
  })

  describe('API', () => {
    const submodules = [
      './routes'
    ]
    submodules.map((i) => {
      const subMod = require(i)
      subMod(g)
    })
  })
})
