const tar = require('tar'),
  fs = require('fs');

class TarArchive {
  constructor() {}

  create(srcpathList, destpath, enableGZip=false) {
    if (!Array.isArray(srcpathList) || !srcpathList.length) {
      throw new Error();
    }

    tar.c({ gzip: enableGZip, sync: true}, srcpathList)
      .pipe(fs.createWriteStream(destpath))
  }

  extract(srcpath, destpath) {

  }

}

module.exports = TarArchive;