const Discord = require('discord.js');

exports.run = async (message, cmd, args, prefix, embed_setup) => {
    if(!message.member.hasPermission("ADMINISTRATOR")) return;
    if(cmd == `${prefix}title`){
        let title = args.join(" ");
        if(!title) return;
        embed_setup[0] = title;
    }
    if(cmd == `${prefix}info`){
        let info = args.join(" ");
        if(!info) return;
        embed_setup[1] = info;
    }
    if(cmd == `${prefix}send`){
        let channel = message.guild.find(c => c.name == "📰news");
        if(!channel) return;
        let embed = new Discord.RichEmbed()
            .setAuthor(embed_setup[0])
            .setDescription(embed_setup[1])
            .setColor("#00afff")
            .setFooter("Seville News")
            .setTimestamp(new Date());
        channel.send(embed)
    }
    if(cmd == `${prefix}check`){
        let embed = new Discord.RichEmbed()
            .setAuthor(embed_setup[0])
            .setDescription(embed_setup[1])
            .setColor("#00afff")
            .setFooter("Seville News")
            .setTimestamp(new Date());
        message.channel.send(embed)
    }
}