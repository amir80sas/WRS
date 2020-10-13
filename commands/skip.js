const { MessageEmbed } = require('discord.js');

module.exports = {
	name: "skip",
	description: "آهنگ فعلی را رد کنید",
	async execute(message) {
		const serverQueue = message.client.queue.get(message.guild.id);

		if (!message.member.voice.channel)
			return message.reply("ابتدا باید به یک کانال صوتی بپیوندید!").catch(console.error);
		if (!serverQueue)
			return message.channel.send("هیچ چیز بازی نمی کند که من می توانم برای شما نادیده بگیرم.").catch(console.error);

		serverQueue.connection.dispatcher.end();

		let skippedEmbed = new MessageEmbed()
			.setTitle("Skipped")
			.setDescription(`این آهنگ توسط اسکیپ شده است${message.author}`)
			.setColor(`#fbc02d`);

		serverQueue.textChannel.send(skippedEmbed)
			.then((msg) => {
				setTimeout(() => {
					if (msg.deletable) {
						msg.delete();
					}
				}, 10000);
			})
			.catch(console.error);
	}
};
