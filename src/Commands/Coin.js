const Command = require('../Structures/Command');
const CoinGecko = require('coingecko-api');
const CoinGeckoClient = new CoinGecko();
const Discord = require('discord.js');

async function getCoin$(coin) {
    return await CoinGeckoClient.coins.fetch(coin, {});
}

function getCircle(int) {
    return int > 0 ? ':green_circle:' : ':red_circle:'
}

function getCurrency(currency, symbol) {
    const options = ['eur', 'btc', 'usd', 'eth'];

    if (symbol) {
        switch (currency) {
            case 'eur':
                return '€';
            case 'usd':
                return '$';
            case 'btc':
                return '₿';
            case 'eth':
                return '♦';
            default:
                return options.includes(currency) ? currency.toUpperCase() : '€';
        }

    } else {
        return options.includes(currency) ? currency.toFixed(currency > 0 ? 2 : 6) : 'eur';
    }
}

module.exports = class extends Command {

    constructor(...args) {
        super(...args, {
            prefix: '!c',
            aliases: ['coin'],
            description: 'Displays data for the selected coin',
            category: 'Utilities',
        });
    }

    async run(message, [coin, currency]) {
        const coinData = await getCoin$(coin);

        if (!coinData.success) {
            return message.channel.send(`Could not find coin with given id \`${coin}\``);
        }

        if (currency) {
            currency = currency.toLowerCase();
        }

        const embedMsg = new Discord.MessageEmbed()
            .setColor('RANDOM')
            .setTitle(coinData.data['name'])
            .setThumbnail(coinData.data.image['thumb'])
            .setTimestamp(new Date());

        const fields = [
            {
                name: 'Current price',
                value: `${getCurrency(currency, true)} ${coinData.data.market_data['current_price'][getCurrency(currency)]}`,
                inline: true
            },
            {
                name: 'Last hour',
                value: `${getCircle(coinData.data.market_data['price_change_percentage_1h_in_currency'][getCurrency(currency)])} ${coinData.data.market_data['price_change_percentage_1h_in_currency'][getCurrency(currency)].toFixed(2)}%`,
                inline: true
            },
            {
                name: '\b',
                value: '\b',
                inline: true
            },
            {
                name: 'Last day',
                value: `${getCircle(coinData.data.market_data['price_change_percentage_24h_in_currency'][getCurrency(currency)])} ${coinData.data.market_data['price_change_percentage_24h_in_currency'][getCurrency(currency)].toFixed(2)}%`,
                inline: true
            },
            {
                name: 'Last 7 days',
                value: `${getCircle(coinData.data.market_data['price_change_percentage_7d_in_currency'][getCurrency(currency)])} ${coinData.data.market_data['price_change_percentage_7d_in_currency'][getCurrency(currency)].toFixed(2)}%`,
                inline: true
            },
            {
                name: '\b',
                value: '\b',
                inline: true
            },
            {
                name: 'ATH',
                value: `${getCurrency(currency, true)} ${coinData.data.market_data['ath'][getCurrency(currency)]}`,
                inline: true
            },
            {
                name: 'ATL',
                value: `${getCurrency(currency, true)} ${coinData.data.market_data['atl'][getCurrency(currency)]}`,
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

        return message.channel.send(embedMsg);
    }

};
