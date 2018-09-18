const restify  = require('restify'),
  config = require('config'),
  uploads = require('./middlewares/uploads'),
  activity = require('./worker/activity');

const port = (config.Host)? config.Host.port: 3000;

const server = restify.createServer({
  name: 'Activity Publisher',
  version: "1.0.1"
});

server.use(function (req, res, next) {
  // Website you wish to allow to connect
  res.setHeader('Access-Control-Allow-Origin', '*');

  next();
});

server.use(restify.plugins.bodyParser({mapParams:true}));

server.post('/activity/publish', uploads('uploadedFiles', {
    'allowedExts': ['zip'],
    'maxSize': 100000000000000000000,
    'unloadTo': ''
  }), activity.publish);

server.listen(port, () => {
  console.log(`${server.name} listening at ${server.url}`);
});
