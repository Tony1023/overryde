/**
 * Functions that make requests to the uber and lyft APIs for prices
 */

let accessToken = {
	lyft: '',
	uber: '-Q_I4XWhcADPx5e2YXUJQnndK2Cs6ugTM9_HkdJA'
}

/**
 * Tranlated by https://github.com/kigiri/fetch, original client_id and client_secret not listed
 */
const lyftKey = 'dURUWndGcUxsSnJwOkRVdDVDUXI4bkRUSWhzNjFtWHZpY3FBMUFrMFhZdWFF'

/**
 * Fetch the newest lyft token. Uber's server token is ready
 */
function setUp() {
	fetchLyftToken()
		.then(data => lyftTokenHandler(data))
		.catch(error => console.error(error));
}

/**
 * Use .then to get access to the data post-fetched
 */
function fetchLyftToken() {
	console.log("Start fetching");
	return fetch("https://api.lyft.com/oauth/token", {
		body: JSON.stringify({"grant_type": "client_credentials", 
			"scope": "public"}),
		headers: {
			Authorization: "Basic " + lyftKey,
			"Content-Type": "application/json"
		},
		method: "POST"
	})
		.then(response => response.json());
}

function lyftTokenHandler(data) { accessToken.lyft = data.access_token; }

function fetchLyftPrice(startLat, startLng, endLat, endLng) {
	console.log("Start fetching Lyft prices");
	let url = "https://api.lyft.com/v1/cost?start_lat=" + String(startLat) + "&start_lng=" + String(startLng) + "&end_lat=" + String(endLat) + "&end_lng=" + String(endLng);
	return fetch(url, {
		method: "GET",
		headers: {
			Authorization: "Bearer " + accessToken.lyft
		}
	})
		.then(response => response.json());
}

function fetchUberPrice(startLat, startLng, endLat, endLng) {
	let URL = "https://api.uber.com/v1/estimates/price?start_latitude=" + String(startLat) + "&start_longitude=" + String(startLng) + "&end_latitude=" + String(endLat) + "&end_longitude=" + String(endLng);
	URL += ("&server_token=" + accessToken.uber);
	console.log(URL);
	/*
	return fetch(url, {
		headers: {
			'Access-Control-Allow-Origin': ,
			Authorization: 'Token -Q_I4XWhcADPx5e2YXUJQnndK2Cs6ugTM9_HkdJA',
			'Content-Type': 'application/json',
			'Accept-Language': 'en_US'
		}
	})
		.then(response => console.log(response));*/

	$.ajax({
		url: URL,
		cache: false,
		success: function(html){
			$("#results").append(html);
		}
	});
}