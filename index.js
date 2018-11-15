const restify  = require('restify'),
  restifyCORS = require('restify-cors-middleware'),
  config = require('config'),
  jwt = require('restify-jwt'),
  secret = require('dvp-common-lite/Authentication/Secret.js'),
  uploads = require('./middlewares/uploads'),
  activityHandler = require('./worker/activityHandler'),
  authorization = require('dvp-common-lite/Authentication/Authorization.js'),
  MongooseConnection = new require('dbf-dbmodels/MongoConnection');

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
  version: "1.0.2"
});

const cors = restifyCORS({
  allowHeaders: ['authorization', 'Authorization'],
});

server.pre(cors.preflight);
server.use(cors.actual);
server.use(restify.plugins.bodyParser({mapParams:true}));
server.use(restify.plugins.queryParser({mapParams: true}));
server.use(jwt({secret: secret.Secret}));

server.post('/activity/publish', authorization({resource: "user", action: "read"}), uploads('uploadedFiles', {
    'allowedMimes': ['application/zip', 'application/x-zip-compressed'],
    'maxSize': 100000000000000000000,
    'unloadTo': ''
}), activityHandler.publish);

server.post('/activity/unpublish/:id', authorization({
    resource: "user",
    action: "read"
}), activityHandler.unpublish);

server.post('/activity/versionUpdate/:id', authorization({
    resource: "user",
    action: "read"
}), activityHandler.versionUpdate);

server.get('/activity/installPublicActivity/:id', authorization({
    resource: "user",
    action: "read"
}), activityHandler.installPublic);

server.listen(port, () => {
  console.log(`${server.name} listening at ${server.url}`);
});
