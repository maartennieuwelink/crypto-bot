const Command = require('../Structures/Command');
const CoinGecko = require('coingecko-api');
const CoinGeckoClient = new CoinGecko();
const Discord = require('discord.js');
const sql = require("sqlite");
const sqlite3 = require("sqlite3");

module.exports = class extends Command {

    constructor(...args) {
        super(...args, {
            prefix: '!c',
            aliases: ['alert'],
            description: 'Displays data for the selected coin',
            category: 'Utilities',
        });
    }

    async run(message, [coin, state]) {

        const stateOptions = ['on', 'off'];

        if (!coin) {
            return message.channel.send(`No id found. Make sure you insert a coin id`);
        }

        if (!state) {
            return message.channel.send(`No alert state found. Make sure you set your state by choosing \`on\` or \`off\``);
        }

        if (!stateOptions.includes(state.toLowerCase())) {
            return message.channel.send(`'${state}' is not a valid alert state. Make sure you set your state by choosing \`on\` or \`off\``);
        }

        const db = await sql.open({
            filename: '/tmp/database.db',
            driver: sqlite3.Database
        });

        const user = await db.get(`SELECT * FROM users WHERE id = ${message.author.id.toString()}`);

        if (user) {
            const userCoins = await db.all(`SELECT * FROM user_coin where user_id = ${message.author.id.toString()}`);

            const selectedCoin = userCoins.filter(userCoin => userCoin['coin_id'] === coin.toLowerCase())[0];

            if (!selectedCoin) {
                return message.channel.send(`No coin found for given id \`${coin}\`. Make sure the id is correct, or you are following this coin.`);
            }

            const stateBool = state === 'on' ? 1 : 0;

            if (selectedCoin['coin_alert'] === stateBool) {
                return message.channel.send(stateBool ? `Alerts for ${selectedCoin['coin_name']} are already turned on.` : `Alerts for ${selectedCoin['coin_name']} are already turned off.`);
            }

            db.run(
                `UPDATE user_coin SET coin_alert = ${stateBool} WHERE coin_id = '${selectedCoin['coin_id']}' AND  user_id = ${message.author.id.toString()}`
            ).then(() => {
                return message.channel.send(stateBool ? `Alerts for ${selectedCoin['coin_name']} are turned on.` : `Alerts for ${selectedCoin['coin_name']} are turned off.`);
            })

        } else {
            return message.channel.send(`No user profile found. Make sure you have created a profile before using this command. `);
        }
    }
};
