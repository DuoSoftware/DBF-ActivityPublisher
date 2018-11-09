const _ = require('lodash');


module.exports = _.extend({}, require('./files'), require('./s3'), require('./npm')) ;