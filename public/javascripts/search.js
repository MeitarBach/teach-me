const searchSubmit = document.getElementById('search-submit');
const searchForm = document.getElementById('search-form');

searchForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    await search();
})

searchSubmit.addEventListener('click', async (event) =>{
    event.preventDefault();
    await search();
});

async function search(){
    const searchValue = document.getElementById('search').value;
    try {
        // alert(searchValue);
        // const response = await fetch(`?search=${searchValue}`, {redirect: "follow"});
        // alert("I'm here");
        // alert(JSON.stringify(response));
        window.location.href=`/store?search=${searchValue}`;
    } catch (err){
        alert(err);
        console.log(err);
    }
    
    
    
}