const fs = require('fs');
const cron = require('cron');
const { checkAlexRank } = require('./helpers');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { Client, Intents, Collection } = require('discord.js');
require('dotenv').config();
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

  checkAlexRank(client.guilds.cache.get(process.env.DISCORDJS_BOT_GUILD_ID), client);

  // checking Alex rank in League of Legends every hour
  // let scheduleCheckAlexRank = new cron.CronJob('*/30 * * * *', () => {
  //   checkAlexRank(client.guilds.cache.get(process.env.DISCORDJS_BOT_GUILD_ID), client);
  // });
  // scheduleCheckAlexRank.start();
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
