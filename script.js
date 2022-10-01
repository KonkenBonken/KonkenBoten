console.log(`Start  || ${new Date().getHours()}:${new Date().getMinutes()}`);
const __dirname = process.cwd();
console.log('Node version:', process.version)
console.time('Load');
console.time('Packages');

import dotenv from 'dotenv'
dotenv.config()
import Discord from "discord.js";
import { promises as fs } from 'fs';
import moment from 'moment-timezone';
import { stringify as CleanDate } from 'simple-duration';
import ObjectMerge from 'deepmerge';
import { isWebUri as isValidUrl } from 'valid-url';

import Import_topGgSdk from '@top-gg/sdk';
import Import_nodeCache from 'node-cache';
import Import_commands from './lib/commands.js';
import Import_express from './lib/express.js';

import DataBase from './build/DataBase.js';

console.timeEnd('Packages');
console.time('Consts');

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

const topggApi = new (Import_topGgSdk.Api)('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjgxMzgwMzU3NTI2NDAxODQzMyIsImJvdCI6dHJ1ZSwiaWF0IjoxNjE4NjYzNDU4fQ.gqGp-wnvzaFk69HGOohqYPlJ2J4bEjL7RRAvWFCroMQ'),
	TopggSend = () => topggApi.postStats({ serverCount: client.guilds.cache.size }),
	Cache = new (Import_nodeCache)();

const NewGuildSubrcibers = [],
	ClientID = '813803575264018433',

	WriteDataBase = () => {
		if (performance.now() > 30e3)
			fs.writeFile('DataBase-temp.json', JSON.stringify(DataBase)).then(() => fs.rename('DataBase-temp.json', 'DataBase.json').catch(x => 0))
	},
	{ isArray } = Array;

