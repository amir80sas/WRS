const { MessageEmbed } = require("discord.js");

module.exports = {
	name: "loop",
	description: "حلقه موسیقی را تغییر دهید",
	async execute(message) {
		const serverQueue = message.client.queue.get(message.guild.id);
		if (!serverQueue) return message.reply("هیچ چیز بازی نمی کند.").catch(console.error);

		serverQueue.loop = !serverQueue.loop;

		let loopEmbed = new MessageEmbed()
			.setTitle("Loop")
			.setDescription(`تکرار اکنون است ${serverQueue.loop ? "**on**" : "**off**"}`)
			.setColor(serverQueue.loop ? `#388e3c` : `#d32f2f`);

		return serverQueue.textChannel
			.send(loopEmbed)
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
