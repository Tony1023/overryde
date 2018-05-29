import {EventTarget} from 'EventTarget.js'

//Define custom error
//Adapted from MDN Error code
class PossibleError extends Error {
  constructor(...params) {
    // Pass remaining arguments (including vendor specific ones) to parent constructor
    super(...params);

    // Maintains proper stack trace for where our error was thrown (only available on V8)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, CustomError);
    }
  }
}

/*************************************************************/
//FIND CURRENT POSITION
/*************************************************************/

var perm_map = undefined;
var origin_d = undefined;

var target = new EventTarget();

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
    default:
    x.innerHTML  = "Geolocation is not supported by this browser.";
    throw Error("Geolocation unsupported");
  }
  throw PossibleError("Retry");
}

//Get Current Location via HTML5
function locationPromise() {
  return new Promise((resolve,reject)=>{
    var startpos = document.getElementById("map");
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position)=>{
        //console.log(position);
        //console.log(marker_score.start);
        console.log("Init map");
        resolve(position);
      }, (err)=>{
        showLocationError(err);
      });
    } else {
      showLocationError({"code":"Geolocation Unavailible"});
    }
  });
}

//Set location from previous promise
function setWhere(position){
  return new Promise((resolve,reject)=>
    {
      console.log(position);
      origin_d = position.coords;
      let here = {
        lat: origin_d.latitude,
        lng: origin_d.longitude
      };
      console.log("Finished fetching", position.coords);
      resolve(here);
    }
  ));
}
/*************************************************************/
// DRAW MAP
/*************************************************************/
function mapInit(here) {
  console.log(here);
  //init map
  //  if(typeof document.getElementById('map') !== 'object'){
  var map = new google.maps.Map(document.getElementById('map'), {
    zoom: 4,
    center: here
  });
  perm_map = map;

  //}

  map = perm_map;
  let marker1 = new google.maps.Marker({
    map: map,
    label: 'A'
  });

  marker1.setPosition(here);

  var input = document.getElementById('destination-input');

  //map.controls[google.maps.ControlPosition.TOP_RIGHT].push(card);
  var autocomplete = new google.maps.places.Autocomplete(input);

  // Bind the map's bounds (viewport) property to the autocomplete object,
  // so that the autocomplete requests use the current map bounds for the
  // bounds option in the request.
  //autocomplete.bindTo('bounds', map);
  var marker = new google.maps.Marker({
    map: map,
    label:'B'
  });

  autocomplete.addListener('place_changed', function() {
    marker.setVisible(false);
    var place = autocomplete.getPlace();
    //console.log(place);
    if (!place.geometry) {
      // User entered the name of a Place that was not suggested and
      // pressed the Enter key, or the Place Details request failed.
      window.alert("No details available for input: '" + place.name + "'");
      return;
    }

    /*
    // If the place has a geometry, then present it on a map.
    if (place.geometry.viewport) {
    map.fitBounds(place.geometry.viewport);
  } else {
}
*/


map.setCenter({lat:place.geometry.location.lat()-here.lat/2,
  lng:place.geometry.location.lng()-here.lng/2});
  map.setZoom(17);  // Why 17? Because it looks good.



  marker.setPosition(place.geometry.location);
  marker.setVisible(true);

  var cdocevent = new CustomEvent("k", {detail: {
    origin: here,
    dest: place.geometry.location.toJSON()
  }});

  target.dispatchEvent(cdocevent);

});
};
