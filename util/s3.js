const request = require("request"),
  config = require('config'),
  fs = require('fs');

const uploadToS3Bucket = (filepath) => {

  if (!config.Services || !config.Services.mediaServiceHost)
    return Promise.reject("Required environment variables not provided.('Services')");

  // if (!user || !tenant || !company)
  //   return Promise.reject("BotUserManager::uploadToS3Bucket - Required method parameters not provided.");

  const SRVConfig = config.Services;
    //SRVUrl = `${SRVConfig.mediaServiceProtocol || 'https'}://${SRVConfig.mediaServiceHost}/media/1/103/upload/`; // https://<host>/DBF/API/1.0.0.0/User
  
  let SRVUrl = "http://localhost:3131/upload";

  return new Promise((resolve, reject) => {
    request({
      method: "POST",
      url: SRVUrl,
      formData: {
        // Image: fs.createReadStream(filepath),
        Image: {
          value:  fs.createReadStream(filepath),
          options: {
            filename: 'gulp_zip.zip',
            contentType: 'application/zip'
          }
        },
        folderPath: "",
        contentType: "application/zip",
      },
      headers: {
        authorization: `bearer ${SRVConfig.accessToken}`,
        companyinfo: `1:103`
      }
    }, (err, response, body) => {
      if (err) { reject(err); }
      try {
        if (body && body.IsSuccess) {
          resolve(user);
        } else {
          reject(new Error(`Error getting while uploading activity to S3 bucket.`));
        }
      } catch (ex) {
        reject(ex);
      }
    });
  });
}

module.exports = {
  uploadToS3Bucket,
}