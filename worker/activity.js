const  async = require('async');
const DeleteMarketplacePublic = require('../Functions/DbHandler').DeleteMarketplacePublic;
const sendNotification = require('../Functions/NotificationHandler').sendNotification;
const deleteFromNpm = require('../util/npm').unpublish;

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



const unpublish = (req, res) => {

    /*
    Done :
    - Async Waterfall
    - 1. Delete from DB
    - 2. Delete from NPM
    - 3. Send Notification
     */

    async.waterfall([
        function(callback) {
            DeleteMarketplacePublic(req, (response)=>{
                if(JSON.parse(response).IsSuccess === 'true' || JSON.parse(response).IsSuccess === true){
                    console.log(response);
                    callback(null, response);
                }
                else{
                    callback(response, null);
                }

            });

        },
        async function(arg1, callback) {


        try{
            let res = await deleteFromNpm(req.body.activity_name, req.body.activity_version)
            callback(null, res);
        }
        catch (err) {
            callback(err, null);
            //throw new Error(400);

        }


        },
        function(arg1, callback) {
            sendNotification(req, (response)=>{
                if(response.IsSuccess === 'true' || response.IsSuccess === true){
                    console.log(response);
                    callback(null, response);
                }
                else{
                    callback(response, null);
                }
            });
        }
    ], function (err, result) {
        if(err){
            res.send({"IsSuccess": false, "message": "UnPublished Failed"});
        }
        else{
            res.send({"IsSuccess": true, "message": "UnPublished Succeeded"});

        }

    });


};

module.exports = {
  publish, unpublish
};