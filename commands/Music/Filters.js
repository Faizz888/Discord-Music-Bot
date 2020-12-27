const { Default_Prefix, Color } = require("../../config.js");
const Discord = require("discord.js");
const db = require("wio.db");

module.exports = {
  name: "filters",
  aliases: ["ft"],
  category: "Music",
  description: "Показать доступные фильтры",
  usage: "filters <название фильтра>",
  run: async (client, message, args) => {
    const Channel = message.member.voice.channel;

    if (!Channel) return message.channel.send("Пожалуйста, присоединитесь к голосовому каналу.");

    const Queue = await client.queue.get(message.guild.id);

    if (!Queue)
      return message.channel.send(
        "Ничего не играет."
      );

    const Filters = ["nightcore", "bassboost", "vaporwave", "phaser", "treble", "normalizer", "flanger"];
    const One = [];

    await Filters.forEach(async Filter => {
        let Status = await Queue.Filters[Filter] ? "включён - ✅" : "выключен- ❌";
        await One.push(`${Filter.charAt(0).toUpperCase() + Filter.slice(1)} - ${Status}`);
    });

    if (!args[0])
      return message.channel.send("```" + One.join("\n") + "```", { split: { char: "\n" } });

    if (!Filters.find(Fil => Fil === args[0].toLowerCase()))
      return message.channel.send(
        `Фильтр не найден - ` +
          args[0].charAt(0).toUpperCase() +
          args[0].slice(1)
      );

    args[0] = args[0].toLowerCase();
    
    let Finder = await Filters.find(Fil => Fil === args[0]);

    const Embed = new Discord.MessageEmbed()
      .setColor(Color)
      .setTitle("Информация о фильтре")
      .addField("Название", Finder.charAt(0).toUpperCase() + Finder.slice(1))
      .addField("Статус", Queue.Filters[args[0]] ? "**включён**" : "**выключен**")
      .setFooter(`Запрошен пользователем ${message.author.username}`)
      .setTimestamp();

    return message.channel
      .send(Embed)
      .catch(() =>
        message.channel.send(
          `${args[0].charAt(0).toUpperCase() + args[0].slice(1)} - ${
            Queue.Filters[args[0]] ? "**включён**" : "**выключен**"
          }`
        )
      );
  }
};
