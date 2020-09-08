async function addToCart(lessonID){
    const response = await fetch(`/store/add-to-cart/${lessonID}`);
    const result = await response.json();
    alert(result.message);
}