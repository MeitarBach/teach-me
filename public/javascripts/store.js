// var elems = document.getElementsByClassName('item_add');

// var confirmIt = function (e) {
//     if (!confirm('Are you sure?')) e.preventDefault();
// };

// for (var i = 0, l = elems.length; i < l; i++) {
//     elems[i].addEventListener('click', confirmIt, false);
// }
// window.addEventListener('message', (event) => {
//     console.log(`Received message: ${event.data}`);
// });

// var elems = document.getElementsByClassName('item_add');

// var confirmIt = async function (e) {
//     e.preventDefault();
// };

// for (var i = 0, l = elems.length; i < l; i++) {
//     elems[i].addEventListener('click', confirmIt);
// }

// window.onmessage = (event) => {
//     console.log(`Received message: ${event.data}`);
// };

async function addToCart(url){
    const response = await fetch(`/store/add-to-cart/${url}`);
    const result = await response.json();
    alert(result.message);
}