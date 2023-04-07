const { SlashCommandBuilder } = require("@discordjs/builders");
const { EmbedBuilder, ChannelType, PermissionsBitField } = require("discord.js")
const config = require("../config.json")
const database = require('../Models/Server');
module.exports = {
    data: new SlashCommandBuilder()
        .setName("aaa")
        .setDescription("aaa")
        .setDefaultMemberPermissions(8),

    run: async ({ interaction, client }) => {
       interaction.reply({content: "aa"})

    }
}