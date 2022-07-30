import express from 'express';
import http from 'http';
import { Server as socketIo } from 'socket.io';
import { promises as fs } from 'fs';
import cookieParser from 'cookie-parser';
import discordOauth from "discord-oauth2";
import lightRandom from 'light-random';

const port = 80,
	app = express(),
	server = http.createServer(app),
	io = new socketIo(server, {
		transports: ['polling'],
		pingInterval: 60e3,
		pingTimeout: 120e3,
	}),

	URLs = {
		oauth: `https://discord.com/api/oauth2/authorize?client_id=813803575264018433&redirect_uri=https%3A%2F%2Fbot.konkenbonken.se%2Foauth&scope=identify%20guilds&response_type=code`,
		bot: `https://discord.com/api/oauth2/authorize?client_id=813803575264018433&permissions=8&scope=bot%20applications.commands`,
		botRedirect: `https://discord.com/api/oauth2/authorize?client_id=813803575264018433&redirect_uri=https%3A%2F%2Fbot.konkenbonken.se%2Foauth&permissions=8&scope=bot%20applications.commands&response_type=code`
	},

	globalLinks = [...[].map(url => `<${url}>; rel="prefetch"`),
		'<icon.svg>; rel="icon"; type="image/svg"', '<favicon.ico>; rel="alternate icon"; type="image/ico"',
		'<oauth>; rel="prerender"', '<https://discord.com>; rel="preconnect"',
		'<https://top.gg/bot/813803575264018433/vote>; rel="prerender"',
	].join();

