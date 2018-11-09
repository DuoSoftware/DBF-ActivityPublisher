const MarketplacePublic = require('dbf-dbmodels/Models/MarketplacePublic').marketplacepublicactivities;
const mongoose = require("mongoose");
const messageFormatter = require('dvp-common-lite/CommonMessageGenerator/ClientMessageJsonFormatter.js');
const logger = require('dvp-common-lite/LogHandler/CommonLogHandler.js').logger;



module.exports.DeleteMarketplacePublic = function(req, res){

    logger.debug("DBF-Services.MarketplacePublic Internal method ");

    let company = parseInt(req.user.company);
    let tenant = parseInt(req.user.tenant);
    let jsonString;

    console.log(company);
    console.log(req.params.id);

    MarketplacePublic.findOneAndRemove({_id:req.params.id,company:company,tenant:tenant},function (err, _app) {
        if(err)
        {
            jsonString=messageFormatter.FormatMessage(err, "MarketplacePublic delete failed", false, undefined);
        }
        else
        {
            jsonString=messageFormatter.FormatMessage(undefined, "MarketplacePublic delete succeeded", true, _app);
        }
        res(jsonString);
    });
};