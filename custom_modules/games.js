const Discord = require('discord.js');

exports.run = async (message, database, cmd, args, prefix) => {
  if(cmd == `${prefix}dice`){
    let player = message.mentions.members.first();
    if(!user) return message.reply("`правильное использование команды: !pay [пользователь] [ставка].`");
    let count = args[1];
    if(!count) return message.reply("`правильное использование команды: !pay [пользователь] [ставка].`");
    if(isNaN(count)) return message.reply("`ставка должна иметь числовое значение.`");
    count = parseInt(count);
    if(count < 1 || count > 1000) return message.reply("`ставка должна быть в диапазоне от 1 до 1000.`");
    let msg await = message.channel.send(`${user}, \`${message.member.displayName} предлагает вам сыграть в кости. Ставка: ${count}. Нажмите на галочку, чтобы принять предложени.\``);
    msg.react("✔");
    let filter = (reaction, user) => reaction.emoji.name == "✔" && user.id = player.id;
    let collector = msg.createReactionCollector(filter, {time: 30000});
    collector.on('collect', reaction => {
      //some funcs here
    });
  }
}
