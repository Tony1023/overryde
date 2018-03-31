/*************************************************************/
//FIND CURRENT POSITION
/*************************************************************/

var startpos = document.getElementById("map");

//EventListener for when HTML5 can fix location
startpos.addEventListener("start",coords=>{
  startpos.innerHTML = "";
  initMap(coords.latitude,coords.longitudes);
});

//Error Callback for Location services
function showLocationError(error) {
    let text_title = document.getElementById("text_title");
    text_title.innerHTML = "ERROR: ";
    var x = document.getElementById("text_text");
    switch(error.code) {
        case error.PERMISSION_DENIED:
            x.innerHTML = "User denied the request for Geolocation."
            break;
        case error.POSITION_UNAVAILABLE:
            x.innerHTML = "Location information is unavailable."
            break;
        case error.TIMEOUT:
            x.innerHTML = "The request to get user location timed out."
            break;
        case error.UNKNOWN_ERROR:
            x.innerHTML = "An unknown error occurred."
            break;
    }
}

//Get Current Location via HTML5
function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position=>{
          let currpos = new CustomEvent("PositionFix",position.coords);
          startpos.dispatchEvent(currpos);
        },
        showLocationError(err);
      );
    } else {
      let text_title = document.getElementById("text_title");
      text_title.innerHTML = "ERROR: ";
      let x = document.getElementById("text_text");
      x.innerHTML = "Geolocation is not supported by this browser.";
    }
}


/*************************************************************/
// DRAW MAP
/*************************************************************/

//reinitmap
function initMap(latitude, longitude) {
  var here = {lat: latitude, lng: longitude};
  var map = new google.maps.Map(document.getElementById('map'), {
    zoom: 4,
    center: here
  });
  var marker = new google.maps.Marker({
    position: here,
    map: map
  });
}

/*************************************************************/
// Set DESTINATION MARKER
/*************************************************************/
var endpos = document.getElementById("map");
endpos.addEventListener("setDestination",coords=>{
  var here = { lat:coords.lat,lng:coords.lng};
  var marker = new google.maps.Marker({
    position: here,
    map: endpos
  })
});
