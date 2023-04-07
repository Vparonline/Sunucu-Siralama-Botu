const { SlashCommandBuilder } = require("@discordjs/builders");
const { EmbedBuilder, ChannelType, PermissionsBitField } = require("discord.js")
const config = require("../config.json")
const database = require('../Models/Server');
module.exports = {
    data: new SlashCommandBuilder()
        .setName("stat")
        .setDescription("Bot hakkında bilgi!"),

    run: async ({ interaction, client }) => {
        let embed = new EmbedBuilder();
       interaction.reply({embeds: [embed.setDescription(`Toplam: \`${client.guilds.cache.size}\` sunucu yarışmakta!`)], ephemeral: true})

    }
}