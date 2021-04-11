const Command = require('../Structures/Command');
const sql = require("sqlite");
const sqlite3 = require("sqlite3");

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			prefix: '!c',
			aliases: ['unfollow'],
			description: 'Unfollow a coin',
			category: 'Utilities',
		});
	}

	async run(message, [coin]) {

		if (!coin) {
			return message.channel.send(`No id found. Make sure you insert a coin id`);
		}

		const db = await sql.open({
			filename: '/tmp/database.db',
			driver: sqlite3.Database
		});

		const user = await db.get(`SELECT * FROM users WHERE id = ${message.author.id.toString()}`);

		if (user) {
			const userCoins = await db.all(`SELECT * FROM user_coin where user_id = ${message.author.id.toString()}`);

			const coinToUnfollow = userCoins.filter(userCoin => userCoin['coin_id'] === coin.toLowerCase())[0];

			if (!coinToUnfollow) {
				return message.channel.send(`No coin found for given id \`${coin}\`. Make sure the id is correct, or you are following this coin.`);
			}

			db.run(`DELETE FROM user_coin WHERE coin_id = '${coinToUnfollow['coin_id']}' AND user_id = ${message.author.id.toString()}`).then((result) => {
				return message.channel.send(`Successfully unfollowed ${coinToUnfollow['coin_name']}`);
			});
		} else {
			return message.channel.send(`No user profile found. Make sure you have created a profile before using this command. `);
		}
	}
};
