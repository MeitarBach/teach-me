let timeSlotID = 1;

const uploadForm = document.getElementById("upload-form");

uploadForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    await upload();
});

function addTimeSlot(){
    const timeSlot = document.createElement("INPUT");
    timeSlot.setAttribute("type", "datetime-local");
    timeSlot.setAttribute("id", timeSlotID++);
    const today = new Date().toISOString();
    console.log(today);
    timeSlot.setAttribute("min", today);
    document.getElementById("time-slots").appendChild(timeSlot);
}

async function upload() {
    const title = document.getElementById("title").value;
    const subject = document.getElementById("subject").value;
    const details = document.getElementById("details").value;
    const time = document.getElementById("time").value;
    const price = document.getElementById("price").value;

    
    const newClass = {
        title,
        subject,
        details,
        time,
        price
    }

    console.log(JSON.stringify(newClass));

    try {
        const response = await fetch('/upload', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(newClass)
        });

        const result = await response.json();
        
        if (response.status === 201) {
            window.location.href = "store";
        } else if (response.status === 500) {
            throw new Error("There was an error on the server");
        }

    } catch (err) {
        console.log(err);
    }
}