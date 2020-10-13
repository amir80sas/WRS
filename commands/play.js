const { play } = require("../include/play");
const { YOUTUBE_API_KEY } = require("../config");
const ytdl = require("ytdl-core");
const YouTubeAPI = require("simple-youtube-api");
const youtube = new YouTubeAPI(YOUTUBE_API_KEY);
const { MessageEmbed } = require('discord.js');

module.exports = {
  name: "play",
  description: "صدا را از YouTube پخش می کند",
  async execute(message, args) {
    const { channel } = message.member.voice;

    if (!args.length) return message.reply("استفاده: /play <YouTube URL | Video Name>").catch(console.error);
    if (!channel) return message.reply("ابتدا باید به یک کانال صوتی بپیوندید!").catch(console.error);

    const permissions = channel.permissionsFor(message.client.user);
    if (!permissions.has("CONNECT"))
      return message.reply("دسترسی به کانال صوتی امکان پذیر نیست ، مجوزهای موجود نیست");
    if (!permissions.has("SPEAK"))
      return message.reply("من نمی توانم در این کانال صوتی صحبت کنم ، مطمئن شوید که مجوزهای مناسب را دارم!");

    const search = args.join(" ");
    const videoPattern = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.?be)\/.+$/gi;
    const playlistPattern = /^.*(list=)([^#\&\?]*).*/gi;
    const url = args[0];
    const urlValid = videoPattern.test(args[0]);

    // Start the playlist if playlist url was provided
    if (!videoPattern.test(args[0]) && playlistPattern.test(args[0])) {
      return message.client.commands.get("playlist").execute(message, args);
    }

    const serverQueue = message.client.queue.get(message.guild.id);
    const queueConstruct = {
      textChannel: message.channel,
      channel,
      connection: null,
      songs: [],
      loop: false,
      volume: 100,
      playing: true
    };

    let songInfo = null;
    let song = null;

    if (urlValid) {
      try {
        let searchEmbed = new MessageEmbed()
            .setTitle("Searching")
            .setDescription(`Searching for song with url **${url}**.`)
            .setColor(`#FF0000`);

        message.channel.send(searchEmbed).then((msg) => {
          setTimeout(() => {
            if(msg.deletable){
              msg.delete();
            }
          }, 10000);
        })

        songInfo = await ytdl.getInfo(url);
        song = {
          title: songInfo.title,
          url: songInfo.video_url,
          duration: songInfo.length_seconds
        };
      } catch (error) {
        if (error.message.includes("copyright")) {
          return message
            .reply("⛔ به دلیل محافظت از حق چاپ ، ویدیو قابل پخش نیست⛔")
            .catch(console.error);
        } else {
          console.error(error);
        }
      }
    } else {
      try {
        let searchEmbed = new MessageEmbed()
            .setTitle("Searching")
            .setDescription(`در حال جستجو برای آهنگ با نام **${search}**.`)
            .setColor(`#FF0000`);

        message.channel.send(searchEmbed).then((msg) => {
          setTimeout(() => {
            if(msg.deletable){
              msg.delete();
            }
          }, 10000);
        })
        const results = await youtube.searchVideos(search, 1);
        songInfo = await ytdl.getInfo(results[0].url);
        song = {
          title: songInfo.title,
          url: songInfo.video_url,
          duration: songInfo.length_seconds
        };
      } catch (error) {
        console.error(error);
      }
    }

    if (serverQueue) {
      serverQueue.songs.push(song);
      let addToQueueEmbed = new MessageEmbed()
        .setTitle("Added to queue")
        .setDescription(`شما با موفقیت اضافه کردید **${song.title}** به صف`)
        .setColor("#388e3c");

      return serverQueue.textChannel.send(addToQueueEmbed).catch(console.error);
    } else {
      queueConstruct.songs.push(song);
    }

    if (!serverQueue) message.client.queue.set(message.guild.id, queueConstruct);

    if (!serverQueue) {
      try {
        queueConstruct.connection = await channel.join();
        play(queueConstruct.songs[0], message);
      } catch (error) {
        console.error(`پیوستن به کانال صوتی امکان پذیر نیست: ${error}`);
        message.client.queue.delete(message.guild.id);
        await channel.leave();
        return message.channel.send(`پیوستن به کانال امکان پذیر نیست: ${error}`).catch(console.error);
      }
    }
  }
};
