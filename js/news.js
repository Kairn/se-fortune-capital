// Formatting data cells for each crypto
const formatCrypto = function(data, symbol) {
	if (data.latestPrice == null) {
		$(symbol + "p").html("N/A");
		$(symbol + "h").html("N/A");
		$(symbol + "l").html("N/A");
		$(symbol + "cc").html("N/A");
		$(symbol + "cp").html("N/A");
		return;
	}
	$(symbol + "p").html(leastTwoDecimal(data.latestPrice));
	$(symbol + "h").html(leastTwoDecimal(data.high));
	$(symbol + "l").html(leastTwoDecimal(data.low));
	if (parseFloat(data.change) > 0) {
		$(symbol + "cc").html("+" + leastTwoDecimal(parseFloat(data.change)));
		$(symbol + "cc").removeClass("down");
		$(symbol + "cc").addClass("up");
		$(symbol + "cp").html("+" + toTwoDecimal(parseFloat(data.changePercent) * 100) + "%");
		$(symbol + "cp").removeClass("down");
		$(symbol + "cp").addClass("up");
	}
	else if (parseFloat(data.change) < 0) {
		$(symbol + "cc").html(leastTwoDecimal(parseFloat(data.change)));
		$(symbol + "cc").removeClass("up");
		$(symbol + "cc").addClass("down");
		$(symbol + "cp").html(toTwoDecimal(parseFloat(data.changePercent) * 100) + "%");
		$(symbol + "cp").removeClass("up");
		$(symbol + "cp").addClass("down");
	}
	else {
		$(symbol + "cc").html(leastTwoDecimal(parseFloat(data.change)));
		$(symbol + "cc").removeClass("up");
		$(symbol + "cc").removeClass("down");
		$(symbol + "cp").html(toTwoDecimal(parseFloat(data.changePercent) * 100) + "%");
		$(symbol + "cp").removeClass("up");
		$(symbol + "cp").removeClass("down");
	}
};

// Formatting sector data
const formatSector = function(secName, secData) {
	secData = toTwoDecimal(parseFloat(secData) * 100);
	if (secData > 0) {
		$("#sec" + secName).html("+" + secData + "%");
		$("#sec" + secName).removeClass("flat-bg");
		$("#sec" + secName).removeClass("down-bg");
		$("#sec" + secName).addClass("up-bg");
	}
	else if (secData < 0) {
		$("#sec" + secName).html(secData + "%");
		$("#sec" + secName).removeClass("flat-bg");
		$("#sec" + secName).removeClass("up-bg");
		$("#sec" + secName).addClass("down-bg");
	}
	else {
		$("#sec" + secName).html(secData + "%");
		$("#sec" + secName).addClass("flat-bg");
		$("#sec" + secName).removeClass("up-bg");
		$("#sec" + secName).removeClass("down-bg");
	}
};

// Update crypto prices in the table (DEPRECATED)
const updateCryptoTable = function(data) {
	// BTC
	const btcSymbol = "#btc-";
	const btcData = data[0];
	formatCrypto(btcData, btcSymbol);

	// EOS
	const eosSymbol = "#eos-";
	const eosData = data[1];
	formatCrypto(eosData, eosSymbol);

	// ETH
	const ethSymbol = "#eth-";
	const ethData = data[2];
	formatCrypto(ethData, ethSymbol);

	// BNB
	const bnbSymbol = "#bnb-";
	const bnbData = data[3];
	formatCrypto(bnbData, bnbSymbol);

	// BCH
	const bchSymbol = "#bch-";
	const bchData = data[5];
	formatCrypto(bchData, bchSymbol);

	// XRP
	const xrpSymbol = "#xrp-";
	const xrpData = data[7];
	formatCrypto(xrpData, xrpSymbol);

	// LTC
	const ltcSymbol = "#ltc-";
	const ltcData = data[10];
	formatCrypto(ltcData, ltcSymbol);

	// ETC
	const etcSymbol = "#etc-";
	const etcData = data[11];
	formatCrypto(etcData, etcSymbol);

	// IOT
	const iotSymbol = "#iot-";
	const iotData = data[12];
	formatCrypto(iotData, iotSymbol);

	// QTUM
	const qtumSymbol = "#qtum-";
	const qtumData = data[17];
	formatCrypto(qtumData, qtumSymbol);
};

