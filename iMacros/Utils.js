
function getToday(plusDays) {
	var currentTime = new Date();
	var month = currentTime.getMonth() + 1;
	var day = currentTime.getDate() + plusDays;
	var year = currentTime.getFullYear();
	var date = day + "/" + month + "/" + year;
	return date;
}

function getDateWithFirstMonthDay() {
	var currentTime = new Date();
	var month = currentTime.getMonth() + 1;
	var day = currentTime.getDate();
	var year = currentTime.getFullYear();
	var date = "01" + "/" + month + "/" + year;
	return date;
}

