function displayFileName() {
    $('#file').change(function(e) {
        const fileName = e.target.files[0].name;
        console.log(fileName);
        document.getElementById("fileUploaded").innerHTML=`Chosen Picture: ${fileName}`;
    });
}

async function register(userID){
  uploadImage(userID);
  const proficiencies = document.getElementById("proficiencies").value;
  const details = document.getElementById("details").value;
  
  const teacher = {proficiencies, details};
  console.log(teacher);

  let response = await fetch('/enroll', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(teacher)
  });
    
  let result = await response.json();
  if (response.status === 409){
    document.getElementById("already-teacher").innerHTML = result.message;
  } else {
    window.location.href = "upload"; 
  }
}

async function uploadImage(userID){
  console.log(userID);
  const img = document.getElementById("file").files[0];
  let fd = new FormData();
  fd.append('img', img, userID);
  console.log(fd);
  let response = await fetch('/enroll/img', {
    method: 'POST',
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    body: fd
  });
  console.log(response);
}