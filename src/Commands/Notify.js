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
            aliases: ['notify'],
            description: 'Displays data for the selected coin',
            category: 'Utilities',
        });
    }

    async run(message, [coin, type, value]) {

        const typeOptions = ['price'];

        if (!coin) {
            return message.channel.send(`No id found. Make sure you insert a coin id`);
        }

        if (!type) {
            return message.channel.send(`No notification type given. Example: \`price\``);
        }

        if (!typeOptions.includes(type.toLowerCase())) {
            return message.channel.send(`'${type}' is not a valid notification type.`);
        }

        if (!value || !Number(value)) {
            return message.channel.send(`No valid price given`);
        }

        const db = await sql.open({
            filename: 'database.sqlite',
            driver: sqlite3.Database
        });

        const user = await db.get(`SELECT * FROM users WHERE id = ${message.author.id.toString()}`);

        if (user) {
            const userCoins = await db.all(`SELECT * FROM user_coin where user_id = ${message.author.id.toString()}`);
            const selectedCoin = userCoins.filter(userCoin => userCoin['coin_id'] === coin.toLowerCase())[0];

            if (!selectedCoin) {
                return message.channel.send(`No coin found for given id \`${coin}\`. Make sure the id is correct, or you are following this coin.`);
            }

            const userCoinNotification = await db.all(`SELECT * FROM user_coin_notifications WHERE coin_id = '${selectedCoin['coin_id']}' AND  user_id = ${message.author.id.toString()}`);

            if (userCoinNotification.length) {
                db.run(
                    `UPDATE user_coin_notifications SET notification_type = '${type.toLocaleString()}', notification_value = '${value.toString()}' WHERE coin_id = '${selectedCoin['coin_id']}' AND user_id = ${message.author.id.toString()}`
                ).then(() => {
                    return message.channel.send(`Updated the ${type} notification for ${selectedCoin['coin_name']}`);
                })
            } else {
                db.run("INSERT INTO user_coin_notifications (user_id, notification_type, notification_value, coin_id) VALUES (?, ?, ?, ?)", [message.author.id.toString(), type.toLocaleString(), value.toString(), selectedCoin['coin_id']]);
                return message.channel.send(`Alert set for ${selectedCoin['coin_name']}`);
            }

        } else {
            return message.channel.send(`No user profile found. Make sure you have created a profile before using this command. `);
        }
    }
};
