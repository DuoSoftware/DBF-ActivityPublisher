const restify  = require('restify'),
  config = require('config'),
  jwt = require('restify-jwt'),
  secret = require('dvp-common-lite/Authentication/Secret.js'),
  uploads = require('./middlewares/uploads'),
  activity = require('./worker/activity'),
  authorization = require('dvp-common-lite/Authentication/Authorization.js');

const MongooseConnection = new require('dbf-dbmodels/MongoConnection');
let connection  = new MongooseConnection();




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

const port = (config.Host)? config.Host.port: 3000;

const server = restify.createServer({
  name: 'Activity Publisher',
  version: "1.0.1"
});

server.use(restify.plugins.bodyParser({
    mapParams:true
}));

server.use(jwt({secret: secret.Secret}));

server.post('/activity/publish', jwt({secret: secret.Secret, getToken: getToken}), uploads('uploadedFiles', {
    'allowedExts': ['zip'],
    'maxSize': 100000000000000000000,
    'unloadTo': ''
  }), activity.publish);


server.post('/activity/unpublish/:id', authorization({
    resource: "user",
    action: "read"
}), activity.unpublish);

server.post('/activity/versionUpdate/:id', authorization({
    resource: "user",
    action: "read"
}), activity.versionUpdate);

server.listen(port, () => {
  console.log(`${server.name} listening at ${server.url}`);
});
