const order = {
    cardHolder: 'req.body.cardHolder',
    cardNumber: 'req.body.cardNumber',
    expirationDate: 'req.body.expirationDate',
    cvv: 'req.body.cvv'
}

const userCart = {
    items: [
        'Thu, 03 Sep 2020 21:04',
        'Thu, 03 Sep 2020 21:25',
        'Fri, 04 Sep 2020 10:48',
        'Fri, 04 Sep 2020 11:26',
        'Fri, 04 Sep 2020 19:12',
        'Fri, 04 Sep 2020 19:41',
        'Sat, 05 Sep 2020 13:01'
    ],
    totalPrice: 60
}

Object.assign(order, userCart);

console.log(order);
console.log(userCart);