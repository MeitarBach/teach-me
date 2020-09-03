function displayFileName() {
    $('#file').change(function(e) {
        const fileName = e.target.files[0].name;
        console.log(fileName);
        document.getElementById("fileUploaded").innerHTML=`Chosen Picture: ${fileName}`;
    });
}

async function register(userID){
  const proficiencies = document.getElementById("proficiencies").value;
  const details = document.getElementById("details").value;
  const img = document.getElementById("file").files[0];
  let fd = new FormData();
  fd.append('proficiencies', proficiencies);
  fd.append('details', details);
  if(img){
    fd.append('image', img, userID);
  }
  
  let response = await fetch('/enroll', {
      method: 'PUT',
      body: fd
  });
    
  let result = await response.json();
  if (response.status === 409){
    document.getElementById("already-teacher").innerHTML = result.message;
  } else if (response.status === 500){
    alert(result.message);
  } else {
    window.location.href = "upload"; 
  }
}