const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
  data: new SlashCommandBuilder().setName('ping').setDescription('Pong!'),
  async execute(interaction) {
    interaction.reply({
      content: 'Apēd skrūves dauni! 🔩',
      ephemeral: true
    });
  }
};
