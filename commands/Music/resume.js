const { Default_Prefix, Color } = require("../../config.js");
const Discord = require("discord.js");
const db = require("wio.db");

module.exports = {
  name: "resume",
  aliases: ["restart", "p"],
  category: "Music",
  description: "Возобновить музыку",
  usage: "resume",
  run: async (client, message, args) => {
    
    const Channel = message.member.voice.channel;
    
    if (!Channel) return message.channel.send("Пожалуйста, присоединитесь к голосовому каналу.");
    
    const Queue = await client.queue.get(message.guild.id);
    
    if (!Queue) return message.channel.send("Ничего не играет");
   
    if (Queue.Playing) return message.channel.send("🎶 Уже играет");
    
    Queue.Playing = true;
    Queue.Bot.dispatcher.resume();
    
    const Embed = new Discord.MessageEmbed()
    .setColor(Color)
    //.setTitle("Success")
    .setDescription("🎶 Возобновлено!")
    .setTimestamp();
    
    return message.channel.send(Embed).catch(() => message.channel.send("🎶 Возобновлено!"));
  }
};