// All Cryptos
const ALL_CRYPTOS = [
	"btc",
	"eos",
	"eth",
	"bnb",
	"bcc",
	"xrp",
	"ltc",
	"etc",
	"iota",
	"qtum",
];

// Update Each Crypto Data in the Table
const updateEachCrypto = function(data) {
	const symbol = data.symbol.toLowerCase();
	const cSymbol = `#${symbol.substring(0, symbol.indexOf("usdt"))}-`;
	formatCrypto(data, cSymbol);
};

// Update sector performance
const updateSectorPerformance = function(data) {
	for (let i in data) {
		switch (data[i].name) {
			case "Energy":
				formatSector("En", data[i].performance);
				break;
			case "Consumer Discretionary":
				formatSector("Cd", data[i].performance);
				break;
			case "Consumer Staples":
				formatSector("Cs", data[i].performance);
				break;
			case "Financials":
				formatSector("Fi", data[i].performance);
				break;
			case "Health Care":
				formatSector("Hc", data[i].performance);
				break;
			case "Industrials":
				formatSector("In", data[i].performance);
				break;
			case "Materials":
				formatSector("Ma", data[i].performance);
				break;
			case "Real Estate":
				formatSector("Re", data[i].performance);
				break;
			case "Technology":
				formatSector("Te", data[i].performance);
				break;
			case "Utilities":
				formatSector("Ut", data[i].performance);
				break;
			case "Communication Services":
				formatSector("Co", data[i].performance);
				break;
		}
	}
};

// Update gainers table
const updateGainersTable = function(data) {
	clearGainers();
	for (let i in data) {
		// Create elements
		var $newRow = $("<tr></tr>");
		var $head = $("<td></td>");
		var $change = $("<td></td>");
		var $price = $("<td></td>");
		var $symbol = $("<div></div>");
		var $name = $("<div></div>");
		// Fill elements
		$symbol.html(data[i].symbol).addClass("stock-symbol");
		$name.html(shortenName(data[i].companyName)).addClass("company-name");
		$price.html("$" + toTwoDecimal(data[i].latestPrice)).addClass("font-weight-bold");
		$change.html("+" + toTwoDecimal(parseFloat(data[i].changePercent) * 100) + "%").addClass("up");
		// Attach elements
		$head.append($symbol, $name);
		$newRow.append($head, $change, $price);
		$("#gainers-tbody").append($newRow);
	}
};

// Update losers table
const updateLosersTable = function(data) {
	clearLosers();
	for (let i in data) {
		// Create elements
		var $newRow = $("<tr></tr>");
		var $head = $("<td></td>");
		var $change = $("<td></td>");
		var $price = $("<td></td>");
		var $symbol = $("<div></div>");
		var $name = $("<div></div>");
		// Fill elements
		$symbol.html(data[i].symbol).addClass("stock-symbol");
		$name.html(shortenName(data[i].companyName)).addClass("company-name");
		$price.html("$" + toTwoDecimal(data[i].latestPrice)).addClass("font-weight-bold");
		$change.html(toTwoDecimal(parseFloat(data[i].changePercent) * 100) + "%").addClass("down");
		// Attach elements
		$head.append($symbol, $name);
		$newRow.append($head, $change, $price);
		$("#losers-tbody").append($newRow);
	}
};

// Launch the search update process with animation
const animateSearch = function(data) {
	$("#response-zone").slideUp(2000, function() {
		updateKeyStockData(data);
	})
};

