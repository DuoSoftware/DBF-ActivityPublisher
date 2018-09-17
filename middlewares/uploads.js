const fs = require('fs'),
  config = require('config'),
  errors = require('restify-errors'),
  util = require('../util');

const inArray = (key, arr) => {
  if (Array.isArray(arr)) {
    return arr.findIndex((value) => {
      return (key === value);
    });
  } else { 
    return -1;
  }
}

module.exports = (field, options) => {

  return (req, res, next) => {

    if (!req.files || !req.files[field]) {
      return next(new errors.BadRequestError('No files to process.'));
    }

    let opts = Object.create(options) || {},
      files = req.files[field],
      ext = util.getExtension(files.name),
      size = files.size;

    opts.allowedExts = (Array.isArray(options.allowedExts) && options.allowedExts.length) ? options.allowedExts : "any";
    opts.maxSize = (typeof options.maxSize === "number") ? options.maxSize : 50000;
    opts.unloadTo = (options.unloadTo && options.unloadTo.length) ? options.unloadTo
      : (config.Uploads.outputpath) ? config.Uploads.outputpath 
      : './';

    if (opts.allowedExts !== "any" && inArray(ext, options.allowedExts) < 0) {
      return next(new errors.BadRequestError(`.${ext} file type not permitted for upload.`));
    }

    if (size > options.maxSize) {
      return next(new errors.BadRequestError(`The uploaded file likely exceeded the maximum file size.`));
    }

    try {
      let outputpath = `${opts.unloadTo}/${Date.now()}`;

      util.ensureDirExists(outputpath, 0744, (err, path) => {
        if (err)  { 
          return next(err); 
        } else {
          fs.createReadStream(files.path)
            .pipe(fs.createWriteStream(`${outputpath}/${files.name}`));

          util.copyFiles(['scripts/publish.sh', 'scripts/validate.sh'], outputpath);
          
          req.files[field]['uploadedPath'] = outputpath;
          next();
        }
      });
    } catch (err) {
      return next(new Error(err));
    }
    
  }
}