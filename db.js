/** Database setup for BizTime. */

const { Client } = require("pg");


let client = new Client({
    host: "localhost",
    user: "postgres",
    port: 5432,
    password: "Christopher#0160",
    database: "biztime",
    
});

client.connect()

module.exports = client
