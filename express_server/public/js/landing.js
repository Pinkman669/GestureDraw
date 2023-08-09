document
	.querySelector('#start-btn')
	.addEventListener('click', async (event) => {
		const user = document.querySelector('#username').value
		// Save data to sessionStorage
		sessionStorage.setItem("username",user);

		window.location = "./training.html"
		
	});
