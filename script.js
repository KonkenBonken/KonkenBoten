console.log(`Start  || ${new Date().getHours()}:${new Date().getMinutes()}`);
const __dirname = process.cwd();
console.log('Node version:', process.version)
console.time('Load');
console.time('Packages');

import dotenv from 'dotenv'
dotenv.config()
import Discord from "discord.js";
import fsSync from 'fs';
// import { promises as fs } from 'fs';
import { minify as Terser } from "terser";
// import csso from 'csso';
// const MinifyCSS = csso.minify;
// import { Base64 } from 'js-base64';
import { JSDOM } from "jsdom";
import lightRandom from 'light-random';
import Fetch from 'node-fetch';
import cookieParser from 'cookie-parser';
import moment from 'moment-timezone';
// import sass from 'sass';
import { parse as Duration, stringify as CleanDate } from 'simple-duration';
import ObjectMerge from 'deepmerge';
import express from 'express';
import { Server as socketIo } from 'socket.io';
// import { measure as Temperature } from 'pi-temperature';
import { isWebUri as isValidUrl } from 'valid-url';

import Import_http from 'http';
import Import_discordOauth2 from "discord-oauth2";
import Import_topGgSdk from '@top-gg/sdk';
import Import_nodeCache from 'node-cache';
// import Import_emojiTestList from 'emoji-test-list';
import EmojiList from './src/emojis.js';
console.timeEnd('Packages');
console.time('Consts');
// console.log(Import_emojis);
const fs = fsSync.promises;

const intents = new Discord.Intents( // https://discord.com/developers/docs/topics/gateway#list-of-intents
		(1 << 0) + //GUILDS
		(1 << 1) + //GUILD_MEMBERS
		(1 << 2) + //GUILD_BANS
		(1 << 3) + //GUILD_EMOJIS_AND_STICKERS
		// (1 << 4)+//GUILD_INTEGRATIONS
		// (1 << 5)+//GUILD_WEBHOOKS
		(1 << 6) + //GUILD_INVITES
		(1 << 7) + //GUILD_VOICE_STATES
		//	(1 << 8) + //GUILD_PRESENCES
		(1 << 9) + //GUILD_MESSAGES
		(1 << 10) + //GUILD_MESSAGE_REACTIONS
		// (1 << 11)+//GUILD_MESSAGE_TYPING
		(1 << 12) + //DIRECT_MESSAGES
		// (1 << 13)+//DIRECT_MESSAGE_REACTIONS
		// (1 << 14)+//DIRECT_MESSAGE_TYPING
		(1 << 16) //GUILD_SCHEDULED_EVENTS
	),
	client = new Discord.Client({
		intents,
		waitGuildTimeout: 5e3
	});
console.time('Login');
client.login(process.env.TOKEN);

// console.log(intents.serialize());
const app = express(),
	server = Import_http.createServer(app),
	io = new socketIo(server, {
		transports: ['polling'],
		pingInterval: 60e3,
		pingTimeout: 120e3,
	}),
	port = 80,
	DefaultPrefix = '$',
	PageTitle = 'KonkenBoten - The Ultimate Discord Bot',
	// ES5 = require('es6-arrow-function').compile,
	// MinifyCSS = require('clean-css'),
	DataBase = JSON.parse(fsSync.readFileSync('DataBase.json', 'utf8').trim().replace(/Ã¤/g, 'ä').replace(/Ã¥/g, 'å').replace(/Ã¶/g, 'ö')),
	// topggSdk = require('@top-gg/sdk'),
	topggApi = new(Import_topGgSdk.Api)('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjgxMzgwMzU3NTI2NDAxODQzMyIsImJvdCI6dHJ1ZSwiaWF0IjoxNjE4NjYzNDU4fQ.gqGp-wnvzaFk69HGOohqYPlJ2J4bEjL7RRAvWFCroMQ'),
	TopggSend = () => topggApi.postStats({ serverCount: client.guilds.cache.size }),
	// Remebered = new Map(),
	Cache = new(Import_nodeCache)();
// const EmojiList = Object.entries(Import_emojiTestList).filter((x, i) => x[0].length <= 2 && +x[1].age <= 12) //&& x[1].toFullyQualified
// 	.filter((x, i) => !(i >= 1289 || i >= 1239 && i <= 1259 || i >= 1138 && i <= 1233 || i >= 1154 && i <= 1157 || i >= 699 && i <= 729 || i >= 295 && i <= 303 || [18, 19, 127, 146].includes(i)))
// 	.map(([e, o]) => ({
// 		e: o.toFullyQualified || e, // TODO: Testa om icke-toFullyQualified kan reageras i DC
// 		n: o.name,
// 		i: (o.toFullyQualified || e).codePointAt().toString(16)
// 	})).filter((x, i, o) => o.map(y => y.e).indexOf(x.e) == i);
// EmojiList = Import_emojis.split(';').map(s=>s.split(',')).map(([name,id])=>({
// 	e: o.toFullyQualified || e,
// 	n: o.name
// 	}))


const NewGuildSubrcibers = [],
	ClientID = '813803575264018433',
	RedirectTo = { de: 'https://bot.konkenbonken.se/oauth', en: 'https%3A%2F%2Fbot.konkenbonken.se%2Foauth' },
	URLs = {
		oauth: `https://discord.com/api/oauth2/authorize?client_id=${ClientID}&redirect_uri=${RedirectTo.en}&scope=identify%20guilds&response_type=code`,
		/*%20guilds.join*/
		bot: `https://discord.com/api/oauth2/authorize?client_id=${ClientID}&permissions=8&scope=bot`,
		botRedirect: `https://discord.com/api/oauth2/authorize?client_id=${ClientID}&redirect_uri=${RedirectTo.en}&permissions=8&scope=bot&response_type=code`
	},
	oauth = new(Import_discordOauth2)({
		clientId: ClientID,
		clientSecret: "wn-BWF8mQv0xSkSDfNEG2HE7eos6caIM",
		redirectUri: RedirectTo.de
	}),
	// removeNull = obj => Object.fromEntries(Object.entries(obj).filter(([_, v]) => v != null).map(([k, v]) => [k, v === Object(v) ? removeNull(v) : v])),
	// WriteDataBase = () => fs.writeFile('DataBase.json', JSON.stringify(DataBase)),
	WriteDataBase = () => {
		if (performance.now() > 30e3)
			fs.writeFile('DataBase-temp.json', JSON.stringify(DataBase)).then(() => fs.rename('DataBase-temp.json', 'DataBase.json').catch(x => 0))
	},
	{ document } = new JSDOM().window,
	{ isArray } = Array,
	// isObject = x => x && typeof x === 'object' && !isArray(x),
	// Duration = str => simpleDuration(str.split(' ')[0]),
	newDiv = (el = 'div', ...classes) => {
		let div = document.createElement(el);
		if (classes) classes.filterX.forEach(cl => div.classList.add(cl));
		div.Html = str => { div.innerHTML = str; return div };
		div.Id = str => { div.id = str; return div.Attribute('id', str, true) };
		div.Type = str => { div.type = str; return div.Attribute('type', str, true) };
		div.Value = str => { div.value = str; return div.Attribute('value', str) };
		div.Src = str => { div.src = str; return div.Attribute('src', str, true) };
		div.Append = (...el) => { if (el[0]) div.append(...el); return div };
		div.Prepend = (...el) => { if (el[0]) div.prepend(...el); return div };
		div.Attribute = (key, value = '', ignIfEpty = false) => { if (!ignIfEpty || value) div.setAttribute(key, value); return div };
		div.ToggleAttribute = (key, force) => { div.toggleAttribute(key, force); return div };
		return div;
	},
	h6 = (txt, i) => {
		let el = newDiv('h6').Html(txt);
		// el.innerHTML = txt;
		if (typeof i == 'string') i = infoPopup(i);
		if (i) el.append(i);
		return el;
	},
	infoPopup = txt =>
	newDiv('i', 'info').Append(newDiv('div').Append(newDiv('div').Html(txt)))
	// let i = newDiv('i', 'info'),
	// 	popupPar = newDiv('div'),
	// 	popup = newDiv('div');
	// popup.innerHTML = txt;
	// i.append(popupPar);
	// popupPar.append(popup);
	// return i;
	,
	newToggle = (on, ...classList) => {
		let toggle = newDiv('label', ...classList),
			checkbox = newDiv('input');
		checkbox.type = 'checkbox';
		toggle.append(checkbox, newDiv());
		if (on) checkbox.setAttribute('checked', '');
		return toggle;
	},
	newRange = (min, max, value, ...classList) =>
	newDiv('input', ...classList).Type('range').Attribute('min', min).Attribute('max', max).Value(value),

	Select = {
		Channel: ({ cls = 'channelSelect', voice = false, set, hint, guild }) => {
			let channelSelect = newDiv('select', cls),
				selected = false;
			channelSelect.append(...[...guild.channels.cache.values()].filter(c => voice ? c.isVoice() : c.isText()).sort((a, b) => a.rawPosition - b.rawPosition)
				.map(c => {
					let option = newDiv('option');
					option.value = c.id;
					option.innerHTML = c.name;

					if (set) {
						if (c.id == set) option.setAttribute('selected', '')
					} else if (!selected &&
						isArray(hint) ? hint.some(hint => c.name.toLowerCase().includes(hint)) : c.name.toLowerCase().includes(hint)) {
						option.setAttribute('selected', '');
						selected = true
					}
					return option
				}));
			return channelSelect;
		},
		Role: ({ set, hint, guild, cls = 'roleSelect' }) => {
			let channelSelect = newDiv('select', cls),
				selected = false;
			channelSelect.append(...[...guild.roles.cache.values()].sort((a, b) => b.position - a.position)
				.map(r => {
					let option = newDiv('option');
					option.value = r.id;
					option.innerHTML = r.name;

					if (r.color) option.style.color = r.hexColor;
					if (set) {
						if (r.id == set) option.setAttribute('selected', '');
					} else if (!selected &&
						isArray(hint) ? hint.some(hint => r.name.toLowerCase().includes(hint)) : r.name.toLowerCase().includes(hint)) {
						option.setAttribute('selected', '');
						selected = true
					}
					return option
				}));
			return channelSelect;
		}
	},
	Multiple = {
		String: ({ cls, set, csv = false }) =>
			newDiv('div', 'multiple', 'string', cls)
			.Append(set && newDiv().Attribute('list', set))
			.Append(newDiv('input'))
			.ToggleAttribute('csv', csv),
		Channel: ({ cls, set, guild }) =>
			newDiv('div', 'multiple', 'channel', cls)
			.Append(set && newDiv().Attribute('list', set))
			.Append(Select.Channel({ guild })),
		Role: ({ cls, set, guild }) =>
			newDiv('div', 'multiple', 'role', cls)
			.Append(set && newDiv().Attribute('list', set))
			.Append(Select.Role({ guild }))
	};
const RandomUser = () => 'User#' + Math.floor(Math.random() * 8999 + 1000),
	// Sass = file => new Promise((resolver, reject) => sass.render({
	// 	file: `client/${file}.scss`
	// }, (err, res) => {
	// 	if (err) reject(err, console.log('ERR - ', err))
	// 	else resolver(res.css.toString());
	// })),
	FieldtoPerms = (bitfield = 0n) => {
		try {
			let res = Object.fromEntries(Object.entries(Discord.Permissions.FLAGS).reverse()
				.filter(p => (p[1] > bitfield) ? false : typeof (bitfield -= p[1])).filter(x => x));
			return res;
		} catch (e) {
			console.error(e);
			return null;
		}

	};
let prefetchs = [...[
		...['logo', 'commands', 'voice', 'moderation', 'suggestions', 'support', 'sort', 'reply', 'arrow', 'discord'].map(x => `src/icon/${x}`),
		'src/client.js', 'src/client.css', 'src/error.css', 'src/background' //, 'socket.io/socket.io.js',    // ,...["1cbd08c76f8af6dddce02c5138971129","6debd47ed13483642cf09e832ed0bc1b","dd4dbc0016779df1378e7812eabaa04d","322c936a8c8be1b803cd94861bdfa868"].map(x=>`https://discordapp.com/assets/${x}.png`)
		, ...EmojiList.split(';').map(s => s.split(',')).slice(0, 40).map(([n, id]) => `https://twemoji.maxcdn.com/v/latest/72x72/${id}.png`)
	].map(url => `<${url}>; rel="prefetch"`),
	'<oauth>; rel="prerender"', '<https://discord.com>; rel="preconnect"',
	'</>; rel="canonical"', '<https://top.gg/bot/813803575264018433/vote>; rel="prerender"',

].join();
// console.log(prefetchs, prefetchs.length);
// prefetchs = 'krgyh';
const ParseModLogs = (logs, guild, targetMember, targetStaff) => Object.entries(logs)
	//targetMember = Member | User | id
	.map(([staffId, staffLogs]) =>
		staffLogs.filter(log => (!targetMember || (targetMember.id || targetMember) == log.m) && (!targetStaff || targetStaff == staffId)).map(log => ({
			...log,
			staffId,
			staff: () => /*guild.members.resolve(staffId) ||*/ guild.members.fetch(staffId).catch(e => null),
			member: () => /*guild.members.resolve(log.m) ||*/ guild.members.fetch(log.m).catch(e => null),
			d: decodeT(log.d),
			unt: log.unt && decodeT(log.unt)
		}))).flat().sort((a, b) => b.d - a.d),

	baseDoc = options => new Promise(async resolver => {
		let document = Cache.get(JSON.stringify(options));

		if (document)
			return resolver(new JSDOM(document).window.document);
		let obj = {
			css: false,
			js: false,
			html: false,
			htmlString: false,
			title: PageTitle,
			socket: false,
			// jsbefore: '',
			// jsafter: '',
			// adsense: false,
			// hotjar: false,
			// gtag: true,
			...options
		}

		if (obj.html) document = new JSDOM((await fs.readFile(`client/${obj.html}.html`, 'utf8')).replace(/(\n|\s\s+)/g, ' ')).window.document
		else if (obj.htmlString) document = new JSDOM(obj.htmlString).window.document
		else document = new JSDOM().window.document;

		document.documentElement.setAttribute('lang', 'en');
		if (obj.css) document.head.innerHTML = `<link href="/src/${obj.css}.css" type="text/css" rel="stylesheet">`;
		if (obj.socket) document.head.innerHTML += '<script src="/socket.io/socket.io.min.js"></script>';
		if (obj.js) document.head.innerHTML += `<script src="/src/${obj.js}.js"></script>`;
		document.head.innerHTML += `<title>${obj.title}</title>`;
		document.head.innerHTML += '<meta name="viewport" content="width=device-width, initial-scale=1"><meta charset="UTF-8">';
		// if (obj.hotjar) document.head.innerHTML += '<script defer>{let t,h,e=window,j=document,s="https://static.hotjar.com/c/hotjar-",c=".js?sv=";e.hj=e.hj||(()=>(e.hj.q=e.hj.q||[]).push(arguments)),e._hjSettings={hjid:2308481,hjsv:6},t=j.querySelector("head"),(h=j.createElement("script")).async=1,h.src=s+e._hjSettings.hjid+c+e._hjSettings.hjsv,t.appendChild(h)}</script>';
		// if (obj.adsense) document.head.innerHTML += '<script data-ad-client="ca-pub-2422033382456580" async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"></script>';
		// if (obj.gtag) document.head.innerHTML += '<script async src="https://www.googletagmanager.com/gtag/js?id=G-BT0FM35V66"></script>';

		// if (js) document.head.innerHTML += `<script src="data:text/js;base64,${js}" defer></script>`;
		// if (css) document.head.innerHTML += `<link rel="stylesheet" href="data:text/css;base64,${css}">`;

		Cache.set(JSON.stringify(options), document.documentElement.outerHTML);

		resolver(document);
	}),
	guildDoc = (DiscordUser, guildsObj = [], extras = {}, transcript = false) => new Promise(async resolver => {
		if (DiscordUser && !DiscordUser.createdTimestamp) DiscordUser = await client.users.fetch(DiscordUser.id).catch(e => null);

		let document = await baseDoc({
			css: 'client',
			js: 'client',
			// hotjar: true,
			socket: !transcript,
			...extras
		});
		if (!transcript) {
			var DIDscript = newDiv('script');
			DIDscript.innerHTML = `let DID="${DiscordUser?.id}"`;

			document.head.prepend(DIDscript);
			document.head.innerHTML += '<base target="_blank">';
		}
		let header = newDiv('header'),
			navbar = newDiv('navbar'),
			user = newDiv('div', 'user'),
			avatar = newDiv('img'),
			userPopup = newDiv('userpopup'),
			support = newDiv('a'),
			vote = newDiv('a'),
			logout = newDiv('a', 'logout');
		avatar.src = DiscordUser?.displayAvatarURL();
		logout.innerHTML = 'Logout';
		support.innerHTML = 'Discord';
		vote.innerHTML = 'Vote';
		support.href = 'https://discord.gg/HeApb3UFHD';
		vote.href = 'https://top.gg/bot/813803575264018433/vote';
		header.setAttribute('noSpin', '');

		user.append(avatar, userPopup);
		userPopup.append(support, vote, logout);
		document.body.append(header);
		// if (!req.cookies.vtd) user.setAttribute('alertVote', '');

		// let listGuilds = guildsObj.filter(g => client.guilds.cache.has(g.id) && (new Discord.BitField(BigInt(g.permissions))).has(8n)),

		// try {
		var listGuilds = guildsObj //.filter(g => client.guilds.cache.has(g.id) && isAdmin(g.permissions))
		// console.log(5.21);
		// } catch (e) {
		// 	var listGuilds = guildsObj.filter(g => client.guilds.cache.has(g.id));
		// 	console.log(e, 5.31)
		// }

		let //listGuilds = guildsObj.filter(g => client.guilds.cache.has(g.id)),
			guildDropDown = newDiv('select', 'guildDropDown');
		header.innerHTML += '<a href="/" target="_self" class="logo"><div> <img src="/src/icon/logo" alt="KonkenBoten\'s Logo"></div></div></a>'
		header.append(navbar, guildDropDown, user);

		if (!DiscordUser) user.remove();
		if (!guildsObj.length) guildDropDown.remove();

		listGuilds.forEach(guild => {
			let guildOption = newDiv('option');
			guildOption.innerHTML = guild.name;
			guildOption.value = guild.id;
			guildDropDown.append(guildOption);
		});
		let addOption = newDiv('option');
		addOption.innerHTML = 'Add bot to server';
		addOption.value = 'AddNew';
		guildDropDown.append(addOption);
		resolver(document);
	})
// ,userGuildList = async userId =>
// 	Promise.all(client.guilds.cache.map(async g =>
// 		g.members.cache.has(userId) || g.members.fetch(userId).catch(x => false))).then(x => x.guild);
// const mainPage = async (req, res, userObj, guildsObj) => {
// 		if (req.cookies.LstGld) return res.redirect(302, '/Guild/' + req.cookies.LstGld)
// 		// var guild = guildsObj.filter(x => x).find(g => g.verified || (client.guilds.cache.has(g.id) && isAdmin(g.permissions)))
// 		var guild = guildsObj.find(g => g.id)
// 		// var guild = guild || guildsObj.find(g => client.guilds.cache.has(g.id));
// 		if (guild?.id) return res.redirect(302, '/Guild/' + guild.id)
// 		res.redirect(302, URLs.botRedirect);
// 	};
const basePage = options => new Promise(async resolver => {
		let page = newDiv('page');
		if (options.id) page.id = options.id;
		if (options.title) {
			let title = newDiv('h1');
			title.innerHTML = options.title;
			page.append(title);
		}
		resolver(page);
	}),
	capital = s => s[0].toUpperCase() + s.slice(1).toLowerCase(),
	CssColors = {
		gray: '747f8d',
		green: '43b581',
		red: 'f04747',
		yellow: 'faa61a'
	},
	Invites = {},
	AuditLog = async (guild, type, targetID, log = true) =>
		// (await guild.fetchAuditLogs({ type })).entries
		// .find(a => a.target?.id == targetID && a.createdTimestamp + 10e3 > Date.now());
		guild.fetchAuditLogs({ type }).then(a => a.entries
			.find(a => a.target?.id == targetID && a.createdTimestamp + 10e3 > Date.now())).catch(e => false);
// https://discord.js.org/#/docs/main/stable/typedef/AuditLogAction

