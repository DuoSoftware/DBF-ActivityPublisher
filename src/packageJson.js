const fs = require('fs'),
  { FileSystemOps } = require('../util');

class Packagejson {
  constructor(path) {
    this.pkgjsonPath = path.endsWith('package.json')? path: `${path}/package.json`;
    this.body = null;
    this.valid = false;

    if (!FileSystemOps.isFileExists(this.pkgjsonPath)) {
      throw new Error(`No package.json found in provided path. Please Make sure to archive only the files/folders without creating a root directory`);
    }

    try {
      let pkgJSONContent = fs.readFileSync(this.pkgjsonPath).toString();
      this.body = JSON.parse(pkgJSONContent);
      this.valid = true;
    } catch (err) {
      throw err;      
    }
  }

  get(key) {
    if(this.body && this.body[key]) {
      return this.body[key];
    }else {
      throw new Error('Invalid package json data or key values.');
    }
  }

  getBody() {
    if(this.body)
      return this.body
    else
      throw Error();
  }
}

module.exports = Packagejson;