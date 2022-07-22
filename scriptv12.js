console.log('Start');
console.time('Load');
console.time('Packages');
const Discord = require("discord.js"),
	{ promises: fs } = require('fs'),
	{ minify: Terser } = require("terser"),
	{ minify: MinifyCSS } = require('csso'),
	{ Base64 } = require('js-base64'),
	{ JSDOM } = require("jsdom"),
	lightRandom = require('light-random'),
	Fetch = require('node-fetch'),
	cookieParser = require('cookie-parser'),
	moment = require('moment'),
	sass = require('sass'),
	{ parse: Duration, stringify: CleanDate } = require('simple-duration'),
	ObjectMerge = require('deepmerge');

// (async () => ([Discord,{ promises: fs },{ minify: Terser },{ minify: MinifyCSS },{ Base64 },{ JSDOM },lightRandom,Fetch,cookieParser,moment,sass,{ parse: Duration, stringify: CleanDate }] = await Promise.all([import("discord.js"),import('fs'),import("terser"),import('csso'),import('js-base64'),import("jsdom"),import('light-random'),import('node-fetch'),import('cookie-parser'),import('moment'),import('sass'),import('simple-duration')])));

const client = new Discord.Client,
	app = require('express')(),
	server = require('http').createServer(app),
	io = require('socket.io')(server, {
		transports: ['polling'],
		pingInterval: 60e3,
		pingTimeout: 120e3,
	}),
	port = 80,
	DefaultPrefix = '$',
	PageTitle = 'KonkenBoten - The Ultimate Discord Bot',
	oauth = new(require("discord-oauth2"))(),
	// ES5 = require('es6-arrow-function').compile,
	// MinifyCSS = require('clean-css'),
	DataBase = JSON.parse(require('fs').readFileSync('DataBase.json', 'utf8').trim()),
	// topggSdk = require('@top-gg/sdk'),
	topggApi = new(require('@top-gg/sdk').Api)('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjgxMzgwMzU3NTI2NDAxODQzMyIsImJvdCI6dHJ1ZSwiaWF0IjoxNjE4NjYzNDU4fQ.gqGp-wnvzaFk69HGOohqYPlJ2J4bEjL7RRAvWFCroMQ'),
	TopggSend = () => topggApi.postStats({ serverCount: client.guilds.cache.size }),
	Remebered = new Map(),
	Cache = new(require("node-cache"))(),
	EmojiList = Object.entries(require('emoji-test-list')).filter((x, i) => x[0].length <= 2 && +x[1].age <= 12) //&& x[1].toFullyQualified
	.filter((x, i) => !(i >= 1289 || i >= 1239 && i <= 1259 || i >= 1138 && i <= 1233 || i >= 1154 && i <= 1157 || i >= 699 && i <= 729 || i >= 295 && i <= 303 || [18, 19, 127, 146].includes(i)))
	.map(x => ({
		e: x[1].toFullyQualified || x[0],
		n: x[1].name // TODO: Testa om icke-toFullyQualified kan reageras i DC
	})).filter((x, i, o) => o.map(y => y.e).indexOf(x.e) == i);
console.timeEnd('Packages');

