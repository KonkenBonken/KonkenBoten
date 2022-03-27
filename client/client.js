let DebugTest; {
	const socket = io('/', { query: { DID } });
	[DID, io] = [];
	const newDiv = (el = 'div', ...classes) => {
			let div = document.createElement(el);
			if (classes) classes.forEach(cl => div.classList.add(cl));
			return div;
		},
		newToggle = on => {
			let toggle = newDiv('label'),
				checkbox = newDiv('input');
			checkbox.type = 'checkbox';
			toggle.append(checkbox, newDiv());
			if (on) checkbox.setAttribute('checked', '');
			return toggle;
		},
		h6 = (txt, i) => {
			let el = newDiv('h6');
			el.innerHTML = txt;
			if (i) el.append(i);
			return el;
		},
		h5 = (txt, i) => {
			let el = newDiv('h5');
			el.innerHTML = txt;
			if (i) el.append(i);
			return el;
		},
		infoPopup = (txt) => {
			let i = newDiv('i', 'info'),
				popupPar = newDiv('div'),
				popup = newDiv('div');
			popup.innerHTML = txt;
			i.append(popupPar);
			popupPar.append(popup);
			return i;
		},

		querySelector = s => document.querySelector(s),
		querySelectorAll = s => Array.from(document.querySelectorAll(s)),
		q = querySelector,
		qa = querySelectorAll,
		textAreaSizeFun = textarea => {
			if (textarea) {
				['keydown', 'keyup', 'input'].forEach(x =>
					textarea.addEventListener(x, e => textarea.style.setProperty('--height', textarea.value.split('\n').length * 19.2 + 32))); //Math.min(input.scrollHeight, input.value.split('\n').length * 19.2 + 32)
				textarea.style.setProperty('--height', 51.2) //19.2 + 32
			}
		},
		labelToChecked = label => !!label?.firstChild?.checked,
		RangeInputLabelSetup = (input, ...labels) => {
			let update = () => input.setAttribute('shw', labels[+input.value] || '');
			input.addEventListener('input', update);
			update();
		};
	let prefix = '$',
		datalistText, datalistRoles, datalistVoice,
		logLoadIndex = 0,
		resolveDatalists,
		awaitDatalists = new Promise(r => resolveDatalists = r),
		resolveEmojilist,
		awaitEmojilist = new Promise(r => resolveEmojilist = r),
		resolveLoad,
		awaitLoad = new Promise(r => resolveLoad = r);
	if (document.readyState == 'loading')
		document.addEventListener('DOMContentLoaded', resolveLoad);
	else
		resolveLoad();

	Object.defineProperty(Array.prototype, 'filterX', { get: function () { return this.filter(Boolean) } });

	const elProto = HTMLElement.prototype;
	elProto.Html = function (str) { this.innerHTML = str; return this };
	elProto.Id = function (str) { this.id = str; return this };
	elProto.Type = function (str) { this.type = str; return this };
	elProto.Value = function (str) { this.value = str; return this };
	elProto.Src = function (str) { this.src = str; return this };
	elProto.Append = function (...el) { if (el[0]) this.append(...el); return this };
	elProto.Prepend = function (...el) { if (el[0]) this.prepend(...el); return this };
	elProto.Attribute = function (key, value = '', ignIfEpty = false) { if (!ignIfEpty && value) this.setAttribute(key, value); return this };
	elProto.On = function (a, b) { this.addEventListener(b ? a : 'click', b || a); return this };

	let ShiftKeyPressed = false;
	document.addEventListener('keydown', ({ shiftKey }) => ShiftKeyPressed = shiftKey);
	document.addEventListener('keyup', ({ shiftKey }) => ShiftKeyPressed = shiftKey);

	awaitLoad.then(() => {
		if (location.hash) querySelector(location.hash)?.scrollIntoView();
		document.body.append(loadListDiv);
		setTimeout(() => q('header').removeAttribute('noSpin'), 1010);
		window.addEventListener('beforeunload', e => document.body.classList.add('fadeOut'));
		querySelector('a.logo').addEventListener('click', e => document.body.classList.add('fadeLogo'));

	});

	const
		$DCblue = '#7289da', //local edit; default
		$DCyellow = '#faa61a', //local error; not valid input
		$DCgray = '#747f8d', //  other edit
		$DCgreen = '#43b581', // other join
		$DCred = '#f04747'; //   other leave


	const loadListDiv = newDiv('div', 'loadlist'),
		loadListEntry = (des, clr, load = true) => {
			if (load) {
				logLoadIndex--;
				if (!logLoadIndex) document.body.removeAttribute('loading');
			}
			if (des) {
				let entry = newDiv('div', 'entry');
				entry.innerHTML = des;
				if (clr) entry.style.setProperty('--clr', clr);
				loadListDiv.append(entry);
				setTimeout(() => entry.remove(), 4000)
			}
		},
		logLoad = () => { // logLoad = () => {q('header').setAttribute('loading', '');logLoadIndex++;return () => { if (!(--logLoadIndex)) q('header').removeAttribute('loading'); }};
			document.body.setAttribute('loading', '');
			logLoadIndex++;
			return loadListEntry;
		},
		loadListError = des => loadListEntry(des, $DCyellow, false);
	DebugTest = loadListError;
	socket.on('logLoad', (tag, edit, type) => {

		// $DCblue //   local edit; default
		// $DCyellow // local error; not valid input
		// $DCgray //   other edit
		// $DCgreen //  other join
		// $DCred //    other leave

		let clr = $DCgray;

		if (type == 1) {
			clr = edit ? $DCgreen : $DCred;
			edit = tag + ' logged ' + (edit ? 'in' : 'out');
		} else
			edit = `<span>${tag}:</span>` + edit;

		loadListEntry(edit, clr, false);
	})


	Element.prototype.q = function (a) { return this.querySelector(a) }
	Element.prototype.qa = function (a) { return Array.from(this.querySelectorAll(a)) }

	socket.emit('GetPrefix', 0, (res, defaultPrefix) => {
		if (res != defaultPrefix) {
			prefix = res;
			document.documentElement.style.setProperty('--prefix', `"${res}"`);
		}
	});
	let GetAllTime = {};
	GetAllTime.datalists = Date.now();

	socket.emit('Datalists', 0, res => {
		// console.log(res);
		// res=	Object.fromEntries(	Object.fromEntries(res).map())
		// if (res) {
		[datalistText, datalistRoles, datalistVoice] = [res.datalistText, res.datalistRoles, res.datalistVoice];
		resolveDatalists();

		awaitLoad.then(() => document.head.append(...[
			['datalisttext', datalistText],
			['datalistroles', datalistRoles],
			['datalistvoice', datalistVoice]
		].map(([id, datalist]) => {
			let element = newDiv('datalist');
			element.id = id;
			element.append(...Object.values(datalist).map(x => {
				const option = newDiv('option');
				option.innerHTML = x.name;
				option.value = x.id;
				// if (x.color) option.style.color = x.color;
				return option;
			}));
			return element;
		})))
		console.debug('Datalists Fetched:', (Date.now() - GetAllTime.datalists) / 1e3, 'sec', [datalistText, datalistRoles, datalistVoice]);
		// }
	});
	const hiddenWidth = newDiv('span', 'hide'),
		sizeFun = (input, self = true, varible = '--wdth', norepeat) => {
			hiddenWidth.innerHTML = (input.value ? input.value : input.placeholder);
			hiddenWidth.style.fontSize = getComputedStyle(input).getPropertyValue('font-size');
			(self === true ? input : self).style.setProperty(varible, hiddenWidth.clientWidth);
			hiddenWidth.innerHTML = '';
			if (!norepeat) setTimeout(() => sizeFun(input, self, varible, true), 3e3)
		};
	awaitLoad.then(() => {
		document.body.append(hiddenWidth);

		querySelector('header userpopup>.logout').addEventListener('click', e =>
			window.open('/logout', "_self"))
		querySelector('header>.user>img').addEventListener('click', e => {
			e.stopPropagation();
			querySelector('header userpopup').toggleAttribute('show')
		});
		document.body.addEventListener("click", e => {
			if (!e.target.matches('userpopup,userpopup *')) querySelector('header userpopup').removeAttribute('show');
			// if (!e.target.matches('.plus,.plus *')) querySelector('.listSelector')?.remove();
		});
		querySelector('header>.guildDropDown').addEventListener('change', e => {
			let value = e.target.value;
			if (value == 'AddNew') {
				window.open('https://discord.com/api/oauth2/authorize?client_id=813803575264018433&permissions=8&scope=bot', 'popup',
					`left=${screen.availWidth/2-200},top=${screen.availHeight/2-350},width=400,height=700`)
				socket.emit('NewGuildSubrcibe', 0, id => window.open(`/Guild/${id}`, "_self"));
			} else window.open(`/Guild/${value}`, "_self")
		});


		querySelector('setprefix>div').addEventListener('click', e => {
			let stopLoad = logLoad(),
				button = e.target,
				input = button.parentElement.q('input'),
				newPrefix = input.value;
			if (newPrefix != prefix) socket.emit('SetPrefix', newPrefix, newPrefix => {
				prefix = newPrefix;
				document.documentElement.style.setProperty('--prefix', `"${newPrefix}"`);
				input.value = newPrefix;
				stopLoad('Prefix set to ' + newPrefix);
			})
			else stopLoad('Prefix already set');
		});


		querySelector("ticketsettings>label>input").addEventListener('change', e => {
			let stopLoad = logLoad();
			socket.emit('ToggleTickets', 0, res => {
				e.target.parentElement.parentElement.toggleAttribute('show', res);
				e.target.checked = !!res
				stopLoad('Support Channels ' + (res ? 'enabled' : 'disabled'));
			})
		});
		// DatalistRolesFunction(querySelector("ticketsettings .staffSelect"));

		querySelector("suggestsettings>label>input").addEventListener('change', e => {
			let stopLoad = logLoad();
			socket.emit('Suggestions', ['toggle'], (res, err) => {
				if (err) console.debug(err)

				e.target.parentElement.parentElement.toggleAttribute('show', res);
				e.target.checked = !!res
				stopLoad('Support Channels ' + (res ? 'enabled' : 'disabled'));
			})
		});


		let embedsDiv = querySelector('suggestsettings .embeds'),
			titlesT = qa('input.title'),
			titlesRF = qa('input.reasonFrom');
		sizeFun(titlesT[0], embedsDiv, '--titlewdth');
		sizeFun(titlesRF[0]);
		setTimeout(() => {
			sizeFun(titlesT[0], embedsDiv, '--titlewdth');
			sizeFun(titlesRF[0])
		}, 2e3);

		qa('.statusname').forEach(el => {
			sizeFun(el, true);
			el.addEventListener('keyup', e => sizeFun(el, true));
			el.addEventListener('keydown', e => setTimeout(() => sizeFun(el, true), 1))
		});


		titlesT.forEach(input => {
			input.addEventListener('keyup', e => {
				titlesT.forEach(other => other.value = input.value);
				sizeFun(input, embedsDiv, '--titlewdth');
			});
		});

		titlesRF.forEach(input => {
			input.addEventListener('keyup', e => {
				titlesRF.forEach(other => other.value = input.value);
				sizeFun(input, embedsDiv);
			});
			// input.addEventListener('input', e => sizeFun(input));
			input.addEventListener('keydown', e => setTimeout(() => sizeFun(input, embedsDiv), 1));
		});
	})
	// let embeds = embedsDiv.children


	// setTimeout(el => {
	// 	el = querySelector('iframe#_hjRemoteVarsFrame');
	// 	if (el?.attributes)[...el.attributes].forEach(x => x.name != 'src' && el.removeAttributeNode(x))
	// }, 500);
	// setTimeout(x => querySelector('style:last-child')?.remove(), 500);

	const utfToEmoji = id => {
			x = parseInt(id, 16);
			if (id.length == 4) return String.fromCharCode(x)
			return String.fromCharCode(((((x - 0x10000) >> 10) | 0) + 0xD800), (((x - 0x10000) & 0x3FF) + 0xDC00));
		},
		emojiToObj = e => [...EmojiList, ...GuildEmojis].find(o => o.e == e || o.identifier == e);
	let EmojiList, GuildEmojis = [],
		addEmojiSetup;
	GetAllTime.emojilist = Date.now();
	socket.emit('EmojiList', 0, ([res, guildeRes]) => {
		EmojiList = res.split(';').map(s => s.split(',')).map(([n, id]) => ({
			e: utfToEmoji(id),
			id,
			n,
			url: `https://twemoji.maxcdn.com/v/latest/72x72/${id}.png`,
		}));

		if (guildeRes) GuildEmojis = guildeRes.split(';').map(s => s.split(',')).map(([n, id, gif]) => ({
			id,
			n,
			identifier: `${n}:${id}`,
			url: `https://cdn.discordapp.com/emojis/${id}.${gif?'gif':'png'}`
		}))

		const style = newDiv('style').Html(`.emojiSelector{display:none}`)
		document.head.append(style);


		awaitLoad.then(() => [...qa('.emoji')].forEach(el => {
			if (el.innerHTML > 2) return;
			let emoji = emojiToObj(el.innerHTML);
			// console.debug(el.innerHTML, emoji, 5126);
			if (emoji) el.parentElement.replaceChild(
				newDiv('div', 'emoji').Attribute('e', emoji.e)
				.Append(newDiv('img').Src(emoji.url)),
				el
			)
			else el.setAttribute('e', el.innerHTML)
		}))
		addEmojiSetup = (parent, clickedFunction, guildemojis) => {
			let grid = newDiv('div', 'emojiSelector'),
				gridInner = newDiv('div'),
				input = newDiv('input'),
				emojiArray = [];


			if (guildemojis) gridInner.append(...GuildEmojis.map(emoji => {
				let emojiDiv = newDiv('div').Attribute('e', emoji.identifier) //.Attribute('ttl', emoji.n)
					.Append(
						newDiv('img').Attribute('loading', 'lazy').Src(emoji.url),
						newDiv('div', 'title').Html(emoji.n)
					);
				if (clickedFunction) emojiDiv.addEventListener('click', () => clickedFunction(emoji))
				emojiArray.push([emojiDiv, emoji.n.toLowerCase()]);
				return emojiDiv;
			}));

			gridInner.append(...EmojiList.map(emoji => {
				let emojiDiv = newDiv('div').Attribute('e', emoji.e) //.Attribute('ttl', emoji.n)
					.Append(
						newDiv('img').Attribute('loading', 'lazy').Src(emoji.url),
						newDiv('div', 'title').Html(emoji.n)
					);
				if (clickedFunction) emojiDiv.addEventListener('click', () => clickedFunction(emoji))
				emojiArray.push([emojiDiv, emoji.n.toLowerCase()]);
				return emojiDiv;
			}));

			parent.append(grid);
			grid.append(input, gridInner);
			parent.addEventListener('click', e => {
				if (!e.target.matches('.emojiSelector>*') && (!ShiftKeyPressed || !grid.hasAttribute('show'))) {
					if (grid.toggleAttribute('show'))
						input.focus();
					input.value = '';
					parent.qa('[hide]').forEach(el => el.removeAttribute('hide'));
				}
			});
			document.body.addEventListener("click", e => {
				if (!parent.contains(e.target))
					grid.removeAttribute('show');
			});
			parent.addEventListener('click', e => style.remove(), { once: true });

			input.placeholder = 'Search';
			input.addEventListener('keyup', () => emojiArray.forEach(([el, name]) =>
				el.toggleAttribute('hide', input.value && !name.includes(input.value.toLowerCase()))
			));
		}

		awaitLoad.then(() => qa('.embed>.reaction').forEach(selector => addEmojiSetup(selector, emoji => {
			selector.replaceChild(
				newDiv('div', 'emoji').Attribute('e', emoji.e)
				.Append(newDiv('img').Src(emoji.url)),
				selector.firstChild
			)
		})));

		resolveEmojilist()
		console.debug('Emojis Fetched:', (Date.now() - GetAllTime.emojilist) / 1e3, 'sec', EmojiList, GuildEmojis);
	});


	// if (window.visualViewport) window.visualViewport.addEventListener("resize", e => setTimeout(x => querySelector('pages').scrollBy(1, 0), 10)); // && !DontScroll

	awaitLoad.then(() => {
		let saveOption = querySelector('input.saveOption');
		RangeInputLabelSetup(saveOption, 'Always', 'Ask', 'Never');

		querySelector('ticketsettings .set').addEventListener('click', e => {
			let stopLoad = logLoad();
			let ticketsettings = querySelector('ticketsettings'),
				embeds = ticketsettings.qa('.embed.first :is(.author,.content)'),
				emoji = ticketsettings.q('.embed.first .reaction>.emoji'),
				color = ticketsettings.q('[type=color]').value,
				advanced = ticketsettings.q('.advanced'),
				data = {
					messages: {
						start: {
							content: advanced.q('.start>.content').innerText,
							footer: advanced.q('.start>.footer').innerText
						},
						end: advanced.q('.end>.content').innerText,
						save: advanced.q('.save>.content').innerText
						// ,close: advanced.querySelector('.close>.content').innerText
					},
					save: saveOption.value == 1 ? undefined : +saveOption.value,
					unlisted: +!!ticketsettings.q('.unlisted [type="checkbox"]')?.checked,
					claim: +!!ticketsettings.q('.claim [type="checkbox"]')?.checked,
					emoji: emoji.getAttribute('e')
				};

			advanced.qa('.content').forEach(el => el.innerHTML = el.innerText);

			ticketsettings.qa('select,.ticketName').forEach(e => data[e.name] = e.value);
			embeds.forEach(e => data[e.classList[0]] = e.innerText);
			if (color) data.color = color;
			// console.log(data);

			socket.emit('TicketSettings', data, res => {
				// console.log(res);
				// ticketsettings.q('.author').innerHTML = res.author;
				// ticketsettings.q('.content').innerHTML = res.content;
				// ticketsettings.q('.reaction>.emoji').innerHTML = res.emoji;
				// ticketsettings.q('.ticketName').value = res.name;
				stopLoad('Support Channel Settings set');
			});
		});


		let colorInput = querySelector('ticketsettings [type=color]');
		colorInput.addEventListener('input', e =>
			querySelectorAll('ticketsettings .embed').forEach(el => el.style.borderColor = e.target.value));

		querySelectorAll('ticketsettings .embed').forEach(el => el.style.borderColor = colorInput.value)

		querySelector('ticketsettings .advanced>h5').addEventListener('click', e => querySelector('ticketsettings .advanced').toggleAttribute('show'));

		// querySelectorAll('#voice existingrule>.edit').forEach(btn => btn.remove());

		{
			let logToggle = querySelector('logsettings>.toggle>input'),
				logOptionsDivs = qa('.logList>div');
			logOptionsDivs.forEach(item => {
				let checkbox = item.q('[type="checkbox"]'),
					rule = item.q('h3').innerText,
					name = item.q('h1').innerText;

				checkbox.addEventListener('input', () => {
					let stopLoad = logLoad();
					socket.emit('ToggleLogRule', rule, (checked, err) => {

						if (err) console.debug(err);
						else checkbox.checked = checked;
						stopLoad(name + (checked ? ' enabled' : ' disabled'));
						if (!checkbox.checked && checkbox.checked) logToggle.click();
					})
				});
			});
			//  IF Logs colorSelector is back \/
			// [...querySelectorAll('logsettings>.set')].forEach((set, i) =>		set.addEventListener('click', () => {			let stopLoad = logLoad(),				color = !!i,				value = color ? set.previousSibling.firstChild.value : set.previousSibling.value;			socket.emit('SetLog' + (color ? 'Color' : 'Channel'), value, err => {				if (err) {					alert('Error');					console.error(err);				}				stopLoad();			})		}));
			(set = q('logsettings>.set')).addEventListener('click', () => {
				let stopLoad = logLoad(),
					select = set.previousSibling,
					value = select.value;
				socket.emit('SetLogChannel', value, err => {
					if (err) {
						alert('An error occurred');
						console.debug(err);
					}
					stopLoad('Log Channel set to #' + select.options[select.selectedIndex].text || value);
				})
			});

			logToggle.addEventListener('input', () => {
				let stopLoad = logLoad();
				socket.emit('ToggleLog', 0, (checked, err) => {
					if (err) {
						alert('An error occurred');
						console.debug(err);
					} else logToggle.checked = checked;
					stopLoad('Logging ' + (checked ? 'enabled' : 'disabled'));
				})
			});
			let auditCheckbox = querySelector('logsettings>.toggle.audit>input');
			auditCheckbox.addEventListener('input', () => {
				let stopLoad = logLoad();
				socket.emit('ToggleAuditLog', 0, (checked, err) => {
					if (err) {
						alert('An error occurred');
						console.debug(err);
					} else auditCheckbox.checked = checked;
					stopLoad('Audit Logs ' + (checked ? 'enabled' : 'disabled'));
				})
			});


			const logOptionsCheckboxes = logOptionsDivs.map(div => div.q('[type="checkbox"]')),
				checkAllLogs = newToggle(!logOptionsCheckboxes.some(checkbox => !checkbox.checked)),
				checkAllLogsTitle = h6('Toggle All', infoPopup('Toggle every log-alternative on or off'));
			// console.debug(checkAllLogs);
			checkAllLogs.addEventListener('input', () =>
				logOptionsCheckboxes.forEach(checkbox => {
					// console.debug([checkbox.checked, checkAllLogs.checked, checkAllLogs.firstChild.checked]);
					if (checkbox.checked != labelToChecked(checkAllLogs)) checkbox.click();
				}));

			q('logsettings').insertBefore(checkAllLogsTitle, q('.logList').previousElementSibling)
			q('logsettings').insertBefore(checkAllLogs, checkAllLogsTitle)
		}

		if (srvr = querySelector('header>.srvr')) srvr.q('x')?.addEventListener('click', () => srvr.remove());

		qa('.commandList>div').forEach(item => {
			let set = item.q('.set'),
				input = item.q('input'),
				original = item.q('h3').innerHTML,
				before = input.value;
			set.addEventListener('click', () => {
				let stopLoad = logLoad();
				if ((value = input.value) == before) return stopLoad('Command already set');
				socket.emit('SetCommand', { ori: original, new: value }, (value, err) => {
					before = value;
					if (err) console.debug(err, alert('An error occurred'))
					else input.value = value;
					stopLoad(prefix + original + ' command set to ' + prefix + value);
				})
			});
		});


		let suggestsettings = querySelector('suggestsettings'),
			setButton = suggestsettings.q('.set');
		setButton.addEventListener('click', e => {
			let stopLoad = logLoad(),
				colors = {},
				embed = {};
			try {
				[colors.pending, colors.approve, colors.deny, colors.consider] = suggestsettings.qa('[type=color]').map(x => x.value);
				[embed.suggestion, embed.reasonFrom, embed.approve, embed.deny, embed.consider] = ['.title', '.reasonFrom', '[placeholder=Approved]', '[placeholder=Denied]', '[placeholder=Considered]'].map(x => suggestsettings.querySelector(x).value);
				let obj = {
					channels: {
						suggest: suggestsettings.q('[name=suggestChannel]').value,
						response: suggestsettings.q('[name=responseChannel]').value
					},
					staff: suggestsettings.q('[name=staff]').value,
					embed: {
						...embed,
						up: suggestsettings.q('.emoji').getAttribute('e'),
						down: suggestsettings.qa('.emoji')[1].getAttribute('e'),
						colors
					}
				};

				socket.emit('Suggestions', ['edit', obj], (res, err) => {
					if (err) console.debug(err);
					stopLoad('Suggestions Settings set');
				});
			} catch { stopLoad() }
		});

		suggestsettings.qa('.embed').forEach(embed =>
			embed.q('[type=color]').addEventListener('input', e => embed.style.borderColor = e.target.value));
	});
	GetAllTime.suggestions = Date.now();
	socket.emit('Suggestions', ['getSuggestions'], (res, err) => {
		if (err) console.debug(err)
		else if (res) awaitLoad.then(() => {
			// console.log([res]);
			let temp = newDiv(),
				// orderButton = newDiv('div', 'order'),
				page = querySelector('#suggestions');
			temp.innerHTML = '<h2>Suggestions</h2>' + res;
			page.append(...temp.children); //orderButton,
			let sorter = page.q('.sorter'),

				suggestionsDiv = page.q('suggestions'),
				suggestions = [...suggestionsDiv.children];
			sorter?.addEventListener('input', e => { //['Index', 'Status', 'Member']
				let attr = [el => +el.getAttribute('idx'), el => el.getAttribute('status') || 'aa', el => el.firstElementChild.getAttribute('nm') + (el.getAttribute('status') || 'aa')][+e.target.value];
				suggestionsDiv.append(
					...suggestions.sort((a, b) => 0 - (attr(a) < attr(b)))
				)
			});
			// orderButton.addEventListener('click', () => page.toggleAttribute('columns'));

			let replyBox = newDiv('div', 'replybox'),
				input = newDiv('textarea'),
				send = newDiv('div', 'send'),
				buttonbox = newDiv('div', 'buttons'),
				buttons = [newDiv('div'), newDiv('div'), newDiv('div')],
				arr = ['approve', 'consider', 'deny'],
				current = 0,
				colors = arr.map(x => [x, querySelector(`.${x} [type=color]`).value]);
			replyBox.append(buttonbox, input, send);
			buttonbox.append(...buttons);
			colors.forEach(c => replyBox.style.setProperty(`--${c[0]}`, c[1]));
			input.maxlength = 1024;
			input.placeholder = 'Reason';
			buttons.forEach((b, i) => {
				b.style.setProperty('--clr', `var(--${colors[i][0]})`);
				b.addEventListener('click', e => {
					current = i;
					buttonbox.style.setProperty('--left', i);
					buttonbox.setAttribute('status', arr[i]);
				});
			});
			buttonbox.style.setProperty('--left', 0);
			buttonbox.setAttribute('status', arr[0]);


			let openInput = new AbortController(),
				focus = div => {
					suggestions.forEach(x => div != x && x.removeAttribute('selected'));
					div.toggleAttribute('selected')
				};

			suggestions.forEach(suggestion => {
				suggestion.addEventListener('click', e => {
					// suggestionsDiv.append(replyBox);
					page.append(replyBox);
					openInput.abort();
				}, {
					once: true,
					signal: openInput.signal
				});

				suggestion.addEventListener('click', e => {
					if (document.getSelection().type != 'Range') {
						focus(suggestion);
						if (!input.value && suggestion.q('.reason')) input.value = suggestion.q('.reason').innerText;
						input.focus();
					}
				})
			});

			textAreaSizeFun(input);

			send.addEventListener('click', e => {
				let selected = querySelector('suggestion[selected]'),
					value = input.value,
					index;
				if (selected) index = +selected.getAttribute('idx');
				if (value && value.length > 2 && value.length <= 1024 && index) {
					let stopLoad = logLoad();
					socket.emit('Suggestions', ['respond', [input.value, index, current]], (res, err) => {
						if (err) console.debug(err, stopLoad())
						else if (res) {
							let { reason, index, responseType, tag, name, hex, avtr, clr } = res;

							let answer = newDiv('div', 'answer'),
								from = newDiv('div', 'from'),
								reasonDiv = newDiv('div', 'reason');
							answer.append(from, reasonDiv);


							from.innerHTML = tag;
							from.setAttribute('nm', name);
							from.style.setProperty('--uclr', hex);
							from.style.setProperty('--avtr', avtr);

							reasonDiv.innerHTML = reason.replace(/\n/g, '<br>');

							selected.style.setProperty('--clr', clr);
							selected.setAttribute('status', responseType);

							let old = selected.q('.answer');
							if (old) old.remove();
							selected.append(answer);
							stopLoad('Suggestion number ' + index + ' responded')
						}
					});
				}
			})
			console.debug('Suggestions Fetched:', (Date.now() - GetAllTime.suggestions) / 1e3, 'sec');
		})
	});

	// Fixat awaitLoad ner hit

	const openSetCommand = async (element, old) => {
		// element = <rule>
		// command = channelname
		let voice = element.matches('#voice *'),
			command = element.q(voice ? 'h2' : 'h1')?.innerHTML,
			[res, err] = [{}, {}],
			emit = voice ? 'Voice' : 'Command';
		if (element.q('editrule')) return element.style.removeProperty('--height', element.q('editrule').remove());
		if (old) {
			[res, err] = await new Promise(r => socket.emit(emit, ['get', command], (...a) => r(a)));
			if (err) { alert('An error occurred'); return console.debug(err) };
			if (!res) {
				alert(emit + ' not found');
				// openSetCommand();
				return resolver(console.debug({ res }))
			};
			// console.log(res);
		}

		let editRule = newDiv('editrule'),
			removeEditRule = () => element.style.removeProperty('--height', editRule.remove()), // removeProperty only 1 argument
			commandInput = newDiv('input', 'command'),
			contentInput = newDiv('textarea', 'content'),
			embedToggle = newDiv('input', 'embedtoggle'),
			roles = newDiv('div', 'roles'),
			addRoleH5 = newDiv('h5'),
			addRole = newDiv('div', 'addrole'),
			set = newDiv('div', 'set'),
			channelSelect = newDiv('select'),
			userLimit = newDiv('input', 'userlimit'),
			Roles,
			embed, authorText, authorImg, thumbnail, footerImg, image, title, footerText, colorDiv, color;

		commandInput.placeholder = res.command || res.channelname || command || voice ? 'Channel name' : 'command';
		commandInput.value = res.command || res.channelname || command || '';

		let updateHeight = () => {
			if (contentInput) editRule.style.setProperty('--height', contentInput.value.split('\n').length * 19.2);
			element.style.setProperty('--height', editRule.scrollHeight);
		};

		if (voice) awaitDatalists.then(() => {
			// [contentInput, embedToggle, roles, addRoleH5, addRole] = [];
			editRule.append(
				h5('Voice Channel', infoPopup('When a member joins whis channel, a new channel will be created and the member will be moved there')),
				channelSelect,
				h5("Channel Name<i>Use <code>{i}</code> for the channel index</i>", infoPopup('The name of the created channel. You can use <code>{i}</code> for the channel index. For example, <code>General #{i}</code> will firstly be displayed as <code>General #1</code>, then <code>General #2</code> etc.')),
				commandInput,
				h5('User Limit', infoPopup('The maximum amount of members that can be in the created voice channel at the same time')),
				userLimit,
				set);

			userLimit.type = 'range', userLimit.max = 99, userLimit.min = 0;
			userLimit.value = +res.Userlimit || 0;
			userLimit.setAttribute('shw', +userLimit.value || 'Unlimited');
			userLimit.addEventListener('input', () => userLimit.setAttribute('shw', +userLimit.value || 'Unlimited'));

			let channelsLeft = Object.values(datalistVoice).filter(({ id }) => old || !qa('#voice rule>h2').map(e => e.innerHTML).includes(id));
			if (channelsLeft.length) channelSelect.append(...channelsLeft.map(c => {
				let option = newDiv('option');
				option.value = c.id;
				option.innerHTML = c.name;
				if (res.channel == c.id) option.selected = true;
				return option;
			}))
		})
		else { // not voice
			contentInput.placeholder = res.content || 'Content';
			contentInput.value = res.content || '';
			embedToggle.type = 'checkbox';
			embedToggle.checked = !!res.embed;
			addRoleH5.innerHTML = 'Allowed Roles';
			addRoleH5.append(infoPopup('Only members with at least one of these roles can use this command'));

			embed = newDiv('div', 'embed'),
				authorText = newDiv('input', 'author'),
				authorImg = newDiv('div', 'authorimg', 'img'),
				thumbnail = newDiv('div', 'thumbnail', 'img'),
				footerImg = newDiv('div', 'footerimg', 'img'),
				image = newDiv('div', 'image', 'img'),
				title = newDiv('input', 'title'), // description = newDiv('div', 'content'),
				footerText = newDiv('input', 'footer'),
				colorDiv = newDiv('div', 'color'),
				color = newDiv('input');

			colorDiv.append(color);
			embed.append(authorImg, authorText, thumbnail, title, contentInput, image, footerImg, footerText, colorDiv);
			color.type = 'color';

			authorText.placeholder = 'Author', title.placeholder = 'Title', contentInput.placeholder = 'Description', footerText.placeholder = 'Footer';
			authorText.maxLength = 256, title.maxLength = 256, contentInput.maxLength = 4096, footerText.maxLength = 2048;

			if (res.embed && res.content?.athr) {
				authorText.placeholder = (authorText.value = res.content.athr.nm || '') || authorText.placeholder;
				title.placeholder = (title.value = res.content.ttl || '') || title.placeholder;
				contentInput.placeholder = (contentInput.value = res.content.desc || '') || contentInput.placeholder;
				footerText.placeholder = (footerText.value = res.content.ftr.nm || '') || footerText.placeholder;
				color.value = `#${res.content.clr||'dbad11'}`;
			}

			let setBorder = e => embed.style.borderColor = color.value,
				embedToggleEventListener = () => { //only updates to embedToggle.checked
					editRule.toggleAttribute('embed', embedToggle.checked)
					contentInput.maxLength = embedToggle.checked ? 4096 : 2000;
					updateHeight();
				};
			embedToggleEventListener();
			embedToggle.addEventListener('change', embedToggleEventListener);
			editRule.addEventListener('click', embedToggleEventListener);
			color.addEventListener('input', setBorder);
			setBorder();

			editRule.append(commandInput, embed, embedToggle, addRoleH5, roles, set);

			[authorImg, thumbnail, image, footerImg].forEach(el => el.addEventListener('click', e => {
				if (!e.target.matches('.urlInput,.urlInput *')) {
					if (el.q('.urlInput')) return el.q('.urlInput').remove();
					qa('.urlInput').forEach(e => e.remove());

					let div = newDiv('div', 'urlInput'),
						set = newDiv('div', 'set'),
						remove = newDiv('div', 'remove'),
						input = newDiv('input');
					div.append(input, set, remove);
					el.append(div);
					input.type = 'url';
					input.pattern = 'https?:\/\/.*';
					input.placeholder = 'https://example.com/image.png';
					input.maxLength = 300;
					input.value = el.imageURL || '';
					set.addEventListener('click', () => {
						if (input.checkValidity()) {
							try {
								new URL(input.value);
								el.style.setProperty('--img', `url(${el.imageURL = input.value})`);
								div.remove()
							} catch (e) {}
						}
					});
					remove.addEventListener('click', () => {
						el.imageURL = undefined;
						el.style.removeProperty('--img');
						div.remove()
					});
				}
			}));


			if (res.embed && res.content?.athr)[
				[authorImg, res.content.athr.img],
				[thumbnail, res.content.thmb],
				[image, res.content.img],
				[footerImg, res.content.ftr.img]
			].forEach(([el, url]) => { if (url) el.style.setProperty('--img', `url(${el.imageURL = url})`) })


			Roles = res.roles || [];
			let idToRole = id => {
					let role = newDiv('div', 'role'),
						roleData = datalistRoles[id];
					if (!roleData) return '';
					role.innerHTML = roleData.name;
					role.setAttribute('ttl', role.id = id);
					if (roleData.color) role.style.setProperty('--clr', roleData.color);
					role.addEventListener('click', e => {
						delete Roles[Roles.indexOf(id)];
						e.target.remove();
					});
					return role;
				},
				addRoleToList = id => {
					roles.append(idToRole(id));
					Roles.push(id);
				};

			roles.append(addRole, ...(Roles || []).map(idToRole));

			addRole.addEventListener('click', () => awaitDatalists.then(() => {
				if ((oldEl = addRole.q('.listSelector'))) return oldEl.remove();
				let roleSelector = newDiv('div', 'listSelector');
				roleSelector.append(...Object.values(datalistRoles).filter(r => !Roles.includes(r.id) && r.name != '@everyone').map(role => {
					let roleDiv = newDiv('div');
					roleDiv.setAttribute('ttl', roleDiv.id = role.id);
					roleDiv.innerHTML = role.name;
					if (role.color) roleDiv.style.setProperty('--clr', role.color);
					roleDiv.addEventListener('click', e => { if (window.getSelection().type != "Range") addRoleToList(role.id) });
					return roleDiv;
				}));
				addRole.append(roleSelector);
			}));

			let setCounter = () => image.setAttribute('counter', `${contentInput.value.length}/2000`);
			setCounter();

			['keydown', 'keyup', 'input'].forEach(x => { //font-size: 1rem
				commandInput.addEventListener(x, e => {
					let val = commandInput.value = commandInput.value.replace(/\s/g, ''); //[^\w$€£{§#¤%=@*!()?^\-\[\]]
					if (commandInput.value != val) commandInput.value = val;
				});
				contentInput.addEventListener(x, e => {
					setCounter();
					updateHeight();
				})
			});
		}
		element.append(editRule);
		updateHeight();
		setTimeout(x => updateHeight(), 1);
		setTimeout(x => updateHeight(), 100);
		// setTimeout(x => updateHeight(), 1000);
		setTimeout(x => updateHeight(), 2000);

		set.addEventListener('click', e => {
			let data;
			if (voice) {
				data = {
					channel: channelSelect.value,
					Userlimit: userLimit.value,
					channelname: commandInput.value = commandInput.value.trim().substr(0, 100)
				};
			} else {
				data = {
					command: commandInput.value = commandInput.value.replace(/\s/g, '').substr(0, 30),
					roles: Roles.filter(x => /^\d+$/.test(x)),
					embed: embedToggle.checked || undefined
				};
				if (embedToggle.checked)
					data.content = {
						athr: {
							img: authorImg.imageURL,
							nm: (authorText.value = authorText.value.substr(0, 256)) || undefined
						},
						ttl: (title.value = title.value.substr(0, 256)) || undefined,
						desc: (contentInput.value = contentInput.value.substr(0, 4096)) || undefined,
						clr: color.value.substr(1),
						thmb: thumbnail.imageURL,
						img: image.imageURL,
						ftr: {
							img: footerImg.imageURL,
							nm: (footerText.value = footerText.value.substr(0, 2048)) || undefined
						}
					}
				else data.content = contentInput.value = contentInput.value.trim().substr(0, 2000)
			}
			if (data.channel && data.channelname || data.command && data.content) {
				let stopLoad = logLoad();
				socket.emit(emit, ['set', [command || data.channel || data.command, data]], (res, err) => {
					if (err) console.debug(err, alert('An error occurred'));
					if (res) {
						removeEditRule();
						let content = voice ? '' : (embedToggle.checked ? [data.content.ttl, data.content.desc, data.content.ftr?.nm].filterX.join(' - ') : data.content || '').substr(0, 90);
						if (old) {
							element.q('h1').innerHTML = data.channelname || data.command;
							element.q('h2').innerHTML = data.channel || content;
							stopLoad((voice ? 'Dynamic Voice Channel' : 'Custom Command') + ' updated')
						} else {
							let ruleDiv = newDiv('rule'),
								commandDiv = newDiv('h1'),
								previewDiv = newDiv('h2'),
								edit = newDiv('edit'),
								remove = newDiv('remove'),
								toggle = newToggle(true);
							ruleDiv.append(commandDiv, previewDiv, toggle, edit, remove);

							commandDiv.innerHTML = data.channelname || data.command;
							previewDiv.innerHTML = data.channel || content;

							edit.addEventListener('click', e => commandsEditEvent(edit, voice));
							remove.addEventListener('click', e => commandsRemoveEvent(remove, voice));
							toggle.firstChild.addEventListener('change', e => commandsToggleEvent(toggle.firstChild, voice));
							querySelector((voice ? '#voice' : '#commands') + '>rules').append(ruleDiv);
							stopLoad('New ' + (voice ? 'Dynamic Voice Channel' : 'Custom Command') + ' set')
						}
					}
				})
			}
		}); //set onclick
	} //openSetCommand

	awaitLoad.then(() => [...querySelectorAll('create')].forEach(el => el.addEventListener('click', e => { if (e.target.matches('create')) openSetCommand(el) })));

	let commandsEditEvent = (edit, voice) => openSetCommand(edit.parentElement, true),
		commandsRemoveEvent = (remove, voice) => {
			if (remove.hasAttribute('sure')) {
				let stopLoad = logLoad();
				// console.debug(remove.parentElement.querySelector(voice ? 'h2' : 'h1').innerHTML);
				socket.emit(voice ? 'Voice' : 'Command', ['remove', remove.parentElement.q(voice ? 'h2' : 'h1').innerHTML], (res, err) => {
					if (err) console.debug(err, alert('An error occurred'));
					if (res) remove.parentElement.remove();
					stopLoad((voice ? 'Dynamic Voice Channel' : 'Custom Command') + ' removed')
				})
			} else {
				remove.setAttribute('sure', '');
				setTimeout(() => remove.removeAttribute('sure'), 2000);
			}
		},
		commandsToggleEvent = (toggle, voice) => {
			let stopLoad = logLoad();
			socket.emit(voice ? 'Voice' : 'Command', ['toggle', toggle.parentElement.parentElement.q(voice ? 'h2' : 'h1').innerHTML], (enabled, err) => {
				if (err) console.debug(err, alert('An error occurred'));
				if (enabled != null) toggle.checked = enabled;
				stopLoad((voice ? 'Dynamic Voice Channel' : 'Custom Command') + (enabled ? ' enabled' : ' disabled'))
			});
		};
	awaitLoad.then(() => {
		[...querySelectorAll(':is(#commands,#voice) edit')].forEach(edit => edit.addEventListener('click', e => commandsEditEvent(edit, edit.matches('#voice *'))));
		[...querySelectorAll(':is(#commands,#voice) remove')].forEach(remove => remove.addEventListener('click', e => commandsRemoveEvent(remove, remove.matches('#voice *'))));
		[...querySelectorAll(':is(#commands,#voice) label>input')].forEach(toggle => toggle.addEventListener('change', e => commandsToggleEvent(toggle, toggle.matches('#voice *'))));
	});

	// DebugTest = () =>
	GetAllTime.transcripts = Date.now();
	socket.emit('Transcripts', ['getAll'], (res, err) => { //console.log({ res, err });
		if (res && !err) awaitLoad.then(() => {
			let temp = newDiv();
			temp.innerHTML = res;
			querySelector('page#support').append(...temp.children);


			[...querySelectorAll('transcript>.name')].forEach(el => el.addEventListener('click', e => el.parentElement.toggleAttribute('show')));
			[...querySelectorAll('transcript')].forEach(el => {
				let open = newDiv('div', 'open');
				open.addEventListener('click', e => window.open(`${location.origin+location.pathname}/transcript/${el.id}`, "_self"))
				el.prepend(open);
			});

			console.debug('Transcripts Fetched:', (Date.now() - GetAllTime.transcripts) / 1e3, 'sec');
			// [...querySelectorAll('transcript')].forEach(transcript => {let extend = transcript.q('.extend'),expiresDiv = extend?.parentElement;if (expiresDiv) {if (!transcript.id) extend.remove()else extend.addEventListener('click', e => socket.emit('Transcripts', ['extend', transcript.id], (res, err) => { //console.log({ res, err });if (res && !err) {expiresDiv.firstChild.innerHTML = 'Expires in 7 days';extend.remove();} else console.debug(res, err);}))}});
		});
		else console.debug(err);
	});
	//
	awaitLoad.then(() => {
		let modsettings = q('modsettings'),
			moderationEmbed = q('.embed'),
			messageFrom = modsettings.q('.messagefrom'),
			until = modsettings.q('.until'),
			hasBeen = moderationEmbed.q('.hasbeen'),
			byInput = moderationEmbed.q('.by'),
			hasBeens = modsettings.qa('.hasbeen'),
			reason = moderationEmbed.q('.reasonFrom'),
			duration = moderationEmbed.q('.duration'),
			color = moderationEmbed.q('[type="color"]'),
			set = modsettings.q('.set'),
			banMessage = modsettings.q('.banmessage'),

			// randomActionDivs = hasBeen.parentElement.parentElement.qa('span'),
			randomActionDivs = moderationEmbed.qa('span'),
			actions = modsettings.qa('.comsetting:is(#warn,#ban,#kick,#mute)>.txt>.txtinput').map(el => el.value).sort(() => Math.random() - .5), //['warned', 'kicked', 'banned', 'muted']
			actionIndex = 3, // actions.length-1
			setRandomActionDivs = () => {
				randomActionDivs.forEach(el => el.innerHTML = actions[actionIndex]);
				if (!--actionIndex) {
					actions = actions.sort(() => Math.random() - .5)
					actionIndex = 3
				}
			}

		setBorder = e => moderationEmbed.style.borderColor = color.value;
		color.addEventListener('input', setBorder);
		setBorder();

		setRandomActionDivs();
		setInterval(setRandomActionDivs, Math.floor((Math.random() * 2 + 4) * 1000)); //4-6s

		textAreaSizeFun(banMessage);

		let comsettings = modsettings.q('.comsettings'),
			scrollItems = modsettings.qa('.scrollbar>*:not(.scrollarrow)'),
			scrollArrows = modsettings.qa('.scrollbar>.scrollarrow'),
			txtinputs = comsettings.qa('.txtinput'),
			commandInputs = comsettings.qa('.command');
		// docs = comsettings.qa('.doc');

		comsettings.qa('.info>*>*').forEach(info =>
			info.innerHTML = `Every member with this role and everyone with admin permission can call the<y>${info.innerHTML}</y>command. The default role is the role specified above; if a role is selected here, the Moderator role abouve will be ignored.`
		);

		commandInputs.forEach(el => el.addEventListener('input', () =>
			el.nextSibling.firstChild.innerHTML = el.value || el.placeholder
		));

		scrollItems.forEach((item, i) => item.addEventListener('click', () =>
			comsettings.setAttribute('shw', i + 1)));

		scrollArrows.forEach((item, i) => item.addEventListener('click', () => {
			let shw = +comsettings.getAttribute('shw') + (i ? 1 : -1);
			if (shw && shw >= scrollItems.length + 1) shw = 1;
			if (shw <= 0) shw = scrollItems.length;
			comsettings.setAttribute('shw', shw)
		}));


		[reason, ...hasBeens, duration, ...txtinputs, ...commandInputs, byInput, messageFrom, until].forEach(el => {
			sizeFun(el, true);
			// setTimeout(() => sizeFun(el, true), 2e3);
			el.addEventListener('keydown', e => sizeFun(el, true));
			el.addEventListener('keyup', e => setTimeout(() => sizeFun(el, true), 10))
		});

		hasBeens.forEach(el =>
			el.addEventListener('input', e => hasBeens.forEach(x => {
				x.value = el.value;
				sizeFun(x, true);
			})));

		// console.log([hasBeen], hasBeens);

		set.addEventListener('click', e => {
			// console.debug(banMessage, banMessage?.value);
			const stopLoad = logLoad(),
				data = {
					enabled: +!!modsettings.q('label:first-of-type>input').checked,
					channel: modsettings.q('.channelSelect').value,
					staff: modsettings.q('.roleSelect').value,
					text: {
						hasBeen: hasBeen.value = hasBeen.value.substr(0, 100),
						by: byInput.value = byInput.value.substr(0, 100),
						reason: reason.value = reason.value.substr(0, 256),
						duration: duration.value = duration.value.substr(0, 256),
						messageFrom: messageFrom.value = messageFrom.value.substr(0, 256),
						until: until.value = until.value.substr(0, 256),
						color: color.value.substr(1)
					},
					dmInvite: +!!modsettings.q('.invite>input').checked,
					dmAll: +!!modsettings.q('.dm>input').checked,
					tellWho: +!!modsettings.q('.tellwho>input').checked,
					banMessage: banMessage.value = banMessage.value.trim(),
					logsEnabled: +!!modsettings.q('.log>input').checked,
					timeout: +!!modsettings.q('.timeout>input').checked
				};

			let coms = {};
			txtinputs.forEach(input => {
				let commandSetting = input.parentElement.parentElement,
					roleSelector = commandSetting.q('.roleSelect'),
					role = roleSelector.value;
				coms[commandSetting.id] = { txt: input.value || undefined, role }
			});
			data.coms = coms;
			// console.debug(data);

			textAreaSizeFun(banMessage);
			commandInputs.forEach(el => el.addEventListener('input', () =>
				q(`.commandList>#${el.placeholder}>input`).innerHTML = el.value || el.placeholder
			));

			socket.emit('Moderation', ['set', data], (res, err) => {
				if (err) console.debug(err, alert('An error occurred'));
				if (res) stopLoad('Moderation settings set')
			})


			commandInputs.forEach(el => {
				// const stopLoadCom = logLoad();
				// console.log([el.parentElement.id, el.value]);
				if (el.parentElement.id != el.value) socket.emit('SetCommand', {
					ori: el.parentElement.id,
					new: el.value
				}, (value, err) => {
					if (err) console.debug(err)
					// stopLoadCom();
				})
				// else stopLoadCom();
			})
		})
	});
	let ModLogsPageIndex = 0,
		Arguments = [],
		LoadModLogs = ( /*page, filterArray*/ ) => new Promise((resolve => {
			// console.time('Moderation');
			// page = page || ModLogsPageIndex;
			// filterArray = filterArray || Arguments;
			GetAllTime.modlogs = Date.now();
			socket.emit('Moderation', ['getAll', [ModLogsPageIndex, ...Arguments]], (res, err) => { //console.log({ res, err });
				if (res && !err) {
					let temp = newDiv();
					temp.innerHTML = res;

					resolve(temp.children);

					// console.debug([...temp.children]);
					[...temp.children].forEach(modlog => {
						let remove = newDiv('remove');
						modlog.append(remove);

						remove.addEventListener('click', () => {
							if (remove.hasAttribute('sure')) {
								let stopLoad = logLoad();
								socket.emit('Moderation', ['remove', modlog.id], (res, err) => {
									if (err) console.debug(err, alert('An error occurred'));
									if (res) modlog.remove();
									stopLoad('Moderation ' + modlog.classList[0] + ' log removed');
								})
							} else {
								remove.setAttribute('sure', '');
								setTimeout(() => remove.removeAttribute('sure'), 2000);
							}
						})
					})

					console.debug('Moderation Logs Fetched:', (Date.now() - GetAllTime.modlogs) / 1e3, 'sec');
				} else resolve(console.debug(err));
				// console.timeEnd('Moderation');
			});
		}));

	LoadModLogs().then(modlogs => {
		if (!modlogs) return;
		// console.log(modlogs, 1);
		let loadMore = newDiv('div', 'more'),
			filterSelect = newDiv('select', 'sorter'),
			modlogsDiv = newDiv('modlogs'),
			modlogsTitle = newDiv('h2'),
			popup = newDiv('div', 'popup'),
			submit = newDiv(),
			input = newDiv('input'),
			empty = newDiv('empty'),
			alwaysAtBottom = [empty, loadMore];

		awaitLoad.then(() =>
			q('page#moderation').append(modlogsTitle, popup, filterSelect, modlogsDiv));

		modlogsTitle.innerHTML = 'Moderations Logs';
		loadMore.innerHTML = 'Load More';


		modlogsDiv.append(...modlogs, ...alwaysAtBottom);


		filterSelect.append(...['All', 'Member', 'Moderator'].map((x, i) => {
			let option = newDiv('option');
			option.innerHTML = x;
			option.value = i;
			return option
		}));

		input.placeholder = 'User Id';
		input.pattern = '\\d{16,19}';
		popup.append(input, submit);
		const requestId = () => new Promise(resolve => {
			input.value = '';
			popup.setAttribute('shw', '');
			filterSelect.setAttribute('disabled', '');

			submit.addEventListener('click', () => {
				if (input.checkValidity() && input.value) {
					resolve(input.value)
					popup.removeAttribute('shw');
					filterSelect.removeAttribute('disabled');
				} else {
					input.setAttribute('err', '');
					setTimeout(() => input.removeAttribute('err'), 200)
				}
			})
		});


		filterSelect.addEventListener('change', async () => {
			ModLogsPageIndex = 0;
			Arguments = +filterSelect.value ? [+filterSelect.value, await requestId()] : [];
			console.debug(Arguments);
			modlogsDiv.innerHTML = '';
			let modlogs = await LoadModLogs();
			if (modlogs) modlogsDiv.append(...modlogs)
			modlogsDiv.append(...alwaysAtBottom)
		})

		loadMore.addEventListener('click', async () => {
			let modlogs = await LoadModLogs(++ModLogsPageIndex);
			// console.log(modlogs, 2);
			if (modlogs) modlogsDiv.append(...modlogs, ...alwaysAtBottom)
			else loadMore.remove();
		})
	})


	awaitLoad.then(() => awaitDatalists.then(() => awaitEmojilist.then(() => {
		let reactiondataEl = q('.reactiondata'),
			rulesDiv = q('reaction>rules'),
			reactiondata = reactiondataEl?.innerHTML || [],
			emojiDiv = (emoji, unicode) => {
				if (emoji) var div = newDiv('div', 'emoji').Attribute('e', emoji.e || emoji.identifier)
					.Append(newDiv('img').Src(emoji.url))
				else var div = newDiv('div', 'emoji').Attribute('e', unicode).Html(unicode);
				div.addEventListener('click', () => div.remove());
				return div;
			},
			channelSelects = [];
		if (reactiondata[0])
			reactiondata = reactiondata.split(';').map(x => x.split(',')).map(([e, c, f]) => ({ e: e.split('.'), c, f }))
		reactiondataEl.remove();

		// reactiondata.forEach(newRule)
		const newRule = (data = {}) => {
			const div = newDiv('rule'),
				filterSelect = newDiv('select', 'filter'),
				channelSelect = newDiv('select', 'channel'),
				emojis = newDiv('div', 'multiple', 'emojis'),
				addEmoji = newDiv('div', 'emoji', 'add'),
				idInput = newDiv('input', 'id'),
				// roleInput = newDiv('select', 'id'),
				set = newDiv('div', 'set'),
				remove = newDiv('remove'),
				selectedEmojis = () => [...emojis.children].slice(0, -1).map(e => e.getAttribute('e'));
			div.append(
				h6('Text Channel', infoPopup('The channel you want the automatic reactions to occur')),
				channelSelect,
				h6('Emojis', infoPopup('The emojis you want the bot to react with')),
				emojis,
				h6('Filter', infoPopup('The filter you want to use while filtering what messages to react to')),
				filterSelect, idInput,
				set, remove
			);

			if (data.e) emojis.append(
				...[...data.e].map(e =>
					emojiDiv(emojiToObj(e), e)
				) //.filter(s => s)
			);
			emojis.append(addEmoji);

			addEmojiSetup(addEmoji, emoji => {
				if (emojis.children.length < 21 && !selectedEmojis().includes(emoji.e || emoji.identifier))
					emojis.append(emojiDiv(emoji), addEmoji)
			}, true)

			channelSelects.push(channelSelect);
			channelSelect.append(...Object.values(datalistText).map(channel => {
				const option = newDiv('option');
				option.innerHTML = channel.name;
				option.value = channel.id;
				if (data.c == channel.id) option.selected = true;
				return option;
			}));
			channelSelect.addEventListener('click', () => {
				let selectedChannels = channelSelects.map(e => e.value);
				channelSelects.map(x => [...x.children]).flat()
					.forEach(option => option.disabled = selectedChannels.includes(option.value));
			})

			data.f = data.f || 0;
			filterSelect.append(...['All Messages', 'Only Bot-Messages', 'Not Bot-Messages', 'Only Embeded Messages', 'Only User', 'Only Role'].map((text, i) => {
				// undef:all; 1:only bots; 2:not bots; 3:only embeds; 'u92635':only user; 'r92635':only role
				const option = newDiv('option');
				option.innerHTML = text;
				option.value = i;
				if (
					(data.f == i) ||
					(i == 4 && `${data.f}`.startsWith('u')) ||
					(i == 5 && `${data.f}`.startsWith('r'))
				) option.selected = true;


				return option;
			}));
			const idInputCheck = () => {
				if (+filterSelect.value > 3) div.setAttribute('idinput', filterSelect.value)
				else div.removeAttribute('idinput');
				if (+filterSelect.value == 5) idInput.setAttribute('list', 'datalistroles')
				else idInput.removeAttribute('list');
			};
			idInputCheck();
			filterSelect.addEventListener('input', idInputCheck);

			idInput.placeholder = 'Id';
			idInput.pattern = '\\d{16,19}';
			if (data.f && (data.f.startsWith('r') || data.f.startsWith('u'))) idInput.value = data.f.substr(1);

			set.addEventListener('click', () => {
				let stopLoad = logLoad(),
					success = true,
					Data = {
						e: selectedEmojis(), //.join('')
						c: channelSelect.value,
						f: filterSelect.value
					};
				if (+filterSelect.value > 3) {
					// let id = idInput.value;
					if (idInput.checkValidity() && idInput.value)
						Data.f = (filterSelect.value == 4 ? 'u' : 'r') + idInput.value;
					else success = false;
				}

				// console.debug([data.c, Data]);

				if (success) socket.emit('Reactions', ['set', [data.c, Data]], (res, err) => {
					if (err) console.debug(err, alert('An error occurred'));
					if (res) stopLoad('Auto Reactions in #' + (channelSelect.options[channelSelect.selectedIndex].text || channelSelect.value) + ' set');
				})
				else stopLoad();
			});

			remove.addEventListener('click', () => {
				if (remove.hasAttribute('sure')) {
					let stopLoad = logLoad();
					socket.emit('Reactions', ['remove', data.c], (res, err) => {
						if (err) console.debug(err, alert('An error occurred'));
						if (res) remove.parentElement.remove();
						stopLoad('Auto Reactions in #' + (channelSelect.options[channelSelect.selectedIndex].text || channelSelect.value) + ' removed')
					})
				} else {
					remove.setAttribute('sure', '');
					setTimeout(() => remove.removeAttribute('sure'), 2000);
				}
			});
			return div;
		};

		let createNew = newDiv('create');
		createNew.innerHTML = 'Add an Auto Reaction';
		createNew.addEventListener('click', () => rulesDiv.append(newRule(), createNew))

		rulesDiv.append(...reactiondata.map(newRule), createNew);

	})))

	const MultipleSetup = (multiple /*,{oneWord,url}*/ ) => {
		const listEl = multiple.q('[list]'),
			list = listEl?.getAttribute('list')?.split(',').filterX || [],
			input = multiple.lastChild,
			commaSeperated = multiple.hasAttribute('csv'),
			add = newDiv('div', 'add').Append(input),
			values = list,
			type = multiple.classList[1],
			select = input.matches('select'),
			datalist = type == 'channel' ? datalistText : (type == 'role' ? datalistRoles : undefined),
			newEl = value => {
				let div = newDiv('div').Html(value).Attribute('value', value);
				if (datalist) {
					if (datalist[value]) {
						div.Html(datalist[value].name)
						if (datalist[value].color) div.style.setProperty('--clr', datalist[value].color);
					} else div.Attribute('unknown')
				};
				div.On(() => {
					div.remove();
					if (select && removedOptions[value]) input.append(removedOptions[value]);
					delete values[values.findIndex(x => x == value)]
				})
				return div;
			},
			submit = () => {
				add.removeAttribute('show');
				let values = [input.value?.replace(/,/g, '')];
				if (commaSeperated) values = input.value?.split(',');
				values.forEach(value => {
					if (!value.length || value.length > 128 || values.includes(value)) return;
					// if (oneWord && /\s/.test(value)) return;
					// if (url) { try { new URL(url) } catch { return; } }

					multiple.append(newEl(value), add);
					values.push(value)
				})
				if (select) {
					let selected = input.selectedOptions[0];
					removedOptions[selected.value] = selected;
					selected.remove();
					input.selectedIndex = 0;
				} else input.value = '';
				// multiple.Attribute('value', values.join())
				// multiple.values = values;
			},
			removedOptions = {};
		// console.debug({ list });
		// multiple.Attribute('value', values.join())
		multiple.values = values;
		listEl?.remove();

		multiple.append(
			...list.map(str => newEl(str)),
			add
		);
		add.On(e => {
			if (!e.target.matches('.add *')) add.toggleAttribute('show') // if turned off	// submit()
		});
		if (select) input.addEventListener('input', submit);
		else if (input.matches('input')) input.addEventListener('keydown', e => e.key == 'Enter' && submit());
	}; //MultipleSetup

	awaitLoad.then(() => awaitDatalists.then(() => {
		qa('.multiple').forEach(MultipleSetup);
		if (!q('automod')) return;
		// qa('automod .action').forEach(
		// 	el => {
		// 		el.closest('automod').toggleAttribute('reason', +el.value >= 2);
		// 		el.On('input',
		// 			() => el.closest('automod').toggleAttribute('reason', +el.value >= 2))
		// 	});

		q('automodsettings').append(newDiv('div', 'set').On(() => {
			const stopLoad = logLoad(),
				// pnsh = (del, warn) =>
				// del && warn ? 3 : warn ? 2 : del ? 1 : 0,
				automod = {
					w: q('automod.words'),
					l: q('automod.links'),
					s: q('automod.spam'),
					c: q('automod.caps'),
					m: q('automod.mentions'),
					z: q('automod.zalgo')
				},
				ifToggled = (automod, obj = {}) =>
				labelToChecked(automod.q('label:first-of-type')) && {
					...obj,
					// pnsh: pnsh(labelToChecked(automod.q('.del')), labelToChecked(automod.q('.warn'))), // 0/undef:none, 1:delete, 2:warn, 3:warn&delete
					pnsh: +automod.q('.action').value, // 0/undef:none, 1:delete, 2:warn, 3:warn&delete
					rsn: automod.q('.reason').value,
					ignRls: automod.q('.role').values.filterX,
					ignChn: automod.q('.channel').values.filterX
				},
				data = {
					words: ifToggled(automod.w, {
						words: automod.w.q('.string').values.filterX
					}),
					links: ifToggled(automod.l, {
						ignDom: automod.l.q('.string').values.filterX,
						inv: +automod.l.q('[type=range]').value
						// ignDis: labelToChecked(automod.l.q('.igndis')),
						// onlInv: labelToChecked(automod.l.q('.onlinv'))
					}),
					spam: ifToggled(automod.s, {
						num: +automod.s.q('[type=range]').value,
					}),
					caps: ifToggled(automod.c, {
						num: +automod.c.q('[type=range]').value,
					}),
					mentions: ifToggled(automod.m, {
						num: +automod.m.q('[type=range]').value,
					}),
					zalgo: ifToggled(automod.z)
				};
			console.debug(data);

			socket.emit('Automod', ['set', data], (res, err) => {
				if (err) console.debug(err);
				stopLoad('Auto Moderation Settings set');
			});

		}));

		qa('automod:not(.links) [type=range]').forEach(input => {
			let suffix = input.classList.contains('percent') ? '%' : '',
				update = () => input.Attribute('shw', input.value + suffix);
			input.On('input', update);
			update();
		});
		RangeInputLabelSetup(q('automod.links [type=range]'), 'Ignore Invites', 'Catch Invites', 'Only Catch Invites');
		qa('automod>.action').forEach(input => RangeInputLabelSetup(input, '', 'Delete Message', 'Warn Member', 'Delete Message and Warn Member'))
	}));
	//Allt borde funka nu, bara o testa alla möjliga inputs. Data kommer i console
}