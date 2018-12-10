const restify  = require('restify'),
  restifyCORS = require('restify-cors-middleware'),
  config = require('config'),
  jwt = require('restify-jwt'),
  secret = require('dvp-common-lite/Authentication/Secret.js'),
  uploads = require('./middlewares/uploads'),
  activityHandler = require('./worker/activityHandler');
  authorization = require('dvp-common-lite/Authentication/Authorization.js'),
  MongooseConnection = new require('dbf-dbmodels/MongoConnection');

let connection  = new MongooseConnection();

const port = (config.Host)? config.Host.port: 3000;

const server = restify.createServer({
  name: 'Activity Publisher',
  version: "1.0.3"
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
    'maxSize': 100, // MB
    'unloadTo': ''
}), activityHandler.publish);

server.post('/activity/unpublish/:id', authorization({
    resource: "user",
    action: "read"
}), activityHandler.unpublish);

server.get('/activity/versionUpdate/:id/:ver', authorization({
    resource: "user",
    action: "read"
}), activityHandler.versionUpdate);

server.get('/activity/installPublicActivity/:id', authorization({
    resource: "user",
    action: "read"
}), activityHandler.installPublic);

process.on('unhandledRejection', (err) => { 
  console.error(err)
  process.exit(1)
});

server.listen(port, () => {
  console.log(`${server.name} listening at ${server.url}`);
});
