const Command = require('../Structures/Command');
const Discord = require('discord.js');

module.exports = class extends Command {
	constructor(...args) {
		super(...args, {
			aliases: ['commands'],
			description: 'Display all commands',
			category: 'Utilities'
		});
	}

	async run(message) {
		const embedMsg = new Discord.MessageEmbed()
			.setColor('RANDOM')
			.setDescription('Down below you find all possible commands.')
			.setTitle('Help')
			.setTimestamp(new Date());

		const fields = [
			{
				name: '!ping',
				value: `Return the bot latency and CoinGecko API status.`,
				inline: true
			},
			{
				name: '!trending',
				value: `Return the top-7 trending coins on CoinGecko as searched by users in the last 24 hours.`,
				inline: true
			},
			{
				name: `!coin \`id\` \`currency\``,
				value: `Return data from the selected coin. Prices will be returned in EUR by default if currency is missing.`,
				inline: true
			},
		];

		fields.forEach((field) => {
			embedMsg.addField(field.name, field.value, field.inline);
		});

		return message.channel.send(embedMsg);
	}

};
