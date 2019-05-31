const Discord = require('discord.js');

exports.run = async (message, database) => {
    let author = message.member;
    if(!author) return;
    let db_channel = database.channels.find(c => c.name == author.id);
    if(!db_channel){
        database.createChannel(author.id, {type: "text"}).then(channel => {
            channel.setParent("583967184208920576");
            channel.setTopic(`${author.id};0;0`);
        });
    }
}