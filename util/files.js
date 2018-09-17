const fs = require('fs'),
  { spawn } = require('child_process'),
  path = require('path'),
  unzip = require('unzip');

const getExtension = (filename) => {
  let ext = path.extname(filename || '').split('.');
  return ext[ext.length - 1];
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

    const copy = spawn('cp', cpOpts);
    // copy.on('exit', (code, signal) => {
    //   console.log(`code:${code}`);
    // });

    copy.stderr.on('data', (data) => {
      console.log(`stderr:\n${data}`);
    });

    copy.stdout.on('data', (data) => {
      console.log(`stdout:\n${data}`)
    });
  }
}

const extractZip = (filepath, targetpath) => {
  if (filepath && targetpath) {
    fs.createReadStream(filepath)
      .pipe(unzip.Extract({ path: targetpath }));
  }else {
    throw new Error('Source file path and output path required inorder to extract the zip file');
  }
}

module.exports = {
  getExtension,
  extractZip,
  ensureDirExists,
  copyFiles,
}