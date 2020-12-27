const { Default_Prefix, Color } = require("../../config.js");
const Discord = require("discord.js");
const db = require("wio.db");

module.exports = {
  name: "skip",
  aliases: ["s", "скип", "пропустить"],
  category: "Music",
  description: "Пропустить песню",
  usage: "skip",
  run: async (client, message, args) => {
    
    const Channel = message.member.voice.channel;
    
    if (!Channel) return message.channel.send("Пожалуйста, присоединитесь к голосовому каналу.");
    
    const Queue = await client.queue.get(message.guild.id);
    
    if (!Queue) return message.channel.send("Ничего не играет");
    
    if (!Queue.Playing) Queue.Playing = true;
    
    await Queue.Bot.dispatcher.end();
    
    const Embed = new Discord.MessageEmbed()
    .setColor(Color)
    //.setTitle("Success")
    .setDescription("🎶 Музыка пропущена!")
    .setTimestamp();
    
    return message.channel.send(Embed).catch(() => message.channel.send("🎶 Музыка пропущена!"));
  }
};