var https = require('https'),
	events = "";

var httpsOptions = {
	hostname: 'api.meetup.com',
	port: 443,
	path: '/2/open_events?&key=71453431395662501f61504236216c32&sign=true&category=34&zip=32246&radius=25&page=50',
	method: 'GET'
};

exports.events = function(req, res) {
	var sreq = https.request(httpsOptions, function (response) {
		response.setEncoding('utf8');
		response.on('data', function (chunk) {
			console.log('receiving data.');
			events += chunk;
		});
		response.on('end', function() {
			console.log('request has ended.');
			var eventsObject = JSON.parse(events);
			console.log(eventsObject.results.length);
			//if (eventsObject.results !== 'undefined')
			//{
				res.render('events', { eventArray: eventsObject.results });
			//} else {
				//
			//}
		});
	});
	sreq.on('error', function(e) {
		console.log('problem with request: ' + e.message);
	});
	sreq.write('data\n');
	sreq.end();
};