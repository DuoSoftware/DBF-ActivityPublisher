const parseToken = (req) => {
	if (req.headers.authorization && req.headers.authorization.split(' ')[0].toLowerCase() === 'bearer') {
		return req.headers.authorization.split(' ')[1];
	} else if (req.params && req.params.Authorization) {
		return req.params.Authorization;
	} else if (req.query && req.query.Authorization) {
		return req.query.Authorization;
	}
	return null;
}

module.exports = {
  parseToken
}