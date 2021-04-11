const Command = require('../Structures/Command');
const CoinGecko = require('coingecko-api');
const CoinGeckoClient = new CoinGecko();

module.exports = class extends Command {
	constructor(...args) {
		super(...args, {
			prefix: '!c',
			aliases: ['pong'],
			description: 'This provides the ping of the bot',
			category: 'Utilities'
		});
	}

	async run(message) {
		let data = await CoinGeckoClient.ping()

		const msg = await message.channel.send('Pinging...');
		const latency = msg.createdTimestamp - message.createdTimestamp;

		msg.edit(`Bot Latency: \`${latency}ms\`, API status: \`${data.success ? data.data['gecko_says'] : 'Down'}\``);
	}

};
