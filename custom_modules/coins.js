const Discord = require('discord.js');

exports.run = async (message, database, cooldown, cmd, args, prefix)  => {
    let db_channel = database.channels.find(c => c.name == message.author.id);
    if(!db_channel) return;
    if(cmd == `${prefix}bal`){
        message.reply(`\`ваш баланс составляет ${db_channel.topic.split(";")[2]} кварцов.\``);
    }
    if(cmd == `${prefix}pay`){
        message.delete();
        let to = message.mentions.members.first();
        if(!to) return message.reply("`правильное использование: /pay [пользователь] [количество].`");
        if(to.id == message.author.id) return message.reply("`вы не можете передать деньги самому себе.`");
        let count = args[1];
        if(isNaN(count)) return message.reply("`количество должно быть числом.`");
        count = parseInt(count);
        if(count < 1 || count > 250) return message.reply("вы не можете передать меньшего 1-го и больше 250-ти кварцов.");
        let db_first = database.channels.find(c => c.name == message.member.id);
        let db_second = database.channels.find(c => c.name == to.id);
        if(!db_first) return message.reply("`ваш баланс составляет 0 кварцов.`");
        if(!db_second){
            database.createChannel(to.id, {type: "text"}).then(channel => {
                channel.setParent("583967184208920576");
                channel.setTopic(`${to.id};0;0`);
                db_second = channel;
            });
        }
        if(count > parseInt(db_second.topic.split(";")[2])) return message.reply("`у вас нет столько кварцов.");
        db_first.setTopic(`${db_first.topic.split(";")[0]};${parseInt(db_first.topic.split(";")[1])};${db_first.topic.split(";")[2] - count}`);
        db_second.setTopic(`${db_second.topic.split(";")[0]};${parseInt(db_second.topic.split(";")[1])};${db_second.topic.split(";")[2] + count}`);
        message.channel.send(`${to}, на ваш счет зачислено ${count} кварцов. Источник: ${message.member}`);
    }
    if(cooldown.has(message.author.id)) return;
    db_channel.setTopic(`${message.author.id};${db_channel.topic.split(";")[1]};${parseInt(db_channel.topic.split(";")[2]) + 1}`);
    cooldown.add(message.author.id);
    setTimeout(() => {
        cooldown.delete(message.author.id);
    }, 60000);
}
