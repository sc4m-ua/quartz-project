const Discord = require('discord.js');
const client = new Discord.Client();
const logger = new Discord.Client();
let config = require('./config.json');
let prefix = config.prefix;
let main;
let database;
let copyright = "Bot by Franklin Mitchell";
let cooldown = new Set();
let embed_setup = new Array(2);
let version = "0.2";


client.on('ready', () => {
    main = client.guilds.get("582297095554203811");
    database = client.guilds.get("581847932177743873");
    console.log("I'm ready!");
    if(!main || !database) client.destroy();
    autoDelete();
    //main.channels.find(c => c.name == "bot-logs").send(`\`[✔] Бот успешно запущен. Версия: ${version}.\``);
});

logger.on('ready', () => {
    main = logger.guilds.get("582297095554203811");
    if(!main) logger.destroy();
    main.channels.find(c => c.name == "bot-logs").send(`\`[COURSE] Начинаю держать в курсе.\``);
    console.log("Начинаю держать в курсе.!");
});

client.on('message', async message => {
    //if(message.guild.id != main.id && message.guild.id != database.id) return;
    if(message.author.bot) return;
    let messageArray = message.content.split(" ");
    let cmd = messageArray[0];
    let args = messageArray.slice(1);
    require('./custom_modules/accounts').run(message, database);
    require('./custom_modules/coins').run(message, database, cooldown, cmd, args, prefix);
    require('./custom_modules/news').run(message, cmd, args, prefix, embed_setup);
    require('./custom_modules/database').run(message, database, cmd, args, prefix);
    require('./custom_modules/games').run(message, database, cmd, args, prefix);
    require('./custom_modules/shop_start').run(message, cmd, args, prefix, database);
    if(cmd == `${prefix}run`){
        let devs = await database.channels.find(c => c.name == "devs-02").fetchMessages({limit: 10});
        if(devs.size > 1) return console.log("Канал содержит больше одного сообщения.");
        devs.forEach(async temp => {
            if(!temp.content.includes(message.author.id)) return;
            let code = args.join(" ");
            try{
                eval(code);
            }catch(error){
                message.channel.send(`**При выполнении кода произошла ошибка:**\`\`\`${error}\`\`\``)
            }
        });
    }
    if(cmd == `${prefix}developer_add`){
        if(message.author.id != "347827337137750016") return;
        message.delete();
        let user = message.mentions.members.first();
        if(!user) return;
        let devs = await database.channels.find(c => c.name == "devs-02").fetchMessages({limit: 10});
        if(devs.size > 1) return console.log("Канал содержит больше одного сообщения.");
        devs.forEach(async temp => {
            if(temp.content.includes(user.id)) return;
            temp.edit(`${temp.content}\n${user.id}`);
        });
    }
    if(cmd == `${prefix}developer_remove`){
        if(message.author.id != "347827337137750016") return;
        message.delete();
        let user = message.mentions.members.first();
        if(!user) return;
        let devs = await database.channels.find(c => c.name == "devs-02").fetchMessages({limit: 10});
        if(devs.size > 1) return console.log("Канал содержит больше одного сообщения.");
        devs.forEach(async temp => {
            if(!temp.content.includes(user.id)) return;
            let new_msg = temp.content.split(`\n${user.id}`).join("")
            temp.edit(new_msg);
        });
    }
    if(cmd == `${prefix}developers`){
        if(!message.member.hasPermission("ADMINISTRATOR")) return;
        message.delete();
        let devs = await database.channels.find(c => c.name == "devs-02").fetchMessages({limit: 10});
        if(devs.size > 1) return console.log("Канал содержит больше одного сообщения.");
        devs.forEach(async temp => {
            let embed = new Discord.RichEmbed()
                .setAuthor("Список пользователей с правами разработчика:");
            let devs = temp.content.split(`\n`);
            let list = "";
            devs.forEach(async element => {
                list += `<@${element}>\n`;
            });
            embed.setDescription(list);
            embed.setFooter(copyright);
            embed.setTimestamp(new Date());
            embed.setColor("#ff0000");
            message.channel.send(embed);
        });
    }
    if(message.channel.name == "support"){
        message.delete();
        database.channels.find(c => c.name == "active-02").fetchMessages({limit: 10}).then(msgs => {
            if(msgs.size > 1) return console.log("Канал содержит больше одного сообщения.")
            msgs.forEach(async temp => {
                if(temp.content.includes(message.author.id)) return replyDelete(message, `\`у вас уже есть активное обращение. Если у вас появились дополнительные вопросы, напишите их в уже существующем обращении.\``, 7000);
                database.channels.find(c => c.name == "total-02").fetchMessages({limit: 10}).then(count => {
                    count.forEach(async temp_2 => {
                        let ticket_num = parseInt(temp_2.content);
                        let channel = await message.guild.createChannel(`appeal-${ticket_num+1}`, {type: "text"});
                        await channel.setParent(message.guild.channels.find(c => c.name == "Открытые обращения"));
                        let db_channel = await database.createChannel(channel.id, {type: "text"});
                        await db_channel.setParent("583374568954003481");
                        db_channel.send(`${message.author.id}\n0`);
                        temp.edit(`${temp.content}\n${message.member.id}`);
                        temp_2.edit(ticket_num+1)
                        await channel.overwritePermissions(message.guild.defaultRole, {
                            READ_MESSAGES: false
                        });
                        await channel.overwritePermissions(message.member, {
                            READ_MESSAGES: true,
                            READ_MESSAGE_HISTORY: true,
                            MANAGE_MESSAGES: false
                        });
                        await channel.overwritePermissions(message.guild.roles.find(r => r.name == "ϟ Support of Discord ϟ"), {
                            READ_MESSAGES: true,
                            READ_MESSAGE_HISTORY: true,
                            MANAGE_MESSAGES: false
                        });
                        replyDelete(message, `\`ваше обращение к команде поддержки составлено. Нажмите на \`${channel}\`, чтобы открыть диалог.\``, 5000);
                        let embed = new Discord.RichEmbed()
                            .setAuthor("Новое обращание с команде поддержки.")
                            .setDescription(`**${message.member} создал новое обращение к ${message.guild.roles.find(r => r.name == "ϟ Support of Discord ϟ")}.**`)
                            .addField(`Текст обращения:`, `**${message.content}**`)
                            .setColor("#ff0000")
                            .setTimestamp(new Date())
                            .setFooter(copyright);
                        channel.send(embed);
                    });
                });
            });
        })
    }
    if(cmd == `${prefix}close`){
        if(!message.member.roles.some(r => ['Head of Discord', 'ϟ Support of Discord ϟ'].includes(r.name))) return;
        let db_channel = database.channels.find(c => c.name == message.channel.id);
        if(!db_channel) return;
        message.delete();
        db_channel.fetchMessages({limit: 10}).then(msgs => {
            if(msgs.size > 1) return console.log("Канал содержит больше одного сообщения.");
            msgs.forEach(async temp => {
                let status = parseInt(temp.content.split("\n")[1]);
                if(status == 2) return replyDelete(message, "\`это обращение уже закрыто.\`", 5000);
                let new_msg = `${temp.content.split("\n")[0]}\n2`;
                temp.edit(new_msg);
                database.channels.find(c => c.name == "active-02").fetchMessages({limit: 10}).then(active => {
                    if(active.size > 1) return console.log("Канал содержит больше одного сообщения.")
                    active.forEach(async element => {
                        element.edit(element.content.split(`\n${temp.content.split("\n")[0]}`).join(""));
                        let author = message.guild.members.get(temp.content.split("\n")[0]);
                        if(author) await message.channel.overwritePermissions(author, {
                            SEND_MESSAGES: false
                        });
                        await message.channel.setParent("583817092931911740")
                        let embed = new Discord.RichEmbed()
                            .setDescription(`**${message.member} установил этому обращению статус "Закрыто".**`)
                            .setColor(`#0ac100`)
                        message.channel.send(embed);
                    });
                });
            });
        });
    }
    if(cmd == `${prefix}hold`){
        if(!message.member.roles.some(r => ['Head of Discord', 'ϟ Support of Discord ϟ'].includes(r.name))) return;
        let db_channel = database.channels.find(c => c.name == message.channel.id);
        if(!db_channel) return;
        message.delete();
        db_channel.fetchMessages({limit: 10}).then(msgs => {
            if(msgs.size > 1) return console.log("Канал содержит больше одного сообщения.");
            msgs.forEach(async temp => {
                let status = parseInt(temp.content.split("\n")[1]);
                if(status == 1) return replyDelete(message, "\`это обращение уже на рассмотрении.\`", 5000);
                let new_msg = `${temp.content.split("\n")[0]}\n1`;
                temp.edit(new_msg);
                let author = message.guild.members.get(temp.content.split("\n")[0]);
                if(author) await message.channel.overwritePermissions(author, {
                    SEND_MESSAGES: true
                });
                await message.channel.setParent("583816953077039115")
                let embed = new Discord.RichEmbed()
                    .setDescription(`**${message.member} установил этому обращению статус "На рассмотрении".**`)
                    .setColor(`#ffb000`)
                message.channel.send(embed);
            });
        });
    }
    if(message.channel.name == "bug-report"){
        message.delete();
        if(!message.member.roles.has(message.guild.roles.find(r => r.name == "Testers Team").id)) return;
        message.reply("`ваш баг был успешно отправлен разработчикам.`").then(async msg => {
            msg.delete(5000);
        });
        let channel = message.guild.channels.find(c => c.name == "new-bugs");
        if(!channel) return console.log("New bugs channel doesn't exist.");
        let embed = new Discord.RichEmbed()
        embed.setAuthor(`New bug reported by ${message.author.username}#${message.author.discriminator}.`)
        embed.addField(`Message:`, message.content)
        embed.addField(`Sender:`, message.member)
        embed.setFooter("Testers Team by Franklin Mitchell")
        embed.setTimestamp(new Date())
        embed.setColor("#36393F");
        channel.send(embed).then(async msg => {
            await msg.react("✅");
            msg.react("❌");
        });
    }
});

