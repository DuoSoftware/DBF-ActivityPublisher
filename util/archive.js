const fs = require('fs'), 
  unzip = require('unzip');
  
class Archive {
  constructor(format) {
    const allowedArchiveFormats = ['zip', 'tar'];
    
    if (!format || !allowedArchiveFormats.includes(format)) {
      throw new Error('Not supported archive format.');
    }

    this.format = format;
  }
  
  create() {}

  extract(srcpath, destpath) {
    if (srcpath && destpath) {
      if(this.format === 'zip') {
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
      }
    }else {
      return Promise.reject("Invalid values provided for parameters.")
    }
  }

}

module.exports = Archive;