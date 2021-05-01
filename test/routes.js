/* global describe it */
const chai = require('chai')
chai.should()
const safeRoute = require('../safe_channel')
// import _ from 'underscore'

module.exports = (g) => {
  //
  const r = chai.request(g.baseurl)

  const p1 = {
    username: process.env.TEST_USER_NAME,
    password: 'secret'
  }

  return describe('ldap-user-proxy', () => {
    //
    it('shall login user p1', async () => {
      const data = await safeRoute.encrypt(p1)
      const res = await r.get('/login').send({ content: data })
      res.status.should.equal(200)
      const result = await safeRoute.decrypt(res.body.content)
      result.username.should.equal(p1.username)
    })

    it('shall return info about user p1', async () => {
      const data = await safeRoute.encrypt({ uids: [process.env.TEST_USER_ID] })
      const res = await r.get('/get').send({ content: data })
      res.status.should.equal(200)
      const result = await safeRoute.decrypt(res.body.content)
      result.found.length.should.equal(1)
      result.found[0].username.should.equal(p1.username)
    })
  })
}
