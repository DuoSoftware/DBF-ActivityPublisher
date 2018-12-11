
const notificationmanager = require('dbf-notificationmanager');

module.exports.sendNotification = async function(company, payload, token, res){
    let response;
    try{
        response = await notificationmanager.sendToUser(company, payload, token);
    }
    catch (e) {
        response = e
    }

    res(response);
};