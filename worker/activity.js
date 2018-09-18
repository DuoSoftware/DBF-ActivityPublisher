const shell = require('shelljs'),
  { spawn }  = require('child_process'),
  errors = require('restify-errors'),
  util = require('../util');

const publish = (req, res, next) => {
  let files = req.files['uploadedFiles'];

  console.log(files.uploadedPath)

  const unzip = spawn('unzip', [`${files.name}`], {
    cwd: `${files.uploadedPath}`
  });

  unzip.stdout.on('data', (data) => {
    console.log(`unzip stdout:\n${data}`);
  });

  unzip.stderr.on('data', (data) => {
    console.log(`unzip stderr:\n${data}`);
  });

  // const publish = spawn('npm', ['publish'], {
  //   cwd: `${files.uploadedPath}/body-lang`
  // });

  // publish.stdout.on('data', (data) => {
  //   console.log(`publish stdout:\n${data}`);
  // });

  // publish.stderr.on('data', (data) => {
  //   console.log(`publish stderr:\n${data}`);
  // });

  res.send();
}

module.exports = {
  publish
}