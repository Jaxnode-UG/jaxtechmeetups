

var DocumentClient = require('documentdb').DocumentClient;

var host = process.env.DOCUMENTDB_URL; 
var masterKey = process.env.DOCUMENTDB_KEY; // Add the massterkey of the endpoint

var client = new DocumentClient(host, {masterKey: masterKey});
var databaseDefinition = { id: "fekkedatabase" };
var collectionDefinition = { id: "tokens" };
var databaseId = "fekkedatabase";
var collectionId = "tokens";

exports.addiOSToken = function(req, res) {
	console.log(req.body.id);
	readOrCreateDatabase(function (database) {
	    readOrCreateCollection(database, function (collection) {
			var documentDefinition = { id: req.body.id, type: "ios" };
			client.queryDocuments(collection._self, 'SELECT * FROM tokens t WHERE t.id = "' + req.body.id + '"').toArray(function (err, docs) {
				if (err) {
					throw (err);
				}
				if (docs.length == 0)
				{
					client.createDocument(collection._self, documentDefinition, function(err, document) {
						if(err) return console.log(err);

						console.log('Created Document with content: ', document.id);
						res.send({ id: document.id, type: document.type });
					});
				} else {
					res.send({ msg: "Document already exists" });
				}
			});
		});
	});
}; 

exports.addAndroidToken = function(req, res) {
	res.send('Success');
};

exports.getAllTokens = function(req, res) {
	readOrCreateDatabase(function (database) {
	    readOrCreateCollection(database, function (collection) {
			client.queryDocuments(collection._self, 'SELECT * FROM tokens t WHERE t.type = "ios"').toArray(function (err, docs) {
				if (err) {
					throw (err);
				}
				res.render('tokens', { title: 'Events', items: docs });
			});
		});
	});
};

function readOrCreateDatabase(callback) {
    client.queryDatabases('SELECT * FROM root r WHERE r.id="' + databaseId + '"').toArray(function (err, results) {
        if (err) {
            // some error occured, rethrow up
            throw (err);
        }
        if (!err && results.length === 0) {
            // no error occured, but there were no results returned 
            // indicating no database exists matching the query            
            client.createDatabase({ id: databaseId }, function (err, createdDatabase) {
                callback(createdDatabase);
            });
        } else {
            // we found a database
            callback(results[0]);
        }
    });
}

function readOrCreateCollection(database, callback) {
    client.queryCollections(database._self, 'SELECT * FROM root r WHERE r.id="' + collectionId + '"').toArray(function (err, results) {
        if (err) {
            // some error occured, rethrow up
            throw (err);
        }           
        if (!err && results.length === 0) {
            // no error occured, but there were no results returned 
            //indicating no collection exists in the provided database matching the query
            client.createCollection(database._self, { id: collectionId }, function (err, createdCollection) {
                callback(createdCollection);
            });
        } else {
            // we found a collection
            callback(results[0]);
        }
    });
}