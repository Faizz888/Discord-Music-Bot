const { Default_Prefix, Color } = require("../../config.js");
const Discord = require("discord.js");
const db = require("wio.db");

module.exports = {
  name: "queue",
  aliases: ["q"],
  category: "Music",
  description: "Показать очередь",
  usage: "queue",
  run: async (client, message, args) => {
    //const Channel = message.member.voice.channel;

    //if (!Channel) return message.channel.send("Please Join A Voice Channel!");

    const Queue = await client.queue.get(message.guild.id);

    if (!Queue || !Queue.Songs)
      return message.channel.send(
        "Ничего не играет."
      );
    
    const Sort = await Queue.Songs.map((Song, Position) => `${(Position + 1) === 1 ? "__Сейчас играет:__" : (Position - 1) === 0 ? 1 : (Position)} ${Song.Title.length > 60 ? Song.Title.slice(0, 60) + "..." : Song.Title} (${Song.Duration}) (Запросил ${Song.Owner})`).join("\n");
    
    if (!Sort) return message.channel.send("Очередь пуста.");

    let queuee = new Discord.MessageEmbed()
    queuee.setTitle("Очередь")
    queuee.setColor(Color);
    queuee.setDescription(Sort + "", {
      split: {char: "\n"}
    });
    return message.channel.send(queuee);
  }
};