const capitalType = s => capital(s.split('_').pop()),
	LogRules = {
		channelCreate: {
			cleanName: 'Channel Created',
			decription: 'Emits whenever a new channel is created',
			//audit: 10,
			color: CssColors.green,
			function: async ([c], audit) => {
				if (audit) audit = AuditLog(c.guild, 10, c.id);
				return {
					author: `${capitalType(c.type)} channel created: ${c.name}`,
					fields: [
						['Channel ID:', c.id],
					],
					audit
				}
			}
		},
		channelDelete: {
			cleanName: 'Channel Deleted',
			decription: 'Emits whenever a channel is deleted',
			//audit: 12,
			color: CssColors.red,
			function: async ([c], audit) => {
				if (audit) audit = AuditLog(c.guild, 12, c.id);
				return {
					author: `${capitalType(c.type)} channel deleted: ${c.name}`,
					fields: [
						['Channel ID:', c.id],
					],
					audit
				}
			}
		},
		channelUpdate: {
			cleanName: 'Channel Updated',
			decription: 'Emits whenever a channel is updated\nName, permissions, userlimit',
			//audit: 11,
			color: CssColors.yellow,
			function: async ([oldC, newC], audit) => {
				if (audit) audit = AuditLog(newC.guild, 11, newC.id);

				if (oldC.name != newC.name) return {
					author: `${capitalType(newC.type)} channel renamed`,
					fields: [
						['Old name:', oldC.name],
						['New name:', newC.name],
						['Channel:', `<#${newC.id}>`, true],
						['Channel ID:', newC.id, true],
					],
					audit
				};
				if (oldC.parentId != newC.parentId) return {
					author: `${capitalType(newC.type)} channel moved to diffrent category`,
					fields: [
						['Old parent:', oldC.parent],
						['New parent:', newC.parent],
						['Channel:', `<#${newC.id}>`, true],
						['Channel ID:', newC.id, true],
					],
					audit
				};
				if (oldC.rawPosition != newC.rawPosition) return {
					author: `${capitalType(newC.type)} channel moved`,
					fields: [
						['Old position:', oldC.rawPosition + 1],
						['New position:', newC.rawPosition + 1, true],
						['Old position in category:', newC.position + (newC.rawPosition - oldC.rawPosition) + 1, true],
						['New position in category:', newC.position + 1],
						['Channel:', `<#${newC.id}>`, true],
						['Channel ID:', newC.id, true],
					],
					audit
				};
				if (oldC.ntfw != newC.ntfw) return {
					author: `${capitalType(newC.type)} channel NTFW toggled`,
					fields: [
						['NTFW:', newC.ntfw ? 'Yes' : 'No'],
						['Channel:', `<#${newC.id}>`, true],
						['Channel ID:', newC.id, true],
					],
					audit
				};
				if (oldC.rateLimitPerUser != newC.rateLimitPerUser) {
					if (!oldC.rateLimitPerUser) return {
						author: `${capitalType(newC.type)} channel slowmode enabled`,
						fields: [
							['Slowmode:', newC.rateLimitPerUser],
							['Channel:', `<#${newC.id}>`, true],
							['Channel ID:', newC.id, true],
						],
						audit
					};
					if (!newC.rateLimitPerUser) return {
						author: `${capitalType(newC.type)} channel slowmode disabled`,
						fields: [
							['Slowmode:', newC.rateLimitPerUser],
							['Channel:', `<#${newC.id}>`, true],
							['Channel ID:', newC.id, true],
						],
						audit
					};
					return {
						author: `${capitalType(newC.type)} channel slowmode updated`,
						fields: [
							['Old slowmode:', oldC.rateLimitPerUser],
							['New slowmode:', newC.rateLimitPerUser],
							['Channel:', `<#${newC.id}>`, true],
							['Channel ID:', newC.id, true],
						],
						audit
					}
				};


				let oldPerms = oldC.permissionOverwrites.resolve(oldC.guild.roles.everyone),
					newPerms = newC.permissionOverwrites.resolve(oldC.guild.roles.everyone);
				if (oldPerms?.allow.bitfield != newPerms?.allow.bitfield || oldPerms?.deny.bitfield != newPerms?.deny.bitfield) {
					let allow = oldPerms.allow.bitfield - newPerms.allow.bitfield,
						deny = oldPerms.deny.bitfield - newPerms.deny.bitfield,
						allowTxt = (allow < 0 ? 'No longer ' : '') + 'Allowed:',
						denyTxt = (deny < 0 ? 'No longer ' : '') + 'Denied:';

					[allow, deny] = [allow, deny].map(bit => bit && new Discord.BitField(bit).toArray().map(capital).join(',\n'));

					if (allow || deny) return {
						author: `${capitalType(newC.type)} channel's permissions changed`,
						fields: [
							[allowTxt, oldC.parent],
							[denyTxt, newC.parent],
							['Channel:', `<#${newC.id}>`, true],
							['Channel ID:', newC.id, true],
						],
						audit
					}
				};

				// console.log(oldC, newC, 3468);
				return {
					author: `${capitalType(newC.type)} channel updated`,
					fields: [
						['Channel:', `<#${newC.id}>`, true],
						['Channel ID:', newC.id, true],
					],
					audit
				}
			}
		},

		emojiCreate: {
			cleanName: 'Emoji Created',
			decription: 'Emits whenever a new emoji is created',
			//audit: 60,
			color: CssColors.green,
			function: async ([emoji], audit) => {
				if (audit) audit = AuditLog(emoji.guild, 60, emoji.id);
				return {
					author: `Emoji created: ${emoji}`,
					fields: [
						['Name:', emoji.name],
						['Created by:', emoji.author, true], //|| '*Unknown*'
					],
					audit
				}
			}
		},
		emojiDelete: {
			cleanName: 'Emoji Deleted',
			decription: 'Emits whenever a emoji is deleted',
			//audit: 62,
			color: CssColors.red,
			function: async ([emoji], audit) => {
				if (audit) audit = AuditLog(emoji.guild, 62, emoji.id);
				return {
					author: `Emoji deleted: ${emoji}`,
					fields: [
						['Name:', emoji.name]
					]
				}
			}
		},
		emojiUpdate: {
			cleanName: 'Emoji Updated',
			decription: 'Emits whenever a emoji is updated',
			//audit: 61,
			color: CssColors.yellow,
			function: async ([oldE, newE], audit) => {
				if (audit) audit = AuditLog(newE.guild, 61, newE.id);
				return oldE.name != newE.name ? {
					author: `Emoji renamed: ${oldE}`,
					fields: [
						['Old name:', oldE.name],
						['New name:', newE.name, true],
					],
					audit
				} : {
					author: `Emoji updated: ${oldE}`,
					fields: [
						['Old emoji:', `${oldE.name}: ${oldE}`],
						['New emoji:', `${newE.name}: ${newE}`, true],
					],
					audit
				}
			}
		},

		guildBanAdd: {
			cleanName: 'Member Banned',
			decription: 'Emits whenever a member is banned',
			//audit: 22,
			color: CssColors.red,
			function: async ([ban], audit) => {
				const [g, u] = [ban.guild, ban.user];
				if (audit) audit = AuditLog(g, 22, u.id);
				return {
					author: `User Banned: ${u.username}`,
					fields: [
						['Tag:', u.tag],
						['ID:', u.id, true],
					],
					audit
				}
			}
		},
		guildBanRemove: {
			cleanName: 'Member Unbanned',
			decription: 'Emits whenever a member is unbanned',
			//audit: 23,
			color: CssColors.green,
			function: async ([ban], audit) => {
				const [g, u] = [ban.guild, ban.user];
				if (audit) audit = AuditLog(g, 23, u.id);
				return {
					author: `User unbanned: ${u.username}`,
					fields: [
						['Tag:', u.tag],
						['ID:', u.id, true],
					],
					audit
				}
			}
		},

		guildMemberAdd: {
			cleanName: 'Member Joined',
			decription: 'Emits whenever a member joins the server',
			color: CssColors.green,
			function: async ([m], audit) => {
				let invites = [...(await m.guild.invites.fetch()).values()],
					invite = invites.find(i => i.uses > Invites[i.code]?.uses);
				invites.forEach(i => Invites[i.code] = {
					...Invites[i.code],
					inviter: i.inviter?.id || Invites[i.code].inviter,
					uses: i.uses
				});
				if (audit) {
					if (invite) audit = [
						['Invite url:', invite],
						['Inviter:', invite.inviter] //|| '*Unknown*'
					]
					else if (m.guild.vanityURLCode) {
						let data = await m.guild.fetchVanityData().catch(e => 0);
						if (data && data.uses > Invites[data.code]?.uses)
							audit = [
								['Invite url:', `https://discord.gg/${data.code}`]
							] // ,['Inviter:', '*Unknown*']
						else audit = [];
					} else audit = [];
				} else audit = [];
				return {
					author: `User joined: ${m.user.username}`,
					fields: [
						['Member:', m],
						['Tag:', m.user.tag],
						['ID:', m.id],
						...audit
					]
				}
			}
		},
		guildMemberRemove: {
			cleanName: 'Member Left',
			decription: 'Emits whenever a member leaves the server',
			color: CssColors.red,
			function: async ([m], audit) => {
				return ({
					author: `User left: ${m.user.username}`,
					fields: [
						['Tag:', m.user.tag],
						['ID:', m.user.id]
					]
				})
			}
		},
		guildMemberUpdate: {
			cleanName: 'Member Updated',
			decription: 'Emits whenever a member is updated\nServer specific features; Nickame, roles',
			// function: (oldM, newM) => oldM.user.tag != newM.user.tag ? {author: `Member renamed: ${newM.user.tag}`,fields: [['Old name:', oldM.user.tag],['New name:', newM.user.tag, true],['Member:', newM]]} : {author: `Member updated: ${newM.user.tag}`,fields: [['Member:', newM]]}
			color: CssColors.yellow,
			function: async ([oldM, newM], audit) => {
				let [roles, updates] = await Promise.all([AuditLog(newM.guild, 25, newM.id), AuditLog(newM.guild, 24, newM.id)]);
				if (audit) audit = roles || updates;
				if (oldM.nickname != newM.nickname) return {
					author: `Member's nickname updated: ${newM.user.tag}`,
					fields: [
						['Old name:', oldM.nickname],
						['New name:', newM.nickname, true],
						['Member:', newM],
					],
					audit
				}
				else {
					if (roles && roles.createdTimestamp > Date.now() - 3e4) { //30s
						roles = roles.changes.map(e => [
							`${capital(e.key.slice(1))}ed`.replace('ee', 'e'),
							e.new.map(x => newM.guild.roles.resolve(x.id)).join(),
							true
						]);
						return {
							author: `Member's roles updated: ${newM.user.tag}`,
							fields: [
								...(roles || []),
								['Member:', newM],
							],
							audit
						}
					}
					// else {updates = updates.changes.filter(u => ![].includes(u.key));	}
					// let oldRoles = oldM.roles.cache.array().map(r => r.id),newRoles = newM.roles.cache.array().map(r => r.id),diff = oldRoles.diff(newRoles);
					// else return {author: `Member updated: ${newM.user.tag}`,fields: [['Member:', newM]]}
				}
			}
		},

		userUpdate: {
			cleanName: 'User Updated',
			decription: 'Emits whenever a user is updated\nGlobal features; Username, avatar',
			color: CssColors.yellow,
			function: async ([oldU, newU], audit) => {
				if (oldU.tag != newU.tag) return {
					author: `Member renamed: ${newU.tag}`,
					fields: [
						['Old name:', oldU.tag],
						['New name:', newU.tag, true],
						['Member:', newU]
					]
				}
				else if (oldU.avatar != newU.avatar) return {
					author: `Member's avatar updated: ${newU.tag}`,
					fields: [
						['Avatars:', `[From](${oldU.displayAvatarURL()})\n[To](${newU.displayAvatarURL()})`],
						['Member:', newU]
					],
					thumbnail: { url: newU.displayAvatarURL() }
				}
			}
		},
		// guildUpdate: {},

		inviteCreate: {
			cleanName: 'Invite Created',
			decription: 'Emits whenever a invite code is created',
			color: CssColors.green,
			function: ([i], audit) => {
				Invites[i.code] = {
					guild: i.guild.id,
					inviter: i.inviter?.id,
					uses: i.uses
				};
				return {
					author: `Invite created: ${i.code}`,
					fields: [
						['Channel:', i.channel],
						['Creator:', i.inviter],
						['Expires:', i.expiresAt?.toLocaleString() || '*Never*', true],
						['Max uses:', i.maxUses || '*Infinity*', true],
						['Url:', i, true]
					]
				}
			}
		},
		inviteDelete: {
			cleanName: 'Invite Deleted',
			decription: 'Emits whenever a invite code is deleted',
			color: CssColors.red,
			function: async ([i], audit) => {
				if (audit) audit = AuditLog(i.guild, 42);
				return {
					author: `Invite deleted: ${i.code}`,
					fields: [
						['Channel:', i.channel],
						['Creator:', i.inviter],
						['Url:', i, true],
					],
					audit
				}
			}
		},

		messageCreate: {
			cleanName: 'Message Sent',
			decription: 'Emits whenever a message is sent',
			color: CssColors.green,
			function: ([m], audit) => {
				let content = m.content,
					attachments = [];
				if (!content)
					if (m.embeds[0]) {
						let e = m.embeds[0];
						content = e.title ? `**${e.title}**` : '';
						content += e.description ? `\n**${e.description}**` : '';
						content += e.description ? `\n${e.fields.map(f=>`**${f.name}**\n${f.value}`)}` : '';
						content += e.footer ? `\n\`${e.footer}\`` : '';
						content = content.replace(/\n\n+/g, '\n').trim();
					}
				if (m.attachments.first())
					attachments = [
						['Attachments:', [...m.attachments.values()].map(a => `[${a.name}](${a.url})`).join('\n')]
					];
				return m.author.id != ClientID ? {
					author: `Message sent`,
					authorURL: m.url,
					fields: [
						['Channel:', m.channel],
						['Author:', m.author],
						['Content:', content],
						...attachments
					]
				} : null
			}
		},
		messageDelete: {
			cleanName: 'Message Deleted',
			decription: 'Emits whenever a message is deleted',
			color: CssColors.red,
			function: async ([m], audit) => {
				if (audit) audit = AuditLog(m.guild, 72, m.author.id);
				let content = m.content,
					attachments = [];
				if (!content)
					if (m.embeds[0]) {
						let e = m.embeds[0];
						content = e.title ? `**${e.title}**` : '';
						content += e.description ? `\n**${e.description}**` : '';
						content += e.description ? `\n${e.fields.map(f=>`**${f.name}**\n${f.value}`)}` : '';
						content += e.footer ? `\n\`${e.footer}\`` : '';
						content = content.replace(/\n\n+/g, '\n').trim();
					}
				if (m.attachments.first())
					attachments = [
						['Attachments:', [...m.attachments.values()].map(a => `[${a.name}](${a.url})`).join('\n')]
					];
				return m.author.id != ClientID ? {
					author: `Message deleted`, // authorURL: m.url,
					fields: [
						['Channel:', m.channel],
						['Author:', m.author],
						['Content:', content],
						...attachments,
					],
					audit
				} : null
			}
		},
		messageDeleteBulk: {
			cleanName: 'Messages Bulk Deleted',
			decription: 'Emits whenever messages is deleted in bulk',
			color: CssColors.red,
			function: async ([m], audit) => {
				if (audit) audit = AuditLog(m.first().guild, 73);
				return {
					author: `Messages bulk deleted`,
					fields: [
						['Amount:', m.size],
						['Channel:', m.first().channel],
					],
					audit
				}
			}
		},
		messageClear: {
			cleanName: 'Messages Cleared',
			decription: 'Emits whenever messages is deleted using the $clear command',
			color: CssColors.red,
			function: async ([amt, c, m] /*,audit*/ ) => {
				return {
					author: `Messages cleared`,
					fields: [
						['Amount:', amt],
						['Channel:', c],
						['Executor:', m]
					]
				}
			}
		},
		messageUpdate: {
			cleanName: 'Message Updated',
			decription: 'Emits whenever a message is edited',
			color: CssColors.yellow,
			function: ([oldM, newM], audit) => {
				// console.log('Message Updated', newM.content, oldM.content, newM.author.id != ClientID, oldM.content == newM.content);
				if (newM.author.id == ClientID || oldM.content == newM.content) return null;
				return {
					author: `Message Updated`,
					authorURL: newM.url,
					fields: [
						['Channel:', newM.channel],
						['Author:', newM.author, true],
						['Old content:', oldM],
						['New content:', newM]
					]
				}
			}
		},

		roleCreate: {
			cleanName: 'Role Created',
			decription: 'Emits whenever a new role is created',
			color: CssColors.green,
			function: async ([r], audit) => {
				if (audit) audit = AuditLog(r.guild, 30, r.id);
				return {
					author: `Role created`,
					fields: [
						['Name:', r.name, true],
						['Role:', r],
					],
					audit
				}
			}
		},
		roleDelete: {
			cleanName: 'Role Deleted',
			decription: 'Emits whenever a role is deleted',
			color: CssColors.red,
			function: async ([r], audit) => {
				if (audit) audit = AuditLog(r.guild, 32, r.id);
				return {
					author: `Role deleted`,
					fields: [
						['Name:', r.name],
					],
					audit
				}
			}
		},
		roleUpdate: {
			cleanName: 'Role Updated',
			decription: 'Emits whenever a role is updated\nName, permissions, color',
			color: CssColors.yellow,
			function: async ([oldR, newR], audit) => {
				let log = await AuditLog(newR.guild, 31, newR.id);
				if (log) {
					var { changes } = log;
					if (audit) audit = log;
				}
				if (oldR.name != newR.name) return {
					author: 'Role renamed',
					fields: [
						['Old name:', oldR.name, true],
						['New name:', newR.name],
					],
					audit
				}
				else if (changes) {

					let updates = [],
						removed, added,
						color = changes.find(e => 'color' == e.key),
						perms = changes.find(e => 'permissions' == e.key);

					if (color) updates.push(
						['Old color:', `#${color.old.toString(16)}`],
						['New color:', `#${color.new.toString(16)}`]
					);
					// console.log({ perms });
					// if (perms)[removed, added] = [FieldtoPerms(perms.old), FieldtoPerms(perms.new)].map(x => Object.keys(x)); // fixme
					if (removed) removed = removed.filter(x => !added.includes(x));
					if (added) added = added.filter(x => !removed.includes(x));

					if (added && added[0]) updates.push(
						['Permissons added:', added.map(p => capital(p.replace(/_/g, ' '))).join('\n')]
					);
					if (removed && removed[0]) updates.push(
						['Permissons removed:', removed.map(p => capital(p.replace(/_/g, ' '))).join('\n')]
					);

					return {
						author: 'Role updated',
						fields: [
							...updates,
						],
						audit
					}
				}
				// : {	author: 'Role updated',	fields: [		['Old role:', `${oldR.name}: ${oldR}`, true],		['New role:', `${newR.name}: ${newR}`],		...(audit[0]?audit : [])]}
			}
		},

		ticketStart: {
			cleanName: 'Support Started',
			decription: 'Emits whenever a new Support Channel is opened',
			color: CssColors.green,
			function: ([u, c], audit) => ({
				author: 'Support channel opened',
				fields: [
					['Member:', u, true],
					['Channel:', c]
				]
			})
		},
		ticketEnd: {
			cleanName: 'Support Closed',
			decription: 'Emits whenever a Support Channel is closed',
			color: CssColors.red,
			function: ([c, closedBy, saved, url], audit) => {
				return {
					author: 'Support channel closed',
					fields: [
						['Channel:', c.name, true],
						['Closed by:', closedBy],
						['Saved:', saved ? 'Yes' : 'No'],
						['Transcript:', url && `[${c.name}](${url})`]
					]
				};
			}
		},
		ticketClaim: {
			cleanName: 'Support Claimed',
			decription: 'Emits whenever a moderator claims a Support Channel',
			color: CssColors.green,
			function: ([channel, user] /*,audit*/ ) => ({
				author: 'Support channel claimed',
				fields: [
					['Executor:', user, true],
					['Channel:', channel]
				]
			})
		},
		ticketClaimAdd: {
			cleanName: 'Support Claim Invite',
			decription: 'Emits whenever a moderator adds another moderator to a claimed Support Channel',
			color: CssColors.green,
			function: ([channel, user, ids] /*,audit*/ ) => ({
				author: 'Support channel claimed',
				fields: [
					['Executor:', user, true],
					['Added Members', ids.map(id => `<@${id}>`).join(',\n'), true],
					['Channel:', channel]
				]
			})
		},
		ticketUnclaim: {
			cleanName: 'Support Unlaimed',
			decription: 'Emits whenever a moderator unclaims a Support Channel',
			color: CssColors.red,
			function: ([channel, user] /*,audit*/ ) => ({
				author: 'Support channel unclaimed',
				fields: [
					['Executor:', user, true],
					['Channel:', channel]
				]
			})
		},

		/*
		 ticketAddUser: {
			cleanName: 'User Added',decription: 'Emits whenever a new user is added to an existing Support Channel',color: CssColors.gray,
			function: ([added, addedBy, channel], audit) => ({
				author: 'User added to Support Channel',
				fields: [['Member added', added, true],['Added by', addedBy],['Channel', channel]]})},
		ticketRemoveUser: {
			cleanName: 'User Removed',decription: 'Emits whenever a user is removed from an existing Support Channel',color: CssColors.red,
			function: ([added, addedBy, channel], audit) => ({
				author: 'User removed from Support Channel',
				fields: [['Member removed', added, true],['Removed by', addedBy],['Channel', channel]]})},
		*/

		voiceConnect: {
			cleanName: 'Member Connect',
			decription: 'Emits whenever a member connects to a Voice Channel',
			color: CssColors.green,
			function: async ([newState] /*,audit*/ ) => {
				return {
					author: `Member joined a voice channel`,
					fields: [
						['Channel:', newState.channel],
						['Member:', newState.member]
					]
				}
			}
		},
		voiceDisconnect: {
			cleanName: 'Member Disconnect',
			decription: 'Emits whenever a member disconnects from a Voice Channel',
			color: CssColors.red,
			function: async ([oldState], audit) => {
				if (audit) audit = AuditLog(oldState.guild, 27, oldState.member.id);
				return {
					author: `Member left a voice channel`,
					fields: [
						['Channel:', oldState.channel],
						['Member:', oldState.member],
					],
					audit
				}
			}
		},
		voiceMoved: {
			cleanName: 'Member Moved',
			decription: 'Emits whenever a member is moved between Voice Channels',
			color: CssColors.yellow,
			function: async ([oldState, newState], audit) => {
				let log = await AuditLog(newState.guild, 26, newState.member.id);
				// if (!log || (log && log.executor.id != newState.member.id)) {
				if (audit && log && log.executor.id != newState.member.id) audit = log
				return {
					author: `Member moved`,
					fields: [
						['Member:', newState.member],
						['From:', oldState.channel, true],
						['To:', newState.channel],
					],
					audit
				}
				// }
			}
		},
		voiceMute: {
			cleanName: 'Server Muted',
			decription: 'Emits whenever a member is Server (un)Muted',
			color: CssColors.yellow,
			function: async ([newState], audit) => {
				if (audit) audit = AuditLog(newState.guild, 24, newState.member.id);

				return {
					author: `Member server ${newState.serverMute?'':'un'}muted`,
					fields: [
						['Member:', newState.member],
						['Channel:', newState.channel]
						// ,['Muted:', newState.serverMute ? 'Yes' : 'No']
					],
					color: newState.serverMute ? CssColors.red : CssColors.green,
					audit
				}
			}
		},
		voiceDeaf: {
			cleanName: 'Server Deafened',
			decription: 'Emits whenever a member is Server (un)Deafened',
			color: CssColors.yellow,
			function: async ([newState], audit) => {
				if (audit) audit = AuditLog(newState.guild, 24, newState.member.id);

				return {
					author: `Member server ${newState.serverDeaf?'':'un'}deafened`,
					fields: [
						['Member:', newState.member],
						['Channel:', newState.channel]
						// ,['Deafened:', newState.serverDeaf ? 'Yes' : 'No']
					],
					color: newState.serverDeaf ? CssColors.red : CssColors.green,
					audit
				}
			}
		},

		messageReactionAdd: {
			cleanName: 'Reaction added',
			decription: 'Emits whenever a member reacts to a message',
			color: CssColors.green,
			function: async ([r, u], audit) => {
				let content = r.message.content
				if (content.length > 21) content = content.substr(0, 20) + '…'
				return {
					author: `Reaction added`,
					fields: [
						['Member:', u],
						['Channel:', r.message.channel],
						['Message:', r.message.id],
						['Emoji:', r.emoji],
						['Content:', content]
					]
				}
			}
		},
		messageReactionRemove: {
			cleanName: 'Reaction removed',
			decription: 'Emits whenever a member removes a reaction from a message',
			color: CssColors.red,
			function: async ([r, u], audit) => {
				let content = r.message.content
				if (content.length > 21) content = content.substr(0, 20) + '…'
				return {
					author: `Reaction removed`,
					fields: [
						['Member:', u],
						['Channel:', r.message.channel],
						['Message:', r.message.id],
						['Emoji:', r.emoji],
						['Content:', content]
					]
				}
			}
		},
		messageReactionRemoveAll: {
			cleanName: 'All reactions removed',
			decription: 'Emits whenever all reactions is removed from a message',
			color: CssColors.red,
			function: async ([m, r], audit) => {
				let content = m.content;
				if (content.length > 21) content = content.substr(0, 20) + '…';
				let emojis = r.map(x => x.emoji).join();
				return {
					author: `All reaction removed`,
					fields: [
						['Channel:', m.channel],
						['Message:', m.id],
						['Emojis:', emojis],
						['Message content:', content]
					]
				}
			}
		},

		stickerCreate: {
			cleanName: 'Sticker Created',
			decription: 'Emits whenever a new sticker is created',
			color: CssColors.green,
			function: async ([sticker], audit) => {
				if (audit) audit = AuditLog(sticker.guild, 90, sticker.id);
				return {
					author: `Sticker created`,
					fields: [
						['Name:', sticker.name],
					],
					audit
				}
			}
		},
		stickerDelete: {
			cleanName: 'Sticker Deleted',
			decription: 'Emits whenever a new sticker is deleted',
			color: CssColors.red,
			function: async ([sticker], audit) => {
				if (audit) audit = AuditLog(sticker.guild, 92, sticker.id);
				return {
					author: `Sticker deleted`,
					fields: [
						['Name:', sticker.name],
					],
					audit
				}
			}
		},
		stickerUpdate: {
			cleanName: 'Sticker Updated',
			decription: 'Emits whenever a new sticker is updated',
			color: CssColors.red,
			function: async ([oldE, newS], audit) => {
				if (audit) audit = AuditLog(newS.guild, 91, newS.id);
				return oldE.name != newS.name ? {
					author: `Sticker renamed`,
					fields: [
						['Old name:', oldE.name],
						['New name:', newS.name, true],
					],
					audit
				} : {
					author: `Sticker updated`,
					fields: [
						['Name:', oldE.name],
					],
					audit
				}
			}
		},

		threadCreate: {
			cleanName: 'Thread Created',
			decription: 'Emits whenever a new thread is created',
			//audit: 10,
			color: CssColors.green,
			function: async ([t], audit) => {
				if (audit) audit = AuditLog(t.guild, 110, t.id);
				return {
					author: `Thread created: ${t.name}`,
					fields: [
						['Thread id:', t.id],
						['Parent channel:', t.parent],
					],
					audit
				}
			}
		},
		threadDelete: {
			cleanName: 'Thread Deleted',
			decription: 'Emits whenever a new thread is deleted',
			color: CssColors.red,
			function: async ([t], audit) => {
				if (audit) audit = AuditLog(t.guild, 112, t.id);
				return {
					author: `Thread deleted: ${t.name}`,
					fields: [
						['Thread id:', t.id],
						['Parent channel:', t.parent],
					],
					audit
				}
			}
		},
		threadUpdate: {
			cleanName: 'Thread Updated',
			decription: 'Emits whenever a thread is updated\nName, archive state, locked state',
			color: CssColors.yellow,
			function: async ([oldT, newT], audit) => {
				if (audit) audit = AuditLog(newT.guild, 111, newT.id);
				return oldT.name != newT.name ? {
					author: `Thread renamed`,
					fields: [
						['Old name:', oldT.name],
						['New name:', newT.name],
						['Thread ID:', newT.id, true],
						['Parent channel:', newT.parent],
					],
					audit
				} : {
					author: `Thread updated`,
					fields: [
						['Thread ID:', newT.id, true],
						['Parent channel:', newT.parent],
					],
					audit
				}
			}
		},
		threadMembersUpdate: {
			cleanName: 'Thread Members',
			decription: 'Emits whenever a member is added to or removed from a thread',
			color: CssColors.yellow,
			function: async ([oldM, newM] /*,audit*/ ) => {
				newM.filter(([...args]) => console.log({ args }));
				const t = newM.thred,
					addedMembers = newM.filter(m => !oldM.has(m.id) && m.user).map(m => m.user.toString()).join(',\n'),
					removedMembers = oldM.filter(m => !newM.has(m.id) && m.user).map(m => m.user.toString()).join(',\n');
				return {
					author: `Thread members updated: ${t.name}`,
					fields: [
						['Thread id:', t.id],
						['Parent channel:', t.parent],
						['Removed members:', removedMembers],
						['Added members:', addedMembers]
					]
				}
			}
		},

		guildScheduledEventCreate: {
			cleanName: 'Event Created',
			decription: 'Emits whenever a new event is scheduled',
			color: CssColors.green,
			function: async ([e] /*,audit*/ ) => {
				return {
					author: `Event created: ${e.name}`,
					fields: [
						['Event name:', e.name],
						['Channel:', e.channel],
						['Created by:', e.creator],
						['Event id:', e.id],
						['Scheduled date:', moment(e.scheduledStartAt).format('D/M-YYYY - HH:mm')],
						['Public:', e.privacyLevel == 'PUBLIC' ? 'Yes' : undefined],
						['Url:', e.url]
					]
				}
			}
		},
		guildScheduledEventDelete: {
			cleanName: 'Event Deleted',
			decription: 'Emits whenever an event is deleted',
			color: CssColors.red,
			function: async ([e], audit) => {
				if (audit) audit = AuditLog(e.guild, 102, e.id);
				return {
					author: `Event deleted: ${e.name}`,
					fields: [
						['Event name:', e.name],
						['Channel:', e.channel],
						['Created by:', e.creator],
						['Event id:', e.id],
						['Scheduled date:', moment(e.scheduledStartAt).format('D/M-YYYY - HH:mm')],
						['Public:', e.privacyLevel == 'PUBLIC' ? 'Yes' : undefined],
						['Url:', e.url]
					]
				}
			}
		},
		guildScheduledEventUpdate: {
			cleanName: 'Event Updated',
			decription: 'Emits whenever an event is updated',
			color: CssColors.yellow,
			function: async ([oldE, newE], audit) => {
				if (audit) audit = AuditLog(newE.guild, 101, newE.id);
				return {
					author: `Event updated: ${newE.name}`,
					fields: [
						['Event name:', newE.name],
						['Channel:', newE.channelId != oldE.channelId && `${oldE.channel} => ${newE.channel}`],
						['Created by:', newE.creatorId != oldE.creatorId && `${oldE.creator} => ${newE.creator}`],
						['Event id:', newE.id],
						['Scheduled date:', newE.scheduledStartTimestamp != oldE.scheduledStartTimestamp && `${moment(oldE.scheduledStartAt).format('D/M-YYYY - HH:mm')} => ${moment(newE.scheduledStartAt).format('D/M-YYYY - HH:mm')}`],
						['Public:', newE.privacyLevel != oldE.privacyLevel && newE.privacyLevel == 'PUBLIC' ? 'Yes' : 'No'],
						['Url:', newE.url]
					]
				}
			}
		},
		guildScheduledEventUserAdd: {
			cleanName: 'Event Member Added',
			decription: 'Emits whenever an member subscribes to an event',
			color: CssColors.green,
			function: async ([e, u] /*,audit*/ ) => {
				return {
					author: `Event member added: ${e.name}`,
					fields: [
						['Event name:', e.name],
						['Channel:', e.channel],
						['Created by:', e.creator],
						['Event id:', e.id],
						['Member:', u],
					]
				}
			}
		},
		guildScheduledEventUserRemove: {
			cleanName: 'Event Member Removed',
			decription: 'Emits whenever an member unsubscribes to an event',
			color: CssColors.red,
			function: async ([e, u] /*,audit*/ ) => {
				return {
					author: `Event member removed: ${e.name}`,
					fields: [
						['Event name:', e.name],
						['Channel:', e.channel],
						['Created by:', e.creator],
						['Event id:', e.id],
						['Member:', u],
					]
				}
			}
		}
	};
