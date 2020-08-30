const arr = [{id: 123, password: 666, name: "Meitar"}, {id: 456, name:"May"}]


const user = arr.find( user => {
    return user.id === 123 && user.password === 66;
});

console.log(user);