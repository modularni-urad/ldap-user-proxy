import bodyParser from 'body-parser'
import ldapusers from './ldap'
import { decrypt, encrypt } from './safe_channel'

export default (app) => {
  //
  app.get('/login', bodyParser.json(), async (req, res, next) => {
    try {
      const data = await decrypt(req.body.content)
      const user = await ldapusers.login(data)
      const backMessage = await encrypt(user)
      res.send({ content: backMessage })
    } catch (e) {
      next(e)
    }
  })

  app.get('/get', bodyParser.json(), async (req, res, next) => {
    try {
      const data = await decrypt(req.body.content)
      const users = await ldapusers.getProfiles(data)
      const backMessage = await encrypt({ found: users })
      res.send({ content: backMessage })
    } catch (e) {
      next(e)
    }
  })

  app.get('/find', bodyParser.json(), async (req, res, next) => {
    try {
      const data = await decrypt(req.body.content)
      const users = await ldapusers.findProfiles(data)
      const backMessage = await encrypt({ found: users })
      res.send({ content: backMessage })
    } catch (e) {
      next(e)
    }
  })
}
