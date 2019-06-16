// Asset chart static specifications
const $chartCanvas = $("#asset-chart");
const chartLabels = ["USD", "Cryptos", "Stocks"];
const chartColors = ["rgba(102, 81, 145, 0.7)", "rgba(249, 93, 106, 0.7)", "rgba(255, 166, 0, 0.7)"];
const chartBorderWidth = 1;
const chartType = "doughnut";
const chartOptions = {
	events: ["click", "mousemove"],
	animation: {
		animateRotate: true,
		animateScale: true
	}
};

// Chart reference
var userAssetChart;

// Draw chart on canvas
const drawAssetChart = function(chartDataPoints) {
	if (userAssetChart) {
		userAssetChart.destroy();
	}
	userAssetChart = new Chart($chartCanvas, {
		type: chartType,
		data: {
			labels: chartLabels,
			datasets: [{
				data: chartDataPoints,
				backgroundColor: chartColors,
				borderWidth: chartBorderWidth
			}]
		},
		options: chartOptions
	});
};

// Asset table variables
var currentAssetTablePage = 0;

// Firebase access details
const firebaseConfig = {
	apiKey: "AIzaSyD_c6cYcULphAbIrB1otDHNiAYI5SQj4b8",
	authDomain: "se-fortune-captial.firebaseapp.com",
	databaseURL: "https://se-fortune-captial.firebaseio.com",
	projectId: "se-fortune-captial",
	storageBucket: "se-fortune-captial.appspot.com",
	messagingSenderId: "1033306849919"
};

// Firebase setup
var fireAuth = null;
var fireDB = null;
var fireUser = null;
var fireAssetsSnapshot = {
	"symbols": [],
	"amounts": [],
	"prices": []
};
const firebaseInit = function() {
	firebase.initializeApp(firebaseConfig);
	fireAuth = firebase.auth();
	fireDB = firebase.database();
};

// Check user's login status
const isLoggedin = function() {
	if (fireAuth.currentUser) {
		return true;
	}
	else {
		return false;
	}
};

// Get a user's profile
const getUserProfile = function() {
	if (isLoggedin()) {
		fireUser = fireAuth.currentUser;
	}
	else {
		fireUser = null;
	}
};

// Get the database reference of a user's assets
const getAssetsRef = function() {
	return fireDB.ref("Users/" + fireUser.uid + "/Assets");
};

// Take a snapshot of the current user's portfolio data and store it in a global variable
const getPortfolioSnapshot = function(updateFunc) {
	chartDataPoints = [0, 0, 0];
	fireAssetsSnapshot = {};
	let symbolArray = [];
	let amountArray = [];
	let priceArray = [];
	fireAssetsSnapshot["symbols"] = symbolArray;
	fireAssetsSnapshot["amounts"] = amountArray;
	fireAssetsSnapshot["prices"] = priceArray;
	if (!isLoggedin()) {
		return;
	}
	getUserProfile();
	let userAssetsRef = getAssetsRef();
	userAssetsRef.once("value")
		.then(function(snapshot) {
			let newSnapshot = snapshot.val();
			symbolArray = Object.keys(newSnapshot);
			amountArray = Object.values(newSnapshot);
			fireAssetsSnapshot["symbols"] = symbolArray;
			fireAssetsSnapshot["amounts"] = amountArray;
			fireAssetsSnapshot["prices"] = priceArray;
			for (let i in symbolArray) {
				if (symbolArray[i] === "USD") {
					priceArray[i] = 1.0;
					if (priceArray.length === symbolArray.length && !priceArray.includes(undefined)) {
						updateFunc();
						return;
					}
				}
				else if (symbolArray[i].endsWith("USDT")) {
					fetch(makeCryptoQuoteUrl(symbolArray[i].toLowerCase().substring(0, symbolArray[i].indexOf("USDT"))), fetchOptionsDefault)
						.then(function(response) {
							return response.json();
						})
						.then(function(data) {
							priceArray[i] = parseFloat(data.latestPrice);
							if (priceArray.length === symbolArray.length && !priceArray.includes(undefined)) {
								updateFunc();
								return;
							}
						})
						.catch(logStatus);
				}
				else {
					fetch(makeStockQuoteUrl(symbolArray[i]), fetchOptionsDefault)
						.then(function(response) {
							return response.json();
						})
						.then(function(data) {
							priceArray[i] = parseFloat(data["latestPrice"]);
							if (priceArray.length === symbolArray.length && !priceArray.includes(undefined)) {
								updateFunc();
								return;
							}
						})
						.catch(logStatus);
				}
			}
		})
		.catch(logStatus);
};

