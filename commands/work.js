const { SlashCommandBuilder } = require("discord.js");
const parseMilliseconds = require("parse-ms-2");
const profileModel = require("../models/profileSchema");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("work")
    .setDescription("Head off to work for the day"),
  async execute(interaction, profileData) {
    const { id } = interaction.user;
    const { jobLastUsed } = profileData;

    const cooldown = 86400000;
    const timeLeft = cooldown - (Date.now() - jobLastUsed);

    if (timeLeft > 0) {
      await interaction.deferReply({ ephemeral: true });
      const { hours, minutes, seconds } = parseMilliseconds(timeLeft);
      await interaction.editReply(
        `Work your next shift in ${hours} hrs ${minutes} min ${seconds} sec`
      );
    }

    await interaction.deferReply();

    const randomAmt = Math.floor(Math.random() * (10 - 1 + 1) + 1);

    try {
      await profileModel.findOneAndUpdate(
        { userId: id },
        {
          $set: {
            jobLastUsed: Date.now(),
          },
          $inc: {
            balance: randomAmt,
          },
        }
      );
    } catch (err) {
      console.log(err);
    }

    await interaction.editReply(
      `You worked hard and earned ${randomAmt} coins!`
    );
  },
};
