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