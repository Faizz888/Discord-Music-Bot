const { Default_Prefix, Color } = require("../../config.js");
const Discord = require("discord.js");
const db = require("wio.db");

module.exports = {
  name: "setprefix",
  aliases: ["newprefix", "prefix", "sp", "префикс"],
  category: "Config",
  description: "Установить боту другой префикс",
  usage: "setprefix <новый префикс>",
  run: async (client, message, args) => {
    
    if (!message.member.hasPermission("MANAGE_GUILD")) return message.channel.send("Нет прав управления сервером.");
    
    let Prefix = await db.fetch(`Prefix_${message.guild.id}`);
    if (!Prefix) Prefix = Default_Prefix;
    
    const NewPrefix = args.join(" ");
    
    if (!NewPrefix) return message.channel.send("``setprefix`` <новый префикс>");
    
    if (NewPrefix.length > 10) return message.channel.send("Слишком длинный префикс, больше 10 знаков.");
    
    if (NewPrefix === Prefix) return message.channel.send("Этот префикс установлен на данный момент.");
    
    const Embed = new Discord.MessageEmbed()
    .setColor(Color || "RANDOM")
    //.setTitle("Sucess")
    .setDescription(`Новый префикс установлен - ${NewPrefix}`)
    .setFooter(`Установил ${message.author.username}`)
    .setTimestamp();
    
    await db.set(`Prefix_${message.guild.id}`, NewPrefix);
    
    try {
      return message.channel.send(Embed);
    } catch (error) {
      return message.channel.send(`Новый префикс установлен - ${NewPrefix}`);
    };
  }
};