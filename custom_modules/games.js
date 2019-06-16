const Discord = require('discord.js');

function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

exports.run = async (message, database, cmd, args, prefix) => {
  /*if(cmd == `${prefix}dice`){
    message.delete();
    let player = message.mentions.members.first();
    if(!player) return message.reply("`правильное использование команды: !dice [пользователь] [ставка].`");
    let count = args[1];
    if(!count) return message.reply("`правильное использование команды: !dice [пользователь] [ставка].`");
    if(isNaN(count)) return message.reply("`ставка должна иметь числовое значение.`");
    count = parseInt(count);
    if(count < 1 || count > 1000) return message.reply("`ставка должна быть в диапазоне от 1 до 1000.`");
    let msg = await message.channel.send(`${player}, \`${message.member.displayName} предлагает вам сыграть в кости. Ставка: ${count}. Нажмите на галочку, чтобы принять предложени.\``);
    msg.react("✔");
    let filter = (reaction, user) => reaction.emoji.name === '✔' && user.id === 'someID'
    let collector = msg.createReactionCollector(filter, {time: 30000});
    collector.on('collect', reaction => {
      //some funcs here
    });
    collector.on('end', collected => {
      if(!collected) return message.reply("`пользователь отказался от игры.`")
    })
  }*/
  if(cmd == `${prefix}wheel`){
    if(!args[0]) return message.reply("`правильное использование команды: !wheel [ставка]`");
    if(isNaN(args[0])) return message.reply("`ставка должна быть числом.`");
    if(parseInt(args[0]) < 1 || parseInt(args[0]) > 1000) return message.reply("`ставка должна быть в диапазоне от 1 до 1000.`");
    let random = getRandomInt(100);
    let multy;
    if(random <= 20) multy = 1;
    if(random > 20 && random <= 50) multy = 0;
    if(random > 50 && random <= 55) multy = 2;
    if(random > 60 && random <= 70) multy = 1.5;
    if(random > 70 && random <= 85) multy = 1.1;
    let text = "";
  }
}
