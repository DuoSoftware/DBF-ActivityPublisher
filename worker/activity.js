const { exec }  = require('child_process'),
  BotService = require('../lib/BotService');

const publish = (req, res, next) => {
  let files = req.files['uploadedFiles'];
  
  const publish2NPM = exec('sh publish.sh', {
    cwd: files.uploadedPath
  }, (err, stdout, stderr) => {
    if (err) {
      console.error(`exec error: ${err}`);
      return next(err);
    }

    console.log(`stdout: ${stdout}`);
    console.log(`stderr: ${stderr}`);
  
    BotService.getAllServerRegistries(1,17).then((registries) => {
      if (registries && registries.length) {
        
        let serversToStart = registries.map((registry) => {
          return BotService.runActivity(registry.remoteUrl, 1, 17)
        });
  
        Promise.all(serversToStart).then((servers) => {
          if (servers && servers.length) { 
            res.send({"success": true, "message": "WebServers Deployed Successfully."});
          } 
        }, (err) => {
          return next(err);
        });
        
      }
    }, (err) => {
      return next(err);
    });

  });
}

module.exports = {
  publish
}