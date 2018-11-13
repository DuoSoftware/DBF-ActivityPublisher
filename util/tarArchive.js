const tar = require('tar');
  
class TarArchive {
  constructor() {}
  
  create(srcpathList, destpath, enableGZip=false) {
    if (!Array.isArray(srcpathList) || !srcpathList.length) {
      return Promise.reject(new Error())
    }

    return tar.c({
      gzip: enableGZip,
      file: destpath
    },
    srcpathList
    );
  }

  extract(srcpath, destpath) {

  }

}

module.exports = TarArchive;