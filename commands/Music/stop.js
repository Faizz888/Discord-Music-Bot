const { Default_Prefix, Color } = require("../../config.js");
const Discord = require("discord.js");
const db = require("wio.db");

module.exports = {
  name: "stop",
  aliases: ["end", "остановить", "завершить"],
  category: "Music",
  description: "Остановить песни",
  usage: "stop",
  run: async (client, message, args) => {
    
    const Channel = message.member.voice.channel;
    
    if (!Channel) return message.channel.send("Пожалуйста, присоединитесь к голосовому каналу.");
    
    const Queue = await client.queue.get(message.guild.id);
    
    if (!Queue) return message.channel.send("Ничего не играет.");
    if (message.member.hasPermission('MANAGE_ROLES')) {
    Queue.Songs = [];
    await Queue.Bot.dispatcher.end();
    } else {
      return await message.channel.send('Нет прав. ``Управление ролями``')
    }
    const Embed = new Discord.MessageEmbed()
    .setColor(Color)
    //.setTitle("Success")
    .setDescription("🎶 Песни остановлены!")
    .setTimestamp();
    
    return message.channel.send(Embed).catch(() => message.channel.send("🎶 Песни остановлены!"));
  }
};