const fetch = require('node-fetch');
const debug = require('debug')('teach-me:test');
const FormData = require('form-data');
const fs = require('fs');

const URL = "http://localhost:3000";

const user1register = {
    firstName : "Bran",
    lastName : "Stark",
    email : "bran@stark.com",
    password : "123",
};

const user2register = {
    firstName : "John",
    lastName : "Snow",
    email : "bran@stark.com",
    password : "321",
};

const classToUpload = {
    title : "History Present and Future with Bran",
    subject : "History Present and Future",
    details : "Bran is the 3 eye'd raven, and that is self explenatory",
    startTime : "2021-06-12T17:30",
    endTime : "19:30",
    price : 30
}

const teacherDetails = new FormData();
teacherDetails.append('proficiencies', "Proffesional at wall climbing, exploring visions and understanding Hodor");
teacherDetails.append('details', "Can teach you of yourself and of the world");
teacherDetails.append('image', fs.createReadStream("./public/images/users/bran-test.jpg"), "bran-test");

async function test(){
    //Register new user
    // await register(user1register);
    //Register new user with an already exisiting email at database
    // await register(user2register);
    // //Login non-registered user
    // await login(user2register);
    // //Login a registered user
    await login(user1register);
    // //Upload a class before becoming a teacher
    await upload(classToUpload);
    // //Become a teacher
    // await enrollTeacher(teacherDetails);
    // //Become a teacher again
    // await enrollTeacher(teacherDetails);
    // //Upload a class as a teacher
    // await upload(classToUpload);
    // //Add to cart
    // await addToCart(exampleLessonID);
    // //Delete lesson from cart
    // await deleteLessonFromCart(exampleLessonID);
    // //Add to cart again
    // await addToCart(exampleLessonID);
    // //Checkout
    
}

test();

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
        

    } catch (error) {
        console.error(error);
    }
}

async function login(user) {
    const userCredentials = {
        email : user.email,
        password : user.password,
        remember : true
    };

    try {
        const response = await fetch(URL + '/login', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(userCredentials)
        });

        cookie = response.headers.get('set-cookie').split(';')[0];
        // debug(response.headers.get('set-cookie'));
        const result = await response.json();
        debug(result.message);

    } catch (err) {
        console.log(err);
    }
}

async function enrollTeacher(details) {
    try {
        const response = await fetch(URL +'/enroll', {
            method: 'PUT',
            body: details
        });
          
        const result = await response.json();
        debug(result.message);

    } catch (err) {
        console.log(err);
    }
}

async function upload(lesson) {
    try {
        const response = await fetch(URL + '/upload', {
            method: 'POST',
            credentials:'same-origin',
            headers: {
              'Content-Type': 'application/json',
              'Cookie': cookie
            },
            body: JSON.stringify(lesson)
        });

        const result = await response.json();
            
        if (response.ok) {
            exampleLessonID = result.lessonID //Automatically global variable to be used in add to cart
        }

        debug(result.message);
    } catch (err) {
        console.log(err);
    }
}

async function addToCart(lessonID) {
    try {
        const response = await fetch(URL + `/store/add-to-cart/${lessonID}`);
        const result = await response.json();
        debug(result.message);
    
    } catch (err) {
        console.log(err);
    }
}

async function deleteLessonFromCart(lessonID){
    try {
        const response = await fetch(URL + `/cart/${lessonID}`, {method: 'DELETE'});

        const result = await response.json();
        
        debug(result.message)

    } catch (err) {
        console.log(err);
    }
}

async function checkOut(){}

async function logout(){}

async function adminTest(){}