const { SlashCommandBuilder } = require("discord.js");
const parseMilliseconds = require("parse-ms-2");
const profileModel = require("../models/profileSchema");
const jobValues = require("../JobValues.json");

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

module.exports = {
    data: new SlashCommandBuilder()
        .setName("work")
        .setDescription("Head off to work for the day"),

    async execute(interaction, profileData) {
        const { id } = interaction.user;
        const { job, jobLastUsed } = profileData;

        console.log(job);

        const cooldown = 86400000;
        const timeLeft = cooldown - (Date.now() - jobLastUsed);
        const { hours, minutes, seconds } = parseMilliseconds(timeLeft);

        const jobMatch = findJobByTitle(job);

        const cooldownEmbed = {
            title: `You have already worked!`,
            description: `Work your next shift in \`${hours} hrs ${minutes} min ${seconds} sec\``,
        };

        const unemployedEmbed = {
            title: `You don't have a job!`,
            description: `Please apply for a job using the \`/apply\` command`,
        };

        if (!job) {
            await interaction.deferReply({ ephemeral: true });

            await interaction.editReply({ embeds: [unemployedEmbed] });
            return;
        }
        // if (timeLeft > 0) {
        //     await interaction.deferReply({ ephemeral: true });

        //     await interaction.editReply({ embeds: [cooldownEmbed] });
        //     return;
        // }

        await interaction.deferReply();

        // const randomAmt = Math.floor(Math.random() * (10 - 1 + 1) + 1);
        const income = jobMatch.pay;

        try {
            await profileModel.findOneAndUpdate(
                { userId: id },
                {
                    $set: {
                        jobLastUsed: Date.now(),
                    },
                    $inc: {
                        balance: income,
                    },
                }
            );
        } catch (err) {
            console.log(err);
        }

        const workEmbed = {
            title: `${job}`,
            description: `${jobMatch.work_message.replace(
                "{{income}}",
                income
            )}`,
        };

        await interaction.editReply({
            embeds: [workEmbed],
        });
    },
};
