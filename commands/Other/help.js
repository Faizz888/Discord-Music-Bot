const { Default_Prefix, Color, Support, Donate } = require("../../config.js");
const Discord = require("discord.js");
const db = require("wio.db");

module.exports = {
  name: "help",
  aliases: ["h", "хелп"],
  category: "Other",
  description: "Помощь",
  usage: "help  <название команды>",
  run: async (client, message, args) => {
    let Prefix = await db.fetch(`Prefix_${message.guild.id}`);
    if (!Prefix) Prefix = Default_Prefix;
    
    const Config = client.commands.filter(cmd => cmd.category === "Config").array().map(m => m.name.charAt(0).toUpperCase() + m.name.slice(1)).join(", ");
    const Music = client.commands.filter(cmd => cmd.category === "Music").array().map(m => m.name.charAt(0).toUpperCase() + m.name.slice(1)).join(", ");
    const Other = client.commands.filter(cmd => cmd.category === "Other").array().map(m => m.name.charAt(0).toUpperCase() + m.name.slice(1)).join(", ");
    
    const Embed = new Discord.MessageEmbed()
    .setColor(Color)
    .setThumbnail(client.user.displayAvatarURL({ format: "png" }))
    .setTitle(`${client.user.username} Help!`)
    .setDescription(`Введите - **${Prefix}help <название команды> для получения информации команды**\n\n**🎶 Music**\n${Music}\n\n**🔮 Other**\n${Other}\n\n**🕹 Config**\n${Config})\nСсылка бота - [Мой мир](https://discord.com/oauth2/authorize?client_id=${client.user.id}&scope=bot&permissions=8)`)
    .setFooter(`Запросил ${message.author.username}`)
    .setTimestamp();
    
    if (!args[0]) return message.channel.send(Embed);
    
    let command = client.commands.get(args[0].toLowerCase()) || client.commands.get(client.aliases.get(args[0].toLowerCase()));
    
    if (!command) return; //message.channel.send(`No Command Found - ${args[0].charAt(0).toUpperCase() + args[0].slice(1)}`);
    
    const Embeded = new Discord.MessageEmbed()
    .setColor(Color)
    .setThumbnail(client.user.displayAvatarURL({ format: "png" }))
    .setTitle(`Команда ${command.name}`)
    .addField(`Название`, command.name.charAt(0).toUpperCase() + command.name.slice(1), true)
    .addField(`Категория`, command.category || "Нет категории", true)
    .addField(`Aliases`, command.aliases ? command.aliases.join(", ") : "No Aliases", true)
    .addField(`Использование`, command.usage, true)
    .addField(`Описание`, command.description)
    .setFooter(`Запрошено ${message.author.username}`)
    .setTimestamp();
    
    return message.channel.send(Embeded);
  }
};