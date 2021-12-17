const fs = require('fs');
const cron = require('cron');
const axios = require('axios');
const config = require('./config.json');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { Client, Intents, Collection } = require('discord.js');
const client = new Client({
  intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES]
});

// command handler
const commandFiles = fs.readdirSync('./commands').filter((file) => file.endsWith('.js'));
const commands = [];
client.commands = new Collection();
for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  commands.push(command.data.toJSON());
  client.commands.set(command.data.name, command);
}

client.once('ready', () => {
  console.log('Bot is online.');

  // command register
  const CLIENT_ID = client.user.id;
  const rest = new REST({
    version: '9'
  }).setToken(process.env.DISCORDJS_BOT_TOKEN);

  (async () => {
    try {
      await rest.put(
        Routes.applicationGuildCommands(CLIENT_ID, process.env.DISCORDJS_BOT_GUILD_ID),
        {
          body: commands
        }
      );
      console.log('Commands successfully registered.');
    } catch (err) {
      if (err) console.error(err);
    }
  })();

  // checking Alex rank in League of Legends every hour
  let scheduleCheckAlexRank = new cron.CronJob('0 0 */1 * * *', () => {
    checkAlexRank(client.guilds.get(process.env.DISCORDJS_BOT_GUILD_ID));
  });
  scheduleCheckAlexRank.start();
});

// handling interactions (commands)
client.on('interactionCreate', async (interaction) => {
  if (!interaction.isCommand()) return;

  const command = client.commands.get(interaction.commandName);
  if (!command) return;

  try {
    await command.execute(interaction);
  } catch (err) {
    if (err) console.error(err);

    await interaction.reply({
      content: 'An error occured while executing this command.',
      ephemeral: true
    });
  }
});

client.login(process.env.DISCORDJS_BOT_TOKEN);

function checkAlexRank(guild) {
  const url = `https://eun1.api.riotgames.com/tft/league/v1/entries/by-summoner/${config.SummonerID}`;
  axios
    .get(url, { headers: { 'X-Riot-Token': process.env.LOL_API } })
    .then((res) => {
      const data = res.data[0];

      const mapName = {
        MASTER: 'Masterbator 😩',
        GRANDMASTER: 'Granny Master 👵',
        CHALLENGER: 'CHALLANGED 👑'
      };
      let roleName = mapName[data['tier']] ? mapName[data['tier']] : 'Biggus Dickus';

      let roleColor;
      const mapShades = [
        [29, 2, 0],
        [52, 28, 2],
        [65, 25, 0],
        [127, 81, 18],
        [122, 89, 1],
        [173, 144, 13]
      ];
      const colorID = Math.min(
        Math.floor(data['leaguePoints'] / (600 / mapShades.length)),
        mapShades.length - 1
      );

      if (data['tier'] === 'CHALLENGER') {
        roleColor = [255, 215, 0];
      } else if (['MASTER', 'GRANDMASTER'].includes(data['tier'])) {
        roleColor = mapShades[colorID];
      } else {
        roleColor = [29, 2, 0];
      }

      guild.roles
        .edit(config.roleID, {
          name: roleName,
          color: roleColor
        })
        .then((res) => {
          console.log('Role successfully set.');
        })
        .catch((err) => {
          console.log('Role setting failed.');
        });
    })
    .catch((err) => {
      console.log(err);
    });
}