const RandomUser = () => 'User#' + Math.floor(Math.random() * 8999 + 1000),
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

	capital = s => s[0].toUpperCase() + s.slice(1).toLowerCase(),
	CssColors = {
		gray: '747f8d',
		green: '43b581',
		red: 'f04747',
		yellow: 'faa61a'
	},
	Invites = {},
	AuditLog = async (guild, type, targetID, log = true) =>
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
						content += e.description ? `\n${e.fields.map(f => `**${f.name}**\n${f.value}`)}` : '';
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
						content += e.description ? `\n${e.fields.map(f => `**${f.name}**\n${f.value}`)}` : '';
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
			function: async ([amt, c, m] /*,audit*/) => {
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
			function: ([channel, user] /*,audit*/) => ({
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
			function: ([channel, user, ids] /*,audit*/) => ({
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
			function: ([channel, user] /*,audit*/) => ({
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
			function: async ([newState] /*,audit*/) => {
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
					author: `Member server ${newState.serverMute ? '' : 'un'}muted`,
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
					author: `Member server ${newState.serverDeaf ? '' : 'un'}deafened`,
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
			function: async ([oldM, newM] /*,audit*/) => {
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
			function: async ([e] /*,audit*/) => {
				return {
					author: `Event created: ${e.name}`,
					fields: [
						['Event name:', e.name],
						['Channel:', e.channel],
						['Created by:', e.creator],
						['Event id:', e.id],
						['Scheduled date:', moment(e.scheduledStartAt).guild(e.guild).format('D/M-YYYY - HH:mm')],
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
						['Scheduled date:', moment(e.scheduledStartAt).guild(e.guild).format('D/M-YYYY - HH:mm')],
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
						['Scheduled date:', newE.scheduledStartTimestamp != oldE.scheduledStartTimestamp && `${moment(oldE.scheduledStartAt).guild(oldE.guild).format('D/M-YYYY - HH:mm')} => ${moment(newE.scheduledStartAt).guild(newE.guild).format('D/M-YYYY - HH:mm')}`],
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
			function: async ([e, u] /*,audit*/) => {
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
			function: async ([e, u] /*,audit*/) => {
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
const encodeT = n => Math.round((n || Date.now()) / 6e4 - 271e5), // Date ->  T
	decodeT = (n, parse = false, guild) => { // T   -> Date
		n = new Date((n + 271e5) * 6e4);
		if (parse) {
			n = moment(n);
			if (guild) n.guild(guild);
			n = n.format('DD/MM - HH:mm');
		}
		return n
	},
	nextChar = (s, n) => s.split('').reverse().map(c => String.fromCharCode(c.charCodeAt(0) + n)).join(''),
	encryptString = s => nextChar(s, 3),
	decryptString = s => nextChar(s, -3);

const AllMessages = channel => new Promise(async resolver => {
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

	TicketSetup = async (guildID, oldChannelId) => {
		let DataBaseGuild = DataBase.guilds[guildID],
			Rule = DataBaseGuild.Tickets;
		try {
			var guild = await client.guilds.fetch(guildID),
				oldChannel = oldChannelId && await client.channels.fetch(oldChannelId).catch(x => false),
				channel = await client.channels.fetch(Rule.channel);
		} catch { return }
		let reactMessage = Rule.existingMessage ? await (oldChannel || channel).messages.fetch(Rule.existingMessage).catch(x => false) : false,
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

		if (reactMessage) {
			if (Rule.channel == reactMessage.channel.id)
				reactMessage.edit(reactMessageObj);
			else {
				reactMessage.delete();
				reactMessage = await channel.send(reactMessageObj);
			}
		} else reactMessage = await channel.send(reactMessageObj);
		DataBaseGuild.Tickets.existingMessage = reactMessage?.id;

		WriteDataBase();
		// "enabled": true,"channel": "798590264511037450","staff": "825378302579048448","author": "tesst au2","content": "By clicking 💬 tesst3","emoji": "","color": "#5dac79","existingMessage": "827248807896809542"
	}, //TicketSetup

	SuggestRespond = (guild, user, reason, index, responseType) => new Promise(async (resolver, reject) => {
		//responseType == 'approve'|'deny'|'consider'
		if (!(guild && user && reason && +index && responseType)) return reject('Unknown error');
		let Rule = DataBase.guilds[guild.id].Suggestions,
			suggestion = Rule.suggestions[index];
		if (!suggestion) return reject('Suggestion not found');

		let channel = await client.channels.fetch(Rule.channels.response).catch(() => false),
			member = await guild.members.fetch(suggestion.user).catch(() => false);

		if (!channel) return reject('Response Channel not found');
		if (!member) return reject('Member not found');

		reason = reason.substr(0, 1024);

		let [msg, suggestChannel] = await Promise.all([channel.send({
			embeds: [{
				color: parseInt(Rule.embed.colors[responseType], 16),
				author: {
					iconURL: member.displayAvatarURL(),
					name: member.user.tag
				},
				title: `${Rule.embed.suggestion} #${index} ${Rule.embed[responseType]}`,
				description: suggestion.suggestion,
				fields: [{
					name: `${Rule.embed.reasonFrom} ${user.tag}:`,
					value: reason,
				}]
			}]
		}).catch(e => false),
		client.channels.fetch(Rule.channels.suggest).catch(e => false)
		]),
			suggestionMsg = await suggestChannel.messages.fetch(suggestion.msg).catch(e => false);

		if (!msg) return reject('Could not send message');
		if (!suggestChannel) return reject('Suggestion Channel not found');

		suggestChannel.messages.edit(suggestionMsg, {
			embeds: [{
				...suggestionMsg.embeds[0].toJSON(),
				color: parseInt(Rule.embed.colors[responseType], 16)
			}]
		}).catch(() => false);

		suggestion.answer = {
			type: responseType,
			user: user.id,
			reason
		}

		resolver(msg);
		WriteDataBase();
	}),
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

const setGuildCustomCommands = (guild, lazy = false) => {
	const TextCommandRules = DataBase.guilds[guild.id].TextCommandRules;
	if (!TextCommandRules?.length) {
		if (lazy && !guild.commands.cache.size)
			return;
		return guild.commands.set([]);
	}

	return guild.commands.set(TextCommandRules.map(rule => ({
		name: rule.command.substring(0, 32).toLowerCase(),
		description: (rule.embed ?
			rule.content.ttl || rule.content.desc :
			rule.content.substring(0, 100)) ||
			'Custom Command',
		options: [{
			name: 'private',
			type: 'BOOLEAN',
			description: 'Only show output to the executor',
			required: false
		}],
		defaultPermission: false,
		dm_permission: false
	})))
		.catch(() => console.log('No commands scope in', guild.name, guild.id))
};

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

Object.defineProperty(Array.prototype, 'filterX', { get: function () { return this.filter(Boolean) } });
Object.prototype.isEmpty = function () {
	return !Object.keys(this).length || Object.values(this).every(x => x === undefined)
}

DataBase.loggedIn = DataBase.loggedIn || {};
// DataBase.loggedIn = {};
Object.entries(DataBase.loggedIn).forEach(([id, data]) => {
	const [{ expires }, guilds] = data,
		duration = expires - Date.now();
	console.log(id, CleanDate(duration / 1000, 'm'));

	if (duration <= 0) return delete DataBase.loggedIn[id]
	setTimeout(() => delete DataBase.loggedIn[id], duration);

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

const commands = Import_commands({ client, CleanDate, capital, moment, ParseModLogs, ObjectMerge, MutedPermissions, encodeT, DataBase, WriteDataBase, SuggestRespond });
const listen = Import_express({ client, DataBase, OAUTH: process.env.OAUTH, Discord });

moment._ZoneLookup = { cs: 'CZ', da: 'DK', el: 'GR', hi: 'IN', ja: 'JP', ko: 'KP', uk: 'UA' };
moment.ZoneLookup = locale => moment.tz._countries[
	moment._ZoneLookup[locale] ?? locale.toUpperCase().replace(/^..-/, '')
]?.zones[0];
moment().constructor.prototype.guild = function (guild) {
	return this.tz(moment.ZoneLookup(guild.preferredLocale));
};

if (!DataBase.temp) DataBase.temp = [];
if (!DataBase.voiceCreated) DataBase.voiceCreated = [];
DataBase.temp = DataBase.temp.filter(x => x);

// Discord - client.on
client.on('ready', async () => {
	console.timeEnd('Login');
	listen(() => console.log(`listening`));
	console.log(`logged in as ${client.user.username}!`);

	console.log(client.guilds.cache.filter(g => g.available).size, 'available of', client.guilds.cache.size, 'Guilds before fetch');
	await client.guilds.fetch( /*{ force: true }*/);
	console.log(client.guilds.cache.filter(g => g.available).size, 'available of', client.guilds.cache.size, 'Guilds after fetch');
	setTimeout(() => {
		// Promise.all(client.guilds.cache.map(g => g.available || client.guilds.fetch(g.id)))
		client.guilds.fetch({ force: true })
			.then(g =>
				console.log(client.guilds.cache.filter(g => g.available).size, 'available of', client.guilds.cache.size, 'Guilds after fetch 2', g.filter(g => g !== true).map(g => g.available)))
	}, 10e3);


	DataBase.temp.forEach(async (temp, i) => {
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

		setTimeout(() => prom(fun()), duration)
	});

	[...client.guilds.cache.values()].forEach(async guild => {
		let { id } = guild;
		if (!DataBase.guilds[id]) DataBase.guilds[id] = {};
		let DataBaseGuild = DataBase.guilds[id];
		if (DataBaseGuild.muted) {
			var role = await guild.roles.fetch(DataBase.guilds[id].muted).catch(e => false);
			if (role) MutedPermissions(role);
		}
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
		});
	};
	[...client.guilds.cache.keys()].forEach(checkExpiredTranscripts);
	setInterval(() => [...client.guilds.cache.keys()].forEach(checkExpiredTranscripts), 216e5); //6h

	WriteDataBase();

	Object.entries(DataBase.guilds).filter(x => x[1]?.Tickets?.enabled)
		.forEach(([guildID]) =>
			TicketSetup(guildID)
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

	setTimeout(setInvites, 6e4); //1min
	setInterval(setInvites, 72e5); //2h
	setInterval(TopggSend, 864e5); //24h

	client.application.commands.set(
		commands.map(({ com: name, des: description, options }) => ({
			name,
			description,
			defaultPermission: false,
			dm_permission: false,
			options: Object.entries(options).map(([name, option]) => ({ name, ...option })),
		}))
	);
	for (var guild of client.guilds.cache.values())
		if (guild.id in DataBase.guilds)
			setGuildCustomCommands(guild, true);
});

client.on("guildCreate", async guild => {
	console.log('\x1b[33m%s\x1b[0m', `Added to ${guild.name}`);

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

client.on('messageCreate', async m => { //Not Prefixed
	if (m.channel.type == 'DM') {
		if (!m.author.bot) console.log(`DM recived:\nFrom ${m.author.tag}(${m.author.id})\n${m.cleanContent}`);
		return;
	}

	if (!m.guild || !m.member /*|| m.author.bot*/) return;

	const GuildData = DataBase.guilds[m.guild.id] || {};

	if (Object.values(GuildData.Suggestions?.channels || {}).includes(m.channel.id) && m.author.id != ClientID)
		return setTimeout(() => m.delete(), 10e3);

	let reaction = GuildData.Reactions && Object.keys(GuildData.Reactions || {}).find(x => x == m.channel.id);
	if (!reaction) return;
	reaction = GuildData.Reactions[reaction];
	if (!reaction) return;
	/*undef:all; 1:only bots; 2:not bots; 3:only embeds; 'u92635':only user; 'r92635':only role*/

	let filterIndex = +reaction.f,
		filterId;
	if (reaction.f?.length > 2) {
		filterId = reaction.f.substr(1)
		if (reaction.f.startsWith('u')) filterIndex = 4;
		else if (reaction.f.startsWith('r')) filterIndex = 5;
	}
	if (!filterIndex) filterIndex = 0;

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
		if (GuildData.Moderation.logsEnabled) {
			if (!GuildData.Moderation.logs) GuildData.Moderation.logs = {}
			if (!GuildData.Moderation.logs[ClientID]) GuildData.Moderation.logs[ClientID] = [];
		}
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
			color: 'dbad11',
			description: reason
		}]
	});
});

client.on('messageCreate', async m => { //deprecated commands warning
	if (!m.guild) return;
	const GuildData = DataBase.guilds[m.guild.id] ?? {};

	if (!(
		[...commands, ...Object.values(GuildData.commands || {})]
			.some(({ com }) => m.content.startsWith((GuildData.prefix || '$') + com)) ||
		m.content.startsWith('<@813803575264018433>')
	)) return;

	m.reply({
		embeds: [{
			color: 0xdbad11,
			description: `**KonkenBoten has switched to [Slash Commands](https://support.discord.com/hc/sv/articles/1500000368501-Slash-Commands-FAQ) and prefixed(${GuildData.prefix || '$'}) chat-commands will no longer work**`
		}]
	}).then(
		m => setTimeout(() => m.delete(), 10e3)
	)
});
client.on('interactionCreate', async interaction => { // Slash-Commands
	if (!(interaction.isCommand() && interaction.inCachedGuild())) return;

	const GuildData = DataBase.guilds[interaction.guildId];

	const error = message => {
		let content = 'An error occured';
		if (message) content += '\n> ' + message;
		interaction.reply({ content, ephemeral: true });
	};

	const command = interaction.commandName,
		commandObj = commands.find(c => c.com == command);

	if (commandObj) {
		var options = Object.fromEntries(Object.keys(commandObj.options || {}).map(name => {
			const arg = interaction.options.get(name);
			if (arg === null)
				return [name, arg];
			const value = ['user', 'member', 'channel', 'role', 'value'].find(type => arg[type]);
			return [name, arg[value]];
		}))

		return commandObj.handler(options, interaction, { error, GuildData, reply: interaction.reply.bind(interaction) });
	}
	// Custom Commands

	const textCommandList = GuildData.TextCommandRules?.map(x => x.command.toLowerCase());
	if (!textCommandList?.includes(command))
		return sendError(`Command not found: ${interaction.commandName}`);

	let rule = GuildData.TextCommandRules[textCommandList.indexOf(command)];

	const priv = !!interaction.options.getBoolean('private');

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
			color: `#${rule.content.clr || 'dbad11'}`
		}],
		ephemeral: priv
	};

	if (priv)
		interaction.reply(message);
	else {
		interaction.channel.send(message);
		interaction.reply({
			content: 'Successfully sent',
			ephemeral: true
		});
	}
}); // Slash-Commands

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

			if (hasOld) // if Leave
				if (oldState.channel && !oldState.channel.members.size) {
					DataBase.voiceCreated = Created.filter(x => x != oldState.channelId);
					oldState.channel.delete().catch(e => console.log('ERROR: oldState.channel.delete()', e.message))
					WriteDataBase()
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

const logQueue = {}, // {9235:[[clear,embed],[clear,embed]]}
	sendLogQueue = (guildId, logChannel) => { //logQueue[guildId] &&
		let embeds = logQueue[guildId].splice(0, 10);
		embeds.forEach(([clear]) => clearTimeout(clear));
		embeds = embeds.map(([, embed]) => embed);
		logChannel.send({ embeds })
	};

Object.entries(LogRules).forEach(([Event, Rule]) =>
	client.on(Event, async (...a) => {
		if (a[0].author && a[0].author?.id == ClientID) return;
		let guild = a.find(x => x instanceof Discord.Guild) || a.find(x => x.guild)?.guild || a.find(x => x.message)?.message?.channel?.guild || (a[0].first && a[0].first()?.guild);
		if (!guild) {
			if (Event == 'userUpdate') [...client.guilds.cache.values()].filter(g => g.members.cache.has(a[0].id))
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

		if (embed.audit) {
			embed.audit = await embed.audit;
			if (embed.audit) embed.fields.push(
				['Executor:', embed.audit.executor],
				['Reason:', embed.audit.reason]
			)
		}

		embed.fields = embed.fields.filter(f => f[1] && f[1].toString().trim());

		embed.fields = embed.fields.filter(x => x).map(x => ({
			name: x[0], //? x[0].toString() : '*Unknown*', // null
			value: x[1].toString().substr(0, 1024), //	|| '*Unknown*'
			inline: !x[2]
		}));

		embed.author = { name: embed.author };
		if (embed.authorURL) embed.author.url = embed.authorURL;
		embed.color = embed.color || (Rule.color ? `#${Rule.color}` : '#dbad11');
		embed.timestamp = timestamp;

		if (!logQueue[guild.id]) logQueue[guild.id] = [];
		let time = logQueue[guild.id].length >= 9 ? 0 : 30e3;
		logQueue[guild.id].push([setTimeout(sendLogQueue, time, guild.id, logChannel), embed])
	}));

client.on('interactionCreate', async interaction => {
	const { customId, guild, channel, user, message /*,component*/, member } = interaction;
	if (!(customId && guild && channel && message /*&&component*/)) return;

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
			let channelname = Rule.name ? Rule.name.replace(RegExp('{u}', 'g'), user.username).substr(0, 100) : `support-${user.username}`,
				dateString = moment().guild(guild).format('D/M-YYYY - HH:mm');

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
		else if (customId == 'ticket-close') {
			if (interaction.channel?.lastMessageId == message.id) {
				channel.delete(`Support Channel closed by: ${user.tag || 'Unknown'}`);
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

			channel.permissionOverwrites.create(Rule.staff, { SEND_MESSAGES: false, VIEW_CHANNEL: true });
			channel.permissionOverwrites.create(user, { SEND_MESSAGES: true })

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

			console.timeEnd('ticket-claim');
			client.emit('ticketClaim', channel, user);
		} //if ticket-claim
		else if (customId == 'ticket-claim-add') {

			interaction.values.map(id => channel.permissionOverwrites.create(id, { SEND_MESSAGES: true }));

			interaction.reply({
				ephemeral: false,
				embeds: [{
					...embedTemplate,
					description: `${user} have now added ${interaction.values.map(id => `<@${id}>`).join(',')} to write in this channel`
				}]
			})

			client.emit('ticketClaimAdd', channel, user, interaction.values);

		} //if ticket-claim-add
		else if (customId.startsWith('ticket-unclaim')) {
			if (!(customId.substr(15) == user.id || member.permissions.has(8n))) return;
			channel.permissionOverwrites.create(Rule.staff, { SEND_MESSAGES: true, VIEW_CHANNEL: true });

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
			channel.delete(`Support Channel closed by: ${user.tag || 'Unknown'}`);

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
			author: { name: `Permissons for ${object.displayName || object.name}` },
			color: object.displayColor || object.color || 'dbad11',
			fields: [
				['Permissons:', columns[0]],
				['⠀', columns[1]],
				['⠀', columns[2]]
			].filter(([, value]) => value)
				.map(([name, value]) => ({ name, value: value.toString(), inline: true }))

		};

		message.edit({
			embeds: [message.embeds[0], embed],
			components: []
		});

	} else if (customId == 'enable-custom-commands') {
		;
		interaction.reply({
			ephemeral: true,
			embeds: [{
				color: 0xdbad11,
				description: await setGuildCustomCommands(guild)
					.then(
						() => 'Setup done',
						() => 'An error occured\nYou\'ll need to `Enable Slash Commands` before clicking'
					)
			}]
		})
	};
}); // interactionCreate

client.on("guildScheduledEventCreate", console.log)

// Error.stackTraceLimit = 1e5;
const sendError = async (message = '', err) => {
	let channel = await client.channels.fetch('927875941127045180').catch(e => false);
	if (!channel) channel = await client.guilds.fetch('703665426747621467').then(guild => guild.channels.fetch('927875941127045180')).catch(e => false);

	if (channel) return channel.send(
		`${err}\n		${message}`
	)
};
process.on('uncaughtException', async err => {
	console.log(
		'\n\nUncaught error:\n',
		err.name, err.message, '\n',
		err.stack.split('\n').filter(s => s.includes('src/managers') || s.includes('KonkenBoten/script.js')).join('\n'),
		'\n\n'
	);
	await sendError(err.stack.split('\n').find(s => s.includes('KonkenBoten/script.js')), err);

})
console.timeEnd('Load');