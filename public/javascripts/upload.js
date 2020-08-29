let timeSlotID = 1;

function addTimeSlot(){
    const x = document.createElement("INPUT");
    x.setAttribute("type", "datetime-local");
    x.setAttribute("id", timeSlotID++);
    document.getElementById("time-slots").appendChild(x);
}