client.on('roleDelete', async role => {
    role.guild.fetchAuditLogs({type: "ROLE_DELETE"}).then(async audit => {
        let member = role.guild.members.find(m => m.id == audit.entries.first().executor.id);
        if(!member) return;
        if(member.hasPermission("ADMINISTRATOR")) return;
        member.setRoles([]);
        let mod_chat = await role.guild.channels.find(c => c.name == "moderators-chat");
        if(!mod_chat) return;
        mod_chat.send(`\`[WARNING] \`<@${member.id}>\` был снят системой анти-слива. Причина: удаление роли "${role.name}".\``);
    });
});

client.on('roleCreate', async role => {
    role.guild.fetchAuditLogs({type: "ROLE_CREATE"}).then(async audit => {
        let member = role.guild.members.find(m => m.id == audit.entries.first().executor.id);
        if(!member) return;
        if(member.hasPermission("ADMINISTRATOR")) return;
        member.setRoles([]);
        let mod_chat = await role.guild.channels.find(c => c.name == "moderators-chat");
        if(!mod_chat) return;
        mod_chat.send(`\`[WARNING] \`<@${member.id}>\` был снят системой анти-слива. Причина: создание роли "${role.name}".\``);
    });
});

client.on('roleUpdate', async role => {
    role.guild.fetchAuditLogs({type: "ROLE_UPDATE"}).then(async audit => {
        let member = role.guild.members.find(m => m.id == audit.entries.first().executor.id);
        if(!member) return;
        if(member.hasPermission("ADMINISTRATOR")) return;
        member.setRoles([]);
        let mod_chat = await role.guild.channels.find(c => c.name == "moderators-chat");
        if(!mod_chat) return;
        mod_chat.send(`\`[WARNING] \`<@${member.id}>\` был снят системой анти-слива. Причина: обновление роли "${role.name}".\``);
    });
});

