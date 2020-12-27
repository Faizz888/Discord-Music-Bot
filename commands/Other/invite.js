const { Default_Prefix, Color, Owner, Support, Donate } = require("../../config.js");
const Discord = require("discord.js");
const db = require("wio.db");

module.exports = {
  name: "invite",
  aliases: ["invitelink", "приг"],
  category: "Other",
  description: "Получить ссылку для приглашения бота",
  usage: "invite",
  run: async (client, message, args) => {
    
    const Invite = `https://discordapp.com/oauth2/authorize?client_id=${client.user.id}&permissions=8&scope=bot`, Owne = `<@${Owner}>`, Dev = `Faizz#0001`;
    
    const Embed = new Discord.MessageEmbed()
    .setColor(Color)
    .setTitle("Ссылка")
    .addField("Пригласи меня", `[Click Me](${Invite})`, true)
   // .addField("Support Server", `[Click Me](${Support})`, true)
    //.addField("Владелец", Owne, true)
    //.addField("Developer", "Faizz#0001")
    .setTimestamp();
    
    return message.channel.send(Embed).catch(() => message.channel.send("Приглашение - " + Invite));
  }
};