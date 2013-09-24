var http = require('http'),
	groups = "";

var options = {
  hostname: 'api.meetup.com',
  port: 80,
  path: '/find/groups?zip=32246&page=50&sig_id=6582383&radius=50&category=34&sig=0e3a9caa46d2d3bc06ac86e5e987572edeceea1c',
  method: 'GET'
};



exports.events = function(callback) {
	var https = require('https'),
		events = "";
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
			//console.log(events);
			//if (eventsObject.results)
			//{
				callback(eventsObject.results.length);
			//} else {
			//	return [{event_url: 'nothing'}];
			//}
		});
	});
	sreq.write('data\n');
	sreq.end();
};

exports.groups = function() {
	var req = http.request(options, function(res) {
		res.setEncoding('utf8');
		res.on('data', function (chunk) {
			groups += chunk;
		});
		res.on('end', function() {
			var groupObject = JSON.parse(groups);
			return groups;
		});
	});

};
	