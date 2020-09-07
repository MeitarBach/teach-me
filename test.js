const fetch = require('node-fetch');

const URL = "http://localhost:3000";

const user1register = {
    firstName : "Aria",
    lastName : "Stark",
    email : "aria@stark.com",
    password : "123",
};

const user2register = {
    firstName : "John",
    lastName : "Snow",
    email : "aria@stark.com",
    password : "321",
};

async function register(user) {
    try {
        const response = await fetch(URL + '/register', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(user)
        });
        if (response.ok) {
            debug('Successfully registered user ' + JSON.stringify(user));
        } else if (response.status === 409) {
            debug(`The email you are using ${user.email} is already registered`);
        } else {
            debug(`An error occured while trying to register. HTTP status: ${response.status}`);
        }

    } catch (error) {
        console.error(error);
    }
}

async function login(user) {
    const userCredentials = {
        email : user.email,
        password : user.password
    };

    try {
        const response = await fetch(URL + '/login', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(userCredentials)
        });

        if (response.ok) {
            debug('Successfully logged user ' + JSON.stringify(user) + ' in');
        } else if (response.status === 404) {
            debug('The credentials you enter are incorrect');
        } else {
            debug(`There was an error on the server while trying to login ${response.status}`);
        }

    } catch (err) {
        console.log(err);
    }
}