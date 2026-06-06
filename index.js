const fs = require('node:fs');
const path = require('node:path');
const { Client, Collection, Events, GatewayIntentBits, MessageFlags, ActionRowBuilder, StringSelectMenuBuilder } = require('discord.js');
const { token } = require('./config.json');
const { EmbedBuilder } = require('discord.js');
const db = require('./db.json');
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });

client.once(Events.ClientReady, (readyClient) => {
    console.log(`Ready! Logged in as ${readyClient.user.tag}`);
});

client.on(Events.MessageCreate, async (message) => {
    if (message.author.bot) return;
    if (message.channel.id !== db.channelid) return;
    if (message.content === (parseInt(db.currentnum) + 1).toString()) {
        if (message.author.id === db.lastuser) {
            message.delete();
            return;
        }
        db.currentnum = (parseInt(db.currentnum) + 1).toString();
        db.lastuser = message.author.id;
        message.react('✅');
        fs.writeFileSync('./db.json', JSON.stringify(db, null, 2));
    } else {
        message.delete();
    }
});

client.login(token);