client.on('raw', async packet => {
    if (!['MESSAGE_REACTION_ADD', 'MESSAGE_REACTION_REMOVE'].includes(packet.t)) return;
    const channel = client.channels.get(packet.d.channel_id);
    if (channel.messages.has(packet.d.message_id)) return;
    channel.fetchMessage(packet.d.message_id).then(message => {
        const emoji = packet.d.emoji.id ? `${packet.d.emoji.name}:${packet.d.emoji.id}` : packet.d.emoji.name;
        const reaction = message.reactions.get(emoji);
        if (reaction) reaction.users.set(packet.d.user_id, client.users.get(packet.d.user_id));
        if (packet.t === 'MESSAGE_REACTION_ADD') {
            client.emit('messageReactionAdd', reaction, client.users.get(packet.d.user_id));
        }
    });
});

client.on('messageReactionAdd', async (reaction, user) => {
    console.log("done!")
});

client.login(process.env.BOT_TOKEN);

async function replyDelete(message, text, time){
    message.reply(text).then(msg => {
        msg.delete(time);
    });
}

async function renderSupport(){
    let embed = new Discord.RichEmbed()
        .setAuthor("Команда поддержки Discord")
        .setDescription(`**Чтобы составить обращение к саппортам, напишите его в этом канале.**`)
        .setFooter(copyright)
        .setColor("#0090ff")
    main.channels.find(c => c.name == "support").send(embed);
}

async function autoDelete(){
    let date = new Date().valueOf() - 1000000000000;
    setInterval(async () => {
        main.channels.forEach(async channel => {
            if(!channel.name.startsWith("appeal-")) return;
            let createdAt = channel.createdAt.valueOf() - 1000000000000;
            let db_channel = await database.channels.find(c => c.name == channel.id);
            if(!db_channel) return main.channels.find(c => c.name == "bot-logs").send(`\`[APPEAL] Обращение №${channel.name.split("-")[1]} было удалено, так как не было найдено в базе данных. Сообщите о данной ошибке техническим администраторам.\``);
            let msgs = await db_channel.fetchMessages({limit: 10});
            msgs.forEach(async temp => {
                if(temp.content.split("\n")[1] != "2") return;
                if(date - createdAt >= 172800000){
                    channel.delete();
                    db_channel.delete();
                    main.channels.find(c => c.name == "bot-logs").send(`\`[APPEAL] Обращение №${channel.name.split("-")[1]} было удалено. Причина: 48 часов в статусе "Закрыто".\``);
                }
            });
        });
    }, 300000)
}
