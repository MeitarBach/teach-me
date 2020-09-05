// Set min expiration date to card
const date = new Date();
const year = date.getFullYear();
const month = `0${date.getMonth() + 1}`.slice(-2);

document.getElementById("expiration-date").min = `${year}-${month}`;
document.getElementById("expiration-date").max = `${year+5}-${month}`;


// Validate Credit Card Before posting payment
$(function() {
    var owner = $('#card-holder');
    var cardNumber = $('#card-number');
    var CVV = $("#cvv");
    var confirmButton = $('#confirm');

    cardNumber.payform('formatCardNumber');
    CVV.payform('formatCardCVC');

    confirmButton.click(function(e) {

        e.preventDefault();

        var isCardValid = $.payform.validateCardNumber(cardNumber.val());
        var isCvvValid = $.payform.validateCardCVC(CVV.val());

        if(owner.val().length < 5 || !isCardValid || !isCvvValid){
            const incorrectDetails = document.getElementById('incorrect-details');
            incorrectDetails.innerHTML = '* Card details are incorrect!';
            incorrectDetails.className = 'alert alert-danger';
        } else {
            const incorrectDetails = document.getElementById('incorrect-details');
            incorrectDetails.innerHTML = '';
            incorrectDetails.className = 'alert alert-danger hidden';
            postPayment();
        }
    });
});

async function postPayment(){
    const cardHolder = document.getElementById('card-holder').value;
    const cardNumber = document.getElementById('card-number').value;
    const expirationDate = document.getElementById('expiration-date').value;
    const cvv = document.getElementById('cvv').value;

    const payment = {
        cardHolder,
        cardNumber,
        expirationDate,
        cvv
    }

    try {
        const response = await fetch('/checkout', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(payment)
        });

        const result = await response.json();
        
        if (response.status === 500) {
            throw new Error("There was an error on the server");
        } else {
            alert(result.message);
            window.location.href = "store";
        }

    } catch (err) {
        console.log(err);
    }
}
