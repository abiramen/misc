function localSet(location, toSet) {
    localStorage.setItem(location, toSet);
}

function jsonSet(location, toSet) {
    localStorage.setItem(location, JSON.stringify(toSet));
}

function localGet(location) {
    return localStorage.getItem(location);
}

function jsonGet(location) {
    return JSON.parse(localStorage.getItem(location));
}

function storageOnLoad() {
    if (localGet("version") !== currentVersion) {
        M.Modal.init(document.querySelector('#changelog-modal')).open();
        localSet("version", currentVersion);
    }

    if (localGet("menubar-logo") == "mono") {
        $("#logo-img").attr("src", "img/tmblr-text-white.png");
        $("input[type=radio][name=radio-logo]").prop("checked",true);
    }    
}

