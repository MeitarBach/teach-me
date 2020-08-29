const registerButton = document.getElementById("registerForm");

registerButton.addEventListener('submit', async (event) => {
    event.preventDefault();
    await register();
});

async function register() {
    const firstName = document.getElementById("firstName").value;
    const lastName = document.getElementById("lastName").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    
    const user = {
        firstName,
        lastName,
        email,
        password
    }

    try {
        const response = await fetch('/register', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(user)
        });

        console.log("current response is : " + JSON.stringify(response));
        const result = await response.json();
        

        if (response.status === 409) {
            document.getElementById("emailTaken").innerHTML = result.message;
        } else {
            window.location.href = "login";
        }

    } catch (err) {
        console.log(err);
    }
    
}