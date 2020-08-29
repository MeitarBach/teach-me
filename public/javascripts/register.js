
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

    console.log(user);

    try {
        const response = await fetch('/register', {
            method: 'POST',
            redirect: 'follow',
            headers: {
              'Content-Type': 'application/json;charset=utf-8'
            },
            body: JSON.stringify(user)
        });
    
        // console.log("##3");
        
        console.log(response);
    
        if (response.status === 409) {
            const result = await response.json();
            document.getElementById("emailTaken").innerHTML = result.message;
        } else {
            // const result = await response.json();
            // console.log(result);
        }

    } catch (err) {
        console.log(err);
    }
    
}