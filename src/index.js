// require the our additons to the Discord.js Client Class.
const MDClient = require('./Structures/MDClient');
// get out token, prefix and owners.
const config = require('../config.json');

// creates a new instance of the Client.
const client = new MDClient(config);
const sql = require("sqlite");
const sqlite3 = require("sqlite3");

// login to the websocket, load the events and commands.
client.start();

// Set bot status
client.on('ready', () => {
    client
        .login()
        .then(client.user.setActivity('!c commands', { type: 'LISTENING' }));

    sql.open({
        filename: '/tmp/database.db',
        driver: sqlite3.Database
    }).then((db) => {
        // db.run("DROP TABLE user_coin").catch(error => console.log(error));

        db.run("CREATE TABLE IF NOT EXISTS users (id TEXT)");
        db.run("CREATE TABLE IF NOT EXISTS user_coin (user_id TEXT, coin_name TEXT, coin_id TEXT, PRIMARY KEY(user_id, coin_id) FOREIGN KEY(user_id) REFERENCES users(id))").catch(err => {
            console.log(err);
        });
    })
});
