const { MessageEmbed } = require('discord.js');

module.exports = {
	name: "stop",
	description: "موسیقی را متوقف می کند",
	execute(message) {
		const serverQueue = message.client.queue.get(message.guild.id);

		if (!message.member.voice.channel)
			return message.reply("ابتدا باید به یک کانال صوتی بپیوندید!").catch(console.error);
		if (!serverQueue) return message.reply("هیچ چیز بازی نمی کند.").catch(console.error);

		serverQueue.songs = [];
		serverQueue.connection.dispatcher.end();


		let stopEmbed = new MessageEmbed()
			.setTitle("Stop")
			.setDescription(`موسیقی متوقف شده است${message.author}`)
			.setColor(`#d32f2f`);


		serverQueue.textChannel.send(stopEmbed)
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
