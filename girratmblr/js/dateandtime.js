//**Here we define any date-time related methods or variables.**/
var d = new Date(); //Create a new date object.
const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]; //Store the days of the week.
const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]; //Store the months of the year.
var realDay = d.getDay(); //Track the actual day of the week, initialised from the date object.
var period; //Stores the current school period.

function get12Hour() { //Convert the time to 12-hour time.
    if (d.getHours() == 0) { return 12; }
    return (d.getHours() > 12 ? d.getHours() - 12: d.getHours());
}

function getDisplayMinute() { //Adds a 0 in front of the minute if necessary for display purposes.
    return (d.getMinutes() < 10 ? "0" + d.getMinutes() : d.getMinutes()); 
}

function getDisplaySeconds() { //Adds a 0 in front of the minute if necessary for display purposes.
    return (d.getSeconds() < 10 ? "0" + d.getSeconds() : d.getSeconds());
}

function getMeridian() { //Gets the meridian for the time.
    return (d.getHours() > 11 ? "PM" : "AM")
}

function refreshDateTime() {
    d = new Date(); //Updates the Date object with fresh info every second.
    // d = new Date(2020,1,6,14,40); //Updates the Date object with fresh info every second.
    realDay = d.getDay();

    //Adjust the displayed time and date.
    $("#time-h").html(get12Hour());
    $("#time-m").html(getDisplayMinute());
    $("#time-mer").html(" " + getMeridian());
    $("#date").html(`${days[d.getDay()]}, ${months[d.getMonth()]} ${d.getDate()}`);
}


Date.prototype.daysUntil = function (dateObj) { //Displays the amount of days until a date.
    return Math.ceil((this.getTime() - d.getTime()) / 86400000);
}

Date.prototype.daysSince = function (dateObj) { //Displays the amount of days until a date.
    return Math.ceil((d.getTime() - this.getTime()) / 86400000);
}