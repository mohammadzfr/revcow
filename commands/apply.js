const { SlashCommandBuilder } = require("discord.js");
const profileModel = require("../models/profileSchema");
const jobValues = require("../JobValues.json");

// Map job objects to choice objects
const choices = jobValues.jobs.map((job) => ({
    name: job.name,
    value: job.name.toLowerCase().replace(/\/|\s/g, "_"),
}));

function findJobByTitle(title) {
    // Loop through the jobs array
    for (var i = 0; i < jobValues.jobs.length; i++) {
        var jobMatch = jobValues.jobs[i];
        // Check if the job title matches the input title
        if (jobMatch.name === title) {
            return jobMatch;
        }
    }
    return null; // Return null if job not found
}

const commandData = new SlashCommandBuilder()
    .setName("apply")
    .setDescription("Apply for a job")
    .addStringOption((option) =>
        option
            .setName("job")
            .setDescription("The name of the job you want to apply for")
            // Spread the choices array to pass each choice object as a separate argument
            .addChoices(...choices)
    );

module.exports = {
    data: commandData,
    async execute(interaction, statsData) {
        const { id } = interaction.user;
        const { strength, intelligence } = statsData;

        const appliedJob = interaction.options.getString("job");
        const jobMatch = findJobByTitle(appliedJob);

        const acceptedEmbed = {
            title: `Congrats!`,
            description: `You are now a \`${jobMatch.name}\`!`,
        };

        const rejectedEmbed = {
            title: `You have been rejected`,
            description: `You need atleast \`${jobMatch.strength}\` strength and \`${jobMatch.intelligence}\` intelligence to be a ${jobMatch.name}`,
        };
        if (
            strength >= jobMatch.strength &&
            intelligence >= jobMatch.intelligence
        ) {
            try {
                await profileModel.findOneAndUpdate(
                    { userId: id },
                    {
                        $set: {
                            job: jobMatch.name,
                        },
                    }
                );
            } catch (err) {
                console.log(err);
            }
            await interaction.deferReply();

            await interaction.editReply({ embeds: [acceptedEmbed] });
            return;
        } else {
            await interaction.deferReply({ ephemeral: true });

            await interaction.editReply({ embeds: [rejectedEmbed] });
        }
    },
};
