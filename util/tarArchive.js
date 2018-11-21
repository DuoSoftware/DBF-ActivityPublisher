const tar = require('tar'),
  fs = require('fs');

class TarArchive {
  constructor() {}

    create(srcpathList, destpath, enableGZip=false) {
      if (!Array.isArray(srcpathList) || !srcpathList.length) {
        throw new Error();
      }

      return tar.c({ gzip: enableGZip, file: destpath}, srcpathList)
        .then(() => {
          return destpath;
        }) 
        .catch(() => {
          return null;
        })
  }

  extract(srcpath, destpath) {

  }

}

module.exports = TarArchive;