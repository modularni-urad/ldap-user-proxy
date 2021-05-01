import ldap from 'ldapjs'
// var bunyan = require('bunyan')
// var log = bunyan.createLogger({ name: 'myldap', level: 'debug' })

const server = ldap.createServer({ log: null })

export default server.listen(process.env.LDAP_PORT, '127.0.0.1', () => {
  console.log('LDAP server listening at: ' + server.url)
})

server.bind('o=system', (req, res, next) => {
  res.end()
})

server.search(process.env.LDAP_USERS_SCOPE, (req, res, next) => {
  const obj = {
    dn: req.filter.map(i => (`${i.attribute}=${i.value}`)) +
             ',' + req.dn.toString(),
    attributes: {
      id: process.env.TEST_USER_ID,
      username: process.env.TEST_USER_NAME,
      email: `${req.filter.value}@shire`,
      name: process.env.TEST_USER_NAME,
      objectclass: ['person', 'top']
    }
  }
  res.send(obj)
  res.end()
})

server.unbind((req, res, next) => {
  res.end()
})
