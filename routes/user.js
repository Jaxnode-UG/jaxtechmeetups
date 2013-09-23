
/*
 * GET users listing.
 */

exports.list = function(req, res){
  res.send("respond with a resource");
};

exports.coll = function(req, res) {
	var myItems = [1, 4, 9];
	res.render('collection', { myArray: myItems });
};