const fs = require('fs'),
  config = require('config'),
  NPMRegistryClient = require('npm-registry-client');

const publish = (activity) => {

  if (!config.NPM) { Promise.reject(new Error('')); }

  const npmRegClient = new NPMRegistryClient(),
    npmConfig = config.NPM;

  let 
    auth = {
      username: npmConfig.username, 
      password: npmConfig.password,
      email: npmConfig.email,
      alwaysAuth: true },
    // access = access || 'public',
    // access = 'restricted',
    access = 'public',
    metadata = {
      // name: `@smoothflow/${activity.name}`,
      name: `${activity.name}`,
      version: `${activity.version}`
    },
    body = fs.createReadStream(activity.tarball);

  return new Promise((resolve, reject) => {
    npmRegClient.publish(npmConfig.registryUrl, {auth, access, body, metadata}, (err, result) => {
      if(err) { reject(err); }
      resolve(result);
    });
  });
}

const unpublish = (package_name, package_version) => {
  if (!config.NPM) { Promise.reject(new Error('')); }

  const npmRegClient = new NPMRegistryClient(),
    npmConfig = config.NPM;

  let
    auth = {
      username: npmConfig.usename, 
      password: npmConfig.password,
      email: npmConfig.email,
      alwaysAuth: true },
    version = package_version? package_version: "";

  return new Promise((resolve, reject) => {
    npmRegClient.unpublish(`${npmConfig.registryUrl}/${package_name}`, {auth, version}, (err, result) => {
      if(err) { reject(err); }
      resolve(result);
    });
  });
  
}

module.exports = {
  publish,
  unpublish
}