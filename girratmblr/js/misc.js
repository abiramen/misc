const currentVersion = "2.0 a2"; //Stores the version number to load changelogs.

var lightMode = false; 

function arrayRotate(arr, offset) {
    offset -= arr.length * Math.floor(offset / arr.length);
    arr.push.apply(arr, arr.splice(0, offset));
    return arr;
}

$("input[type=radio][name=radio-logo]").change(function () { //Handles changing of logo colour in settings.
    if(this.value == "gradient"){
        localSet("menubar-logo", "gradient");
        $("#logo-img").attr("src", "img/tmblr-text.png");
    }
    else if (this.value == "mono") {
        localSet("menubar-logo", "mono");
        if (lightMode) {
            $("#logo-img").attr("src", "img/tmblr-text-black.png");
        }
        $("#logo-img").attr("src", "img/tmblr-text-white.png");
    }
});