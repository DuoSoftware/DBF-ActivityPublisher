const fs = require('fs'),
  { spawn } = require('child_process'),
  path = require('path'),
  unzip = require('unzip');

const parseFileName = (filename) => {
  let str = path.parse(filename || '');
  return {
    filename: str.name,
    ext: str.ext
  }
}

const isFileExists = (filepath) => {
  try {
    fs.accessSync(filepath, fs.constants.F_OK);
    return true;
  } catch (error) {
    return false;
  }
}

const ensureDirExists = (path, mask, cb) => {
  mask = mask || 0777;
  if (path && path.length) {
    fs.mkdir(path, mask, (err) => {
        if (err) {
          // ignore the error if the folder already exists
          if (err.code == 'EEXIST') { cb(null, path); }
          else { cb(err, undefined); }
        } else {
          // successfully created folder
          cb(null, path);
        } 
    });
  } else {
    cb(new Error('Invalid path name.'), undefined);
  }
}

const copyFiles = (srcfilesPaths, tagetpath) => {
  if (Array.isArray(srcfilesPaths) && srcfilesPaths.length) {
    let cpOpts = srcfilesPaths.slice(0, srcfilesPaths.length);
    cpOpts.push(tagetpath);

    const copy = spawn('cp', ['/home/DBF-ActivityPublisher/scripts/publish.sh', tagetpath]);

    copy.stderr.on('data', (data) => {
      console.log(`stderr:\n${data}`);
    });

    copy.stdout.on('data', (data) => {
      console.log(`stdout:\n${data}`)
    });
  }
}

const extractZip = (srcpath, destpath) => {
  if (srcpath && destpath) {
    return new Promise((resolve, reject) => {
      try {
        fs.createReadStream(srcpath)
          .pipe(unzip.Extract({ path: destpath }))
          .on('end', () => { resolve(destpath); })
          .on('error', (err) => { reject(err); })
      } catch (err) {
        reject(err);
      }
    }); 
  }else {
    Promise.reject(new Error('Source file path and output path required inorder to extract the zip file'));
  }
}

module.exports = {
  parseFileName,
  isFileExists,
  ensureDirExists,
  copyFiles,
  zip: {
    extract: extractZip,
  },
}