document
	.querySelector('#start-btn')
	.addEventListener('click', async (event) => {
		const user = document.querySelector('#username').value
		// Save data to sessionStorage
		sessionStorage.setItem("username",user);

		// Get saved data from sessionStorage
		let data = sessionStorage.getItem("username");

		const res = await fetch('/', {
			method: 'POST',
			body: data
		});
		const result = await res.json();
        
		window.location = "./game.html"
		
	});
