const DButils = require('./controllers/utilities');


async function test(){
    let users = await DButils.getSetValues('users');
    console.log(users);
}

test();