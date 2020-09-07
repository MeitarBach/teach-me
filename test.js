const fetch = require('node-fetch');

const URL = "http://localhost:3000"
const user1 = {
    firstName : "Aria",
    lastName : "Stark",
    email : "aria@stark.com",
    password : "123",
}

async function register() {
    try {
        const response = await fetch(URL + '/register', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(user)
        });
        if (response.ok) {
            debug('Successfully ')
        }
    }
}

try {
    const response = await fetch(URL + '/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(user)
    });

    const result = await response.json();
    
    if (response.status === 409) {
        document.getElementById("emailTaken").innerHTML = result.message;
    } else if (response.status === 500) {
        throw new Error("There was an error on the server");
    } else {
        window.location.href = "store";
    }

} catch (err) {
    console.log(err);
}