
var marker_store = {start: undefined, end: undefined};

/*************************************************************/
//FIND CURRENT POSITION
/*************************************************************/

//EventListener for when HTML5 can fix location
document.addEventListener("DOMContentLoaded", getLocation());

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
    throw "Retry? Connection might be the issue.";
}

//Get Current Location via HTML5
function getLocation() {
    var startpos = document.getElementById("map");
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position)=>{
            let startpos = document.getElementById("map");
            startpos.innerHTML = "";
            updateOrigin(position.coords);
          },
          (err)=>{
            showLocationError(err);
          }
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
function updateOrigin(coords) {
  let m = document.getElementById('map');
  var here = {lat: coords.latitude, lng: coords.longitude};
  var marker = marker_store.start;
  if(typeof m === "object"){
    var map = new google.maps.Map(document.getElementById('map'), {
      zoom: 4,
      center: here
    });
  } else if(typeof marker === "undefined"){
    var marker = new google.maps.Marker({
      position: here,
      map: map
    });
    marker.setLabel("A");
  } else {
    marker.setPosition(here);
  }
  marker_store.start = marker;
}

/*************************************************************/
// Set DESTINATION MARKER
/*************************************************************/
document.getElementById('map').addEventListener("setDestination",detail=>{
  let coords = detail.coords;
  var here = { lat:coords.lat,lng:coords.lng};
  var marker = marker_store.end;
  //create else update
  if(typeof marker === "undefined"){
    marker = new google.maps.Marker({
      position: here,
      map: here
    });

    marker.setLabel("B");
  }else{
    marker.setPosition(here);
  }
    marker_store.end = marker;
});
/*
document.getElementById("map").addEventListener("setDestination",coords=>{
  var here = { lat:coords.lat,lng:coords.lng};
  var marker = new google.maps.Marker({
    position: here,
    map: endpos
  })
  marker.setLabel("B");

  marker_store.end = marker;
});
*/
/*************************************************************/
// Reset ORIGIN
/*************************************************************/
var r_h = document.getElementById("reset_here");
r_h.on("click", getLocation());
