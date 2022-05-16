const argEl = (arg, des) => `<span class="argel" arg="${arg}"><span>${des}</span></span>`,
	durationDescription = 'possible units are d, h, m, s; example: 2h30m = 2 hours and 30 minutes; max 21600 seconds';


export default ({ /* client, DataBase, Cache, WriteDataBase */ }) => [{
		com: 'suggest',
		des: 'Used by member to submit a Suggestion',
		format: argEl('suggestion', 'text; max 4096 characters'),
		options: {
			index: { type: 'INTEGER', description: 'The index of the suggestion', minValue: 1, required: true },
			suggestion: { type: 'STRING', description: 'Your suggestion', required: true }
		}
	}, {
		com: 'approve',
		des: 'Used by moderator to approve a Suggestion',
		format: argEl('index', 'number') + argEl('reason', 'text; max 1024 characters'),
		options: {
			index: { type: 'INTEGER', description: 'The index of the suggestion', minValue: 1, required: true },
			reason: { type: 'STRING', description: 'Why you approve this suggestion', required: true }
		}
	}, {
		com: 'deny',
		des: 'Used by moderator to deny a Suggestion',
		format: argEl('index', 'number') + argEl('reason', 'text; max 1024 characters'),
		options: {
			index: { type: 'INTEGER', description: 'The index of the suggestion', minValue: 1, required: true },
			reason: { type: 'STRING', description: 'Why you deny this suggestion', required: true }
		}
	}, {
		com: 'consider',
		des: 'Used by moderator to consider a Suggestion',
		format: argEl('index', 'number') + argEl('reason', 'text; max 1024 characters'),
		options: {
			index: { type: 'INTEGER', description: 'The index of the suggestion', minValue: 1, required: true },
			reason: { type: 'STRING', description: 'Why you consider this suggestion', required: true }
		}
	}, {
		com: 'echo',
		des: 'Used by admin to send message through the bot; The bot copies what you say',
		format: argEl('message', 'text; max 4000 characters'),
		options: {
			message: { type: 'STRING', description: 'The message you want to send', required: true }
		}
	}, {
		com: 'slowmode',
		des: 'Used by moderator to set the slowmode of the current channel; Use command without arguments to disable slowmode',
		format: argEl('?duration', `duration; ${durationDescription}; optional`),
		options: {
			duration: { type: 'STRING', description: `${durationDescription}; default: unlimited`, required: false }
		}
	}, {
		com: 'clear',
		des: 'Used by moderator to delete an amount of messages in the current channel',
		format: argEl('amount', 'number; max 499'),
		options: {
			amount: { type: 'INTEGER', description: 'Amount of messages to remove', minValue: 1, maxValue: 499, required: true }
		}
	},

	{
		com: 'info user',
		des: 'Used by moderator to get info about a member',
		format: argEl('@user', 'user-tag or id'),
		options: {
			user: { type: 'USER', description: 'The user you want the information of', required: true }
		}
	}, {
		com: 'info server',
		des: 'Used by moderator to get info about the current server',
	}, {
		com: 'info role',
		des: 'Used by moderator to get info about a role',
		format: argEl('@role', 'role-tag or id'),
		options: {
			role: { type: 'ROLE', description: 'The role you want the information of', required: true }
		}
	},

	{
		com: 'infractions',
		des: 'Used by moderator to get a member\'s last logged infractions',
		format: argEl('@user', 'user-tag or id'),
		options: {
			user: { type: 'USER', description: 'The user you want the infractions from; default: you', required: false },
			amount: { type: 'INTEGER', description: 'The amount of infractions return; default: 10', required: false }
		}
	}, {
		com: 'warn',
		des: 'Used by command-specific role or admin to warn a member',
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
		format: argEl('@user', 'user-tag or id') + argEl('?reason', 'text; max 512 characters'),
		txt1: 'unmute',
		txt: 'unmuted',
		options: {
			user: { type: 'USER', description: 'The user you want to unmute', required: true },
			reason: { type: 'INTEGER', description: 'The reason for the unmute; max 512 characters', required: false }
		}
	}
];