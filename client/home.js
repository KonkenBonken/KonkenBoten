{
	let resolveLoad,
		awaitLoad = new Promise(r => resolveLoad = r);
	if (document.readyState == 'loading')
		document.addEventListener('DOMContentLoaded', resolveLoad);
	else
		resolveLoad();

	const joinSound = new Audio('/src/join.mp3'),
		leaveSound = new Audio('/src/leave.mp3'),
		sleep = ms => new Promise(r => setTimeout(r, ms));
	sleep.random = (min = 100, max = 400) => sleep(Math.round(Math.random() * (max - min) + min));;

	awaitLoad.then(() => {
		if (document.querySelector('header userpopup')) {
			document.querySelector('header>.user>img').addEventListener('click', e => {
				e.stopPropagation();
				let popup = document.querySelector('header userpopup');
				if (popup.getAttribute('show') == "") popup.removeAttribute('show')
				else popup.setAttribute('show', '')
			});
			document.body.addEventListener("click", () => {
				let popup = document.querySelector('header userpopup');
				if (popup.getAttribute('show') == "") popup.removeAttribute('show')
			});
			document.querySelector('header>.guildDropDown').addEventListener('change', e => {
				let value = e.target.value;
				// console.log(value);
				if (value == 'AddNew') {
					window.open('https://discord.com/api/oauth2/authorize?client_id=813803575264018433&permissions=8&scope=bot', 'popup', 'width=400,height=600,menubar=0,status=0,titlebar=0')
					socket.emit('NewGuildSubrcibe', 0, id =>
						window.open(`/Guild/${id}`, "_self"));
				} else if (value != 'Choose') window.open(`/Guild/${value}`, "_self")
			});
			document.querySelector('header userpopup>.logout').addEventListener('click', e =>
				window.open('/logout', "_self"))
		}
		document.querySelector('.cookie>.ok')?.addEventListener('click', e => e.target.parentElement.remove())


		let dynamic = document.querySelector('showoff>:nth-child(2)'), // showoff = document.querySelector('showoff'),
			leaveAll = () => [...(dynamic.querySelectorAll('[joined]') || [])].forEach(c => c.removeAttribute('joined')),
			join = c => {
				leaveAll();
				c.setAttribute('joined', '');
				joinSound.play();
				return c;
			},
			createdChannels = [];

		[...dynamic.querySelectorAll('.channel')].forEach(channel =>
			channel.addEventListener('click', async () => {
				let newChannel = channel.cloneNode(true);
				newChannel.querySelector('p').innerHTML += ' #1';

				await sleep.random();
				joinSound.play();
				join(channel)

				await sleep.random();
				join(channel.parentElement.appendChild(newChannel));

				await sleep.random();
				createdChannels.forEach(c => c.remove());
				createdChannels.push(newChannel);

			}));
		dynamic.querySelector('.controls>svg').addEventListener('click', () => {
			let current = dynamic.querySelector('[joined]');
			if (current) {
				leaveSound.play();
				current.remove();
			};
		});
		let tryItOut = dynamic.querySelector("div>i");
		tryItOut.addEventListener('mouseenter', tryItOut.remove);
	})
}