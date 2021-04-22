const Command = require('../Structures/Command');
const CoinGecko = require('coingecko-api');
const CoinGeckoClient = new CoinGecko();
const sql = require("sqlite");
const sqlite3 = require("sqlite3");

async function getCoin$(coin) {
	return await CoinGeckoClient.coins.fetch(coin, {});
}

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			prefix: '!c',
			aliases: ['follow'],
			description: 'Follow a coin',
			category: 'Utilities',
		});
	}

	async run(message, [coin]) {
		const coinData = await getCoin$(coin);

		if (!coinData.success) {
			return message.channel.send(`Could not follow coin with given id \`${coin}\``);
		}

		const db = await sql.open({
			filename: 'database.sqlite',
			driver: sqlite3.Database
		});

		const user = await db.get(`SELECT * FROM users WHERE id = ${message.author.id.toString()}`);

		const coinToFollow = {
			user_id:message.author.id.toString(),
			coin_id: coinData.data['id'],
			coin_name: coinData.data['name']
		};

		if (user) {
			const userCoins = await db.all(`SELECT * FROM user_coin where user_id = ${message.author.id.toString()}`);

			if (userCoins) {
				if (userCoins.length > 4) {
					return message.channel.send(`You cannot follow more than 5 coins!`);
				}

				if (userCoins.filter(coin => coin['coin_id'] === coinToFollow['coin_id']).length > 0) {
					return message.channel.send(`You already follow ${coinToFollow['coin_name']}!`);
				}
			}

			db.run("INSERT INTO user_coin (user_id, coin_alert, coin_name, coin_id) VALUES (?, ?, ?, ?)", [coinToFollow['user_id'], 0, coinToFollow['coin_name'], coinToFollow['coin_id']]).then((result) => {
				return message.channel.send(`Now following ${coinToFollow['coin_name']}`);
			});
		} else {
			return message.channel.send(`No user profile found. Make sure you have created a profile before using this command. `);
		}
	}
};
