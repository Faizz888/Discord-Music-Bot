const { Default_Prefix, Color } = require("../../config.js");
const Discord = require("discord.js");

module.exports = {
  name: "nowplaying",
  aliases: ["np"],
  category: "Music",
  description: "Информация о музыке",
  usage: "nowplaying",
  run: async (client, message, args) => {
    const Channel = message.member.voice.channel;

    if (!Channel) return message.channel.send("Пожалуйста, присоединитесь к голосовому каналу.");

    const Queue = await client.queue.get(message.guild.id);

    if (!Queue)
      return message.channel.send(
        "Ничего не играет."
      );

    const Song = await Queue.Songs[0],
      Total = Song.Duration,
      Seconds = Song.Seconds,
      Time = parseInt(Queue.Bot.dispatcher.streamTime + Queue.ExtraTime);

    function FD(duration) {
      let minutes = Math.floor(duration / 60);
      let hours = "";
      if (minutes > 59) {
        hours = Math.floor(minutes / 60);
        hours = hours >= 10 ? hours : "0" + hours;
        minutes = minutes - hours * 60;
        minutes = minutes >= 10 ? minutes : "0" + minutes;
      }
      duration = Math.floor(duration % 60);
      duration = duration >= 10 ? duration : "0" + duration;
      if (hours != "") {
        return hours + ":" + minutes + ":" + duration;
      }
      return minutes + ":" + duration;
    };

    const Sec = Math.round(Time / 1000),
      AllTime = (Seconds * 1000).toFixed(0);
    const Remaining = await FD((Seconds - Sec).toFixed(0));
    const Adder = await FD(Sec);
    const Index = Math.round((Time / AllTime) * 20);
    const Bar = "▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬".split("");
    let ShowBar;

    if (Index >= 1 && Index <= 20) {
      Bar.splice(Index, 0, "🔵");
      ShowBar = Bar.join("");
    } else {
      ShowBar = "🔵▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬";
    };

    //const data = new Discord.MessageEmbed()
    //data.setTitle('Название')
    //data.setDescription(`**[${Song.Title}](${Song.Link})**`)
    

    const Embed = new Discord.MessageEmbed()
      .addField("Название", `**[${Song.Title}](${Song.Link})**`)
      .addField("Автор канала", `**[${Song.Author}](${Song.AuthorLink})**`)
      .addField("Длительность", `**${Total}**`)
      .addField("Дата загрузки", `**${Song.Upload}**`)
      .addField("Просмотров", `**${Song.Views || 0}**`)
      .addField("Оставшееся время", `**${Remaining}**`)
      .setColor(Color)
      .setThumbnail(Song.Thumbnail)
      .setTitle("Сейчас играет")
      .setDescription(`${ShowBar}\n${Adder}/${Total}`)
      .setFooter(`Добавлено пользователем ${Song.Owner}`)
      .setTimestamp();

    return message.channel.send(Embed);
  }
};