// Display the current user's full name
const displayUserName = function() {
	let userFirstName;
	let userLastName;
	if (isLoggedin()) {
		fireDB.ref("Users/" + fireUser.uid).once("value")
			.then(function(snapshot) {
				userFirstName = snapshot.val()["First Name"];
				userLastName = snapshot.val()["Last Name"];
				$("#user-name").html(userFirstName + " " + userLastName);
			})
	}
};

// Refresh the dashboard entirely with a newer snapshot
const dashboardRefresh = function() {
	let symbolArray = fireAssetsSnapshot["symbols"];
	let priceArray = fireAssetsSnapshot["prices"];
	let amountArray = fireAssetsSnapshot["amounts"];
	let chartDataPoints = [0, 0, 0];
	let userAssetTotal = 0;
	let $userAssetTable = $("#asset-table-body");
	let $userSellList = $("#sell-type");
	$userAssetTable.empty();
	$userSellList.empty();
	let $defaultSellOption = $("<option>Choose One</option>");
	$defaultSellOption.attr("selected", true);
	$defaultSellOption.attr("value", "");
	$userSellList.prepend($defaultSellOption);
	for (let i in symbolArray) {
		// USD
		if (symbolArray[i] === "USD") {
			// Update the asset table
			let $newRow = $("<tr></tr>");
			let $newAssetName = $("<th></th>");
			let $newAssetAmount = $("<td></td>");
			let $newAssetPrice = $("<td></td>");
			let $newAssetTotal = $("<td></td>");
			let newTotal = toTwoDecimal(parseFloat(priceArray[i]) * parseFloat(amountArray[i]));
			$newAssetName.attr("scope", "row");
			$newAssetName.html("USD");
			$newAssetAmount.html(toTwoDecimal(amountArray[i]));
			$newAssetPrice.html(toTwoDecimal(priceArray[i]));
			$newAssetTotal.css("font-weight", "bold");
			$newAssetTotal.html("$" + newTotal);
			$newRow.append($newAssetName, $newAssetAmount, $newAssetPrice, $newAssetTotal);
			$userAssetTable.prepend($newRow);
			// Add to Asset total
			userAssetTotal += parseFloat(newTotal);
			// Update chart data
			chartDataPoints[0] = toTwoDecimal(parseFloat(chartDataPoints[0]) + parseFloat(newTotal));
		}
		// Crypto
		else if (symbolArray[i].endsWith("USDT")) {
			// Update the asset table
			let $newRow = $("<tr></tr>");
			let $newAssetName = $("<th></th>");
			let $newAssetAmount = $("<td></td>");
			let $newAssetPrice = $("<td></td>");
			let $newAssetTotal = $("<td></td>");
			let newTotal = toTwoDecimal(parseFloat(priceArray[i]) * parseFloat(amountArray[i]));
			$newAssetName.attr("scope", "row");
			$newAssetName.html(symbolArray[i]);
			$newAssetAmount.html(toTwoDecimal(amountArray[i]));
			$newAssetPrice.html(toTwoDecimal(priceArray[i]));
			$newAssetTotal.css("font-weight", "bold");
			$newAssetTotal.html("$" + newTotal);
			$newRow.append($newAssetName, $newAssetAmount, $newAssetPrice, $newAssetTotal);
			$userAssetTable.append($newRow);
			// Add to Asset total
			userAssetTotal += parseFloat(newTotal);
			// Update chart data
			chartDataPoints[1] = toTwoDecimal(parseFloat(chartDataPoints[1]) + parseFloat(newTotal));
			// Update sell list
			let $newAssetOption = $("<option></option>");
			$newAssetOption.html(symbolArray[i]).attr("value", i);
			$userSellList.append($newAssetOption);
		}
		// Stock
		else {
			// Update the asset table
			let $newRow = $("<tr></tr>");
			let $newAssetName = $("<th></th>");
			let $newAssetAmount = $("<td></td>");
			let $newAssetPrice = $("<td></td>");
			let $newAssetTotal = $("<td></td>");
			let newTotal = toTwoDecimal(parseFloat(priceArray[i]) * parseFloat(amountArray[i]));
			$newAssetName.attr("scope", "row");
			$newAssetName.html(symbolArray[i]);
			$newAssetAmount.html(toTwoDecimal(amountArray[i]));
			$newAssetPrice.html(toTwoDecimal(priceArray[i]));
			$newAssetTotal.css("font-weight", "bold");
			$newAssetTotal.html("$" + newTotal);
			$newRow.append($newAssetName, $newAssetAmount, $newAssetPrice, $newAssetTotal);
			$userAssetTable.append($newRow);
			// Add to Asset total
			userAssetTotal += parseFloat(newTotal);
			// Update chart data
			chartDataPoints[2] = toTwoDecimal(parseFloat(chartDataPoints[2]) + parseFloat(newTotal));
			// Update sell list
			let $newAssetOption = $("<option></option>");
			$newAssetOption.html(symbolArray[i]).attr("value", i);
			$userSellList.append($newAssetOption);
		}
	}
	// Update dashboard
	$("#total-assets").html(toTwoDecimal(userAssetTotal));
	drawAssetChart(chartDataPoints);
	displayAssetTable();
};

