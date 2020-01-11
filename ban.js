const axios = require('axios');

const Discord = require('discord.js');

require('dotenv').config()

module.exports = {
    record: (message, args) =>{
        var entry = {
            id: message.author.id,
            username: message.author.username,
            avatar: message.author.avatarURL
        } 
        if(args[1]){
            const user = message.mentions.users.first();

            if(user){
                entry.id = user.id;
                entry.username = user.username;
                entry.avatar = user.avatarURL;
            } else {
                message.channel.send("User not found in server!");
            }
        }
        axios.get('http://localhost:5000/users', {params:{userID: entry.id}})
        .then (response => {
            if(response.data !== null){
                const embed = new Discord.RichEmbed()
                    .setTitle('Ban Record')
                    .addField('Name', response.data.username)
                    .addField('Minor Reports', response.data.minorReports)
                    .addField('Major Reports', response.data.majorReports)
                    .setColor(0x76b900)
                    .setThumbnail(entry.avatar);
                message.channel.send(embed);
            } else {
                const embed = new Discord.RichEmbed()
                    .setTitle('Ban Record')
                    .addField('Name', entry.username)
                    .addField('Minor Reports', 0)
                    .addField('Major Reports', 0)
                    .setColor(0x76b900)
                    .setThumbnail(entry.avatar);
                message.channel.send(embed);
            }
            
        });

    },

    ban: (message, args) =>{
        console.log('Ban called!');
        const filter = m => m.author.id === message.author.id;
        if(args[0] == 'report' && args.length <= 3){ //check command and parameters
            if(message.member.hasPermission(['KICK_MEMBERS', 'BAN_MEMBERS'])){
                if(args[1]){//check if report target specified
                    const user = message.mentions.users.first();
    
                    if(user){
                        const entry = {
                            userID: user.id,
                            username: user.tag,
                            minorReports: 0,
                            majorReports: 0,
                        };

                        if(args.length > 2){
                            if(args[2] == '--minor'){
                                //minor report
                                message.reply("Which rule was broken? [1-7]").then(r => r.delete(10000));
                                message.channel.awaitMessages(filter, {max: 1, time: 10000}).then(collected =>{
                                    var rule = collected.first().content;
                                    if(rule.length == 1 && rule.match(/[1-7]/)){
                                        axios.post('http://localhost:5000/users/minor', entry)
                                        .then(response => {
                                            if(response.data !== null){ 
                                                if(response.data.minorReports >= 2){ //one major report
                                                    axios.post('http://localhost:5000/users/update', entry);
                                                }
                                                if(response.data.majorReports >= 2){ //need to ban!
                                                    const banned = message.member.guild.member(user);
                                                    axios.post('http://localhost:5000/users/delete', entry);
                                                    banned.kick("You were kicked for 3 major reports!").then(() => {
                                                        message.send(`Successfully kicked ${user.tag}`);
                                                    }).catch(err => {
                                                        message.send('Unable to kick the member');
                                                        console.log(err);
                                                    })
                                                }
                                            } else { //new ban entry
                                                entry.minorReports += 1;
                                                axios.post('http://localhost:5000/users/add', entry)
                                                    .then(res => console.log(res.data));
                                            }
                                        });
                                        message.channel.send(`Minor report for ${user.tag}!`);
                                        user.send(`You were given a minor report for breaking rule ${rule}.`);
                                    } else {
                                        message.send('Invalid parameters. Please try again.');
                                    }
                                });
                            } else {
                                message.channel.send("Invalid parameters. Usage: \`bb!report [@User] [--minor]\`.");
                            }
                        } else {
                            //major report
                            message.reply("Which rule was broken? [1-7]").then(r => r.delete(10000));
                                message.channel.awaitMessages(filter, {max: 1, time: 10000}).then(collected =>{
                                    var rule = collected.first().content;
                                    if(rule.length == 1 && rule.match(/[1-7]/)){
                                        axios.post('http://localhost:5000/users/major', entry)
                                        .then(response => {
                                            if(response.data !== null){ //check if user exists
                                                if(response.data.majorReports >= 2){ //need to ban!
                                                    const banned = message.member.guild.member(user);
                                                    axios.post('http://localhost:5000/users/delete', entry);
                                                    banned.kick("You were kicked for 3 major reports!").then(() => {
                                                        message.send(`successfully kicked ${user.tag}`);
                                                    }).catch(err => {
                                                        message.send('Unable to kick the member');
                                                        console.log(err);
                                                    })
                                                }
                                            } else { //new ban entry
                                                entry.majorReports += 1;
                                                axios.post('http://localhost:5000/users/add', entry)
                                                    .then(res => console.log(res.data));
                                            }
                                        });
                                        message.channel.send(`Major report for ${user.tag}`);
                                        user.send(`You were given a major report for breaking rule ${rule}.`);
                                    } else {
                                        message.send('Invalid parameters. Please try again.');
                                    }
                                });    
                        }
                    } else{
                            message.channel.send("User not found in server!");
                    }
                } else {
                    message.channel.send('You need to specify a person to report! Usage: \`bb!report [@User] [--minor]\`.');
                }
            } else {
                message.reply("you don't have proper role to report!")
            }
        } else {
            message.channel.send("Invalid command. Usage: \`bb!report [@User] [--minor]\`.")
        }
    }
};