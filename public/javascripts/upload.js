let timeSlotID = 1;

function addTimeSlot(){
    const timeSlot = document.createElement("INPUT");
    timeSlot.setAttribute("type", "datetime-local");
    timeSlot.setAttribute("id", timeSlotID++);
    const today = new Date().toISOString();
    console.log(today)
    timeSlot.setAttribute("min", today);
    document.getElementById("time-slots").appendChild(timeSlot);
}

async function upload() {
    const firstName = document.getElementById("firstName").value;
    const lastName = document.getElementById("lastName").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    
    const user = {
        firstName,
        lastName,
        email,
        password
    }

    try {
        const response = await fetch('/register', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(user)
        });

        const result = await response.json();
        
        if (response.status === 409) {
            document.getElementById("emailTaken").innerHTML = result.message;
        } else if (response.status === 500) {
            throw new Error("There was an error on the server");
        } else {
            window.location.href = "store";
        }

    } catch (err) {
        console.log(err);
    }
}