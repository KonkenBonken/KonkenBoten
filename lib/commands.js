const color = parseInt('dbad11', 16);

async function Mod({ com, GuildData, guild, author, user, reason, banMessage, dmInvite, duration, allowNoMember }, fun) {
	const until = duration && new Date(Date.now() + duration * 1000),
		comType = com.replace(/^temp/, '');

	if (!GuildData.Moderation) GuildData.Moderation = {};
	const { Moderation } = GuildData;

	const member = await guild.members.fetch(user).catch(e => false);
	const modChannel = await client.channels.fetch(Moderation.channel).catch(e => false)

	if (!member && !allowNoMember) throw 'User not found';
	if (member) {
		if (guild.ownerId === member.id) throw `You cannot ${com} server owner`;
		if (author.id === member.id) throw `You cannot ${com} yourself`;
		if (author.roles.highest.position < member.roles.highest.position) throw `You cannot ${com} members with a higher role then you`;
		if (guild.me.roles.highest.position < member.roles.highest.position) throw `<@813803575264018433> cannot ${com} members with higher role then itself`;
	}
	if (!modChannel) throw 'Channel not found';

	if (fun)
		await fun({ member, Moderation });

	if (!Moderation.logs[author.id])
		Moderation.logs[author.id] = [];

	Moderation.logs[author.id].push({ t: comType, s: author.id, r: reason, m: user.id, d: encodeT(), dur: duration, unt: until && encodeT(until) });

	const text = {
		...ObjectMerge({ reason: 'Reason:', hasBeen: 'has been', by: 'by', duration: 'Duration:', messageFrom: `Message from ${guild.name}:`, until: 'until', color: 'dbad11' },
			Moderation.text || {}
		),
		...ObjectMerge(
			commands.find(c => c.com == comType) || {},
			Moderation.coms?.[com] || {}
		)
	};

	modChannel.send(((Reason, { reason, hasBeen, duration, color, txt, until }, Duration, Until) => {
		let embed = {
			author: { name: `${user.tag||user} ${hasBeen} ${txt}`, iconURL: user.tag && user.displayAvatarURL() },
			fields: [],
			color: parseInt(color, 16) || 14396689,
		};
		if (Reason)
			embed.fields.push({ name: reason, value: Reason });
		if (Until && Duration) {
			embed.footer = { text: `${capital(txt.split(" ").pop())} ${until}` };
			embed.timestamp = Until;
			embed.fields.push({ name: duration, value: CleanDate(Duration) })
		};
		return ({ embeds: [embed] });
	})(reason, text, duration, until));

	if (dmInvite) {
		let invites = await guild.invites.fetch().catch(e => undefined);
		var dmInvite =
			invites && [...invites.values()].find(i => i.inviter?.id == guild.me.id && i.channel.id == modChannel.id) ||
			await modChannel.createInvite({ maxAge: 0, unique: true, reason: 'Created an Invite for inviting tempbanned or kicked members' });
		if (dmInvite) dmInvite = dmInvite.toString();
	}

	await user.send({
		content: dmInvite,
		embeds: [{
				author: { name: `${user.tag} ${text.hasBeen} ${text.txt} ${Moderation.tellWho? `${text.by} ${author?.user?.tag}`:''}` },
				description: reason,
				color: parseInt(text.color, 16) || 14396689,
				footer: { text: until ? `${text.txt} until` : guild.name, iconURL: guild.iconURL() },
				timestamp: until
			},
			(banMessage || Moderation.dmAll) && Moderation.banMessage && {
				author: { name: text.messageFrom },
				description: Moderation.banMessage,
				color: parseInt(text.color, 16) || 14396689
			}
		].filter(x => x)
	}).catch(() => null);
}