// Update key stock data and make an API call to get news
const updateKeyStockData = function(data) {
	clearSearch();
	$("#key-symbol").html(data.symbol);
	$("#key-name").html(data.companyName);
	$("#key-p").html("$" + toTwoDecimal(data.latestPrice));
	$("#key-op").html(toTwoDecimal(data.open));
	$("#key-cl").html(toTwoDecimal(data.close));
	$("#key-pc").html(toTwoDecimal(data.previousClose));
	$("#key-h").html(toTwoDecimal(data.high));
	$("#key-l").html(toTwoDecimal(data.low));
	$("#key-yh").html(toTwoDecimal(data.week52High));
	$("#key-yl").html(toTwoDecimal(data.week52Low));
	if (data.peRatio != null) {
		$("#key-pe").html(toTwoDecimal(data.peRatio));
	}
	else {
		$("#key-pe").html("N/A");
	}
	if (parseFloat(data.change) > 0) {
		$("#key-cc").removeClass("down");
		$("#key-cc").html("+" + toTwoDecimal(data.change)).addClass("up");
		$("#key-cp").removeClass("down");
		$("#key-cp").html("+" + toTwoDecimal(parseFloat(data.changePercent) * 100) + "%").addClass("up");
	}
	else if (parseFloat(data.change) < 0) {
		$("#key-cc").removeClass("up");
		$("#key-cc").html(toTwoDecimal(data.change)).addClass("down");
		$("#key-cp").removeClass("up");
		$("#key-cp").html(toTwoDecimal(parseFloat(data.changePercent) * 100) + "%").addClass("down");
	}
	else {
		$("#key-cc").removeClass("up").removeClass("down").html("0.00");
		$("#key-cp").removeClass("up").removeClass("down").html("0.00%");
	}
	fetchFromAPI(makeCompanyNewsUrl(data.symbol), fetchOptionsDefault, updateNews, logStatus);
};

// Update news
const updateNews = function(data) {
	var $newsZone = $("#news-zone");
	if (data.length === 0) {
		let $newRow = $("<div></div>").addClass("row");
		let $newCol = $("<div></div>").addClass("col-12");
		let $header = $("<a></a>");
		$header.html("Oops, nothing was found.").addClass("text-left");
		$newCol.append($header);
		$newRow.append($newCol);
		$newsZone.append($newRow);
	}
	else {
		for (let i in data) {
			let $newRow = $("<div></div>").addClass("row");
			let $newCol = $("<div></div>").addClass("col-12").addClass("text-left");
			let $header = $("<a></a>");
			let $time = $("<p></p>").addClass("lead");
			let $summary = $("<p></p>");
			$header.html(data[i].headline).attr("target", "_blank").attr("href", data[i].url);
			$time.html(formatDateTime(data[i].datetime));
			$summary.html(trimSummary(data[i].summary));
			$newCol.append($header, $time, $summary);
			if (i < data.length - 1) {
				$newCol.append($("<div></div>").addClass("news-div"));
			}
			$newRow.append($newCol);
			$newsZone.append($newRow);
		}
	}
	$("#response-zone").slideDown(2000);
};

// Clear gainers/losers table data
const clearGainers = function() {
	$("#gainers-tbody").empty();
};

const clearLosers = function() {
	$("#losers-tbody").empty();
};

// Clear search results
const clearSearch = function() {
	$("#news-zone").empty();
};

// Display error message for unknown search string
const displayError = function() {
	$("#error-zone").slideDown().delay(2000).slideUp(1000);
};

// Make an API call to retrieve crypto data
const getCryptoData = function() {
	// fetchFromAPI(cryptoEndPoint, fetchOptionsDefault, updateCryptoTable, logStatus);
	ALL_CRYPTOS.forEach((symbol) => {
		fetchFromAPI(makeCryptoQuoteUrl(symbol), fetchOptionsDefault, updateEachCrypto, logStatus);
	});
};

// Make an API call to retrieve sector data
const getSectorData = function() {
	fetchFromAPI(sectorEndPoint, fetchOptionsDefault, updateSectorPerformance, logStatus);
};

// Make an API call to retrieve gainers data
const getGainersData = function() {
	fetchFromAPI(gainersEndPoint, fetchOptionsDefault, updateGainersTable, logStatus);
};

// Make an API call to retrieve losers data
const getLosersData = function() {
	fetchFromAPI(losersEndPoint, fetchOptionsDefault, updateLosersTable, logStatus);
};

// Start the two-step process of calling stock quote and news API
const getSearchResult = function(symbol) {
	fetchFromAPI(makeStockQuoteUrl(symbol), fetchOptionsDefault, animateSearch, displayError);
};

// Wait until the document is ready for jQuery
$(function() {
	// Call updates to data on startup
	getCryptoData();
	getSectorData();
	getGainersData();
	getLosersData();
	setInterval(getCryptoData, 5000);
	// Automatically update all data during business hours
	if (isBusinessHour(new Date())) {
		setInterval(getSectorData, 5000);
		setInterval(getGainersData, 5000);
		setInterval(getLosersData, 5000);
	}
	// Add event listener to the search button
	$("#search").on("click", function() {
		if ($("#ticker").val().trim()) {
			getSearchResult($("#ticker").val().trim());
		}
	})
});
