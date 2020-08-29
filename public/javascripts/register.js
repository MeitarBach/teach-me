const registerButton = document.getElementById("registerButton");

registerButton.addEventListener('click', (event)=> {
    event.preventDefault()
    register()
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

    // console.log(user);

    try {
        const response = await fetch('/register', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
//              'Content-Type': 'application/json;charset=utf-8'
            },
            body: JSON.stringify(user)
        });

        console.log("current response is : "+ response);
        const result = await response.json();
        

        if (response.status === 409) {
            document.getElementById("emailTaken").innerHTML = result.message;
        } else {
            window.location.href = "http://localhost:3000/login";
        }

    } catch (err) {
        console.log(err);
    }
    
}