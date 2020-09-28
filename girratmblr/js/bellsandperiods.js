const trueStructure = "01234567ERL";
const dayStructures = ["012R3L4567E", "012R3L4567E", "012R3L4567E", "012R34L567E", "012R34L567E"]; //This stores the bell structure for each day.
const periodNames = [
    ["Period 0", "P0"],
    ["Period 1", "P1"],
    ["Period 2", "P2"],
    ["Period 3", "P3"],
    ["Period 4", "P4"],
    ["Period 5", "P5"],
    ["Period 6", "P6"],
    ["Period 7", "P7"],
    ["", ""],
    ["Recess", ""],
    ["Lunch", ""]
]
const dayNames = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]; //Stores the days of the school week.
const nextPeriods = [1, 2, 3, 4, 5, 6, 7, 0, 0, 3, "?"]; //Contains the next period to be displayed with reference to the true structure.
const weekASatReference = new Date(2020,0,11); //This stores the Saturday before a Week A in order to determine the current week.
var isWeekA = true; //Stores the current week determined using the date reference.
var currentPeriod;
var nextPeriodToDisplay = [];

var bellTimes = [[[8, 0], [9, 0], [10, 5], [11, 30], [13, 10], [14, 10], [15, 10], [16, 0], [17, 0], [11, 10], [12, 30]], //Periods in the order of the true structure.
    [[8, 0], [9, 0], [10, 5], [11, 30], [13, 10], [14, 10], [15, 10], [16, 0], [17, 0], [11, 10], [12, 30]],
    [[8, 0], [8, 45], [9, 45], [11, 5], [13, 0], [14, 5], [15, 10], [16, 0], [17, 0], [10, 45], [12, 10]],
    [[8, 0], [8, 45], [9, 50], [11, 15], [12, 20], [14, 5], [15, 10], [16, 0], [17, 0], [10, 55], [13, 25]],
    [[8, 0], [8, 45], [9, 50], [11, 15], [12, 20], [14, 5], [15, 10], [16, 0], [17, 0], [10, 55], [13, 25]]]; 
var minutesLeft; //Stores the number of minutes left until the next period.

function setWeekAndDay() { //Determines what school week it is and then assigns a day in the 10 day school week.
    isWeekA = (weekASatReference.daysSince() % 14 < 7);
    schoolDay = (isWeekA ? realDay - 1 : realDay + 4);
}

function getBell(day, period) { //Gets the bell time for a given day and period.
    return bellTimes[day][getTrueIndex(period)];
}

function getMinsLeft(timeArray) { //Determine the number left until a certain time, passed as [h,m].
    return Math.ceil((new Date(d.getFullYear(), d.getMonth(), d.getDate(), timeArray[0], timeArray[1]) - d) / 60000);
}

function getMinsTotal(day, period) {
    if (period != "E") {
        let lastBell = getBell(day, period);
        let nextBell = getBell(day, determineNextPeriod(day, period));
        return Math.ceil((new Date(2020, 1, 7, nextBell[0], nextBell[1]) - new Date(2020, 1, 7, lastBell[0], lastBell[1])) / 60000);
    }
    return -1;
}

function getTrueIndex(period) {
    return trueStructure.indexOf(period.toString());
}

function determineCurrentPeriod() { //Determines the current period.
    if (realDay == 0 || realDay == 6) { return -2; } //Determines that today is the weekend.
    else if (getMinsLeft(getBell(realDay - 1, 'E')) < 0) {return 8;} //Determines that it is after Period 7.
    else if (getMinsLeft(getBell(realDay - 1, 0)) > 0) { return -1;} //Determines that it is before Period 0.
    for (var i = 0; i < dayStructures[realDay - 1].length; i++) {
        let calcMins = getMinsLeft(getBell(realDay - 1, dayStructures[realDay - 1][i+1]));
        if (calcMins > 0) {
            if (i == 0 && timetable[(isWeekA ? realDay - 1 : realDay + 4)][0][0] == -1) {
                return -1;
            }
            else if(i==9 && timetable[isWeekA ? realDay - 1 : realDay + 4][7][0] == -1){
                
                return 8;
            }
            else if (i == 8 && timetable[isWeekA ? realDay - 1 : realDay + 4][6][0] == -1) {
                return 8;
            }
            minutesLeft = calcMins;
            return dayStructures[realDay - 1][i];
        }
    }
    return -2;
}

function determineLastPeriod(day, period) { //Determine the next period.
    return dayStructures[day][dayStructures[day].indexOf(period.toString()) - 1];
}

function determineNextPeriod(day, period) { //Determine the next period.
    return dayStructures[day][dayStructures[day].indexOf(period.toString()) + 1];
}

function determinePeriodToDisplay() {
    if (realDay == 0 || realDay == 6) {
        if (isWeekA) {
            nextPeriodToDisplay = [0, "0"];
        }
        else {
            nextPeriodToDisplay = [5, "0"];
        }
    }
    else {
        if (currentPeriod == -1) {
            nextPeriodToDisplay = [(isWeekA ? realDay - 1 : realDay + 4), "0"];
        }
        else if (currentPeriod == 8 || currentPeriod == 7) {
            nextPeriodToDisplay = [(isWeekA ? realDay : realDay + 5), "0"];
            if (nextPeriodToDisplay[0] == 10) {
                nextPeriodToDisplay[0] = 0;
            }
        }
        else {
            nextPeriodToDisplay = [(isWeekA ? realDay - 1 : realDay + 4), determineNextPeriod(realDay - 1, currentPeriod)];
        }
        /**FIX THIS MESS */
        if (nextPeriodToDisplay[1] == "0" && timetable[nextPeriodToDisplay[0]][0][0] == -1) {
            nextPeriodToDisplay[1] == 1;
        }

        if (nextPeriodToDisplay[1] == "6" && timetable[nextPeriodToDisplay[6]][0][0] == -1) {
            nextPeriodToDisplay[1] == 7;
        }

        if (nextPeriodToDisplay[1] == "7" && timetable[nextPeriodToDisplay[7]][0][0] == -1) {
            nextPeriodToDisplay[1] == 1;
            if (nextPeriodToDisplay[0] == 10) {
                nextPeriodToDisplay[0] = 0;
            }
        }

    }
}

function updateDisplay() {
        if (currentPeriod == 8) {
            $("#in-progress-info").hide();
            $("#current-subject").html("School's over.");
            $("title").html("After school | Timetablr");
        }
        else if (currentPeriod == -1) {
            $("#in-progress-info").hide();
            $("#current-subject").html("You're early!");
            $("title").html("Before school | Timetablr");
        }
        else if (currentPeriod == -2) {
            $("#in-progress-info").hide();
            $("#current-subject").html("It's the weekend.");
            $("title").html("Weekend | Timetablr");
        }
        else {
            $("#in-progress-info").show();
            $("#minutes-left").html(minutesLeft);
            $("title").html(minutesLeft + " minutes left | Timetablr")
            $("#minutes-remain").html(getMinsTotal(realDay-1, currentPeriod));
            $("#current-subject").html(periodNames[getTrueIndex(currentPeriod)][0]);
            $("#current-period").html(periodNames[getTrueIndex(currentPeriod)][1]);
        }
}

function displayNextPeriod() {
    
}



