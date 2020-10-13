const { MessageEmbed } = require("discord.js");

module.exports = {
  name: "help",
  description: "نمایش تمام دستورات و توضیحات",
  execute(message) {
    let commands = message.client.commands.array();
    
    if(message.deletable){
      message.delete();
    }

    let helpEmbed = new MessageEmbed()
    .setTitle("Help")
    .setDescription("لیست تمام دستورات")
    .setColor("30fffc");

    commands.forEach(cmd => {
      helpEmbed.addField(
        `${message.client.prefix}${cmd.name}`,
        `${cmd.description}`
      );
    });

    helpEmbed.setTimestamp();

    return message.channel.send(helpEmbed).then((msg) => {
      setTimeout(() => {
        if(msg.deletable){
          msg.delete();
        }
      }, 60000);
    });
  }
};
