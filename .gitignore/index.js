const Discord = require("discord.js");
const YTDL = require("ytdl-core");
const PREFIX ="!";

function play(connection, message) {
	var server = servers[message.guild.id];
	
	server.dispatcher = connection.playStream(YTDL(server.queue[0], {filter: "audioonly"}));
	
	server.queue.shift();
	
	server.dispatcher.on("end", function() {
		if (server.queue[0]) play(connection, message);
		else connection.disconnect();
	});
}

var fortunes = [
    "enculé !",
    "salope."    
];

var bot = new Discord.Client();

var servers = {};

bot.on("ready", function() {
    console.log("Ready");
});



bot.on("message", function(message){
    if (message.author.equals(bot.user)) return;

    if (message.content === "bonjour")
        message.channel.sendMessage("bonjour " + fortunes[Math.floor(Math.random() * fortunes.length)]);

    if (!message.content.startsWith(PREFIX)) return;

    var args = message.content.substring(PREFIX.length).split(" ")
    

    switch (args[0].toLowerCase()) {
        case "ping":
            message.channel.sendMessage("Ton ping est de " + (this.pings.reduce((prev, p) => prev + p, 0) / this.pings.length - 100) + " !");
            break;

        case "info":
            message.channel.sendMessage("Je suis le plus fort lool");
            break;

        case "joueur":
            args.shift("")
            var embed = new Discord.RichEmbed()
                .setTitle("Information sur le joueur")
                .setDescription("Les statistiques du joueur recherché sur les meilleurs sites")
                .addField("Par World Of Tanks", "https://worldoftanks.eu/fr/community/accounts/#wot&at_search=" + args.join("%20"))
                .addField("Par WOT-LIFE", "https://fr.wot-life.com/eu/player/" + args.join("%20"))
                .addField("Par WOT STAT", "http://www.wotstats.org/stats/eu/" + args.join("%20"))
                .addField("Par NoobMeter", "http://www.noobmeter.com/player/eu/" + args.join("%20"))
                .setColor(0x00FF00)
                .setFooter("Gnetix bot copyright M4ST3R_CHIPS")
            message.channel.sendEmbed(embed);
            break;

	case "clan":
            args.shift("")
            var embed = new Discord.RichEmbed()
                .setTitle("Information sur le clan")
                .setDescription("Les statistiques du clan recherché sur le meilleur site")
                .addField("Par WOT-LIFE", "https://fr.wot-life.com/eu/clan/" + args.join("%20"))
                .setColor(0x00FF00)
                .setFooter("Gnetix bot copyright M4ST3R_CH1PS")
            message.channel.sendEmbed(embed);
            break;
			
        case "play":
            if (!args[1]) {
				message.channel.sendMessage("veuillez fournir un lien");
				return;
			}
			
			if (!message.member.voiceChannel) {
				message.channel.sendMessage("vous devez être dans un canal vocal");
				return;
			}
			
			if (!servers[message.guild.id]) servers[message.guild.id] = {
				queue: []
			};
			
			var server = servers[message.guild.id];
			
			server.queue.push(args[1]);
			
			if (!message.guild.voiceConnection) message.member.voiceChannel.join().then(function(connection) {
				play(connection, message);
			});
			break;
			
		case "!skip":
			var server = servers[message.guild.id];
			
			if (server.dispatcher) server.dispatcher.end();
			break;
		
		case "stop":
			var server = servers[message.guild.id];
			
			if (message.guild.voiceConnection) message.guild.voiceConnection.disconnect();
			break;
		    

        default:
            message.channel.sendMessage("Invalid command");
    }
});

bot.login(process.env.TOKEN);
