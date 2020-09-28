const assignedColors = ["#a5b1fd", "#b2edf6", "#e499a9", "#c786dd", "#b2bbe9", "#91c1e8", "#8291cd", "#fea78a", "#ffa3a4", "#f682b2", "#ce68a5", "#ed7378", "#76c9e7", "#ff5983"];
var icsText;
var parseDayCount;
var parseLastPeriod;
var subjectNames;

function loadICS(event) {
    var input = event.target;
    var reader = new FileReader();
    reader.onload = function () {
        timetable = nullTimetable;
        subjects = [];
        subjectNames = [];
        parseDayCount = 0;
        parseLastPeriod = 0;
        icsString = reader.result;
        $("#import-timetable").hide();
        $("#import-button").hide();
        $("#parser-import-info").html("Your timetable should be imported. You can't make edits just yet.");
        $("#edit-button").show();
        $("#import-title").html("Imported");
        $("#cancel-button").html("Close");
        processFile();
    }
    reader.readAsText(input.files[0]);
}

function renameSubject(subject) {
    const subjectMatches = [
        ["math", "Maths"],
        ["english", "English"],
        ["processes", "IPT"],
        ["information", "IST"],
        ["engineering", "Engineering"],
        ["technology", "Technology"],
        ["software", "Software"],
        ["study", "Study"],
        ["sport studies", "PASS"],
        ['physical', "PE"],
        ["modern", "Modern History"],
        ["ancient", "Ancient History"],
        ["japanese", "Japanese"],
        ["musi", "Music"],
        ["science extension", "Science Ext"],
        ["history extension", "History Ext"],
        ["istry hsc", "Chemistry"],
        ["recreation", "SLR"]
    ];
    for (match in subjectMatches) {
        if ((subject.toLowerCase()).indexOf(subjectMatches[match][0]) != -1) {
            return subjectMatches[match][1];
        }
    }
    return (subject.lastIndexOf('Yr') == -1 ? subject : subject.substring(0, subject.lastIndexOf('Yr') - 1));
}

function processLesson(period, subject, room) {
    var subjectIndex;
    var finalRoom = room;
    if (parseLastPeriod > period) {
        parseDayCount++;
        parseLastPeriod = 0;
    } else {
        parseLastPeriod = period;
    }
    if (parseDayCount < 10) {
        subjectIndex = subjectNames.indexOf(subject);
        if (finalRoom == null) {
            if (subjectIndex != -1) {
                finalRoom = subjects[subjectIndex][1];
            } else {
                finalRoom = "";
            }
        }
        if (subjectIndex == -1) {
            subjectNames.push(subject);
            subjectIndex = subjectNames.length - 1;
            subjects.push([subject, finalRoom, parserPalette[subjectIndex]]);
        }
        timetable[parseDayCount][period] = [subjectIndex.toString(), finalRoom];
        /**Day shift correction, remove if this gets patched. 
        if(parseDayCount<4){
            timetable[parseDayCount+6][period] = [subjectIndex.toString(), finalRoom];
        }
        else if(parseDayCount!=9){
            timetable[parseDayCount-4][period] = [subjectIndex.toString(), finalRoom];
        }
        else{
            timetable[5][period] = [subjectIndex.toString(), finalRoom];
        }*/
    } else {
        updateSubjectList();
        jsonSet("timetable", timetable);
    }
}

function renameRooms(room) {
    const roomMatches = [
        ["tcola", ""],
        ["toval", ""],
        ["mpc", ""],
        ["lib", "Library"]
    ];
    for (match in roomMatches) {
        if ((room.toLowerCase()).indexOf(roomMatches[match][0]) != -1) {
            return roomMatches[match][1];
        }
    }
    if (parseInt(room) < 10 && room.indexOf('S') == -1 && room.indexOf('C') == -1) {
        return "0" + room;
    }
    return room;
}

//:

function processFile() {
    var icalSplits = icalString.substring(0, 45000).split("BEGIN:VEVENT");
    icalSplits.forEach(event => {
        if (event.indexOf('Roll') != -1 || event.indexOf('BEGIN') != -1) {
            return;
        }
        var lessonLineSplit = event.split("\n");
        var lessonPeriod, lessonSubject, lessonRoom;
        lessonLineSplit.forEach(line => {
            if (line.indexOf('DESCRIPTION:') != -1) {
                lessonPeriod = parseInt(line.substring(line.indexOf('Period: ') + 8, line.indexOf('Period: ') + 9));
            }
            if (line.indexOf('SUMMARY:') != -1) {
                lessonSubject = renameSubject(line.substring(line.indexOf(' ') + 1));
            }
            if (line.indexOf('Room:') != -1) {
                lessonRoom = renameRooms(line.substring(line.indexOf('Room: ') + 6));
            }

        });
        processLesson(lessonPeriod, lessonSubject, lessonRoom);
    });
}