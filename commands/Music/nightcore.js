const { Default_Prefix, Color } = require("../../config.js");
const { Player } = require("../../Functions.js")
const Discord = require("discord.js"), Ytdl = require("discord-ytdl-core"), db = require("wio.db");

module.exports = {
  name: "nightcore",
  aliases: ["nc"],
  category: "Music",
  description: "Включить / выключить изменение музыки",
  usage: "Nightcore",
  run: async (client, message, args) => {
    const Channel = message.member.voice.channel;

    if (!Channel) return message.channel.send("Пожалуйста, присоединитесь к голосовому каналу.");

    const Queue = await client.queue.get(message.guild.id);

    if (!Queue)
      return message.channel.send(
        "Ничего не играет, добавьте пару песен."
      );

    const Embed = new Discord.MessageEmbed()
      .setColor(Color)
      //.setTitle("Success")
      .setDescription(`🎶 Хардкор успешно ${Queue.Filters["nightcore"] ? "**выключен**" : "**включён**"}`)
      .setTimestamp();
    
    Queue.Filters["nightcore"] = Queue.Filters["nightcore"] ? false : true;
    
    await Player(message, Discord, client, Ytdl, { Filter: true, Play: Queue.Songs[0], Color: Color }, db);

    return message.channel.send(Embed).catch(() => message.channel.send(`🎶 Хардкор успешно ${Queue.Filters["nightcore"] ?  "**выключен**" : "**включён**"}`));
    
  }
};
