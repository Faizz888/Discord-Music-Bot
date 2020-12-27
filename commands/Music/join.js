const { Default_Prefix, Color } = require("../../config.js");
const Discord = require("discord.js");
const db = require("wio.db");

module.exports = {
  name: "join",
  aliases: ["войти"],
  category: "Music",
  description: "Войти в голосовой канал",
  usage: "join",
  run: async (client, message, args) => {
    
    const Channel = message.member.voice.channel;
    
    if (!Channel) return message.channel.send("Войдите в голосовой канал.");
    
    if (!Channel.joinable) return message.channel.send("Я не могу войти :c");
    
    await Channel.join().catch(() => {
      return message.channel.send("Возникла ошибка при попытке входа!");
    });
    
    const Embed = new Discord.MessageEmbed()
    .setColor(Color)
    //.setTitle("Success")
    .setDescription("🎶 Присоединилась!")
    .setTimestamp();
    
    return message.channel.send(Embed).catch(() => message.channel.send("🎶 Присоединилась!"));
  }
};