import ldap from 'ldapjs'
import { Pool } from 'ldap-pool'
const entry2Profile = require(process.env.ENTRY2PROFILE_MODULE)

const LDAPOPTS = {
  url: process.env.LDAP_URL,
  userScope: process.env.LDAP_USERS_SCOPE
}

const clientOpts = {
  url: LDAPOPTS.url,
  connectTimeout: 1000,
  tlsOptions: { rejectUnauthorized: false }
}

const pool = Pool.create({
  connOpts: {
    url: LDAPOPTS.url,
    reconnect: true,
    idleTimeout: 30000
  },
  size: process.env.LDAP_POOL_SIZE || 3,
  dn: process.env.LDAP_ADMIN_DN,
  pwd: process.env.LDAP_ADMIN_PWD
})

const desiredAttrs = process.env.LDAP_DESIRED_ATTRS.split(',')

function _search (client, filter, attributes = desiredAttrs) {
  return new Promise((resolve, reject) => {
    const opts = { filter, scope: 'sub', attributes }
    client.search(LDAPOPTS.userScope, opts, function (err, res) {
      if (err) return reject(err)
      const rs = []

      res.on('searchEntry', (entry) => {
        rs.push(entry2Profile(entry.toObject()))
      })
      res.on('error', (err) => { reject(err) })
      res.on('end', (result) => { resolve(rs) })
    })
  })
}

async function findProfiles (query) {
  const client = await pool.getClient()
  try {
    return _search(client, `(cn=*${query}*)`)
  } finally {
    client.returnToPool()
  }
}

async function getProfiles (filter) {
  const query = filter.uids.map(i => {
    return `(id=${i})`
  }).join('|')
  const client = await pool.getClient()
  try {
    return _search(client, query)
  } finally {
    client.returnToPool()
  }
}

function _login (client, body) {
  return new Promise(function (resolve, reject) {
    const opts = { filter: `(cn=${body.username})`, scope: 'sub', desiredAttrs }
    client.search(LDAPOPTS.userScope, opts, function (err, res) {
      if (err) return reject(err)
      let found = null

      res.on('searchEntry', (entry) => { found = entry })
      res.on('error', reject)
      res.on('end', (result) => {
        if (found === null) return reject(404)
        const c = ldap.createClient(clientOpts)
        c.bind(found.objectName, body.password, (err) => {
          const profile = entry2Profile(found.toObject())
          return err ? reject(err) : resolve(profile)
        })
      })
    })
  })
}

async function login (body) {
  const client = await pool.getClient()
  try {
    return _login(client, body)
  } finally {
    client.returnToPool()
  }
}

export default { login, findProfiles, getProfiles }
