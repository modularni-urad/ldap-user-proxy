# ldap-user-proxy

API pro ziskavani informaci zasifrovanym kanalem z LDAP user databaze.
Sifrovani dat do JWT pomoci PEM certifikatu.

```
ssh-keygen -t rsa -b 4096 -m PEM -f jwtRS256.key
# Don't add passphrase
openssl rsa -in jwtRS256.key -pubout -outform PEM -out jwtRS256.key.pub
```

## SETTINGS

Pouze pomoci ENVIRONMENT VARIABLES:

```
PORT=30011
HOST=0.0.0.0
IN_PUB_KEY='/path/to/my/public.key.pub'
OUT_PRIV_KEY = '/path/to/my/private.key'
LDAP_PORT = 3899
LDAP_URL = `ldap://localhost:${LDAP_PORT}`
LDAP_POOL_SIZE = '1'
LDAP_ADMIN_DN = 'cn=gandalf,ou=sa,o=system'
LDAP_ADMIN_PWD = 'secretWhisper'
LDAP_USERS_SCOPE = 'ou=sa,o=system'
LDAP_DESIRED_ATTRS = 'id,username,name,email'
ENTRY2PROFILE_MODULE='/path/toMyCustom/Module'
```