const NewGuildSubrcibers = [],
	ClientID = '813803575264018433',
	RedirectTo = {
		de: 'https://bot.konkenbonken.se/oauth',
		en: 'https%3A%2F%2Fbot.konkenbonken.se%2Foauth'
	},
	URLs = {
		oauth: `https://discord.com/api/oauth2/authorize?client_id=${ClientID}&redirect_uri=${RedirectTo.en}&scope=identify%20guilds&response_type=code`,
		bot: `https://discord.com/api/oauth2/authorize?client_id=${ClientID}&permissions=8&scope=bot`,
		botRedirect: `https://discord.com/api/oauth2/authorize?client_id=${ClientID}&redirect_uri=${RedirectTo.en}&permissions=8&scope=bot&response_type=code`
	},
	// removeNull = obj => Object.fromEntries(Object.entries(obj).filter(([_, v]) => v != null).map(([k, v]) => [k, v === Object(v) ? removeNull(v) : v])),
	// WriteDataBase = () => fs.writeFile('DataBase.json', JSON.stringify(DataBase)),
	WriteDataBase = () =>
	fs.writeFile('DataBase-temp.json', JSON.stringify(DataBase)).then(() => fs.rename('DataBase-temp.json', 'DataBase.json').catch(x => 0)),
	document = new JSDOM().window.document,
	{ isArray } = Array,
	// isObject = x => x && typeof x === 'object' && !isArray(x),
	// Duration = str => simpleDuration(str.split(' ')[0]),
	newDiv = (el = 'div', ...classes) => {
		let div = document.createElement(el);
		if (classes) classes.forEach(cl => div.classList.add(cl));
		return div;
	},
	h6 = (txt, i) => {
		let el = newDiv('h6');
		el.innerHTML = txt;
		if (i) el.append(i);
		return el;
	},
	RandomUser = () => 'User#' + Math.floor(Math.random() * 8999 + 1000),
	Sass = file => new Promise((resolver, reject) => sass.render({
		file: `client/${file}.scss`
	}, (err, res) => {
		if (err) reject(err, console.log('ERR - ', err))
		else resolver(res.css.toString());
	})),
	FieldtoPerms = (bitfield = 0) => Object.fromEntries(Object.entries(Discord.Permissions.FLAGS).reverse()
		.filter(p => (p[1] > bitfield) ? false : typeof(bitfield -= p[1])).filter(x => x)),
	prefetchs = [...[
			...['logo', 'commands', 'voice', 'moderation', 'suggestions', 'support', 'sort', 'reply', 'arrow', 'discord'].map(x => `src/icon/${x}`), // 'src/icon/logo', 'src/icon/commands', 'src/icon/voice', 'src/icon/moderation', 'src/icon/suggestions', 'src/icon/support', 'src/icon/sort', 'src/icon/reply',
			'src/client.js', 'src/client.css' //,'src/background', 'socket.io/socket.io.js',    // ,...["1cbd08c76f8af6dddce02c5138971129","6debd47ed13483642cf09e832ed0bc1b","dd4dbc0016779df1378e7812eabaa04d","322c936a8c8be1b803cd94861bdfa868"].map(x=>`https://discordapp.com/assets/${x}.png`)
		].map(url => `<${url}>; rel="prefetch"`),
		'<oauth>; rel="prerender"', '<https://discord.com>; rel="preconnect"',
		'</>; rel="canonical"', '<https://top.gg/bot/813803575264018433/vote>; rel="prerender"'
	].join(),
	ParseModLogs = (logs, guild, targetMember, targetStaff) => Object.entries(logs)
	//targetMember = Member | User | id
	.map(([staffId, staffLogs]) =>
		staffLogs.filter(log => (!targetMember || (targetMember.id || targetMember) == log.m) && (!targetStaff || targetStaff == staffId)).map(log => ({
			...log,
			staffId,
			staff: () => guild.members.cache.get(staffId) || guild.members.fetch(staffId).catch(e => null),
			member: () => guild.members.cache.get(log.m) || guild.members.fetch(log.m).catch(e => null),
			d: decodeT(log.d),
			unt: log.unt && decodeT(log.unt)
		}))).flat().sort((a, b) => b.d - a.d),


	baseDoc = options => new Promise(async resolver => {
		let document = Cache.get(JSON.stringify(options));

		if (document)
			document = new JSDOM(document).window.document;
		else {
			let obj = {
				css: false,
				js: false,
				html: false,
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
			else document = new JSDOM().window.document;


			document.documentElement.setAttribute('lang', 'en');
			if (obj.socket) document.head.innerHTML = '<script src="/socket.io/socket.io.min.js"></script>';
			if (obj.js) document.head.innerHTML += `<script src="/src/${obj.js}.js" defer></script>`;
			if (obj.css) document.head.innerHTML += `<link href="/src/${obj.css}.css" type="text/css" rel="stylesheet">`;
			document.head.innerHTML += `<title>${obj.title}</title>`;
			document.head.innerHTML += '<meta name="viewport" content="width=device-width, initial-scale=1"><meta charset="UTF-8">';
			// if (obj.hotjar) document.head.innerHTML += '<script defer>{let t,h,e=window,j=document,s="https://static.hotjar.com/c/hotjar-",c=".js?sv=";e.hj=e.hj||(()=>(e.hj.q=e.hj.q||[]).push(arguments)),e._hjSettings={hjid:2308481,hjsv:6},t=j.querySelector("head"),(h=j.createElement("script")).async=1,h.src=s+e._hjSettings.hjid+c+e._hjSettings.hjsv,t.appendChild(h)}</script>';
			// if (obj.adsense) document.head.innerHTML += '<script data-ad-client="ca-pub-2422033382456580" async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"></script>';
			// if (obj.gtag) document.head.innerHTML += '<script async src="https://www.googletagmanager.com/gtag/js?id=G-BT0FM35V66"></script>';

			// if (js) document.head.innerHTML += `<script src="data:text/js;base64,${js}" defer></script>`;
			// if (css) document.head.innerHTML += `<link rel="stylesheet" href="data:text/css;base64,${css}">`;

			Cache.set(JSON.stringify(options), document.documentElement.outerHTML);
		}

		resolver(document);
	}),
	guildDoc = (DiscordUser, guildsObj, extras = {}, req) => new Promise(async resolver => {
		if (!DiscordUser.createdTimestamp) DiscordUser = await client.users.fetch(DiscordUser.id).catch(e => null);

		let document = await baseDoc({
				css: 'client',
				js: 'client',
				// hotjar: true,
				socket: true,
				...extras
			}),
			DIDscript = newDiv('script');
		DIDscript.innerHTML = `let DID="${DiscordUser.id}"`;

		document.head.prepend(DIDscript);
		document.head.innerHTML += '<base target="_blank">';

		let header = newDiv('header'),
			navbar = newDiv('navbar'),
			user = newDiv('div', 'user'),
			avatar = newDiv('img'),
			userPopup = newDiv('userpopup'),
			support = newDiv('a'),
			vote = newDiv('a'),
			logout = newDiv('a', 'logout');
		avatar.src = DiscordUser.displayAvatarURL();
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

		let listGuilds = guildsObj.filter(g => client.guilds.cache.keyArray().includes(g.id) && (new Discord.BitField(g.permissions)).has(8)),
			guildDropDown = newDiv('select', 'guildDropDown');
		header.innerHTML += '<a href="/" target="_self" class="logo"><div> <img src="/src/icon/logo" alt="KonkenBoten\'s Logo"></div></div></a>'
		header.append(navbar, guildDropDown, user);

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
	}),
	mainPage = async (req, res, userObj, guildsObj) => {
			if (req.cookies.LstGld) res.redirect(302, '/Guild/' + req.cookies.LstGld)
			else {
				let listGuilds = guildsObj.filter(g => client.guilds.cache.keyArray().includes(g.id) && (new Discord.BitField(g.permissions)).has(8)),
					listGuildsID = listGuilds.map(x => x.id),
					guildID = listGuildsID[0];
				//DiscordUser = await client.users.fetch(userObj.id).catch(e => null),

				if (listGuildsID.includes(MaybeGuild)) guildID = MaybeGuild;

				if (listGuilds.length) res.redirect(302, '/Guild/' + guildID);
				else res.redirect(302, URLs.botRedirect);
			}
		},
		basePage = (options) => new Promise(async resolver => {
			let page = newDiv('page');
			if (options.id) page.id = options.id;
			if (options.title) {
				let title = newDiv('h1');
				title.innerHTML = options.title;
				page.append(title);
			}
			resolver(page);
		}), capital = s => s[0].toUpperCase() + s.slice(1),
		CssColors = {
			gray: '747f8d',
			green: '43b581',
			red: 'f04747',
			yellow: 'faa61a'
		}, Invites = {},
		AuditLog = async (guild, type, targetID) => (await guild.fetchAuditLogs({ type }))
			// .entries.array().filter(a => a.target?.id == targetID)[0]; //  https://discord.js.org/#/docs/main/stable/typedef/AuditLogAction
			.entries.array().find(a => a.target?.id == targetID); //  https://discord.js.org/#/docs/main/stable/typedef/AuditLogAction

client.login('ODEzODAzNTc1MjY0MDE4NDMz.YDUnpA.r69FWDnI3SgMPMrluaDSEmdSeYI');
console.time('Login - Efter "Load:"');

const LogRules = {
	channelCreate: {
		cleanName: 'Channel Created',
		decription: 'Emits whenever a new channel is created',
		//audit: 10,
		color: CssColors.green,
		function: async ([c], audit) => {
			if (audit) audit = await AuditLog(c.guild, 10, c.id);
			if (audit) audit = [
				['Executor:', audit.executor]
			];
			return {
				author: `${capital(c.type)} channel created: ${c.name}`,
				fields: [
					['Channel ID:', c.id],
					...(audit && audit[0] ? audit : [])
				]
			}
		}
	},
	channelDelete: {
		cleanName: 'Channel Deleted',
		decription: 'Emits whenever a channel is deleted',
		//audit: 12,
		color: CssColors.red,
		function: async ([c], audit) => {
			if (audit) audit = await AuditLog(c.guild, 12, c.id);
			if (audit) audit = [
				['Executor:', audit.executor]
			];
			return {
				author: `${capital(c.type)} channel deleted: ${c.name}`,
				fields: [
					['Channel ID:', c.id],
					...(audit && audit[0] ? audit : [])
				]
			}
		}
	},
	channelUpdate: {
		cleanName: 'Channel Updated',
		decription: 'Emits whenever a channel is updated\nName, permissions, userlimit',
		//audit: 11,
		color: CssColors.yellow,
		function: async ([oldC, newC], audit) => {
			if (audit) audit = await AuditLog(newC.guild, 11, newC.id);
			if (audit) audit = [
				['Executor:', audit.executor]
			];
			return oldC.name != newC.name ? {
				author: `${capital(newC.type)} channel renamed`,
				fields: [
					['Old name:', oldC.name],
					['New name:', newC.name],
					['Channel ID:', newC.id, true],
					...(audit && audit[0] ? audit : [])
				]
			} : {
				author: `${capital(newC.type)} channel updated`,
				fields: [
					['Channel:', `<#${newC.id}>`],
					['Channel ID:', newC.id, true],
					...(audit && audit[0] ? audit : [])
				]
			}
		}
	},
	emojiCreate: {
		cleanName: 'Emoji Created',
		decription: 'Emits whenever a new emoji is created',
		//audit: 60,
		color: CssColors.green,
		function: async ([emoji], audit) => {
			if (audit) audit = await AuditLog(emoji.guild, 60, emoji.id);
			if (audit) audit = [
				['Executor:', audit.executor]
			];
			return {
				author: `Emoji created: ${emoji}`,
				fields: [
					['Name:', emoji.name],
					['Created by:', emoji.author || '*Unknown*', true],
					...(audit && audit[0] ? audit : [])
				]
			}
		}
	},
	emojiDelete: {
		cleanName: 'Emoji Deleted',
		decription: 'Emits whenever a emoji is deleted',
		//audit: 62,
		color: CssColors.red,
		function: async ([emoji], audit) => {
			if (audit) audit = await AuditLog(emoji.guild, 62, emoji.id);
			if (audit) audit = [
				['Executor:', audit.executor]
			];
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
			if (audit) audit = await AuditLog(newE.guild, 61, newE.id);
			if (audit) audit = [
				['Executor:', audit.executor]
			];
			return oldE.name != newE.name ? {
				author: `Emoji renamed: ${oldE}`,
				fields: [
					['Old name:', oldE.name],
					['New name:', newE.name, true],
					...(audit && audit[0] ? audit : [])
				]
			} : {
				author: `Emoji updated: ${oldE}`,
				fields: [
					['Old emoji:', `${oldE.name}: ${oldE}`],
					['New emoji:', `${newE.name}: ${newE}`, true],
					...(audit && audit[0] ? audit : [])
				]
			}
		}
	},
	guildBanAdd: {
		cleanName: 'Member Banned',
		decription: 'Emits whenever a member is banned',
		//audit: 22,
		color: CssColors.red,
		function: async ([g, u], audit) => {
			if (audit) audit = await AuditLog(g, 22, u.id);
			if (audit) audit = [
				['Executor:', audit.executor],
				['Reason:', audit.reason]
			];
			return {
				author: `User Banned: ${u.username}`,
				fields: [
					['Tag:', u.tag],
					['ID:', u.id, true],
					...(audit && audit[0] ? audit : [])
				]
			}
		}
	},
	guildBanRemove: {
		cleanName: 'Member Unbanned',
		decription: 'Emits whenever a member is unbanned',
		//audit: 23,
		color: CssColors.green,
		function: async ([g, u], audit) => {
			if (audit) audit = await AuditLog(g, 23, u.id);
			if (audit) audit = [
				['Executor:', audit.executor]
			];
			return {
				author: `User unbanned: ${u.username}`,
				fields: [
					['Tag:', u.tag],
					['ID:', u.id, true],
					...(audit && audit[0] ? audit : [])
				]
			}
		}
	},
	guildMemberAdd: {
		cleanName: 'Member Joined',
		decription: 'Emits whenever a member joins the server',
		color: CssColors.green,
		function: async ([m], audit) => {
			let invites = (await m.guild.fetchInvites()).array(),
				invite = invites.find(i => i.uses > Invites[i.code]?.uses);
			invites.forEach(i => Invites[i.code] = {
				...Invites[i.code],
				inviter: i.inviter?.id || Invites[i.code].inviter,
				uses: i.uses
			});
			if (audit) {
				if (invite) audit = [
					['Invite url:', invite],
					['Inviter:', invite.inviter || '*Unknown*']
				]
				else if (m.guild.vanityURLCode) {
					let data = await m.guild.fetchVanityData().catch(e => 0);
					if (data && data.uses > Invites[data.code].uses)
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
			if (audit) audit = [
				['Executor:', audit.executor]
			];
			if (oldM.nickname != newM.nickname) return {
				author: `Member's nickname updated: ${newM.user.tag}`,
				fields: [
					['Old name:', oldM.nickname],
					['New name:', newM.nickname, true],
					['Member:', newM],
					...(audit && audit[0] ? audit : [])
				]
			}
			else {
				if (roles && roles.createdTimestamp > Date.now() - 3e4) { //30s
					roles = roles.changes.map(e => [
						`${capital(e.key.slice(1))}ed`.replace('ee', 'e'),
						e.new.map(x => newM.guild.roles.cache.get(x.id)).join()
					]);
					return {
						author: `Member's roles updated: ${newM.user.tag}`,
						fields: [
							...(roles || []),
							['Member:', newM],
							...(audit && audit[0] ? audit : [])
						]
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
			if (audit) audit = await AuditLog(i.guild, 42);
			if (audit) audit = [
				['Executor:', audit.executor]
			];
			return {
				author: `Invite deleted: ${i.code}`,
				fields: [
					['Channel:', i.channel],
					['Creator:', i.inviter],
					['Url:', i, true],
					...(audit && audit[0] ? audit : [])
				]
			}
		}
	},
	message: {
		cleanName: 'Message Sent',
		decription: 'Emits whenever a message is sent',
		color: CssColors.gray,
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
					['Attachments:', m.attachments.array().map(a => `[${a.name}](${a.url})`).join('\n')]
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
			if (audit) audit = await AuditLog(m.guild, 72, m.author.id);
			if (audit && audit.createdTimestamp > Date.now() - 3e4) audit = [
				['Executor:', audit.executor]
			];
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
					['Attachments:', m.attachments.array().map(a => `[${a.name}](${a.url})`).join('\n')]
				];
			return m.author.id != ClientID ? {
				author: `Message deleted`, // authorURL: m.url,
				fields: [
					['Channel:', m.channel],
					['Author:', m.author],
					['Content:', content],
					...attachments,
					...(audit && audit[0] ? audit : [])
				]
			} : null
		}
	},
	messageUpdate: {
		cleanName: 'Message Updated',
		decription: 'Emits whenever a message is edited',
		color: CssColors.yellow,
		function: ([oldM, newM], audit) => {
			if (newM.author.id != ClientID || oldM.content == newM.content) return null;
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
			if (audit) audit = await AuditLog(r.guild, 30, r.id);
			if (audit) audit = [
				['Executor:', audit.executor]
			];
			return {
				author: `Role created`,
				fields: [
					['Name:', r.name, true],
					['Role:', r],
					...(audit && audit[0] ? audit : [])
				]
			}
		}
	},
	roleDelete: {
		cleanName: 'Role Deleted',
		decription: 'Emits whenever a role is deleted',
		color: CssColors.red,
		function: async ([r], audit) => {
			if (audit) audit = await AuditLog(r.guild, 32, r.id);
			if (audit) audit = [
				['Executor:', audit.executor]
			];
			return {
				author: `Role deleted`,
				fields: [
					['Name:', r.name],
					...(audit && audit[0] ? audit : [])
				]
			}
		}
	},
	roleUpdate: {
		cleanName: 'Role Updated',
		decription: 'Emits whenever a role is updated\nName, permissions, color',
		color: CssColors.yellow,
		function: async ([oldR, newR], audit) => {
			let changes, log = await AuditLog(newR.guild, 31, newR.id);
			if (log) {
				changes = log.changes;
				if (audit) audit = [
					['Executor:', log.executor]
				];
			}
			if (oldR.name != newR.name) return {
				author: 'Role renamed',
				fields: [
					['Old name:', oldR.name, true],
					['New name:', newR.name],
					...(audit && audit[0] ? audit : [])
				]
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
				if (perms)[removed, added] = [FieldtoPerms(perms.old), FieldtoPerms(perms.new)].map(x => Object.keys(x));
				if (removed) removed = removed.filter(x => !added.includes(x));
				if (added) added = added.filter(x => !removed.includes(x));

				if (added && added[0]) updates.push(
					['Permissons added:', added.map(p => capital(p.toLowerCase().replace(/_/g, ' '))).join('\n')]
				);
				if (removed && removed[0]) updates.push(
					['Permissons removed:', removed.map(p => capital(p.toLowerCase().replace(/_/g, ' '))).join('\n')]
				);

				return {
					author: 'Role updated',
					fields: [
						...updates,
						...(audit && audit[0] ? audit : [])
					]
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
			author: 'Support Channel opened',
			fields: [
				['Member:', u, true],
				['Channel', c]
			]
		})
	},
	ticketEnd: {
		cleanName: 'Support Closed',
		decription: 'Emits whenever a Support Channel is closed',
		color: CssColors.red,
		function: ([c, closedBy, saved], audit) => ({
			author: 'Support Channel closed',
			fields: [
				['Channel', c.name, true],
				['Closed by', closedBy],
				['Saved', saved ? 'Yes' : 'No']
			]
		})
	},
	ticketAddUser: {
		cleanName: 'User Added',
		decription: 'Emits whenever a new user is added to an existing Support Channel',
		color: CssColors.gray,
		function: ([added, addedBy, channel], audit) => ({
			author: 'User added to Support Channel',
			fields: [
				['Member added', added, true],
				['Added by', addedBy],
				['Channel', channel]
			]
		})
	},
	ticketRemoveUser: {
		cleanName: 'User Removed',
		decription: 'Emits whenever a user is removed from an existing Support Channel',
		color: CssColors.red,
		function: ([added, addedBy, channel], audit) => ({
			author: 'User removed from Support Channel',
			fields: [
				['Member removed', added, true],
				['Removed by', addedBy],
				['Channel', channel]
			]
		})
	},
	voiceConnect: {
		cleanName: 'Member Connect',
		decription: 'Emits whenever a member connects to a Voice Channel',
		color: CssColors.green,
		function: async ([newState], audit) => {
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
			if (audit) audit = await AuditLog(oldState.guild, 27, oldState.member.id);
			if (audit) audit = [
				['Executor:', audit.executor]
			]
			return {
				author: `Member left a voice channel`,
				fields: [
					['Channel:', oldState.channel],
					['Member:', oldState.member],
					...(audit && audit[0] ? audit : [])
				]
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
			if (audit && log && log.executor.id != newState.member.id) audit = [
				['Executor:', log.executor]
			]
			return {
				author: `Member moved`,
				fields: [
					['Member:', newState.member],
					['From:', oldState.channel, true],
					['To:', newState.channel],
					...(audit && audit[0] ? audit : [])
				]
			}
			// }
		}
	},
	voiceMute: {
		cleanName: 'Server Muted',
		decription: 'Emits whenever a member is Server (un)Muted - Not reliable',
		color: CssColors.yellow,
		function: async ([newState], audit) => {
			return {
				author: `Member server ${newState.serverMute?'':'un'}muted`,
				fields: [
					['Member:', newState.member],
					['Channel:', newState.channel],
					['Muted:', newState.serverMute ? 'Yes' : 'No']
				],
				color: newState.serverMute ? CssColors.red : CssColors.green
			}
		}
	},
	voiceDeaf: {
		cleanName: 'Server Deafened',
		decription: 'Emits whenever a member is Server (un)Deafened - Not reliable',
		color: CssColors.yellow,
		function: async ([newState], audit) => {
			return {
				author: `Member server ${newState.serverDeaf?'':'un'}deafened`,
				fields: [
					['Member:', newState.member],
					['Channel:', newState.channel],
					['Muted:', newState.serverDeaf ? 'Yes' : 'No']
				],
				color: newState.serverDeaf ? CssColors.red : CssColors.green
			}
		}
	}
};
const Select = {
		Channel: ({ cls = 'channelSelect', voice = false, set, hint, guild }) => {
			let channelSelect = newDiv('select', cls),
				selected = false;
			channelSelect.append(...guild.channels.cache.array().filter(c => voice ? ['voice'] : ['text', 'news'].includes(c.type)).sort((a, b) => a.rawPosition - b.rawPosition)
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
			channelSelect.append(...guild.roles.cache.array().sort((a, b) => b.position - a.position)
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
	Page = {
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

			create.innerHTML = 'Create a new command';

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
					previewDiv.innerHTML = (embed ? [rule.content.ttl, rule.content.desc, rule.content.ftr.nm].filter(x => x).join(' - ') : content).substr(0, 90);

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

			commandList.append(...commands.map(({ com, des, beUsed, format }) => {
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
				sum.innerHTML = `${dataBaseGuild.command(com)} ${format}`;
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


			page.append(
				prefixTitle, setPrefixDiv,
				commandsTitle, commandSettings,
				rulesTitle, create, rules,
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
				channelSelect = Select.Channel({ set: dataBaseGuild.Tickets.channel, hint: 'support', guild }),
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
				h6('Support Team Role', infoPopup('The role that will be able to read and write in the support channel and will be pinged when a support channel is created')),
				staffSelect,
				h6('Support Channel', infoPopup('The channel where the members will be able to open a new support channel')),
				channelSelect,
				h6('Parent Category', infoPopup('This is where the created support channel will be put')),
				parentSelect,
				h6("Ticket Name<i>Use <code>{u}</code> for the members's username</i>", infoPopup('The name the created channel will be given')),
				ticketName
			);


			selected = false;
			parentSelect.innerHTML = '<option class="global" value="0">Global</option>';
			guild.channels.cache.array().filter(c => c.type == 'category').sort((a, b) => a.rawPosition - b.rawPosition).forEach(c => {
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
			guild.roles.cache.array().sort((a, b) => b.position - a.position).forEach(r => {
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
				h6('Custom Message', infoPopup('This embeded message will be sent in your chosen support channel. Your members can then react with your chosen emoji to open a new support channel. Discord formatting does apply')),
				embed);

			let advanced = newDiv('div', 'advanced'),
				advancedH5 = newDiv('h5');
			embed = newDiv('div', 'embed', 'start'), author = newDiv('div', 'author'), content = newDiv('div', 'content'), footer = newDiv('div', 'footer');


			advanced.append(
				advancedH5,
				h6('Custom Opening Message', infoPopup('This embeded message will be sent in the support channel as soon as the channel is opened. Anyone can then react to this message with ❌ to close it. Discord formatting does apply')),
				embed);
			embed.append(author, content, footer);


			content.setAttribute('contentEditable', ''), footer.setAttribute('contentEditable', '');


			author.innerHTML = dataBaseGuild.Tickets.author || 'Support';
			content.innerHTML = dataBaseGuild.Tickets.messages?.start?.content || `Welcome to ${guild.name}'s Support\nOnly you and the Support Team can see, read and write in this channel`;
			footer.innerHTML = dataBaseGuild.Tickets.messages?.start?.footer || `Press ❌ to close this support channel`;

			embed = newDiv('div', 'embed', 'end'), author = newDiv('div', 'author'), content = newDiv('div', 'content');

			advanced.append(h6('Custom Closing Message', infoPopup('This embeded message will be sent in the support channel when someone press ❌. Discord formatting does apply')),
				embed);
			embed.append(author, content);
			content.setAttribute('contentEditable', '');

			author.innerHTML = dataBaseGuild.Tickets.author || 'Support';
			content.innerHTML = dataBaseGuild.Tickets.messages?.end || `**Are you sure you want to close this support channel?**\nYes, I want to close: ✅\nNo, I want to continue: ❎`;

			embed = newDiv('div', 'embed', 'save'), author = newDiv('div', 'author'), content = newDiv('div', 'content');
			let saveOption = newDiv('input', 'saveOption');
			saveOption.setAttribute('type', 'range'), saveOption.setAttribute('min', '0'), saveOption.setAttribute('max', '2');
			let val = ['always', 'ask', 'never'].indexOf(dataBaseGuild.Tickets.save);
			saveOption.setAttribute('value', val == -1 ? 1 : val);
			// ['always', 'ask', 'never'] - Default = 'ask'

			advanced.append(h6('Custom Confirm Message', infoPopup('This embeded message will ask you if you want to save the transcript of the channel or if you want to close it. Discord formatting does apply')),
				saveOption, embed);
			embed.append(author, content);
			content.setAttribute('contentEditable', '');

			author.innerHTML = dataBaseGuild.Tickets.author || 'Support';
			content.innerHTML = dataBaseGuild.Tickets.messages?.save || `**The member can no longer see this channel**\nClose this channel permanently: ❎\Save this channel's transcript: 💾`;
			// embed = newDiv('div', 'embed', 'close');author = newDiv('div', 'author');content = newDiv('div', 'content');advanced.append(h6('Custom Close Message', infoPopup('This embeded message will be sent if someone wants to download the transcript to close the channel, by reacting with ❌')),	embed);embed.append(author, content);content.setAttribute('contentEditable', '');author.innerHTML = dataBaseGuild.Tickets.author || 'Support';content.innerHTML = dataBaseGuild.Tickets.messages?.close || `Press ❌ to close this support channel`;

			ticketDiv.append(advanced, set);

			resolver([page, title, id, 'support']);
		}),
		voice: (guild, title, id) => new Promise(async resolver => {
			let dataBaseGuild = DataBase.guilds[guild.id] || {};
			dataBaseGuild.VoiceRules = dataBaseGuild.VoiceRules || [];
			dataBaseGuild.VoiceRules = dataBaseGuild.VoiceRules.filter(r => r.channel && r.channelname);
			let page = await basePage({ id, title }),
				rules = newDiv('rules'),
				create = newDiv('create');
			page.append(create, rules);
			create.innerHTML = 'Create a new dynamic voice channel';

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
			page.append(rules);

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
			guild.channels.cache.array().filter(c => ['text', 'news'].includes(c.type)).sort((a, b) => a.rawPosition - b.rawPosition).forEach(c => {
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
				h6('Toggle Logging', infoPopup("Toggle the whole log system")),
				toggle,
				h6('Log Channel', infoPopup("This is where the logs will be sent")),
				channelSelect, newDiv('div', 'set'),
				h6('Audit Logs', infoPopup("Toggle whether the bot should log senistive information, such as who it was that did something or what invite a member joined with")),
				auditToggle,
				// h6('Embed Color', infoPopup("This is the color that will be displayed on the log message's left border<div class='embed' style='border-color:#dbad11'>This border:<br>&lt; &lt; &lt;</div>")),
				// colorDiv, newDiv('div', 'set'),
				h6('Toggle', infoPopup("Toggle what you want to be logged")),
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
							roleH6 = h6('Moderator Role', infoPopup((dataBaseGuild.prefix || DefaultPrefix) + x)),
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
					h6('Toggle Moderation Commands', infoPopup("Toggle all moderation commands")),
					newToggle(Rule.enabled),

					h6('Records Channel', infoPopup("The channel where all penalties will be displayed")),
					Select.Channel({ set: Rule.channel, hint: ['crime', 'regist', 'penalt', 'straff', 'brott'], guild }),

					h6('Moderator Role', infoPopup("Every member with this role and everyone with admin permission can call every moderator command")),
					Select.Role({ set: Rule.staff, hint: ['staff', 'mod', 'admin'], guild }),

					h6('Toggle Moderation Logs', infoPopup("If enabled, the bot will log every moderation action and show it here on the website. [Coming soon; the logs will be saved but you cannot display them yet]")),
					newToggle(Rule.logsEnabled, 'toggle', 'log'),

					h6('Ban-Message', infoPopup("Whenever a user is banned, this message will be sent as a description in an embeded direct message after the messege containing the reason. Tip: This can be used to send out a form that a banned user can fill in if they think they were banned wrongly. Discord formatting does apply")),
					messageFrom,
					banMessage,

					h6('Dm Everytime', infoPopup("If enabled, the bot will send the Ban-Message to the punished/warned member no matter what penalty they recived. If disabled, the bot will only send a direct message to the member if they've been banned or temporarily banned")),
					newToggle(Rule.dmAll, 'toggle', 'dm'),

					h6('Dm Server Invite', infoPopup("If enabled, the bot will send a server invite to the punished member if they were temporarily banned, kicked or unbanned. The bot will create the invite directing to the selected channel or use an already existing invite created by the bot")),
					newToggle(Rule.dmInvite, 'toggle', 'invite'),

					h6('Tell Who Issued The Penalty', infoPopup("If enabled, the bot will tell the member which moderator issued the penalty")),
					newToggle(Rule.tellWho, 'toggle', 'tellwho'),

					h6('Muted Role', infoPopup("The role muted people will get. This role were created by the bot the first time someone is muted on your server. This role will have the <code>Send messages</code> permission disabled in every text channel except Support Channels")),
					mutedDisplay,

					h6('Penalty Message', infoPopup("This embeded message will be sent in you chosen Records Channel. Every<y>yellow</y>field is customizeble")),
					embed,

					comSettings,
					scrollbar,

					newDiv('div', 'set')
					// auto: contentFilter, caps, spam, emoji
				)
			}


			page.append(
				// prefixTitle, setPrefixDiv,
				modTitle, modSettings,
				logsTitle, logSetting
				// ,commandsTitle, commandSettings
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

			setupTitle.innerHTML = 'Setup';
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
				channels = channel => guild.channels.cache.array().filter(c => ['text', 'news'].includes(c.type)).sort((a, b) => a.rawPosition - b.rawPosition).map(c => {
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
				h6('Support Team Role', infoPopup('The role that will be able to delete and respond to suggestions')),
				staffSelect,
				h6('Suggest Channel', infoPopup('The channel where the members will be able to submit their suggestions. This is also where members will be able to vote on what suggestions they think should be approved')),
				suggestChannelSelect,
				h6('Respond Channel', infoPopup('The channel where the Support Team will be able to submit their responds. This is where the Support Team\'s responses will be sent')),
				responseChannelSelect,
				h6('Embed Config', infoPopup('Customize how you want the embeded messages to look like. Every<y>yellow</y>field is customizeble')),
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

			resolver([page, title, id, 'suggestions']);
		})
	},
	commands = [{
			com: 'adduser',
			des: 'Used by staff to Add a user to a Support Channel',
			beUsed: 'in support channels if enabled', //  "Can be used " + beUsed  -  default = 'anywhere'
			format: '[user]' // prefix + command + format
		}, {
			com: 'removeuser',
			des: 'Used by staff to Remove a user from a Support Channel',
			beUsed: 'in support channels if enabled',
			format: '[user]'
		}, {
			com: 'suggest',
			des: 'Used by members to submit a Suggestion',
			beUsed: 'in the suggestion channels if enabled',
			format: '[suggestion]'
		}, {
			com: 'approve',
			des: 'Used by staff to approve a Suggestion',
			beUsed: 'in the suggestion channels if enabled',
			format: '[id] [reason]'
		}, {
			com: 'deny',
			des: 'Used by staff to deny a Suggestion',
			beUsed: 'in the suggestion channels if enabled',
			format: '[id] [reason]'
		}, {
			com: 'consider',
			des: 'Used by staff to consider a Suggestion',
			beUsed: 'in the suggestion channels if enabled',
			format: '[id] [reason]'
		}, {
			com: 'echo',
			des: 'Used by admin to send message through the bot. The bot copies what you say',
			format: '[anything]'
		},

		{
			com: 'infractions',
			des: 'Used by Moderators to get a member\'s last 10 logged infractions',
			format: '[user]'
		}, {
			com: 'warn',
			des: 'Used by command-specific role or admin to warn a member',
			format: '[user] [?reason]',
			txt1: 'warn',
			txt: 'warned'
		}, {
			com: 'kick',
			des: 'Used by command-specific role or admin to kick a member',
			format: '[user] [?reason]',
			txt1: 'kick',
			txt: 'kicked'
		}, {
			com: 'ban',
			des: 'Used by command-specific role or admin to ban a member',
			format: '[user] [?reason]',
			txt1: 'ban',
			txt: 'banned'
		}, {
			com: 'unban',
			des: 'Used by command-specific role or admin to unban a member',
			format: '[user] [?reason]',
			txt1: 'unban',
			txt: 'unbanned'
		}, {
			com: 'tempban',
			des: 'Used by command-specific role or admin to temporarily ban a member',
			format: '[user] [duration] [?reason]',
			txt1: 'temporarily ban',
			txt: 'temporarily banned'
		}, {
			com: 'mute',
			des: 'Used by command-specific role or admin to mute a member',
			format: '[user] [?reason]',
			txt1: 'mute',
			txt: 'muted'
		}, {
			com: 'unmute',
			des: 'Used by command-specific role or admin to unmute a member',
			format: '[user] [?reason]',
			txt1: 'unmute',
			txt: 'unmuted'
		}, {
			com: 'tempmute',
			des: 'Used by command-specific role or admin to temporarily mute a member',
			format: '[user] [duration] [?reason]',
			txt1: 'temporarily mute',
			txt: 'temporarily muted'
		}
	],
	encodeT = n => Math.round((n || Date.now()) / 6e4 - 271e5), // Date ->  T
	decodeT = (n, parse = false) => { //            T   -> Date
		n = new Date((n + 271e5) * 6e4);
		if (parse) n = moment(n).format('DD/MM - hh:mm');
		return n
	},
	nextChar = (s, n) => s.split('').reverse().map(c => String.fromCharCode(c.charCodeAt(0) + n)).join(''),
	encryptString = s => nextChar(s, 3),
	decryptString = s => nextChar(s, -3);

const moderationEmbed = (action, member, Reason, { reason, hasBeen, duration, color, txt, until }, Duration, Until) => {
		let { user = member } = member; // user = User | Id;  member = Member | Id
		let embed = {
			author: { name: `${user.tag||user} ${hasBeen} ${txt}`, icon_url: user.tag && user.displayAvatarURL() },
			fields: Reason ? [{ name: reason, value: Reason }] : [],
			color: parseInt(color, 16),
		};
		if (Duration && Until) {
			embed.footer = { text: `${capital(txt.split(" ").pop())} ${until}` };
			embed.timestamp = Until;
			embed.fields.push({ name: duration, value: CleanDate(Duration) }) //  moment(until).toNow(true)
		};
		return ({ embed });
	},
	moderationDmEmbed = async (action, { text, reason, member, tellWho, staff, guild, banMessage, dmInvite }, ftrTxt, timestamp) => [dmInvite, {
		embed: {
			author: { name: `${(member.user?.tag||member.tag)||member} ${text.hasBeen} ${text.txt} ${tellWho? `${text.by} ${((await guild.members.fetch(staff))?.user?.tag||staff)}`:''}` },
			fields: [reason && { name: text.reason, value: reason }, banMessage && { name: text.messageFrom, value: banMessage }].filter(x => x),
			color: parseInt(text.color, 16),
			footer: { text: ftrTxt || guild.name, icon_url: guild.iconURL() },
			timestamp
		}
	}].filter(x => x)
// moderationEmbed(action, member, reason, text, duration)

moderationCommands = { // logs.push -> { type, reason, staff, member, date, duration }
		//  {
		// 	member,	reason, channel,
		//  staff, logs, text, guild,
		//  dmInvite, dmAll, banMessage, tellWho,
		// duration, until,
		// ?muted, ?duration
		// 	}
		warn: {
			function: async ({ member, reason, channel, staff, logs, text, guild, dmAll, banMessage, tellWho }) => {
				channel.send(moderationEmbed(text.txt, member, reason, text));
				logs.push({ t: 'warn', s: staff.id, r: reason, m: member.id, d: encodeT() });
				await member.send(...await moderationDmEmbed(text.txt, { text, reason, member, tellWho, staff, guild, banMessage: dmAll && banMessage }));
			}
		},
		kick: {
			function: async ({ member, reason, channel, staff, logs, text, dmInvite, guild, banMessage, tellWho }) => {
				await member.kick(reason);
				channel.send(moderationEmbed(text.txt, member, reason, text));
				logs.push({ t: 'kick', s: staff.id, r: reason, m: member.id, d: encodeT() });
				await member.send(...await moderationDmEmbed(text.txt, { text, reason, member, tellWho, staff, guild, banMessage, dmInvite }));
			}
		},
		ban: {
			function: async ({ member, reason, channel, staff, logs, text, guild, banMessage, tellWho }) => {
				//member = Member|id
				let banMember = await guild.members.ban(member, { reason }); // Any: Member|User|Id
				if (!(member instanceof Discord.GuildMember)) {
					member = banMember;
					if (typeof member == "string")
						member = await client.users.fetch(member)
						.then(user => ({ user, id: user.id, send: user.send }))
						.catch(e => ({ id: member, user: member, send: () => console.error('Banned member not found') }))
					if (member instanceof Discord.User)
						member = { user: member, id: member.id };
					member.send = member.send || member.user?.send;
				}

				// await member.ban({ reason });
				channel.send(moderationEmbed(text.txt, member, reason, text));
				logs.push({ t: 'ban', s: staff.id, r: reason, m: member.id, d: encodeT() });
				try {
					await member.send(...await moderationDmEmbed(text.txt, { text, reason, member, tellWho, staff, guild, banMessage }));
				} catch (e) { console.error(e.message) }
			}
		},
		unban: {
			function: async ({ member, reason, channel, staff, logs, text, dmInvite, guild, banMessage, tellWho }) => {
				//member = id
				let user = await guild.members.unban(member, reason);
				// member = await guild.members.fetch(member);

				channel.send(moderationEmbed(text.txt, { user }, reason, text));
				logs.push({ t: 'unban', s: staff.id, r: reason, m: user.id, d: encodeT() });
				await user.send(...await moderationDmEmbed(text.txt, { text, reason, member: user, tellWho, staff, guild, banMessage, dmInvite }));
			}
		},
		tempban: {
			function: async ({ member, reason, channel, staff, logs, text, dmInvite, guild, dmAll, banMessage, duration, until, tellWho }) => {
				//member = Member|id
				let banMember = await guild.members.ban(member, { reason }); // Any: Member|User|Id
				DataBase.temp.push({ g: guild.id, m: member.id, type: 'ban', until: +until });
				setTimeout(() => guild.members.unban(member.id, 'Temporarily ban expired' + (reason ? ` - Ban reason: ${reason}` : '')), duration * 1000);

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
				logs.push({ t: 'ban', s: staff.id, r: reason, m: member.id, d: encodeT(), dur: duration, unt: encodeT(until) });
				try {
					await member.send(...await moderationDmEmbed(text.txt, { text, reason, member, tellWho, staff, guild, banMessage, dmInvite }, 'Banned until', until));
				} catch (e) { console.error(e.message) }
			}
		},
		mute: {
			function: async ({ member, reason, channel, staff, logs, muted, text, guild, dmAll, banMessage, tellWho }) => {
				// console.log({ muted });
				await member.roles.add(muted, reason);
				channel.send(moderationEmbed(text.txt, member, reason, text));
				logs.push({ t: 'mute', s: staff.id, r: reason, m: member.id, d: encodeT() });
				await member.send(...await moderationDmEmbed(text.txt, { text, reason, member, tellWho, staff, guild, banMessage: dmAll && banMessage }));
			}
		},
		unmute: {
			function: async ({ member, reason, channel, staff, logs, muted, text, guild, dmAll, banMessage, tellWho }) => {
				await member.roles.remove(muted, reason);
				channel.send(moderationEmbed(text.txt, member, reason, text));
				logs.push({ t: 'unmute', s: staff.id, r: reason, m: member.id, d: encodeT() });
				await member.send(...await moderationDmEmbed(text.txt, { text, reason, member, tellWho, staff, guild, banMessage: dmAll && banMessage }));
			}
		},
		tempmute: {
			function: async ({ member, reason, channel, staff, logs, muted, text, guild, dmAll, banMessage, duration, until, tellWho }) => {
				await member.roles.add(muted, reason);
				DataBase.temp.push({ g: guild.id, m: member.id, type: 'mute', until: +until, role: muted });
				setTimeout(() => member.roles.remove(muted, 'Temporarily mute expired' + (reason ? ` - Mute reason: ${reason}` : '')), duration * 1000);

				channel.send(moderationEmbed(text.txt, member, reason, text, duration, until));
				logs.push({ t: 'mute', s: staff.id, r: reason, m: member.id, d: encodeT(), dur: duration, unt: encodeT(until) });

				await member.send(...await moderationDmEmbed(text.txt, { text, reason, member, tellWho, staff, guild, banMessage: dmAll && banMessage }, 'Muted until', until));
			}
		}
	},
	// GetPopup = (obj, Preset) => { /*Preset: {<name>: {type: <attr>, value: <value>}}*/	let form = newDiv('form');	if (obj.displayPrefix) form.setAttribute('prefix', '');	if (obj.id) form.id = obj.id;	if (obj.title) {		let title = newDiv('h1');		title.innerHTML = obj.title;		form.append(title);	}	obj.fields.forEach(fieldObj => {		let field = newDiv(fieldObj.type || 'input', ...(fieldObj.classList || []));		if (fieldObj.name) field.name = fieldObj.name;		if (fieldObj.placeholder) field.placeholder = fieldObj.placeholder;		if (fieldObj.value) field.setAttribute('value', fieldObj.value);		if (fieldObj.innerHTML) field.innerHTML = fieldObj.innerHTML;		if (fieldObj.append) field.append(fieldObj.append);		if (fieldObj && fieldObj.attributes && fieldObj.attributes[0] && fieldObj.attributes[0][0])			fieldObj.attributes.forEach(attr => field.setAttribute(attr[0], attr[1] || ''));		if (Preset && fieldObj.name && Object.keys(Preset).includes(fieldObj.name)) {			let value = Preset[fieldObj.name];			field[value.type || 'value'] = value.value || value;			field.setAttribute(value.type || 'value', value.value || value);		}		form.append(field);	});	return form;},
	infoPopup = txt => {
		let i = newDiv('i', 'info'),
			popupPar = newDiv('div'),
			popup = newDiv('div');
		popup.innerHTML = txt;
		i.append(popupPar);
		popupPar.append(popup);
		return i;
	},
	newToggle = (on, ...classList) => {
		let toggle = newDiv('label', ...classList),
			checkbox = newDiv('input');
		checkbox.type = 'checkbox';
		toggle.append(checkbox, newDiv());
		if (on) checkbox.setAttribute('checked', '');
		return toggle;
	},
	Startcollector = {},
	AllMessages = channel => new Promise(async resolver => {
		let messages = [],
			temp;
		do {
			let last = messages.map(x => x).reverse()[0]?.id;
			temp = (await channel.messages.fetch({ before: last, limit: 100 }).catch(e => null))?.array();
			if (temp) messages.push(...temp);
		} while (temp?.length == 100);
		resolver(messages)
	}),
	startMsgSetup = (startMsg, guildID, u) => {
		startMsg.react('❌');
		let DataBaseGuild = DataBase.guilds[guildID],
			Rule = DataBaseGuild.Tickets,
			ticketChannel = startMsg.channel,
			guild = ticketChannel.guild,
			embedTemplate = {
				color: parseInt(Rule.color.slice(1), 16),
				author: { name: Rule.author }
			},
			reactFilter = e => (r, u) => [...e].includes(r.emoji.name) && !r.me;

		startMsg.channel.createMessageCollector(m => m.content.startsWith(DataBaseGuild.prefix || DefaultPrefix)).on('collect', m => {
			let command = m.content.substr(1),
				mentions = m.mentions.users.array(),
				pings = mentions.join(', ');

			if (command.startsWith(DataBaseGuild.command('adduser'))) {
				m.delete();
				mentions.forEach(user => m.channel.updateOverwrite(user, { VIEW_CHANNEL: true }));
				startMsg.channel.send({
					embed: {
						...embedTemplate,
						description: DataBaseGuild.Tickets.messages?.userAdded?.replace(/{p}/, pings) || `**${pings}** added to this Channel`
					}
				});
				client.emit('ticketAddUser', pings, m.author, m.channel);

			} else if (command.startsWith(DataBaseGuild.command('removeuser'))) {
				m.delete();
				mentions.forEach(userId => m.channel.updateOverwrite(userId, {
					VIEW_CHANNEL: false
				}));
				startMsg.channel.send({
					embed: {
						...embedTemplate,
						description: DataBaseGuild.Tickets.messages?.userRemoved?.replace(/{p}/, pings) || `**${pings}** removed from this Channel`
					}
				});
				client.emit('ticketRemoveUser', pings, m.author, m.channel);
			}
		});

		startMsg.createReactionCollector(reactFilter('❌')).on('collect', async r => { //
			r.remove().then(x => startMsg.react('❌'));
			let endMsg = await ticketChannel.send({
				embed: {
					...embedTemplate,
					description: DataBaseGuild.Tickets.messages?.end || `**Are you sure you want to close this support channel?**\nYes, I want to close: ✅\nNo, I want to continue: ❎`
				}
			});
			endMsg.react('✅').then(() => endMsg.react('❎'));

			let [endRes, preClosedBy] = await new Promise(resolver => endMsg.createReactionCollector(reactFilter('✅❎')).on('collect', (...a) => resolver(a)));
			endMsg.delete();
			if (endRes.emoji.name == '✅') {
				await ticketChannel.overwritePermissions([{
					id: guild.roles.everyone.id,
					deny: 1024
				}, {
					id: Rule.staff,
					allow: 1024
				}])
				if (!u) var u;

				let endTicket = async (save, closedBy = preClosedBy) => {
					// closedBy = closedBy || preClosedBy;
					ticketChannel.delete(`Support Channel closed by: ${closedBy.tag||'Unknown'}`);
					let { Tickets } = DataBaseGuild;
					Tickets.ticketsCreated = Tickets.ticketsCreated.filter(id => id != ticketChannel.id);

					if (save) {
						Tickets.transcripts = (Tickets.transcripts || []).filter(x => x);
						let messages = await AllMessages(ticketChannel);
						//parseT = n => Math.round(n / 6e4 - 271e5),


						if (messages.some(m => !m.author.bot))
							Tickets.transcripts.push({
								id: Date.now() - 16e11,
								channelName: ticketChannel.name,
								closedBy: closedBy.id,
								msgs: messages.reverse().map((m, i) => {
									let t = encodeT(m.createdTimestamp),
										c, a, f, e = m.embeds[0];

									if (m.content) c = encryptString(m.cleanContent || m.content);
									else if (e?.type == 'rich') c = {
										athr: e.author?.name || undefined,
										ttl: e.title || undefined,
										desc: e.description || undefined,
										ftr: e.footer?.text || undefined,
									}
									else if (!m.attachments.first()) return false;

									a = m.author.id;
									if (m.attachments.first()) f = m.attachments.array().map(a => [a.name, a.url]);
									return { a, c, t, f }
								}).filter(x => x),
								closeAt: encodeT(Date.now() + 6048e5), //1w
								fromto: [encodeT(ticketChannel.createdTimestamp), encodeT()]
							})
					};

					WriteDataBase();

					client.emit('ticketEnd', ticketChannel, closedBy, save);
				}

				console.log({ save: DataBaseGuild.Tickets.save });
				if (DataBaseGuild.Tickets.save == 'always') endTicket(true)
				else if (DataBaseGuild.Tickets.save == 'never') endTicket(false)
				else {
					let saveMsg = await ticketChannel.send({
						embed: {
							...embedTemplate,
							description: DataBaseGuild.Tickets.messages?.save || `**The member can no longer see this channel and the channel is about to close**\nClose this channel: ❎\nClose this channel and save it's transcript: 💾`
						}
					});
					saveMsg.react('❎').then(() => saveMsg.react('💾'));

					saveMsg.createReactionCollector(reactFilter('❎💾')).on('collect', async (saveRes, closedBy) =>
						endTicket(saveRes.emoji.name == '💾', closedBy)); // text = messages.map(m => `[${m.createdAt.toLocaleString('sv')}] [${m.author.tag}] - ${m.cleanContent||m.embeds[0]?.description||''}`).reverse().join('\n'),buffer = Buffer.from(text);await ticketChannel.send(new Discord.MessageAttachment(buffer, `${ticketChannel.name}.txt`));let closeMsg = await ticketChannel.send({embed: {...embedTemplate,description: DataBaseGuild.Tickets.messages?.close || `Press ❌ to close this support channel`}});closeMsg.react('❌');await new Promise(resolver => closeMsg.createReactionCollector(reactFilter('❌')).on('collect', resolver));     delete DataBaseGuild.Tickets.ticketsCreated[DataBaseGuild.Tickets.ticketsCreated.indexOf(ticketChannel)];
				}
			}
		}) //❌
	},
	TicketSetup = async guildID => {
			let DataBaseGuild = DataBase.guilds[guildID],
				Rule = DataBaseGuild.Tickets;
			try {
				var guild = await client.guilds.fetch(guildID),
					channel = await client.channels.fetch(Rule.channel);
			} catch {
				return;
			}
			let embedTemplate = {
					color: parseInt(Rule.color.slice(1), 16),
					author: {
						name: Rule.author
					}
				},
				embed = {
					...embedTemplate,
					description: Rule.content
				},
				reactMessage = Rule.existingMessage ? await channel.messages.fetch(Rule.existingMessage).catch(x => false) : false,
				reactFilter = e => (r, u) => [...e].includes(r.emoji.name) && !r.me;

			if (reactMessage)
				reactMessage.edit({
					embed
				})
			else
				reactMessage = await channel.send({
					embed
				});
			DataBaseGuild.Tickets.existingMessage = reactMessage.id;
			WriteDataBase();

			reactMessage.reactions.removeAll().then(m => m.react(Rule.emoji));
			Startcollector[guildID] = reactMessage.createReactionCollector(reactFilter(Rule.emoji)).on('collect', async (r, u) => {
				r.remove().then(x => reactMessage.react(Rule.emoji))


				let channelname = Rule.name ? Rule.name.replace(RegExp('{u}', 'g'), u.username).substr(0, 100) : `support-${u.username}`;

				let ticketChannel = await guild.channels.create(channelname, {
					topic: `Support Channel created by ${u.tag} - ${moment(new Date()).format('D/M-YYYY - hh:mm')}`,
					parent: +Rule.parent ? Rule.parent : null,
					// reason: `Support Channel Created By ${u.tag} - ${new Date().toLocaleString('sv')}`,
					permissionOverwrites: [{
						id: guild.roles.everyone.id,
						deny: 1024,
						allow: 383040
					}, {
						id: u.id,
						allow: 3072
					}, {
						id: Rule.staff,
						allow: 1024
					}]
				});
				if (!DataBaseGuild.Tickets.ticketsCreated) DataBaseGuild.Tickets.ticketsCreated = [];
				DataBaseGuild.Tickets.ticketsCreated.push(ticketChannel.id);
				client.emit('ticketStart', u, ticketChannel, guild);

				WriteDataBase()
				let startMsg = await ticketChannel.send({
					embed: {
						...embedTemplate,
						description: DataBaseGuild.Tickets.messages?.start?.content || `Welcome to ${guild.name}'s Support\nOnly you and <@&${Rule.staff}> can see, read and write in this channel`,
						footer: {
							text: DataBaseGuild.Tickets.messages?.start?.footer || `Press ❌ to close this support channel`
						}
					}
				});
				ticketChannel.send(`<@&${Rule.staff}>`);
				startMsgSetup(startMsg, guildID, u);
			}); //💬

			// "enabled": true,"channel": "798590264511037450","staff": "825378302579048448","author": "tesst au2","content": "By clicking 💬 tesst3","emoji": "","color": "#5dac79","existingMessage": "827248807896809542"
		}, Suggest = {
			//	Suggestions: { enabled: true, channels: { suggest: '83730873837', response: '83730873874' }, staff: '9476457896', index: 4, embed: { suggestion: 'Suggestion', reasonFrom: 'Reason from', approve: 'Approved', deny: 'Denied', consider: 'Considered', up: '⬆️', /*upvote*/ down: '⬇️', /*downvote*/ colors: { pending: CssColors.gray, approve: CssColors.green, deny: CssColors.red, consider: CssColors.yellow } }, suggestions: { 1: { user: '83730873837', /*member ID*/ suggestion: '', msg: '97697567046', /*msg ID*/ answer: { user: '97697567046', /*staffmember ID*/ reason: '', status: 'consider' / 'approve' / 'deny' } } } },
			suggest: (guild, member, suggestion) => new Promise(async (resolver, reject) => {
				try {
					if (!(guild && member && suggestion)) throw 1;
					let Rule = DataBase.guilds[guild.id].Suggestions,
						index = +Rule.index || 1,
						channel = await client.channels.fetch(Rule.channels.suggest)
					// .catch(e => null);	if (!channel) throw 2;

					let msg = await channel.send({
						embed: {
							color: parseInt(Rule.embed.colors.pending, 16),
							author: {
								iconURL: member.displayAvatarURL(),
								name: member.tag
							},
							title: `${Rule.embed.suggestion} #${index}`,
							description: suggestion
						}
					});

					msg.react(Rule.embed.up || '⬆️').then(() => msg.react(Rule.embed.down || '⬇️'));


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
				//responseType == ['approve', 'deny', 'consider']
				try {
					if (!(guild && reason && +index && responseType)) throw 1;
					let Rule = DataBase.guilds[guild.id].Suggestions,
						suggestion = Rule.suggestions[index],
						channel = await client.channels.fetch(Rule.channels.response),
						member = await guild.members.fetch(suggestion.user);

					let msg = await channel.send({
							embed: {
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
							}
						}),
						suggestChannel = await client.channels.fetch(Rule.channels.suggest).catch(e => null);

					if (suggestChannel) suggestChannel.messages.fetch(suggestion.msg).catch(e => null).then(suggestionMsg =>
						suggestionMsg && suggestionMsg.edit({
							embed: {
								...suggestionMsg.embeds[0],
								color: parseInt(Rule.embed.colors[responseType], 16)
							}
						}));

					suggestion.answer = {
						type: responseType,
						user: user.id,
						reason
					}

					resolver(msg);
					WriteDataBase();

				} catch (e) {
					reject(e);
				}
			})
		},
		MutedPermissions = async role => {
			if (role && role instanceof Discord.Role) {
				let { guild } = role,
				DataBaseGuild = DataBase.guilds[guild.id], { ticketsCreated } = DataBaseGuild.Tickets,
					channels = guild.channels.cache.array().filter(c => !c.permissionOverwrites.has(role.id) && c.type != 'category' && !ticketsCreated.includes(c.id)); //&&c.permissionsFor(role).bitfield
				console.log(channels.map(c => c.name));
				return Promise.all(channels.map(channel =>
					channel.isText() ?
					channel.createOverwrite(role, { SEND_MESSAGES: false }, 'Muted Role Setup') :
					channel.createOverwrite(role, { CONNECT: false }, 'Muted Role Setup')
				));
			}
		};
let MaybeGuild, SupportServer;
// Array.prototype.diff = function(a) {
// 	return this.filter(x => !a.includes(x)).concat(a.filter(x => !this.includes(x)));
// }
Object.prototype.command = function(cmd) {
	this.commands = this.commands || {};
	return this.commands[cmd] || cmd
}


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

		// const AddCancel = [{	type: 'button',	classList: ['add'],	innerHTML: 'Add',	attributes: [		['disabled']	]}, { type: 'button', classList: ['cancel'], innerHTML: 'Cancel' }],AddTextCommandForm = {	id: 'textcommand',	displayPrefix: true,	title: 'Create A Text Command',	fields: [{		classList: ['command', 'inputField'],		name: 'command',		placeholder: 'command',		attributes: [			['validStatus', 0]		]	}, {		type: 'textarea',		classList: ['content', 'inputField'],		name: 'content',		placeholder: "Hey, I'm the Discord Bot!",		attributes: [			['validStatus', 0]		]	}, { type: 'h6', innerHTML: 'Allowed Roles' }, {		type: 'div',		classList: ['datalistRoles', 'inputField'],		name: 'roles',		attributes: [			['name', 'roles']		]	}, ...AddCancel]},AddVoiceForm = {	id: 'voice',	title: 'Create A Dynamic Voice Channel',	fields: [{ type: 'h6', innerHTML: 'Voice Channel', append: infoPopup('When a member joins whis channel, a new channel will be created and the member will be moved there') }, {		type: 'select',		classList: ['listVoiceChannel', 'inputField'],		name: 'channel',		attributes: [			['name', 'channel']		]	}, { type: 'h6', innerHTML: 'User Limit<i>0 = Unlimited</i>' }, {		classList: ['UserLimit', 'inputField'],		name: 'Userlimit',		attributes: [			['type', 'range'],			['min', '0'],			['max', '99'],			['value', '0']		]	}, { type: 'h5', classList: ['UserLimitDisplay'], innerHTML: '0' }, { type: 'h6', innerHTML: "Channel Name<i>Use <code>{i}</code> for the channel's index</i>", append: infoPopup('Permissions will be synced with the Channel inputted above') }, { classList: ['channelname', 'inputField'], name: 'channelname', value: 'Voice Channel #{i}' }, ...AddCancel]}; // { 	type: 'h6', 	innerHTML: "Permissions[WORK IN PROGRESS; DOESN'T WORK]<i>A number. <a href='https://discordapi.com/permissions.html' target='_blank'>Permission Calculator</a></i>", 	append: infoPopup('This will affect @everyone. Specific role permissions coming soon') }, { 	type: 'div', 	classList: ['perms'] },socket.on('ping', (x, fun) => fun(socket.discord.username));socket.on('guildPopup', (x, fun) => fun(Base64.encode(socket.id).replace(/=/g, '')));
		socket.on('NewGuildSubrcibe', (x, fun) => NewGuildSubrcibers.push([fun, socket.discord.id]));
		socket.on('GetPrefix', (x, fun) => fun(socket.GuildData?.prefix || DefaultPrefix, DefaultPrefix));
		socket.on('SetPrefix', (newPrefix, fun) => {
			if (/^\S$/i.test(newPrefix[0])) {
				socket.GuildData.prefix = newPrefix[0];
				fun(newPrefix[0]);
				WriteDataBase();
			} else fun(socket.GuildData.prefix || DefaultPrefix);
		});
		socket.on('Logout', (x, fun) => {
			try {
				if (Remebered.get(socket.LoginId)) Remebered.delete(socket.LoginId);
				fun(true)
			} catch (e) {
				console.error(e);
				fun(false)
			}
		});
		// socket.on('AddTextCommandPopup', (x, fun) => fun(GetPopup(AddTextCommandForm).outerHTML));socket.on('AddTextCommandRule', (data, fun) => {	try {		if (!socket.Guild) throw 0;		else {			data.command = data.command.trim();			data.content = data.content.trim();			if (data.roles) data.roles = data.roles.trim().split('|');			else data.roles = [socket.Guild.roles.everyone.id];			socket.GuildData.TextCommandRules = socket.GuildData.TextCommandRules || [];			if (!socket.GuildData.TextCommandRules.map(r => r.command).includes(data.command)) {				socket.GuildData.TextCommandRules.push(data);				WriteDataBase();				fun(data);			} else fun(false, 2)		}	} catch (e) {		fun(false, 1)	}});socket.on('ToggleTextCommandRule', data => {	let com = data.command,		guildCommands = socket.GuildData?.TextCommandRules?.map(x => x.command);	if (guildCommands && guildCommands.includes(com)) {		if (socket.GuildData.TextCommandRules[guildCommands.indexOf(com)]) {			socket.GuildData.TextCommandRules[guildCommands.indexOf(com)].disabled = data.checked == false;			WriteDataBase();		}	}});socket.on('RemoveTextCommandRule', (com, fun) => {	let guildCommands = socket.GuildData?.TextCommandRules?.map(x => x.command);	if (guildCommands && guildCommands.includes(com)) {		delete socket.GuildData.TextCommandRules[guildCommands.indexOf(com)];		socket.GuildData.TextCommandRules = socket.GuildData.TextCommandRules.filter(x => x);		WriteDataBase();		fun(true)	} else fun(false)});socket.on('EditTextCommandRulePopup', (Command, fun) => {	let guildCommands = socket.GuildData?.TextCommandRules?.map(y => y.command);	if (guildCommands && guildCommands.includes(Command)) {		let Rule = socket.GuildData.TextCommandRules[guildCommands.indexOf(Command)],			current = {				content: {					type: 'innerHTML',					value: Rule.content				},				command: {					value: Rule.command				}			};		if (Rule.roles) current.roles = {			value: Rule.roles.join('|')		};		fun(GetPopup(AddTextCommandForm, current).outerHTML) 	} else fun(false)});socket.on('EditTextCommandRule', (data, fun) => {	try {		if (!socket.GuildID) fun(false)		else {			data.command = data.command.trim();			data.content = data.content.trim();			if (data.roles) data.roles = data.roles.trim().split('|');			else data.roles = [socket.Guild.roles.everyone.id];			let guildCommands = socket.GuildData?.TextCommandRules?.map(y => y.command);			if (guildCommands && guildCommands.includes(data.oldCommand)) {				let index = guildCommands.indexOf(data.oldCommand);				delete data.oldCommand;				socket.GuildData.TextCommandRules[index] = data;				fun(data);				WriteDataBase();			}		}	} catch (e) {		fun(false)	}});
		socket.on('Datalists', (data, fun) => {
			let datalistChannels = {},
				datalistRoles = {},
				datalistVoice = {};
			socket.Guild.channels.cache.array().forEach(channel =>
				datalistChannels[channel.id] = {
					name: channel.name,
					id: channel.id
				});
			socket.Guild.channels.cache.array().filter(c => c.type == 'voice').forEach(channel =>
				datalistVoice[channel.id] = {
					name: channel.name,
					id: channel.id
				});
			socket.Guild.roles.cache.array().forEach(role => {
				datalistRoles[role.id] = {
					name: role.name,
					id: role.id
				};
				if (role.hexColor != '#000000') datalistRoles[role.id].color = role.hexColor;
			});
			fun({
				datalistChannels,
				datalistRoles,
				datalistVoice
			})
		});
		socket.on('EmojiList', (data, fun) => fun(EmojiList));
		// socket.on('AddVoicePopup', (x, fun) => fun(GetPopup(AddVoiceForm).outerHTML));socket.on('AddVoiceRule', (data, fun) => {	try {		/* console.log(socket.Guild.name, data);*/		if (!socket.Guild && !/\d{16,19}/.test(data.channel)) fun(false)		else {			data.channel = data.channel.trim();			data.Userlimit = +data.Userlimit.trim();			data.channelname = data.channelname.trim().replace(/\s\s+/g, ' ');			if (!data.Userlimit) delete data.Userlimit;			/* if (!+data.perms) delete data.perms;*/			socket.GuildData.VoiceRules = socket.GuildData.VoiceRules || [];			if (!socket.GuildData.VoiceRules.map(r => r.channel).includes(data.channel)) {				socket.GuildData.VoiceRules.push(data);				WriteDataBase();				fun(data);			} else fun(false, 2)		}	} catch (e) {		fun(false, 1)	}});socket.on('RemoveVoiceRule', (com, fun) => {	let guildCommands = socket.GuildData?.VoiceRules?.map(x => x.channelname);	if (guildCommands && guildCommands.includes(com)) {		delete socket.GuildData.VoiceRules[guildCommands.indexOf(com)];		socket.GuildData.VoiceRules = socket.GuildData.VoiceRules.filter(x => x);		fun(true)	} else fun(false)	console.log({		com,		guildCommands,		suc: guildCommands.includes(com)	});});socket.on('EditVoiceRulePopup', (channelId, fun) => {	let guildCommands = socket.GuildData?.VoiceRules?.map(y => y.channel);	/* console.log({guildCommands, channelId});	*/if (guildCommands && guildCommands.includes(channelId)) {		let Rule = socket.GuildData.VoiceRules[guildCommands.indexOf(channelId)],			current = {				channel: {					value: Rule.channel				},				Userlimit: {					value: Rule.Userlimit				},				channelname: {					value: Rule.channelname				}			};		/* console.log({current})*/		fun(GetPopup(AddVoiceForm, current).outerHTML) /* {<name>: {type: <attr>, value: <value>}}*/	} else fun(false)});socket.on('EditVoiceRule', (data, fun) => {	console.log('EditVoiceRule', data);	try {		if (!socket.GuildID) fun(false)		let guildCommands = socket.GuildData?.VoiceRules?.map(y => y.channel);		if (guildCommands && guildCommands.includes(data.oldCommand)) {			let index = guildCommands.indexOf(data.oldCommand);			data.channel = data.channel.trim();			data.channelname = data.channelname.trim().replace(/\s\s+/g, ' ');			delete data.oldCommand;			socket.GuildData.VoiceRules[index] = data;			fun(data);			WriteDataBase();		} else fun(false)	} catch (e) {		console.error('ERROR - ', e);		fun(false)	}});socket.on('ToggleVoiceRule', data => {	/* console.log(data);*/	let com = data.command,		guildCommands = socket.GuildData?.VoiceRules?.map(x => `${x.channelname}\n${x.channel}`);	/*	"Röst #{i}\n821469173535866972"	 console.log({guildCommands,com,i: socket.GuildData.VoiceRules[guildCommands.indexOf(com)]});*/	if (guildCommands && guildCommands.includes(com)) {		if (socket.GuildData.VoiceRules[guildCommands.indexOf(com)]) {			socket.GuildData.VoiceRules[guildCommands.indexOf(com)].disabled = data.checked == false;		/* if (fun) fun(data.checked != false);*/			WriteDataBase();		/* console.log(1);*/		}	}});
		socket.on('ToggleTickets', (data, fun) => {
			if (!socket.GuildData.Tickets) socket.GuildData.Tickets = {};
			socket.GuildData.Tickets.enabled = !socket.GuildData.Tickets.enabled;

			if (!socket.GuildData.Tickets.enabled && Startcollector[socket.GuildID]) {
				if (Startcollector[socket.GuildID]) Startcollector[socket.GuildID].message.delete();
				delete Startcollector[socket.GuildID];
			}
			fun(socket.GuildData.Tickets.enabled);
			WriteDataBase();
		});
		socket.on('TicketSettings', (data, fun) => {
			// console.log(data);
			if (!socket.GuildData.Tickets) socket.GuildData.Tickets = {};
			data.author = data.author.substr(0, 256);
			data.name = data.name.substr(0, 100);
			data.content = data.content.substr(0, 6000 - data.author.length);
			data.emoji = [...data.emoji][0];
			data.save = ['always', undefined, 'never'][+data.save]

			socket.GuildData.Tickets = {
				...socket.GuildData.Tickets,
				...data
			};
			fun(data);
			// console.log(Startcollector);
			if (Startcollector[socket.GuildID]) {

				if (socket.GuildData.Tickets.channel == Startcollector[socket.GuildID].message.channel.id) Startcollector[socket.GuildID]?.stop()
				else Startcollector[socket.GuildID].message.delete();
				delete Startcollector[socket.GuildID];
			}
			TicketSetup(socket.GuildID);
			WriteDataBase();
		});
		socket.on('ToggleLogRule', (rule, fun) => {
			try {
				if (!socket.GuildData.logs) socket.GuildData.logs = {};
				if (!socket.GuildData.logs.enabled) socket.GuildData.logs.enabled = [];

				let enabled = socket.GuildData.logs.enabled;
				if (enabled.includes(rule)) delete enabled[enabled.indexOf(rule)]
				else enabled.push(rule);

				socket.GuildData.logs.enabled = enabled.filter(Boolean);

				fun(enabled.includes(rule));
				WriteDataBase();

				// console.log({ rule, res: enabled.includes(rule), enabled, logs: socket.GuildData.logs});
			} catch (e) {
				fun(null, e)
			}
			// 						{logs: {
			// 								color: '#ffffff',
			// 								channel: 'ChannelID',
			// 								enabled: ['guildMemberAdd', 'inviteDelete', 'messageDelete'],
			// 								on: true
			// 							}}
		});
		socket.on('SetLogColor', (data, fun) => {
			try {
				if (!socket.GuildData.logs) socket.GuildData.logs = {};
				socket.GuildData.logs.color = data;
				fun();
				WriteDataBase();
			} catch (e) {
				fun(e)
			}
		});
		socket.on('SetLogChannel', (data, fun) => {
			try {
				if (!socket.GuildData.logs) socket.GuildData.logs = {};
				socket.GuildData.logs.channel = data;
				fun();
				WriteDataBase();
			} catch (e) {
				fun(e)
			}
		});
		socket.on('ToggleLog', (x, fun) => {
			try {
				if (!socket.GuildData.logs) socket.GuildData.logs = {};
				socket.GuildData.logs.on = !socket.GuildData.logs.on;

				fun(socket.GuildData.logs.on);
				WriteDataBase();
			} catch (e) {
				fun(null, e)
			}
		});
		socket.on('ToggleAuditLog', (x, fun) => {
			try {
				if (!socket.GuildData.logs) socket.GuildData.logs = {};
				socket.GuildData.logs.audit = !socket.GuildData.logs.audit;

				fun(socket.GuildData.logs.audit);
				WriteDataBase();
			} catch (e) {
				fun(null, e)
			}
		});
		socket.on('SetCommand', (data, fun) => {
			try {
				if (!socket.GuildData.commands) socket.GuildData.commands = {};
				if (commands.map(c => c.com).includes(data.ori)) {
					socket.GuildData.commands[data.ori] = data.new.substr(0, 50);

					fun(socket.GuildData.commands[data.ori]);
					WriteDataBase();
				} else throw 'Invalid Command'
			} catch (e) {
				fun(null, e)
			}
		});
		socket.on('Command', ([key, data], fun) => { //Custom text command
			try {
				if (!socket.GuildData.TextCommandRules) socket.GuildData.TextCommandRules = [];
				let Rules = socket.GuildData.TextCommandRules;
				//npm i simple-duration

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
						WriteDataBase();
						fun(true);
					},
					remove: (command) => {
						let len = Rules.length;
						socket.GuildData.TextCommandRules = Rules = Rules.filter(x => x.command != command);
						let removed = len - Rules.length;
						console.log({ removed });

						WriteDataBase();
						fun(removed > 0);
					},
					toggle: (command) => {
						let rule = Rules.map((x, i) => [x, i]).find(x => x[0].command == command);
						if (rule) Rules[rule[1]].disabled = !Rules[rule[1]].disabled;
						WriteDataBase();
						fun(!Rules[rule[1]].disabled);
					}
				};
				// console.log({ key, data });
				functions[key](data);
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
						WriteDataBase();
						fun(true);
					},
					remove: (channelID) => {
						let len = Rules.length;
						socket.GuildData.VoiceRules = Rules = Rules.filter(x => x.channel != channelID);
						let removed = len - Rules.length;
						console.log({ removed });

						WriteDataBase();
						fun(removed > 0);
					},
					toggle: (channelID) => {
						let rule = Rules.map((x, i) => [x, i]).find(x => x[0].channel == channelID);
						if (rule) Rules[rule[1]].disabled = !Rules[rule[1]].disabled;
						WriteDataBase();
						fun(!Rules[rule[1]].disabled);
					}
				};
				// console.log({ key, data });
				functions[key](data);
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
						].forEach(([o, k, n, s = 0]) => o[k] = o[k].substr(s, n));

						socket.GuildData.Suggestions = {
							...Suggestions,
							...obj
						};
						fun();
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
									[expires, createdDiv] = sections = [newDiv('div', 'expires'), newDiv('div', 'created')],
									[from, to] = [newDiv('span'), newDiv('span')];
								timeDiv.append(...sections);
								createdDiv.append(from, to);

								if (id) div.id = id
								else Transcript.id = Date.now() - 16e11;

								name.innerHTML = channelName || 'Unknown';
								if (!(+closeAt < 16e11)) Transcript.closeAt = closeAt = encodeT(closeAt);
								if (+closeAt) {
									let dates = [+decodeT(closeAt), +decodeT(fromto[0]) + 2592e6],
										date = new Date(Math.min(...dates));
									expires.innerHTML = `<i time="${moment(decodeT(closeAt)).format('D/M-YYYY - hh:mm')}">Expires ${moment().fromNow()}</i>` +
										dates[0] < dates[1] ? `<div class="extend" />` : '';
								}
								try {
									if (!fromto || !fromto[1]) Transcript.fromto = fromto = msgs.filter((x, i) => !i || ++i == msgs.length).map(({ t }) => t);
									fromto = fromto.map(n => n ? decodeT(n, true) : 0);
									if (fromto[0].slice(0, -8) == fromto[1].slice(0, -8)) fromto[1] = fromto[1].slice(8);

									if (fromto[0]) from.innerHTML = `<i>Created:</i><i>${fromto[0]}</i>`;
									if (fromto[1]) to.innerHTML = `<i>Closed:</i><i>${fromto[1]}</i>`;
								} catch { console.error('fromto Error'); }

								closedBy = await guild.members.fetch(closedBy).catch(e => null);
								if (closedBy) closed.innerHTML = `Support Channel closed by ${closedBy.tag}`

								div.append(name, timeDiv, ...await Promise.all(msgs.map(async ({ a, c, t, f }, i) => {
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
								})));
								// if (fromto) fromto = fromto.map(n => decodeT(n));
								// timeDiv.innerHTML += (fromto || newFromto).map(d => d ? d.toLocaleString('sv').slice(5, -3) : 'Unknown')
								// .map((x, i, o) => (i && x.slice(0, -6) == o[0].slice(0, -6)) ? x.slice(6) : x)
								// 	.map(x => `<span>${x}</span>`).join('');
								return div;
							})));
							fun(resultsDiv.innerHTML)
						}
					},
					extend: async id => {
						if (!Transcripts || !Transcripts[0]) err('No transcipts found')
						else if (!id) err('No id provided')
						else {
							let Transcript = Transcripts.find(t => t.id == id);
							if (!Transcripts) err('Transcipt not found')
							else {
								Transcript.closeAt = encodeT(Date.now() + 6048e5);
								fun(true);
							}
						}
					}
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
					{ GuildData } = socket;
				if (!GuildData.Moderation) GuildData.Moderation = {};
				const { Moderation } = GuildData;

				// if (!socket.GuildData.Tickets.transcripts) socket.GuildData.Tickets.transcripts = [];
				// let Moderation = socket.GuildData.Moderation;
				// return fun(socket.GuildData);
				let functions = {
					set: async data => {
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
							data.coms[key] = {};
							if (data.coms[key].txt == value) data.coms[key].txt = undefined;
							if (!+data.coms[key].role) data.coms[key].role = undefined;
							if (!Object.values(data.coms[key]).filter(x => x).length) data.coms[key] = undefined;
						});
						['enabled', 'dmInvite', 'dmAll', 'tellWho', 'logsEnabled', 'banMessage'].forEach(key => {
							if (!data[key]) data[key] = undefined; /* if falsy: delete*/
						});

						fun(true);
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
							unsliced = await ParseModLogs(Moderation.logs, guild, ...filterFunction),
							logs = unsliced.slice(pageLength * page, pageLength * (page + 1));
						// lastPage = unsliced.length == logs.length;
						// console.log(logs.length);
						const cacheLable = ['modlogs', guild.id, page, filterIndex, filterId, unsliced.length].map(x => x || '-').join('-');
						console.log(cacheLable);

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
							// await Promise.all(members.map(id => guild.members.cache.get(id) || guild.members.fetch(id).catch(() => client.users.fetch(id).catch(() => null))));
							await Promise.all(members.map(id => guild.members.cache.get(id) || guild.members.fetch(id).catch(() => null)));
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

								typeDiv.innerHTML = type;
								dateDiv.innerHTML = moment(date).format('DD/MM - hh:mm');
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
					}
				};
				// console.log({ key, data });
				functions[key](data);
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


// Discord - client.on


client.on('ready', async () => {
	console.timeEnd('Login - Efter "Load:"');
	server.listen(port, () => console.log(`listening on ${port} and logged in as ${client.user.username}!`));
	// console.log(DataBase);

	if (!DataBase.temp) DataBase.temp = [];
	if (!DataBase.voiceCreated) DataBase.voiceCreated = [];

	DataBase.temp = DataBase.temp.filter(x => x) || [];
	DataBase.temp.forEach(async (temp, i) => {
		let duration = new Date(temp.until) - Date.now(),
			guild = await client.guilds.fetch(temp.g);

		if (temp.type == 'mute') {
			let member = await guild.members.fetch(temp.m);
			setTimeout(() => member.roles.remove(temp.role, 'Temporarily mute expired').catch(e => console.log('mute expired FAILED: ' + e.message)), duration)
		} else if (temp.type == 'ban')
			setTimeout(() => guild.members.unban(temp.m, 'Temporarily ban expired').catch(e => console.log('ban expired FAILED: ' + e.message)), duration);

		delete DataBase.temp[i];
	});


	client.guilds.cache.array().forEach(async guild => {
		let { id } = guild;
		if (!DataBase.guilds[id]) DataBase.guilds[id] = {};
		let DataBaseGuild = DataBase.guilds[id];
		// if (DataBase.guilds[id].Moderation?.logs) DataBase.guilds[id].Moderation.logs = undefined;
		if (DataBaseGuild.muted) {
			var role = await guild.roles.fetch(DataBase.guilds[id].muted).catch(e => false);
			console.log(role);
			if (role) MutedPermissions(role);
		}

		// if (id == '873582580325302312') try {
		// 	let Rule = DataBaseGuild.Suggestions
		// 	if (Rule?.suggestions && Rule.channels?.suggest && Rule.channels.response) {
		//
		// 		let channelSug = await client.channels.fetch(Rule.channels.suggest),
		// 			messages = await AllMessages(channelSug);
		// 		messages = messages.filter(m => m.author.id == client.user.id && m.embeds[0])
		// 			.map(m => [m.embeds[0], m.id])
		// 			.forEach(([{ author, title, description }, Mid]) => {
		// 				try {
		// 					let index = +title.match(/#(\d+)$/)[1];
		// 					// console.log([title, index, Rule.suggestions[index]]);
		// 					if (Rule.suggestions[index] && Rule.suggestions[index]?.suggestion == description) return console.log('finns redan');
		// 					let member = guild.members.cache.find(m => console.log(m.user.tag) || m.user.tag == author.name);
		// 					if (!member) return console.log('ingen member', author.name);
		// 					// Rule.suggestions[index] = {
		// 					// 	user: member.id,
		// 					// 	msg: id,
		// 					// 	suggestion: description
		// 					// }
		// 					console.log([guild.name, {
		// 						user: member.id,
		// 						msg: Mid,
		// 						suggestion: description
		// 					}]);
		//
		// 				} catch (e) { console.log('e3') }
		// 			})
		// 	}
		// } catch (e) { console.log('e4') }

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
				console.log(`Deleted transcript: "${channelName}" in ${guildId}`);
			}
		});
	};
	client.guilds.cache.keyArray().forEach(checkExpiredTranscripts);
	setInterval(() => client.guilds.cache.keyArray().forEach(checkExpiredTranscripts), 216e5); //6h

	WriteDataBase();

	Object.entries(DataBase.guilds).filter(x => x[1]?.Tickets?.enabled).map(x => x[0])
		.forEach(guildID => {
			TicketSetup(guildID);
			let DataBaseGuild = DataBase.guilds[guildID];
			// console.log(DataBaseGuild.Tickets.ticketsCreated);
			DataBaseGuild.Tickets.ticketsCreated?.forEach(async (id, i) => {
				let channel = await client.channels.fetch(id).catch(x => false);
				// console.log(channel);
				if (channel) {
					let msg = (await AllMessages(channel)).reverse().find(m => m.author.id == ClientID);
					if (msg) startMsgSetup(msg, guildID);
				} else delete DataBaseGuild.Tickets.ticketsCreated[i]

				DataBaseGuild.Tickets.ticketsCreated = DataBaseGuild.Tickets.ticketsCreated.filter(x => x)
			})
		});

	SupportServer = await client.guilds.fetch('827687377224728629');

	let setInvites = () => {
		client.guilds.cache.array().filter(g => g.vanityURLCode).forEach(guild =>
			guild.fetchVanityData().then(data => Invites[data.code] = {
				guild: guild.id,
				uses: data.uses
			}).catch(e => null));
		Promise.all(client.guilds.cache.array().map(g => g.fetchInvites().catch(e => null)))
			.then(i => i.filter(x => x).map(i => i.array()).flat().forEach((inv, i) =>
				Invites[inv.code] = {
					guild: inv.guild.id,
					inviter: i.inviter?.id,
					uses: inv.uses
				}))
	};
	setInvites();
	setTimeout(setInvites, 6e4); //1min
	setInterval(setInvites, 12e5); //20min

	setInvites(TopggSend, 864e5); //24h
});

client.on("guildCreate", async guild => {
	console.log('\x1b[33m%s\x1b[0m', `Added to ${guild.name}`);

	// if ((ownRole = guild.me?.roles.highest).editable) ownRole.setColor('#dbad11').catch();
	// console.log(ownRole);

	// DataBase.guilds[guild.id] = Object.fromEntries(Object.entries(guild).filter(x => ['id', 'name', 'icon', 'joinedTimestamp'].includes(x[0]) && x[1] != null))
	DataBase.guilds[guild.id] = {};
	NewGuildSubrcibers.forEach(async (fun, i) => {
		// console.log({
		// 	fun,
		// 	perms: (await guild.members.fetch(fun[1]))?.hasPermission(8)
		// });
		if ((await guild.members.fetch(fun[1]))?.hasPermission(8)) {
			fun[0](guild.id);
			// console.log(5);
			delete NewGuildSubrcibers[i];
		}
	});

	guild.fetchAuditLogs({ type: 28, limit: 1 }).then(({ entries }) =>
		entries.first().executor.send({
			embed: {
				title: `Thank you for adding **KonkenBoten** to ${guild.name}`,
				color: 14396689,
				thumbnail: { url: "https://bot.konkenbonken.se/src/icon/logo" },
				description: "**Go ahead and customize and set the bot up at *[bot.konkenbonken.se](https://bot.konkenbonken.se)***\n\nJoin our official [Discord Server](https://discord.gg/bMesu8z7n9)! There, you will find the bot's changelog and status updates and you will be able to ask questions and give suggestions to future updates.\n*See you there!*"
			}
		}).catch(console.error)).catch(console.error);

	TopggSend();
});
client.on("guildDelete", async guild => {
	console.log('\x1b[33m%s\x1b[0m', `Removed from ${guild.name}`);
	delete DataBase.guilds[guild.id];
});
client.on("channelCreate", ({ guild }) =>
	guild && guild.roles.fetch(
		DataBase.guilds[guild.id]?.Moderation?.muted
	).then(MutedPermissions)
);
client.on('message', async m => {
	if (!m.guild || m.author.bot) {
		if (m.channel.type == 'dm' && !m.author.bot) console.log(`DM recived:\nFrom ${m.author.tag}(${m.author.id})\n${m.cleanContent}`);
		return;
	}
	let GuildData = DataBase.guilds[m.guild.id] || {},

		error = () => { // error = (...emojis) => {	m.delete({ timeout: 1e4, reason: 'Invalid Command' });emojis.map(e => e && m.react(e));}
			m.delete({ timeout: 20e3, reason: 'Invalid Command' });
			m.react('❌');
			console.trace('❌');
		};

	// if (!GuildData.Suggestions) GuildData.Suggestions = {};

	if (m.content.startsWith(GuildData.prefix || DefaultPrefix)) {
		let textCommandList = GuildData.TextCommandRules?.map(x => x.command.toLowerCase()),
			command = m.content.split(' ')[0].substr(1).toLowerCase();
		if (textCommandList?.includes(command)) {
			let rule = GuildData.TextCommandRules[textCommandList.indexOf(command)];
			if (!rule.disabled && (!rule.roles || !rule.roles[0] ||
					m.member.roles.cache.keyArray().some(id => rule.roles.includes(id)) || m.member.permissions.has(8))) {


				let message = rule.content;
				if (rule.embed) message = {
					embed: {
						author: {
							name: rule.content.athr.nm,
							icon_url: rule.content.athr.img
						},
						title: rule.content.ttl,
						description: rule.content.desc,
						footer: {
							text: rule.content.ftr.nm,
							icon_url: rule.content.ftr.img
						},
						thumbnail: { url: rule.content.thmb },
						image: { url: rule.content.img },
						color: `${rule.content.color}`
					}
				};
				// if (rule.embed && rule.content.pings) message.content = rule.content.pings.map(id => `<@&${id}>`).join()
				// if (rule.embed && rule.content.ping) message.content = `<@&${rule.content.ping}>`;


				m.channel.send(message)
				m.delete();
			}
		} //if textCommand
		else if (command == GuildData.command('echo') && m.member.permissions.has(8)) {
			let content = m.content.substr(2 + command.length);
			if (content.length > 2000) {
				m.channel.send(content.substr(0, 2000)).then(x => m.delete());
				content = content.substr(2000)
			}
			m.channel.send(content).then(x => m.delete());
			return;
		}
		if (GuildData?.Suggestions?.channels && Object.values(GuildData.Suggestions.channels).includes(m.channel.id)) {
			let responseTypes = {
				approve: GuildData.command('approve'),
				deny: GuildData.command('deny'),
				consider: GuildData.command('consider')
			};
			// console.log({				m,				suggest: GuildData.command('suggest'),				command			});
			try {
				if (command == GuildData.command('suggest'))
					Suggest.suggest(m.guild, m.author, m.content.substr(2 + command.length))
					.then(() => m.delete()).catch(error)

				else if (Object.values(responseTypes).includes(command) && m.member.roles.cache.get(GuildData.Suggestions.staff))
					Suggest.respond(
						m.guild, m.author,
						m.content.match(/^.\S+\s+\d+\s+(.*)/)[1],
						m.content.match(/^.\S+\s+(\d+)/)[1],
						Object.fromEntries(Object.entries(responseTypes).map(x => x.reverse()))[command]
					).then(() => m.delete()).catch(error)
				else m.delete({
					timeout: 3000,
					reason: 'Invalid Command'
				});
			} catch { error() }
			return;
		}


		// console.log([Object.keys(moderationCommands), command, m.member.permissions.has(8)], 1);
		let modCommand = Object.keys(moderationCommands).find(c => command == GuildData.command(c));
		// modCommand -> Originalnamnet på kommandot
		if (modCommand) {
			if (!GuildData.Moderation) GuildData.Moderation = {};
			if (!GuildData.Moderation.logs) GuildData.Moderation.logs = {};
			if (!GuildData.Moderation.coms) GuildData.Moderation.coms = {};

			let activeRole = GuildData.Moderation.coms[modCommand]?.role;
			if (!+activeRole) activeRole = GuildData.Moderation.staff;
			if (!(m.member.roles.cache.has(activeRole) || m.member.permissions.has(8))) return; // !if has role OR admin

			const content = m.content.substr(2 + command.length);
			let [, memberID, reason] = content.match(/^\s*<@!?(\d{16,19})>\s*(.*)$/s) || content.match(/^\s*(\d{16,19})\s*(.*)$/s) || [];
			// console.log({ memberID, reason, content });
			if (!(memberID)) return error();
			if (!GuildData.Moderation.logs[m.author.id]) GuildData.Moderation.logs[m.author.id] = [];

			const [member, channel] = await Promise.all([
				modCommand == 'unban' ? memberID : m.guild.members.fetch(memberID).catch(e => modCommand.includes('ban') ? memberID : error()),
				client.channels.fetch(GuildData.Moderation.channel),
				new Promise(async resolve => {
					if (!modCommand.includes('mute')) return resolve(false);
					let role =
						(GuildData.Moderation.muted &&
							await m.guild.roles.fetch(GuildData.Moderation.muted).catch(e => false)) ||
						await m.guild.roles.create({ // return resolve(role) else
							data: {
								name: 'Muted',
								color: 7895160, // #787878
								position: m.guild.me.roles.highest.position, //- 1
								permissions: 0
							},
							reason: 'Muted Role created'
						}).catch(e => console.error(e));
					// console.log({ role });
					MutedPermissions(role);
					GuildData.Moderation.muted = role.id;

					return resolve(role);
				})
			]).catch(e => {
				console.error(e);
				error()
			});
			// console.log([m.member.roles.highest.name, member.roles.highest.name], m.member.roles.highest.comparePositionTo(member.roles.highest), m.member.roles.highest.comparePositionTo(member.roles.highest) < 0, m.guild.ownerID == m.member.id);

			if (GuildData.Moderation.dmInvite && ['tempban', 'kick', 'unban'].includes(modCommand)) {
				let invites = await m.guild.fetchInvites().catch(e => null);
				var dmInvite =
					invites && invites.array().find(i => i.inviter?.id == client.user.id && i.channel.id == channel.id) ||
					await channel.createInvite({ maxAge: 0, unique: true, reason: 'Created an Invite for inviting tempbanned or kicked members' }).catch(e => console.error('Cant create Invite:', e));
			}

			if (modCommand != 'unban' && m.guild.ownerID != m.member.id && m.member.roles.highest.comparePositionTo(member.roles.highest) <= 0) return error();
			console.log(m.author.bot);
			if (m.author.bot) return error();

			if (modCommand.startsWith('temp')) try {
				[, durationString, reason] = (reason + ' ').match(/^\s*(\w+)\s+(.*)$/s);
				var duration = Duration(durationString),
					until = new Date(Date.now() + duration * 1e3); // console.log({ duration });
			} catch (e) { console.error(e); return error() }

			const args = {
				member, //Member  if unban: id
				channel, //Channel
				reason: reason.trim() || undefined, //string
				guild: m.guild,
				staff: m.author.id, //id
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
				tellWho: !!GuildData.Moderation.tellWho //bool
			};

			// console.log(args.text);
			if (!(member && channel)) return error();
			await moderationCommands[modCommand].function(args).catch(e => e)
			m.delete();
			WriteDataBase();
			setTimeout(WriteDataBase, 4e3);
			return;
		}


		({
			Moderation: {
				enabled: 0, // 0=false; 1=true
				channel: '8578', //brottsregistret
				staff: '874647', //staffroll
				text: { reason: 'Reason:', hasBeen: 'has been', by: 'by', duration: 'Duration:', messageFrom: `Message from ${m.guild.name}:`, until: 'until', color: 'dbad11' },
				dmInvite: 0,
				dmAll: 0, // false = only dm banned/tempbanned
				banMessage: 'text', // empty if disabled
				tellWho: 0,
				logsEnabled: 0,
				muted: '938733', //mutedroll
				logs: {
					"03298450": // staffID
						[{ type: 'ban', reason: '', staff: '5645', member: '873', expires: 'parseT', duration: 'seconds' }]
				},
				coms: {
					warn: { txt: 'warned', role: '8578' }, //txt1: 'warn',
					kick: { txt: 'kicked', role: '8578' }, //txt1: 'kick',
					ban: { txt: 'banned', role: '8578' }, //txt1: 'ban',
					unban: { txt: 'unbanned', role: '8578' }, //txt1: 'unban',
					tempban: { txt: 'temporarily banned', role: '8578' }, //txt1: 'temporarily ban',
					mute: { txt: 'muted', role: '8578' }, //txt1: 'mute',
					unmute: { txt: 'unmuted' }, //txt1: 'unmute',
					tempmute: { txt: 'temporarily muted', role: '8578' }, //txt1: 'temporarily mute',
				}
			}
		})

		if (command == GuildData.command('infractions')) {

			if (!(m.member.roles.cache.has(GuildData.Moderation?.staff) || m.member.permissions.has(8))) return error();
			if (!GuildData.Moderation?.logs) {
				m.channel.send({
					embed: {
						color: parseInt(GuildData.Moderation?.text?.color || 'dbad11', 16),
						author: { name: `This server has no saved infractions`, icon_url: m.guild.iconURL() }
					}
				})
				return m.delete();
			}

			let { guild, member: staff, channel } = m, { logs } = GuildData.Moderation,
				content = m.content.substr(2 + command.length),
				[, memberID] = content.match(/^\s*<@!?(\d{16,19})>$/s) || content.match(/^\s*(\d{16,19})$/s) || [],
				member = memberID && await guild.members.fetch(memberID).catch(e => client.users.fetch(memberID).catch(e => memberID));
			console.log(member);
			if (!member) return error();
			//member = Member | User | id
			logs = await ParseModLogs(logs, guild, member);
			let sliced = logs.slice(0, 10), //.sort(x => Math.random() - .5)
				user = member.user || member.tag && member, // User | undefined
				displayTag = user?.tag || member, // tag | id
				displayIcon = user && user.displayAvatarURL(),
				embed = {
					color: member.displayColor || parseInt(GuildData.Moderation.text?.color || 'dbad11', 16),
					author: { name: `${displayTag} has no infractions`, icon_url: displayIcon }
				};

			if (sliced[0]) {
				embed.author.name = `${displayTag}'s' infractions`;
				// let fields = sliced.map(log => ({/*let action = log.dur ? 'temporarily ' : '';action += log.t;action = capital(action);if (log.dur) action += ' - ' + CleanDate(log.dur);*/name: capital(`${log.dur?'temporarily':''} ${log.t} ${log.dur?('- '+CleanDate(log.dur)):''}`),value: `${(log.r||'*No reason specified*').replace(/\n/g,' ')} - *${moment(log.d).fromNow()}*`.substr(0, 1024)})).map(log => `**${capital(log.name.trim())}:**\n⠀${log.value.trim()}`.trim()),
				let fields = sliced.map(log =>
						`**${capital(`${log.dur?'temporarily':''} ${log.t} ${log.dur?('- '+CleanDate(log.dur)):''}`.trim())}:**\n` +
						`⠀${(log.r||'*No reason specified*').replace(/\n/g,' ')} - *${moment(log.d).fromNow()}*`),

					last24 = logs.findIndex(log => log.d < Date.now() - 864e5),
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
			channel.send({ embed })
			m.delete();
		}


	} // if prefix
	else if (Object.values(GuildData.Suggestions?.channels || {}).includes(m.channel.id) && m.author.id != ClientID && !m.member.roles.cache.get(GuildData.Suggestions?.staff)) m.delete({ timeout: 3000, reason: 'Invalid Command' });
});
client.on('voiceStateUpdate', async (oldState, newState) => {
	let Created = DataBase.voiceCreated,
		guild = (newState || oldState).guild,
		GuildData = DataBase.guilds[guild.id],
		Rules = GuildData.VoiceRules;

	if (Rules) {
		let RulesIDs = Rules.map(r => r.channel),
			hasOld = oldState.channel && Created.includes(oldState.channelID),
			hasNew = RulesIDs.includes(newState.channelID);
		if (hasOld || hasNew) {

			if (hasOld) { // if Leave
				if (oldState.channel && !oldState.channel.members.size) {
					// delete Created[Created.indexOf(oldState.channelID)];
					DataBase.voiceCreated = Created.filter(x => x != oldState.channelID);
					oldState.channel.delete().catch(e => console.log('ERROR: oldState.channel.delete()', e.message))
					WriteDataBase()
				}
			}

			if (hasNew) { // if Join
				let Rule = Rules[RulesIDs.indexOf(newState.channelID)];
				if (Rule && !Rule.disabled) {
					let options = {
							type: 'voice',
							parent: newState.channel.parent,
							permissionOverwrites: newState.channel.permissionOverwrites
						},
						index = guild.channels.cache.array().filter(c => Created.includes(c.id) && RegExp(Rule.channelname.replace('{i}', '\\d'), 'g').test(c.name)).length + 1;

					if (Rule.Userlimit) options.userLimit = Rule.Userlimit;
					let newChannel = await guild.channels.create(Rule.channelname.replace(/{i}/g, index), options);
					newState.setChannel(newChannel).catch(x => console.log('No user to move'))
						.then(x => {
							if (!newChannel?.members.size) {
								DataBase.voiceCreated = Created.filter(x => x != newChannel.channelID);
								newChannel.delete();
								WriteDataBase();
							}
						});
					// if (+Rule.perms) newChannel.updateOverwrite(guild.roles.everyone.id, FieldtoPerms(Rule.perms)).then(console.log);
					// console.log(+Rule.perms, FieldtoPerms(Rule.perms));
					DataBase.voiceCreated.push(newChannel.id);
					WriteDataBase();
				}
			}
		}
	}

	let [Old, New] = [oldState.channelID, newState.channelID];

	if (Old && !New) client.emit('voiceDisconnect', oldState)
	else if (!Old && New) client.emit('voiceConnect', newState)
	else {
		if (Old && New && Old != New) client.emit('voiceMoved', oldState, newState)
		if (oldState.serverMute != newState.serverMute) client.emit('voiceMute', newState);
		if (oldState.serverDeaf != newState.serverDeaf) client.emit('voiceDeaf', newState);
	}


});

Object.entries(LogRules).forEach(([Event, Rule]) =>
	client.on(Event, async (...a) => {
		if (!(a[0].author && a[0].author?.id == ClientID)) {
			let guild = a.find(x => x instanceof Discord.Guild) || a.find(x => x.guild)?.guild;
			if (guild) {
				let timestamp = Date.now(),
					GuildData = DataBase.guilds[guild.id] || {},
					logRule = GuildData.logs;
				if (logRule && logRule.on && logRule.enabled?.includes(Event)) {
					let embed = await Rule.function(a, !!logRule.audit),
						logChannel;
					if (logRule.channel) logChannel = await client.channels.fetch(logRule.channel).catch(e => false);
					if (embed && logChannel) {

						embed.fields = embed.fields.filter(f => f[1] && `${f[1]}`.trim());

						embed.fields = embed.fields.filter(x => x).map(x => ({
							name: x[0] ? x[0].toString() : '*Unknown*', // null
							value: x[1].toString().substr(0, 1024), //	|| '*Unknown*'
							inline: !x[2]
						}));

						// embed.fields = 	embed.fields.map(f=>Object.fromEntries(Object.entries(f).filter(d=>d.value)));
						embed.author = { name: embed.author };
						if (embed.authorURL) embed.author.url = embed.authorURL;
						// embed.color = logRule.color || '#dbad11';
						embed.color = embed.color || (Rule.color ? `#${Rule.color}` : '#dbad11');
						embed.timestamp = timestamp;

						let previous = (await logChannel.messages.fetch({ limit: 2 })).array()
							.filter(m => (em = m.embeds[0]) &&
								em.author?.name == embed.author?.name &&
								JSON.stringify(em.fields) == JSON.stringify(embed.fields))[0];

						if (previous) {
							let n, foot = previous.embeds[0]?.footer?.text;
							n = +(foot || '').replace('×', '') + 1 || 2
							previous.edit({
								embed: {
									...embed,
									footer: { text: `×${n}` }
								}
							})
						} else logChannel.send({ embed });

						// {logs: {
						// 		color: '#ffffff',
						// 		channel: 'ChannelID',
						// 		enabled: ['guildMemberAdd', 'inviteDelete', 'messageDelete'],
						// 		on: true
						// 		audit: false
						// 	}}
					}
				} //	 else console.log('not enabled', {	guild: guild?.name,	Event,	enabled: logRule?.enabled})
			} else if (Event == 'userUpdate')
				// client.guilds.cache.array().filter(async g => await g.members.fetch(a[0]).catch(e => 0))
				client.guilds.cache.array().filter(g => g.members.cache.has(a[0].id))
				.forEach(g => client.emit('userUpdate', ...a, g));
			else if (Event != 'channelCreate') console.error('Error - no Guild found', [`Event: ${Event}`, ...a]);
		}
	}));


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
		if (false) //true = log src
			console.log(`\x1b[3${req.path.startsWith('/src/')?4:google?6:2}m%s\x1b[0m`, `${d.getHours()}:${d.getMinutes()} >> ${req.url} ${google?(ua.includes('compatible;')?ua.match(/compatible; ([^;]+);/)[1]||'':ua):''}`);
		else if (!['src', 'favicon.ico'].includes(req.path.split('/')[1]))
			console.log(`\x1b[3${google?6:2}m%s\x1b[0m`, `${d.getHours()}:${d.getMinutes()} >> ${req.url} ${google?(ua.includes('compatible;')&&ua.match(/compatible; ([^;]+);/)?ua.match(/compatible; ([^;]+);/)[1]||'':ua):''}`);
	} catch {}
	next()
});
app.all(/^\/Guild\/\d{16,19}/i, async (req, res) => {
	let google = /google/i.test(req.headers['user-agent']),
		guildID = req.path.split('/')[2],
		guild = await client.guilds.fetch(guildID).catch(e => null),
		user = Remebered.get(req.cookies.LoginId);


	res.cookie('LstGld', guild.id, {
		maxAge: 18144e5, //3w
		httpOnly: true
	});
	if (!user) {
		MaybeGuild = guildID;
		res.redirect(302, URLs.oauth);
		return;
	}
	let userID = user[0].id;
	if (!guild) res.status(404).end('guild not found')
	else {
		let member = await guild.members.fetch(userID).catch(e => null);
		if (!member || !member.hasPermission(8)) member = await guild.members.fetch(userID, {
			force: true
		}).catch(e => null);
		if (!member) res.status(404).end('member not found')
		else if (!member.hasPermission(8)) res.status(401).end('no permissions')
		else {
			let [document, ...pages] = await Promise.all([
				guildDoc(...user, {
					title: `KonkenBoten - ${guild.name}`
				}, req),
				Page.commands(guild, 'Commands', 'commands'),
				Page.voice(guild, 'Voice Channels', 'voice'),
				Page.moderation(guild, 'Moderation', 'moderation'),
				Page.suggestions(guild, 'Suggestions', 'suggestions', member.user),
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
			if (guild.icon) {
				let icon = newDiv('icon', 'guildIcon');
				document.body.append(icon);
				// icon.style.backgroundImage = `radial-gradient(#0000, #34373c 70%),url(https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.webp?size=512)`;
				icon.setAttribute('style', `background-image:radial-gradient(#0000, #34373c 70%),url(https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.webp?size=512)`);
			}

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

		}
	}
});
app.get('/', async (req, res) => {
	let document = await baseDoc({
			css: 'home',
			js: 'home',
			html: 'home'
		}),
		google = /google/i.test(req.headers['user-agent']),
		user = Remebered.get(google ? 'google' : req.cookies.LoginId),
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

		let listGuilds = user[1].filter(g => client.guilds.cache.keyArray().includes(g.id) && (new Discord.BitField(g.permissions)).has(8)),
			guildDropDown = newDiv('select', 'guildDropDown'),
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
	// res.send('yay')
	try {
		if (req.query.code) {
			// console.log(req.query.code);
			let access_token = (await oauth.tokenRequest({
				clientId: ClientID,
				clientSecret: "wn-BWF8mQv0xSkSDfNEG2HE7eos6caIM",
				code: req.query.code,
				scope: ["identify", "guilds"],
				grantType: "authorization_code",
				redirectUri: RedirectTo.de,
			})).access_token;
			// console.log(access_token);
			let [user, guilds] = await Promise.all([oauth.getUser(access_token), oauth.getUserGuilds(access_token)]).catch(console.error);
			// console.log(guilds)
			// res.send(user)

			let id = lightRandom(256);
			res.cookie('LoginId', id, {
				maxAge: 1728e5, //48h
				httpOnly: true
			});
			res.cookie('ToS', 1, {
				maxAge: 12096e5, //2w
				httpOnly: true
			});

			Remebered.set(id, [user, guilds]);
			setTimeout(x => Remebered.delete(id), 1728e5);

			// res.send('yay')
			mainPage(req, res, user, guilds);
		} else throw 1;
	} catch {
		if (Remebered.get(req.cookies.LoginId) && Math.random() > .001) mainPage(req, res, ...Remebered.get(req.cookies.LoginId))
		else res.append('Link', prefetchs).redirect(302, URLs.oauth)
	}
});

app.get('/terms', async (req, res) => {
	let document = Cache.get('termsDoc');

	if (!document) {
		document = await baseDoc({
			css: 'terms',
			html: 'terms',
			// hotjar: true,
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
	if (Remebered.get(req.cookies.LoginId)) Remebered.delete(req.cookies.LoginId);
	res.clearCookie('LoginId');
	res.redirect('/');
});

app.get('/vote', async (req, res) => res.redirect('https://top.gg/bot/813803575264018433/vote')); //.cookie('vtd', 1, {maxAge: 43200, //12hhttpOnly: true})
app.get('/top.gg', async (req, res) => res.redirect('https://top.gg/bot/813803575264018433'));

app.get('/favicon.ico', (req, res) => res.append('Cache-Control', 'public, max-age=2419200').redirect(301, '/src/icon/logo')); //4w

app.all(/\/src\/(client|terms|home)\.css/i, async (req, res) => {
	let file = req.path.match(/\/src\/(client|terms|home)\.css/i)[1];
	// console.time('scss');
	// var css = MinifyCSS(await Sass(file).catch(err => console.log(err, file) || '')).css;
	// console.timeEnd('scss');
	res.append('Cache-Control', 'public, max-age=10800') //3h
		.append('Content-Disposition', 'render')
		// .type('css').send(css);
		.download(`${__dirname}/client/${file}.scss`);
});

app.all(/\/src\/(client|home)\.js/i, async (req, res) => {
	let file = req.path.match(/\/src\/(client|home)\.js/i)[1],
		js = (await Terser(await fs.readFile(`client/${file}.js`, 'utf8'))).code;

	res.append('Cache-Control', 'public, max-age=10800'); //3h
	res.type('js').send(js);
});


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
	reply: 'forward-arrow'
	// ,arrow: 'arrow' //same -> defaults
};
app.all(/\/src\/icon\/[a-z]+$/i, async (req, res) => {
	let url = req.path.match(/\/src\/icon\/(\w+)/i)[1],
		img = Cache.get(`icon-${url}`);
	url = iconLookup[url] || url;
	url = `https://img.icons8.com/ios-filled/dbad11/50/${url}.png`;

	if (!img) try {
		img = Buffer.from(await (await Fetch(url)).arrayBuffer());
		Cache.set(`icon-${url}`, img);

		res.append('Link', `<${url}>; rel="canonical"`).append('Cache-Control', 'public, max-age=1209600') //2w
			.type('png').send(img);
	} catch (e) {
		res.redirect(url);
		console.error(e, 'ERROR HANDLED - USER REDIRECTED')
	}

});

app.get('/src/background', async (req, res) => {

	let secToMidnight = (-(d = new(Date)) + d.setHours(24, 0)) / 1e3,
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
	let user = Remebered.get(req.cookies.LoginId);
	res.append('Cache-Control', 'no-store');
	if (user) {
		let userid = user[0].id;
		console.log({
			DatabaseAccess: userid,
			Access: userid == '417331788436733953'
		});
		if (userid == '417331788436733953') res.json(DataBase)
		else res.status(401).end('no permissions');
	} else res.redirect(302, URLs.oauth)
});

app.get('/robots.txt', (req, res) => res.send('User-agent:Googlebot\nDisallow:/Guild/\nDisallow:/guild/'));
app.get('/googleef57faccce66a13b.html', (req, res) => res.send('google-site-verification: googleef57faccce66a13b.html'));


// app.get('/KonkenBoten', (req, res) => res.redirect(301, '/oauth'));
app.get('/KonkenBoten', (req, res) => res.redirect(301, '/'));
app.all(/(weather|news)/, (req, res) => res.status(410).end('410 - ' + req.url));
app.use((req, res) => res.status(404).end('404 - ' + req.url));

// setInterval(WriteDataBase, 3e5);
// client.login('ODEzODAzNTc1MjY0MDE4NDMz.YDUnpA.r69FWDnI3SgMPMrluaDSEmdSeYI');
setInterval(x => process.stdout.write('\x1b[1m\x1b[33m' + (Math.round(process.memoryUsage().heapUsed / 1048.576) / 1e3).toFixed(3) + '\x1b[0m\033[0G'), 1000);
console.timeEnd('Load');

// setInterval(() => console.log(Cache), 60e3);

// TODO:

//		Has updated(needs to transfer):
//

//		Direct link to Transcript (B64 encode transcript.id)
//		TexCommands
//					List
//					Timer
//		Moderation
//					Caps
//					Word Filter
//					Spam Filter
//					Emoji Spam Filter
//					!warn
//					!ban !kick !muted
//					!tempmute !tempban
//		ServerStats
//					MemberCount
//					Members Online
//					Media stats
//					  Youtube Twitter TikTok
//					Countdown
//		Custom Bot
//		Level
//		Paid premium version
//		Suggestions
//					Panel
//					 ColumnsToggle
//			       Suggestions: {
// 		        	channels: {suggest: '83730873837',	response: '83730873874'	},
// 			     		staff: '9476457896',
// 			     		index: 4
// 			     		color: '#ff00ff'
// 			     	},

// discord.js express socket.io discord-oauth2 terser clean-css js-base64 jsdom light-random cookie-parser emoji-test-list