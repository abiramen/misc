/**This refreshes every second to update information on the page.*/

function secondInterval() {
    refreshDateTime();
    setWeekAndDay(); //Determine if it is week A or week B.
    currentPeriod = determineCurrentPeriod(); //Determine and store the current period.
    updateDisplay(); //Update the displayed progress info.
}

$(document).ready(function () { 
    
    if ('serviceWorker' in navigator) { //PWA magic.
        navigator.serviceWorker.register('/serviceworker.js')
            .then(function (registration) {
                console.log('Registration successful, scope is:', registration.scope);
            })
            .catch(function (error) {
                console.log('Service worker registration failed, error:', error);
            });
    }

    secondInterval(); //Runs our interval function on page load.
    $(".modal").modal(); //Initialises modals.
    $('.tooltipped').tooltip(); //Initialises tooltips.
    $('.collapsible').collapsible(); //Initialises collapsibles.

    storageOnLoad();
});

setInterval(function(){secondInterval()}, 1000); //Runs the interval function every second.
