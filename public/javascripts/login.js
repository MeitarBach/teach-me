const loginForm = document.getElementById("login-form");

loginForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    await login();
});

async function login() {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    
    const userCredentials = {
        email,
        password
    }

    try {
        const response = await fetch('/login', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(userCredentials)
        });

        const result = await response.json();
        
        if (response.status === 404) {
            document.getElementById("wrong-credentials").innerHTML = result.message;
        } else if (response.status === 500) {
            throw new Error("There was an error on the server");
        } else {
            window.location.href = "store";
        }

    } catch (err) {
        console.log(err);
    }
}