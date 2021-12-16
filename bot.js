const config = require('./config.json');
const { Client } = require('discord.js');

const client = new Client({ partials: ['MESSAGE', 'REACTION'] });
const PREFIX = '!';

client.on('message', message);
client.on('messageReactionAdd', messageReactionAdd);
client.on('messageReactionRemove', messageReactionRemove);

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
        message.channel
          .send(
            `**Select your Social  :monkey:  Group:**\n:money_with_wings: - Finance r/wallstreetbets Retard Club (aka Lost money on $GME)\n:red_car: - Car Enthusiasts (aka BMW club)`
          )
          .then((res) => {
            res.react('💸');
            res.react('🚗');
          });
        message.delete();
      }
    }
  }
}

function messageReactionAdd(reaction, user) {
  const member = reaction.message.guild.members.cache.get(user.id);
  if (
    reaction.message.id === config.roleGameMessageId ||
    reaction.message.id === config.roleSocialMessageId
  ) {
    member.roles.add(config.roles['bunga']);
  }
  if (reaction.message.id === config.roleGameMessageId) {
    switch (reaction.emoji.name) {
      case '👳🏿':
        member.roles.add(config.roles['csgo']);
        break;
      case '🐔':
        member.roles.add(config.roles['pubg']);
        break;
      case '🦀':
        member.roles.add(config.roles['league']);
        break;
      case '🔫':
        member.roles.add(config.roles['valorant']);
        break;
      case '🏴‍☠️':
        member.roles.add(config.roles['pirates']);
        break;
      case '🌍':
        member.roles.add(config.roles['minecraft']);
        break;
      case '⚒️':
        member.roles.add(config.roles['rust']);
        break;
      case '🐒':
        member.roles.add(config.roles['apex']);
        break;
      default:
        reaction.remove();
        break;
    }
  } else if (reaction.message.id === config.roleSocialMessageId) {
    switch (reaction.emoji.name) {
      case '💸':
        member.roles.add(config.roles['stonks']);
        break;
      case '🚗':
        member.roles.add(config.roles['car']);
        break;
      default:
        reaction.remove();
        break;
    }
  }
}

function messageReactionRemove(reaction, user) {
  const member = reaction.message.guild.members.cache.get(user.id);
  if (reaction.message.id === config.roleGameMessageId) {
    switch (reaction.emoji.name) {
      case '👳🏿':
        member.roles.remove(config.roles['csgo']);
        break;
      case '🐔':
        member.roles.remove(config.roles['pubg']);
        break;
      case '🦀':
        member.roles.remove(config.roles['league']);
        break;
      case '🔫':
        member.roles.remove(config.roles['valorant']);
        break;
      case '🏴‍☠️':
        member.roles.remove(config.roles['pirates']);
        break;
      case '🌍':
        member.roles.remove(config.roles['minecraft']);
        break;
      case '⚒️':
        member.roles.remove(config.roles['rust']);
        break;
      case '🐒':
        member.roles.remove(config.roles['apex']);
        break;
    }
  } else if (reaction.message.id === config.roleSocialMessageId) {
    switch (reaction.emoji.name) {
      case '💸':
        member.roles.remove(config.roles['stonks']);
        break;
      case '🚗':
        member.roles.remove(config.roles['car']);
        break;
    }
  }
}
