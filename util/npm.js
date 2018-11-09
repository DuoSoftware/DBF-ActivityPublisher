const config = require('config'),
  NPMRegistryClient = require('npm-registry-client');

const publish = () => {

  if (!config.NPM) { Promise.reject(new Error('')); }

  const npmRegClient = new NPMRegistryClient(),
    npmConfig = config.NPM;

  let 
    auth = {
      username: npmConfig.usename, 
      password: npmConfig.password,
      email: npmConfig.email,
      alwaysAuth: true },
    access = access || 'public';

  return new Promise((resolve, reject) => {
    npmRegClient.publish(npmConfig.registryUrl, {auth, access}, (err, result) => {
      if(err) { reject(err); }
      resolve(result);
    });
  });

  // npmRegClient.publish(npmConfig.registryUrl, {
  //   auth: {
  //     username: 'binaa',
  //     password: 'tc1dabest',
  //     email: 'binara.goonawardana@gmail.com',
  //     alwaysAuth: true
  //   },
  //   body: fs.createReadStream('./coolstuffbina.tar.gz'),
  //   access: 'public',
  //   metadata: {name: 'coolstuffbina', version: '1.0.0'}
  // }, (err, result) => {
  //   console.log('err', err);
  //   console.log('result', result);
  // });
}

const unpublish = (package_name, ver) => {
  if (!config.NPM) { Promise.reject(new Error('')); }

  const npmRegClient = new NPMRegistryClient(),
    npmConfig = config.NPM;

  let
    auth = {
      username: npmConfig.usename, 
      password: npmConfig.password,
      email: npmConfig.email,
      alwaysAuth: true
  }

   let version = ver? ver: "";

  return new Promise((resolve, reject) => {
    npmRegClient.unpublish(`${npmConfig.registryUrl}/${package_name}`, {auth, version}, (err, result) => {
      if(err) { reject(err); }
      resolve(result);
    });
  });
  
};

module.exports = {
  publish,
  unpublish
};