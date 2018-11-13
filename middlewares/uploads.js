const config = require('config'),
  errors = require('restify-errors'),
  { FileSystemOps, ZipArchive } = require('../util');

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
      extMimeMap = {"application/zip":"zip", "application/x-tar":"tar"}
      files = req.files[field],
      {filename, ext} = FileSystemOps.parseFileName(files.name)
      mimeType = files.type;
      size = files.size;

    opts.allowedMimes = (Array.isArray(options.allowedMimes) && options.allowedMimes.length) ? options.allowedMimes : "any";
    opts.maxSize = (typeof options.maxSize === "number") ? options.maxSize : 50000;
    opts.unloadTo = (options.unloadTo && options.unloadTo.length) ? options.unloadTo
      : (config.Uploads.outputpath) ? config.Uploads.outputpath 
      : './';

    if (opts.allowedMimes !== "any" && inArray(mimeType, options.allowedMimes) < 0) {
      return next(new errors.BadRequestError(`.${ext} file type not permitted for upload.`));
    }

    if (size > options.maxSize) {
      return next(new errors.BadRequestError(`The uploaded file likely exceeded the maximum file size.`));
    }

    try {
      let outputpath = `${opts.unloadTo}/${Date.now()}/`;

      FileSystemOps.ensureDirExists(outputpath, 0744, (err, path) => {
        if (err)  { 
          return next(err); 
        } else {
          // let archive = new Archive(extMimeMap[mimeType]);
          outputpath += `${filename}`;
          let zip = new ZipArchive();
          zip
            .extract(files.path, outputpath)
            .then((extracted_path) => {
              req['activity_package'] = {
                filename,
                srcpath: `${extracted_path}`
              };
              next()
            })
            .catch((err) => {
              return next(new errors.BadRequestError(`The uploaded file unable to read. It may be corrupt.`));
            });
        }
      });
    } catch (err) {
      return next(new Error(err));
    }
    
  }
}