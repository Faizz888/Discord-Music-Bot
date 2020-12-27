const { Default_Prefix, Color } = require("../../config.js");
const Discord = require("discord.js");
const db = require("wio.db");

module.exports = {
  name: "clearqueue",
  aliases: ["cq"],
  category: "Music",
  description: "Очистить очередь",
  usage: "clearqueue",
  run: async (client, message, args) => {
    
    const Channel = message.member.voice.channel;
    
    if (!Channel) return message.channel.send("Пожалуйста, присоединитесь к голосовому каналу.");
    
    const Queue = await client.queue.get(message.guild.id);
    
    if (!Queue) return message.channel.send("Ничего не играет.");
    if (message.member.hasPermission('ADMINISTRATOR')) {
      Queue.Songs = [];
      await Queue.Bot.dispatcher.end();
    } else {
      return message.channel.send("Нет прав администратора.")
    }
    const Embed = new Discord.MessageEmbed()
    .setColor(Color)
    //.setTitle("Success")
    .setDescription("🎶 Очередь очищена!")
    .setTimestamp();
    
    return message.channel.send(Embed).catch(() => message.channel.send("🎶 Очередь очищена!"));
  }
};