document
	.querySelector('#start-btn')
	.addEventListener('click', async (event) => {
		const user = document.querySelector('#username').value
		// Save data to sessionStorage
		sessionStorage.setItem("username",user);

		// Get saved data from sessionStorage
		let data = sessionStorage.getItem("username");

		window.location = "./game.html"
		
	});
