function displayFileName() {
    $('#file').change(function(e) {
        const fileName = e.target.files[0].name;
        console.log(fileName);
        document.getElementById("fileUploaded").innerHTML=`Chosen Picture: ${fileName}`;
    });
}