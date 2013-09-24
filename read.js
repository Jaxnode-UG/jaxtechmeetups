var http = require('http'),
	https = require('https'),
	groups = "",
	events = "";
//var cache = require('memory-cache');

var options = {
  hostname: 'api.meetup.com',
  port: 80,
  path: '/find/groups?zip=32246&page=50&sig_id=6582383&radius=50&category=34&sig=0e3a9caa46d2d3bc06ac86e5e987572edeceea1c',
  method: 'GET'
};

var req = http.request(options, function(res) {
  	console.log('STATUS: ' + res.statusCode);
  	//console.log('HEADERS: ' + JSON.stringify(res.headers));
  	res.setEncoding('utf8');
  	res.on('data', function (chunk) {
    	//console.log('BODY: ' + chunk);
		groups += chunk;
  	});
	res.on('end', function() {
		var groupObject = JSON.parse(groups);
		//cache.put('groups', groupObject, 5000);
		console.log('Count of groups: ' + groupObject.length);
		setTimeout(function() {
			//var myGroups = cache.get('groups');
			for (var i = 0; i < groupObject.length; i++) {
				console.log(groupObject[i].name);
			}
		}, 500)
		
	});
});

req.on('error', function(e) {
  console.log('problem with request: ' + e.message);
});

// write data to request body
req.write('data\n');
req.write('data\n');
req.end();

var httpsOptions = {
	hostname: 'api.meetup.com',
	port: 443,
	path: '/2/open_events?&key=71453431395662501f61504236216c32&sign=true&category=34&zip=32246&radius=25&page=50',
	method: 'GET'
};
var sreq = https.request(httpsOptions, function (res) {
	console.log('STATUS', + res.statusCode);
	res.setEncoding('utf8');
	res.on('data', function (chunk) {
		events += chunk;
	});
	res.on('end', function() {
		var eventsObject = JSON.parse(events);
		console.log('Length of events: ' + eventsObject.results.length);
		//console.log(events);
		eventsObject.results.forEach(function(i) {
			console.log('Event URL: ' + i.event_url);
			var ticktime = i.time;
			var meetingTime = new Date(ticktime);
			console.log('Date and Time ' + meetingTime.getMonth() + '/' + meetingTime.getDate() + '/' + meetingTime.getFullYear() + ' at ' + meetingTime.getHours() + ':' + meetingTime.getMinutes())
		});
	});
});

sreq.on('error', function(e) {
  console.log('problem with request: ' + e.message);
});

sreq.write('data\n');
sreq.end();