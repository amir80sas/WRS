const { MessageEmbed } = require('discord.js');

module.exports = {
	name: "remove",
	description: "حذف آهنگ از صف",
	async execute(message, args) {
		if (!args.length) {
			let removeErrorEmbed = new MessageEmbed()
				.setTitle("Remove")
				.setDescription("استفاده: /remove <Queue Number>")
				.setColor("#d32f2f")
			return message.channel.send(removeErrorEmbed).then((msg) => {
				setTimeout(() => {
					if (msg.deletable) {
						msg.delete();
					}
				}, 10000);
			}).catch(console.error);
		}
		const serverQueue = message.client.queue.get(message.guild.id);
		if (!serverQueue) {
			let removeErrorEmbed = new MessageEmbed()
				.setTitle("Remove")
				.setDescription("در حال حاضر چیزی در صف نیست .")
				.setColor("#d32f2f")
			return message.channel.send(removeErrorEmbed).then((msg) => {
				setTimeout(() => {
					if (msg.deletable) {
						msg.delete();
					}
				}, 10000);
			}).catch(console.error);
		}

		const song = serverQueue.songs.splice(args[0] - 1, 1);
		let removeEmbed = new MessageEmbed()
			.setTitle("Remove")
			.setDescription(`آهنگی به نام **${song[0].title}** توسط توسط صف حذف شده است ${message.author}`)
			.setColor("#d32f2f")
		serverQueue.textChannel.send(removeEmbed).then((msg) => {
			setTimeout(() => {
				if (msg.deletable) {
					msg.delete();
				}
			}, 10000);
		}).catch(console.error);
	}
};