const Page = {
		commands: (guild, title, id) => new Promise(async resolver => {
			let dataBaseGuild = DataBase.guilds[guild.id] || {};
			dataBaseGuild.TextCommandRules = dataBaseGuild.TextCommandRules || [];
			dataBaseGuild.TextCommandRules = dataBaseGuild.TextCommandRules.filter(r => r.command && r.content);
			let page = await basePage({ id, title }),
				// prefix = dataBaseGuild.prefix || DefaultPrefix,
				rules = newDiv('rules'),
				create = newDiv('create');

			// 	,prefixTitle = newDiv('h2'),	setPrefixDiv = newDiv('setPrefix'),	setPrefixInput = newDiv('input'),	setPrefixButton = newDiv('div', 'set');prefixTitle.innerHTML = 'Prefix';setPrefixInput.placeholder = prefix;setPrefixInput.setAttribute('value', prefix);setPrefixInput.setAttribute('maxlength', 1);setPrefixDiv.append(setPrefixInput, setPrefixButton);page.append(prefixTitle, setPrefixDiv);

			const rulesTitle = newDiv('h2');
			rulesTitle.innerHTML = 'Custom Commands';

			create.innerHTML = 'Add a Custom Command';

			if (dataBaseGuild.TextCommandRules.length)
				rules.append(...dataBaseGuild.TextCommandRules.map(rule => {
					let { command, content, embed, disabled } = rule,
					ruleDiv = newDiv('rule'),
						commandDiv = newDiv('h1'),
						previewDiv = newDiv('h2'),
						edit = newDiv('edit'),
						remove = newDiv('remove'),
						toggle = newToggle(!disabled);

					ruleDiv.append(commandDiv, previewDiv, toggle, edit, remove);

					// ruleDiv.setAttribute('type', embed ? 'embed' : 'text');
					// if (disabled) ruleDiv.setAttribute('disabled', '');
					commandDiv.innerHTML = command;
					previewDiv.innerHTML = (embed ? [rule.content.ttl, rule.content.desc, rule.content.ftr?.nm].filter(x => x).join(' - ') : content).substr(0, 90);

					return ruleDiv;
				}));
			rules.append(newDiv('empty'));
			// TextCommandRules = {
			// 	embed: false,
			// 	// action:'role',
			// 	command: 'ping',
			// 	content: 'pong',
			// 	content: { athr: { img: 'url', nm: '' }, ttl: '', desc: '', clr: 'ff00ff', thmb: 'url', img: 'url', ftr: { img: 'url', nm: '' } }, //if embed
			// 	roles: ['9764897', '925646'],
			// 	disabled: false,
			// 	planned: [{ c: '934787687', d: 1625590757 }] //sec | Math.floor(Date.now()/6e4)
			// }

			let commandSettings = newDiv('commandSettings'),
				commandsTitle = newDiv('h2'),
				commandList = newDiv('div', 'commandList');
			commandsTitle.innerHTML = 'Command Settings';
			commandSettings.append(commandList);

			commandList.append(...commands.map(({ com, des, /*beUsed,*/ format = '' }) => {
				let commandsItem = newDiv(),
					input = newDiv('input'),
					original = newDiv('h3'),
					details = newDiv('details'),
					sum = newDiv('summary');
				commandsItem.id = original.innerHTML = com;
				input.setAttribute('value', dataBaseGuild.command(com));
				[commandsItem, sum, original].map(e => e.setAttribute('prefix', ''));
				commandsItem.append(input, newDiv('div', 'set'), original);

				if (des) commandsItem.append(details);
				sum.innerHTML = `${dataBaseGuild.command(com)} ${format}`.trim();
				details.append(sum, des);

				return commandsItem;
			}));

			const prefix = dataBaseGuild.prefix || DefaultPrefix,
				prefixTitle = newDiv('h2'),
				setPrefixDiv = newDiv('setPrefix'),
				setPrefixInput = newDiv('input'),
				setPrefixButton = newDiv('div', 'set');
			prefixTitle.innerHTML = 'Prefix';
			setPrefixInput.placeholder = prefix;
			setPrefixInput.setAttribute('value', prefix);
			setPrefixInput.setAttribute('maxlength', 1);
			setPrefixDiv.append(setPrefixInput, setPrefixButton);


			if (!dataBaseGuild.Reactions) dataBaseGuild.Reactions = {};
			let reactions = dataBaseGuild.Reactions;
			// reactions = [{e: '😃🎃',c: '92348',f: 1 /*undef:all; 1:only bots; 2:not bots; 3:only embeds; 'u92635':only user; 'r92635':only role*/}, {	e: '🎃',c: '92348',	f: 'u708576015315632168' /* undef:all; 1:only bots; 2:not bots; 3:only embeds; 'u92635':only user; 'r92635':only role*/}];
			const reactTitle = newDiv('h2', 'reactTitle'),
				reactDiv = newDiv('reaction'),
				// reactNew = newDiv('div', 'create'),
				reactList = newDiv('rules'),
				reactData = newDiv('div', 'hide', 'reactiondata');
			reactTitle.innerHTML = 'Auto Reaction';
			// reactData.innerHTML = Object.entries(reactions).filter(x => x[1]).map(([c, r]) => [r.e, c, r.f].join(',')).join(';'); // el.innerHTML.split(';').map(x=>x.split(',')).map(( [e,c,f])=>({e,c,f}))
			reactData.innerHTML = Object.entries(reactions).filter(x => x[1]).map(([c, r]) => [r.e.join('.'), c, r.f].join(',')).join(';');
			reactDiv.append(reactList, reactData);

			if (dataBaseGuild.Reactions.isEmpty()) dataBaseGuild.Reactions = undefined;


			// Reactions = {
			// '92348': {
			// 	e: ['😃','🎃'],
			// 	f: 1 // undef:all; 1:only bots; 2:not bots; 3:only embeds; 'u92635':only user; 'r92635':only role
			// }}

			page.append(
				prefixTitle, setPrefixDiv,
				reactTitle, reactDiv,
				commandsTitle, commandSettings,
				rulesTitle, rules, create
			);

			resolver([page, title, id, 'commands']);
		}),
		support: (guild, title, id) => new Promise(async resolver => {
			let dataBaseGuild = DataBase.guilds[guild.id] || {};
			if (!dataBaseGuild.Tickets) dataBaseGuild.Tickets = {};
			let prefix = dataBaseGuild.prefix || DefaultPrefix,
				page = await basePage({ id, title }),
				ticketTitle = newDiv('h2'),
				ticketSettings = newDiv('ticketSettings', 'inputField'),
				onoff = newToggle(dataBaseGuild.Tickets?.enabled),
				// checkbox = newDiv('input'),
				ticketDiv = newDiv('div'),
				ticketH6 = newDiv('h5'),
				channelSelect = Select.Channel({ set: dataBaseGuild.Tickets.channel, hint: ['support', 'ticket'], guild }),
				staffSelect = newDiv('select', 'staffSelect'),
				parentSelect = newDiv('select', 'parentSelect'),
				ticketName = newDiv('input', 'ticketName'),
				set = newDiv('div', 'set');

			// checkbox.type = 'checkbox';
			if (dataBaseGuild.Tickets?.enabled)
				ticketSettings.setAttribute('show', '');
			// checkbox.setAttribute('checked', '');

			// onoff.append(checkbox, newDiv());
			ticketSettings.append(onoff);

			ticketH6.innerHTML = 'Toggle Support Channels';
			ticketTitle.innerHTML = 'Support Channels';
			// set.innerHTML = 'SET';
			ticketName.setAttribute('value', 'support-{u}');
			ticketName.setAttribute('autocomplete', 'off');
			channelSelect.name = 'channel';
			staffSelect.name = 'staff';
			parentSelect.name = 'parent';
			ticketName.name = 'name';

			page.append(ticketTitle, ticketSettings);
			ticketSettings.append(ticketH6, ticketDiv);

			ticketDiv.append(
				h6('Support Team Role', 'The role that will be able to read and write in the support channel and will be pinged when a support channel is created'),
				staffSelect,
				h6('Support Channel', 'The channel where the members will be able to open a new support channel'),
				channelSelect,
				h6('Parent Category', 'This is where the created support channel will be put'),
				parentSelect,
				h6("Ticket Name<i>Use <code>{u}</code> for the members's username</i>", 'The name the created channel will be given'),
				ticketName,
				h6("Claimable Channels", 'If enabled, moderators will be able to claim a support channel. Then no other moderators will be able to write in the channel. The moderator is able to unclaim the channel and admins will always be able to write'),
				newToggle(dataBaseGuild.Tickets.claim, 'claim', 'toggle'),
				h6("Unlisted Transcripts", 'If enabled, everyone with the url will be able to access and read the saved transcripts of closed support channels'),
				newToggle(dataBaseGuild.Tickets.unlisted, 'unlisted', 'toggle')
			);

			let selected = false;
			parentSelect.innerHTML = '<option class="global" value="0">Global</option>';
			[...guild.channels.cache.values()].filter(c => c.type == 'GUILD_CATEGORY').sort((a, b) => a.rawPosition - b.rawPosition).forEach(c => {
				let option = newDiv('option');
				option.value = c.id;
				option.innerHTML = c.name;

				if (dataBaseGuild.Tickets.parent) {
					if (c.id == dataBaseGuild.Tickets.parent) option.setAttribute('selected', '');
				} else if (!selected && c.name.toLowerCase().includes('support')) {
					option.setAttribute('selected', '');
					selected = true
				}
				parentSelect.append(option);
			});

			selected = false;
			[...guild.roles.cache.values()].sort((a, b) => b.position - a.position).forEach(r => {
				let option = newDiv('option');
				option.value = r.id;
				option.innerHTML = r.name;
				if (r.color) option.style.color = r.hexColor;
				if (dataBaseGuild.Tickets.staff) {
					if (r.id == dataBaseGuild.Tickets.staff) option.setAttribute('selected', '');
				} else if (!selected && r.name.toLowerCase().includes('staff') || r.name.toLowerCase().includes('support')) {
					option.setAttribute('selected', '');
					selected = true
				}
				staffSelect.append(option);
			});

			let embed = newDiv('div', 'embed', 'first'),
				author = newDiv('div', 'author'),
				content = newDiv('div', 'content'),
				reaction = newDiv('div', 'reaction'),
				colorDiv = newDiv('div', 'color'),
				color = newDiv('input'),
				emoji = newDiv('div', 'emoji');

			author.innerHTML = dataBaseGuild.Tickets.author || 'Support';
			content.innerHTML = dataBaseGuild.Tickets.content || 'By clicking 💬 you can open a private text channel with only you and the staff team,\nyou can do this to report an error or a person or if you just want to ask a question';
			emoji.innerHTML = dataBaseGuild.Tickets.emoji || '💬';
			if (dataBaseGuild.Tickets.color) embed.style.borderColor = dataBaseGuild.Tickets.color;

			color.setAttribute('type', 'color');
			if (dataBaseGuild.Tickets.color) color.setAttribute('value', dataBaseGuild.Tickets.color);
			author.setAttribute('contentEditable', '');
			content.setAttribute('contentEditable', '');

			embed.append(author, content, reaction, colorDiv);
			reaction.append(emoji);
			colorDiv.append(color);

			ticketDiv.append(
				h6('Custom Message', ('This embeded message will be sent in your chosen support channel. Your members can then react with your chosen emoji to open a new support channel. Discord formatting does apply')),
				embed);

			let advanced = newDiv('div', 'advanced'),
				advancedH5 = newDiv('h5'),
				footer = newDiv('div', 'footer');
			embed = newDiv('div', 'embed', 'start'), author = newDiv('div', 'author'), content = newDiv('div', 'content');

			advanced.append(
				advancedH5,
				h6('Custom Opening Message', ('This embeded message will be sent in the support channel as soon as the channel is opened. Anyone can then react to this message with ❌ to close it. Discord formatting does apply')),
				embed);
			embed.append(author, content, footer);

			content.setAttribute('contentEditable', ''), footer.setAttribute('contentEditable', '');

			author.innerHTML = dataBaseGuild.Tickets.author || 'Support';
			content.innerHTML = dataBaseGuild.Tickets.messages?.start?.content || `Welcome to ${guild.name}'s Support\nOnly you and the Support Team can see, read and write in this channel`;
			footer.innerHTML = dataBaseGuild.Tickets.messages?.start?.footer || `Press ❌ to close this support channel`;

			embed = newDiv('div', 'embed', 'end'), author = newDiv('div', 'author'), content = newDiv('div', 'content');

			advanced.append(h6('Custom Closing Message', ('This embeded message will be sent in the support channel when someone press ❌. Discord formatting does apply')),
				embed);
			embed.append(author, content);
			content.setAttribute('contentEditable', '');

			author.innerHTML = dataBaseGuild.Tickets.author || 'Support';
			content.innerHTML = dataBaseGuild.Tickets.messages?.end || `**Are you sure you want to close this support channel?**\nYes, I want to close: ✔️\nNo, I want to continue: ❌`;

			embed = newDiv('div', 'embed', 'save'), author = newDiv('div', 'author'), content = newDiv('div', 'content');
			let saveOption = newDiv('input', 'saveOption');
			saveOption.setAttribute('type', 'range'), saveOption.setAttribute('min', '0'), saveOption.setAttribute('max', '2');
			let val = ['always', 'ask', 'never'].indexOf(dataBaseGuild.Tickets.save);
			saveOption.setAttribute('value', val == -1 ? 1 : val);
			// ['always', 'ask', 'never'] - Default = 'ask'

			advanced.append(h6('Custom Confirm Message', ('This embeded message will ask you if you want to save the transcript of the channel or if you want to close it. Discord formatting does apply')),
				saveOption, embed);
			embed.append(author, content);
			content.setAttribute('contentEditable', '');

			author.innerHTML = dataBaseGuild.Tickets.author || 'Support';
			content.innerHTML = dataBaseGuild.Tickets.messages?.save || `**The member can no longer see this channel and the channel is about to close**\nDon't save the transcript: ❌\nSave the transcript: ✔️`;
			// embed = newDiv('div', 'embed', 'close');author = newDiv('div', 'author');content = newDiv('div', 'content');advanced.append(h6('Custom Close Message', infoPopup('This embeded message will be sent if someone wants to download the transcript to close the channel, by reacting with ❌')),	embed);embed.append(author, content);content.setAttribute('contentEditable', '');author.innerHTML = dataBaseGuild.Tickets.author || 'Support';content.innerHTML = dataBaseGuild.Tickets.messages?.close || `Press ❌ to close this support channel`;

			ticketDiv.append(advanced, set);
			if (dataBaseGuild.Tickets.isEmpty()) dataBaseGuild.Tickets = undefined;

			resolver([page, title, id, 'support']);
		}),
		voice: (guild, title, id) => new Promise(async resolver => {
			let dataBaseGuild = DataBase.guilds[guild.id] || {};
			dataBaseGuild.VoiceRules = dataBaseGuild.VoiceRules || [];
			dataBaseGuild.VoiceRules = dataBaseGuild.VoiceRules.filter(r => r.channel && r.channelname);
			let page = await basePage({ id, title }),
				rules = newDiv('rules'),
				create = newDiv('create');
			create.innerHTML = 'Add a Dynamic Voice Channel';

			if (dataBaseGuild.VoiceRules.length)
				rules.append(...dataBaseGuild.VoiceRules.map(rule => {
					let { channelname, channel, disabled } = rule,
					ruleDiv = newDiv('rule'),
						nameDiv = newDiv('h1'),
						idDiv = newDiv('h2'),
						edit = newDiv('edit'),
						remove = newDiv('remove'),
						toggle = newToggle(!disabled);

					ruleDiv.append(nameDiv, idDiv, toggle, edit, remove);
					nameDiv.innerHTML = channelname;
					idDiv.innerHTML = channel;
					return ruleDiv;
				}));
			rules.append(newDiv('empty'));


			// ({
			// 	members: { // disabled if undefined
			// 		format: 'Members: {m}'
			// 	},
			// 	bots: {
			// 		format: 'Bots: {m}'
			// 	},
			// 	// countdown: {
			// 	// 	format: 'Minecraft: {m}'
			// 	// },
			// 	minecraft: {
			// 		format: 'Minecraft: {m}'
			// 	},
			// })
			// const serverstatsSettings = newDiv('serverstatssettings'),
			// 	serverstatsTitle = newDiv('h2', 'tempserverstats').Html('Auto Moderation');
			//
			// try {
			// 	serverstatsSettings.append(
			// 		newDiv('serverstats', 'words').Append(
			// 			h6('Word Filter', 'Detect blacklisted words'),
			// 			newToggle(Rule.words),
			// 			h6('Words', 'The words that will be blacklisted'),
			// 			Multiple.String({ set: Rule.words?.words, guild }),
			// 			...lastOptions(Rule.words, 'words')
			// 		)
			// 	)
			// } catch (e) { console.log(e); };

			page.append(create, rules);

			resolver([page, title, id, 'voice']);

			dataBaseGuild.VoiceRules = dataBaseGuild.VoiceRules.filter(async rule => await client.channels.fetch(rule.channel).catch(e => false))
		}),
		moderation: (guild, title, id) => new Promise(async resolver => {
			let dataBaseGuild = DataBase.guilds[guild.id] || {};
			if (!dataBaseGuild.logs) dataBaseGuild.logs = {};
			if (!dataBaseGuild.logs.enabled) dataBaseGuild.logs.enabled = [];
			let page = await basePage({ id, title }),
				logSetting = newDiv('logSettings'),
				logsTitle = newDiv('h2'),
				channelSelect = newDiv('select', 'channelSelect'),
				logList = newDiv('div', 'logList'),
				toggle = newToggle(dataBaseGuild.logs.on, 'toggle'),
				auditToggle = newToggle(dataBaseGuild.logs.audit, 'toggle', 'audit');

			// toggle.append(checkbox, newDiv());
			// checkbox.type = 'checkbox';
			// if () checkbox.setAttribute('checked', '');
			// auditToggle.append(auditCheckbox, newDiv());
			// auditCheckbox.type = 'checkbox';
			// if () auditCheckbox.setAttribute('checked', '');

			logsTitle.innerHTML = 'Logs';

			// colorDiv.append(colorSelect);
			// colorSelect.setAttribute('type', 'color');
			// if (dataBaseGuild.logs.color) colorSelect.setAttribute('value', dataBaseGuild.logs.color);

			// set.innerHTML = 'SET';

			let selected = false;
			[...guild.channels.cache.values()].filter(c => ['GUILD_TEXT', 'GUILD_NEWS'].includes(c.type)).sort((a, b) => a.rawPosition - b.rawPosition).forEach(c => {
				let option = newDiv('option');
				option.value = c.id;
				option.innerHTML = c.name;

				if (dataBaseGuild.logs.channel) {
					if (c.id == dataBaseGuild.logs.channel) option.setAttribute('selected', '')
				} else if (!selected && c.name.toLowerCase().includes('logs')) {
					option.setAttribute('selected', '');
					selected = true
				}
				channelSelect.append(option);
			});

			logSetting.append(
				h6('Toggle Logging', ("Toggle the whole log system")),
				toggle,
				h6('Log Channel', ("This is where the logs will be sent")),
				channelSelect, newDiv('div', 'set'),
				h6('Audit Logs', ("Toggle whether the bot should log senistive information, such as who it was that did something or what invite a member joined with")),
				auditToggle,
				// h6('Embed Color', infoPopup("This is the color that will be displayed on the log message's left border<div class='embed' style='border-color:#dbad11'>This border:<br>&lt; &lt; &lt;</div>")),
				// colorDiv, newDiv('div', 'set'),
				h6('Toggle', ("Toggle what you want to be logged")),
				logList
			);

			Object.entries(LogRules).forEach(([Rule, { cleanName, decription }]) => {
				let logItem = newDiv('div'),
					title = newDiv('h1'),
					des = newDiv('details'),
					sum = newDiv('summary'),
					codename = newDiv('h3'),
					toggle = newToggle(dataBaseGuild.logs.enabled.includes(Rule));
				// checkbox = newDiv('input')
				// checkbox.type = 'checkbox';
				// if (dataBaseGuild.logs.enabled.includes(Rule)) checkbox.setAttribute('checked', '');

				// toggle.append(checkbox, newDiv());
				logItem.append(title, codename);
				if (decription) logItem.append(des);
				logItem.append(toggle);
				logList.append(logItem);

				title.innerHTML = cleanName;
				codename.innerHTML = Rule;
				sum.innerHTML = 'Description';
				des.innerHTML = decription.replace(/\n/g, '<br>');
				des.append(sum);
			}); //		{ logs: {
			// 					color: '#ffffff',
			// 					channel: 'ChannelID',
			// 					enabled: ['guildMemberAdd', 'inviteDelete', 'messageDelete'],
			// 					on: true    	}}

			if (dataBaseGuild.logs.isEmpty()) dataBaseGuild.logs = undefined;

			// previous commandSettings

			// ModCommands

			// if (!dataBaseGuild.Moderation) dataBaseGuild.Moderation = {};

			let modSettings = newDiv('modsettings'),
				modTitle = newDiv('h2');

			{
				let Rule = dataBaseGuild.Moderation || {},
					mutedDisplay = newDiv('div', 'role'),
					messageFrom = newDiv('input', 'messagefrom'),
					banMessage = newDiv('textarea', 'banmessage');

				messageFrom.setAttribute('value', Rule.text?.messageFrom || `Message from ${guild.name}:`);
				messageFrom.placeholder = `Message from ${guild.name}:`;

				// toggle,logToggle,dmToggle,inviteToggle,channelSelect,staffSelect,

				modTitle.innerHTML = 'Moderation';

				if (Rule.muted) mutedDisplay.setAttribute('ttl', mutedDisplay.id = Rule.muted)
				else mutedDisplay.setAttribute('ttl', 'This role will be created by the bot the first time someone is muted on your server');
				mutedDisplay.innerHTML = `@${(await guild.roles.fetch(Rule.muted).catch(e => undefined))?.name || 'Muted'}`

				const embed = newDiv('div', 'embed'),
					author = newDiv('div', 'author'),
					hasBeen = newDiv('input', 'author', 'hasbeen'),
					byInput = newDiv('input', 'author', 'by'),
					reason = newDiv('input', 'reasonFrom'),
					duration = newDiv('input', 'duration'),
					footer = newDiv('div', 'footer'),
					until = newDiv('input', 'until'),
					content = newDiv('div', 'content'),
					durationContent = newDiv('div', 'content'),
					colorDiv = newDiv('div', 'color'),
					color = newDiv('input');
				colorDiv.append(color);
				embed.append(author, reason, content, duration, durationContent, footer, colorDiv);

				author.append(RandomUser(), hasBeen, newDiv('span'), byInput, RandomUser());
				footer.append(newDiv('span'), until, moment().format("[ • Today at] h:m"));

				color.setAttribute('value', `#${Rule.text?.color || 'dbad11'}`);
				color.type = 'color';

				content.innerHTML = 'Broke rule #1.1: Do not brake our rules'
				durationContent.innerHTML = ['2h30m', '1h15m', '4h', '1d', '2w'][Math.floor(Math.random() * 5)]
				// durationContent.append(infoPopup("This will only be showed by temporarily penalties"))

				hasBeen.setAttribute('value', Rule.text?.hasBeen || 'has been');
				hasBeen.placeholder = 'has been';
				byInput.setAttribute('value', Rule.text?.by || 'by');
				byInput.placeholder = 'by';
				reason.setAttribute('value', Rule.text?.reason || 'Reason:');
				reason.placeholder = 'Reason:';
				duration.setAttribute('value', Rule.text?.duration || 'Duration:');
				duration.placeholder = 'Duration:';
				until.setAttribute('value', Rule.text?.until || 'until');
				until.placeholder = 'until';

				if (Rule.banMessage) banMessage.innerHTML = Rule.banMessage;
				banMessage.setAttribute('maxlength', 4096);

				const comSettings = newDiv('div', 'comsettings'),
					comDivs = ['warn', 'kick', 'ban', 'unban', 'tempban', 'mute', 'unmute', 'tempmute'].map(x => {
						let defaultObj = commands.find(c => c.com == x),
							commandObj = ObjectMerge(defaultObj, (Rule.coms && Rule.coms[x]) || {}),
							div = newDiv('div', 'comsetting'),
							input = newDiv('input', 'command'),
							role = Select.Role({ set: (Rule.coms && Rule.coms[x]?.role), hint: ['staff', 'mod', 'admin'], guild }),
							defaultRole = newDiv('option'),
							// roleH6 = h6('Moderator Role', infoPopup(`Every member with this role and everyone with admin permission can call the<y>${dataBaseGuild.prefix||DefaultPrefix}${x}</y>command. The default role is the role specified above; if a role is selected here, the Moderator role abouve will be ignored.`)),
							roleH6 = h6('Moderator Role', ((dataBaseGuild.prefix || DefaultPrefix) + x)),
							// txtH6 = h6('Action Name', infoPopup((dataBaseGuild.prefix || DefaultPrefix) + x)),
							doc = newDiv('div', 'doc'),
							// txt1 = newDiv('input', 'txt', 'txt1'),
							txt = newDiv('div', 'txt'),
							txtInput = newDiv('input', 'txtinput');
						// console.log({ commandObj, coms: Rule.coms });

						defaultRole.value = '0';
						defaultRole.innerHTML = 'Default Role';
						if (!(Rule.coms && Rule.coms[x]?.role)) {
							[...role.selectedOptions].forEach(o => o.removeAttribute('selected'));;
							defaultRole.setAttribute('selected', '');
						}
						role.prepend(defaultRole);

						// txt1.innerHTML = commandObj.txt1;
						txtInput.setAttribute('value', commandObj.txt);
						// txt1.placeholder = defaultObj.txt1;
						txtInput.placeholder = defaultObj.txt;

						div.setAttribute('shw', defaultObj.txt1);

						txt.append(
							RandomUser(),
							hasBeen.cloneNode(),
							txtInput
						);
						div.append(input, doc, roleH6, role, txt); // txt1,
						input.setAttribute('value', dataBaseGuild.command(x));
						doc.innerHTML = `<span>${x}</span> ${commandObj.format}`;
						div.id = input.placeholder = x;
						doc.setAttribute('prefix', '');
						div.setAttribute('prefix', '');
						return div;
					});
				comSettings.append(...comDivs)
				comSettings.setAttribute('shw', 1);

				let scrollbar = newDiv('div', 'scrollbar'),
					scrollItems = ['warn', 'kick', 'ban', 'un ban', 'temp ban', 'mute', 'un mute', 'temp mute'].map(x => {
						let div = newDiv();
						x = x.replace(' ', '&#8203;')
						div.innerHTML = x;

						return div;
					});
				scrollbar.append(
					newDiv('div', 'scrollarrow'),
					...scrollItems,
					newDiv('div', 'scrollarrow')
				)

				modSettings.append(
					h6('Toggle Moderation Commands', ("Toggle all moderation commands")),
					newToggle(Rule.enabled),

					h6('Records Channel', ("The channel where all penalties will be displayed")),
					Select.Channel({ set: Rule.channel, hint: ['crime', 'regist', 'penalt', 'straff', 'brott'], guild }),

					h6('Moderator Role', ("Every member with this role and everyone with admin permission can call every moderator command")),
					Select.Role({ set: Rule.staff, hint: ['staff', 'mod', 'admin'], guild }),

					h6('Toggle Moderation Logs', ("If enabled, the bot will log every moderation action and show it here on the website. [Coming soon; the logs will be saved but you cannot display them yet]")),
					newToggle(Rule.logsEnabled, 'toggle', 'log'),

					h6('Ban-Message', ("Whenever a user is banned, this message will be sent as a description in an embeded direct message after the messege containing the reason. Tip: This can be used to send out a form that a banned user can fill in if they think they were banned wrongly. Discord formatting does apply")),
					messageFrom,
					banMessage,

					h6('Dm Everytime', ("If enabled, the bot will send the Ban-Message to the punished/warned member no matter what penalty they recived. If disabled, the bot will only send a direct message to the member if they've been banned or temporarily banned")),
					newToggle(Rule.dmAll, 'toggle', 'dm'),

					h6('Dm Server Invite', ("If enabled, the bot will send a server invite to the punished member if they were temporarily banned, kicked or unbanned. The bot will create the invite directing to the selected channel or use an already existing invite created by the bot")),
					newToggle(Rule.dmInvite, 'toggle', 'invite'),

					h6('Tell Who Issued The Penalty', ("If enabled, the bot will tell the member which moderator issued the penalty")),
					newToggle(Rule.tellWho, 'toggle', 'tellwho'),

					h6('Muted Role', ("The role muted people will get. This role were created by the bot the first time someone is muted on your server. This role will have the <code>Send messages</code> permission disabled in every text channel except Support Channels")),
					mutedDisplay,

					h6('Use Timeout', ("Use Discord native timeouts instead of the bot's <code>Muted Role</code>. Timouts will mute the member in all channels, including support channels, and is limited to max 28 days. If toggled, <code>$mute</code> command will mute the member for 28 days instead of unlimited time. When toggled, an existing <code>Muted Role</code> will be removed. All current mutes using the <code>Muted Role</code> will be removed when the role is.")),
					newToggle(Rule.timeout, 'toggle', 'timeout'),

					h6('Penalty Message', ("This embeded message will be sent in you chosen Records Channel. Every<y>yellow</y>field is customizeble")),
					embed,

					comSettings,
					scrollbar,

					newDiv('div', 'set')
					// auto: contentFilter, caps, spam, emoji
				)
			};

			// ({
			// 	words: { // disabled if undefined
			// 		words: ['ord', 'ord'],
			// 		pnsh: 2, // 0/undef:none, 1:delete, 2:warn, 3:warn&delete
			// 		rsn: 'Used a bad word', //reason if warn
			// 		ignRls: ['ƚȰơǜȩy', 'ƣǺXVȄ'],
			// 		ignChn: ['rÑ00', 'ÓȈß¾ǭ']
			// 	},
			// 	links: {
			// 		ignDom: ['google.se', 'mcfkg.eu'],
			// 		inv: 0, //* 0/undef:Ignore, 1:Catch, 2:Only Catch*/
			// 		pnsh: 2,
			// 		rsn: 'Sent a link',
			// 		ignRls: ['ƚȰơǜȩy', 'ƣǺXVȄ'],
			// 		ignChn: ['rÑ00', 'ÓȈß¾ǭ']
			// 	},
			// 	spam: {
			// 		num: 4, //number of same messages in a row
			// 		pnsh: 2,
			// 		rsn: 'Sent too many indentical messages',
			// 		ignRls: ['ƚȰơǜȩy', 'ƣǺXVȄ'],
			// 		ignChn: ['rÑ00', 'ÓȈß¾ǭ']
			// 	},
			// 	caps: {
			// 		num: 70, //percentage of letters that is caps
			// 		pnsh: 2,
			// 		rsn: 'Sent too many capital letters',
			// 		ignRls: ['ƚȰơǜȩy', 'ƣǺXVȄ'],
			// 		ignChn: ['rÑ00', 'ÓȈß¾ǭ']
			// 	},
			// 	// emojis: {
			// 	// 	num: 3, //number of emojis in 1 message
			// 	// 	pnsh: 2,
			// 	//  rsn:'Sent too many emojis',
			// 	// 	ignRls: ['ƚȰơǜȩy', 'ƣǺXVȄ'],
			// 	// 	ignChn: ['rÑ00', 'ÓȈß¾ǭ']
			// 	// },
			// 	mentions: {
			// 		num: 4, //number of mentions in 1 message
			// 		pnsh: 2,
			// 		rsn: 'Sent too many mentions',
			// 		ignRls: ['ƚȰơǜȩy', 'ƣǺXVȄ'],
			// 		ignChn: ['rÑ00', 'ÓȈß¾ǭ']
			// 	},
			// 	zalgo: { //hasZalgo = txt => /%CC%/g.test(encodeURIComponent(txt));
			// 		pnsh: 2,
			// 		rsn: 'Used zalgo',
			// 		ignRls: ['ƚȰơǜȩy', 'ƣǺXVȄ'],
			// 		ignChn: ['rÑ00', 'ÓȈß¾ǭ']
			// 	}
			// })

			const automodSettings = newDiv('automodsettings'),
				automodTitle = newDiv('h2', 'tempautomod').Html('Auto Moderation');

			if (dataBaseGuild.premium) try {
				const Rule = dataBaseGuild.Moderation?.automod || {},
					lastOptions = (properties = {}, type) => {
						const { pnsh = 0, ignChn, ignRls, rsn } = properties;
						return [
							h6('Ignored Channels', 'Word use in these channels will be ignored'),
							Multiple.Channel({ set: ignChn?.map(Snowflake.decode), guild }),
							h6('Ignored Roles', 'Word use by users with one or more of these roles will be ignored'),
							Multiple.Role({ set: ignRls?.map(Snowflake.decode), guild }),
							h6('Action', 'What the bot should do when finding a message containing a foul'),
							newRange(1, 3, +pnsh, 'action'),
							// h6('Delete Message', 'Whether the bot should delete the message containing the foul'),
							// newToggle(pnsh % 2, 'del'), //if 1||3
							// h6('Warn Member', 'Whether the bot warn the member'),
							// newToggle(pnsh >= 2, 'warn'), //if 2||3
							h6('Reason', 'The reason to be provided when warning the member and to be sent in the current channel'),
							newDiv('input', 'reason').Value(rsn || defaultReasons[type])
						]
					};

				automodSettings.append(
					newDiv('automod', 'words').Append(
						h6('Word Filter', 'Detect blacklisted words'),
						newToggle(Rule.words),
						h6('Words', 'The words that will be blacklisted, You can add multiple words at a time by seperating them by a comma(<code>,</code>)'),
						Multiple.String({ set: Rule.words?.words, guild, csv: true }),
						...lastOptions(Rule.words, 'words')
					),
					newDiv('automod', 'links').Append(
						h6('Link Filter', 'Detect links in messages'),
						newToggle(Rule.links),
						h6('Ignore Url', 'Ignore any link that starts with any of these urls. Example: <code>https://discord.com/</code> or <code>bot.konkenbonken.com/Guild/</code>'),
						Multiple.String({ set: Rule.links?.ignDom, guild }).Attribute('url'),
						h6('Ignore Message Links', 'Ignore links starting with <code>https://discord.com/channels/</code>'),
						newToggle(Rule.links?.ignMsg, 'ignmsg'),
						...lastOptions(Rule.links, 'links')
					),
					newDiv('automod', 'invites').Append(
						h6('Invite Filter', 'Detect links starting with <code>https://discord.gg/</code> or <code>https://discord.com/invite/</code>'),
						newToggle(Rule.invites),
						...lastOptions(Rule.invites, 'invites')
					),
					newDiv('automod', 'spam').Append(
						h6('Spam Filter', 'Detect repeating of identical messages in a row by the same user'),
						newToggle(Rule.spam),
						h6('Amount', 'The amount of messages needed'),
						newRange(2, 10, Rule.spam?.num || 4),
						...lastOptions(Rule.spam, 'spam')
					),
					newDiv('automod', 'caps').Append(
						h6('Caps Filter', 'Detect usage of capital letters; only for messages longer than 4 letters'),
						newToggle(Rule.caps),
						h6('Amount', 'The percentage of messege that needs to be in upper case'),
						newRange(20, 100, Rule.caps?.num || 70, 'percent'),
						...lastOptions(Rule.caps, 'caps')
					),
					newDiv('automod', 'mentions').Append(
						h6('Mentions Filter', 'Detect repeating of user mentions in one message'),
						newToggle(Rule.mentions),
						h6('Amount', 'The amount of mentions needed'),
						newRange(2, 20, Rule.mentions?.num || 4),
						...lastOptions(Rule.mentions, 'mentions')
					),
					newDiv('automod', 'zalgo').Append(
						h6('Zalgo Filter', 'Detect any usage of z̴͕̮̣͔͊͂̔̈́͝a̴͖̩̣̙̬͑͗͑̐l̴̟̼͔̹̝̆ǵ̸̡̢̳̮͈͆̈́͒̇o̸̬̬͍͛'),
						newToggle(Rule.zalgo),
						...lastOptions(Rule.zalgo, 'zalgo')
					)
				)
			} catch (e) { console.log(e); };

			page.append(
				// prefixTitle, setPrefixDiv,
				modTitle, modSettings
			);
			if (dataBaseGuild.premium) page.append(automodTitle, automodSettings);
			page.append(
				logsTitle, logSetting,
				// ,commandsTitle, commandSettings
				/* ModLogs; läggs till client-side */
			);

			resolver([page, title, id, 'moderation']);
		}),
		suggestions: (guild, title, id, user) => new Promise(async resolver => {
			let dataBaseGuild = DataBase.guilds[guild.id] || {};
			if (!dataBaseGuild.Suggestions) dataBaseGuild.Suggestions = {};
			let Rule = dataBaseGuild.Suggestions,
				page = await basePage({ id, title }),
				setupTitle = newDiv('h2'),
				innerSettings = newDiv(),
				suggestSettings = newDiv('suggestSettings'),
				toggleTitle = newDiv('h5'),
				onoff = newToggle(Rule.enabled);
			// checkbox = newDiv('input');
			Rule.embed = Rule.embed || { colors: {} };

			page.append(setupTitle, suggestSettings)

			setupTitle.innerHTML = 'Suggestions';
			toggleTitle.innerHTML = 'Toggle Suggestions';
			// checkbox.type = 'checkbox';
			if (Rule.enabled)
				suggestSettings.setAttribute('show', '');
			// checkbox.setAttribute('checked', '');

			// onoff.append(checkbox, newDiv());
			suggestSettings.append(toggleTitle, onoff, innerSettings);

			let staffSelect = Select.Role({ set: Rule.staff, hint: ['staff', 'mod'], guild }),
				suggestChannelSelect = newDiv('select'),
				responseChannelSelect = newDiv('select');

			let selected = false,
				channels = channel => [...guild.channels.cache.values()].filter(c => ['GUILD_TEXT', 'GUILD_NEWS'].includes(c.type)).sort((a, b) => a.rawPosition - b.rawPosition).map(c => {
					let option = newDiv('option');
					option.value = c.id;
					option.innerHTML = c.name;

					if (Rule.channels && Rule.channels[channel]) {
						if (c.id == Rule.channels[channel]) option.setAttribute('selected', '')
					} else if (!selected && c.name.toLowerCase().includes('suggest') || c.name.toLowerCase().includes(channel)) {
						option.setAttribute('selected', '');
						selected = true
					}
					return option
				});
			suggestChannelSelect.append(...channels('suggest'));
			responseChannelSelect.append(...channels('response'));

			staffSelect.name = 'staff';
			suggestChannelSelect.name = 'suggestChannel';
			responseChannelSelect.name = 'responseChannel';

			let embeds = newDiv('div', 'embeds');
			embeds.append(...Array(4).fill().map((x, i) => {
				let status = ['pending', 'approve', 'deny', 'consider'][i],
					embed = newDiv('div', 'embed', status),
					author = newDiv('div', 'author'),
					title = newDiv('input', 'title'),
					content = newDiv('div', 'content'),
					colorDiv = newDiv('div', 'color'),
					color = newDiv('input'),
					reactions, statusName;

				embed.setAttribute('status', capital(status));
				author.innerHTML = RandomUser();

				title.setAttribute('value', Rule.embed.suggestion || 'Suggestion');
				title.placeholder = 'Suggestion';

				content.innerHTML = "<i>I really think you should add KonkenBoten to your server<br>It's a really good discord bot that's easy to use and completely free!</i>";
				if (!i) { //pending
					let reaction = newDiv('div', 'reaction'),
						emoji = newDiv('div', 'emoji');
					reactions = [reaction];
					emoji.innerHTML = Rule.embed?.up || '⬆️';
					reaction.append(emoji);

					reaction = newDiv('div', 'reaction'),
						emoji = newDiv('div', 'emoji');
					emoji.innerHTML = Rule.embed?.down || '⬇️';
					reaction.append(emoji);
					reactions.push(reaction);
				} else {
					statusName = newDiv('input', 'statusname');
					let statusNameDeafult = ['Approved', 'Denied', 'Considered'][i - 1];
					statusName.setAttribute('value', Rule.embed[status] || statusNameDeafult);
					statusName.placeholder = statusNameDeafult;

					let reasonFrom = newDiv('input', 'reasonFrom');
					reasonFrom.setAttribute('value', Rule.embed?.reasonFrom || 'Reason from');
					reasonFrom.placeholder = 'Reason from';
					content.append(reasonFrom);
					let reason = ["Yes! Of course. I love that bot :)", "No, I don't like that bot :(", "Hmm... I'll think on that one. Maybe later :|"][i - 1];
					content.innerHTML += `<b>: ${user.tag}:<span>${reason}</span></b>`;
				}

				let hexColor = `#${Rule.embed?.colors[status] || ['747f8d', '43b581', 'f04747', 'faa61a'][i]}`;
				embed.style.borderColor = hexColor;
				color.type = 'color';
				color.setAttribute('value', hexColor);

				colorDiv.append(color);

				embed.append(author, title);
				if (statusName) embed.append(statusName);
				embed.append(content, colorDiv);
				if (reactions) embed.append(...reactions);

				return embed
			}));

			innerSettings.append(
				h6('Support Team Role', ('The role that will be able to delete and respond to suggestions')),
				staffSelect,
				h6('Suggest Channel', ('The channel where the members will be able to submit their suggestions. This is also where members will be able to vote on what suggestions they think should be approved')),
				suggestChannelSelect,
				h6('Respond Channel', ('The channel where the Support Team will be able to submit their responds. This is where the Support Team\'s responses will be sent')),
				responseChannelSelect,
				h6('Embed Config', ('Customize how you want the embeded messages to look like. Every<y>yellow</y>field is customizeble')),
				embeds,
				newDiv('div', 'set')
			);

			// x = {
			// 	enabled: true,
			// 	embed: {
			// 		suggestion: 'Suggestion',
			// 		reasonFrom: 'Reason from',
			// 		approve: 'Approved',
			// 		deny: 'Denied',
			// 		consider: 'Considered',
			// 		up: '⬆️', //upvote
			// 		down: '⬇️', //downvote
			// 		// colors: {
			// 		// 	pending: '747f8d',
			// 		// 	approve: '43b581',
			// 		// 	deny: 'f04747',
			// 		// 	consider: 'faa61a'
			// 		// }
			// 	}
			// 	// channels: {
			// 	// 	suggest: '83730873837',
			// 	// 	response: '83730873874'
			// 	// },
			// 	// staff: '9476457896',
			// }
			if (dataBaseGuild.Suggestions.isEmpty()) dataBaseGuild.Suggestions = undefined;

			resolver([page, title, id, 'suggestions']);
		})
	},
	argEl = (arg, des) => `<span class="argel" arg="${arg}"><span>${des}</span></span>`,
	commands = [
		/*{
			com: 'adduser',
			des: 'Used by staff to Add a user to a Support Channel',
			beUsed: 'in support channels if enabled', //  "Can be used " + beUsed  -  default = 'anywhere'
			format: argEl('@user') // prefix + command + format
		}, {
			com: 'removeuser',
			des: 'Used by staff to Remove a user from a Support Channel',
			beUsed: 'in support channels if enabled',
			format: argEl('@user')
		},*/
		{
			com: 'suggest',
			des: 'Used by member to submit a Suggestion',
			// beUsed: 'in the suggestion channels if enabled',
			format: argEl('suggestion', 'text; max 4096 characters')
		}, {
			com: 'approve',
			des: 'Used by moderator to approve a Suggestion',
			// beUsed: 'in the suggestion channels if enabled',
			format: argEl('index', 'number') + argEl('reason', 'text; max 1024  characters')
		}, {
			com: 'deny',
			des: 'Used by moderator to deny a Suggestion',
			// beUsed: 'in the suggestion channels if enabled',
			format: argEl('index', 'number') + argEl('reason', 'text; max 1024  characters')
		}, {
			com: 'consider',
			des: 'Used by moderator to consider a Suggestion',
			// beUsed: 'in the suggestion channels if enabled',
			format: argEl('index', 'number') + argEl('reason', 'text; max 1024  characters')
		}, {
			com: 'echo',
			des: 'Used by admin to send message through the bot; The bot copies what you say',
			format: argEl('message', 'text; max 4000 characters')
		}, {
			com: 'slowmode',
			des: 'Used by moderator to set the slowmode of the current channel; Use command without arguments to disable slowmode',
			format: argEl('?duration', 'number of seconds or duration; possible units are d, h, m, s; example: 2h30m = 2 hours and 30 minutes; max 21600 seconds; optional')
		}, {
			com: 'clear',
			des: 'Used by moderator to delete an amount of messages in the current channel',
			format: argEl('amount', 'number; max 499')
		},

		{
			com: 'userinfo',
			des: 'Used by moderator to get info about a member',
			format: argEl('@user', 'user-tag or id')
		}, {
			com: 'serverinfo',
			des: 'Used by moderator to get info about the current server',
			// format:
		}, {
			com: 'roleinfo',
			des: 'Used by moderator to get info about a role',
			format: argEl('@role', 'role-tag or id')
		},

		{
			com: 'infractions',
			des: 'Used by moderator to get a member\'s last logged infractions',
			format: argEl('@user', 'user-tag or id')
		}, {
			com: 'warn',
			des: 'Used by command-specific role or admin to warn a member',
			format: argEl('@user', 'user-tag or id') + argEl('?reason', 'text; max 512 characters'), //ban reason is limiting, otherwise 512
			txt1: 'warn',
			txt: 'warned'
		}, {
			com: 'kick',
			des: 'Used by command-specific role or admin to kick a member',
			format: argEl('@user', 'user-tag or id') + argEl('?reason', 'text; max 512 characters'),
			txt1: 'kick',
			txt: 'kicked'
		}, {
			com: 'ban',
			des: 'Used by command-specific role or admin to ban a member',
			format: argEl('@user', 'user-tag or id') + argEl('?reason', 'text; max 512 characters'),
			txt1: 'ban',
			txt: 'banned'
		}, {
			com: 'unban',
			des: 'Used by command-specific role or admin to unban a member',
			format: argEl('@user', 'user-tag or id') + argEl('?reason', 'text; max 512 characters'),
			txt1: 'unban',
			txt: 'unbanned'
		}, {
			com: 'tempban',
			des: 'Used by command-specific role or admin to temporarily ban a member',
			format: argEl('@user', 'user-tag or id') + argEl('duration', 'duration; possible units are d, h, m, s; example: 2h30m = 2 hours and 30 minutes') + argEl('?reason', 'text; max 512 characters'),
			txt1: 'temporarily ban',
			txt: 'temporarily banned'
		}, {
			com: 'mute',
			des: 'Used by command-specific role or admin to mute a member',
			format: argEl('@user', 'user-tag or id') + argEl('?reason', 'text; max 512 characters'),
			txt1: 'mute',
			txt: 'muted'
		}, {
			com: 'unmute',
			des: 'Used by command-specific role or admin to unmute a member',
			format: argEl('@user', 'user-tag or id') + argEl('?reason', 'text; max 512 characters'),
			txt1: 'unmute',
			txt: 'unmuted'
		}, {
			com: 'tempmute',
			des: 'Used by command-specific role or admin to temporarily mute a member',
			format: argEl('@user', 'user-tag or id') + argEl('duration', 'duration; possible units are d, h, m, s; example: 2h30m = 2 hours and 30 minutes') + argEl('?reason', 'text; max 512 characters'),
			txt1: 'temporarily mute',
			txt: 'temporarily muted'
		}
	],
	encodeT = n => Math.round((n || Date.now()) / 6e4 - 271e5), // Date ->  T
	decodeT = (n, parse = false) => { //            T   -> Date
		n = new Date((n + 271e5) * 6e4);
		if (parse) n = moment(n).format('DD/MM - HH:mm');
		return n
	},
	nextChar = (s, n) => s.split('').reverse().map(c => String.fromCharCode(c.charCodeAt(0) + n)).join(''),
	encryptString = s => nextChar(s, 3),
	decryptString = s => nextChar(s, -3);

