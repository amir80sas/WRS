module.exports = {
	name: "resume",
	description: "در حال حاضر موسیقی را از سر بگیرید",
	execute(message) {
		const serverQueue = message.client.queue.get(message.guild.id);

		if (!message.member.voice.channel)
			return message.reply("ابتدا باید به یک کانال صوتی بپیوندید! ").catch(console.error);

		if (serverQueue && !serverQueue.playing) {
			serverQueue.playing = true;
			serverQueue.connection.dispatcher.resume();
			let resumeEmbed = new MessageEmbed()
				.setTitle("Resume")
				.setDescription(`موسیقی توسط توسط از سر گرفته شده است ${message.author}`)
				.setColor(`#388e3c`);

			return serverQueue.textChannel.send(resumeEmbed)
				.then((msg) => {
					setTimeout(() => {
						if (msg.deletable) {
							msg.delete();
						}
					}, 10000);
				})
				.catch(console.error);;
		}
		return message.reply("هیچ چیز بازی نمی کند.").catch(console.error);
	}
};
