const fs = require('fs'),
  unzip = require('unzip');
  
class ZipArchive {
  constructor() {}
  
  create() {}

  extract(srcpath, destpath) {
    if (srcpath && destpath) {
      return new Promise((resolve, reject) => {
        try {
          fs.createReadStream(srcpath)
            .pipe(unzip.Extract({ path: destpath }))
            .on('close', () => { resolve(destpath); })
            .on('error', (err) => { reject(err); })
        } catch (err) {
          reject(err);
        }
      }); 
    }else {
      return Promise.reject("Invalid values provided for parameters.")
    }
  }

}

module.exports = ZipArchive;