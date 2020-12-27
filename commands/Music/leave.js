const { Default_Prefix, Color } = require("../../config.js");
const Discord = require("discord.js");
const db = require("wio.db");

module.exports = {
  name: "leave",
  aliases: ["dis", "дис", "disconnect"],
  category: "Music",
  description: "Покинуть голосовой канал.",
  usage: "leave",
  run: async (client, message, args) => {
    
    const Channel = message.member.voice.channel;
    
    if (!Channel) return message.channel.send("Пожалуйста, присоединитесь к голосовому каналу.");
    
    if (!message.guild.me.voice) return message.channel.send("Меня нет в голосовых каналах.");
    
    try {
    
    await message.guild.me.voice.kick(client.user.id);
      
    } catch (error) {
      await message.guild.me.voice.kick(message.guild.me.id);
      return message.channel.send("Произвожу попытку выйти...");
    };
    
    const Embed = new Discord.MessageEmbed()
    .setColor(Color)
    //.setTitle("Success")
    .setDescription("Пока")
    .setTimestamp();
    
    return message.channel.send(Embed).catch(() => message.channel.send("Пока"));
  }
};