const { Default_Prefix, Color } = require("../../config.js");
const { Player, Objector } = require("../../Functions.js");
const Discord = require("discord.js");
const db = require("wio.db"),
  Sr = require("youtube-sr"),
  Ytdl = require("discord-ytdl-core");

module.exports = {
  name: "search",
  aliases: ["lookup", "поиск"],
  category: "Music",
  description: "Найти музыку",
  usage: "search <песня>",
  run: async (client, message, args) => {
    const Channel = message.member.voice.channel;

    if (!Channel) return message.channel.send("Пожалуйста, присоединитесь к голосовому каналу.");
    if (!args[0]) return message.channel.send("Что искать-то?");

    const Queue = await client.queue.get(message.guild.id);

    if (
      !Channel.permissionsFor(message.guild.me).has("CONNECT") ||
      !Channel.permissionsFor(message.guild.me).has("SPEAK")
    )
      return message.channel.send(
        "У меня недостаточно прав, проверьте в настройках."
      );

    if (!Channel.joinable)
      return message.channel.send("Я не могу войти :c");

      let errore = new Discord.MessageEmbed()
      .setDescription('Ошибка: что-то пошло не так или видео не найдено.')
      .setColor('RED')
    await Sr.search(args.join(" "), { limit: 10 }).then(async Data => {
      if (!Data[0].id)

        return message.channel.send(errore);
      const All = await Data.map(
          (Video, Position) =>
            `${Position + 1}. **[${
              Video.title.length > 100 ? Video.title + "..." : Video.title
            }](https://youtube.com/watch?v=${Video.id})**`
        ),
        Filter = m => m.author.id === message.author.id;
      
      const Embed = new Discord.MessageEmbed()
      .setColor(Color)
      .setTitle("Выберите песню")
      .setDescription(All)
      .setFooter("Напишите цифру выбранной песни | Время: 5 минут")
      .setTimestamp();
      
      message.channel.send(Embed).catch(() => message.channel.send(`Напишите цифру выбранной песни | Время: 5 минут\n\n${All}`))

      let notfound = new Discord.MessageEmbed()
      notfound.setDescription('Указано некорректное число, поиск отменён.');
      notfound.setColor('RED');
      await message.channel
        .awaitMessages(Filter, { max: 1, time: 300000, errors: ["time"] })
        .then(async Msg => {
          let Content = parseInt(Msg.first().content),
            SongInfo = null,
            Song = null;
          Msg = Msg.first();
          if (isNaN(Content))
            return message.channel.send(notfound);
          if (Content - 1 > All.length || !All[Content])
            return message.channel.send(notfound);

          try {
            const Find = await Data.find(Dat => Dat === Data[Content - 1]);
            console.log(Find);
            const YtInfo = await Ytdl.getInfo(
              `https://youtube.com/watch?v=${Find.id}`
            );
            SongInfo = YtInfo.videoDetails;
            Song = await Objector(SongInfo, message);
          } catch (error) {
            console.log(error)
            return message.channel.send("Ошибка: что-то пошло не так.");
          }

          let Joined;
          try {
            Joined = await Channel.join();
          } catch (error) {
            console.log(error);
            return message.channel.send(
              "Я не могу войти в голосовой канал :C"
            );
          }

          if (Queue) {
            const Embed = new Discord.MessageEmbed()
              .setColor(Color)
              .setTitle("Song Added!")
              .setThumbnail(Song.Thumbnail)
              .setDescription(
                `[${Song.Title}](${Song.Link}) добавлена в очередь!`
              )
              .setTimestamp();
            await Queue.Songs.push(Song);
            return message.channel
              .send(Embed)
              .catch(() =>
                message.channel.send("Песня добавлена в очередь!")
              );
          }

          const Database = {
            TextChannel: message.channel,
            VoiceChannel: Channel,
            Steam: null,
            Bot: Joined,
            Songs: [],
            Filters: {},
            Volume: 100,
            Loop: false,
            Always: false,
            Playing: true
          };

          await client.queue.set(message.guild.id, Database);

          await Database.Songs.push(Song);

          try {
            await Player(message, Discord, client, Ytdl, {
              Play: Database.Songs[0],
              Color: Color
            }, db);
          } catch (error) {
            console.log(error);
            await client.queue.delete(message.guild.id);
            await Channel.leave().catch(() => {});
            return message.channel.send(
              "**Ошибка.**"
            );
          }
        });
    });
  }
};
