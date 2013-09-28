
exports.page404 = function(req, res) {
	res.render('errors', { title: '404' });
};