const fs = require('fs'),
  config = require('config'),
  NPMRegistryClient = require('npm-registry-client'),
  TarArchive = require('./tarArchive');

const publish = async (activity, asPrivateModule=false) => {

  if (!config.NPM) { return Promise.reject(new Error('')); }

  const npmRegClient = new NPMRegistryClient(),
    npmConfig = config.NPM;

  let tarball = undefined;

  try {
    let tar = new TarArchive();
      tarball = await tar.create([`${activity.srcpath}/`], `${activity.srcpath}/${activity.name}.tgz`, true)
  } catch (err) {
    return Promise.reject(new Error(`Error getting while creating tarball to publish for npm registry. ${err.message}`));
  }

  if (tarball) {
    let 
      auth = {
        username: npmConfig.username, 
        password: npmConfig.password,
        email: npmConfig.email,
        alwaysAuth: true },
      body = fs.createReadStream(tarball),
      access = 'public',
      metadata = {
        name: `${activity.name}`,
        version: `${activity.version}`
      };
    
    if (asPrivateModule) {
      access = 'restricted'
      metadata['name'] = `${npmConfig.scope}/${activity.name}`
    }

    return new Promise((resolve, reject) => {
      npmRegClient.publish(npmConfig.registryUrl, {auth, access, body, metadata}, (err, result) => {
        if(err) { reject(err); }
        resolve(metadata);
      });
    });
  }
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