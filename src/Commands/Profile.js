const Command = require('../Structures/Command');
const CoinGecko = require('coingecko-api');
const CoinGeckoClient = new CoinGecko();
const Discord = require('discord.js');
const client = new Discord.Client();
const sql = require("sqlite");
const sqlite3 = require("sqlite3");

function getUserProfileCard(user, coins, message) {
	const discordUser = message.guild.members.cache.get(user['id']);

	const embedMsg = new Discord.MessageEmbed()
		.setColor('RANDOM')
		.setTitle(`Hello ${discordUser.user['username']}!`)
		.setThumbnail(`https://cdn.discordapp.com/avatars/${discordUser.user['id']}/${discordUser.user['avatar']}.png`)
		.setTimestamp(new Date());

	let display = '';

	if (coins) {
		let i = 0;
		for (let coin of coins) {
			i++;

			display += `${i}. ${coin['coin_name']} (${coin['coin_id']})\n`;
		}
	}

	const fields = [
		{
			name: 'Portfolio',
			value: `0`, // display portfolio values
			inline: true
		},
		{
			name: 'Following coins',
			value: display || `Not following any coins yet!`,
			inline: true
		},
		{
			name: '\b',
			value: '\b',
			inline: true
		},
	];

	fields.forEach((field) => {
		embedMsg.addField(field.name, field.value, field.inline);
	});

	return embedMsg;
}

module.exports = class extends Command {
	constructor(...args) {
		super(...args, {
			prefix: '!c',
			aliases: ['profile'],
			description: 'Display trending coins',
			category: 'Utilities'
		});
	}

	async run(message, [command]) {
		const db = await sql.open({
			filename: '/tmp/database.db',
			driver: sqlite3.Database
		});

		const user = await db.get(`SELECT * FROM users WHERE id = ${message.author.id.toString()}`);

		if (!user) {
			db.run("INSERT INTO users (id) VALUES (?)", [message.author.id.toString()]);
			return message.channel.send('User profile created!');
		} else {
			const userCoins = await db.all(`SELECT * FROM user_coin where user_id = ${message.author.id.toString()}`);

			return message.channel.send(getUserProfileCard(user, userCoins, message));
		}
	}
};

// SELECT user_coin.coin_id FROM users

// INNER JOIN users ON users.id = user_coin.user_id
// WHERE users.id = 3

// db.get(`SELECT coin_id FROM user_coin where user_id = ${message.author.id.toString()}`).then(row2 => {
// 	console.log(row2);
// });
