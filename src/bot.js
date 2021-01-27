require('dotenv').config();
const { Client, Message } = require('discord.js');

const client = new Client();

client.on('ready', () => {
  console.log('kurwa');
});

client.on('message', (message) => {
  console.log(message.content);
});

client.login(process.env.DISCORDJS_BOT_TOKEN);
