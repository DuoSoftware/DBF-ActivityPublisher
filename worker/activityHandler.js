const async = require('async'),
  { NPM, TarArchive } = require('../util'),
  ActivityPackageParser = require('../src/activityPackageParser'),
  BotService = require('../lib/BotService'),
  DbHandler = require('../Functions/DbHandler'),
  sendNotification = require('../Functions/NotificationHandler').sendNotification;

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

  let user = req.user, 
    activityPackage = req.activity_package;

  try {
    let apParser = new ActivityPackageParser(activityPackage.srcpath);
    let activity = apParser.parse();

    let tar = new TarArchive();
    tar.create([`${activity.srcpath}/`], `${activity.srcpath}/${activityPackage.filename}.tgz`, true)
      .then(() => {
        activity['tarball'] = `${activity.srcpath}/${activityPackage.filename}.tgz`;
        NPM.publish(activity).then((result) => {
          BotService.updateActivity({
            "insertOrUpdate": "update",
            "activity_name": activity.name,
            "npm_module" : `@smoothflow/${activity.name}`,
            "npm_version" : `${activity.version}`
          },user.tenant, user.company, getToken(req)).then((result) => {
            console.log()
          }).catch((err) => {
            console.log(err)
          })
          res.send();
        }).catch((err) => {
          console.log(err);
        })
      }).catch((err) => {
        console.log(err)
      });
  } catch (error) {
    return next(error);
  }
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
          DbHandler.DeleteMarketplacePublic(req, (response)=>{
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
          let res = await NPM.unpublish(req.body.activity_name, req.body.activity_version)
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


}

const versionUpdate = (req, res) => {

  /*
   Done :
   - Async Waterfall
   - 1. get from DB
   - 3. Send Notification
   */

  async.waterfall([
      function(callback) {
          DbHandler.getEntriesByActivity(req, (response)=>{
              if(JSON.parse(response).IsSuccess === 'true' || JSON.parse(response).IsSuccess === true){
                  console.log(response);
                  callback(null, JSON.parse(response));
              }
              else{
                  callback(response, null);
              }

          });

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

const installPublic = (req, res) => {

  /*
   Done :
   - Async Waterfall
   - 1. get from DB
   - 3. Send Notification
   */

  async.waterfall([
      function(callback) {
          DbHandler.GetMarketplacePublic(req, (response)=>{
              if(JSON.parse(response).IsSuccess === 'true' || JSON.parse(response).IsSuccess === true){
                  //console.log(response);
                  callback(null, JSON.parse(response));
              }
              else{
                  callback(response, req, null);
              }

          });

      },
      function(arg1, callback) {

          let result = arg1.Result;
          if(result.hasOwnProperty('_id')){
              delete result['_id']
          }
          DbHandler.SaveAnPublicActivity(result, req, (response)=>{
              if(JSON.parse(response).IsSuccess === 'true' || JSON.parse(response).IsSuccess === true){
                  //console.log(response);
                  callback(null, JSON.parse(response));
              }
              else{
                  callback(response, null);
              }

          });
      }
  ], function (err, result) {
      if(err){
          res.send({"IsSuccess": false, "message": "Public Activity Install Failed"});
      }
      else{
          //console.log(result)
          res.send({"IsSuccess": true, "message": "Public Activity Install Succeeded"});

      }

  });


};

module.exports = {
  publish,
  unpublish,
  versionUpdate,
  installPublic
}
