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

module.exports = {
  parseFileName,
  isFileExists,
  ensureDirExists,
}