const Discord = require('discord.js');

exports.run = async (message, database, cmd, args, prefix) => {
    if(message.guild.id != database.id) return;
    if(cmd == `${prefix}find`){
        let id = args[0];
        if(!id) return message.reply("`вы не указали id искаемого объекта.`");
        let channel = database.channels.find(c => c.name == args[0]);
        if(!channel) return message.reply("`канал не найден.`");
        message.channel.send(`**По вашему запросу найден следующий объект: <#${channel.id}>.**`);
    }
}
