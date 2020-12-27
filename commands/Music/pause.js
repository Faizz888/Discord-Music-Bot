const { Default_Prefix, Color } = require("../../config.js");
const Discord = require("discord.js");
const db = require("wio.db");

module.exports = {
  name: "pause",
  aliases: ["wait"],
  category: "Music",
  description: "Приостановить музыку",
  usage: "pause",
  run: async (client, message, args) => {
    
    const Channel = message.member.voice.channel;
    
    if (!Channel) return message.channel.send("Пожалуйста, присоединитесь к голосовому каналу.");
    
    const Queue = await client.queue.get(message.guild.id);
    
    if (!Queue) return message.channel.send("Ничего не играет, добавьте пару песен :D");
   
    if (!Queue.Playing) return message.channel.send("🎶 И так на паузе лох");
    
    Queue.Playing = false;
    Queue.Bot.dispatcher.pause();
    
    const Embed = new Discord.MessageEmbed()
    .setColor(Color)
    //.setTitle("Success")
    .setDescription("🎶 Приостановлено!")
    .setTimestamp();
    
    return message.channel.send(Embed).catch(() => message.channel.send("🎶 Музыка приостановлена!"));
  }
};