require('dotenv').config();
const { Client, Message } = require('discord.js');

const client = new Client();
const PREFIX = '!';

client.on('message', (message) => {
  if (message.author.bot) return;
  if (message.content.startsWith(PREFIX)) {
    const [CMD_NAME, ...args] = message.content.trim().substring(PREFIX.length).split(/\s+/);

    if (CMD_NAME === 'help') {
      message.channel.send('Help');
    } else if (CMD_NAME === 'stock') {
    }
  }
});

client.login(process.env.DISCORDJS_BOT_TOKEN);
