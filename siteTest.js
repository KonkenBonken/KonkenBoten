import Import_express from './lib/express.js';
import Discord from "discord.js";
import DataBase from './build/DataBase.js';
import dotenv from 'dotenv'
dotenv.config()

const intents = new Discord.Intents(
		(1 << 0) + //GUILDS
		(1 << 1) //  GUILD_MEMBERS
	),
	client = new Discord.Client({
		intents,
		waitGuildTimeout: 3e3
	});

const listen = Import_express({ client, DataBase, OAUTH: process.env.OAUTH, Discord });

client.login(process.env.TOKEN);
client.on('ready', () => listen(() => console.log(`listening and logged in as ${client.user.username}`)));