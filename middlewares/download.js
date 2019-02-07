const https = require('https'),
  fs = require('fs'),
  config = require('config'),
  errors = require('restify-errors'),
  unzip = require('unzip');

const download = (url, destpath) => {
  console.log(`Activity bundle is starting to download from ${url}`);

  return new Promise((resolve, reject) => {
    let filepath = `${destpath}/${Date.now()}/`;

    https.get(url, (res) => {
      if (res.statusCode !== 200) {
        fs.unlink(filepath);
        reject('Error getting while downloading the activity bundle.');
      }

      switch (res.headers['content-type']) {
        case 'application/zip':
        case 'application/x-zip-compressed':
          res.pipe(unzip.Extract({
              path: `${filepath}`
            }))
            .on('close', () => {
              console.log(`Activity bundle successfully downloaded.`);
              resolve(filepath);
            })
            .on('error', (err) => {
              console.log(err);
              reject('Error getting while extrating the downloaded activity bundle.');
            })
          break;
        default:
          break;
      }

    }).on('error', (err) => {
      console.log(err);
      reject('Error getting while making a request for download activity bundle.');
    })
  });
}

module.exports = (options) => {
  return (req, res, next) => {

    let opts = Object.create(options) || {};

    if (!req.body || !req.body['url']) {
      return next(new errors.BadRequestError('No url to process.'));
    }

    opts.destpath = (options.destpath && options.destpath.length) ? options.destpath :
      (config.Uploads.outputpath) ? config.Uploads.outputpath :
      './';

    let downloadLink = req.body['url'];

    download(downloadLink, opts.destpath)
      .then((downloaded_path) => {
        req['activity_package'] = {
          srcpath: `${downloaded_path}`
        };

        next();
      })
      .catch((err) => {
        return next(new errors.BadRequestError(err));
      })
  }
}