const shell = require('shelljs'),
  { spawn }  = require('child_process'),
  errors = require('restify-errors'),
  util = require('../util');

const publish = (req, res, next) => {
  let files = req.files['uploadedFiles'];


  const publish = spawn('sh', [`publish.sh`], {
    cwd: `${files.uploadedPath}`
  });

  // publish.stdout.on('data', (data) => {
  //   console.log(`stdout:\n${data}`);
  // });

  // publish.stderr.on('data', (data) => {
  //   console.log(`stderr:\n${data}`);
  // });


  // shell.exec('./smoothflow-activity-template/vat.sh', function(code, stdout, stderr) {
  //   console.log('Exit code:', code);
  //   console.log('Program output:', stdout);
  //   console.log('Program stderr:', stderr);
  // });

  // util.uploadToS3Bucket(files.uploadedFiles.path);
  // util.uploadToS3BucketCopy(files.uploadedFiles);

  res.send();
}

module.exports = {
  publish
}