const { Default_Prefix, Color } = require("../../config.js");
const { Player } = require("../../Functions.js")
const Discord = require("discord.js"), Ytdl = require("discord-ytdl-core"), db = require("wio.db");

module.exports = {
  name: "filter",
  aliases: ["f", "ф", "фильтр"],
  category: "Music",
  description: "Включить / Выключить фильтр",
  usage: "filter <фильтр>",
  run: async (client, message, args) => {
    const Channel = message.member.voice.channel;

    if (!Channel) return message.channel.send("Пожалуйста присоединитесь к голосовому каналу.");

    const Queue = await client.queue.get(message.guild.id);

    if (!Queue)
      return message.channel.send(
        "Ничего не играет, добавьте пару песен :D"
      );
    
    let Filter = args[0];
    
    const Filters = ["nightcore", "bassboost", "vaporwave", "phaser", "treble", "normalizer", "flanger"];
    
    if (!Filter) return message.channel.send("Выберите фильтр - " + Filters.map(fil => fil.charAt(0).toUpperCase() + fil.slice(1)).join(", "));
    
    if (!Filters.find(Fil => Fil === Filter.toLowerCase())) return message.channel.send("Фильтр не найден - " + Filter.charAt(0).toUpperCase() + Filter.slice(1));
    
    const Embed = new Discord.MessageEmbed()
      .setColor(Color)
      //.setTitle("Success")
      .setDescription(`🎶 ${Filter.charAt(0).toUpperCase() + Filter.slice(1)} был ${Queue.Filters[Filter] ? "**выключен**" : "**включен**"}`)
      .setTimestamp();
    
    Filter = Filter.toLowerCase();
    
    Queue.Filters[Filter] = await Queue.Filters[Filter] ? false : true;
    
    await Player(message, Discord, client, Ytdl, { Filter: true, Play: Queue.Songs[0], Color: Color }, db);

    return message.channel.send(Embed).catch(() => message.channel.send(`🎶 ${Filter.charAt(0).toUpperCase() + Filter.slice(1)} был ${Queue.Filters[Filter] ? "**выключен**" : "**включен**"}`));
    
  }
};
