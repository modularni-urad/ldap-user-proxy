import path from 'path'

process.env.NODE_ENV = 'test'
process.env.IN_PUB_KEY = path.join(__dirname, 'jwtRS256.key.pub')
process.env.OUT_PRIV_KEY = path.join(__dirname, 'jwtRS256.key')

process.env.LDAP_PORT = 3899
process.env.LDAP_URL = `ldap://localhost:${process.env.LDAP_PORT}`
process.env.LDAP_POOL_SIZE = '1'
process.env.LDAP_ADMIN_DN = 'cn=gandalf,ou=sa,o=system'
process.env.LDAP_ADMIN_PWD = 'secretWhisper'
process.env.LDAP_USERS_SCOPE = 'ou=sa,o=system'
process.env.LDAP_DESIRED_ATTRS = 'id,username,name,email'
process.env.ENTRY2PROFILE_MODULE = path.join(__dirname, 'customEntry2Profile.js')
process.env.TEST_USER_ID = '10'
process.env.TEST_USER_NAME = 'frodo'
