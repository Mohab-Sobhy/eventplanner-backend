const {clinet} = require('pg')
const clinet = new client({
    host:"localhost",
    user:"postgres",
    port:5432,
    password:"rootUser",
    database:"postgres"
})

client.connect