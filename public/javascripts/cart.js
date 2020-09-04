async function deleteLesson(lessonID){
    try {
        const response = await fetch(`/cart/${lessonID}`, {method: 'DELETE'});

        const result = await response.json();
        
        if (response.status === 200) {
            alert(result.message);
            location.reload();
        } else if (response.status === 500) {
            throw new Error("There was an error on the server");
        } else {
            alert(result.message);
        }

    } catch (err) {
        console.log(err);
    }
}