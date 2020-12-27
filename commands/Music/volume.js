const { Default_Prefix, Color } = require("../../config.js");
const Discord = require("discord.js");

module.exports = {
  name: "volume",
  aliases: ["v", "гр"],
  category: "Music",
  description: "Показать / Изменить текущую громкость",
  usage: "volume | <1 - 150>",
  run: async (client, message, args) => {
    const Channel = message.member.voice.channel;

    if (!Channel) return message.channel.send("Пожалуйста, присоединитесь к голосовому каналу.");

    const Queue = await client.queue.get(message.guild.id);

    if (!Queue)
      return message.channel.send(
        "Ничего не играет"
      );

    const Embed = new Discord.MessageEmbed()
      .setColor(Color)
      //.setTitle("Volume")
      .setDescription(`🎶 Громкость - ${Queue.Volume}`)
      .setTimestamp();

    if (!args[0]) return message.channel.send(Embed).catch(() => message.channel.send(`🎶 Громкость - ${Queue.Volume}`));

    if (args[0]) {
      if (isNaN(args[0]))
        return message.channel.send("Укажите корректное число");
      if (args[0] > 150) return message.channel.send("Лимит: 150");
      if (parseInt(Queue.Volume) === parseInt(args[0]))
        return message.channel.send("На данный момент стоит такая громкость.");

      Queue.Volume = parseInt(args[0]);
      Queue.Bot.dispatcher.setVolumeLogarithmic(Queue.Volume / 100);
      
      const Embeded = new Discord.MessageEmbed()
      .setColor(Color)
      //.setTitle("Success")
      .setDescription(`🎶 Громкость изменена - ${Queue.Volume}`)
      .setTimestamp();
      
      return message.channel.send(Embeded).catch(() => message.channel.send(`🎶 Громкость изменена - ${Queue.Volume}`));
    };
  }
};
