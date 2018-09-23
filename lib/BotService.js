const request = require("request"),
  config = require('config');

const getAllServerRegistries = (tenant, company, accessToken) => {
  if (!config.Services || !config.Services.botServiceHost)
    return Promise.reject("Required environment variables not provided.('Services')");

  if (!accessToken || !tenant || !company)
    return Promise.reject("BotService::getAllServerRegistries - Required method parameters not provided.");

  const SRVConfig = config.Services,
    SRVUrl = `${SRVConfig.botServiceProtocol || 'https'}://${SRVConfig.botServiceHost}/DBF/API/${SRVConfig.botServiceVersion || '1.0.0.0'}/serverRegistries/`; // https://<host>/DBF/API/1.0.0.0/getAllServerRegistries

  return new Promise((resolve, reject) => {
    request({
      method: "GET",
      url: SRVUrl,
      json: true,
      headers: {
        authorization: `bearer ${accessToken}`,
        companyinfo: `${tenant}:${company}`
      }
    }, (err, response, body) => {
      if (err) { reject(err); }
      try {
        if (body && body.IsSuccess) {
          resolve(body.Result);
        } else {
          reject(new Error(`Error getting while retrieving server registries.`));
        }
      } catch (ex) {
        reject(ex);
      }
    });
  });
}

const runActivity = (host, tenant, company, accessToken) => {
  if (!host|| !tenant || !company || !accessToken)
    return Promise.reject("BotService::runActivity - Required method parameters not provided.");
  
  const SRVConfig = config.Services,
    SRVUrl = `${host}/activity/run/${tenant}/${company}`;

  return new Promise((resolve, reject) => {
    request({
      method: "GET",
      url: SRVUrl,
      json: true,
      headers: {
        authorization: `bearer ${accessToken}`,
      }
    }, (err, response, body) => {
      if (err) { reject(err); }
      try {
        if (body && body.IsSuccess) {
          resolve(body.Message);
        } else {
          reject(new Error(body.Message || "Error getting while trying to run the activity."));
        }
      } catch (ex) {
        reject(ex);
      }
    });
  });
}

module.exports = {
  getAllServerRegistries,
  runActivity
}