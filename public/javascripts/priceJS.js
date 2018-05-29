
async function retrieveData(startLat, startLng, endLat, endLng) {
	const lyftPrices = fetchLyftPrice(startLat, startLng, endLat, endLng);
	const uberPrices = fetchUberPrice(startLat, startLng, endLat, endLng);
	await resolveLyft(lyftPrices);
	await resolveUber(uberPrices);
}

async function fetchLyftPrice(startLat, startLng, endLat, endLng) {
	let url = "https://api.lyft.com/v1/cost?start_lat=" + String(startLat) + "&start_lng=" + String(startLng) + "&end_lat=" + String(endLat) + "&end_lng=" + String(endLng);
	//let url = "https://api.lyft.com/v1/cost?start_lat=" + "34.0689254" + "&start_lng=" + "-118.4473698" + "&end_lat=" + String(endLat) + "&end_lng=" + String(endLng);
	try{
		const response = await fetch('/searchLyft', {
			method: "GET",
			headers: {
				url: url
			}
		});
		var data = await response.json();
		console.log(data);
		return await lyftEvent(data);
	}catch(err) {
		console.log('lyft fetch failed', err);
	}
}

//async
function fetchUberPrice(startLat, startLng, endLat, endLng) {
	let url = "https://api.uber.com/v1.2/estimates/price?start_latitude=" + String(startLat) + "&start_longitude=" + String(startLng) + "&end_latitude=" + String(endLat) + "&end_longitude=" + String(endLng);
	try{
		const response = await fetch('/searchUber', {
			method: 'GET',
			headers: {
				url: url
			}
		});
		var data = await response.json();
		console.log(data);
		return await uberEvent(data);
	}catch(err){
		console.log('lyft fetch failed', err);
	}
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

//not async
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
	return eventData
}

//not async
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
	return eventData;
}

function resolveUber(data){
	let prices = data.detail;
	console.log(prices);
	let x = document.getElementById("uberinfo");
	let text = '';
	prices.forEach(function (item) {
		console.log(item);
		text += ('<div class="datarow lead">' + typeToName[item.key] + '<span class="price">' + String(item.value.estimatedPrice) + '-' + String(item.value.estimatedPrice_high) + '</span></div/>');
	});
	x.innerHTML = text;
}

function resolveLyft(data){
	let prices = data.detail;
	console.log(prices);
	let x = document.getElementById("lyftinfo");
	let text = '';
	prices.forEach(function (item) {
		console.log(prices[item]);
		text += ('<div class="datarow lead">' + typeToName[item.key] + '<span class="price">' + String(item.value.estimatedPrice) + '</span></div/>');
	});
	x.innerHTML = text;
}
