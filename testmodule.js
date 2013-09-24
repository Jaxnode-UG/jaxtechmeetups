var repo = require('./repo/meetup.js');

function print(results)
{
	console.log(results);
}

console.log('Begin test');

repo.events(print);


console.log('End test');

//results.results.forEach(function(i) {
//	console.log('Event URL: ' + i.event_url);
//	var ticktime = i.time;
//	var meetingTime = new Date(ticktime);
//	console.log('Date and Time ' + meetingTime.getMonth() + '/' + meetingTime.getDate() + '/' + meetingTime.getFullYear() + ' at ' + meetingTime.getHours() + ':' + meetingTime.getMinutes())
//});