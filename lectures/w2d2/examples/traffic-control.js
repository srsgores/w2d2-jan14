function pingAirTrafficControl(interval) {
	return setInterval(() => {
		console.log("Paging Magic Airlines");
		return setTimeout(() => console.log("Roger, 10-4"), 1000);
	}, interval);
}