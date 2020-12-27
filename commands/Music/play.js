const { Default_Prefix, Color } = require("../../config.js");
const { GetRegxp, Linker, Objector, Player } = require("../../Functions.js");
const Discord = require("discord.js"), Sr = require("youtube-sr"), syt = require("scrape-yt"), Ytdl = require("discord-ytdl-core"), db = require("wio.db");
const client = new Discord.Client();


module.exports = {
  name: "play",
  aliases: ["p", "играть"],
  category: "Music",
  description: "Играть музыку по названию / Ссылке / Плейлисту",
  usage: "play <название песни | ссылка на песню | название или песня плейлиста>",
  run: async (client, message, args) => {
    const Channel = message.member.voice.channel;
    if (!Channel)
      return message.channel.send("Пожалуйста, присоединитесь к голосовому каналу.");
    if (!args[0])
      return message.channel.send(
        "Youtube Видео (название / ссылка), или Youtube плейлист (название / ссылка)."
      );
    if (
      !Channel.permissionsFor(message.guild.me).has("CONNECT") ||
      !Channel.permissionsFor(message.guild.me).has("SPEAK")
    )
      return message.channel.send(
        "У меня нет прав, проверьте в настройках."
      );
    
    if (!Channel.joinable) return message.channel.send("Я не могу присоединиться.");

    const YtID = await GetRegxp("YtID"),
      YtUrl = await GetRegxp("YtUrl"),
      YtPlID = await GetRegxp("YtPlID"),
      YtPlUrl = await GetRegxp("YtPlUrl"),
      Base = await Linker("Base");
    let Song = null,
      SongInfo = null,
      Playlist = null;
    const ServerQueue = await client.queue.get(message.guild.id);

    if (YtID.test(args[0])) {
      try {
        const Link = await Linker(args[0]);
        const Info = await Ytdl.getInfo(Link);
        SongInfo = Info.videoDetails;
        Song = await Objector(SongInfo, message);
      } catch (error) {
        console.log(error);
        return message.channel.send(":x: Ошибка: видео не найдено");
      }
    } else if (YtUrl.test(args[0]) && !args[0].toLowerCase().includes("list")) {
      try {
        const Info = await Ytdl.getInfo(args[0]);
        SongInfo = Info.videoDetails;
        Song = await Objector(SongInfo, message);
      } catch (error) {
        console.log(error);
        return message.channel.send(
          ":x: Ошибка: что-то пошло не так либо видео не найдено."
        );
      }
    } else if (
      YtPlID.test(args[0]) &&
      !args[0].toLowerCase().startsWith("www.youtube.com")
    ) {
      try {
        const Info = await syt.getPlaylist(args[0]);
        const YtInfo = await Ytdl.getInfo(
          `https://www.youtube.com/watch?v=${Info.videos[0].id}`
        );
        SongInfo = YtInfo.videoDetails;
        Song = await Objector(SongInfo, message);
        const Arr = [];
        for (const Video of Info.videos) {
          const Infor = await Ytdl.getInfo(
            `https://www.youtube.com/watch?v=${Video.id}`
          );
          const Detail = Infor.videoDetails;
          await Arr.push(await Objector(Detail, message));
        }
        Playlist = {
          Yes: true,
          Data: Arr
        };
      } catch (error) {
        console.log(error);
        let errore = new Discord.MessageEmbed()
        .setDescription('Ошибка: плейлист приватный либо такого плейлиста не существует.')
        .setColor('RED')
        return message.channel.send(errore);
      }
    } else if (YtPlUrl.test(args[0])) {
      try {
        const Splitter = await args[0].split("list=")[1];
        console.log(Splitter);
        const Info = await syt.getPlaylist(
          Splitter.endsWith("/") ? Splitter.slice(0, -1) : Splitter
        );
        const YtInfo = await Ytdl.getInfo(
          `https://www.youtube.com/watch?v=${Info.videos[0].id}`
        );
        SongInfo = YtInfo.videoDetails;
        Song = await Objector(SongInfo, message);
        const Arr = [];
        for (const Video of Info.videos) {
          const Infor = await Ytdl.getInfo(
            `https://www.youtube.com/watch?v=${Video.id}`
          );
          const Detail = Infor.videoDetails;
          await Arr.push(await Objector(Detail, message));
        }
        Playlist = {
          Yes: true,
          Data: Arr
        };
      } catch (error) {
        console.log(error);
        let errore = new Discord.MessageEmbed()
        .setDescription('Ошибка: плейлист приватный либо такого плейлиста не существует.')
        .setColor('RED')
        return message.channel.send(errore);
      }
    } else {
      try {
        await Sr.searchOne(args.join(" ")).then(async Info => {
           const YtInfo = await Ytdl.getInfo(`https://www.youtube.com/watch?v=${Info.id}`);
          SongInfo = YtInfo.videoDetails;
          Song = await Objector(SongInfo, message);
        });
      } catch (error) {
        console.log(error);
        let errore = new Discord.MessageEmbed()
        .setDescription('Ошибка: что-то пошло не так или видео не найдено.')
        .setColor('RED')
        return message.channel.send(errore);
      };
    };

    let Joined;
    try {
      Joined = await Channel.join();
    } catch (error) {
      console.log(error);
      return message.channel.send("Я не могу войти :c");
    };

    if (ServerQueue) {
      if (Playlist && Playlist.Yes) {
        const Embed = new Discord.MessageEmbed()
          .setColor(Color)
          .setTitle("Плейлист добавлен!")
          .setThumbnail(Playlist.Data[0].Thumbnail)
          .setDescription(
            `[Playlist](${
              args[0].includes("http")
                ? args[0]
                : `https://www.youtube.com/playlist?list=${args[0]}`
            }) добавлен в очередь!`
          )
          .setTimestamp();
        await Playlist.Data.forEach(async Video => {
          try {
            await ServerQueue.Songs.push(Video);
          } catch (error) {
            await Channel.leave().catch(() => {});
            return message.channel.send(
              `Ошибка (на английском): ${error}`
            );
          }
        });
        return message.channel
          .send(Embed)
          .catch(() =>
            message.channel.send("Плейлист добавлен в очередь!")
          );
      } else {
        const Embed = new Discord.MessageEmbed()
          .setColor(Color)
          .setTitle("Добавлено в очередь!")
          .setThumbnail(Song.Thumbnail)
          .setDescription(
            `[${Song.Title}](${Song.Link})`
          )
          .setTimestamp();
        await ServerQueue.Songs.push(Song);
        return message.channel
          .send(Embed)
          .catch(() => message.channel.send("Песня добавлена в очередь!"));
      }
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

    if (Playlist && Playlist.Yes) {
      await Playlist.Data.forEach(ele => Database.Songs.push(ele));
    } else {
      await Database.Songs.push(Song);
    };

    try {
      await Player(message, Discord, client, Ytdl, { Play: Database.Songs[0], Color: Color }, db);
    } catch (error) {
      console.log(error);
      await client.queue.delete(message.guild.id);
      await Channel.leave().catch(() => {});
      return message.channel.send(
        "**Ошибка.**"
      );
    

    const Queue = await client.queue.get(message.guild.id);

    if (!Queue) return message.channel.send("Ничего не играет, добавьте пару песен :D");
   
    if (Queue.Playing) return message.channel.send("🎶 Играет!");
    
    Queue.Playing = false;
    Queue.Bot.dispatcher.resume();
    
    const Embed = new Discord.MessageEmbed()
    .setColor(Color)
    //.setTitle("Success")
    .setDescription("🎶 Возобновлено!")
    .setTimestamp();
    
    return message.channel.send(Embed).catch(() => message.channel.send("🎶"));
    }}}