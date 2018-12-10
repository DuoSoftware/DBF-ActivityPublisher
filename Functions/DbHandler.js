const MarketplacePublic = require('dbf-dbmodels/Models/MarketplacePublic').marketplacepublicactivities;
const mongoose = require("mongoose");
const messageFormatter = require('dvp-common-lite/CommonMessageGenerator/ClientMessageJsonFormatter.js');
const logger = require('dvp-common-lite/LogHandler/CommonLogHandler.js').logger;
const ActivityUserRegistry = require('dbf-dbmodels/Models/ActivityUserRegistry').ActivityUserRegistry;
const tenantactivity = require('dbf-dbmodels/Models/TenantActivity').tenantactivity;
const tenantactivityrecords = require('dbf-dbmodels/Models/TenantActivityRecords').tenantactivityrecords;
const tenantactivityvariables = require('dbf-dbmodels/Models/TenantActivityRecords').tenantactivityvariables;
const tenantactivitylanguages = require('dbf-dbmodels/Models/TenantActivityRecords').tenantactivitylanguages;
const tenantactivitytags = require('dbf-dbmodels/Models/TenantActivityRecords').tenantactivitytags;
const tenantactivitypricings = require('dbf-dbmodels/Models/TenantActivityRecords').tenantactivitypricings;


module.exports.SaveAnPublicActivity = function(data, req, res) {

    logger.debug("DBF-Services.SaveAnActivity Internal method");


    let company = parseInt(req.user.company);
    let tenant = parseInt(req.user.tenant);

    let currentDate = "";
    if (data.date !== 'undefined' && data.date !== '') {
        currentDate = data.date;
    }

    let insertUpdate = "insert";
    if (data.insertOrUpdate !== 'undefined' && data.insertOrUpdate === 'update') {
        insertUpdate = "update";
    }

    let jsonString;

    let tenantactivityrecordsdata = data;

    let activityrecordvariables = data.variables;
    let activityrecordlanguages = data.languages;
    let activityrecordpricings = data.pricings;
    let activityrecordtags = data.tags;
    // We are not saving variable data in the tenant activity record table. So we are sending an empty array for 'tenantactivityrecordsdata.variables'
    // tenantactivityrecordsdata.variables = [];

    tenantactivityrecordsdata.company = company;
    tenantactivityrecordsdata.tenant = tenant;

    if (insertUpdate === 'insert') {
        tenantactivityrecordsdata.created_at = currentDate;
        tenantactivityrecordsdata.updated_at = currentDate;
    } else {
        tenantactivityrecordsdata.updated_at = currentDate;
    }

    // console.log("currentDate");
    // console.log(currentDate);
    // console.log("tenantactivityrecordsdata");
    // console.log(tenantactivityrecordsdata);
    tenantactivityrecords.findOneAndUpdate({
        'company': company,
        'tenant': tenant,
        'activity_name': tenantactivityrecordsdata.activity_name,
        'npm_module': tenantactivityrecordsdata.npm_module
    }, tenantactivityrecordsdata, {
        upsert: true
    }, function(err, _recordResult) {
        // console.log("1");
        if (err) {
            // console.log("err" + err);
            jsonString = messageFormatter.FormatMessage(err, "Save Tenant Activity Records has failed", false, undefined);
            res(jsonString);
        } else {
            console.log("Save Tenant Activity Record has succeeded");

            // Saving activity variables
            activityrecordvariables.forEach(function(variableRecord) {
                let tenantactivityvariablesdata = variableRecord;

                tenantactivityvariablesdata.company = company;
                tenantactivityvariablesdata.tenant = tenant;
                tenantactivityvariablesdata.tenant_name = tenantactivityrecordsdata.tenant_name;
                tenantactivityvariablesdata.activity_name = tenantactivityrecordsdata.activity_name;

                if (insertUpdate === 'insert') {
                    tenantactivityvariablesdata.created_at = currentDate;
                    tenantactivityvariablesdata.updated_at = currentDate;
                } else {
                    tenantactivityvariablesdata.updated_at = currentDate;
                }


                tenantactivityvariables.findOneAndUpdate({
                    'company': company,
                    'tenant': tenant,
                    'activity_name': tenantactivityvariablesdata.activity_name,
                    'key': tenantactivityvariablesdata.key
                }, tenantactivityvariablesdata, {
                    upsert: true
                }, function(err, _variableResult) {
                    if (err) {
                        console.log(err);
                        jsonString = messageFormatter.FormatMessage(err, "Upsert Tenant Activity Variable has failed", false, undefined);
                    }
                });
            });

            // Saving activity languages
            activityrecordlanguages.forEach(function(languageRecord) {
                let tenantactivitylanguagedata = languageRecord;

                tenantactivitylanguagedata.company = company;
                tenantactivitylanguagedata.tenant = tenant;
                tenantactivitylanguagedata.tenant_name = tenantactivityrecordsdata.tenant_name;
                tenantactivitylanguagedata.activity_name = tenantactivityrecordsdata.activity_name;

                if (insertUpdate === 'insert') {
                    tenantactivitylanguagedata.created_at = currentDate;
                    tenantactivitylanguagedata.updated_at = currentDate;
                } else {
                    tenantactivitylanguagedata.updated_at = currentDate;
                }



                tenantactivitylanguages.findOneAndUpdate({
                    'company': company,
                    'tenant': tenant,
                    'activity_name': tenantactivitylanguagedata.activity_name,
                    'language': tenantactivitylanguagedata.language
                }, tenantactivitylanguagedata, {
                    upsert: true
                }, function(err, _languageResult) {
                    if (err) {
                        console.log(err);
                        jsonString = messageFormatter.FormatMessage(err, "Upsert Tenant Activity Language has failed", false, undefined);
                    }
                });
            });


            // Saving activity pricings
            activityrecordpricings.forEach(function(pricingRecord) {
                let tenantactivitypricingdata = pricingRecord;

                tenantactivitypricingdata.company = company;
                tenantactivitypricingdata.tenant = tenant;
                tenantactivitypricingdata.tenant_name = tenantactivityrecordsdata.tenant_name;
                tenantactivitypricingdata.activity_name = tenantactivityrecordsdata.activity_name;

                if (insertUpdate === 'insert') {
                    tenantactivitypricingdata.created_at = currentDate;
                    tenantactivitypricingdata.updated_at = currentDate;
                } else {
                    tenantactivitypricingdata.updated_at = currentDate;
                }



                tenantactivitypricings.findOneAndUpdate({
                    'company': company,
                    'tenant': tenant,
                    'activity_name': tenantactivitypricingdata.activity_name,
                    'pricing_name': tenantactivitypricingdata.pricing_name
                }, tenantactivitypricingdata, {
                    upsert: true
                }, function(err, _pricingResult) {
                    if (err) {
                        console.log(err);
                        jsonString = messageFormatter.FormatMessage(err, "Upsert Tenant Activity Pricing has failed", false, undefined);
                    }
                });
            });


            // Saving activity tags
            activityrecordtags.forEach(function(tagRecord) {
                let tenantactivitytagdata = tagRecord;

                tenantactivitytagdata.company = company;
                tenantactivitytagdata.tenant = tenant;
                tenantactivitytagdata.tenant_name = tenantactivityrecordsdata.tenant_name;
                tenantactivitytagdata.activity_name = tenantactivityrecordsdata.activity_name;

                if (insertUpdate === 'insert') {
                    tenantactivitytagdata.created_at = currentDate;
                    tenantactivitytagdata.updated_at = currentDate;
                } else {
                    tenantactivitytagdata.updated_at = currentDate;
                }

                tenantactivitytags.findOneAndUpdate({
                    'company': company,
                    'tenant': tenant,
                    'activity_name': tenantactivitytagdata.activity_name,
                    'tag': tenantactivitytagdata.tag
                }, tenantactivitytagdata, {
                    upsert: true
                }, function(err, _tagResult) {
                    if (err) {
                        console.log(err);
                        jsonString = messageFormatter.FormatMessage(err, "Upsert Tenant Activity Tag has failed", false, undefined);
                    }
                });
            });
        }
        jsonString = messageFormatter.FormatMessage(undefined, "Save Tenant Activity has succeeded", true, _recordResult);
        res(jsonString);
    });
};

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