const moderationEmbed = (action, member, Reason, { reason, hasBeen, duration, color, txt, until }, Duration, Until) => {
		let { user = member } = member; // user = User | Id;  member = Member | Id
		let embed = {
			author: { name: `${user.tag||user} ${hasBeen} ${txt}`, iconURL: user.tag && user.displayAvatarURL() },
			fields: Reason ? [{ name: reason, value: Reason }] : [],
			color: parseInt(color, 16) || 14396689,
		};
		if (Until) {
			embed.footer = { text: `${capital(txt.split(" ").pop())} ${until}` };
			embed.timestamp = Until;
			if (Duration) embed.fields.push({ name: duration, value: CleanDate(Duration) }) //  moment(until).toNow(true)
		};
		return ({ embeds: [embed] });
	},
	moderationDmEmbed = async (action, { text, reason, member, tellWho, staff, guild, banMessage, dmInvite }, ftrTxt, timestamp) => ({
		content: dmInvite,
		embeds: [{
				author: { name: `${(member.user?.tag||member.tag)||member} ${text.hasBeen} ${text.txt} ${tellWho? `${text.by} ${staff?.user?.tag}`:''}` },
				description: reason,
				// fields: banMessage && { name: text.messageFrom, value: banMessage },
				color: parseInt(text.color, 16) || 14396689,
				footer: { text: ftrTxt || guild.name, iconURL: guild.iconURL() },
				timestamp
			},
			banMessage && {
				author: { name: text.messageFrom },
				description: banMessage,
				color: parseInt(text.color, 16) || 14396689
			}
		].filter(x => x)
	});
// moderationEmbed(action, member, reason, text, duration)

const moderationCommands = { // logs.push -> { type, reason, staff, member, date, duration }
		//  {
		// 	member,	reason, channel,
		//  staff, logs, text, guild,
		//  dmInvite, dmAll, banMessage, tellWho,
		// duration, until,
		// ?muted, ?duration
		// 	}
		warn: async ({ member, reason, channel, staff, logs, text, guild, dmAll, banMessage, tellWho }) => {
			try {
				logs.push({ t: 'warn', s: staff.id, r: reason, m: member.id, d: encodeT() });
				channel.send(moderationEmbed(text.txt, member, reason, text));
				await member.send(await moderationDmEmbed(text.txt, { text, reason, member, tellWho, staff, guild, banMessage: dmAll && banMessage }));
			} catch (e) {
				console.log(moderationEmbed(text.txt, member, reason, text),
					text, 38163);
			}
		},
		kick: async ({ member, reason, channel, staff, logs, text, dmInvite, guild, banMessage, tellWho }) => {
			await member.kick(reason);
			logs.push({ t: 'kick', s: staff.id, r: reason, m: member.id, d: encodeT() });
			channel.send(moderationEmbed(text.txt, member, reason, text));
			await member.send(await moderationDmEmbed(text.txt, { text, reason, member, tellWho, staff, guild, banMessage, dmInvite }));
		},
		ban: async ({ member, reason, channel, staff, logs, text, guild, banMessage, tellWho }) => {
			//member = Member|id
			let banMember = await guild.members.ban(member, { reason }); // Any: Member|User|Id
			if (!(member instanceof Discord.GuildMember)) {
				member = banMember;
				if (typeof member == "string")
					member = await client.users.fetch(member)
					.then(user => ({ user, id: user.id, send: user.send }))
					.catch(() => ({ id: member, user: member, send: () => console.error('Banned member not found') }))
				if (member instanceof Discord.User)
					member = { user: member, id: member.id };
				member.send = member.send || member.user?.send;
			}

			// await member.ban({ reason });
			logs.push({ t: 'ban', s: staff.id, r: reason, m: member.id, d: encodeT() });
			channel.send(moderationEmbed(text.txt, member, reason, text));
			try {
				await member.send(await moderationDmEmbed(text.txt, { text, reason, member, tellWho, staff, guild, banMessage }));
			} catch (e) { console.error(e.message) }
		},
		unban: async ({ member, reason, channel, staff, logs, text, dmInvite, guild, banMessage, tellWho }) => {
			//member = id
			let user = await guild.members.unban(member, reason);
			// member = await guild.members.fetch(member);

			channel.send(moderationEmbed(text.txt, { user }, reason, text));
			logs.push({ t: 'unban', s: staff.id, r: reason, m: user.id, d: encodeT() });
			await user.send(await moderationDmEmbed(text.txt, { text, reason, member: user, tellWho, staff, guild, banMessage, dmInvite }));
		},
		tempban: async ({ member, reason, channel, staff, logs, text, dmInvite, guild, dmAll, banMessage, duration, until, tellWho }) => {
			//member = Member|id
			let banMember = await guild.members.ban(member, { reason }), // Any: Member|User|Id
				tempIndex = DataBase.temp.push({ g: guild.id, m: member.id, type: 'ban', until: +until }) - 1;
			if (duration * 1000 <= 2147483647) setTimeout(() => //var timeoutIndex =
				guild.members.unban(member.id, 'Temporarily ban expired' + (reason ? ` - reason: ${reason}` : ''))
				.then(() => delete DataBase.temp[tempIndex]),
				duration * 1000);

			// if(user instanceof Discord.GuildMember)
			if (!(member instanceof Discord.GuildMember)) {
				if (typeof member == "string")
					member = await client.users.fetch(member)
					.then(user => ({ user, id: user.id }))
					.catch(e => ({ id: member, user: member, send: () => console.error('Banned member not found') }))
				if (member instanceof Discord.User)
					member = { user: member, id: member.id };
				member.send = member.send || member.user?.send;
			}
			// await member.ban({ reason });
			channel.send(moderationEmbed(text.txt, member, reason, text, duration, until));
			logs.push({ t: 'ban', s: staff.id, r: reason, m: member.id, d: encodeT(), dur: duration, unt: encodeT(until) }); //, timeoutIndex: () => timeoutIndex
			try {
				await member.send(await moderationDmEmbed(text.txt, { text, reason, member, tellWho, staff, guild, banMessage, dmInvite }, 'Banned until', until));
			} catch (e) { console.error(e.message) }
		},
		mute: async ({ member, reason, channel, staff, logs, muted, text, guild, dmAll, banMessage, tellWho, timeout }) => {
			// console.log({ timeout, fn: member.timeout });
			let dur = [];
			if (timeout) {
				await member.timeout(24192e5, reason); //28d
				dur[1] = Date.now() + 24192e5;
			} else
				await member.roles.add(muted, reason);

			channel.send(moderationEmbed(text.txt, member, reason, text, ...dur));
			logs.push({ t: 'mute', s: staff.id, r: reason, m: member.id, d: encodeT() });
			await member.send(await moderationDmEmbed(text.txt, { text, reason, member, tellWho, staff, guild, banMessage: dmAll && banMessage }));
		},
		unmute: async ({ member, reason, channel, staff, logs, muted, text, guild, dmAll, banMessage, tellWho, timeout }) => {
			if (timeout)
				await member.timeout(null, reason);
			else
				await member.roles.remove(muted, reason);

			channel.send(moderationEmbed(text.txt, member, reason, text));
			logs.push({ t: 'unmute', s: staff.id, r: reason, m: member.id, d: encodeT() });
			await member.send(await moderationDmEmbed(text.txt, { text, reason, member, tellWho, staff, guild, banMessage: dmAll && banMessage }));
		},
		tempmute: async ({ member, reason, channel, staff, logs, muted, text, guild, dmAll, banMessage, duration, until, tellWho, timeout }) => {
			let d = encodeT();
			if (timeout)
				await member.timeout(Math.min(duration * 1000, 24192e5), reason); //28d
			else {
				await member.roles.add(muted, reason);
				let tempIndex = DataBase.temp.push({ g: guild.id, m: member.id, type: 'mute', until: +until, role: muted, key: [staff.id, d, (reason || '*').replace(/\W/g, '').substr(0, 20)].join('-') }) - 1;
				if (duration * 1000 <= 2147483647) setTimeout(() => { //var timeoutIndex =
						member.roles.remove(muted, 'Temporarily mute expired' + (reason ? ` - Mute reason: ${reason}` : ''))
							.then(() => delete DataBase.temp[tempIndex]);
					},
					duration * 1000);
			}

			channel.send(moderationEmbed(text.txt, member, reason, text, duration, until));
			logs.push({ t: 'mute', s: staff.id, r: reason, m: member.id, d, dur: duration, unt: encodeT(until) }); //, timeoutIndex: () => timeoutIndex
			await member.send(await moderationDmEmbed(text.txt, { text, reason, member, tellWho, staff, guild, banMessage: dmAll && banMessage }, 'Muted until', until)).catch(console.log);
		}
	},
	// GetPopup = (obj, Preset) => { /*Preset: {<name>: {type: <attr>, value: <value>}}*/	let form = newDiv('form');	if (obj.displayPrefix) form.setAttribute('prefix', '');	if (obj.id) form.id = obj.id;	if (obj.title) {		let title = newDiv('h1');		title.innerHTML = obj.title;		form.append(title);	}	obj.fields.forEach(fieldObj => {		let field = newDiv(fieldObj.type || 'input', ...(fieldObj.classList || []));		if (fieldObj.name) field.name = fieldObj.name;		if (fieldObj.placeholder) field.placeholder = fieldObj.placeholder;		if (fieldObj.value) field.setAttribute('value', fieldObj.value);		if (fieldObj.innerHTML) field.innerHTML = fieldObj.innerHTML;		if (fieldObj.append) field.append(fieldObj.append);		if (fieldObj && fieldObj.attributes && fieldObj.attributes[0] && fieldObj.attributes[0][0])			fieldObj.attributes.forEach(attr => field.setAttribute(attr[0], attr[1] || ''));		if (Preset && fieldObj.name && Object.keys(Preset).includes(fieldObj.name)) {			let value = Preset[fieldObj.name];			field[value.type || 'value'] = value.value || value;			field.setAttribute(value.type || 'value', value.value || value);		}		form.append(field);	});	return form;},
	// Startcollector = {},
	AllMessages = channel => new Promise(async resolver => {
		try {
			let messages = [],
				temp;
			do {
				let last = messages.map(x => x).reverse()[0]?.id;
				temp = [...(await channel.messages.fetch({ before: last, limit: 100 }).catch(e => null))?.values()];
				if (temp) messages.push(...temp);
			} while (temp?.length == 100);
			resolver(messages)
		} catch (e) {
			console.error(e);
			resolver([])
		}
	}),

	TicketSetup = async guildID => {
			let DataBaseGuild = DataBase.guilds[guildID],
				Rule = DataBaseGuild.Tickets;
			try {
				var guild = await client.guilds.fetch(guildID),
					channel = await client.channels.fetch(Rule.channel);
			} catch { return }
			let reactMessage = Rule.existingMessage ? await channel.messages.fetch(Rule.existingMessage).catch(x => false) : false,
				// reactFilter = e => ({ filter: (r, u) => !u.bot && [...e].includes(r.emoji.name) }),
				reactMessageObj = {
					embeds: [{
						color: parseInt(Rule.color?.slice(1), 16) || 14396689,
						author: { name: Rule.author || 'Support' },
						description: Rule.content || 'By clicking 💬 you can open a private text channel with only you and the staff team,\nyou can do this to report an error or a person or if you just want to ask a question'
					}],
					components: [{
						components: [{ emoji: Rule.emoji || '💬', customId: 'ticket-start', type: 2, style: 1 }],
						type: 1
					}]
				};

			if (reactMessage) reactMessage.edit(reactMessageObj);
			else reactMessage = await channel.send(reactMessageObj).catch(e => console.log(e, 4927));
			DataBaseGuild.Tickets.existingMessage = reactMessage?.id;

			// Startcollector[guildID] = reactMessage.createReactionCollector(reactFilter(Rule.emoji)).on('collect', async (_, u) => {}); //💬

			WriteDataBase();
			// "enabled": true,"channel": "798590264511037450","staff": "825378302579048448","author": "tesst au2","content": "By clicking 💬 tesst3","emoji": "","color": "#5dac79","existingMessage": "827248807896809542"
		}, //TicketSetup

		Suggest = {
			//	Suggestions: { enabled: true, channels: { suggest: '83730873837', response: '83730873874' }, staff: '9476457896', index: 4, embed: { suggestion: 'Suggestion', reasonFrom: 'Reason from', approve: 'Approved', deny: 'Denied', consider: 'Considered', up: '⬆️', /*upvote*/ down: '⬇️', /*downvote*/ colors: { pending: CssColors.gray, approve: CssColors.green, deny: CssColors.red, consider: CssColors.yellow } }, suggestions: { 1: { user: '83730873837', /*member ID*/ suggestion: '', msg: '97697567046', /*msg ID*/ answer: { user: '97697567046', /*staffmember ID*/ reason: '', status: 'consider' / 'approve' / 'deny' } } } },
			suggest: (guild, member, suggestion) => new Promise(async (resolver, reject) => {
				try {
					if (!(guild && member && suggestion)) throw 1;
					let Rule = DataBase.guilds[guild.id].Suggestions,
						index = +Rule.index || 1,
						channel = await client.channels.fetch(Rule.channels.suggest)
					// .catch(e => null);	if (!channel) throw 2;

					suggestion = suggestion.substr(0, 4096);

					let msg = await channel.send({
						embeds: [{
							color: parseInt(Rule.embed.colors.pending, 16),
							author: {
								iconURL: member.displayAvatarURL(),
								name: member.tag
							},
							title: `${Rule.embed.suggestion} #${index}`,
							description: suggestion
						}]
					});

					msg.react(Rule.embed.up || '⬆️').then(() => msg.react(Rule.embed.down || '⬇️')
						.catch(console.error)).catch(console.error);

					Rule.suggestions = Rule.suggestions || {};
					Rule.suggestions[index] = {
						user: member.id,
						msg: msg.id,
						suggestion
					}

					Rule.index = ++index;

					resolver(msg);
					WriteDataBase();

				} catch (e) {
					reject(e);
				}
			}),
			respond: (guild, user, reason, index, responseType) => new Promise(async (resolver, reject) => {
				// console.log(11);
				//responseType == ['approve', 'deny', 'consider']
				try {
					if (!(guild && reason && +index && responseType)) throw 1;
					// console.log(12);
					let Rule = DataBase.guilds[guild.id].Suggestions,
						suggestion = Rule.suggestions[index],
						channel = await client.channels.fetch(Rule.channels.response).catch(() => false),
						member = await guild.members.fetch(suggestion.user).catch(() => false);

					if (!(channel && member)) return reject(536342);

					reason = reason.substr(0, 1024);

					// console.log(13);
					let [msg, suggestChannel] = await Promise.all([channel.send({
							embeds: [{
								color: parseInt(Rule.embed.colors[responseType], 16),
								author: {
									iconURL: member?.user.displayAvatarURL(),
									name: member?.user.tag || 'Unknown'
								},
								title: `${Rule.embed.suggestion} #${index} ${Rule.embed[responseType]}`,
								description: suggestion.suggestion,
								fields: [{
									name: `${Rule.embed.reasonFrom} ${user.tag}:`,
									value: reason,
								}]
							}]
						}).catch(e => null),
						client.channels.fetch(Rule.channels.suggest).catch(e => null)
					]), suggestionMsg = await suggestChannel.messages.fetch(suggestion.msg).catch(e => null);
					// suggestChannel = await client.channels.fetch(Rule.channels.suggest).catch(e => null),
					// suggestionMsg = await suggestChannel.messages.fetch(suggestion.msg).catch(e => null);
					// console.log(14);
					if (!(msg && suggestChannel && suggestionMsg)) throw 2;

					suggestChannel.messages.edit(suggestionMsg, {
						embeds: [{
							...suggestionMsg.embeds[0].toJSON(),
							color: parseInt(Rule.embed.colors[responseType], 16)
						}]
					}).catch(e => console.log(e.message));
					// console.log(15);
					suggestion.answer = {
						type: responseType,
						user: user.id,
						reason
					}

					resolver(msg);
					WriteDataBase();
					// console.log(16);
				} catch (e) {
					reject(e);
					console.log(17, e);
				}
			})
		},
		MutedPermissions = async role => {
			try {
				if (role && role instanceof Discord.Role) {
					let { guild } = role,
					DataBaseGuild = DataBase.guilds[guild.id],
						channels = [...guild.channels.cache.values()]
						.filter(c => //&&c.permissionsFor(role).bitfield    // ['GUILD_TEXT', 'GUILD_PRIVATE_THREAD', 'GUILD_PUBLIC_THREAD'].includes(c.type )
							c.type != 'GUILD_CATEGORY' &&
							c.permissionOverwrites &&
							!c.permissionOverwrites.cache.has(role.id)
							//  &&c.messages && !c.messages.fetch().then(messages => { console.log(messages); return messages.values().find(m => m.author.id == ClientID && m.components[0].components[0].customId == 'ticket-close') })
							/*&& !DataBaseGuild.Tickets.ticketsCreated.includes(c.id)*/
						);
					// console.log(channels.map(c => c.name));
					return Promise.all(channels.map(channel =>
						channel.isText() ?
						channel.permissionOverwrites.create(role, { SEND_MESSAGES: false }, 'Muted Role Setup') :
						channel.permissionOverwrites.create(role, { SPEAK: false }, 'Muted Role Setup')
						// channel.permissionOverwrites.create(role, { CONNECT: false }, 'Muted Role Setup')
					));
				}
			} catch (e) { console.log(e) }
		};
const ReactionFilters = {
		/*undef:all; 1:only bots; 2:not bots; 3:only embeds; 'u92635':only user; 'r92635':only role*/
		0: () => true,
		1: m => m.author.bot,
		2: m => !m.author.bot,
		3: m => !!m.embeds.length,
		4: (m, id) => m.author.id == id,
		5: (m, id) => m.member.roles.cache.has(id),
	},
	idleFunctionsQueue = [];
const TranscriptMsgsToHtml = (msgs, guild) => Promise.all(msgs.map(async ({ a, c, t, f }, i) => {
		// if (!i || i == msgs.length - 1) newFromto.push(decodeT(t));
		let div = newDiv('msg'),
			author = newDiv('div', 'user'),
			content = newDiv('div', 'content'),
			time = newDiv('div', 'time'),
			files = newDiv('div', 'files');

		div.append(author, content);
		time.innerHTML = decodeT(t, true);
		if (f) files.innerHTML = f.map(([n, u]) => `<a href="${u}">${n}</a>`).join('', div.append(files));

		div.append(time);

		let member = await guild.members.fetch(a).catch(e => null);
		if (member) {
			author.innerHTML = member.user.tag;
			author.setAttribute('nm', member.displayName);
			author.style.setProperty('--uclr', member.displayHexColor);
			author.style.setProperty('--avtr', `url(${member.user.displayAvatarURL()})`);
		} else {
			member = await client.users.fetch(a).catch(e => null);
			if (member) {
				author.innerHTML = member.tag;
				author.setAttribute('nm', member.username);
				author.style.setProperty('--uclr', '#72767d');
				author.style.setProperty('--avtr', `url(${member.displayAvatarURL()})`);
			} else {
				author.setAttribute('nm', 'Unknown');
				author.innerHTML = a;
			}
		}

		if (typeof c == 'string') content.innerHTML = decryptString(c)
		else if (c) {
			content.classList.add('embed');
			content.append(...['athr', 'ttl', 'desc', 'ftr'].map((x, i, o) => {
				if (c[x]) {
					let el = newDiv('div', ['author', 'title', 'content', 'footer'][i]);
					el.innerHTML = c[x];
					return el;
				}
			}).filter(x => x));
		}
		return div;
	})),
	addGuildIcon = (guild, document) => {
		if (guild.icon) {
			let icon = newDiv('icon', 'guildIcon');
			document.body.append(icon);
			icon.setAttribute('style', `background-image:radial-gradient(#0000, #34373c 70%),url(https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.webp?size=512)`);
		}
	},
	isAdmin = (permissions) => (new Discord.BitField(permissions)).has(8);
const defaultReasons = {
	words: 'Used a bad word',
	links: 'Sent a link',
	invites: 'Sent an invite',
	spam: 'Sent too many indentical messages',
	caps: 'Sent too many capital letters',
	// emojis: 'Sent too many emojis',
	mentions: 'Sent too many mentions',
	zalgo: 'Used zalgo',
};
const isTicket = channel =>
	c.topic?.startWith('Support Channel created by');
// c.messages.fetch().then(messages => !!messages.values().find(m => m.author.id == ClientID && m.components[0]?.components[0]?.customId == 'ticket-close'));

const Snowflake = {
	_alphabet: '0123456789!#$%&()*+,-./:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[]^_`abcdefghijklmnopqrstuvwxyz|{}~¡¢£¤¥¦§¨©«°±´µ¼½¾¿ÀÁÂÃÄÅÆÇÈÉÊËÌÍÎÏÐÑÒÓÔÕÖ×ØÙÚÛÜÝÞßàáâãäåæçèéêëìíîïðñòóôõö÷øùúûüýþÿĀƁƂƃƄƅƆƇƈƉƊƋƌƍƎƏƐƑƒƓƔƕƖƗƘƙƚƛƜƝƞƟƠơƢƣƤƥƦƧƨƩƪƫƬƭƮƯưƱƲƳƴƵƶƷƸƹƺƻƼƽƾƿǁǂǃǎǏǐǑǒǓǔǕǖǗǘǙǚǛǜǞǟǠǡǢǣǤǥǦǧǨǩǪǫǬǭǮǯǰǴǵǶǷǸǹǺǻǼǽǾǿȁȂȃȄȅȆȇȈȉȊȋȌȍȎȏȐȑȒȓȔȕȖȗșȚțȝȞȟȠȡȢȣȤȥȦȧȨȩȫȬȭȮȯȰȱȲȳȵȺȻȼȽȾȿɀɁɂɃɄɅɆɇɈɉɊɋɌɍɎɏḂḃḊḋḞḟṀṁṖṗṠṡṪṫẀẁẂẃẄẅẛỲỳ',
	encode: id => {
		if (!Snowflake.getState(id)) return id;
		id = BigInt(id);
		let hex = [];
		while (id != 0n) {
			let char = id % Snowflake.base;
			hex.push(char);
			id = (id - char) / Snowflake.base;
		}
		hex = hex.map(x => Snowflake._alphabet[x]).join('');
		hex = hex.padEnd(8, '0');
		return hex; //encoded: always 8 length
	},
	decode: encoded => {
		if (Snowflake.getState(encoded)) return encoded;
		return encoded.split('')
			.map((c, i) => BigInt(Snowflake._alphabet.indexOf(c)))
			.map((c, i) => c * Snowflake.base ** BigInt(i))
			.reduce((a, b) => a + b)
			.toString() //decoded: always 16-19 length
	},
	getState: (x, getFunc = false) => // isDecoded
		//decoded: always 16-19 length
		//encoded: always 8 length
		getFunc ? (x.length > 9 ? Snowflake.encode : Snowflake.decode) : (x.length > 9)

};
Snowflake.base = BigInt(Snowflake._alphabet.length);

