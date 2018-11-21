const path = require('path'),
  { FileSystemOps, TarArchive } = require('../util'),
  PackageJSON = require('./packageJson');

class ActivityPackageParser {
  constructor(pkgname, pkgpath) {
    if (pkgname && typeof pkgpath === 'string' && pkgpath.length) {
      this.bundle_name = pkgname;

      let abPkgPath = path.resolve(pkgpath);
      if(FileSystemOps.isFileExists(abPkgPath)) {
        this.bundle_path = abPkgPath;
      }else {
        throw new Error(`No such package found in provided file path`);
      }

    }else {
      throw new Error(`ActivityPackageParser initiating with invalid parameters.`);
    }
  }
  
  parse() {
    
    // load package.json
    let packagejson_path = `${this.bundle_path}/package.json`,
      pkgjson = new PackageJSON(packagejson_path),
      pkgjsonBody = pkgjson.getBody();

    if (pkgjson.valid) {
      let entryfile_path = `${this.bundle_path}/${pkgjsonBody['main']}`;

      // check entry file exists
      if(!FileSystemOps.isFileExists(entryfile_path)) {
        throw new Error(`No entry file(${pkgjsonBody['main']}) found in activity. Please Make sure to archive only the files/folders without creating a root directory`);
      }

      let entry = require(entryfile_path);

      if (entry.currentVersion !== pkgjsonBody.version) { 
        throw new Error(
          `Activity version does not match. Both ${pkgjsonBody['main']} and package.json should contain same version`
        );
      }

      if (entry.activityName !== pkgjsonBody.name) {
        throw new Error(
          `Activity name does not match. Both ${pkgjsonBody['main']} and package.json should contain same name`
        );
      }

      let activityConfig = {
        name: pkgjsonBody['name'],
        version: pkgjsonBody['version'],
        srcpath: `${this.bundle_path}`,
      }

      return activityConfig;
    }
  }

}

module.exports = ActivityPackageParser;
