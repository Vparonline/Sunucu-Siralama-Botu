﻿
const Discord = require('discord.js');
const { Client, GatewayIntentBits, Partials, Collection, PermissionsBitField } = require('discord.js');
const client = new Client({ intents: Object.values(GatewayIntentBits).filter(x => typeof x === "string"), partials: [Partials.Message, Partials.Channel, Partials.Reaction], });
const fs = require('fs');
const config = require('./src/config.json');
var mongoose = require('mongoose');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v10');

mongoose.connect(config.mongo, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(a => { console.log("Mongosoe Bağlanıldı!") });

const log = message => {
  console.log(` ${message}`);
};

global.client = client;

client.slashcommands = new Collection();
var slashcommands = [];

fs.readdirSync("./src/SlashCommands/").forEach((file) => {
  const command = require(`./src/SlashCommands/${file}`);
  client.slashcommands.set(command.data.name, command);
  slashcommands.push(command.data.toJSON());
});

const rest = new REST({ version: '10' }).setToken(config.token);
(async () => {
  try {
    console.log('[SLASH_COMMAND] Slash Komutlar yükleniyor.');
    await rest.put(
      Routes.applicationCommands(config.clientId),
      { body: slashcommands },
    );
    console.log('[SLASH_COMMAND] Slash Komutlar yüklendi.');
  } catch (error) {
    console.error(error);
  }
})();

client.on('interactionCreate', (interaction) => {
  //if (!interaction.isCommand()) return;
  const command = client.slashcommands.get(interaction.commandName);
  if (!command) return;
  try {
    command.run({ interaction, client });
  } catch (err) {
    if (err) console.error("Error: ", err);
  }
});

client.on('ready', async () => {
  client.user.setActivity(`${client.guilds.cache.size}`, {
    type: "WATCHING"});
    client.user.setStatus("dnd");
})


client.login(config.token);

client.on("ready", async () => {
  console.log("Bot hazır durumda!" + " " + `${client.user.username} (${client.user.id})`);
})


client.on("voiceStateUpdate", async (oldState, newState) => {
  const Stats = require("./src/Models/Stats")
  const Seens = require("./src/Models/Seens")
  if ((oldState.member && oldState.member.user.bot) || (newState.member && newState.member.user.bot)) return;

  if (!oldState.channelId && newState.channelId) await Seens.updateOne({ userID: newState.id }, {
    $set: {
      guildID: newState.guild.id,
      lastSeenVoice: Date.now(),
      lastSeen: Date.now(),
      newChannelId: newState.channelId,
      lastType: "JOIN VOICE",
    }
  }, { upsert: true });


  if (oldState.channelId && !newState.channelId) {
    let joinedAt = await Seens.findOne({ userID: oldState.id })
    if (!joinedAt) return;
    const timing = Date.now() - joinedAt.lastSeenVoice;

    await Seens.updateOne({ userID: oldState.id }, {
      $set: {
        guildID: oldState.guild.id,
        oldChannelId: oldState.channelId,
        lastSeen: Date.now(),
        lastType: "LEAVE VOICE",
      }
    }, { upsert: true });

    if (!isNaN(timing)) dataInit(oldState, timing)
  }


  if (oldState.channelId && newState.channelId && oldState.channelId != newState.channelId) {
    let joinedAt = await Seens.findOne({ userID: oldState.id })
    if (!joinedAt) return;
    const timing = Date.now() - joinedAt.lastSeenVoice;

    await Seens.updateOne({ userID: oldState.id }, {
      $set: {
        guildID: oldState.guild.id,
        lastSeenVoice: Date.now(),
        lastSeen: Date.now(),
        oldChannelId: oldState.channelId,
        newChannelId: newState.channelId,
        lastType: "CHANGE VOICE",
      }
    }, { upsert: true });

    if (!isNaN(timing)) dataInit(newState, timing)
  }

  async function dataInit(member, data) {
    await Stats.updateOne({ guildID: member.guild.id, userID: member.id }, {
      $inc: {
        topVoice: data
      }
    }, { upsert: true });
  }
})

client.on("messageCreate", async (message) => {
  const Stats = require("./src/Models/Stats")
  const Seens = require("./src/Models/Seens")
  if (message.author.bot || !message.guild || message.webhookID || message.channel.type === "dm") return;

  await Seens.updateOne({ userID: message.author.id }, {
    $set: {
      guildID: message.guildId,
      lastSeenMessage: Date.now(),
      lastSeen: Date.now(),
      messageChannelId: message.channelId,
      messageContent: message.content,
      lastType: "MESSAGE",
    },
    $push: {
      lastContent: {
        date: Date.now(),
        content: message.content,
        guild: message.guildId,
        channel: message.channelId,
      }
    }
  }, { upsert: true });

  await Stats.updateOne({ guildID: message.guildId, userID: message.author.id }, {
    $inc: {
      topMessage: 1
    }
  }, { upsert: true });
})


client.timing = (duration) => {
  let arr = []
  if (duration / 3600000 > 1) {
    let val = parseInt(duration / 3600000)
    let durationn = parseInt((duration - (val * 3600000)) / 60000)
    arr.push(`${val} Saat`)
    arr.push(`${durationn} Dk.`)
  } else {
    let durationn = parseInt(duration / 60000)
    arr.push(`${durationn} Dk.`)
  }
  return arr.join(", ")
};


client.on("messageCreate", (message) => {
  const discordModals = require('discord-modals');
  discordModals(client);
  const { ButtonBuilder, ActionRowBuilder
  } = require("discord.js");
  const { Modal, TextInputComponent, showModal } = require("discord-modals");

  const row = new Discord.ActionRowBuilder().addComponents(
    new Discord.ButtonBuilder().setCustomId("dogrula").setLabel("Doğrula").setStyle(Discord.ButtonStyle.Secondary),
  )

    const butonullah = new Discord.ActionRowBuilder().addComponents(
      new Discord.ButtonBuilder().setCustomId("Onaylıosun").setLabel("Onayla").setStyle(Discord.ButtonStyle.Success).setEmoji("✔️"),
      new Discord.ButtonBuilder().setCustomId("Onaylamıosun").setLabel("Reddet").setStyle(Discord.ButtonStyle.Secondary).setEmoji("❌"),
      new Discord.ButtonBuilder().setCustomId("Yasakla").setLabel("Yasakla").setStyle(Discord.ButtonStyle.Danger).setEmoji("⚒️")
    )
/*
  if (message.content == ".setup") {
    message.channel.send({
      content: `Aşağıdan butona basarak başvuru oluşturabilirsiniz.`, ephemeral: true,
      components: [row]
    })
  }
*/
  client.on("interactionCreate", async (interaction) => {
    if (interaction.customId == "dogrula") {
      let basvuru = new Modal().setCustomId(`basvuruyap`).setTitle('Sunucu Doğrulama Formu').addComponents(
        new TextInputComponent().setCustomId('sunucuid').setLabel('Sunucu idsi').setStyle("SHORT").setPlaceholder('Sunucu ID').setRequired(true),
        new TextInputComponent().setCustomId('davetlink').setLabel('Sunucu davet linkiniz (sınırsız)').setStyle("SHORT").setPlaceholder('discord.gg/dislist').setRequired(true),
        new TextInputComponent().setCustomId('kategori').setLabel('Kategori (Public, Ekip, Sohbet)').setStyle("SHORT").setPlaceholder('Sohbet').setRequired(true),
      )

      showModal(basvuru, {
        client: client,
        interaction: interaction
      });
      client.on("modalSubmit", async (modal) => {
        if (modal.customId == "basvuruyap") {
          let sunucu = modal.getTextInputValue('sunucuid');
          let davet = modal.getTextInputValue('davetlink');
          let kategoriymiş = modal.getTextInputValue('kategori');
          await modal.deferReply({ ephemeral: true })
          modal.followUp({ content: `Selam, **${interaction.guild.name}** Başvurunuz gönderildi, \`[ https://discord.gg/ngtghZx2NK ]\` katılarak daha hızlı bilgi alabilirsin. Bol Şans!` })
          let embedullah = new Discord.EmbedBuilder()
          interaction.guild.channels.cache.find(a => a.name === "allahallahallah").send({content: ` \`[ ${davet} ]\`  @everyone`, embeds: [embedullah.setDescription(`
**\` Sahip :\`** ${modal.member} \`(${modal.member.id})\`\n\n**\` ID :\`** **${sunucu}**\n\n**\` Kategori :\` ${kategoriymiş}**
            `)], components: [butonullah]})
    }
  })
}


  })
})

/*client.on("ready", async () => {
  const database = require("../server/src/Models/Like")
  const timedb = await database.findOne({ userID: interaction.member.id, guildID: interaction.guild.id });
  var timeLike = Date.now() - timedb.date;
  if (timeLike >= 7200000) {
  }
})*/