function displayFileName() {
    $('#file').change(function(e) {
        const fileName = e.target.files[0].name;
        console.log(fileName);
        document.getElementById("fileUploaded").innerHTML=`Chosen Picture: ${fileName}`;
    });
}

async function register(){
    const proficiencies = document.getElementById("proficiencies").value;
    const details = document.getElementById("details").value;
    
    const teacher = {proficiencies, details};
    console.log(teacher);


    let response = await fetch('/enroll', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json;charset=utf-8'
        },
        body: JSON.stringify(teacher)
      });
      
      let result = await response.json();
      alert(result.message);
}