const Discord = require('discord.js');

exports.run = async (message, cmd, args, prefix, database) => {
  if(cmd == `${prefix}shop_start`){
      if(!message.author.id != "347827337137750016") return;
      message.delete();
      let channel = await message.guild.channels.find(c => c.name == "shop");
      if(!channel) return console.log("Канал магазина не найден.")
      let embed = new Discord.RichEmbed()
        .setAuthor("Quartz Shop")
        .addField("Список товаров:", `**Товары не найдены.**`)
        .setDescription("В этом канале вы можете купить уникальные товары за валюту дискор-сервера - кварцы.")
      channel.send(embed)
  }
} 
