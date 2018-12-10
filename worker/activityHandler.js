const async = require('async'),
	errors = require('restify-errors'), {
		RequestOps,
		NPM,
	} = require('../util'),
	ActivityPackageParser = require('../src/activityPackageParser'),
	BotService = require('../lib/BotService'),
	DbHandler = require('../Functions/DbHandler'),
	sendNotification = require('../Functions/NotificationHandler').sendNotification;

const publish = (req, res, next) => {

	let user = req.user,
		activityPkg = req.activity_package,
		authToken = RequestOps.parseToken(req);

	try {
		let apParser = new ActivityPackageParser(activityPkg.name, activityPkg.srcpath);
		let activity = apParser.parse();

		// publish activity to npm registry
		NPM.publish(activity, false)
			.then((npm_module) => {
				console.log(`${npm_module.name}, version ${npm_module.version} has been published.`);
				
				let activityObj = {
					"activity_name": activity.name,
					"npm_module" : `${npm_module.name}`,
					"npm_version" : `${npm_module.version}`};
					
				// update npm module releated details of activity in activity registry
				return BotService.updateActivity(activityObj, user.tenant, user.company, authToken);
			})
			.then(() => {
				console.log(`The ${activity.name} activity record has been updated with npm module info.`);

				// retrieve all pod(server) info of user
				return BotService.getAllServerRegistries(user.tenant, user.company, authToken);
			})
			.then((registries) => {
				console.log(`Retrieve users all pod(server) details`);

				if (registries && registries.length) {
					let serversToStart = registries.map((registry) => {
						return BotService.runActivity(registry.remoteUrl, user.tenant, user.company, authToken);
					});

					// deploy and run created activity in each of the pod(server) 
					return Promise.all(serversToStart);
				} else {
					return Promise.reject(new Error('No server registries found.'));
				}
			})
			.then(() => {
				res.send({success: true, message: `The ${activity.name}, version ${activity.version} published successfully.`});
				next();
			})
			.catch((err) => {
				res.send({success: false, message: err.message});
				next();
			});
	} catch (err) {
		return next(new errors.BadRequestError(err.message));
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
		function (callback) {
			DbHandler.DeleteMarketplacePublic(req, (response) => {
				if (JSON.parse(response).IsSuccess === 'true' || JSON.parse(response).IsSuccess === true) {
					console.log(response);
					callback(null, response);
				} else {
					callback(response, null);
				}

			});

		},
		async function (arg1, callback) {


				try {
					let res = await NPM.unpublish(req.body.activity_name, req.body.activity_version)
					callback(null, res);
				} catch (err) {
					callback(err, null);
					//throw new Error(400);

				}


			},
			function (arg1, callback) {
				sendNotification(req.user.company, {}, req.headers.Authorization, (response) => {
					if (response.IsSuccess === 'true' || response.IsSuccess === true) {
						console.log(response);
						callback(null, response);
					} else {
						callback(response, null);
					}
				});
			}
	], function (err, result) {
		if (err) {
			res.send({
				"IsSuccess": false,
				"message": "UnPublished Failed"
			});
		} else {
			res.send({
				"IsSuccess": true,
				"message": "UnPublished Succeeded"
			});

		}

	});


}

const versionUpdate = (req, res) => {

	/*
	 Done :
	 - Async Waterfall
	 - 1. get from DB
	 - 2. Send Notification
	 */

	async.waterfall([
		function (callback) {
			DbHandler.getEntriesByActivity(req, (response) => {
				if (JSON.parse(response).IsSuccess === 'true' || JSON.parse(response).IsSuccess === true) {
					//console.log(response);
					callback(null, JSON.parse(response).Result);
				} else {
					callback(response, null);
				}

			});

		},
		function (users, callback) {

	    //let success = [];
	    //let error = [];
            for (let i in users) {
                if(users.hasOwnProperty(i)){
                    (function(user) {
                        console.log(user);

                        let data = {
                            "notification" : "Version Update",
                            "data" : {
                                "message"  : `${req.params.id} has been updated to ${req.params.ver}, please update now`
                            }
                        };
                        sendNotification(user.company, data, req.headers.authorization, (response) => {
                            if (response.IsSuccess === 'true' || response.IsSuccess === true) {
                                //console.log(response);
                                //callback(null, response);
                                //success.push(response)
                            } else {
                                //callback(response, null);
                                //error.push(response)
                            }
                        });

                        if(users.length-1 === parseInt(i)){
                            callback(null, "Done");
                        }
                    })(users[i]);
                }

            }





		}
	], function (err, result) {
		if (err) {
			res.send({
				"IsSuccess": false,
				"message": "UnPublished Failed"
			});
		} else {
			res.send({
				"IsSuccess": true,
				"message": "UnPublished Succeeded"
			});

		}

	});


};

const installPublic = (req, res) => {

	/*
	 Done :
	 - Async Waterfall
	 - 1. get from DB
	 - 2. Send Notification
	 */

	async.waterfall([
		function (callback) {
			DbHandler.GetMarketplacePublic(req, (response) => {
				if (JSON.parse(response).IsSuccess === 'true' || JSON.parse(response).IsSuccess === true) {
					//console.log(response);
					callback(null, JSON.parse(response));
				} else {
					callback(response, req, null);
				}

			});

		},
		function (arg1, callback) {

			let result = arg1.Result;
			if (result.hasOwnProperty('_id')) {
				delete result['_id']
			}
			DbHandler.SaveAnPublicActivity(result, req, (response) => {
				if (JSON.parse(response).IsSuccess === 'true' || JSON.parse(response).IsSuccess === true) {
					//console.log(response);
					callback(null, JSON.parse(response));
				} else {
					callback(response, null);
				}

			});
		},
        function (arg1, callback) {

            let data = {
                "notification" : "Installed to Public",
                "data" : arg1
            };
            sendNotification(req.user.company, data, req.headers.authorization, (response) => {
                if (response.IsSuccess === 'true' || response.IsSuccess === true) {
                    console.log(response);
                    callback(null, response);
                } else {
                    callback(response, null);
                }
            });
        }
	], function (err, result) {
		if (err) {
			res.send({
				"IsSuccess": false,
				"message": "Public Activity Install Failed"
			});
		} else {
			//console.log(result)
			res.send({
				"IsSuccess": true,
				"message": "Public Activity Install Succeeded"
			});

		}

	});


};

module.exports = {
	publish,
	unpublish,
	versionUpdate,
	installPublic
}