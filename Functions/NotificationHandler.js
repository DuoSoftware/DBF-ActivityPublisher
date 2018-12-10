
const notificationmanager = require('dbf-notificationmanager');

module.exports.sendNotification = async function(company, payload, token, res){
    let response = await notificationmanager.sendToUser(company, payload, token);
    res(response);
};