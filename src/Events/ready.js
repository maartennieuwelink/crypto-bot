const Event = require('../Structures/Event');
const sql = require("sqlite");
const sqlite3 = require("sqlite3");
const CoinGecko = require('coingecko-api');
const CoinGeckoClient = new CoinGecko();
const Discord = require('discord.js');
const client = new Discord.Client();

async function getCoin$(coin) {
	return await CoinGeckoClient.coins.fetch(coin, {});
}

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
			filename: 'database.sqlite',
			driver: sqlite3.Database
		});

		// db.run("DROP TABLE users").catch(error => console.log(error));
		// db.run("DROP TABLE user_coin").catch(error => console.log(error));
		// db.run("DROP TABLE user_coin_notifications").catch(error => console.log(error));


		const user$ = await db.run("CREATE TABLE IF NOT EXISTS users (id TEXT)");

		const userCoins$ = await db.run("CREATE TABLE IF NOT EXISTS user_coin (user_id TEXT, coin_alert BIT, coin_name TEXT, coin_id TEXT, PRIMARY KEY(user_id, coin_id) FOREIGN KEY(user_id) REFERENCES users(id))")
			.catch(err => {
				console.log(err);
			});

		const userCoinNotifications$ = await db.run("CREATE TABLE IF NOT EXISTS user_coin_notifications (user_id TEXT, notification_type TEXT, notification_value TEXT, coin_id TEXT, PRIMARY KEY(user_id, coin_id) FOREIGN KEY(user_id) REFERENCES users(id))")
			.catch(err => {
				console.log(err);
			});

		if (user$ && userCoins$ && userCoinNotifications$) {
			const users = await db.all(`SELECT * FROM users`);

			if (users) {
				const userIds = Object.keys(users).map((user) =>  users[user]['id']);

				for (const id of userIds) {
					// const userCoins = await db.all(`SELECT * FROM user_coin where user_id = ${id}`);
					const userCoinNotifications = await db.all(`SELECT * FROM user_coin_notifications where user_id = ${id}`);

					if (userCoinNotifications) {
						for (const coinNotification of userCoinNotifications) {
							// const coinData = await getCoin$(coinNotification.coin_id);

							// if (coinData && coinNotification) {
							// 	switch (coinNotification.notification_type) {
							// 		case 'price':
							// 			if (coinData.data.market_data['current_price']['eur'] >= Number(coinNotification.notification_value)) {
							// 				setInterval(() => {
							// 					this.client.channels.fetch('805772240418635827').then(channel => {
							// 						channel.send(`<@${id}> The price of ${coinData.data['name']} is currently € ${coinData.data.market_data['current_price']['eur']}`);
							// 					});
							// 				}, 60000);
							// 			}
							// 			break;
							// 		default:
							// 			return;
							// 	}
							// }
						}
						// setInterval(() => {
						// 	console.log('hoi');
						// }, 60000);
					}
				}
			}
		}

	}

};
