const { Events } = require("discord.js");
const profileModel = require("../models/profileSchema");
const statsModel = require("../models/statsSchema");
const inventoryModel = require("../models/inventorySchema");

module.exports = {
    name: Events.InteractionCreate,
    async execute(interaction) {
        if (!interaction.isChatInputCommand()) return;

        //get user db info and pass to command
        let profileData, statsData, inventoryData;
        try {
            profileData = await profileModel.findOne({
                userId: interaction.user.id,
            });

            // If profile data doesn't exist, create a new profile
            if (!profileData) {
                profileData = await profileModel.create({
                    userId: interaction.user.id,
                    serverId: interaction.guild.id,
                });
            }

            // Retrieve stats data
            statsData = await statsModel.findOne({
                userId: interaction.user.id,
            });

            // If stats data doesn't exist, initialize stats for the user
            if (!statsData) {
                statsData = await statsModel.create({
                    userId: interaction.user.id,
                    // Initialize stats fields with default values if needed
                });
            }

            // Retrieve inventory data
            inventoryData = await inventoryModel.findOne({
                userId: interaction.user.id,
            });

            // If inventory data doesn't exist, initialize inventory for the user
            if (!inventoryData) {
                inventoryData = await inventoryModel.create({
                    userId: interaction.user.id,
                    // Initialize inventory fields with default values if needed
                });
            }
        } catch (err) {
            console.error(err);
        }

        const command = interaction.client.commands.get(
            interaction.commandName
        );

        if (!command) {
            console.error(
                `No command matching ${interaction.commandName} was found.`
            );
            return;
        }

        try {
            await command.execute(
                interaction,
                profileData,
                statsData,
                inventoryData
            );
        } catch (error) {
            console.error(`Error executing ${interaction.commandName}`);
            console.error(error);
        }
    },
};
