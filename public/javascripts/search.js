const searchSubmit = document.getElementById('search-submit');

searchSubmit.addEventListener('click', async (event) =>{
    // event.preventDefault();
    await search();
});

async function search(){
    const searchValue = document.getElementById('search').value;
    try {
        const url = `/store?serach=${searchValue}`
        console.log(url);
        await fetch(url);
    } catch (err){
        console.log(err);
    }
    
    
    
}