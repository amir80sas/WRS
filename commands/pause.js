module.exports = {
	name: "pause",
	description: "موسیقی در حال پخش را متوقف کنید",
	execute(message) {
		if (!message.member.voice.channel) {
			let pauseErrorEmbed = new MessageEmbed()
				.setTitle("Pause")
				.setDescription("ابتدا باید به یک کانال صوتی بپیوندید!")
				.setColor("#d32f2f");

			return message.channel.send(pauseErrorEmbed).then((msg) => {
				setTimeout(() => {
					if (msg.deletable) {
						msg.delete();
					}
				})
			}).catch(console.error);
		}

		const serverQueue = message.client.queue.get(message.guild.id);
		if (serverQueue && serverQueue.playing) {
			serverQueue.playing = false;
			serverQueue.connection.dispatcher.pause(true);
			let pausedEmbed = new MessageEmbed()
				.setTitle("Paused")
				.setDescription(`The music has been paused by ${message.author}`)
				.setColor(`#d32f2f`);

			return serverQueue.textChannel.send(pausedEmbed)
				.then((msg) => {
					setTimeout(() => {
						if (msg.deletable) {
							msg.delete();
						}
					}, 10000);
				})
				.catch(console.error);
		}
		let pauseErrorEmbed = new MessageEmbed()
			.setTitle("Pause")
			.setDescription("هیچ چیز پخش نمی کنید.")
			.setColor("#d32f2f");

		return message.channel.send(pauseErrorEmbed).then((msg) => {
			setTimeout(() => {
				if (msg.deletable) {
					msg.delete();
				}
			})
		}).catch(console.error);
	}
};
