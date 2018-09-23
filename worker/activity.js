const { exec }  = require('child_process'),
  BotService = require('../lib/BotService');

const getToken = (req) => {
    if (req.headers.authorization && req.headers.authorization.split(' ')[0].toLowerCase() === 'bearer') {
        return req.headers.authorization.split(' ')[1];
    } else if (req.params && req.params.Authorization) {
        return req.params.Authorization;
    } else if (req.query && req.query.Authorization) {
        return req.query.Authorization;
    }
    return null;
}

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
  
    BotService.getAllServerRegistries(req.user.tenant, req.user.company, getToken(req)).then((registries) => {
      if (registries && registries.length) {
        
        let serversToStart = registries.map((registry) => {
          return BotService.runActivity(registry.remoteUrl, req.user.tenant, req.user.company, getToken(req))
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