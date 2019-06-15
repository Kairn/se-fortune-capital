// Enable animation for quote tabs
let updateQuotes = function() {
	// Skip if the tabs are disabled
	if ($(this).hasClass("disabled") | $(this).find("span").hasClass("active")) {
		return;
	};
	// Locate the item that is clicked
	let panelID = $(this).attr("rel");
	let $panelTab = $(this).find("span");
	// Remove active status from the active tab
	$("#quote-panel span.active").removeClass("active");
	// Disable all tabs
	$("#quote-panel li").addClass("disabled");
	// Show and hide the quotes
	$("#intro-section").find("div.show").slideUp(1000, function() {
		$(this).removeClass("show").addClass("hide");
		$("#" + panelID).slideDown(1000, function() {
			$(this).removeClass("hide").addClass("show");
			$panelTab.addClass("active");
			$("#quote-panel li").removeClass("disabled");
		});
	});
};

// Wait until the document is ready for jQuery
$(function() {
	// Show banner header
	$("#first-h").slideDown(2000, function() {
		$("#second-h").slideDown(2000);
	});
	// Listen to user clicks on the quote panel
	$("#quote-panel li").on("click", updateQuotes);
});
