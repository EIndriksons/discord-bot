require('dotenv').config();
const fs = require('fs');
const axios = require('axios');
const { Client, MessageEmbed, GuildChannelManager } = require('discord.js');
const { nFormatter, shuffle } = require('./helpers');

const config = JSON.parse(fs.readFileSync('./src/config.json', 'utf8'));

const client = new Client({ partials: ['MESSAGE', 'REACTION'] });
const PREFIX = '!';

client.on('message', message);
client.on('messageReactionAdd', messageReaction);

client.login(process.env.DISCORDJS_BOT_TOKEN);

function message(message) {
  if (message.author.bot) return;
  if (message.content.startsWith(PREFIX)) {
    // Message parser function
    const [CMD_NAME, ...args] = message.content.trim().substring(PREFIX.length).split(/\s+/);

    // Command Switch
    if (CMD_NAME === 'help') {
      // ! HELP
      message.channel.send('Apēd skrūves dauni!');
    } else if (CMD_NAME === 'stock') {
      // ! STOCK {SYMBOL}
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
            **Price:** \`${(Math.round(finData.price * 100) / 100).toFixed(2)} 💲\`\n
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
            )
            .setFooter('Remember - Stocks only go UP! :new_moon:');

          message.channel.send(embed);
        })
        .catch((err) => {
          message.channel.send(
            "My palms are sweaty, knees weak, arms are heavy. There is an API error on his sweater already, mom's spaghetti."
          );
        });
    } else if (CMD_NAME === 'roll') {
      // ! ROLL
      const count = parseInt(args[0]);
      args.shift();
      shuffle(args);

      message.channel.send(`Retarded Winners are: ${args.slice(0, count).join(', ')}`);
    } else if (CMD_NAME === 'setup') {
      // ! SETUP
      if (args[0] === 'roles') {
        message.channel
          .send(
            `**SeLeCt yOuR GaMeR rOlE:**\n:person_wearing_turban::skin-tone-5: - Counter-Strike: Global Offensive\n:chicken: - PlayerUnknown's Battlegrounds\n:crab: - League of Legends\n:gun: - Valorant\n:pirate_flag: - Sea of Thieves\n:earth_africa: - Minecraft\n:hammer_pick: - Rust\n:monkey: - Apex`
          )
          .then((res) => {
            res.react('👳🏿');
            res.react('🐔');
            res.react('🦀');
            res.react('🔫');
            res.react('🏴‍☠️');
            res.react('🌍');
            res.react('⚒️');
            res.react('🐒');
          });
        message.delete();
      }
    }
  }
}

function messageReaction(reaction, user) {
  if (!config.roleMessageId) {
    console.error('config.roleMessageId not set');
  }

  console.log(config.roleMessageId);
  console.log(reaction.message.id);

  const member = reaction.message.guild.members.cache.get(user.id);
  if (reaction.message.id === config.roleMessageId) {
    switch (reaction.emoji.name) {
      case '👳🏿':
        member.roles.add('794658306786459659');
        break;
      case '🐔':
        console.log('hello');
        member.roles.add('800676968836235284');
        break;
      case '🦀':
        member.roles.add('809023142419759139');
        break;
      case '🔫':
        member.roles.add('809023056092725288');
        break;
      case '🏴‍☠️':
        member.roles.add('808371378759532544');
        break;
      case '🌍':
        member.roles.add('809023323505426432');
        break;
      case '⚒️':
        member.roles.add('795670132302675970');
        break;
      case '🐒':
        member.roles.add('809023472151822338');
        break;
      default:
    }
  }
}