module.exports.GetMarketplacePublic = function(req, res){

    logger.debug("DBF-Services.MarketplacePublic Internal method ");

    let company = parseInt(req.user.company);
    let tenant = parseInt(req.user.tenant);
    let jsonString;

    console.log(company);
    console.log(req.params.id);

    MarketplacePublic.findOne({_id:req.params.id,company:company,tenant:tenant},function (err, _app) {
        if(err)
        {
            jsonString=messageFormatter.FormatMessage(err, "GetMarketplacePublic failed", false, undefined);
        }
        else
        {
            jsonString=messageFormatter.FormatMessage(undefined, "GetMarketplacePublic succeeded", true, _app);
        }
        res(jsonString);
    });
};


module.exports.getEntriesByActivity = (req, res, next) => {

    logger.debug("DBF-Services.getEntriesByActivity Internal method");
    console.log("DBF-Services.getEntriesByActivity Internal method");

    let jsonString;

    ActivityUserRegistry.find({
        'activity_name': req.params.id,
    }, function(err, _entry) {
        if (err) {
            jsonString = messageFormatter.FormatMessage(err, "Falied getEntriesByActivity", false, undefined);
        } else {
            jsonString = messageFormatter.FormatMessage(undefined, "Successfully retrieve data for getEntriesByActivity", true, _entry);
        }
        res(jsonString);
    });
}