// Display asset table's content based on the current page
const displayAssetTable = function() {
	$userAssetList = $("#asset-table-body").find("tr");
	$userAssetList.addClass("no-show");
	$userAssetList.slice(parseInt(currentAssetTablePage) * 4, (parseInt(currentAssetTablePage) + 1) * 4).removeClass("no-show");
};

// Switch table page
const changeAssetTablePage = function(direction) {
	let maxPageNumber = Math.floor((fireAssetsSnapshot["symbols"].length - 0.5) / 4);
	if (direction === "left") {
		if (parseInt(currentAssetTablePage) > 0) {
			currentAssetTablePage = parseInt(currentAssetTablePage) - 1;
		}
	}
	else if (direction === "right") {
		if (parseInt(currentAssetTablePage) < maxPageNumber) {
			currentAssetTablePage = parseInt(currentAssetTablePage) + 1;
		}
	}
	else {
		return;
	}
	displayAssetTable();
};

// Register a new user
const registerNewUser = function(event) {
	event.preventDefault();
	// Get registration form data
	let userEmail = $("#register-email").val().trim();
	let userPassword = $("#register-password").val().trim();
	let userFirstName = $("#register-firstName").val().trim();
	let userLastName = $("#register-lastName").val().trim();
	let userInitialDeposit = parseFloat($("#register-deposit").val());

	// Create a new account
	fireAuth.createUserWithEmailAndPassword(userEmail, userPassword)
		.then(function() {
			getUserProfile();
			// Create a new database entry
			let newUser = {};
			let userUID = fireUser.uid;
			newUser["First Name"] = toTitle(userFirstName);
			newUser["Last Name"] = toTitle(userLastName);
			newUser["Role"] = "Client";
			newUser["Assets"] = {};
			newUser["Assets"]["USD"] = userInitialDeposit;
			fireDB.ref("Users").child(userUID).set(newUser);
			startActivities();
		})
		.catch(function(error) {
			console.log(error);
			displayRegisterError();
		})
};

// Logout a current user
const logoutUser = function() {
	if (isLoggedin()) {
		fireAuth.signOut()
			.then(function() {
				location.reload();
			})
			.catch(logStatus);
	}
};

// Login a returning user
const loginUser = function(event) {
	event.preventDefault();
	let userEmail = $("#login-email").val().trim();
	let userPassword = $("#lgoin-password").val().trim();
	fireAuth.signInWithEmailAndPassword(userEmail, userPassword)
		.then(function() {
			startActivities();
		})
		.catch(displayLoginError);
};

// Close an account
const closeAccount = function() {
	if (isLoggedin()) {
		let removedID = fireUser.uid;
		fireUser.delete()
			.then(function() {
				fireDB.ref("Users").child(removedID).remove();
			})
			.then(function() {
				window.location.href = "index.html";
			})
			.catch(function(error) {
				console.log(error);
				alert("This action is sensitive, please re-login and try again.");
			});
	}
};

// Decide which form to display based on user's login status
const formRefresh = function() {
	if (isLoggedin()) {
		$("#no-user-page").fadeOut(1000, function() {
			$("#user-page").slideDown(2000);
		})
	}
	else {
		$("#no-user-page").slideDown(2000);
	}
	getUserProfile();
};

// Display error if unable to register
const displayRegisterError = function() {
	$("#register-error").slideDown().delay(2000).slideUp(1000);
};

