// we have to put data in the database in order for it to be created since mongo is "create on first use"
db.log.insertOne({ message: 'Database created.' })

db.createUser({
  user: _getEnv('MONGO_PAYLOAD_USER'),
  pwd: _getEnv('MONGO_PAYLOAD_PASSWORD'),
  roles: [
    {
      role: 'readWrite',
      db: _getEnv('MONGO_INITDB_DATABASE'),
    },
  ],
})
