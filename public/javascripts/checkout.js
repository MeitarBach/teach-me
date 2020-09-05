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
            document.getElementById('incorrect-details').innerHTML = 'Card details are incorrect!';
        } else {
            // Everything is correct. Add your form submission code here.
            document.getElementById('incorrect-details').innerHTML = '';
            alert("Everything is correct");
        }
    });
});