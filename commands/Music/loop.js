const { Default_Prefix, Color } = require("../../config.js");
const Discord = require("discord.js");

module.exports = {
  name: "loop",
  aliases: ["lp", "луп", "повтор"],
  category: "Music",
  description: "Установить / Изменить повтор",
  usage: "loop | <On или Off>",
  run: async (client, message, args) => {
    
    const Channel = message.member.voice.channel;
    
    if (!Channel) return message.channel.send("Пожалуйста, присоединитесь к голосовому каналу.");
    
    const Queue = await client.queue.get(message.guild.id);
    
    if (!Queue) return message.channel.send("Ничего не играет, добавьте пару песен :D");
    
    const Embed = new Discord.MessageEmbed()
    .setColor(Color)
    .setTitle("Loop статус")
    .setDescription(`🎶 Loop статус - ${Queue.Loop ? "On" : "Off"}`)
    .setTimestamp();
    
    if (!args[0]) return message.channel.send(Embed);
    
    const Settings = ["on", "off"];
    
    if (!Settings.find(Set => Set === args[0].toLowerCase())) return message.channel.send("Введён некорректный вариант - On , Off");
    
    const Status = Queue.Loop ? "on" : "off";
    
    args[0] = args[0].toLowerCase();
    
    if (args[0] === Status) return message.channel.send(`Уже ${Queue.Loop ? "On" : "Off"}`);
    
    const Embeded = new Discord.MessageEmbed()
    .setColor(Color)
   // .setTitle("Success")
    .setTimestamp();
    
    if (message.member.hasPermission('MANAGE_NICKNAMES')) {
      if (args[0] === "on") {
        Queue.Loop = true;
        Embeded.setDescription("🎶 Повтор активирован!")
        return message.channel.send(Embeded).catch(() => message.channel.send("🎶 Повтор активирован!"))
      } else {
        Queue.Loop = false;
        Embeded.setDescription("🎶 Повтор выключен!");
        return message.channel.send(Embeded).catch(() => message.channel.send("🎶 Повтор выключен!"));
      }
    } else {
      return message.channel.send("Нет прав. ``Изменение никнеймов.``")
    }
  }
};