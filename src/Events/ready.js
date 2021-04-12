const Event = require('../Structures/Event');
const sql = require("sqlite");
const sqlite3 = require("sqlite3");

module.exports = class extends Event {

	constructor(...args) {
		super(...args, {
			once: true
		});
	}

	async run() {
		console.log([
			`Logged in as ${this.client.user.tag}`,
			`Loaded ${this.client.commands.size} commands!`,
			`Loaded ${this.client.events.size} events!`
		].join('\n'));

		this.client
			.login()
			.then(this.client.user.setActivity('!c commands', { type: 'LISTENING' }));

		const db = await sql.open({
			filename: '/tmp/database.db',
			driver: sqlite3.Database
		});

		const users$ = await db.run("CREATE TABLE IF NOT EXISTS users (id TEXT)");
		const userCoins$ = await db.run("CREATE TABLE IF NOT EXISTS user_coin (user_id TEXT, coin_alert BIT, coin_name TEXT, coin_id TEXT, PRIMARY KEY(user_id, coin_id) FOREIGN KEY(user_id) REFERENCES users(id))")
			.catch(err => {
				console.log(err);
			});

		console.log(userCoins$);
		// sql.open({
		// 	filename: '/tmp/database.db',
		// 	driver: sqlite3.Database
		// }).then((db) => {
		// 	// db.run("DROP TABLE user_coin").catch(error => console.log(error));
		//
		// 	db.run("CREATE TABLE IF NOT EXISTS users (id TEXT)");
		// 	db.run("CREATE TABLE IF NOT EXISTS user_coin (user_id TEXT, coin_alert BIT, coin_name TEXT, coin_id TEXT, PRIMARY KEY(user_id, coin_id) FOREIGN KEY(user_id) REFERENCES users(id))")
		// 		.catch(err => {
		// 			console.log(err);
		// 		});
		// })
	}

};
