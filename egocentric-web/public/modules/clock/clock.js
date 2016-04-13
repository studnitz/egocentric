function updateClock() {
	var date    = new Date();
	var hours   = date.getHours();
	var minutes = date.getMinutes();

	var hourAngle   = ((hours * 30) + (minutes / 2)) % 360;
	var minuteAngle = ((minutes * 6)) % 360;

	document.getElementById('hourHand').style.transform = 'rotateZ('+hourAngle+'deg)';
	document.getElementById('hourHand').style.webkitTransform = 'rotateZ('+hourAngle+'deg)';
	document.getElementById('minuteHand').style.transform = 'rotateZ('+minuteAngle+'deg)';
	document.getElementById('minuteHand').style.webkitTransform = 'rotateZ('+minuteAngle+'deg)';
}
updateClock();
setInterval(updateClock, 10000);