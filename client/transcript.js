{
	const
		// newDiv = (el = 'div', ...classes) => {
		// 	let div = document.createElement(el);
		// 	classes.forEach(cl => div.classList.add(cl));
		// 	return div;
		// },
		querySelector = s => document.querySelector(s),
		querySelectorAll = s => Array.from(document.querySelectorAll(s));
	// q = querySelector,
	// qa = querySelectorAll;
	// [...querySelectorAll('transcript>.name')].forEach(el => el.addEventListener('click', e => el.parentElement.toggleAttribute('show')));
	let resolveLoad,
		awaitLoad = new Promise(r => resolveLoad = r);
	if (document.readyState == 'loading')
		document.addEventListener('DOMContentLoaded', resolveLoad);
	else
		resolveLoad();


	awaitLoad.then(() => {
		if (!querySelector('header > .user')) return;
		querySelector('header userpopup>.logout').addEventListener('click', e =>
			window.open('/logout', "_self"))
		querySelector('header>.user>img').addEventListener('click', e => {
			e.stopPropagation();
			querySelector('header userpopup').toggleAttribute('show')
		});
		document.body.addEventListener("click", e => {
			if (!e.target.matches('userpopup,userpopup *')) querySelector('header userpopup').removeAttribute('show');
		});
		querySelector('header>.guildDropDown').addEventListener('change', e => {
			let value = e.target.value;
			if (value == 'AddNew') {
				window.open('https://discord.com/api/oauth2/authorize?client_id=813803575264018433&permissions=8&scope=bot', 'popup',
					`left=${screen.availWidth/2-200},top=${screen.availHeight/2-350},width=400,height=700`)
				socket.emit('NewGuildSubrcibe', 0, id => window.open(`/Guild/${id}`, "_self"));
			} else window.open(`/Guild/${value}`, "_self")
		});
	})
}