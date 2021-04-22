const Command = require('../Structures/Command');
const CoinGecko = require('coingecko-api');
const CoinGeckoClient = new CoinGecko();
const Discord = require('discord.js');

async function getTrendingCoin$() {
	return await CoinGeckoClient.trending();
}

module.exports = class extends Command {
	constructor(...args) {
		super(...args, {
			prefix: '!c',
			aliases: ['trending'],
			description: 'Display trending coins',
			category: 'Utilities'
		});
	}

	async run(message) {
		const coinData = await getTrendingCoin$();

		console.log(coinData);
		const embedMsg = new Discord.MessageEmbed()
			.setColor('RANDOM')
			.setDescription('Top-7 trending coins on CoinGecko as searched by users in the last 24 hours')
			.setTitle('Trending')
			.setTimestamp(new Date());

		let i = 0;

		for (let coin of coinData.data['coins']) {
			i++;

			embedMsg.addField(`#${i} ${coin.item['name']}`, `Market cap rank: ${coin.item['market_cap_rank']}\nhttps://www.coingecko.com/nl/coins/${coin.item['id']}`, false);
		}

		message.channel.send(embedMsg);
	}

};