export default function setup({ client, DataBase, OAUTH, Discord: { BitField } }) {
	const oauth = new discordOauth({
		clientId: client.id,
		clientSecret: OAUTH,
		redirectUri: 'https://bot.konkenbonken.se/oauth'
	});

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
			if (!['static', 'manifest.json'].includes(req.path.split('/')[1]))
				console.log(`\x1b[3${google?6:2}m%s\x1b[0m`, `${d.getHours()}:${d.getMinutes()} >> ${req.url} ${google?(ua.includes('compatible;')&&ua.match(/compatible; ([^;]+);/)?ua.match(/compatible; ([^;]+);/)[1]||'':ua):''}`);
		} catch {}
		next()
	});

	app.get('/oauth', async (req, res) => {
		const fail = () => res.append('Link', globalLinks).redirect(302, URLs.oauth);
		if (req.query.code) {
			let { access_token } = await oauth.tokenRequest({
				code: req.query.code,
				scope: ["identify", "guilds"],
				grantType: "authorization_code",
			}).catch(() => ({}));

			if (!access_token) return fail();
			var [user, guilds] = await Promise.all([oauth.getUser(access_token), oauth.getUserGuilds(access_token)]);
			if (!user || !guilds) return fail();

			const LoginExpire = 864e5 * 4, //4d
				existing = Object.entries(DataBase.loggedIn).find(([key, value]) => value?.[0]?.id == user.id),
				Hash = (existing && existing[0]) || lightRandom(16);

			if (DataBase.loggedIn[Hash]) console.log(DataBase.loggedIn[Hash][0], 57412);

			res.cookie('LoginId', Hash, {
				maxAge: 864e5 * 16, //16d  // cookie for 16d but saves on database for 4d (if logges in on other device)
				httpOnly: true
			}).cookie('ToS', 1, {
				maxAge: 2592e6, //30d
				httpOnly: true
			});

			user = { id: user.id, expires: Date.now() + LoginExpire };

			guilds = (await Promise.all(
					guilds.filter(({ permissions }) => (new BitField(permissions)).has(8))
					.map(async guild => await client.guilds.fetch(guild.id).catch(() => false) && guild)
				))
				.filter(x => x)
				.map(({ id, icon, name, permissions }) => ({
					id,
					icon: icon || undefined,
					name,
					permissions
				}))
				.sort((a, b) => a.name > b.name ? 1 : -1);

			DataBase.loggedIn[Hash] = [user, guilds];
			setTimeout(() => delete DataBase.loggedIn[Hash], LoginExpire);

		} else if (!(Hash in DataBase.loggedIn))
			return fail();

		if (req.cookies.LstUrl) return res.redirect(302, req.cookies.LstUrl);
		if (req.cookies.LstGld) return res.redirect(302, '/Guild/' + req.cookies.LstGld);
		if (guilds && guilds[0]) return res.redirect(302, '/Guild/' + guilds[0].id);
		res.redirect(302, URLs.botRedirect);
	});

	app.get('/logout', async (req, res) => {
		DataBase.loggedIn[req.cookies.LoginId] = undefined;
		res.clearCookie('LoginId')
			.redirect('/');
	});

	app.get('/vote', async (req, res) => res.redirect('https://top.gg/bot/813803575264018433/vote'));
	app.get('/top.gg', async (req, res) => res.redirect('https://top.gg/bot/813803575264018433'));

	// const iconLookup = {
	// 	// settings: 'settings', // Not in use
	// 	commands: 'chat-settings',
	// 	voice: 'speaker',
	// 	moderation: 'policeman-male--v2',
	// 	support: 'headset',
	// 	suggestions: 'mailbox-opened-flag-down',
	// 	sort: 'generic-sorting',
	// 	reply: 'forward-arrow',
	// 	open: 'external-link-squared'
	// 	// ,arrow: 'arrow' //same -> defaults
	// };

	app.get('/src/database', async (req, res) => {
		res.append('Cache-Control', 'no-store');
		if (!req.cookies.LoginId) return res.redirect(302, URLs.oauth);
		let user = DataBase.loggedIn[req.cookies.LoginId];
		if (!user) return res.redirect(302, URLs.oauth);
		let userid = user[0].id;
		console.log({
			DatabaseAccess: userid,
			Access: userid == '417331788436733953'
		});
		if (userid == '417331788436733953') res.json(DataBase)
		else res.error(403, 'no permissions');
	});

	app.get(['/', '/Guild/*'], async (req, res) => {
		const promises = [
				fs.readFile('./build/site/index.html', 'utf-8')
			],
			user = DataBase.loggedIn[req.cookies.LoginId];
			contextData = {},

		if (user) {
			promises.push(client.users.fetch(user[0].id).then(discordUser =>
				contextData.user = {
					id: discordUser.id,
					avatar: discordUser.avatar,
					username: discordUser.username,
					discriminator: discordUser.discriminator,
					guilds: user[1]
				}
			));
		}

		let [document] = await Promise.all(promises);
		document = document.replace('%CONTEXT_DATA%', JSON.stringify(JSON.stringify(contextData)));

		res.append('Cache-Control', 'public, max-age=10800') //3h
			.append('Link', globalLinks)
			.send(document);
	});

	app.use(express.static('./build/site'));
	app.use((req, res) => res.status(404).end('page not found'));

	io.on('connection', async socket => {
		const userId = socket.handshake.query.userId,
			user = await client.users.fetch(userId).catch(e => undefined);

		if (!user)
			return socket.disconnect();

		console.log('\x1b[34m%s\x1b[0m', 'connected: ' + user.tag);

		socket.on('getGuild', async (guildId, response) => {
			console.log(guildId);

			const GuildData = DataBase.guilds[guildId],
				guild = await client.guilds.fetch(guildId).catch(() => false),
				member = guild && await guild.members.fetch(userId).catch(() => false);

			if (!GuildData || !guild || !member || !member.permissions.has('ADMINISTRATOR'))
				return response(null, true);

			await Promise.allSettled([
				guild.channels.fetch(),
				guild.members.fetch(),
				guild.roles.fetch(),
			]);

			response({
				member: {
					nickname: member.nickname,
					color: member.displayHexColor
				},
				database: GuildData,
				discord: {
					categories: guild.channels.cache.filter(channel => channel.type == 'GUILD_CATEGORY')
						.map(category => ({
							id: category.id,
							name: category.name,
							position: category.position
						})),
					channels: guild.channels.cache.filter(channel => !channel.isThread() && !channel.type != 'GUILD_CATEGORY')
						.map(channel => ({
							id: channel.id,
							name: channel.name,
							position: channel.position,
							type: channel.type.replace('GUILD_', ''),
							parent: channel.parentId,
							permissions: channel.permissionsFor(guild.me).bitfield.toString()
						})),
					members: guild.members.cache
						.map(member => ({
							id: member.id,
							name: member.displayName,
							tag: member.user.tag,
							avatar: member.avatar,
							color: member.displayHexColor,
							permissions: member.permissions.bitfield.toString()
						})),
					roles: guild.roles.cache
						.map(role => ({
							id: role.id,
							name: role.name,
							position: role.position,
							color: role.hexColor,
							permissions: role.permissions.bitfield.toString()
						})),
				}
			})
		})
	});

	return function listen(callback) {
		server.listen(port, callback)
	};
}