console.timeEnd('Consts');

//end of Const
let MaybeGuild, SupportServer, idleTimer;
// Array.prototype.diff = function(a) {return this.filter(x => !a.includes(x)).concat(a.filter(x => !this.includes(x)));}
// Array.prototype.filterX = function () { return this.filter(Boolean) }
Object.defineProperty(Array.prototype, 'filterX', { get: function () { return this.filter(Boolean) } });
Object.prototype.command = function (cmd) {
	// this.commands = this.commands || {};
	return this.commands?.[cmd] || cmd
}
Object.prototype.isEmpty = function () {
	return !Object.keys(this).length || Object.values(this).every(x => x === undefined)
}

DataBase.loggedIn = DataBase.loggedIn || {};
// DataBase.loggedIn = {};
Object.entries(DataBase.loggedIn).forEach(([id, data]) => {
	const [{ expires }, guilds] = data,
	duration = expires - Date.now();
	console.log(id, CleanDate(duration / 1000, 'm'));
	// console.log(data[0]);
	if (duration <= 0) return delete DataBase.loggedIn[id]
	// else {
	Cache.set(id, data, duration);
	setTimeout(() => delete DataBase.loggedIn[id], duration);
	// if (DataBase.loggedIn[id]._check) delete DataBase.loggedIn[id]._check;

	data[1] = guilds.filter(x => x);

	// idleFunctionsQueue.push(
	// 	...guilds.filter(x => !x?.verified).map((g, i, o) => // copy at   .get('/oauth'
	// 		async () => {
	// 			if (isAdmin(g.permissions) && await client.guilds.fetch(g.id).catch(() => false))
	// 				g.verified = true
	// 			else delete guilds[guilds.findIndex(x => x && x.id == g.id)]
	// 		}));

	// }

})

app.response.error = async function (code, message) { // wont return response | not chainable
	const document = await baseDoc({
		css: 'error',
		htmlString: `<header><a href="/" class="logo"><div> <img src="/src/icon/logo" alt="KonkenBoten's Logo"></div></a></header><h1>${code}</h1><h2>${message}</h2>`,
		title: `KonkenBoten - ${code}: ${message}`
	});
	this.status(code).end(document.documentElement.outerHTML);
}

moment._ZoneLookup = { cs: 'CZ', da: 'DK', el: 'GR', hi: 'IN', ja: 'JP', ko: 'KP', uk: 'UA' };
moment.ZoneLookup = locale => moment.tz._countries[
	moment._ZoneLookup[locale] ?? locale.toUpperCase().replace(/^..-/, '')
]?.zones[0];

// Socket.io - socket