// Display error if unable to login
const displayLoginError = function() {
	$("#login-error").slideDown().delay(2000).slideUp(1000);
};

// Display error if transaction unsuccessful
const displayTxFailure = function() {
	$("#transaction-failure").slideDown().delay(2000).slideUp();
};

// Display message if transaction successful
const displayTxSuccess = function(reload) {
	$("#transaction-success").slideDown().delay(1000).slideUp(500, function() {
		if (reload) {
			location.reload();
		}
	})
};

// Load funds into a user's account
const makeDeposit = function(event) {
	event.preventDefault();
	let userDeposit = parseFloat($("#deposit-amount").val());
	let userAssetsRef = getAssetsRef();
	let userNewBalance;
	userAssetsRef.once("value")
		.then(function(snapshot) {
			let userCurrentBalance = parseFloat(snapshot.val()["USD"]);
			userNewBalance = toTwoDecimal(userCurrentBalance + userDeposit);
			userAssetsRef.child("USD").set(userNewBalance);
			displayTxSuccess(true);
		})
		.catch(displayTxFailure);
};

// Withdraw funds from a user's account
const makeWithdraw = function(event) {
	event.preventDefault();
	let userWithdraw = parseFloat($("#withdraw-amount").val());
	let userAssetsRef = getAssetsRef();
	let userNewBalance;
	userAssetsRef.once("value")
		.then(function(snapshot) {
			let userCurrentBalance = parseFloat(snapshot.val()["USD"]);
			if (userWithdraw > userCurrentBalance) {
				displayTxFailure();
				return;
			}
			else {
				userNewBalance = userCurrentBalance - userWithdraw;
				userAssetsRef.child("USD").set(userNewBalance);
				displayTxSuccess(true);
			}
		})
		.catch(displayTxFailure);
};

// Clear the total fields
const clearTotal = function() {
	$("#buy-total").html("0.00");
	$("#sell-total").html("0.00");
};

// Make an API call to calculate the total buy cost
const calculateBuy = function() {
	clearTotal();
	if (!$("#buy-amount").val() || !$("input[name=asset-type]:checked").val()) {
		return;
	}
	if ($("input[name=asset-type]:checked").val() === "crypto") {
		if ($("#crypto-buy").val()) {
			let cryptoName = $("#crypto-buy").val();
			let cryptoAmount = parseFloat($("#buy-amount").val());
			fetch(makeCryptoQuoteUrl(cryptoName.toLowerCase().substring(0, cryptoName.indexOf("USDT"))), fetchOptionsDefault)
				.then(function(response) {
					return response.json();
				})
				.then(function(cryptoData) {
					let buyTotal;
					if (cryptoData.latestPrice) {
						buyTotal = cryptoAmount * parseFloat(cryptoData.latestPrice);
						$("#buy-total").html(toTwoDecimal(buyTotal));
					}
				})
				.catch(logStatus);
		}
		return;
	}
	if ($("input[name=asset-type]:checked").val() === "stock") {
		if ($("#stock-buy").val()) {
			let stockName = $("#stock-buy").val().trim().toUpperCase();
			let stockAmount = parseFloat($("#buy-amount").val());
			fetch(makeStockQuoteUrl(stockName), fetchOptionsDefault)
				.then(function(response) {
					return response.json();
				})
				.then(function(stockData) {
					let buyTotal = stockAmount * parseFloat(stockData["latestPrice"]);
					$("#buy-total").html(toTwoDecimal(buyTotal));
				})
				.catch(logStatus);
		}
	}
};

// Calculate the sell total using existing data
const calculateSell = function() {
	if ($("#sell-type").val() == "") {
		return;
	}
	let userAssetIndex = parseInt($("#sell-type").val());
	let userSellUnitPrice = parseFloat(fireAssetsSnapshot["prices"][userAssetIndex]);
	let userSellAmount = parseFloat($("#sell-amount").val());
	let userSellTotal = toTwoDecimal(userSellUnitPrice * userSellAmount);
	$("#sell-total").html(userSellTotal);
};

