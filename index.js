const Discord = require('discord.js');
const {Client, Attachment} = require('discord.js');
const client = new Discord.Client();


//Put javascript modules below =================

const bb_ban = require("./ban");
const bb_server = require("./server");

//End javascript modules =======================

client.on('ready', () =>{
    console.log('BenBot is online!');
})

client.on("guildMemberAdd", member => {
    const channel = member.guild.channels.find(channel => channel.name === "welcome");
    if(!channel) return;

    channel.send(`Welcome to our server, ${member}, please read our rules in the rules channel!`);
})

client.on('message', message=>{
    
    let args = message.content.substring(process.env.BOT_PREFIX.length).split(" ");

    switch(args[0]){
        case 'ping':
            message.channel.send('pong!');
            break;
        case 'record':
            bb_ban.record(message, args);
            break;
        case 'report':
            bb_ban.ban(message, args);
            break;
        case 'info':
            message.channel.send('My name is BenBot created by Ben Wu.');
            break;
        case 'clear':
            if(!args[1]) return message.reply('Error please define second arg')
            message.channel.bulkDelete(args[1]);
            break;

        case 'embed':
            const embed = new Discord.RichEmbed()
            .setTitle('User Information')
            .addField('Player Name', message.author.username)
            .addField('Current Server', message.guild.name)
            .setColor(0x76b900)
            .setThumbnail(message.author.avatarURL);
            message.channel.send(embed);
            break;
    }
})

client.login(process.env.BOT_TOKEN);