let commands;
let client, Duration, CleanDate, moment, ParseModLogs, WriteDataBase, ObjectMerge, MutedPermissions, DataBase, capital, newDiv, encodeT;
export default (globals) => {
	client = globals.client;
	Duration = globals.Duration;
	CleanDate = globals.CleanDate;
	moment = globals.moment;
	ParseModLogs = globals.ParseModLogs;
	WriteDataBase = globals.WriteDataBase;
	ObjectMerge = globals.ObjectMerge;
	MutedPermissions = globals.MutedPermissions;
	DataBase = globals.DataBase;
	capital = globals.capital;
	newDiv = globals.newDiv;
	encodeT = globals.encodeT;

	return commands = [{
			com: 'suggest',
			des: 'Used by member to submit a Suggestion',
			options: {
				suggestion: { type: 'STRING', description: 'Your suggestion', required: true }
			},
			handler: async ({ suggestion }, { member }, { error, GuildData: { Suggestions: Rule } }) => {

				let index = +Rule.index || 1,
					channel = await client.channels.fetch(Rule.channels.suggest).catch(() => false);

				if (!channel) return error('Channel not found');

				let msg = await channel.send({
					embeds: [{
						color: parseInt(Rule.embed.colors.pending, 16),
						author: {
							iconURL: member.displayAvatarURL(),
							name: member.user.tag
						},
						title: `${Rule.embed.suggestion} #${index}`,
						description: suggestion
					}]
				});

				msg.react(Rule.embed.up || '⬆️').then(() => msg.react(Rule.embed.down || '⬇️'))
					.catch(() => 0);

				Rule.suggestions = Rule.suggestions || {};
				Rule.suggestions[index] = {
					user: member.id,
					msg: msg.id,
					suggestion
				}

				Rule.index = ++index;
				WriteDataBase();
			}
		}, {
			com: 'approve',
			des: 'Used by moderator to approve a Suggestion',
			options: {
				index: { type: 'INTEGER', description: 'The index of the suggestion', minValue: 1, required: true },
				reason: { type: 'STRING', description: 'Why you approve this suggestion; max 1024 characters', required: true }
			},
			handler: async ({ index, reason }, { guild, user }, { error, reply }) =>
				SuggestRespond(guild, user, reason, index, 'approve')
				.catch(error)
				.then(() => reply({ content: `Suggestion approved`, ephemeral: true }))
		}, {
			com: 'deny',
			des: 'Used by moderator to deny a Suggestion',
			options: {
				index: { type: 'INTEGER', description: 'The index of the suggestion', minValue: 1, required: true },
				reason: { type: 'STRING', description: 'Why you deny this suggestion; max 1024 characters', required: true }
			},
			handler: async ({ index, reason }, { guild, user }, { error, reply }) =>
				SuggestRespond(guild, user, reason, index, 'deny')
				.catch(error)
				.then(() => reply({ content: `Suggestion denied`, ephemeral: true }))
		}, {
			com: 'consider',
			des: 'Used by moderator to consider a Suggestion',
			options: {
				index: { type: 'INTEGER', description: 'The index of the suggestion', minValue: 1, required: true },
				reason: { type: 'STRING', description: 'Why you consider this suggestion; max 1024 characters', required: true }
			},
			handler: async ({ index, reason }, { guild, user }, { error, reply }) =>
				SuggestRespond(guild, user, reason, index, 'consider')
				.catch(error)
				.then(() => reply({ content: `Suggestion considered`, ephemeral: true }))
		}, {
			com: 'echo',
			des: 'Used by admin to send message through the bot; The bot copies what you say',
			options: {
				message: { type: 'STRING', description: 'The message you want to send', required: true },
				private: { type: 'BOOLEAN', description: 'Only show output to the executor', required: false }
			},
			handler: ({ message, private: priv }, { channel }, { reply }) => {
				if (message.length > 2000) {
					channel.send(content.substr(0, 2000));
					content = content.substr(2000);
				}
				if (priv)
					reply({ content: message, ephemeral: true })
				else
					channel.send({ content: message })
					.then(() => reply({ content: 'Successfully sent', ephemeral: true }));
			}
		}, {
			com: 'slowmode',
			des: 'Set the slowmode of the current channel; Use command without arguments to disable slowmode',
			options: {
				duration: { type: 'STRING', description: '%d-d; max 6 hours; default: unlimited', required: false },
				seconds: { type: 'INTEGER', description: 'Amount of seconds to set slowmode to; ignored if duration is set', minValue: 0, maxValue: 21600, required: false },
				private: { type: 'BOOLEAN', description: 'Only show output to the executor', required: false }
			},
			handler: async ({ duration, seconds, private: priv }, { channel, user }, { error, reply }) => {
				if (!channel.setRateLimitPerUser)
					return error('Slowmode can\'t be set in this channel');

				if (duration !== undefined) {
					if (duration == 'off') seconds = 0;
					else try {
						seconds = Duration(duration);
					} catch {
						return error('Invalid duration')
					}
				} else if (!seconds) seconds = 0;

				if (seconds > 21600) return error('Maximum allowed duration is 21600 seconds')

				else if (seconds === 0) var response = `Slowmode disabled`
				else if (duration) var response = `Slowmode set to ${CleanDate(seconds)}`
				else var response = `Slowmode set to ${seconds} seconds`

				await channel.setRateLimitPerUser(seconds, `${response} by ${user.tag}`);

				reply({
						embeds: [{
							color,
							description: response
						}],
						fetchReply: true,
						ephemeral: !!priv
					})
					.then(msg => priv || setTimeout(() => msg.delete(), 5e3));
			}
		}, {
			com: 'clear',
			des: 'Used by moderator to delete an amount of messages in the current channel',
			options: {
				amount: { type: 'INTEGER', description: 'Amount of messages to remove', minValue: 1, maxValue: 499, required: true },
				private: { type: 'BOOLEAN', description: 'Only show output to the executor', required: false }
			},
			handler: async ({ amount, private: priv }, { channel, member }, { error, reply }) => {
				if (!channel.bulkDelete)
					return error('Clear can\'t be done in this channel');

				let hundreds = [...Array(Math.floor(amount / 100)).fill(100), amount % 100];

				let messages = [],
					before;
				for (const limit of hundreds) {
					let msgs = await channel.messages.fetch({ limit, before });
					before = msgs.lastKey();
					messages.push([...msgs.keys()]);
				}
				let deleted = await Promise.all(messages.map(x => channel.bulkDelete(x, true)));
				deleted = deleted.map(x => x.size || 1).reduce((a, b) => a + b);

				reply({
						embeds: [{
							color,
							description: `Deleted ${deleted} messages`
						}],
						fetchReply: true,
						ephemeral: !!priv
					})
					.then(msg => priv || setTimeout(() => msg.delete(), 5e3));

				client.emit('messageClear', deleted, channel, member)
			}
		},

		{
			com: 'userinfo',
			des: 'Used by moderator to get info about a member',
			options: {
				user: { type: 'USER', description: 'The user you want the information of', required: true },
				private: { type: 'BOOLEAN', description: 'Only show output to the executor', required: false }
			},
			handler: async ({ user, private: priv }, { guild }, { error, GuildData, reply }) => {
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
							['Permissions', member.permissions.bitfield],

							['Joined server at:', moment(member.joinedAt).format('D/M-YYYY - HH:mm')],
							['Joined Discord at:', moment(user.createdAt).format('D/M-YYYY - HH:mm')],
							['Recent infractions:', ParseModLogs(GuildData.Moderation.logs, guild, member).slice(0, 3).map(log =>
								`**${capital(`${log.dur?'temporarily':''} ${log.t} ${log.dur?('- '+CleanDate(log.dur)):''}`.trim())}:**\n` +
								`⠀${(log.r||'*No reason specified*').replace(/\n/g,' ')} - *${moment(log.d).fromNow()}*`).filter(log => log.length <= 1024).join('\n') || undefined, true],
						]
						.filter(([, value]) => value != undefined)
						.map(([name, value, inline]) => ({ name, value: value.toString(), inline: !inline }))
				};

				reply({
					embeds: [embed],
					components: priv ? undefined : [{
						components: [{ label: 'Parse Permissions', customId: 'userinfo-parse-permissions-' + member.id, type: 2, style: 1 }],
						type: 1
					}],
					ephemeral: !!priv
				});
			}
		}, {
			com: 'serverinfo',
			des: 'Used by moderator to get info about the current server',
			options: {
				private: { type: 'BOOLEAN', description: 'Only show output to the executor', required: false }
			},
			handler: async ({ private: priv }, { guild }, { GuildData, reply }) => {
				const [channels, { threads }] = await Promise.all([
						guild.channels.fetch(),
						guild.channels.fetchActiveThreads(),
						guild.members.fetch({ time: 2500 })
					]),
					botCount = guild.members.cache.filter(m => m.user.bot).size;

				let embed = {
					// footer: { text: `Requested by: ${requestedBy.user.tag} | ${requestedBy.id}`, iconURL: requestedBy.displayAvatarURL() },
					author: { name: `Info about ${guild.name}` },
					color,
					thumbnail: { url: guild.iconURL({ size: 512, dynamic: true }) },
					image: { url: guild.discoverySplashURL({ size: 512, dynamic: true }) },
					fields: [
							['Id:', guild.id],
							['Owner:', `<@${guild.ownerId}>`],
							['Created at:', moment(guild.createdAt).format('D/M-YYYY - HH:mm')],

							['Categories:', channels.filter(c => c.type == 'GUILD_CATEGORY').size],
							['Channels:', channels.size],
							['Roles:', guild.roles.cache.size],

							['Text Channels:', channels.filter(c => c.isText()).size],
							['Voice Channels:', channels.filter(c => c.isVoice()).size],
							['Thread Channels:', threads.size],

							['Members:', guild.memberCount],
							['Bots:', botCount],
							['Humans:', guild.memberCount - botCount],

							['Boosts:', guild.premiumSubscriptionCount],
							['Description:', guild.description],
							['Total Infractions:', Object.values(GuildData.Moderation?.logs || {}).flat().length || undefined],
						]
						.filter(([, value]) => value != undefined)
						.map(([name, value, inline]) => ({ name, value: value.toString(), inline: !inline }))
				};

				reply({
					embeds: [embed],
					ephemeral: !!priv
				});
			}
		}, {
			com: 'roleinfo',
			des: 'Used by moderator to get info about a role',
			options: {
				role: { type: 'ROLE', description: 'The role you want the information of', required: true },
				private: { type: 'BOOLEAN', description: 'Only show output to the executor', required: false }
			},
			handler: async ({ role, private: priv }, { member, user: author, guild }, { reply }) => {
				await guild.members.fetch();

				let columns = Array(3).fill();
				var members = role.members.map(m => m.toString());
				if (members.length <= 5)
					columns[0] = members.join(',\n')
				else
					columns = columns.map((_, i) => members.splice(0, i == 2 ? 7 : Math.round(Math.min(7, members.length / 3))).join(',\n'));

				let embed = {
					footer: { text: `Requested by: ${author.tag} | ${author.id}`, iconURL: member.displayAvatarURL() },
					author: { name: `Info about ${role.name}` },
					color: role.color || color,
					thumbnail: { url: role.iconURL() },
					fields: [
							['Id:', role.id],
							['Member Count:', role.members.size],
							['Created at:', moment(role.createdAt).format('D/M-YYYY - HH:mm')],

							['Members:', columns[0]],
							['⠀', columns[1]],
							['⠀', columns[2]],
						]
						.filter(([, value]) => value)
						.map(([name, value, inline]) => ({ name, value: value.toString(), inline: !inline }))
				};

				reply({
					embeds: [embed],
					components: priv ? undefined : [{
						components: [{ label: 'Parse Permissions', customId: 'roleinfo-parse-permissions-' + role.id, type: 2, style: 1 }],
						type: 1
					}],
					ephemeral: !!priv
				});
			}
		},

		{
			com: 'infractions',
			des: 'Used by moderator to get a member\'s last logged infractions',
			options: {
				user: { type: 'USER', description: 'The user you want the infractions from; default: you', required: false },
				amount: { type: 'INTEGER', description: 'The amount of infractions return; default: 10', minValue: 1, required: false },
				private: { type: 'BOOLEAN', description: 'Only show output to the executor', required: false }
			},
			handler: async ({ user, amount, private: priv }, { guild, member: author }, { GuildData, reply }) => {
				if (!GuildData.Moderation) GuildData.Moderation = {};
				const { Moderation } = GuildData;

				if (!Moderation?.logs || !Object.keys(Moderation.logs).length)
					return reply({
						embeds: [{
							color: parseInt(Moderation?.text?.color || 'dbad11', 16),
							author: { name: `This server has no saved infractions`, iconURL: m.guild.iconURL() }
						}]
					});

				if (!user) {
					user = author.user;
					var member = author;
				} else
					var member = await guild.members.fetch(user).catch(e => undefined);

				if (!amount)
					amount = 10;

				const logs = ParseModLogs(Moderation.logs, guild, user),
					embed = {
						color: member?.displayColor || parseInt(Moderation.text?.color || 'dbad11', 16),
						author: { name: `${user.tag} has no infractions`, iconURL: user.displayAvatarURL() },
						footer: { text: `Requested by: ${author.user.tag} | ${author.id}`, iconURL: author.displayAvatarURL() }
					};

				if (!logs.length)
					return reply({ embeds: [embed] })

				embed.author.name = `${user.tag}'s infractions`;
				let fieldsLength = 0;
				const fields = logs.slice(0, amount).map(log =>
						`**${capital(`${log.dur?'temporarily':''} ${log.t} ${log.dur?('- '+CleanDate(log.dur)):''}`.trim())}:**\n` +
						`⠀${(log.r||'*No reason specified*').replace(/\n/g,' ')} - *${moment(log.d).fromNow()}*`)
					.filter(log => (fieldsLength += log.length) <= 1024)

				let last24 = logs.findIndex(log => log.d < Date.now() - 864e5),
					last30 = logs.findIndex(log => log.d < Date.now() - 2592e6);
				if (last24 == -1) last24 = logs.length;
				if (last30 == -1) last30 = logs.length;

				embed.fields = [{
						name: 'Last 24 hours',
						value: `${last24} infractions`,
						inline: true
					}, {
						name: 'Last 30 days',
						value: `${last30} infractions`,
						inline: true
					}, {
						name: 'Total',
						value: `${logs.length} infractions`,
						inline: true
					},
					{
						name: `**${fields.length >= logs.length ? `All ${logs.length}` : `Last ${fields.length}`} infractions**`,
						value: fields.join('\n')
					}
				];

				reply({
					embeds: [embed],
					ephemeral: !!priv
				});
			}
		}, {
			com: 'warn',
			des: 'Used by command-specific role or admin to warn a member',
			txt1: 'warn',
			txt: 'warned',
			options: {
				user: { type: 'USER', description: 'The user you want to warn', required: true },
				reason: { type: 'STRING', description: 'The reason for the warning; max 512 characters', required: false }
			},
			handler: async ({ user, reason }, { guild, member: author }, { GuildData, error, reply }) =>
				Mod({ com: 'warn', GuildData, guild, author, user, reason }).then(() =>
					reply({ content: `${user} has been warned`, ephemeral: true }),
					error
				)
		}, {
			com: 'kick',
			des: 'Used by command-specific role or admin to kick a member',
			txt1: 'kick',
			txt: 'kicked',
			options: {
				user: { type: 'USER', description: 'The user you want to kick', required: true },
				reason: { type: 'STRING', description: 'The reason for the kick; max 512 characters', required: false }
			},
			handler: async ({ user, reason }, { guild, member: author }, { GuildData, reply, error }) =>
				Mod({ com: 'kick', GuildData, guild, author, user, reason, dmInvite: true },
					() => guild.members.kick(user, reason)
				).then(() =>
					reply({ content: `${user} has been kicked`, ephemeral: true }),
					error
				)
		}, {
			com: 'ban',
			des: 'Used by command-specific role or admin to ban a member',
			txt1: 'ban',
			txt: 'banned',
			options: {
				user: { type: 'USER', description: 'The user you want to ban', required: true },
				reason: { type: 'STRING', description: 'The reason for the ban; max 512 characters', required: false },
				duration: { type: 'STRING', description: `%d; default: unlimited`, required: false }
			},
			handler: async ({ user, reason, duration }, { guild, member: author }, { GuildData, reply, error }) => {
				try {
					if (duration) duration = Duration(duration);
				} catch { return error('Invalid duration') }

				return Mod({ com: duration ? 'tempban' : 'ban', GuildData, guild, author, user, reason, dmInvite: !!duration, duration, banMessage: true, allowNoMember: true },
					async () => {
						await guild.members.ban(user, { reason });

						if (duration) {
							let tempIndex = DataBase.temp.length;
							DataBase.temp[tempIndex] = { g: guild.id, m: user.id, type: 'ban', until: Date.now() + (duration * 1000) };

							if (duration <= 2147483) setTimeout(() =>
								guild.members.unban(user.id, 'Temporarily ban expired')
								.then(() => delete DataBase.temp[tempIndex]),
								duration * 1000);
						}
					}
				).then(() =>
					reply({ content: `${user} has been ` + (duration ? 'tempbanned' : 'banned'), ephemeral: true }),
					error
				)
			}
		}, {
			com: 'unban',
			des: 'Used by command-specific role or admin to unban a member',
			txt1: 'unban',
			txt: 'unbanned',
			options: {
				user: { type: 'USER', description: 'The user you want to unban', required: true },
				reason: { type: 'STRING', description: 'The reason for the unban; max 512 characters', required: false }
			},
			handler: async ({ user, reason }, { guild, member: author }, { GuildData, reply, error }) =>
				Mod({ com: 'unban', GuildData, guild, author, user, reason, dmInvite: true, allowNoMember: true },
					() => guild.members.unban(user, reason)
				).then(() =>
					reply({ content: `${user} has been unbanned`, ephemeral: true }),
					error
				)
		}, {
			com: 'mute',
			des: 'Used by command-specific role or admin to mute a member',
			txt1: 'mute',
			txt: 'muted',
			options: {
				user: { type: 'USER', description: 'The user you want to mute', required: true },
				reason: { type: 'STRING', description: 'The reason for the mute; max 512 characters', required: false },
				duration: { type: 'STRING', description: `%d; default: unlimited`, required: false }
			},
			handler: async ({ user, reason, duration }, { guild, member: author }, { GuildData, reply, error }) => {
				const TimoutMaxTime = 2419e6;

				try {
					if (duration) duration = Duration(duration);
				} catch { return error('Invalid duration') }

				Mod({ com: duration ? 'tempmute' : 'mute', GuildData, guild, author, user, reason, duration },
					async ({ member, Moderation }) => {
						if (Moderation.timeout)
							await member.timeout(duration ? Math.min(duration * 1000, TimoutMaxTime) : TimoutMaxTime, reason); //28d
						else {
							const mutedRole = Moderation.muted &&
								await guild.roles.fetch(Moderation.muted).catch(async () => {
									const mutedRole = await guild.roles.create({
										name: 'Muted',
										color: 7895160, // #787878
										position: guild.me.roles.highest.position,
										mentionable: false,
										reason: 'Muted Role created'
									});

									MutedPermissions(mutedRole);
									Moderation.muted = mutedRole.id;
									return mutedRole;
								});

							if (guild.me.roles.highest.position < mutedRole.position) throw `The role ${mutedRole} is higher than ${guild.me.roles.highest}`;

							await member.roles.add(mutedRole, reason);

							if (duration) {
								let tempIndex = DataBase.temp.length;
								DataBase.temp[tempIndex] = { g: guild.id, m: member.id, type: 'mute', until: Date.now() + (duration * 1000), role: mutedRole.id, key: [author.id, (reason || '*').replace(/\W/g, '').substr(0, 20)].join('-') };

								if (duration <= 2147483) setTimeout(() => {
										member.roles.remove(mutedRole, 'Temporarily mute expired')
											.then(() => delete DataBase.temp[tempIndex]);
									},
									duration * 1000);
							}
						}
					}
				).then(() =>
					reply({ content: `${user} has been ` + (duration ? 'tempmuted' : 'muted'), ephemeral: true }),
					error
				)
			}
		}, {
			com: 'unmute',
			des: 'Used by command-specific role or admin to unmute a member',
			txt1: 'unmute',
			txt: 'unmuted',
			options: {
				user: { type: 'USER', description: 'The user you want to unmute', required: true },
				reason: { type: 'STRING', description: 'The reason for the unmute; max 512 characters', required: false }
			},
			handler: async ({ user, reason }, { guild, member: author }, { GuildData, reply, error }) =>
				Mod({ com: 'unmute', GuildData, guild, author, user, reason },
					async ({ member, Moderation }) => {
						if (Moderation.timeout)
							await member.timeout(null, reason);
						else {
							var mutedRole = Moderation.muted && await guild.roles.fetch(Moderation.muted).catch(e => false)
							if (!mutedRole) throw 'Role not found';
							if (guild.me.roles.highest.position < mutedRole.position) throw `The role ${mutedRole} is higher than ${guild.me.roles.highest}`;
							await member.roles.remove(mutedRole, reason);
						}
					}
				).then(() =>
					reply({ content: `${user} has been unmuted`, ephemeral: true }),
					error
				)
		}
	].map((command) => ({
		format: command.options && Object.entries(command.options)
			.map(([name, opt]) =>
				newDiv('span', 'argel')
				.Attribute('arg', (opt.required ? '' : '?') + name)
				.Append(
					newDiv('span')
					.Html([
							({
								STRING: 'Text',
								INTEGER: 'Number',
								USER: '@User',
								ROLE: '@Role',
								/* unused:
								BOOLEAN: 'Boolean',
								CHANNEL: '#Channel',
								MENTIONABLE: '@Any',
								NUMBER: 'Number',
								ATTACHMENT: 'File'
								*/
							})[opt.type],
							opt.description = opt.description
							.replace('%d-d', 'possible units: h, m, s; ex: 10m30s')
							.replace('%d', 'possible units: d, h, m, s; ex: 2h30m'),
							opt.type == 'INTEGER' && 'minValue' in opt && `min: ${opt.minValue}`,
							opt.type == 'INTEGER' && 'maxValue' in opt && `max: ${opt.maxValue}`,
							!opt.required && 'optional'
						]
						.filter(x => x).join('; '))
				).outerHTML).join(''),
		...command
	}));
};