// Confirm an asset purchase transaction
const confirmBuy = function(event) {
	event.preventDefault();
	if ($("#buy-total").text() != "0.00") {
		let userBuyCost = parseFloat($("#buy-total").text());
		let userNewAssetAmount = parseFloat($("#buy-amount").val());
		let userNewAssetName;
		let userNewBalance;
		let userAssetsRef = getAssetsRef();
		if ($("input[name=asset-type]:checked").val() === "crypto") {
			userNewAssetName = $("#crypto-buy").val();
		}
		else {
			userNewAssetName = $("#stock-buy").val().trim().toUpperCase();
		}
		userAssetsRef.once("value")
			.then(function(snapshot) {
				if (parseFloat(snapshot.val()["USD"]) < userBuyCost) {
					displayTxFailure();
					return;
				}
				else {
					userNewBalance = parseFloat(snapshot.val()["USD"]) - userBuyCost;
					userAssetsRef.child("USD").set(userNewBalance);
					if (snapshot.val()[userNewAssetName]) {
						userNewAssetAmount += parseFloat(snapshot.val()[userNewAssetName]);
					}
					userAssetsRef.child(userNewAssetName).set(userNewAssetAmount);
					displayTxSuccess(true);
				}
			})
			.catch(function(error) {
				console.log(error);
				displayTxFailure();
			});
	}
};

// Confirm an asset purchase transaction
const confirmSell = function(event) {
	event.preventDefault();
	let userAssetIndex = parseInt($("#sell-type").val());
	let userSellTotal = parseFloat($("#sell-total").text());
	let userSellAmount = parseFloat($("#sell-amount").val());
	let userHasAmount = parseFloat(fireAssetsSnapshot["amounts"][userAssetIndex]);
	let userSellType = fireAssetsSnapshot["symbols"][userAssetIndex];
	let userAssetsRef = getAssetsRef();
	if ($("#sell-total").text() != "0.00") {
		if (userSellAmount < userHasAmount) {
			let userNewBalance;
			let userNewAssetBalance;
			userAssetsRef.once("value")
				.then(function(snapshot) {
					let newSnapshot = snapshot.val();
					userNewAssetBalance = parseFloat(newSnapshot[userSellType]) - userSellAmount;
					userNewBalance = parseFloat(newSnapshot["USD"]) + userSellTotal;
					userAssetsRef.child(userSellType).set(userNewAssetBalance);
					userAssetsRef.child("USD").set(userNewBalance);
					displayTxSuccess(true);
				})
				.catch(function(error) {
					console.log(error);
					displayTxFailure();
				});
		}
		else {
			userSellTotal = parseFloat(fireAssetsSnapshot["prices"][userAssetIndex]) * userHasAmount;
			let userNewBalance;
			userAssetsRef.once("value")
				.then(function(snapshot) {
					let newSnapshot = snapshot.val();
					userNewBalance = parseFloat(newSnapshot["USD"]) + parseFloat(userSellTotal);
					userAssetsRef.child(userSellType).remove();
					userAssetsRef.child("USD").set(userNewBalance);
					displayTxSuccess(true);
				})
				.catch(function(error) {
					console.log(error);
					displayTxFailure();
				});
		}
	}
};

// Get the page ready for user activity
const startActivities = function() {
	formRefresh();
	displayUserName();
	getPortfolioSnapshot(dashboardRefresh);
};

// Wait until the document is ready for jQuery
$(function() {
	// Initialize Firebase
	firebaseInit();

	// Bind form submission events
	$("#register-form").submit(registerNewUser);
	$("#login-form").submit(loginUser);
	$("#deposit-form-real").submit(makeDeposit);
	$("#withdraw-form-real").submit(makeWithdraw);
	$("#buy-form-real").submit(confirmBuy);
	$("#sell-form-real").submit(confirmSell);

	// Bind other events
	$("#logout-btn").on("click", logoutUser);
	$("#buy-form-real").change(clearTotal);
	$("#sell-form-real").change(clearTotal);
	$("#calculate-buy").on("click", calculateBuy);
	$("#calculate-sell").on("click", calculateSell);
	$("#sell-tab").on("click", function() {
		getPortfolioSnapshot(dashboardRefresh);
	});
	$("#close-confirm").on("click", closeAccount);
	$("#turn-page-left").on("click", function() {
		changeAssetTablePage("left");
	});
	$("#turn-page-right").on("click", function() {
		changeAssetTablePage("right");
	});

	// Wait 1 second for Firebase to authenticate a current user if any before preparing forms
	setTimeout(startActivities, 1000);
	setInterval(function() {
		getPortfolioSnapshot(dashboardRefresh);
	}, 30000);
});
