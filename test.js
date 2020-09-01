let cart = {
  items: [{instructor: "Asi Cohen", title:"piano"}, {instructor: "Efi Guitara", title:"guitar"}],
  totalPrice: 60
}
console.log(JSON.parse(JSON.stringify(cart)));