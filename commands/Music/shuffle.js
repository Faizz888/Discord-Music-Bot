const { Default_Prefix, Color } = require("../../config.js");
const Discord = require("discord.js");
const db = require("wio.db");

module.exports = {
  name: "shuffle",
  aliases: ["sf", "shufflequeue", "пр", "перемешать"],
  category: "Music",
  description: "Перемешать очередь",
  usage: "Queue",
  run: async (client, message, args) => {
    const Channel = message.member.voice.channel;

    if (!Channel) return message.channel.send("Пожалуйста, присоединитесь к голосовому каналу.");

    const Queue = await client.queue.get(message.guild.id);

    if (!Queue)
      return message.channel.send(
        "Очередь пуста."
      );
    
    const Current = await Queue.Songs.shift();
    
    Queue.Songs = Queue.Songs.sort(() => Math.random() - 0.5);
    await Queue.Songs.unshift(Current);
    
    const Embed = new Discord.MessageEmbed()
    .setColor(Color)
    .setTitle("Success")
    .setDescription("🎶 Очередь перемешана!")
    .setTimestamp();
    
    return message.channel.send(Embed).catch(() => message.channel.send("🎶 Очередь перемешана!"));
  }
};