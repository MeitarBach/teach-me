const fetch = require('node-fetch');
const debug = require('debug')('teach-me:test');


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

const classToUpload = {
    title : "History Present and Future with Bran",
    subject : "History Present and Future",
    details : "Bran is the 3 eye'd raven, and that is self explenatory",
    StartTime : "2021-06-12T17:30",
    endTime : "19:30",
    price : "30"
}

async function register(user) {
    try {
        const response = await fetch(URL + '/register', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(user)
        });

        const result = await response.json();
        debug(result.message);
        // if (response.ok) {
        //     debug('Successfully registered user ' + JSON.stringify(user));
        // } else if (response.status === 409) {
        //     debug(`The email you are using ${user.email} is already registered`);
        // } else {
        //     debug(`An error occured while trying to register. HTTP status: ${response.status}`);
        // }

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

        const result = await response.json();
        debug(result.message);

        // if (response.ok) {
        //     debug('Successfully logged user ' + JSON.stringify(user) + ' in');
        // } else if (response.status === 404) {
        //     debug('The credentials you enter are incorrect');
        // } else {
        //     debug(`There was an error on the server while trying to login ${response.status}`);
        // }

    } catch (err) {
        console.log(err);
    }
}

async function upload(lesson) {
    try {
        const response = await fetch('/upload', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(lesson)
        });

        const result = await response.json();
        
        if (response.redirected) {
            debug("In order to upload class you must become a teacher first");
        } else {
            exampleLessonID = result.lessonID //Automatically global variable to be used in add to cart
            debug(result.message);
        }

    } catch (err) {
        console.log(err);
    }
}

async function addToCart(lessonID) {
    try {
        const response = await fetch(`/store/add-to-cart/${lessonID}`);
        const result = await response.json();
        debug(result.message);
    
    } catch (err) {
        console.log(err);
    }
}

async function enrollTeacher() {
    try {
        const response = await fetch('/enroll', {
            method: 'PUT',
            body: fd
        });
          
        const result = await response.json();
        debug(result.message);

    } catch (err) {
        console.log(err);
    }
}