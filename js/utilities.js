// New IEX API Key (Publishable)
const apiKey = "pk_98f3452a96a4423db9772e70ee8f5cec";

// New IEX Base URL
const baseUrl = "https://cloud.iexapis.com/";

// Prepend Base URL to Segments
const prependBase = function(url, stable) {
	if (stable) {
		return `${baseUrl}stable/${url}`;
	} else {
		return `${baseUrl}${url}`;
	}
};

// Append API Key to URL as a Query Parameter
const appendKey = function(url) {
	return `${url}?token=${apiKey}`;
};

// Cryptocurrency Aggregate Data (DEPRECATED)
const cryptoEndPoint = "https://api.iextrading.com/1.0/stock/market/crypto";
// Sector Performance Data
const sectorEndPoint = appendKey(prependBase("stock/market/sector-performance", true));
// Gainers & Losers Data
const gainersEndPoint = appendKey(prependBase("stock/market/list/gainers", true));
const losersEndPoint = appendKey(prependBase("stock/market/list/losers", true));

// Fetch Options
const fetchOptionsDefault = {
	method: "GET",
	headers: { Accept: "application/json" }
};

// URL Constructors
const makeStockQuoteUrl = function(symbol) {
	let segment = `stock/${symbol}/quote`;
	return appendKey(prependBase(segment, true));
};

const makeCompanyNewsUrl = function(symbol) {
	let segment = `stock/${symbol}/news/last/5`;
	return appendKey(prependBase(segment, true));
};

const makeCryptoQuoteUrl = function(symbol) {
	let segment = `crypto/${symbol}usdt/quote`;
	return appendKey(prependBase(segment, true));
}

// Generic Fetch Function
const fetchFromAPI = function(url, options, successFunc, failureFunc) {
	fetch(url, options)
		.then(function(response) {
			return response.json();
		})
		.then(successFunc)
		.catch(failureFunc);
};

// Logging Function (for test only)
const logStatus = function(msg) {
	console.log(msg);
};

// Fix a Number to (at least) Two Decimal Places
const toTwoDecimal = function(num) {
	num = parseFloat(num);
	return num.toFixed(2);
};

// Fix a Number to (at least) Two Decimal Places
const leastTwoDecimal = function(num) {
	num = parseFloat(num);
	return num.toFixed(Math.max(2, (num.toString().split('.')[1] || []).length));
};

// Cut a Company's Name to Two Words
const shortenName = function(name) {
	let finalName = "";
	let words = name.split(" ");
	if (words[0]) {
		finalName += words[0];
	}
	if (words[1]) {
		finalName += " " + words[1];
	}
	return finalName;
};

// Determine Whether It is Business Hour
const isBusinessHour = function(date) {
	if (date.getDay() == 0 || date.getDay() == 6) {
		return false;
	}
	else if (date.getHours() < 9 || date.getHours() > 16) {
		return false;
	}
	return true;
};

// Capitalize only the first character of a string
const toTitle = function(string) {
	string = string.toLowerCase();
	return string.charAt(0).toUpperCase() + string.slice(1);
};

// Format Epoch Time to ISO String
const formatDateTime = function(epoch) {
	let date = new Date(epoch);
	let iso = date.toISOString();
	let segments = iso.split("T");
	return `${segments[0]} ${segments[1].substring(0, 5)}`;
};

// Trim News Summary
const trimSummary = function(summary) {
	let length = 500;
	let raw = summary.substring(0, length);
	let last = raw.lastIndexOf(" ");
	let elp = "";
	if (summary.length > length) {
		elp = "...";
		raw = raw.substring(0, last);
	}
	return `${raw.trim()}${elp}`;
};
