// const _ = require('lodash');

// module.exports = _.extend({}, require('./files'), require('./s3'));

module.exports = {
  FileSystemOps: require('./filesystemOps'),
  RequestOps: require('./requestOps'),
  NPM: require('./npm'),
  S3: require('./s3'),
  ZipArchive: require('./zipArchive'),
  TarArchive: require('./tarArchive')
}