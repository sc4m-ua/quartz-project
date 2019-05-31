const Discord = require('discord.js');

exports.run = async (message, database, cooldown, cmd, args, prefix)  => {
    let db_channel = database.channels.find(c => c.name == message.author.id);
    if(!db_channel) return;
    if(cmd == `${prefix}bal`){
        message.delete();
        message.reply(`\`ваш баланс составляет ${db_channel.topic.split(";")[2]} кварцов.\``);
    }
    if(cooldown.has(message.author.id)) return;
    db_channel.setTopic(`${message.author.id};${db_channel.topic.split(";")[1]};${parseInt(db_channel.topic.split(";")[2]) + 1}`);
    cooldown.add(message.author.id);
    setTimeout(() => {
        cooldown.delete(message.author.id);
    }, 60000);
}