const argEl = (arg, des) => `<span class="argel" arg="${arg}"><span>${des}</span></span>`,
	durationDescription = 'possible units are d, h, m, s; example: 2h30m = 2 hours and 30 minutes; max 21600 seconds',
	color = parseInt('dbad11', 16);


export default ({ /* client, DataBase, Cache, WriteDataBase */ }) => [{
		com: 'suggest',
		des: 'Used by member to submit a Suggestion',
		default: false,
		format: argEl('suggestion', 'text; max 4096 characters'),
		options: {
			index: { type: 'INTEGER', description: 'The index of the suggestion', minValue: 1, required: true },
			suggestion: { type: 'STRING', description: 'Your suggestion', required: true }
		}
	}, {
		com: 'approve',
		des: 'Used by moderator to approve a Suggestion',
		default: false,
		format: argEl('index', 'number') + argEl('reason', 'text; max 1024 characters'),
		options: {
			index: { type: 'INTEGER', description: 'The index of the suggestion', minValue: 1, required: true },
			reason: { type: 'STRING', description: 'Why you approve this suggestion', required: true }
		}
	}, {
		com: 'deny',
		des: 'Used by moderator to deny a Suggestion',
		default: false,
		format: argEl('index', 'number') + argEl('reason', 'text; max 1024 characters'),
		options: {
			index: { type: 'INTEGER', description: 'The index of the suggestion', minValue: 1, required: true },
			reason: { type: 'STRING', description: 'Why you deny this suggestion', required: true }
		}
	}, {
		com: 'consider',
		des: 'Used by moderator to consider a Suggestion',
		default: false,
		format: argEl('index', 'number') + argEl('reason', 'text; max 1024 characters'),
		options: {
			index: { type: 'INTEGER', description: 'The index of the suggestion', minValue: 1, required: true },
			reason: { type: 'STRING', description: 'Why you consider this suggestion', required: true }
		}
	}, {
		com: 'echo',
		des: 'Used by admin to send message through the bot; The bot copies what you say',
		default: true,
		format: argEl('message', 'text; max 4000 characters'),
		options: {
			message: { type: 'STRING', description: 'The message you want to send', required: true }
		},
		handler: ({ message }, { channel, reply }) => {
			if (message.length > 2000) {
				channel.send(content.substr(0, 2000));
				content = content.substr(2000);
			}
			return channel.send(content).then(() =>
				reply('Successfully sent'));
		}
	}, {
		com: 'slowmode',
		des: 'Used by moderator to set the slowmode of the current channel; Use command without arguments to disable slowmode',
		default: true,
		format: argEl('?duration', `duration; ${durationDescription}; optional`),
		options: {
			duration: { type: 'STRING', description: `${durationDescription}; default: unlimited`, required: false },
			seconds: { type: 'INTEGER', description: 'Amount of seconds to set slowmode to; ignored if duration is set', minValue: 0, maxValue: 21600, required: false }
		},
		handler: async ({ duration, seconds }, { channel, user, reply }, { Duration, error, CleanDate }) => {
			if (!channel.setRateLimitPerUser)
				return error('Slowmode can\'t be set in this channel');

			if (duration !== undefined) {
				if (duration == 'off') seconds = 0;
				else try {
					seconds = Duration(duration);
				} catch {
					return error('Invalid duration')
				}
			}

			if (seconds > 21600) return error('Maximum allowed duration is 21600 seconds')

			else if (seconds === 0) var response = `Slowmode disabled`
			else if (duration) var response = `Slowmode set to ${CleanDate(seconds)}`
			else var response = `Slowmode set to ${seconds} seconds`

			await channel.setRateLimitPerUser(seconds, `${response} by ${user.tag}`);

			const embeds = [{
				color,
				description: response
			}];

			channel.send({ embeds })
				.then(msg => setTimeout(() => msg.delete(), 5e3));
			reply({ embeds, ephemeral: true });
		}
	}, {
		com: 'clear',
		des: 'Used by moderator to delete an amount of messages in the current channel',
		default: true,
		format: argEl('amount', 'number; max 499'),
		options: {
			amount: { type: 'INTEGER', description: 'Amount of messages to remove', minValue: 1, maxValue: 499, required: true }
		},
		handler: async ({ amount }, { channel, reply, member }, { error, client }) => {
			if (!m.channel.bulkDelete)
				return error('Clear can\'t be done in this channel');

			let hundreds = [...Array(Math.floor(amount / 100)).fill(100), amount % 100];

			let messages = [],
				before = (BigInt(m.id) + 1n).toString();
			for (const limit of hundreds) {
				let msgs = await m.channel.messages.fetch({ limit, before });
				before = msgs.lastKey();
				messages.push([...msgs.keys()]);
			}
			let deleted = await Promise.all(messages.map(x => m.channel.bulkDelete(x, true)));
			deleted = deleted.map(x => x.size || 1).reduce((a, b) => a + b) - 1;

			const embeds = [{
				color,
				description: `Deleted ${deleted} messages`
			}];

			channel.send({ embeds })
				.then(msg => setTimeout(() => msg.delete(), 5e3));
			reply({ embeds, ephemeral: true });

			client.emit('messageClear', deleted, channel, member)
		}
	},

	{
		com: 'userinfo',
		des: 'Used by moderator to get info about a member',
		default: true,
		format: argEl('@user', 'user-tag or id'),
		options: {
			user: { type: 'USER', description: 'The user you want the information of', required: true }
		},
		handler: async ({ user }, { guild, reply }, { error, GuildData, CleanDate, moment, ParseModLogs, capital }) => {
			const member = await guild.members.fetch(user).catch(() => false);

			if (!member || !member.user)
				return error('User not found');

			let embed = {
				// footer: { text: `Requested by: ${requestedBy.user.tag} | ${requestedBy.id}`, iconURL: requestedBy.displayAvatarURL() },
				author: { name: `Info about ${member.displayName}` },
				color: member.displayColor || 'dbad11',
				thumbnail: { url: member.displayAvatarURL() },
				fields: [
						['Id:', member.id],
						['Username:', user.tag],
						['Bot:', user.bot ? 'Yes' : 'No'],
						['Boosted:', member.premiumSince ? 'Since ' + moment(member.premiumSince).format('D/M-YYYY - HH:mm') : 'No'],
						['Muted:', (GuildData.Moderation.timout ? member.isCommunicationDisabled() : member.roles.cache.has(GuildData.Moderation.muted)) ? 'Yes' : 'No'],
						['Permissions', member.permissions.bitfield], // Object.entries(member.permissions.serialize()).filter(([, v]) => v).map(([k]) => k)
						['Joined server at:', moment(member.joinedAt).format('D/M-YYYY - HH:mm')], // ['⠀', '⠀'],
						['Joined Discord at:', moment(user.createdAt).format('D/M-YYYY - HH:mm')],
						['Recent infractions:', ParseModLogs(GuildData.Moderation.logs, m.guild, member).slice(0, 3).map(log =>
							`**${capital(`${log.dur?'temporarily':''} ${log.t} ${log.dur?('- '+CleanDate(log.dur)):''}`.trim())}:**\n` +
							`⠀${(log.r||'*No reason specified*').replace(/\n/g,' ')} - *${moment(log.d).fromNow()}*`).filter(log => log.length <= 1024).join('\n') || undefined, true],
					]
					.filter(([, value]) => value != undefined)
					.map(([name, value, inline]) => ({ name, value: value.toString(), inline: !inline }))
			};

			reply({
				embeds: [embed],
				components: [{
					components: [{ label: 'Parse Permissions', customId: 'userinfo-parse-permissions-' + memberID, type: 2, style: 1 }],
					type: 1
				}]
			});
		}
	}, {
		com: 'serverinfo',
		des: 'Used by moderator to get info about the current server',
		default: true
	}, {
		com: 'roleinfo',
		des: 'Used by moderator to get info about a role',
		default: true,
		format: argEl('@role', 'role-tag or id'),
		options: {
			role: { type: 'ROLE', description: 'The role you want the information of', required: true }
		}
	},

	{
		com: 'infractions',
		des: 'Used by moderator to get a member\'s last logged infractions',
		default: true,
		format: argEl('@user', 'user-tag or id'),
		options: {
			user: { type: 'USER', description: 'The user you want the infractions from; default: you', required: false },
			amount: { type: 'INTEGER', description: 'The amount of infractions return; default: 10', required: false }
		}
	}, {
		com: 'warn',
		des: 'Used by command-specific role or admin to warn a member',
		default: true,
		format: argEl('@user', 'user-tag or id') + argEl('?reason', 'text; max 512 characters'), //ban reason is limiting, otherwise 512
		txt1: 'warn',
		txt: 'warned',
		options: {
			user: { type: 'USER', description: 'The user you want to warn', required: true },
			reason: { type: 'INTEGER', description: 'The reason for the warning; max 512 characters', required: false }
		}
	}, {
		com: 'kick',
		des: 'Used by command-specific role or admin to kick a member',
		default: true,
		format: argEl('@user', 'user-tag or id') + argEl('?reason', 'text; max 512 characters'),
		txt1: 'kick',
		txt: 'kicked',
		options: {
			user: { type: 'USER', description: 'The user you want to kick', required: true },
			reason: { type: 'INTEGER', description: 'The reason for the kick; max 512 characters', required: false }
		}
	}, {
		com: 'ban',
		des: 'Used by command-specific role or admin to ban a member',
		default: true,
		format: argEl('@user', 'user-tag or id') + argEl('?reason', 'text; max 512 characters'),
		txt1: 'ban',
		txt: 'banned',
		options: {
			user: { type: 'USER', description: 'The user you want to ban', required: true },
			reason: { type: 'INTEGER', description: 'The reason for the ban; max 512 characters', required: false },
			duration: { type: 'STRING', description: `${durationDescription}; default: unlimited`, required: false }
		}
	}, {
		com: 'unban',
		des: 'Used by command-specific role or admin to unban a member',
		default: true,
		format: argEl('@user', 'user-tag or id') + argEl('?reason', 'text; max 512 characters'),
		txt1: 'unban',
		txt: 'unbanned',
		options: {
			user: { type: 'USER', description: 'The user you want to unban', required: true },
			reason: { type: 'INTEGER', description: 'The reason for the unban; max 512 characters', required: false }
		}
	}, {
		com: 'mute',
		des: 'Used by command-specific role or admin to mute a member',
		default: true,
		format: argEl('@user', 'user-tag or id') + argEl('?reason', 'text; max 512 characters'),
		txt1: 'mute',
		txt: 'muted',
		options: {
			user: { type: 'USER', description: 'The user you want to mute', required: true },
			reason: { type: 'INTEGER', description: 'The reason for the mute; max 512 characters', required: false },
			duration: { type: 'STRING', description: `${durationDescription}; default: unlimited`, required: false }
		}
	}, {
		com: 'unmute',
		des: 'Used by command-specific role or admin to unmute a member',
		default: true,
		format: argEl('@user', 'user-tag or id') + argEl('?reason', 'text; max 512 characters'),
		txt1: 'unmute',
		txt: 'unmuted',
		options: {
			user: { type: 'USER', description: 'The user you want to unmute', required: true },
			reason: { type: 'INTEGER', description: 'The reason for the unmute; max 512 characters', required: false }
		}
	}
];