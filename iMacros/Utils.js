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

function getRowsCount(tableId, defaultValue) {
	var tableElement = content.document.getElementById(tableId);
	if (tableElement !== null) {
		var rowCount = tableElement.rows.length;
		if (rowCount > 0 && rowCount !== 1) {
			return rowCount;
		}
		if (rowCount == 1) {
			// sometimes first table row is hidden
			var row = tableElement.rows[0];
			var column = row.getElementsByTagName('td')[0];
			if (column.getAttribute('style') === 'display: none;') {
				if (typeof(defaultValue) !== 'undefined') {
					return defaultValue;
				}
				return 0;
			} else {
				return 1;
			}
		}
	}
	if (typeof(defaultValue) !== 'undefined') {
		return defaultValue;
	}
	return -1;
}