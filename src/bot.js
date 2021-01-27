require('dotenv').config();
const { Client, Message } = require('discord.js');

const client = new Client();

client.login(process.env.DISCORDJS_BOT_TOKEN);
