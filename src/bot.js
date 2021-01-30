require('dotenv').config();
const axios = require('axios');
const { Client, MessageEmbed } = require('discord.js');

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
      const url = `https://financialmodelingprep.com/api/v3/quote/${args[0]}`;
      axios
        .get(url, { params: { apikey: process.env.FINANCIAL_MODELLING_API } })
        .then((res) => {
          const finData = res.data[0];
          const embed = new MessageEmbed()
            .setColor('#0099ff')
            .setTitle(`${finData.symbol}, ${finData.name} 🚀`)
            .setDescription(
              `
            **Price:** \`${(Math.round(finData.price * 100) / 100).toFixed(2)} $\`\n
            **Open:** \`${(Math.round(finData.open * 100) / 100).toFixed(2)} $\`
            **Close:** \`${(Math.round(finData.previousClose * 100) / 100).toFixed(2)} $\`\n
            **Low:** \`${(Math.round(finData.dayLow * 100) / 100).toFixed(2)} $\`
            **High:** \`${(Math.round(finData.dayHigh * 100) / 100).toFixed(2)} $\`
            **365d Low:** \`${(Math.round(finData.yearLow * 100) / 100).toFixed(2)} $\`
            **365d High:** \`${(Math.round(finData.yearHigh * 100) / 100).toFixed(2)} $\`\n
            **Market Cap:** \`${nFormatter(finData.marketCap, 1)} $\`
            **Volume:** \`${nFormatter(finData.volume, 1)} $\`\n
            **EPS:** \`${finData.eps} $\`
            **P/E:** \`${finData.pe ? finData.pe : '-'} $\`
            `
            );

          message.channel.send(embed);
        })
        .catch((err) => {
          message.channel.send('Ah shit, the API is down');
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

function nFormatter(num, digits) {
  var si = [
    { value: 1, symbol: '' },
    { value: 1e3, symbol: ' k' },
    { value: 1e6, symbol: ' M' },
    { value: 1e9, symbol: ' B' },
    { value: 1e12, symbol: ' T' },
    { value: 1e15, symbol: ' P' },
    { value: 1e18, symbol: ' E' },
  ];
  var rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
  var i;
  for (i = si.length - 1; i > 0; i--) {
    if (num >= si[i].value) {
      break;
    }
  }
  return (num / si[i].value).toFixed(digits).replace(rx, '$1') + si[i].symbol;
}
