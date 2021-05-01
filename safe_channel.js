import jwt from 'jsonwebtoken'

const IN_PUB_KEY = process.env.IN_PUB_KEY
const OUT_PRIV_KEY = process.env.OUT_PRIV_KEY

export async function decrypt (cipher) {
  return new Promise(function (resolve, reject) {
    jwt.verify(cipher, IN_PUB_KEY, { algorithm: 'RS256' }, (err, data) => {
      return err ? reject(err) : resolve(data)
    })
  })
}

export function encrypt (data) {
  return new Promise(function (resolve, reject) {
    jwt.sign(data, OUT_PRIV_KEY, { algorithm: 'RS256' }, (err, token) => {
      return err ? reject(err) : resolve(token)
    })
  })
}