io.on('connection', async socket => {
	try {
		socket.discordID = socket.handshake.query.DID
		socket.discord = await client.users.fetch(socket.discordID).catch(e => null);
		socket.clientUrl = socket.handshake.headers.referer;
		socket.GuildID = socket.clientUrl.replace(/.+\/(\d{16,19})(?!\d).*/i, '$1');
		socket.Guild = await client.guilds.fetch(socket.GuildID).catch(e => null);
		socket.LoginId = socket.handshake.headers.cookie.replace(/^.*LoginId=([^;]+);?.*$/, '$1');
		socket.GuildData = DataBase.guilds[socket.GuildID];
		DataBase.guilds[socket.GuildID] = socket.GuildData || {};
		console.log('\x1b[34m%s\x1b[0m', 'connected: ' + socket.discord.tag);

		if (!(socket.discord && socket.Guild && socket.GuildData)) {
			console.error({
				discord: socket.discord,
				Guild: socket.Guild,
				GuildData: socket.GuildData
			}, 9256)
			return socket.disconnect();
		}

		socket.join(socket.GuildID)

		const sendLogLoad = (edit, type) =>
			// type: 1 == disconnect/connect
			socket.to(socket.GuildID).emit('logLoad', socket.discord.tag || socket.discordID, edit, type);

		sendLogLoad(true, 1)
		socket.on("disconnect", (reason) => sendLogLoad(false, 1));

		socket.on('NewGuildSubrcibe', (x, fun) => NewGuildSubrcibers.push([fun, socket.discord.id]));
		socket.on('GetPrefix', (x, fun) => fun(socket.GuildData?.prefix || DefaultPrefix, DefaultPrefix));
		socket.on('SetPrefix', (newPrefix, fun) => {
			if (/^\S$/i.test(newPrefix[0])) {
				socket.GuildData.prefix = newPrefix[0];
				fun(newPrefix[0]);
				WriteDataBase();
			} else fun(socket.GuildData.prefix || DefaultPrefix);
			sendLogLoad('Prefix set to ' + socket.GuildData.prefix);
		});
		socket.on('Logout', (x, fun) => {
			try {
				if (Cache.has(socket.LoginId)) Cache.del(socket.LoginId);
				fun(true)
			} catch (e) {
				console.error(e);
				fun(false)
			}
		});
		socket.on('Datalists', (data, fun) => {
			let datalistText = {},
				datalistRoles = {},
				datalistVoice = {};
			[...socket.Guild.channels.cache.values()].filter(c => c.isText()).forEach(channel =>
				datalistText[channel.id] = {
					name: channel.name,
					id: channel.id
				});
			[...socket.Guild.channels.cache.values()].filter(c => c.type == 'GUILD_VOICE').forEach(channel =>
				datalistVoice[channel.id] = {
					name: channel.name,
					id: channel.id
				});
			[...socket.Guild.roles.cache.values()].forEach(role => {
				datalistRoles[role.id] = {
					name: role.name,
					id: role.id
				};
				if (role.hexColor != '#000000') datalistRoles[role.id].color = role.hexColor;
			});
			fun({
				datalistText,
				datalistRoles,
				datalistVoice
			})
		});
		socket.on('EmojiList', async (data, fun) => {
			let guildEmojis = await socket.Guild.emojis.fetch().catch(() => undefined);
			if (guildEmojis?.size) guildEmojis = guildEmojis.filter(e => e.url && e.name).map(e => [
				e.name,
				e.id,
				e.animated ? 'a' : ''
				// e: e.identifier, // name:id
				// url: e.url, // https://cdn.discordapp.com/emojis/${id}.png
			].join()).join(';');
			else guildEmojis = undefined;
			if (!guildEmojis) guildEmojis = undefined;
			fun([EmojiList, guildEmojis]);
		});
		socket.on('ToggleTickets', (data, fun) => {
			if (!socket.GuildData.Tickets) socket.GuildData.Tickets = {};
			socket.GuildData.Tickets.enabled = !socket.GuildData.Tickets.enabled ? 1 : undefined;
			// if (!socket.GuildData.Tickets.enabled && Startcollector[socket.GuildID]) {if (Startcollector[socket.GuildID]) Startcollector[socket.GuildID].message.delete();delete Startcollector[socket.GuildID];}
			fun(socket.GuildData.Tickets.enabled);
			sendLogLoad('Support Channels ' + (socket.GuildData.Tickets.enabled ? 'enabled' : 'disabled'));
			if (socket.GuildData.Tickets.isEmpty()) socket.GuildData.Tickets = undefined;
			WriteDataBase();
		});
		socket.on('TicketSettings', (data, fun) => {
			// console.log(data);
			if (!socket.GuildData.Tickets) socket.GuildData.Tickets = {};

			data.save = ['always', undefined, 'never'][+data.save]

			socket.GuildData.Tickets = {
				...socket.GuildData.Tickets,
				...data
			};

			data = socket.GuildData.Tickets
			const { messages } = data;
			if (messages.start?.content == `Welcome to ${socket.Guild.name}'s Support\nOnly you and the Support Team can see, read and write in this channel` || !messages.start?.content || messages.start?.content == "undefined")
				messages.start.content = undefined;
			if (messages.start?.footer == `Press ❌ to close this support channel` || !messages.start?.footer || messages.start?.footer == "undefined")
				messages.start.footer = undefined;

			if (messages.end == `**Are you sure you want to close this support channel?**\nYes, I want to close: ✔️\nNo, I want to continue: ❌` || messages.end == `**Are you sure you want to close this support channel?**\nYes, I want to close: ✅\nNo, I want to continue: ❎` || !messages.end || messages.end == "undefined")
				messages.end = undefined;
			if (messages.save == `**The member can no longer see this channel and the channel is about to close**\nDon't save the transcript: ❌\nSave the transcript: ✔️` || messages.save == `**The member can no longer see this channel**\nClose this channel permanently: ❎\Save this channel's transcript: 💾` || !messages.save || messages.save == "undefined")
				messages.save = undefined;

			if (data.content == 'By clicking 💬 you can open a private text channel with only you and the staff team,\nyou can do this to report an error or a person or if you just want to ask a question' || !data.content || data.content == "undefined")
				data.content = undefined;
			if (data.author == 'Support' || !data.author || data.author == "undefined")
				data.author = undefined;
			if (data.emoji == '💬' || !data.emoji || data.emoji == "undefined" || data.emoji == "u")
				data.emoji = undefined;

			if (!messages.start?.footer && !messages.start?.content)
				messages.start = undefined;
			if (!messages.start && !messages.end && !messages.save)
				data.messages = undefined;

			if (data.author) data.author = data.author.substr(0, 256);
			if (data.name) data.name = data.name.substr(0, 100);
			if (data.content) data.content = data.content.substr(0, 6000 - (data.author?.length || 0));
			if (data.emoji) data.emoji = [...data.emoji][0];
			data.unlisted = data.unlisted ? 1 : undefined;
			data.claim = data.claim ? 1 : undefined;


			fun(data);

			// if (Startcollector[socket.GuildID]) {if (socket.GuildData.Tickets.channel == Startcollector[socket.GuildID].message.channel.id) Startcollector[socket.GuildID]?.stop()else Startcollector[socket.GuildID].message.delete();delete Startcollector[socket.GuildID];}
			TicketSetup(socket.GuildID);
			sendLogLoad('Support Channel settings set');
			if (socket.GuildData.Tickets.isEmpty()) socket.GuildData.Tickets = undefined;
			WriteDataBase();
		});
		socket.on('ToggleLogRule', (rule, fun) => {
			if (!socket.GuildData.logs) socket.GuildData.logs = {};
			if (!socket.GuildData.logs.enabled) socket.GuildData.logs.enabled = [];

			let enabled = socket.GuildData.logs.enabled,
				checked = !enabled.includes(rule)

			if (checked) enabled.push(rule)
			else delete enabled[enabled.indexOf(rule)];

			socket.GuildData.logs.enabled = enabled.filter(Boolean);
			if (!socket.GuildData.logs.enabled.length) socket.GuildData.logs.enabled = undefined;

			fun(enabled.includes(rule));
			sendLogLoad(rule + (checked ? ' enabled' : ' disabled'));
			if (socket.GuildData.logs.isEmpty()) socket.GuildData.logs = undefined;
			WriteDataBase();
			// 						{logs: {
			// 								color: '#ffffff',		channel: 'ChannelID', 	on: true
			// 								enabled: ['guildMemberAdd', 'inviteDelete', 'messageDelete'],
			// 							}}
		});
		// socket.on('SetLogColor', (data, fun) => {
		// 	try {
		// 		if (!socket.GuildData.logs) socket.GuildData.logs = {};
		// 		socket.GuildData.logs.color = data;
		// 		fun();
		// 		WriteDataBase();
		// 	} catch (e) {
		// 		fun(e)
		// 	}
		// });
		socket.on('SetLogChannel', (data, fun) => {
			if (!socket.GuildData.logs) socket.GuildData.logs = {};
			socket.GuildData.logs.channel = data;
			fun();
			sendLogLoad('Log Channel set to ' + data)
			if (socket.GuildData.logs.isEmpty()) socket.GuildData.logs = undefined;
			WriteDataBase();
		});
		socket.on('ToggleLog', (x, fun) => {
			if (!socket.GuildData.logs) socket.GuildData.logs = {};
			socket.GuildData.logs.on = !socket.GuildData.logs.on;
			fun(socket.GuildData.logs.on);
			sendLogLoad('Logging ' + (socket.GuildData.logs.on ? 'enabled' : 'disabled'));
			if (socket.GuildData.logs.isEmpty()) socket.GuildData.logs = undefined;
			WriteDataBase();
		});
		socket.on('ToggleAuditLog', (x, fun) => {
			if (!socket.GuildData.logs) socket.GuildData.logs = {};
			socket.GuildData.logs.audit = !socket.GuildData.logs.audit;

			fun(socket.GuildData.logs.audit);
			sendLogLoad('Audit Logs ' + (socket.GuildData.logs.audit ? 'enabled' : 'disabled'))
			if (socket.GuildData.logs.isEmpty()) socket.GuildData.logs = undefined;
			WriteDataBase();
		});
		socket.on('SetCommand', (data, fun) => {
			if (!socket.GuildData.commands) socket.GuildData.commands = {};
			if (commands.map(c => c.com).includes(data.ori)) {
				socket.GuildData.commands[data.ori] = data.new.substr(0, 50);

				fun(socket.GuildData.commands[data.ori]);
				sendLogLoad(socket.GuildData.prefix + data.ori + ' command set to ' + socket.GuildData.prefix + data.new)
				if (socket.GuildData.commands.isEmpty()) socket.GuildData.commands = undefined;
				WriteDataBase();
			} else throw 'Invalid Command'
		});
		socket.on('Command', ([key, data], fun) => { //Custom text command
			try {
				if (!socket.GuildData.TextCommandRules) socket.GuildData.TextCommandRules = [];
				let Rules = socket.GuildData.TextCommandRules;

				let functions = {
					get: command => fun(Rules.find(r => r.command == command)),
					set: ([command, data]) => {
						let rule = Rules.map((x, i) => [x, i]).find(x => x[0].command == command),
							index = rule == null ? Rules.length : rule[1];
						rule = rule == null ? [] : rule[0];

						Rules[index] = {
							...rule,
							...data
						}
						// console.log({ data });
						sendLogLoad('Custom Command set: ' + socket.GuildData.prefix + command)
						fun(true);
					},
					remove: (command) => {
						let len = Rules.length;
						socket.GuildData.TextCommandRules = Rules = Rules.filter(x => x.command != command);
						let removed = len - Rules.length;
						fun(removed > 0);
						sendLogLoad('Custom Command deleted: ' + socket.GuildData.prefix + command)
					},
					toggle: (command) => {
						let rule = Rules.map((x, i) => [x, i]).find(x => x[0].command == command);
						if (rule) Rules[rule[1]].disabled = !Rules[rule[1]].disabled;
						fun(!Rules[rule[1]].disabled);
						sendLogLoad('Custom Command ' + (Rules[rule[1]].disabled ? 'disabled: ' : 'enabled: ') + socket.GuildData.prefix + command)
					}
				};
				// console.log({ key, data });
				functions[key](data);
				if (!socket.GuildData.TextCommandRules.length) socket.GuildData.TextCommandRules = undefined;

				WriteDataBase();
			} catch (e) {
				fun(null, e)
			}
		});
		socket.on('Voice', ([key, data], fun) => { //Custom text command
			try {
				if (!socket.GuildData.VoiceRules) socket.GuildData.VoiceRules = [];
				let Rules = socket.GuildData.VoiceRules;
				//npm i simple-duration

				let functions = {
					get: channelID => fun(Rules.find(r => r.channel == channelID)),
					set: ([channelID, data]) => {
						let rule = Rules.map((x, i) => [x, i]).find(x => x[0].channel == channelID),
							index = rule == null ? Rules.length : rule[1];
						rule = rule == null ? [] : rule[0];

						Rules[index] = {
							...rule,
							...data
						}
						fun(true);
						sendLogLoad('Voice Channel set: #' + data.channelname)
					},
					remove: (channelID) => {
						let len = Rules.length;
						socket.GuildData.VoiceRules = Rules = Rules.filter(x => x.channel != channelID);
						let removed = len - Rules.length;
						// console.log({ removed });
						fun(removed > 0);
						sendLogLoad('Voice Channel deleted: #' + data.channelname)
					},
					toggle: (channelID) => {
						let rule = Rules.map((x, i) => [x, i]).find(x => x[0].channel == channelID);
						if (rule) Rules[rule[1]].disabled = !Rules[rule[1]].disabled;
						fun(!Rules[rule[1]].disabled);
						sendLogLoad('Voice Channel ' + (Rules[rule[1]].disabled ? 'disabled: #' : 'enabled: #') + data.channelname)
					}
				};
				// console.log({ key, data });
				functions[key](data);
				if (!socket.GuildData.VoiceRules.length) socket.GuildData.VoiceRules = undefined;
				WriteDataBase();
			} catch (e) {
				fun(null, e)
			}
		});
		socket.on('Suggestions', ([key, data], fun) => {
			let err = e => fun(null, e);
			// socket.emit('Suggestions', ['toggle', arg], res => {
			// console.log([key, data]);
			try {
				if (!socket.GuildData.Suggestions) socket.GuildData.Suggestions = {};
				let Suggestions = socket.GuildData.Suggestions;

				let functions = {
					toggle: () => {
						Suggestions.enabled = !Suggestions.enabled;
						sendLogLoad('Suggestions ' + (Suggestions.enabled ? 'enabled' : 'disabled'))
						fun(Suggestions.enabled)
					},
					edit: obj => {
						if (!obj) err('Undefined argument');
						[
							[obj.channels, 'suggest', 19],
							[obj.channels, 'response', 19],
							[obj, 'staff', 19],
							[obj.embed, 'suggestion', 40],
							[obj.embed, 'reasonFrom', 40],
							[obj.embed, 'approve', 40],
							[obj.embed, 'deny', 40],
							[obj.embed, 'consider', 40],
							[obj.embed.colors, 'pending', 6, 1],
							[obj.embed.colors, 'approve', 6, 1],
							[obj.embed.colors, 'deny', 6, 1],
							[obj.embed.colors, 'consider', 6, 1]
						].forEach(([o, k, n, s = 0]) => o[k] = o[k].substr(s, n) || undefined);

						socket.GuildData.Suggestions = {
							...Suggestions,
							...obj
						};
						fun();
						sendLogLoad('Suggestions settings set')
					},
					getSuggestions: async () => {
						try {
							if (Suggestions.suggestions) {
								let suggestions = newDiv('suggestions'),
									sorter = newDiv('select', 'sorter');
								suggestions.append(...await Promise.all(Object.entries(Suggestions.suggestions).map(([index, suggestion], i) => new Promise(async resolver => {
									let div = newDiv('suggestion'),
										author = newDiv('div', 'author'),
										content = newDiv('div', 'content'),
										member = await socket.Guild.members.fetch(suggestion.user).catch(e => null);
									div.append(author, content); //newDiv('div', 'reply')
									if (member) {
										author.innerHTML = member.user.tag;
										author.setAttribute('nm', member.displayName);
										author.style.setProperty('--uclr', member.displayHexColor);
										author.style.setProperty('--avtr', `url(${member.user.displayAvatarURL()})`);
									} else {
										member = await client.users.fetch(suggestion.user).catch(e => null);
										if (member) {
											author.innerHTML = member.tag;
											author.setAttribute('nm', member.username);
											author.style.setProperty('--uclr', '#72767d');
											author.style.setProperty('--avtr', `url(${member.displayAvatarURL()})`);
										} else {
											author.setAttribute('nm', 'Unknown');
											author.innerHTML = suggestion.user;
										}
									}

									content.innerHTML = suggestion.suggestion.replace(/\n/g, '<br>');

									if (suggestion.answer) {
										let answer = newDiv('div', 'answer'),
											from = newDiv('div', 'from'),
											reason = newDiv('div', 'reason'),
											fromUser = await socket.Guild.members.fetch(suggestion.answer.user).catch(e => null);
										answer.append(from, reason);
										div.append(answer);

										if (fromUser) {
											from.innerHTML = fromUser.user.tag;
											from.setAttribute('nm', fromUser.displayName);
											from.style.setProperty('--uclr', fromUser.displayHexColor);
											from.style.setProperty('--avtr', `url(${fromUser.user.displayAvatarURL()})`);
										} else {
											fromUser = await client.users.fetch(suggestion.answer.user).catch(e => null);
											if (fromUser) {
												from.innerHTML = fromUser.tag;
												from.setAttribute('nm', fromUser.username);
												from.style.setProperty('--uclr', '#72767d');
											} else {
												from.setAttribute('nm', 'Unknown');
												from.innerHTML = suggestion.user;
											}
										}

										reason.innerHTML = suggestion.answer.reason.replace(/\n/g, '<br>');

										div.style.setProperty('--clr', `#${Suggestions.embed.colors[suggestion.answer.type]}`);
										div.setAttribute('status', suggestion.answer.type);
									}

									div.setAttribute('idx', index);
									resolver(div);
								}))));

								sorter.append(...['Index', 'Status', 'Member'].map((x, i) => {
									let option = newDiv('option');
									option.innerHTML = x;
									option.value = i;
									return option
								}));

								fun(sorter.outerHTML + suggestions.outerHTML);
							} else fun(false);
						} catch (e) {
							console.error(e);
							fun(null, e)
						}
					},
					respond: async ([reason, index, responseType]) => {
						responseType = ['approve', 'consider', 'deny'][responseType];
						reason = reason.substr(0, 1024);
						let member = await socket.Guild.members.fetch(socket.discordID);
						if (reason && +index && responseType)
							Suggest.respond(socket.Guild, socket.discord, reason, +index, responseType)
							.catch(e => fun(null, e))
							.then(() => fun({
								reason,
								index,
								responseType,
								name: member.displayName,
								hex: member.displayHexColor,
								tag: member.user.tag,
								avtr: member.user.displayAvatarURL(),
								clr: `#${Suggestions.embed.colors[responseType]}`
							}))
						else fun(null, 'Invalid Arguments');
					}
				};

				functions[key](data);
				WriteDataBase();
			} catch (e) {
				fun(null, e)
			}
		});
		socket.on('Transcripts', ([key, data], fun) => { //Custom text command
			try {
				let err = e => fun(null, e);
				if (!socket.GuildData.Tickets) socket.GuildData.Tickets = {};
				// if (!socket.GuildData.Tickets.transcripts) socket.GuildData.Tickets.transcripts = [];
				let Transcripts = socket.GuildData.Tickets.transcripts;
				// return fun(socket.GuildData);
				let functions = {
					getAll: async () => {
						// console.log(Transcripts);
						if (!(isArray(Transcripts) && Transcripts[0])) err('No transcripts found')
						else {
							socket.GuildData.Tickets.transcripts = Transcripts.filter(x => x);
							let guild = socket.Guild,
								resultsDiv = newDiv(),
								transcriptsDiv = newDiv('transcripts'),
								transcriptsTitle = newDiv('h2');
							transcriptsTitle.innerHTML = 'Saved Transcripts';

							resultsDiv.append(transcriptsTitle, transcriptsDiv);
							transcriptsDiv.append(...await Promise.all(Transcripts.map(async ({ id, channelName, closedBy, msgs, closeAt, fromto }, i) => {
								let Transcript = Transcripts[i],
									div = newDiv('transcript'),
									name = newDiv('div', 'name'),
									timeDiv = newDiv('div', 'time'),
									closed = newDiv('div', 'closed'),
									// createdDiv = newDiv('div', 'created'),
									[from, to, expires] = [newDiv('span'), newDiv('span'), newDiv('span')];

								timeDiv.append(from, to, expires);

								div.id = id
								// else Transcript.id = Date.now() - 16e11;

								name.innerHTML = channelName || 'Unknown';
								expires.innerHTML = `<i>Expires:</i><i>${moment(decodeT(closeAt)).fromNow()}</i>`;
								try {
									if (!fromto || !fromto[1]) Transcript.fromto = fromto = msgs.filter((x, i) => !i || ++i == msgs.length).map(({ t }) => t);
									fromto = fromto.map(n => n ? decodeT(n, true) : 0);
									if (fromto[0].slice(0, -8) == fromto[1].slice(0, -8)) fromto[1] = fromto[1].slice(8);

									if (fromto[0]) from.innerHTML = `<i>Created:</i><i>${fromto[0]}</i>`;
									if (fromto[1]) to.innerHTML = `<i>Closed:</i><i>${fromto[1]}</i>`;
								} catch { console.error('fromto Error'); }

								// closedBy = await client.users.fetch(closedBy).catch(e => null);
								// if (closedBy) closed.innerHTML = `Support Channel closed by ${closedBy.tag}`

								div.append(name, timeDiv, ...await TranscriptMsgsToHtml(msgs, guild) /*,closedBy*/ );

								// if (fromto) fromto = fromto.map(n => decodeT(n));
								// timeDiv.innerHTML += (fromto || newFromto).map(d => d ? d.toLocaleString('sv').slice(5, -3) : 'Unknown')
								// .map((x, i, o) => (i && x.slice(0, -6) == o[0].slice(0, -6)) ? x.slice(6) : x)
								// 	.map(x => `<span>${x}</span>`).join('');
								return div;
							})));
							fun(resultsDiv.innerHTML)
						}
					}
					// ,extend: async id => {
					// 	if (!Transcripts || !Transcripts[0]) err('No transcipts found')
					// 	else if (!id) err('No id provided')
					// 	else {
					// 		let Transcript = Transcripts.find(t => t.id == id);
					// 		if (!Transcripts) err('Transcipt not found')
					// 		else {
					// 			Transcript.closeAt = encodeT(Date.now() + 6048e5);
					// 			fun(true);
					// 		}
					// 	}
					// }
				};
				// console.log({ key, data });
				functions[key](data);
				WriteDataBase();
			} catch (e) {
				fun(null, e)
			}
		});
		socket.on('Moderation', ([key, data], fun) => {
			try {
				const err = e => fun(null, e),
					{ GuildData, Guild } = socket;
				if (!GuildData.Moderation) GuildData.Moderation = {};
				const { Moderation } = GuildData;

				// if (!socket.GuildData.Tickets.transcripts) socket.GuildData.Tickets.transcripts = [];
				// let Moderation = socket.GuildData.Moderation;
				// return fun(socket.GuildData);
				let functions = {
					set: async data => {
						if (GuildData.Moderation.muted && data.timeout) {
							Guild.roles.delete(GuildData.Moderation.muted, 'Muted Role removed when timeout was enabled')
							GuildData.Moderation.muted = undefined;
						}

						GuildData.Moderation = {
							...Moderation,
							...data
						};
						data = GuildData.Moderation;
						[
							['hasBeen', 'has been'],
							['by', 'by'],
							['reason', 'Reason:'],
							['color', 'dbad11'],
							['duration', 'Duration:'],
							['messageFrom', `Message from ${socket.Guild?.name}:`],
							['until', 'until']
						].forEach(([key, value]) => {
							/* if text default: delete*/
							if (data.text[key] == value) data.text[key] = undefined;
							else data.text[key] = data.text[key].trim()
						});
						[
							['warn', 'warned'],
							['kick', 'kicked'],
							['ban', 'banned'],
							['unban', 'unbanned'],
							['tempban', 'temporarily banned'],
							['mute', 'muted'],
							['unmute', 'unmuted'],
							['tempmute', 'temporarily muted']
						].forEach(([key, value]) => {
							/* if coms default: delete*/
							// data.coms[key] = data.coms[key] || {};
							if (data.coms[key].txt == value) data.coms[key].txt = undefined;
							else data.coms[key].txt = data.coms[key].txt.trim();
							if (!+data.coms[key].role) data.coms[key].role = undefined;
							if (!Object.values(data.coms[key]).filter(x => x).length) data.coms[key] = undefined;
						});
						['enabled', 'dmInvite', 'dmAll', 'tellWho', 'logsEnabled', 'banMessage', 'timeout'].forEach(key => {
							data[key] = data[key] ? 1 : undefined; /* if falsy: delete*/
						});

						fun(true);
						sendLogLoad('Moderation settings set');
					},
					getAll: async ([page = 0, filterIndex = 0, filterId]) => {
						if (!Moderation?.logs) return err('No logs found');
						// console.log([page, ['all', 'member', 'staff'][filterIndex], filterId]);
						// console.log(Transcripts);
						// 										 [all, member, staff]

						const filterFunction = [
								[],
								[filterId],
								[null, filterId]
							][filterIndex],

							pageLength = 10,
							guild = socket.Guild,
							unsliced = ParseModLogs(Moderation.logs, guild, ...filterFunction),
							logs = unsliced.slice(pageLength * page, pageLength * (page + 1));
						// lastPage = unsliced.length == logs.length;
						// console.log(logs.length);
						const cacheLable = ['modlogs', guild.id, page, filterIndex, filterId, unsliced.length].map(x => x || '-').join('-');
						// console.log(cacheLable);

						if (!(isArray(logs) && logs[0])) err('No logs found')
						else if (Cache.has(cacheLable))
							fun(Cache.get(cacheLable))
						else {
							let resultsDiv = newDiv(),
								modlogsDiv = newDiv('modlogs');
							// modlogsTitle = newDiv('h2')
							// modlogsTitle.innerHTML = 'Moderations Logs';

							// resultsDiv.append( modlogsDiv);//modlogsTitle,

							// ({
							// 		t: 'ban',
							// 		m: '390107369146810380',
							// 		d: Date,
							// 		r: 'hejdå grabben',
							// 		dur: sec,
							// 		unt: Date,
							// 		staff: () => guild.members.cache.get(id) || guild.members.fetch(id).catch(e => null),
							// 		member: () => guild.members.cache.get(log.m) || guild.members.fetch(log.m).catch(e => null)
							// 	})
							let members = logs.map(x => [x.staffId, x.m]).flat()
							members = [...new Set(members)];
							// console.log(members);
							console.time('fetch members');
							// await Promise.all(members.map(id => guild.members.fetch(id).catch(() => null)))
							await guild.members.fetch({ user: members }).catch(() => null)
							console.timeEnd('fetch members');

							modlogsDiv.append(...await Promise.all(logs.map(async ({ t: type, d: date, r: reason, dur: duration, /*unt: until,*/ staff, member, staffId, m }, i) => {
								// console.time(i);
								let div = newDiv('modlog', type),
									typeDiv = newDiv('div', 'type'),
									dateDiv = newDiv('div', 'date'),
									reasonDiv = newDiv('div', 'reason'),
									durationDiv = newDiv('div', 'duration'),
									staffDiv = newDiv('div', 'staff'),
									memberDiv = newDiv('div', 'member');

								div.append(
									typeDiv,
									dateDiv,
									durationDiv,
									memberDiv,
									staffDiv,
									reasonDiv
								);

								if (duration) {
									typeDiv.innerHTML = 'temp' + type;
									durationDiv.innerHTML = CleanDate(duration);
								} else durationDiv.remove();

								div.id = [staffId, encodeT(date), (reason || '*').replace(/\W/g, '').substr(0, 20)].join('-');
								typeDiv.innerHTML = type;
								dateDiv.innerHTML = moment(date).format('DD/MM - HH:mm');
								if (reason) reasonDiv.innerHTML = reason.replace(/\n/g, '<br>')
								else reasonDiv.setAttribute('unspecified', '');

								[staff, member] = await Promise.all([staff(), member()]);

								// if (member?.user?.tag)
								// if (member instanceof Discord.GuildMember) console.log('member')
								// else console.log([member]);

								if (staff instanceof Discord.GuildMember) {
									staffDiv.innerHTML = staff.user.tag;
									staffDiv.setAttribute('nm', staff.displayName);
									staffDiv.style.setProperty('--uclr', staff.displayHexColor);
									staffDiv.style.setProperty('--avtr', `url(${staff.user.displayAvatarURL()})`);
								} else if (staff instanceof Discord.User) {
									staffDiv.innerHTML = staff.tag;
									staffDiv.setAttribute('nm', staff.username);
									staffDiv.style.setProperty('--avtr', `url(${staff.displayAvatarURL()})`);
								} else staffDiv.innerHTML = staffId;

								if (member instanceof Discord.GuildMember) {
									memberDiv.innerHTML = member.user.tag;
									memberDiv.setAttribute('nm', member.displayName);
									memberDiv.style.setProperty('--uclr', member.displayHexColor);
									memberDiv.style.setProperty('--avtr', `url(${member.user.displayAvatarURL()})`);
								} else if (member instanceof Discord.User) {
									memberDiv.innerHTML = member.tag;
									memberDiv.setAttribute('nm', member.username);
									memberDiv.style.setProperty('--avtr', `url(${user.displayAvatarURL()})`);
								} else memberDiv.innerHTML = m

								// console.timeEnd(i);
								return div;
							})));
							// fun(resultsDiv.innerHTML)
							fun(modlogsDiv.innerHTML)
							Cache.set(cacheLable, modlogsDiv.innerHTML, 10800) //3h
						}
					},
					remove: async id => {
						let [staffId, date, reason] = id.split('-');
						console.log([staffId, date, reason]);
						// Moderation.logs[staffId] = Moderation.logs[staffId].filter(log => log.d != date);
						let beforeLength = Moderation.logs[staffId].length,
							index = Moderation.logs[staffId].findIndex(log =>
								log.d == date &&
								(log.r || '*').replace(/\W/g, '').substr(0, 20) == reason
							),
							rule = Moderation.logs[staffId][index];

						// if(rule.timeoutIndex&&rule.timeoutIndex() )clearTimeout(rule.timeoutIndex());

						Moderation.logs[staffId] = Moderation.logs[staffId].filter((x, i) => i != index);

						console.log('Removed Modlogs:', beforeLength, Moderation.logs[staffId].length);

						fun(true);
						sendLogLoad('Moderation log removed');
					}
				};
				// console.log({ key, data });
				functions[key](data);
				WriteDataBase();
			} catch (e) {
				fun(null, e)
			}
		});

		socket.on('Reactions', ([key, data], fun) => {
			// socket.GuildData.Reactions = {};
			try {
				if (!socket.GuildData.Reactions || isArray(socket.GuildData.Reactions))
					socket.GuildData.Reactions = {};
				let Rules = socket.GuildData.Reactions;

				let functions = {
					set: ([oldChannelId, data]) => {
						// console.log([oldChannelId, data.c]);
						// oldChannelId = oldChannelId || data.c;

						let dataC = data.c;
						data.c = undefined;

						if (oldChannelId && oldChannelId != dataC) Rules[oldChannelId] = undefined;

						// if (oldChannelId)var rule = Rules.map((x, i) => [x, i]).find(x => x[0].c == oldChannelId),index = rule ? rule[1] : Rules.length;else index = Rules.length;

						if (data.f == '0') data.f = undefined;

						// console.log([oldChannelId, data]);
						if (data.e)
							Rules[dataC] = data;
						else Rules[dataC] = undefined;
						fun(true);
						sendLogLoad('Auto Reaction set: ' + dataC)
					},
					remove: channelId => {
						// socket.GuildData.Reactions = Rules.filter(x => x.c != channelId);
						console.log([channelId], 8234);
						Rules[channelId] = undefined;
						fun(true);
						sendLogLoad('Auto Reaction removed: ' + channelId)
					}
				};
				// console.log({ key, data });
				functions[key](data);
				// console.log(Rules);
				WriteDataBase();
			} catch (e) {
				fun(null, e)
			}
		});
		socket.on('Automod', ([key, data], fun) => {
			// socket.GuildData.Reactions = {};
			try {
				if (!socket.GuildData.Moderation)
					socket.GuildData.Moderation = {};
				if (!socket.GuildData.Moderation.automod)
					socket.GuildData.Moderation.automod = {};
				const Rules = socket.GuildData.Moderation.automod;


				let functions = {
					set: data => {

						['words', 'links', 'invites', 'spam', 'caps', 'mentions', 'zalgo'].forEach(key => {
							const rule = data[key];

							if (!rule) return Rules[key] = undefined;

							if (!+rule.pnsh) rule.pnsh = undefined;
							if (!rule.rsn || rule.rsn == defaultReasons[key]) rule.rsn = undefined;
							else rule.rsn = rule.rsn.trim();

							if (rule.ignRls[0]) rule.ignRls = rule.ignRls.map(Snowflake.encode)
							else rule.ignRls = undefined;

							if (rule.ignChn[0]) rule.ignChn = rule.ignChn.map(Snowflake.encode)
							else rule.ignChn = undefined;

							[ // default values
								['spam', 'num', 4],
								['caps', 'num', 70],
								['mentions', 'num', 4]
							].forEach(([ruleKey, prop, def]) => {
								if (key != ruleKey) return;
								if (rule[prop] == def) rule[prop] = undefined;
							});

							[ // boolean values
								['links', 'ignMsg']
							].forEach(([ruleKey, prop]) => {
								if (key == ruleKey)
									rule[prop] = rule[prop] ? 1 : undefined;
							});

							if (key == 'links' && rule.ignDom.filterX[0])
								rule.ignDom = rule.ignDom.filterX.map(u => isValidUrl('https://' + u.replace(/(^\w+:|^)\/\//, ''))?.replace(/(^\w+:|^)\/\//, ''));

							[ // multiple values
								['words', 'words'],
								['links', 'ignDom']
							].forEach(([ruleKey, prop]) => {
								if (key != ruleKey) return;
								if (isArray(rule[prop]) && rule[prop][0]) rule[prop] = rule[prop].filterX.map(s => s.toLowerCase())
								else rule[prop] = undefined;
							});

							Rules[key] = rule;
						});
						if (Object.values(Rules).every(x => !x)) socket.GuildData.Moderation.automod = undefined;

						fun(data);
						sendLogLoad('Auto Moderation settings set');
					}
				};
				// console.log({ key, data });
				functions[key](data);
				// console.log(Rules);
				WriteDataBase();
			} catch (e) {
				fun(null, e)
			}
		});


	} catch (e) {
		console.error(e);
		console.log({ discordID: socket.discordID, discord: socket.discord, clientUrl: socket.clientUrl, GuildID: socket.GuildID, Guild: socket.Guild, LoginId: socket.LoginId });
	}
});

DataBase.guilds['785416126033035264'].premium = 1; //arcombe
DataBase.guilds['702933462209790013'].premium = 1; //mello
DataBase.guilds['703665426747621467'].premium = 1; //test

// Object.keys(DataBase.guilds).forEach(id => {});

if (!DataBase.temp) DataBase.temp = [];
if (!DataBase.voiceCreated) DataBase.voiceCreated = [];
DataBase.temp = DataBase.temp.filter(x => x);

// Discord - client.on
// const modTimoutsTracker = {};
client.on('ready', async () => {
	console.timeEnd('Login');
	// console.log({ intents: client.options.intents });
	server.listen(port, () => console.log(`listening on ${port} and logged in as ${client.user.username}!`));
	// console.log(DataBase);

	console.log(client.guilds.cache.filter(g => g.available).size, 'available of', client.guilds.cache.size, 'Guilds before fetch');
	await client.guilds.fetch( /*{ force: true }*/ );
	console.log(client.guilds.cache.filter(g => g.available).size, 'available of', client.guilds.cache.size, 'Guilds after fetch');
	setTimeout(() => {
		// Promise.all(client.guilds.cache.map(g => g.available || client.guilds.fetch(g.id)))
		client.guilds.fetch({ force: true })
			.then(g =>
				console.log(client.guilds.cache.filter(g => g.available).size, 'available of', client.guilds.cache.size, 'Guilds after fetch 2', g.filter(g => g !== true).map(g => g.available)))
	}, 10e3);


	DataBase.temp.forEach(async (temp, i) => {
		// let duration = new Date(temp.until) - Date.now(),
		let duration = temp.until - Date.now(),
			guild = await client.guilds.fetch(temp.g);

		console.log(temp.type, CleanDate(duration / 1e3, 'm'));

		if (duration > 2147483647) return;
		duration = Math.max(duration, 0);

		// { g: guild.id, m: member.id, type: 'mute', until: +until, role: muted,key }
		// { t: 'mute', s: staff.id, r: reason, m: member.id, d: encodeT(), dur: duration, unt: encodeT(until), timeoutIndex: () => timeoutIndex }


		let reason = `Temporarily ${temp.type} expired`,

			fun = temp.type == 'mute' ?
			() => guild.members.fetch(temp.m).then(m => m.roles.remove(temp.role, reason)) :
			() => guild.members.unban(temp.m, reason),

			prom = x => x
			.then(() => delete DataBase.temp[i])
			.catch(e =>
				setTimeout(
					() => fun().finally(() => delete DataBase.temp[i]),
					108e5));

		// modTimoutsTracker[temp.key || 'a'] =
		setTimeout(() => prom(fun()), duration)


		// if (temp.type == 'mute') {const member = await guild.members.fetch(temp.m).catch(e => setTimeout(		() => guild.members.fetch(temp.m)		.then(m => m.roles.remove(temp.role, 'Temporarily mute expired'))		.finally(() => delete DataBase.temp[i]), 108e5) /*3h*/	&& false);if (!member) return;const unmute = () => member.roles.remove(temp.role, 'Temporarily mute expired');if (duration > 0)	duration < 2147483647 && setTimeout(unmute, duration)	else unmute()} else if (temp.type == 'ban') {	const unban = () => guild.members.unban(temp.m, 'Temporarily ban expired').catch(e =>setTimeout(	() => guild.members.unban(temp.m, 'Temporarily ban expired')	.finally(() => delete DataBase.temp[i]), 108e5) /*3h*/);	if (duration > 0)		duration < 2147483647 && setTimeout(unban, duration)	else unban()}delete DataBase.temp[i];
	});

	// setTimeout(() => console.log(modTimoutsTracker), 4e3);

	[...client.guilds.cache.values()].forEach(async guild => {
		let { id } = guild;
		if (!DataBase.guilds[id]) DataBase.guilds[id] = {};
		let DataBaseGuild = DataBase.guilds[id];
		// if (DataBase.guilds[id].Moderation?.logs) DataBase.guilds[id].Moderation.logs = undefined;
		if (DataBaseGuild.muted) {
			var role = await guild.roles.fetch(DataBase.guilds[id].muted).catch(e => false);
			if (role) MutedPermissions(role);
		}

		// if (DataBaseGuild.Reactions) {
		// 	Object.keys(DataBaseGuild.Reactions).forEach(id => {
		// 		if (typeof DataBaseGuild.Reactions[id].e == 'string') {
		// 			DataBaseGuild.Reactions[id].e = [...DataBaseGuild.Reactions[id].e]
		// 			console.log(DataBaseGuild.Reactions[id].e);
		// 		}
		// 	});
		// }


		// if (id == '873582580325302312') try {let Rule = DataBaseGuild.Suggestionsif (Rule?.suggestions && Rule.channels?.suggest && Rule.channels.response) {let channelSug = await client.channels.fetch(Rule.channels.suggest),messages = await AllMessages(channelSug);messages = messages.filter(m => m.author.id == client.user.id && m.embeds[0]).map(m => [m.embeds[0], m.id]).forEach(([{ author, title, description }, Mid]) => {try {let index = +title.match(/#(\d+)$/)[1];/*console.log([title, index, Rule.suggestions[index]]);*/if (Rule.suggestions[index] && Rule.suggestions[index]?.suggestion == description) return console.log('finns redan');let member = guild.members.cache.find(m => console.log(m.user.tag) || m.user.tag == author.name);if (!member) return console.log('ingen member', author.name);/*Rule.suggestions[index] = {*//*user: member.id,*//*msg: id,*//*suggestion: description*//*}*/console.log([guild.name, {user: member.id,msg: Mid,suggestion: description}]);} catch (e) { console.log('e3') }})}} catch (e) { console.log('e4') }

		// WriteDataBase();

		// let Tickets = DataBase.guilds[id].Tickets;if (Tickets?.transcipts) Tickets.transcipts = transcipts.map(transcript => {transcript.msgs = transcript.msgs.map(m => {if (typeof m.c == 'string') m.c = encryptString(m.c)return m;});return transcript;})
	});

	let checkExpiredTranscripts = guildId => {
		let transcripts = DataBase.guilds[guildId]?.Tickets?.transcripts;
		if (isArray(transcripts)) transcripts.forEach((transcript, i) => {
			if (!transcript) return delete transcripts[i];
			let { closeAt, channelName, fromto } = transcript;
			if (!(
					Math.min(+decodeT(closeAt), +decodeT(fromto[0]) + 2592e6) > //30d
					Date.now()
				)) { // if !keep
				delete transcripts[i];
				DataBase.guilds[guildId].Tickets.transcripts = transcripts.filter(x => x);
				console.log(`Deleted transcript: "${channelName}" in ${guildId}`);
			}
			// DataBase.guilds[guildId].Tickets.transcripts = transcripts.filter(x => x);
		});
	};
	[...client.guilds.cache.keys()].forEach(checkExpiredTranscripts);
	setInterval(() => [...client.guilds.cache.keys()].forEach(checkExpiredTranscripts), 216e5); //6h

	WriteDataBase();

	Object.entries(DataBase.guilds).filter(x => x[1]?.Tickets?.enabled)
		.forEach(([guildID, { Tickets }]) =>
			TicketSetup(guildID)

			// Tickets.ticketsCreated?.forEach(async (id, i) => {
			// 	let channel = await client.channels.fetch(id).catch(x => false);
			//
			// 	if (channel) {
			// 		let msg = (await AllMessages(channel)).reverse().find(m => m.author.id == ClientID);
			// 		if (msg) startMsgSetup(msg, guildID);
			// 	} else delete Tickets.ticketsCreated[i]
			//
			// 	Tickets.ticketsCreated = Tickets.ticketsCreated.filter(x => x)
			// })
		);

	SupportServer = await client.guilds.fetch('827687377224728629');

	let setInvites = () => {
		[...client.guilds.cache.values()].filter(g => g.vanityURLCode).forEach(guild =>
			guild.fetchVanityData().then(data => Invites[data.code] = {
				guild: guild.id,
				uses: data.uses
			}).catch(e => null));

		Promise.all([...client.guilds.cache.values()].map(g => g.invites && g.invites.fetch().catch(e => false)))
			.then(i => i.filter(x => x).map(i => [...i.values()]).flat().forEach((inv, i) =>
				Invites[inv.code] = {
					guild: inv.guild.id,
					inviter: i.inviter?.id,
					uses: inv.uses
				}))
	};
	// setInvites();
	setTimeout(setInvites, 6e4); //1min
	setInterval(setInvites, 72e5); //2h
	setInterval(TopggSend, 864e5); //24h


	// client.users.fetch('417331788436733953').then(async konk => {
	// 	let dm = await konk.createDM(),
	// 		msgs = await dm.messages.fetch({ after: '904334126029631499', limit: 100 });
	// 	msgs = msgs.filter(m => m.author.id == '813803575264018433');
	// 	msgs = msgs.map(m => m.delete());
	// 	await Promise.all(msgs);
	// 	console.log('done');
	// })

	// DennaErrorÄrMedveten[':)']

	// console.log(DataBase.guilds['785416126033035264'].Moderation.logs['212334413760036864'].pop());  // Tar bort senaste infraction som cobz gett i Arcombe
	// console.log(
	// 	SupportServer.emojis.cache,
	// 	SupportServer.emojis.cache.toJSON()
	// );


	// await client.application.commands.set([{
	// 		name: 'approve',
	// 		description: 'Approve a Suggestion',
	// 		options: [{ type: 'INTEGER', name: 'index', description: 'The index of the suggestion', minValue: 1, maxValue: 13, required: true }, { type: 'STRING', name: 'reason', description: 'Why you approve this suggestion', required: true }]
	// 	}, {
	// 		name: 'clear',
	// 		description: 'Clear messages',
	// 		options: [{ type: 'INTEGER', name: 'amount', description: 'The amount of messages', minValue: 1, maxValue: 499, required: false }]
	// 	}, {
	// 		name: 'tempmute',
	// 		description: 'Temporarily mute a member',
	// 		options: [{ type: 'USER', name: 'member', description: 'The memebr to mute', required: true }, { type: 'STRING', name: 'duration', description: 'The duration', required: true }, { type: 'STRING', name: 'reason', description: 'Why you mute', required: false }]
	// 	}
	//
	// 	, {
	// 		type: 'USER',
	// 		name: 'Tempban!'
	// 	}, {
	// 		type: 'MESSAGE',
	// 		name: 'echo'
	// 	}
	// ], '703665426747621467');

});

client.on("guildCreate", async guild => {
	console.log('\x1b[33m%s\x1b[0m', `Added to ${guild.name}`);

	// if ((ownRole = guild.me?.roles.highest).editable) ownRole.setColor('#dbad11').catch();
	// console.log(ownRole);

	// DataBase.guilds[guild.id] = Object.fromEntries(Object.entries(guild).filter(x => ['id', 'name', 'icon', 'joinedTimestamp'].includes(x[0]) && x[1] != null))
	DataBase.guilds[guild.id] = {};
	NewGuildSubrcibers.forEach(async ([fun, id], i) => {
		const member = await guild.members.fetch(id).catch(e => null);
		if (member && member.permissions.has(8n)) {
			fun(guild.id);
			delete NewGuildSubrcibers[i];
		}
	});

	guild.fetchAuditLogs({ type: 28, limit: 1 }).then(({ entries }) =>
		entries.first().executor.send({
			embeds: [{
				title: `Thank you for adding **KonkenBoten** to ${guild.name}`,
				color: 14396689,
				thumbnail: { url: "https://bot.konkenbonken.se/src/icon/logo" },
				description: `**Go ahead and customize and set the bot up at *[bot.konkenbonken.se](https://bot.konkenbonken.se/Guild/${guild.id})***\n\nJoin our official [Discord Server](https://discord.gg/bMesu8z7n9)! There, you will find the bot's changelog and status updates and you will be able to ask questions and give suggestions to future updates.\n*See you there!*`
			}]
		})).catch(() => null);

	TopggSend();
});
client.on("guildDelete", async guild => {
	if (!client.isReady()) return;
	console.log('\x1b[33m%s\x1b[0m', `Removed from ${guild.name}`);
	delete DataBase.guilds[guild.id];
});
client.on("channelCreate", ({ guild }) =>
	guild && guild.roles.fetch(
		DataBase.guilds[guild.id]?.Moderation?.muted
	).then(MutedPermissions)
);

// client.on('message', async m => {
client.on('messageCreate', async m => { //Not Prefixed
	if (m.channel.type == 'DM') {
		if (!m.author.bot) console.log(`DM recived:\nFrom ${m.author.tag}(${m.author.id})\n${m.cleanContent}`);
		return;
	}

	if (!m.guild || !m.member /*|| m.author.bot*/ ) return;

	const GuildData = DataBase.guilds[m.guild.id] || {};

	if (Object.values(GuildData.Suggestions?.channels || {}).includes(m.channel.id) && m.author.id != ClientID && !m.member.roles.resolve(GuildData.Suggestions?.staff))
		return setTimeout(() => m.delete(), 10e3);

	let reaction = GuildData.Reactions && Object.keys(GuildData.Reactions || {}).find(x => x == m.channel.id);
	if (!reaction) return;
	reaction = GuildData.Reactions[reaction];
	if (!reaction) return;
	// console.log({ reaction });
	/*undef:all; 1:only bots; 2:not bots; 3:only embeds; 'u92635':only user; 'r92635':only role*/

	let filterIndex = +reaction.f,
		filterId;
	if (reaction.f?.length > 2) {
		filterId = reaction.f.substr(1)
		// console.log('id:', filterId);
		if (reaction.f.startsWith('u')) filterIndex = 4;
		else if (reaction.f.startsWith('r')) filterIndex = 5;
	}
	if (!filterIndex) filterIndex = 0;

	// console.log([filterIndex, filterId, ReactionFilters[filterIndex](m, filterId)]);
	if (!ReactionFilters[filterIndex](m, filterId)) return;
	let emojis = reaction.e;
	if (!emojis) return;
	// emojis = [...emojis]
	if (!emojis.length) return;

	emojis.map(e => m.react(e).catch(e => null));

	//Lägg Reactions sist

});
client.on('messageCreate', async m => { //Automod
	if (!m.guild || !m.member || m.author.bot) return;
	const GuildData = DataBase.guilds[m.guild.id];
	if (!GuildData?.Moderation?.automod) return;
	const { automod } = GuildData.Moderation,
		checkIgnore = obj => obj && (obj.ignChn?.map(Snowflake.decode).includes(m.channel.id) || obj.ignRls?.map(Snowflake.decode).some(id => m.member.roles.cache.has(id)));
	let { words, links, invites, spam, caps, mentions, zalgo } = automod, fault;

	if (checkIgnore(words)) words = false;
	if (checkIgnore(links)) links = false;
	if (checkIgnore(invites)) invites = false;
	if (checkIgnore(spam)) spam = false;
	if (checkIgnore(caps)) caps = false;
	if (checkIgnore(mentions)) mentions = false;
	if (checkIgnore(zalgo)) zalgo = false;

	if ((links || invites)) m.content.split(/\s/).some(word => {
		if (m.content.length <= 10 || !isValidUrl(word)) return false;
		if (word.startsWith('http://')) word = word.substr(6);
		else word = word.substr(7);

		const inviteStarts = ['discord.gg/', 'discord.com/invite/', 'discordapp.com/invite/'];

		if (invites && inviteStarts.some(url => word.startsWith(url)))
			return fault = 'invites';

		if (links && ![links.ignDom, (links.ignMsg && 'https://discord.com/channels/'), ...inviteStarts].flat().some(url => url && word.startsWith(url)))
			return fault = 'links';
	});
	if (fault);
	else if (words && m.content.split(/\s/).some(word => words.words?.includes(word.toLowerCase()))) fault = 'words';
	else if (caps && m.content.length > 4 && (m.content.match(/[A-ZÅÄÖ]/g)?.length / m.content.length * 100) >= (caps.num || 70)) fault = 'caps';
	// else if (mentions && m.mentions.users.size >= (mentions.num || 4)) fault = 'mentions';
	else if (mentions && m.content.match(/<@[&!]?(\d{17,19})>/g)?.length >= (mentions.num || 4)) fault = 'mentions';
	else if (zalgo && /%CC%/g.test(encodeURIComponent(m.content))) fault = 'zalgo';
	else if (spam && m.content && [...(await m.channel.messages.fetch({ limit: spam.num - 1 || 3, before: m.id })).values()].every(msg => msg.author.id == m.author.id && msg.content == m.content)) fault = 'spam';

	if (!fault) return;

	let reason = defaultReasons[fault];
	fault = automod[fault];
	reason = fault.rsn || reason

	if (fault.pnsh >= 2) { //if 2 || 3
		if (GuildData.Moderation.logsEnabled && !GuildData.Moderation.logs[ClientID]) GuildData.Moderation.logs[ClientID] = [];
		moderationCommands.warn({
			member: m.member,
			reason,
			channel: await client.channels.fetch(GuildData.Moderation.channel).catch(e => null),
			guild: m.guild,
			staff: m.guild.me,
			logs: GuildData.Moderation.logsEnabled ? GuildData.Moderation.logs[ClientID] : [],
			tellWho: true,
			text: {
				...ObjectMerge({ reason: 'Reason:', hasBeen: 'has been', by: 'by', duration: 'Duration:', messageFrom: `Message from ${m.guild.name}:`, until: 'until', color: 'dbad11' }, GuildData.Moderation.text || {}),
				...ObjectMerge(commands.find(c => c.com == 'warn') || {}, GuildData.Moderation.coms && GuildData.Moderation.coms['warn'] || {})
			}
		});
	};
	if (fault.pnsh % 2) //if 1 || 3
		m.delete();
	m.channel.send({
		embeds: [{
			color: 'dbad11', //CssColors.red
			description: reason
		}]
	});
});
client.on('messageCreate', async m => { //Prefixed
	if (!m.guild) return;
	// try {
	const GuildData = DataBase.guilds[m.guild.id] || {},

		error = () => { // error = (...emojis) => {	m.delete({ timeout: 1e4, reason: 'Invalid Command' });emojis.map(e => e && m.react(e));}
			setTimeout(() => m.delete(), 20e3);
			m.react('❌');
			console.trace('❌');
		};

	// if (!GuildData.Suggestions) GuildData.Suggestions = {};
	if (!(m.content.startsWith(GuildData.prefix || DefaultPrefix))) return;


	let textCommandList = GuildData.TextCommandRules?.map(x => x.command.toLowerCase()),
		command = m.content.split(' ')[0].substr(1).toLowerCase();
	if (textCommandList?.includes(command)) {
		// console.log(1);
		let rule = GuildData.TextCommandRules[textCommandList.indexOf(command)];
		if (!rule.disabled && (!rule.roles || !rule.roles[0] || [...m.member.roles.cache.keys()].some(id => rule.roles.includes(id)) || m.member.permissions.has(8n))) {

			let message = rule.content;
			if (rule.embed) message = {
				embeds: [{
					author: {
						name: rule.content.athr.nm,
						iconURL: rule.content.athr.img
					},
					title: rule.content.ttl,
					description: rule.content.desc,
					footer: {
						text: rule.content.ftr.nm,
						iconURL: rule.content.ftr.img
					},
					thumbnail: { url: rule.content.thmb },
					image: { url: rule.content.img },
					color: `#${rule.content.clr||'dbad11'}`
				}]
			};
			// if (rule.embed && rule.content.pings) message.content = rule.content.pings.map(id => `<@&${id}>`).join()
			// if (rule.embed && rule.content.ping) message.content = `<@&${rule.content.ping}>`;

			m.channel.send(message).catch(e => console.log('\n\n', e, message, '013487\n\n'))
			m.delete();
			return;
		}
	} //if textCommand
	else if (command == GuildData.command('echo') && m.member.permissions.has(8n)) {
		// console.log(2);
		let content = m.content.substr(2 + command.length);
		if (!content) return;
		if (content.length > 2000) {
			m.channel.send(content.substr(0, 2000));
			content = content.substr(2000)
		}
		m.channel.send(content);
		m.delete()
		return;
	} else if (GuildData?.Suggestions?.channels && Object.values(GuildData.Suggestions.channels).includes(m.channel.id)) {
		// console.log(3);
		let responseTypes = {
			approve: GuildData.command('approve'),
			deny: GuildData.command('deny'),
			consider: GuildData.command('consider')
		};
		// console.log({				m,				suggest: GuildData.command('suggest'),				command			});

		// console.log([command == GuildData.command('suggest'), [Object.values(responseTypes).includes(command), m.member.roles.cache.get(GuildData.Suggestions.staff), m.member.roles.cache.has(GuildData.Suggestions.staff)]]);
		// console.log([m.member.roles.cache]);
		try {
			if (command == GuildData.command('suggest'))
				Suggest.suggest(m.guild, m.author, m.content.substr(2 + command.length))
				.then(() => m.delete()).catch(error)

			else if (Object.values(responseTypes).includes(command) && m.member.roles.resolve(GuildData.Suggestions.staff))
				Suggest.respond(
					m.guild, m.author,
					m.content.match(/^.\S+\s+\d+\s+(.*)/)[1],
					m.content.match(/^.\S+\s+(\d+)/)[1],
					Object.fromEntries(Object.entries(responseTypes).map(x => x.reverse()))[command],
				).then(() => m.delete()).catch(error)
			else error();
		} catch { error() }
		return;
	}

	let modCommand = Object.keys(moderationCommands).find(c => command == GuildData.command(c));
	// modCommand -> Originalnamnet på kommandot
	if (modCommand) {
		if (m.author.bot) return error();

		if (!GuildData.Moderation) GuildData.Moderation = {};
		if (GuildData.Moderation.logsEnabled && !GuildData.Moderation.logs) GuildData.Moderation.logs = {};
		if (!GuildData.Moderation.coms) GuildData.Moderation.coms = {};

		let activeRole = GuildData.Moderation.coms[modCommand]?.role;
		if (!+activeRole) activeRole = GuildData.Moderation.staff;
		if (!(m.member.roles.cache.has(activeRole) || m.member.permissions.has(8n))) return; // !if has role OR admin
		const content = m.content.substr(2 + command.length);
		let [, memberID, reason] = content.match(/^\s*<@!?(\d{16,19})>\s*(.*)$/s) || content.match(/^\s*(\d{16,19})\s*(.*)$/s) || [];
		// console.log({ memberID, reason, content });
		if (!(memberID)) return error();
		if (GuildData.Moderation.logsEnabled && !GuildData.Moderation.logs[m.author.id]) GuildData.Moderation.logs[m.author.id] = [];

		const [member, channel, mutedRole] = await Promise.all([
			modCommand == 'unban' ? memberID : m.guild.members.fetch(memberID).catch(e => modCommand.includes('ban') ? memberID : error()),
			client.channels.fetch(GuildData.Moderation.channel),
			new Promise(async resolve => {
				if (!modCommand.includes('mute') || GuildData.Moderation.timeout) return resolve(false);

				let role = GuildData.Moderation.muted && await m.guild.roles.fetch(GuildData.Moderation.muted).catch(e => false)
				if (role) return resolve(role);

				role = await m.guild.roles.create({
					name: 'Muted',
					color: 7895160, // #787878
					position: m.guild.roles.botRoleFor(client.user).position,
					// position: m.guild.me.roles.highest.position, //- 1
					// permissions: 0n,
					// unicodeEmoji: '🔇',
					mentionable: false,
					reason: 'Muted Role created'
				}).catch(e => console.error(e, 2756));

				MutedPermissions(role);
				GuildData.Moderation.muted = role.id;

				return resolve(role);
			})
		]).catch(e => [
			console.error(e, 89684),
			error()
		]);

		if (!(member && channel)) return;

		// console.log([m.member.roles.highest.name, member.roles.highest.name], m.member.roles.highest.comparePositionTo(member.roles.highest), m.member.roles.highest.comparePositionTo(member.roles.highest) < 0, m.guild.ownerId == m.member.id);

		if (GuildData.Moderation.dmInvite && ['tempban', 'kick', 'unban'].includes(modCommand)) {
			let invites = await m.guild.invites.fetch().catch(e => null);
			var dmInvite =
				invites && [...invites.values()].find(i => i.inviter?.id == client.user.id && i.channel.id == channel.id) ||
				await channel.createInvite({ maxAge: 0, unique: true, reason: 'Created an Invite for inviting tempbanned or kicked members' }).catch(e => console.error('Cant create Invite:', e));
		}
		if (modCommand != 'unban' && m.guild.ownerId != m.member.id && (!member.roles || m.member.roles.highest.comparePositionTo(member.roles.highest) <= 0)) return error();
		if (modCommand.includes('mute') && m.guild.me.roles.highest.comparePositionTo(mutedRole) <= 0) return error();

		let durationString;
		if (modCommand.startsWith('temp')) try {
			[, durationString, reason] = (reason + ' ').match(/^\s*(\w+)\s+(.*)$/s);
			var duration = Duration(durationString),
				until = new Date(Date.now() + duration * 1000); // console.log({ duration });
		} catch (e) { console.error(e); return error() }
		const args = {
			member, //Member  if unban: id
			channel, //Channel
			reason: reason.trim().substr(0, 512) || undefined, //string
			guild: m.guild, //Guild
			staff: m.member, //Member
			logs: GuildData.Moderation.logsEnabled ? GuildData.Moderation.logs[m.author.id] : [], //array
			muted: GuildData.Moderation.muted, //id
			duration, //seconds
			until, //Date
			text: {
				...ObjectMerge({ reason: 'Reason:', hasBeen: 'has been', by: 'by', duration: 'Duration:', messageFrom: `Message from ${m.guild.name}:`, until: 'until', color: 'dbad11' }, GuildData.Moderation.text || {}),
				...ObjectMerge(commands.find(c => c.com == modCommand) || {},
					GuildData.Moderation.coms && GuildData.Moderation.coms[modCommand] || {})
			},
			dmInvite: dmInvite && dmInvite.toString(), //Invite
			dmAll: !!GuildData.Moderation.dmAll, //bool
			banMessage: GuildData.Moderation.banMessage, //string
			tellWho: !!GuildData.Moderation.tellWho, //bool
			timeout: !!GuildData.Moderation.timeout && !!m.member.timeout //bool
		};
		// console.log(args.text);
		// if (!(member && channel)) return error();
		await moderationCommands[modCommand](args).catch(e => e);
		// if (duration && m.guild.id == '785416126033035264') m.guild.channels.fetch('933099574866886706').then(c => c.send(`${member} borde un${modCommand.includes('ban')?'bannas':'mutas'} <t:${Math.floor(until/1e3)}:R>`))
		// if (duration && m.guild.id == '702933462209790013') m.guild.channels.fetch('933101963074232320').then(c => c.send(`${member} borde un${modCommand.includes('ban')?'bannas':'mutas'} <t:${Math.floor(until/1e3)}:R>`))
		m.delete();
		WriteDataBase();
		setTimeout(WriteDataBase, 4e3);
		// console.log(6.3);
		return;
	}

	// ({Moderation: {enabled: 0, /* 0=false; 1=true */channel: '8578', /*brottsregistret*/staff: '874647', /*staffroll*/text: { reason: 'Reason:', hasBeen: 'has been', by: 'by', duration: 'Duration:', messageFrom: `Message from ${m.guild.name}:`, until: 'until', color: 'dbad11' },dmInvite: 0,dmAll: 0, /*false = only dm banned/tempbanned*/banMessage: 'text', /*empty if disabled*/tellWho: 0,logsEnabled: 0,muted: '938733', /*mutedroll*/logs: {"03298450": /*staffID*/[{ type: 'ban', reason: '', staff: '5645', member: '873', expires: 'parseT', duration: 'seconds' }]},coms: {warn: { txt: 'warned', role: '8578' }, /*txt1: 'warn',*/kick: { txt: 'kicked', role: '8578' }, /*txt1: 'kick',*/ban: { txt: 'banned', role: '8578' }, /*txt1: 'ban',*/unban: { txt: 'unbanned', role: '8578' }, /*txt1: 'unban',*/tempban: { txt: 'temporarily banned', role: '8578' },/*txt1: 'temporarily ban',*/mute: { txt: 'muted', role: '8578' }, /*txt1: 'mute',*/unmute: { txt: 'unmuted' }, /*txt1: 'unmute',*/tempmute: { txt: 'temporarily muted', role: '8578' }, /*txt1: 'temporarily mute',*/}}})
	else if (command == GuildData.command('infractions')) {
		if (!(m.member.roles.cache.has(GuildData.Moderation?.staff) || m.member.permissions.has(8n))) return error();
		if (!GuildData.Moderation?.logs || !Object.keys(GuildData.Moderation.logs).length) {
			m.channel.send({
				embeds: [{
					color: parseInt(GuildData.Moderation?.text?.color || 'dbad11', 16),
					author: { name: `This server has no saved infractions`, iconURL: m.guild.iconURL() }
				}]
			})
			return m.delete();
		}

		let { guild, member: staff, channel } = m, { logs } = GuildData.Moderation,
			content = m.content.substr(2 + command.length),
			[, memberID] = content.match(/^\s*<@!?(\d{16,19})>$/s) || content.match(/^\s*(\d{16,19})$/s) || [],
			member = memberID && await guild.members.fetch(memberID).catch(e => client.users.fetch(memberID).catch(e => memberID));
		// console.log(member);
		if (!member) return error();
		//member = Member | User | id
		logs = ParseModLogs(logs, guild, member);
		let sliced = logs.slice(0, 10),
			user = member.user || member.tag && member, // User | undefined
			displayTag = user?.tag || member, // tag | id
			displayIcon = user && user.displayAvatarURL(),
			embed = {
				color: member.displayColor || parseInt(GuildData.Moderation.text?.color || 'dbad11', 16),
				author: { name: `${displayTag} has no infractions`, iconURL: displayIcon },
				footer: { text: `Requested by: ${m.author.tag} | ${m.author.id}`, iconURL: m.member.displayAvatarURL() }
			};

		if (sliced[0]) {
			embed.author.name = `${displayTag}'s' infractions`;
			// let fields = sliced.map(log => ({/*let action = log.dur ? 'temporarily ' : '';action += log.t;action = capital(action);if (log.dur) action += ' - ' + CleanDate(log.dur);*/name: capital(`${log.dur?'temporarily':''} ${log.t} ${log.dur?('- '+CleanDate(log.dur)):''}`),value: `${(log.r||'*No reason specified*').replace(/\n/g,' ')} - *${moment(log.d).fromNow()}*`.substr(0, 1024)})).map(log => `**${capital(log.name.trim())}:**\n⠀${log.value.trim()}`.trim()),
			let fieldsLength = 0,
				fields = sliced.map(log =>
					`**${capital(`${log.dur?'temporarily':''} ${log.t} ${log.dur?('- '+CleanDate(log.dur)):''}`.trim())}:**\n` +
					`⠀${(log.r||'*No reason specified*').replace(/\n/g,' ')} - *${moment(log.d).fromNow()}*`)
				.filter(log => (fieldsLength += log.length) <= 1024)

			let last24 = logs.findIndex(log => log.d < Date.now() - 864e5),
				last7 = logs.findIndex(log => log.d < Date.now() - 6048e5);
			if (last24 == -1) last24 = logs.length;
			if (last7 == -1) last7 = logs.length;
			let displayNum = Math.min(10, logs.length),
				displayLast = 10 > logs.length ? 'All' : 'Last';
			// fields[0].name = '**Last 5 infractions**\n' + fields[0].name
			embed.fields = [{
					name: 'Last 24 hours',
					value: `${last24} infractions`, //\n⠀
					inline: true
				}, {
					name: 'Last 7 days',
					value: `${last7} infractions`,
					inline: true
				}, {
					name: 'Total',
					value: `${logs.length} infractions`,
					inline: true
				},
				// ...fields
				{ name: `**${displayLast} ${displayNum} infractions**`, value: fields.join('\n') }
			];
		}
		// console.log(embed);
		channel.send({ embeds: [embed] })
		m.delete();
		// console.log(8);
	} // if $infractions
	else if (command == GuildData.command('slowmode')) {
		let sec = m.content.substr(2 + command.length);
		if (sec == 'off' || !sec || sec == 0) sec = 0;
		else if (!isNaN(+sec)) sec = +sec;
		else
			try {
				sec = Duration(sec);
				var durFormat = true;
			} catch (e) { return error(); }

		if (!m.channel.setRateLimitPerUser || !(m.member.roles.cache.has(GuildData.Moderation?.staff) || m.member.permissions.has(8n)))
			return error();

		if (sec == 0) var description = `Slowmode disabled`;
		else if (isNaN(sec) || sec > 21600) return error();
		else if (durFormat) var description = `Slowmode set to ${CleanDate(sec)}`
		else var description = `Slowmode set to ${sec} seconds`

		await m.channel.setRateLimitPerUser(sec, `${description} by ${m.author.tag}`)
		m.delete();
		m.channel.send({
			embeds: [{
				color: 'dbad11',
				description
			}]
		}).then(msg => setTimeout(() => msg.delete(), 5e3));

	} else if (command == GuildData.command('clear')) {
		let amt = +m.content.substr(2 + command.length)
		if (!amt || !m.channel.bulkDelete || !(m.member.roles.cache.has(GuildData.Moderation?.staff) || m.member.permissions.has(8n)))
			return error();

		amt++;
		amt = Math.min(amt, 500)
		let hundreds = [...Array(Math.floor(amt / 100)).fill(100), amt % 100].filter(x => x);
		// console.log(hundreds);

		let messages = [],
			before = (BigInt(m.id) + 1n).toString();
		for (const limit of hundreds) {
			let msgs = await m.channel.messages.fetch({ limit, before });
			before = msgs.lastKey();
			messages.push([...msgs.keys()]);
		}
		// console.log(messages.reduce((a, b) => a.length + b.length));
		let deleted = await Promise.all(messages.map(x => m.channel.bulkDelete(x, true)));
		// let deleted = await Promise.all(hundreds.map(x => m.channel.bulkDelete(x, true)));
		//// deleted = deleted.map(x => [...x.values()]).flat();

		deleted = deleted.map(x => x.size || 1).reduce((a, b) => a + b) - 1;

		// console.log(deleted);
		// m.delete();
		m.channel.send({
			embeds: [{
				color: 'dbad11',
				description: `Deleted ${deleted} messages`
			}]
		}).then(msg => setTimeout(() => msg.delete(), 5e3));


		client.emit('messageClear', deleted, m.channel, m.member)
	}

	//
	else if (command == GuildData.command('userinfo')) {
		const content = m.content.substr(2 + command.length),
			[, memberID] = content.match(/^\s*<@!?(\d{16,19})>$/s) || content.match(/^\s*(\d{16,19})$/s) || [],
			member = await m.guild.members.fetch(memberID).catch(() => false);
		// console.log(member);
		// console.log(!member, !member.user, !m.member.roles.cache.has(GuildData.Moderation?.staff), !m.member.permissions.has(8n));
		if (!member || !member.user || !(m.member.roles.cache.has(GuildData.Moderation?.staff) || m.member.permissions.has(8n)))
			return error();

		let fieldsLength = 0,
			embed = {
				footer: { text: `Requested by: ${m.author.tag} | ${m.author.id}`, iconURL: m.member.displayAvatarURL() },
				author: { name: `Info about ${member.displayName}` },
				color: member.displayColor || 'dbad11',
				thumbnail: { url: member.displayAvatarURL() },
				fields: [
						['Id:', member.id],
						['Username:', member.user.tag],
						['Bot:', member.user.bot ? 'Yes' : 'No'],
						['Boosted:', member.premiumSince ? 'Since ' + moment(member.premiumSince).format('D/M-YYYY - HH:mm') : 'No'],
						['Muted:', (GuildData.Moderation.timout ? member.isCommunicationDisabled() : member.roles.cache.has(GuildData.Moderation.muted)) ? 'Yes' : 'No'],
						['Permissions', member.permissions.bitfield], // Object.entries(member.permissions.serialize()).filter(([, v]) => v).map(([k]) => k)
						['Joined server at:', moment(member.joinedAt).format('D/M-YYYY - HH:mm')], // ['⠀', '⠀'],
						['Joined Discord at:', moment(member.user.createdAt).format('D/M-YYYY - HH:mm')],
						['Recent infractions:', ParseModLogs(GuildData.Moderation.logs, m.guild, member).slice(0, 3).map(log =>
							`**${capital(`${log.dur?'temporarily':''} ${log.t} ${log.dur?('- '+CleanDate(log.dur)):''}`.trim())}:**\n⠀${(log.r||'*No reason specified*').replace(/\n/g,' ')} - *${moment(log.d).fromNow()}*`).filter(log => (fieldsLength += log.length) <= 1024).join('\n') || undefined, true],
					]
					.filter(([, value]) => value != undefined /*&&value.toString()*/ )
					.map(([name, value, inline]) => ({ name, value: value.toString(), inline: !inline }))
				// .map(([name, value, inline]) =>
				// (value != undefined && value.toString()) ? { name: name + ':', value: value.toString(), inline: !inline } : { name: '⠀', value: '⠀', inline: !inline })
			};

		// m.delete();
		m.channel.send({
			embeds: [embed],
			components: [{
				components: [{ label: 'Parse Permissions', customId: 'userinfo-parse-permissions-' + memberID, type: 2, style: 1 }],
				type: 1
			}]
		});
		return m.delete()
	}
	if (command == GuildData.command('serverinfo')) {
		if (!(m.member.roles.cache.has(GuildData.Moderation?.staff) || m.member.permissions.has(8n)))
			return error();
		const { guild } = m,
		[channels, { threads }] = await Promise.all([guild.channels.fetch(), guild.channels.fetchActiveThreads()]);

		let embed = {
			footer: { text: `Requested by: ${m.author.tag} | ${m.author.id}`, iconURL: m.member.displayAvatarURL() },
			author: { name: `Info about ${guild.name}` },
			color: 'dbad11',
			thumbnail: { url: guild.iconURL() },
			image: { url: guild.discoverySplashURL({ size: 512 }) },
			fields: [
					['Id:', guild.id],
					['Owner:', `<@${guild.ownerId}>`],
					['Created at:', moment(guild.createdAt).format('D/M-YYYY - HH:mm')],

					['Members:', guild.memberCount],
					['Channels:', channels.size],
					['Roles:', guild.roles.cache.size],

					['Text Channels:', channels.filter(c => c.isText()).size],
					['Voice Channels:', channels.filter(c => c.isVoice()).size],
					['Thread Channels:', threads.size],

					['Boosts:', guild.premiumSubscriptionCount],
					['Description:', guild.description],
					['Total Infractions:', Object.values(GuildData.Moderation?.logs || {}).flat().length || undefined],
					// ['Ban count:', guild.bans.cache.size],

				]
				.filter(([, value]) => value != undefined /*&&value.toString()*/ )
				.map(([name, value, inline]) => ({ name, value: value.toString(), inline: !inline }))
			// .map(([name, value, inline]) =>
			// (value != undefined && value.toString()) ? { name: name + ':', value: value.toString(), inline: !inline } : { name: '⠀', value: '⠀', inline: !inline })
		};

		// m.delete();
		m.channel.send({
			embeds: [embed]
		});
		return m.delete()
	}
	if (command == GuildData.command('roleinfo')) {
		const content = m.content.substr(2 + command.length),
			[, roleID] = content.match(/^\s*<@&!?(\d{16,19})>$/s) || content.match(/^\s*(\d{16,19})$/s) || [],
			[role, cached] = await Promise.all([m.guild.roles.fetch(roleID).catch(() => false), m.guild.members.fetch()]);

		if (!role || !(m.member.roles.cache.has(GuildData.Moderation?.staff) || m.member.permissions.has(8n)))
			return error();

		// console.log(cached.filter(m => m.roles.cache.has(roleID)), role.members);
		// console.log(cached.filter(m => m.roles.cache.has(roleID)).size, role.members.size);
		let columns = Array(3).fill();
		if (role.members) {
			var members = role.members.map(m => m.toString());
			if (members.length <= 5)
				columns[0] = members.join(',\n')
			else
				columns = columns.map((x, i) => members.splice(0, i == 2 ? 7 : Math.round(Math.min(7, members.length / 3))).join(',\n'))
		}

		let embed = {
			footer: { text: `Requested by: ${m.author.tag} | ${m.author.id}`, iconURL: m.member.displayAvatarURL() },
			author: { name: `Info about ${role.name}` },
			color: role.color || 'dbad11',
			thumbnail: { url: role.iconURL() },
			fields: [
					['Id:', role.id],
					['Displayed separately:', role.hoist ? 'Yes' : 'No'],
					// ['Muted:', GuildData.Moderation.timout ? (GuildData.Moderation.muted ? 'Yes' : 'No') : undefined],
					['Created at:', moment(role.createdAt).format('D/M-YYYY - HH:mm')],
					['Members:', columns[0]],
					['⠀', columns[1]],
					['⠀', columns[2]],
				]
				.filter(([, value]) => value /*&&value.toString()*/ )
				.map(([name, value, inline]) => ({ name, value: value.toString(), inline: !inline }))
			// .map(([name, value, inline]) =>
			// (value != undefined && value.toString()) ? { name: name + ':', value: value.toString(), inline: !inline } : { name: '⠀', value: '⠀', inline: !inline })
		};

		// m.delete();
		m.channel.send({
			embeds: [embed],
			components: [{
				components: [{ label: 'Parse Permissions', customId: 'roleinfo-parse-permissions-' + roleID, type: 2, style: 1 }],
				type: 1
			}]
		});
		return m.delete()
	}


	// } // if prefix
	// } catch (e) {console.log(e.message, 3476);}
});
client.on('voiceStateUpdate', async (oldState, newState) => {
	let Created = DataBase.voiceCreated,
		guild = (newState || oldState).guild,
		GuildData = DataBase.guilds[guild.id],
		Rules = GuildData.VoiceRules;

	if (Rules) {
		let RulesIDs = Rules.map(r => r.channel),
			hasOld = oldState.channel && Created.includes(oldState.channelId),
			hasNew = RulesIDs.includes(newState.channelId);
		if (hasOld || hasNew) {

			if (hasOld) { // if Leave
				if (oldState.channel && !oldState.channel.members.size) {
					// delete Created[Created.indexOf(oldState.channelId)];
					DataBase.voiceCreated = Created.filter(x => x != oldState.channelId);
					oldState.channel.delete().catch(e => console.log('ERROR: oldState.channel.delete()', e.message))
					WriteDataBase()
				}
			}

			if (hasNew) { // if Join
				let Rule = Rules[RulesIDs.indexOf(newState.channelId)];
				if (Rule && !Rule.disabled) {
					let options = {
							type: 'GUILD_VOICE',
							parent: newState.channel.parent,
							permissionOverwrites: newState.channel.permissionOverwrites.cache
						},
						index = [...guild.channels.cache.values()].filter(c => Created.includes(c.id) && RegExp(Rule.channelname.replace('{i}', '\\d'), 'g').test(c.name)).length + 1;

					if (Rule.Userlimit) options.userLimit = Rule.Userlimit;
					let newChannel = await guild.channels.create(Rule.channelname.replace(/{i}/g, index), options);
					newState.setChannel(newChannel).catch(x => console.log('No user to move'))
						.then(x => {
							if (!newChannel?.members.size) {
								DataBase.voiceCreated = Created.filter(x => x != newChannel.channelId);
								newChannel.delete();
								WriteDataBase();
							}
						});
					// if (+Rule.perms) newChannel.permissionOverwrites.edit(guild.roles.everyone.id, FieldtoPerms(Rule.perms)).then(console.log);
					// console.log(+Rule.perms, FieldtoPerms(Rule.perms));
					DataBase.voiceCreated.push(newChannel.id);
					WriteDataBase();
				}
			}
		}
	}

	let [Old, New] = [oldState.channelId, newState.channelId];

	if (Old && !New) client.emit('voiceDisconnect', oldState)
	else if (!Old && New) client.emit('voiceConnect', newState)
	else if (Old && New && Old != New) client.emit('voiceMoved', oldState, newState)
	else if (oldState.serverMute != newState.serverMute) client.emit('voiceMute', newState);
	else if (oldState.serverDeaf != newState.serverDeaf) client.emit('voiceDeaf', newState);

});

// client.on('rateLimit', () => {
// 	clearTimeout(idleTimer);
// 	idleTimer = setTimeout(() => {
// 		if (idleFunctionsQueue.length) {
// 			console.log('idleFunctionsQueue:', idleFunctionsQueue.length);
// 			idleFunctionsQueue.splice(0, 50).forEach(fun => fun())
// 		}
// 		client.emit('rateLimit');
// 	}, 3e5) //5m
// })
// client.on('rateLimit', async data =>
// 	console.log(`RateLimit: ${data.method} - ${data.route}`));

const logQueue = {}, // {9235:[[clear,embed],[clear,embed]]}
	sendLogQueue = (guildId, logChannel) => { //logQueue[guildId] &&
		let embeds = logQueue[guildId].splice(0, 10);
		// embeds = [[clear, embed],[clear, embed]]
		embeds.forEach(([clear]) => clearTimeout(clear));
		embeds = embeds.map(([, embed]) => embed);
		logChannel.send({ embeds })
	};

Object.entries(LogRules).forEach(([Event, Rule]) =>
	client.on(Event, async (...a) => {
		if (a[0].author && a[0].author?.id == ClientID) return;
		let guild = a.find(x => x instanceof Discord.Guild) || a.find(x => x.guild)?.guild || a.find(x => x.message)?.message?.channel?.guild || (a[0].first && a[0].first()?.guild);
		if (!guild) {
			if (Event == 'userUpdate')[...client.guilds.cache.values()].filter(g => g.members.cache.has(a[0].id))
				.forEach(g => client.emit('userUpdate', ...a, g));
			else if (Event != 'messageCreate') console.error('Error - no Guild found', [`Event: ${Event}`, ...a]);
			return;
		}
		let timestamp = Date.now(),
			GuildData = DataBase.guilds[guild.id] || {},
			logRule = GuildData.logs;
		if (!logRule?.on || !logRule?.enabled?.includes(Event) || !logRule.channel) return;
		let [embed, logChannel] = await Promise.all([
			Rule.function(a, !!logRule.audit),
			client.channels.fetch(logRule.channel).catch(e => false)
		]);
		if (!embed || !logChannel) return;

		// console.log({ audit: embed.audit });

		if (embed.audit) {
			embed.audit = await embed.audit;
			if (embed.audit) embed.fields.push(
				['Executor:', embed.audit.executor],
				['Reason:', embed.audit.reason]
			) // else console.log(embed.audit, Event, guild.name, 23459);
		}

		embed.fields = embed.fields.filter(f => f[1] && f[1].toString().trim());

		embed.fields = embed.fields.filter(x => x).map(x => ({
			name: x[0], //? x[0].toString() : '*Unknown*', // null
			value: x[1].toString().substr(0, 1024), //	|| '*Unknown*'
			inline: !x[2]
		}));

		// embed.fields = 	embed.fields.map(f=>Object.fromEntries(Object.entries(f).filter(d=>d.value)));
		embed.author = { name: embed.author };
		if (embed.authorURL) embed.author.url = embed.authorURL;
		// embed.color = logRule.color || '#dbad11';
		embed.color = embed.color || (Rule.color ? `#${Rule.color}` : '#dbad11');
		embed.timestamp = timestamp;

		// try {
		// 	// let previous = await logChannel.messages.fetch({ limit: 2 }).catch(x => false)
		// 	let previous = [...logChannel.messages.cache.values()].slice(0, 3);
		// 	previous = previous.find(m => m.embeds[0] &&
		// 		m.embeds[0].author?.name == embed.author?.name &&
		// 		JSON.stringify(m.embeds[0].fields) == JSON.stringify(embed.fields));
		//
		// 	if (!previous) throw 0;
		// 	let foot = previous.embeds[0]?.footer?.text,
		// 		n = +(foot || '').replace('×', '') + 1;
		// 	if (!n || n <= 1) throw 0;
		// 	previous.edit({
		// 		embeds: [{
		// 			...embed,
		// 			footer: { text: `×${n}` }
		// 		}]
		// 	}).catch(e => console.log(e))
		// } catch (e) {
		// if (e) console.log('Handled:', e);

		if (!logQueue[guild.id]) logQueue[guild.id] = [];
		let time = logQueue[guild.id].length >= 9 ? 0 : 30e3;
		logQueue[guild.id].push([setTimeout(sendLogQueue, time, guild.id, logChannel), embed])

		// logChannel.send({ embeds: [embed] }).catch(e => console.log(e));
		// }
		// {logs: {
		// 		color: '#ffffff',
		// 		channel: 'ChannelID',
		// 		enabled: ['guildMemberAdd', 'inviteDelete', 'messageDelete'],
		// 		on: true
		// 		audit: false
		// 	}}


	}));

client.on('interactionCreate', async interaction => {
	const { customId, guild, channel, user, message /*,component*/ , member } = interaction;
	if (!(customId && guild && channel && message /*&&component*/ )) return;

	if (customId.startsWith('ticket')) {
		const DataBaseGuild = DataBase.guilds[guild.id],
			Rule = DataBaseGuild?.Tickets;
		if (!Rule) return;
		const embedTemplate = {
				color: parseInt(Rule.color?.slice(1), 16) || 14396689,
				author: { name: Rule.author }
			},
			staffRole = await guild.roles.fetch(Rule.staff).catch(e => null);
		if (!staffRole) return console.log('Error 897', guild.name);

		if (customId == 'ticket-start') {
			let channelname = Rule.name ? Rule.name.replace(RegExp('{u}', 'g'), user.username).substr(0, 100) : `support-${user.username}`;

			let timeZone = moment.ZoneLookup(guild.preferredLocale),
				dateString = moment().tz(timeZone).format('D/M-YYYY - HH:mm');

			let ticketChannel = await guild.channels.create(channelname, {
				topic: `Support Channel created by ${user.tag} - ${dateString}`,
				parent: +Rule.parent ? Rule.parent : null,
				permissionOverwrites: [{
					id: guild.roles.everyone,
					deny: 1024n,
					allow: 383040n
				}, {
					id: user,
					allow: 3072n
				}, {
					id: staffRole,
					allow: 3072n
				}]
			});

			// if (!Rule.ticketsCreated) Rule.ticketsCreated = [];
			// Rule.ticketsCreated.push(ticketChannel.id);
			client.emit('ticketStart', user, ticketChannel, guild);

			WriteDataBase()
			let components = [ // copy at ticket-claim
				{ emoji: '❌', customId: 'ticket-close', type: 2, style: 4 }
			];
			if (Rule.claim) components.push({ label: 'Claim', customId: 'ticket-claim', type: 2, style: 1 })
			ticketChannel.send({
				content: `<@&${Rule.staff}><@${user.id}>`,
				embeds: [{
					...embedTemplate,
					description: Rule.messages?.start?.content || `Welcome to ${guild.name}'s Support\nOnly you and <@&${Rule.staff}> can see, read and write in this channel`,
					footer: { text: Rule.messages?.start?.footer || `Press ❌ to close this support channel` },
				}],
				components: [{
					components,
					type: 1
				}]
			});
			interaction.reply({
				content: ticketChannel.toString(),
				ephemeral: true
			}); //.then(msg => setTimeout(() => msg && msg.delete(), 120e3));

		} // if ticket-start


		//$adduser etc.
		// startMsg.channel.createMessageCollector({ filter: m => m.content.startsWith(DataBaseGuild.prefix || DefaultPrefix) }).on('collect', m => {let command = m.content.substr(1),mentions = [...m.mentions.users.values()],pings = mentions.join(', ');if (command.startsWith(DataBaseGuild.command('adduser'))) {m.delete();mentions.forEach(user => m.channel.permissionOverwrites.edit(user, { VIEW_CHANNEL: true }));startMsg.channel.send({embeds: [{...embedTemplate,description: Rule.messages?.userAdded?.replace(/{p}/, pings) || `**${pings}** added to this Channel`}]});client.emit('ticketAddUser', pings, m.author, m.channel);} else if (command.startsWith(DataBaseGuild.command('removeuser'))) {m.delete();mentions.forEach(userId => m.channel.permissionOverwrites.edit(userId, {VIEW_CHANNEL: false}));startMsg.channel.send({embeds: [{...embedTemplate,description: DataBaseGuild.Tickets.messages?.userRemoved?.replace(/{p}/, pings) || `**${pings}** removed from this Channel`}]});client.emit('ticketRemoveUser', pings, m.author, m.channel);}});
		else if (customId == 'ticket-close') {
			// if (!data.timeout && channel.permissionOverwrites.cache.has(DataBaseGuild.Moderation.muted)) channel.permissionOverwrites.delete(DataBaseGuild.Moderation.muted)

			if (interaction.channel?.lastMessageId == message.id) {
				channel.delete(`Support Channel closed by: ${user.tag||'Unknown'}`);
				return client.emit('ticketEnd', channel, user, false);
			}

			let save;
			if (Rule.save == 'always') save = 'Yes';
			else if (Rule.save == 'never') save = 'No';
			else save = 'Ask'

			interaction.reply({
				ephemeral: false,
				embeds: [{
					...embedTemplate,
					description: Rule.messages?.end || `**Are you sure you want to close this support channel?**\nYes, I want to close: ✔️\nNo, I want to continue: ❌`
				}],
				components: [{
					components: [
						{ emoji: '✔️', customId: 'ticket-save' + save, type: 2, style: 3 },
						{ emoji: '❌', customId: 'ticket-closeCancel', type: 2, style: 4 }
					],
					type: 1
				}]
			})
		} //if ticket-close
		else if (customId == 'ticket-claim') {
			console.time('ticket-claim');
			if (!(member.roles.cache.has(Rule.staff) || member.permissions.has(8n))) return;

			console.log(1);

			let updatePromise = interaction.update({
				...message,
				nonce: undefined,
				components: [{
					components: [
						{ emoji: '❌', customId: 'ticket-close', type: 2, style: 4 }, // copy at ticket-start
						{ label: member.displayName, customId: 'ticket-unclaim-' + user.id, type: 2, style: 3 }
					],
					type: 1
				}]
			});
			console.log(2);

			// await Promise.all([
			channel.permissionOverwrites.create(Rule.staff, { SEND_MESSAGES: false, VIEW_CHANNEL: true });
			channel.permissionOverwrites.create(user, { SEND_MESSAGES: true })
			// ]);
			console.log(3);

			let [moderators] = await Promise.all([
				guild.roles.fetch(Rule.staff).catch(e => undefined),
				guild.members.fetch()
			])

			if (moderators) moderators = [...moderators.members.values()];
			if (moderators?.length) moderators = moderators.filter(member => !(member.permissions.has(8n) || member.id == user.id))
				.slice(0, 25).map(member => ({
					label: member.displayName,
					value: member.id,
					description: `${member.user.tag} | ${member.id}`
				}));
			console.log(4);

			await updatePromise;
			interaction.followUp({
				ephemeral: true,
				embeds: [{
					...embedTemplate,
					description: `**You have now claimed this support channel**\nOnly you and the member can write in this channel`
				}],
				components: moderators?.length ? [{
					components: [{
						type: 3,
						custom_id: "ticket-claim-add",
						options: moderators,
						placeholder: "Add a Moderator",
						min_values: 1,
						max_values: moderators.length
					}],
					type: 1
				}] : undefined
			})
			console.log(5);

			console.timeEnd('ticket-claim');


			client.emit('ticketClaim', channel, user);

		} //if ticket-claim
		else if (customId == 'ticket-claim-add') {

			interaction.values.map(id => channel.permissionOverwrites.create(id, { SEND_MESSAGES: true }));

			interaction.reply({
				ephemeral: false,
				embeds: [{
					...embedTemplate,
					description: `${user} have now added ${interaction.values.map(id=>`<@${id}>`).join(',')} to write in this channel`
				}]
			})

			client.emit('ticketClaimAdd', channel, user, interaction.values);

		} //if ticket-claim-add
		else if (customId.startsWith('ticket-unclaim')) {

			if (!(customId.substr(15) == user.id || member.permissions.has(8n))) return;

			channel.permissionOverwrites.create(Rule.staff, { SEND_MESSAGES: true, VIEW_CHANNEL: true });

			// await Promise.all([channel.permissionOverwrites.create(Rule.staff, { SEND_MESSAGES: true, VIEW_CHANNEL: true }),
			// 	channel.permissionOverwrites.delete(user)])

			interaction.update({
				...message,
				nonce: undefined,
				components: [{
					components: [ // copy at ticket-start
						{ emoji: '❌', customId: 'ticket-close', type: 2, style: 4 },
						{ label: 'Claim', customId: 'ticket-claim', type: 2, style: 1 }
					],
					type: 1
				}]
			});

			client.emit('ticketUnclaim', channel, user);
		} //if ticket-unclaim
		else if (customId == 'ticket-closeCancel') message.delete()

		else if (customId.startsWith('ticket-save')) {
			// ticket-saveYes | ticket-saveNo ticket-saveAsk

			message.delete();

			// if (!u) var u;


			if (customId.endsWith('Ask')) {
				await channel.permissionOverwrites.set([{
					id: guild.roles.everyone,
					deny: 1024n
				}, {
					id: Rule.staff,
					allow: 1024n
				}]);
				return interaction.reply({
					ephemeral: false,
					embeds: [{
						...embedTemplate,
						description: Rule.messages?.save || `**The member can no longer see this channel and the channel is about to close**\nDon't save the transcript: ❌\nSave the transcript: ✔️`
					}],
					components: [{
						components: [
							{ emoji: '✔️', customId: 'ticket-saveYes', type: 2, style: 3 },
							{ emoji: '❌', customId: 'ticket-saveNo', type: 2, style: 4 }
						],
						type: 1
					}]
				})
			} else if (customId.endsWith('Yes')) {
				Rule.transcripts = (Rule.transcripts || []).filter(x => x);
				// if (messages.some(m => !m.author.bot))
				var id = Date.now() - 16e11;
				Rule.transcripts.push({
					id,
					channelName: channel.name,
					closedBy: user.id,
					msgs: (await AllMessages(channel)).reverse().map(m => {
						if (m.author.id == ClientID) return;
						let c, f,
							t = encodeT(m.createdTimestamp),
							a = m.author.id,
							e = m.embeds[0];

						if (m.content)
							try {
								c = encryptString(m.cleanContent || m.content)
							} catch (e) {
								console.log(e);
								c = encryptString(m.content)
							}
						else if (e?.type == 'rich') c = {
							athr: e.author?.name || undefined,
							ttl: e.title || undefined,
							desc: e.description || undefined,
							ftr: e.footer?.text || undefined,
						}
						else if (!m.attachments.first()) return;

						if (m.attachments.first()) f = [...m.attachments.values()].map(a => [a.name, a.url]);
						return { a, c, t, f }
					}).filter(x => x),
					closeAt: encodeT(Date.now() + 2592e6), //30d
					fromto: [encodeT(channel.createdTimestamp), encodeT()]
				})
			};

			channel.delete(`Support Channel closed by: ${user.tag||'Unknown'}`);
			// Rule.ticketsCreated = Rule.ticketsCreated.filter(id => id != channel.id);

			// WriteDataBase();
			let url = customId.endsWith('Yes') && `https://bot.konkenbonken.se/Guild/${guild.id}/transcript/${id}`;
			client.emit('ticketEnd', channel, user, customId.endsWith('Yes'), url);

		} // if ticket-save

	} // if ticket
	else if (customId.startsWith('userinfo-parse-permissions-') || customId.startsWith('roleinfo-parse-permissions-')) {
		let id = customId.substr(27),
			object = await (customId.startsWith('user') ? guild.members : guild.roles).fetch(id).catch(() => false);

		if (!object) return;
		let perms = Object.entries(object.permissions.serialize()).filter(([, v]) => v).map(([k]) => capital(k.replace(/_/g, ' '))).sort(),
			columnLength = Math.ceil(perms.length / 3),
			columns = Array(3).fill();

		if (perms.length <= 5)
			columns[0] = perms.join(',\n')
		else
			columns = columns.map((x, i) => perms.splice(0, columnLength).join(',\n'));

		let embed = {
			footer: { text: `Requested by: ${user.tag} | ${user.id}` },
			author: { name: `Permissons for ${object.displayName||object.name}` },
			color: object.displayColor || object.color || 'dbad11',
			fields: [
					['Permissons:', columns[0]],
					['⠀', columns[1]],
					['⠀', columns[2]]
				].filter(([, value]) => value)
				.map(([name, value]) => ({ name, value: value.toString(), inline: true }))

		};
		// console.log([message.embeds[0], embed]);

		message.edit({
			embeds: [message.embeds[0], embed],
			components: []
		});

	} else console.log(interaction);


	// if (!customId) return;if (AwaitInteractionQueue[customId]) return AwaitInteractionQueue[customId](interaction);if (customId.startsWith('vote')) {console.log(customId);let [count, salt] = customId.substr(4).split(';');count = +count;count++;component.setCustomId(`vote${count};${salt}`).setLabel('' + count)}
}); // interactionCreate


client.on("guildScheduledEventCreate", console.log)

// Express - app

app.use(cookieParser());
app.use((req, res, next) => {
	if (req.hostname != 'bot.konkenbonken.se') {
		res.append('Link', `<https://bot.konkenbonken.se${req.path}>; rel="canonical"`)
			.redirect(301, 'https://bot.konkenbonken.se' + req.path);
		return;
	};
	try {
		let d = new Date(),
			ua = req.headers['user-agent'],
			google = /google/i.test(ua);
		// if (false) //true = log src
		// 	console.log(`\x1b[3${req.path.startsWith('/src/')?4:google?6:2}m%s\x1b[0m`, `${d.getHours()}:${d.getMinutes()} >> ${req.url} ${google?(ua.includes('compatible;')?ua.match(/compatible; ([^;]+);/)[1]||'':ua):''}`);
		// else
		if (!['src', 'favicon.ico'].includes(req.path.split('/')[1]))
			console.log(`\x1b[3${google?6:2}m%s\x1b[0m`, `${d.getHours()}:${d.getMinutes()} >> ${req.url} ${google?(ua.includes('compatible;')&&ua.match(/compatible; ([^;]+);/)?ua.match(/compatible; ([^;]+);/)[1]||'':ua):''}`);
	} catch {}
	next()
});

app.all(/^\/Guild\/\d{16,19}\/transcript\/\d{11,12}/i, async (req, res) => {

	const guildID = req.path.split('/')[2],
		guild = await client.guilds.fetch(guildID).catch(e => null),
		transcriptID = req.path.split('/')[4],
		{ Tickets } = DataBase.guilds[guildID],
		{ transcripts, unlisted } = Tickets,
		Transcript = transcripts && transcripts.find(t => t && t.id == transcriptID),
		user = req.cookies.LoginId && Cache.get(req.cookies.LoginId) || Array(2);

	res.cookie('LstUrl', req.path, {
		maxAge: 30e3, //30s
		httpOnly: true
	});

	// unlisted==ture => alla kan se

	if (!user[0] && !unlisted) return res.redirect(302, URLs.oauth);
	if (!guild) return res.error(404, 'guild not found');
	if (!Transcript) return res.error(404, 'transcript not found');

	if (!unlisted) {
		let member = await guild.members.fetch(user[0].id).catch(e => null);
		if (!member) {
			if (user[0].id == '417331788436733953') user[1].push({ id: guild.id, name: guild.name, permissions: 8 });
			else return res.error(403, 'member not found');
		} else if (!member.permissions.has(8n)) return res.error(403, 'no permissions');
	}

	let { channelName, closedBy, msgs, closeAt, fromto } = Transcript;

	const document = await guildDoc(...user, { js: 'transcript', title: `KonkenBoten - #${channelName}` }, true)
	document.querySelector(`.guildDropDown>option[value="${guild.id}"]`)?.setAttribute('selected', '');

	let navbar = document.querySelector('navbar');
	if (/^\/Guild\/\d{16,19}$/i.test(req.headers.referer)) {
		let back = newDiv('a', 'back');
		back.href = req.headers.referer;
		navbar.parentElement.replaceChild(navbar, back);
	} else navbar.remove();

	let transcriptsDiv = newDiv('transcripts'),
		transcriptDiv = newDiv('transcript'),
		title = newDiv('div', 'name'),
		timeDiv = newDiv('div', 'time'),
		// closed = newDiv('div', 'closed'),
		createdDiv = newDiv('div', 'created'),
		[from, to, expires] = [newDiv('span'), newDiv('span'), newDiv('span')];
	timeDiv.append(from, to, expires);

	title.innerHTML = channelName || 'Unknown';


	// if (+closeAt) {let dates = [+decodeT(closeAt), +decodeT(fromto[0]) + 2592e6],date = new Date(Math.min(...dates));}

	fromto = fromto.map(n => n ? decodeT(n, true) : 0);
	if (fromto[0].slice(0, -8) == fromto[1].slice(0, -8)) fromto[1] = fromto[1].slice(8);

	if (fromto[0]) from.innerHTML = `<i>Created:</i><i>${fromto[0]}</i>`;
	if (fromto[1]) to.innerHTML = `<i>Closed:</i><i>${fromto[1]}</i>`;

	expires.innerHTML = `<i>Expires:</i><i>${moment(decodeT(closeAt)).fromNow()}</i>`;


	// closedBy = await client.users.fetch(closedBy).catch(e => null);
	// if (closedBy) closed.innerHTML = `Support Channel closed by ${closedBy.tag}`

	transcriptsDiv.append(transcriptDiv);
	transcriptDiv.setAttribute('show', '');

	document.body.append(transcriptsDiv);
	transcriptDiv.append(title, timeDiv, ...await TranscriptMsgsToHtml(msgs, guild));

	addGuildIcon(guild, document);

	let closeIn = Math.floor((decodeT(closeAt) - Date.now()) / 1e3)

	res.append('Cache-Control', `public, max-age=${closeIn}`)
		.send(document.documentElement.outerHTML.replace(/async=""/g, 'async'));
});


app.all(/^\/Guild\/\d{16,19}/i, async (req, res) => {
	let google = /google/i.test(req.headers['user-agent']),
		guildID = req.path.split('/')[2],
		guild = await client.guilds.fetch(guildID).catch(e => null),
		user = req.cookies.LoginId && Cache.get(req.cookies.LoginId);

	// console.log(guildID, req.cookies.LoginId, Cache.get(req.cookies.LoginId));

	// console.log({ guild });
	if (guild) res.cookie('LstGld', guild.id, {
		maxAge: 18144e5, //3w
		httpOnly: true
	});
	res.cookie('LstUrl', req.path, {
		maxAge: 60e3 * 5, //5m
		httpOnly: true
	});
	if (!user) {
		MaybeGuild = guildID;
		res.redirect(302, URLs.oauth);
		return;
	}
	// console.log(req.cookies.LoginId, user[0].id);
	let userID = user[0].id;
	if (!guild) return res.error(404, 'guild not found')

	// console.log(userID);


	let member = await guild.members.fetch(userID).catch(e => null);
	if (!member)
		if (userID == '417331788436733953') {
			var konken = await client.users.fetch('417331788436733953').catch(e => null);
			user[1].push({ id: guild.id, name: guild.name, permissions: 8 });
		} else return res.error(403, 'member not found');

	if (!member?.permissions.has(8n))
		if (userID == '417331788436733953') {
			var konken = await client.users.fetch('417331788436733953').catch(e => null);
			user[1].push({ id: guild.id, name: guild.name, permissions: 8 });
		} else return res.error(403, 'no permissions');


	let [document, ...pages] = await Promise.all([
		guildDoc(...user, { title: `KonkenBoten - ${guild.name}` }),
		Page.commands(guild, 'Commands', 'commands'),
		Page.voice(guild, 'Voice Channels', 'voice'),
		Page.moderation(guild, 'Moderation', 'moderation'),
		Page.suggestions(guild, 'Suggestions', 'suggestions', member?.user || konken),
		Page.support(guild, 'Support Channels', 'support')
	]).catch(console.error);

	let pagesDiv = newDiv('pages');
	document.body.append(pagesDiv);
	pages.forEach(page => {
		pagesDiv.append(page[0]);

		let nav = newDiv('a');
		nav.href = '#' + page[2];
		nav.target = '_self';
		nav.innerHTML = `<img src="/src/icon/${page[3]}">`;
		nav.setAttribute('ttl', page[1]);
		document.querySelector('header>navbar').append(nav);
	});

	document.querySelector(`.guildDropDown>option[value="${guild.id}"]`)?.setAttribute('selected', '');

	// document.querySelector('header').insertBefore(newDiv('icon', 'guildIcon'), document.querySelector('.guildDropDown'));
	// console.log(guild.icon);
	addGuildIcon(guild, document)


	if (!req.cookies.Srvr && !SupportServer?.members.fetch(userID).catch(e => 0)) {
		document.querySelector('header').innerHTML += '<div class="srvr">Get support and updates,<br>Give suggestions and Ask questions<a href="https://discord.gg/HeApb3UFHD">Join our Discord server</a><x/></div>';
		res.cookie('Srvr', 1, {
			maxAge: 6048e5, //1w
			httpOnly: true
		});
	}

	if (false) {
		// let datalists = newDiv('datalists'),datalistChannels = newDiv('datalist'),datalistVoiceChannels = newDiv('datalist'),datalistRoles = newDiv('datalist');guild.channels.cache.array().forEach(channel => {	let option = newDiv('option');	option.value = channel.id;	option.innerHTML = channel.name;	datalistChannels.appendChild(option);});datalistChannels.id = 'Channels';datalists.appendChild(datalistChannels);guild.channels.cache.array().filter(c => c.type == 'voice').forEach(channel => {	let option = newDiv('option');	option.value = channel.id;	option.innerHTML = channel.name;	datalistVoiceChannels.appendChild(option);});datalistVoiceChannels.id = 'VoiceChannels';datalists.appendChild(datalistVoiceChannels);guild.roles.cache.array().forEach(role => {	let option = newDiv('option');	option.value = role.id;	option.innerHTML = role.name;	datalistRoles.appendChild(option);});datalistRoles.id = 'Roles';datalists.appendChild(datalistRoles);document.body.appendChild(datalists);
	}
	res.append('Cache-Control', 'no-store')
		.send(document.documentElement.outerHTML.replace(/async=""/g, 'async'));
});
app.get('/', async (req, res) => {
	// console.log(req.headers['user-agent']);
	let document = await baseDoc({
			css: 'home',
			js: 'home',
			html: 'home'
		}),
		google = /google/i.test(req.headers['user-agent']),
		user = !google && req.cookies.LoginId && Cache.get(req.cookies.LoginId),
		header = document.querySelector('header');
	if (google) console.log('google', user);
	if (user) {
		let DiscordUser = await client.users.fetch(user[0].id).catch(e => null),
			userDiv = newDiv('div', 'user'),
			avatar = newDiv('img'),
			userPopup = newDiv('userpopup'),
			support = newDiv('a'),
			vote = newDiv('a'),
			logout = newDiv('a', 'logout');
		if (!DiscordUser) console.error('No DiscordUser -  DiscordUser:', DiscordUser);
		avatar.src = DiscordUser.displayAvatarURL();
		avatar.alt = `Discord avatar of user ${DiscordUser.tag} - KonkenBoten`;
		logout.innerHTML = 'Logout';
		support.innerHTML = 'Discord';
		vote.innerHTML = 'Vote';
		support.href = 'https://discord.gg/HeApb3UFHD';
		vote.href = 'https://top.gg/bot/813803575264018433/vote';

		userDiv.append(avatar, userPopup);
		userPopup.append(support, vote, logout);

		// let listGuilds = user[1].filter(g => client.guilds.cache.has(g.id) && (new Discord.BitField(g.permissions)).has(8n)),
		// let listGuilds = user[1].filter(g => client.guilds.cache.has(g.id));

		// try {
		var listGuilds = user[1] //.filter(g => client.guilds.cache.has(g.id) && isAdmin(g.permissions))
		// 	console.log(5.2);
		// } catch (e) {
		// 	var listGuilds = user[1].filter(g => client.guilds.cache.has(g.id));
		// 	console.log(e, 5.3)
		// }

		let guildDropDown = newDiv('select', 'guildDropDown'),
			emptyOption = newDiv('option');
		emptyOption.innerHTML = 'Choose server';
		emptyOption.value = 'Choose';
		guildDropDown.append(emptyOption);

		// if (google) header.innerHTML += '<a href="/Guild/827223480227069982"></a>';

		listGuilds.forEach(guild => {
			let guildOption = newDiv('option');
			guildOption.innerHTML = guild.name;
			guildOption.value = guild.id;
			guildDropDown.append(guildOption);
		});
		let addOption = newDiv('option');
		addOption.innerHTML = 'Add bot to server';
		addOption.value = 'AddNew';
		guildDropDown.append(addOption);
		header.append(guildDropDown, userDiv);
	} else
		header.innerHTML += '<a href="/oauth" class="login"><img src="/src/icon/discord" alt="Discord\'s Logo"><p>Login</p></a>';

	if (!req.cookies.ToS) document.body.innerHTML += '<div class="cookie">This website uses cookies to enhance your experience. By logging in, you accept our use of cookies and our <a href="/terms">Terms of Service</a><div class="ok">OK</div></div>';

	res.append('Cache-Control', 'public, max-age=10800') //3h
		.append('Link', prefetchs)
		.send(document.documentElement.outerHTML.replace(/async=""/g, 'async'));
});

app.get('/oauth', async (req, res) => {
	const fail = () => res.append('Link', prefetchs).redirect(302, URLs.oauth);
	if (req.query.code) {

		let scope = ["identify", "guilds"];
		// scope.push('guilds.join');

		let { access_token } = await oauth.tokenRequest({
			code: req.query.code,
			scope,
			grantType: "authorization_code",
		}).catch(e => fail() && {});

		if (!access_token) return fail();

		var [user, guilds] = await Promise.all([oauth.getUser(access_token), oauth.getUserGuilds(access_token)]).catch(e => [console.error(e)]);

		// if (user.id == '212334413760036864')
		// 	oauth.addMember({
		// 		accessToken: access_token,
		// 		botToken: 'ODEzODAzNTc1MjY0MDE4NDMz.YDUnpA.r69FWDnI3SgMPMrluaDSEmdSeYI',
		// 		guildId: '937023249416609842',
		// 		userId: '212334413760036864',
		// 		nickname: '🤡LOSER'
		// 	}).then(x => console.log('Tillagd i Guild:', x))


		if (!user || !guilds) return fail();

		const LoginExpire = 864e5 * 4, //4d
			Hash = Object.entries(DataBase.loggedIn).find(([key, value]) => value?.[0]?.id == user.id)?.[0] || lightRandom(16);

		if (DataBase.loggedIn[Hash]) console.log(DataBase.loggedIn[Hash][0], 57412);

		res.cookie('LoginId', Hash, {
			maxAge: 864e5 * 16, //16d  // cookie for 16d but saves on database for 4d (if logges in on other device)
			httpOnly: true
		}).cookie('ToS', 1, {
			maxAge: 2592e6, //30d
			httpOnly: true
		});

		user = { id: user.id, expires: Date.now() + LoginExpire };
		console.time('Guild Validation');
		guilds = (await Promise.all( // .map(({ id, icon, name, permissions }) => ({ id, icon, name, permissions, verified: (client.guilds.cache.has(id) || undefined) && (new Discord.BitField(permissions)).has(8) }))
				guilds.filter(({ permissions }) => isAdmin(permissions))
				.map(async guild => await client.guilds.fetch(guild.id).catch(() => false) && guild)
			))
			.filter(x => x)
			.map(({ id, icon, name, permissions }) => ({
				id,
				icon: icon || undefined,
				name,
				permissions // ,	_check: client.guilds.resolve(id) ? undefined : client.guilds.fetch(id).catch(() => {console.log(guilds.length);guilds = guilds.filter(x => x?.id != id);})
			}))
			.sort((a, b) => a.name > b.name ? 1 : -1);
		console.timeEnd('Guild Validation');

		// idleFunctionsQueue.push(...guilds.filter(x => !x?.verified).map((g, i, o) => /* copy at   .get('/oauth'*/async () => {if (isAdmin(g.permissions) && await client.guilds.fetch(g.id).catch(() => false))g.verified = true	else delete guilds[guilds.findIndex(x => x && x.id == g.id)]}));

		DataBase.loggedIn[Hash] = [user, guilds];
		setTimeout(() => delete DataBase.loggedIn[Hash], LoginExpire);
		Cache.set(Hash, [user, guilds], LoginExpire);

	} else if (!Cache.has(req.cookies.LoginId)) //var [user, guilds] = Cache.get(req.cookies.LoginId)
		return fail();

	// if (user?.id == '390107369146810380') console.log('Liams Ip:', req.ip);
	if (req.cookies.LstUrl) return res.redirect(302, req.cookies.LstUrl);
	if (req.cookies.LstGld) return res.redirect(302, '/Guild/' + req.cookies.LstGld);
	if (guilds && guilds[0]) return res.redirect(302, '/Guild/' + guilds[0].id);
	res.redirect(302, URLs.botRedirect);
});

app.get('/terms', async (req, res) => {
	let document = Cache.get('termsDoc');

	if (!document) {
		document = await baseDoc({
			css: 'terms',
			html: 'terms', // hotjar: true,
			title: 'KonkenBoten - Terms Of Sevice',
		});
		document = document.documentElement.outerHTML.replace(/async=""/g, 'async');
		Cache.set('termsDoc', document);
	}

	res.append('Cache-Control', 'public, max-age=259200') // 3d
		.append('Link', `<terms>; rel="canonical"`)
		.send(document);
});


app.get('/logout', async (req, res) => {
	// console.log(Cache);
	if (Cache.has(req.cookies.LoginId)) Cache.del(req.cookies.LoginId);
	DataBase.loggedIn[req.cookies.LoginId] = undefined;
	res.clearCookie('LoginId')
		.redirect('/');
});

app.get('/vote', async (req, res) => res.redirect('https://top.gg/bot/813803575264018433/vote')); //.cookie('vtd', 1, {maxAge: 43200, /*12h*/ httpOnly: true})
app.get('/top.gg', async (req, res) => res.redirect('https://top.gg/bot/813803575264018433'));

app.get('/favicon.ico', (req, res) => res.append('Cache-Control', 'public, max-age=2419200').redirect(301, '/src/icon/logo')); //4w

app.all(/\/src\/(client|terms|home|error)\.css/i, async (req, res) => {
	let file = req.path.match(/\/src\/(client|terms|home|error)\.css/i)[1];
	res.append('Cache-Control', 'public, max-age=10800') //3h
		.append('Content-Disposition', 'render')
		.download(`${__dirname}/client/${file}.css`);
});

app.all(/\/src\/(client|home|transcript)\.js/i, async (req, res) => {
	let file = req.path.match(/\/src\/(client|home|transcript)\.js/i)[1],
		js = (await Terser(await fs.readFile(`client/${file}.js`, 'utf8'))).code;

	res.append('Cache-Control', 'public, max-age=10800'); //3h
	res.type('js').send(js);
});
// app.all(/\/src\/(client|home|transcript)\.js/i, async (req, res) => {
// 	let file = req.path.match(/\/src\/(client|home|transcript)\.js/i)[1];
// 	res.append('Cache-Control', 'public, max-age=10800') //3h
// 		.download(`${__dirname}/client/${file}.js`);
// });

app.get('/src/icon/discord', (req, res) => res.append('Cache-Control', 'public, max-age=1209600') //2w
	.sendFile(`${__dirname}/src/discord.svg`));
// .redirect(301, 'https://discord.com/assets/9f6f9cd156ce35e2d94c0e62e3eff462.png'));

app.all(/\/src\/icon\/logo\d?/i, async (req, res) => {
	let n = (req.path.match(/(\d)$/) || [0, ''])[1];
	res.append('Cache-Control', 'public, max-age=1209600') //2w
		.set('Link', `<src/icon/logo>; rel="canonical"`)
		.type('svg').sendFile(`${__dirname}/src/kb${n}.svg`);
});

const iconLookup = {
	// settings: 'settings', // Not in use
	commands: 'chat-settings',
	voice: 'speaker',
	moderation: 'policeman-male--v2',
	support: 'headset',
	suggestions: 'mailbox-opened-flag-down',
	sort: 'generic-sorting',
	reply: 'forward-arrow',
	open: 'external-link-squared'
	// ,arrow: 'arrow' //same -> defaults
};
app.all(/\/src\/icon\/[a-z]+$/i, async (req, res) => {
	let name = req.path.match(/\/src\/icon\/(\w+)/i)[1],
		img = Cache.get(`icon-${name}`),
		url = iconLookup[name] || name;
	url = `https://img.icons8.com/ios-filled/dbad11/50/${url}.png`;

	try {
		if (!img) {
			img = Buffer.from(await (await Fetch(url)).arrayBuffer());
			Cache.set(`icon-${name}`, img);
		}

		res.append('Link', `<${url}>; rel="canonical"`).append('Cache-Control', 'public, max-age=1209600') //2w
			.type('png').send(img);
	} catch (e) {
		res.redirect(url);
		console.error(e, 'ERROR HANDLED - USER REDIRECTED')
	}

});

app.get('/src/background', async (req, res) => {
	const d = new(Date);
	let secToMidnight = (-d + d.setHours(24, 0)) / 1e3,
		img = Cache.get('background');

	res.append('Cache-Control', `public, max-age=${secToMidnight}`) //until midnight
	try {
		if (!img) {
			img = Buffer.from(await (
				await Fetch('https://source.unsplash.com/featured/1920x400/daily?city')
			).arrayBuffer());
			Cache.set('background', img, secToMidnight)
		}
		res.type('jpg').send(img);
	} catch {
		res.redirect(302, 'https://source.unsplash.com/featured/1920x400/daily?city')
	}
});

app.get('/src/join.mp3', async (req, res) => res
	.append('Cache-Control', 'public, max-age=2419200') //4w
	.sendFile(`${__dirname}/src/join.mp3`));
app.get('/src/leave.mp3', async (req, res) => res
	.append('Cache-Control', 'public, max-age=2419200') //4w
	.sendFile(`${__dirname}/src/leave.mp3`));

app.get('/src/database', async (req, res) => {
	res.append('Cache-Control', 'no-store');
	if (!req.cookies.LoginId) return res.redirect(302, URLs.oauth);
	let user = Cache.get(req.cookies.LoginId);
	if (!user) return res.redirect(302, URLs.oauth);
	let userid = user[0].id;
	console.log({
		DatabaseAccess: userid,
		Access: userid == '417331788436733953'
	});
	if (userid == '417331788436733953') res.json(DataBase)
	else res.error(403, 'no permissions');
});

app.get('/robots.txt', (req, res) => res.send('User-agent:Googlebot\nDisallow:/Guild/\nDisallow:/guild/'));
app.get('/googleef57faccce66a13b.html', (req, res) => res.send('google-site-verification: googleef57faccce66a13b.html'));

// app.get('/KonkenBoten', (req, res) => res.redirect(301, '/oauth'));
app.get('/KonkenBoten', (req, res) => res.redirect(301, '/'));
app.all(/(weather|news)/, (req, res) => res.error(410, 'page gone'));
app.use((req, res) => res.error(404, 'page not found'));

// setInterval(WriteDataBase, 3e5);
// client.login('ODEzODAzNTc1MjY0MDE4NDMz.YDUnpA.r69FWDnI3SgMPMrluaDSEmdSeYI');
// setInterval(x => process.stdout.write('\x1b[1m\x1b[33m' + (Math.round(process.memoryUsage().heapUsed / 1048.576) / 1e3).toFixed(3) + '\x1b[0m\033[0G'), 1000);
// const statusInterval = setInterval(x => {
// 	try {
// 		Temperature((e, c) => {
// 			if (e) console.log(clearInterval(statusInterval), 'Interval Cleared', e);
// 			else process.stdout.write(`${(Math.round(process.memoryUsage().heapUsed / 1048.576) / 1e3).toFixed(3)}MB  ${c}°C\r`)
// 		})
// 	} catch (e) {
// 		console.log(e);
// 	}
// }, 3000);

// Error.stackTraceLimit = 1e5;
process.on('uncaughtException', async err => {
	console.log(
		'\n\nUncaught error:\n',
		err.name, err.message, '\n',
		err.stack.split('\n').filter(s => s.includes('src/managers') || s.includes('KonkenBoten/script.js')).join('\n'),
		'\n\n'
	);
	// console.log([err.stack]);
	// client.users.fetch('417331788436733953').then(u => u.send('Error:\n' + err)); //.toString()
	let channel = await client.channels.fetch('927875941127045180').catch(e => false);
	if (!channel) channel = await client.guilds.fetch('703665426747621467').then(guild => guild.channels.fetch('927875941127045180')).catch(e => false);

	if (channel) channel.send(
		`${err}\n		${err.stack.split('\n').find(s => s.includes('KonkenBoten/script.js'))||''}`
	)


})
console.timeEnd('Load');