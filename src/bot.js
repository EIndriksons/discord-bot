require('dotenv').config();
const { Client, MessageEmbed } = require('discord.js');
const iex = require('iexcloud_api_wrapper');

const client = new Client();
const PREFIX = '!';

client.on('message', (message) => {
  if (message.author.bot) return;
  if (message.content.startsWith(PREFIX)) {
    const [CMD_NAME, ...args] = message.content.trim().substring(PREFIX.length).split(/\s+/);

    if (CMD_NAME === 'help') {
      message.channel.send('Apēd skrūves dauni!');
    } else if (CMD_NAME === 'stock') {
      iex.quote(args[0]).then((data) => {
        const embed = new MessageEmbed()
          .setColor('#0099ff')
          .setTitle(`${data.symbol}, ${data.companyName}`)
          .addFields({ name: 'Price', value: `${data.latestPrice}`, inline: false });

        message.channel.send(embed);
      });

      iex.history(args[0], { date: '2021-01-27' }).then((data) => {
        console.log(data);
      });
    }
  }
});

client.login(process.env.DISCORDJS_BOT_TOKEN);
