var EventTarget = function() {
  this.listeners = {};
};

EventTarget.prototype.listeners = null;
EventTarget.prototype.addEventListener = function(type, callback) {
  if (!(type in this.listeners)) {
    this.listeners[type] = [];
  }
  this.listeners[type].push(callback);
};

EventTarget.prototype.removeEventListener = function(type, callback) {
  if (!(type in this.listeners)) {
    return;
  }
  var stack = this.listeners[type];
  for (var i = 0, l = stack.length; i < l; i++) {
    if (stack[i] === callback){
      stack.splice(i, 1);
      return;
    }
  }
};

EventTarget.prototype.dispatchEvent = function(event) {
  if (!(event.type in this.listeners)) {
    return true;
  }
  var stack = this.listeners[event.type];

  for (var i = 0, l = stack.length; i < l; i++) {
    stack[i].call(this, event);
  }
  return !event.defaultPrevented;
};


var uberTarget = new EventTarget();
var lyftTarget = new EventTarget();

function retrieveData(startLat, startLng, endLat, endLng) {
	fetchLyftPrice(startLat, startLng, endLat, endLng);
	fetchUberPrice(startLat, startLng, endLat, endLng);
}


function fetchLyftPrice(startLat, startLng, endLat, endLng) {
	let url = "https://api.lyft.com/v1/cost?start_lat=" + String(startLat) + "&start_lng=" + String(startLng) + "&end_lat=" + String(endLat) + "&end_lng=" + String(endLng);
	//let url = "https://api.lyft.com/v1/cost?start_lat=" + "34.0689254" + "&start_lng=" + "-118.4473698" + "&end_lat=" + String(endLat) + "&end_lng=" + String(endLng);
	fetch('/searchLyft', {
		method: "GET",
		headers: {
			url: url
		}
	})
		.then(response => response.json())
		.then(data => {console.log(data);lyftEvent(data)});
}

function fetchUberPrice(startLat, startLng, endLat, endLng) {
	let url = "https://api.uber.com/v1.2/estimates/price?start_latitude=" + String(startLat) + "&start_longitude=" + String(startLng) + "&end_latitude=" + String(endLat) + "&end_longitude=" + String(endLng);

	fetch('/searchUber', {
		method: 'GET',
		headers: {
			url: url
		}
	})
		.then(response => response.json())
		.then(data => {console.log(data);uberEvent(data)});
}

/**
 * Custom event handlers and listeners
 */

const lyftType = ['lyft_line', 'lyft', 'lyft_plus'];
const uberType = ['POOL', 'uberX', 'uberXL'];
const typeToName = {
	'lyft_line': 'Fryft Line', 
	'lyft': 'Fryft', 
	'lyft_plus': 'Fryft Plus',
	'POOL': 'Fuber Pool',
	'uberX': 'FuberX', 
	'uberXL': 'FuberXL'
}

function compare(a, b) {
	return a.value.estimatedPrice - b.value.estimatedPrice;
}

function lyftEvent(data) {
	function typeMatch(type) {
		return lyftType.includes(type.ride_type);
	}
	let parse = data.cost_estimates.filter(typeMatch)
	let eventData = { detail: [] };
	parse.forEach(function (item) {
		eventData.detail.push({ 
			key: item.ride_type,
			value: { 'estimatedPrice': parseInt(item.estimated_cost_cents_min / 100) }
		})
	});
	eventData.detail.sort(compare);
	let lyftPrice = new CustomEvent("lyftPrice", eventData);
	lyftTarget.dispatchEvent(lyftPrice);
}

function uberEvent(data) {
	function typeMatch(type) {
		return uberType.includes(type.localized_display_name);
	}
	let parse = data.prices.filter(typeMatch);
	let eventData = { detail: [] };
	parse.forEach(function (item) {
		eventData.detail.push({
			key: item.localized_display_name, 
			value: {
				'estimatedPrice': item.low_estimate,
				'estimatedPrice_high': item.high_estimate
			}
		})
	})
	console.log(parse);
	eventData.detail.sort(compare);
	let uberPrice = new CustomEvent("uberPrice", eventData);
	uberTarget.dispatchEvent(uberPrice);
}