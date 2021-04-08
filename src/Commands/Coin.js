const { MessageEmbed } = require('discord.js');
const Command = require('../Structures/Command');
const CoinGecko = require('coingecko-api');
const CoinGeckoClient = new CoinGecko();
const Discord = require('discord.js');

async function getCoin(coin) {
    return await CoinGeckoClient.coins.fetch(coin, {});
}

function getCircle(int) {
    return int > 0 ? ':green_circle:' : ':red_circle:'
}

module.exports = class extends Command {

    constructor(...args) {
        super(...args, {
            aliases: ['coin'],
            description: 'Displays all the commands in the bot',
            category: 'Utilities',
            usage: '[command]'
        });
    }

    async run(message, [command]) {
        const coin = await getCoin(command);

        if (!coin.success) {
            return message.channel.send(coin.data['error']);
        }

        console.log(coin.image);
        const embedCoinData = new Discord.MessageEmbed()
            .setColor('RANDOM')
            .setTitle(coin.data['name'])
            .setThumbnail(coin.data.image['thumb'])
            .setTimestamp(new Date());

        console.log(coin.data.market_data['current_price']);
        const fields = [
            {name: 'Current price', value: `€ ${coin.data.market_data['current_price']['eur']}`, inline: true},
            {
                name: 'Last hour',
                value: `${getCircle(coin.data.market_data['price_change_percentage_1h_in_currency']['eur'])} ${coin.data.market_data['price_change_percentage_1h_in_currency']['eur']}%`,
                inline: true
            },
            {name: 'Last day', value: `${getCircle(coin.data.market_data['price_change_percentage_24h_in_currency']['eur'])} ${coin.data.market_data['price_change_percentage_24h_in_currency']['eur']}%`, inline: true},
            {name: 'Last 7 days', value: `${getCircle(coin.data.market_data['price_change_percentage_7d_in_currency']['eur'])} ${coin.data.market_data['price_change_percentage_7d_in_currency']['eur']}%`, inline: true},
            {name: 'ATH', value: `€ ${coin.data.market_data['ath']['eur']}`, inline: true},
            {name: 'ATL', value: `€ ${coin.data.market_data['atl']['eur']}`, inline: true},
        ];

        fields.forEach((field, index) => {
            if (index === 2 || index === 4) {
                embedCoinData.addField("** **", "** **");
            }

            embedCoinData.addField(field.name, field.value, field.inline);
        });

        return message.channel.send(embedCoinData);
    }

};
