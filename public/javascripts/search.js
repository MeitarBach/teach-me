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
        window.location.href=`/store?search=${searchValue}`;
    } catch (err){
        alert(err);
        console.log(err);
    } 
}