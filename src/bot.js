require('dotenv').config();
const { Client, MessageEmbed } = require('discord.js');
const iex = require('iexcloud_api_wrapper');

const client = new Client();
const PREFIX = '!';

client.on('message', (message) => {
  if (message.author.bot) return;
  if (message.content.startsWith(PREFIX)) {
    // Message parser function
    const [CMD_NAME, ...args] = message.content.trim().substring(PREFIX.length).split(/\s+/);

    // Command Switch
    if (CMD_NAME === 'help') {
      // HELP
      message.channel.send('Apēd skrūves dauni!');
    } else if (CMD_NAME === 'stock') {
      // STOCK {SYMBOL}
      iex.quote(args[0]).then((data) => {
        const embed = new MessageEmbed()
          .setColor('#0099ff')
          .setTitle(`${data.symbol}, ${data.companyName}`)
          .addFields({ name: 'Price', value: `${data.latestPrice}`, inline: false });

        console.log(data);
        message.channel.send(embed);
      });

      iex
        .ohlc(args[0])
        .then((data) => {
          console.log(data);
        })
        .catch((err) => {
          console.log(err);
        });
    } else if (CMD_NAME === 'roll') {
      // ROLL
      message.channel.send(getRandomInt(7));
    }
  }
});

client.login(process.env.DISCORDJS_BOT_TOKEN);

function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}
