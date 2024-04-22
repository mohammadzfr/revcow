const { SlashCommandBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("balance")
        .setDescription("Shows a user their current balance"),
    async execute(interaction, profileData, statsData) {
        const { balance } = profileData;
        const { intelligence, strength } = statsData;
        const username = interaction.user.username;

        const balanceEmbed = {
            title: `${username}'s Balance`,
            description: `:coin: ${balance}\n:brain: ${intelligence}\n:muscle: ${strength}`,
        };

        await interaction.reply({ embeds: [balanceEmbed] });
    },
};
