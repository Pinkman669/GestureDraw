document
	.querySelector('#start-btn')
	.addEventListener('submit', async (event) => {
		event.preventDefault();

		const form = event.target;
        const username = new FormData(form);


		const res = await fetch('/game', {
			method: 'POST',
			body: username
		});
		const status = await res.json();
        
		form.reset();
		
	});
