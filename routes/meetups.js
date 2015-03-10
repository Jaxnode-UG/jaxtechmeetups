var https = require('https'),
	events = "",
	groups = "",
	cache = require('memory-cache'),
	fs = require('fs'),
	path = require('path');

var httpsOptions = {
	hostname: 'api.meetup.com',
	port: 443,
	path: '/2/open_events?&key=71453431395662501f61504236216c32&sign=true&category=34&zip=32246&radius=25&page=50',
	method: 'GET'
};

var options = {
  hostname: 'api.meetup.com',
  port: 443,
  path: '/2/groups?&sign=true&zip=32246&category_id=34&radius=25&page=50&key=71453431395662501f61504236216c32',
  method: 'GET'
};

// Meetup API is adding witches to feed. Non-technical and needs to be removed.
function removeWitchesFromArray(meetupArray) {
	return meetupArray.filter(function (el) { return el.group.name !== "Jacksonville Witches"});
}

exports.events = function(req, res) {
	var cEvents = cache.get('events');
	if (cEvents !== null)
	{
		console.log('Cached Events ran');
		res.render('events', { title: 'Events', eventArray: cEvents });
	} else {
		var sreq = https.request(httpsOptions, function (response) {
			response.setEncoding('utf8');
			response.on('data', function (chunk) {
				console.log('receiving data.');
				events += chunk;
			});
			response.on('end', function() {
				console.log('request has ended.');
				console.log(process.cwd() + '/events.json');
				if (events && events.toString().slice(0, 6) !== '<html>' && events.toString().slice(0, 15) !== '<!DOCTYPE html>') {
					console.log('https Events ran');
					fs.writeFile(path.join(process.cwd(), 'events.json'), events, function (err) {
						if (err) 
							throw err;
					  console.log('It\'s saved!');
					});
					var eventsObject = JSON.parse(events);
					var cleanEventArray = removeWitchesFromArray(eventsObject.results);
					cache.put('events', cleanEventArray, 3600000);
					events = "";
					res.render('events', { title: 'Events', eventArray: cleanEventArray });
				} else {
					events = "";
					fs.readFile(path.join(process.cwd(), 'events.json'), function (err, data) {
						var eventsObject = {};
						if (err) {
							console.log(err);
							eventsObject.results = [];
							res.render('events', { title: 'Events', eventArray: eventsObject.results });
						} else {
							console.log('file based Events ran');
							eventsObject = JSON.parse(data);
							var cleanEventArray = removeWitchesFromArray(eventsObject.results);
							cache.put('events', cleanEventArray, 3600000);
							res.render('events', { title: 'Events', eventArray: cleanEventArray });
						}
					});
				}
			});
		});
		sreq.on('error', function(e) {
			console.log('problem with request: ' + e.message);
		});
		sreq.write('data\n');
		sreq.end();
	}
};

exports.groups = function (req, res) {
	var cGroups = cache.get('groups');
	if (cGroups !== null)
	{
		res.render('groups', { title: 'Groups', groupArray: cGroups });
	} else {
		var greq = https.request(options, function (response) {
			response.setEncoding('utf8');
			response.on('data', function (chunk) {
				console.log('receiving data.');
				groups += chunk;
			});
			response.on('end', function() {
				console.log('request has ended.');
				if (groups.toString().slice(0, 6) !== '<html>') 
				{
					var groupsObject = JSON.parse(groups);
					cache.put('groups', groupsObject.results, 3600000);
					groups = "";
					res.render('groups', { title: 'Groups', groupArray: groupsObject.results });
				} else {
					var groupsObject = {};
					groupsObject.results = [];
					res.render('groups', { title: 'Groups', groupArray: groupsObject.results });
				}
			});
		});
		greq.on('error', function(e) {
			console.log('problem with request: ' + e.message);
		});
		greq.write('data\n');
		greq.end();
	}
};