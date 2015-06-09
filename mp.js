'use strict';

var request = require('request');
var Promise = require('es6-promise').Promise;
var fs      = require('fs');


var URLS = {
  development: 'https://marketplace-dev.allizom.org/api/v2/',
  production: 'https://marketplace.firefox.com/api/v2/'
}

var ENDPOINTS = {
  accountDetails: 'account/settings/mine/',
  validate: 'apps/validation/',
  publish: 'apps/app/'
};

var CLIENTMETHODS = {
  validate: {
    endpoint: 'apps/validation/',
    requestMethod: 'POST',
    oauth: true,
    json: true,
    successfulStatusCodes: [201, 202]
  },
  publish: {
    endpoint: 'apps/app/',
    requestMethod: 'POST',
    oauth: true,
    json: true,
    successfulStatusCodes: [201]
  },
  update: {
    endpoint: 'apps/app/',
    requestMethod: 'PUT',
    oauth: true,
    json: true,
    successfulStatusCodes: [202]
  }
};

function MarketplaceClient(options) {
  var opts = options || {};
  this._consumerKey = opts.consumerKey;
  this._consumerSecret = opts.consumerSecret;
  this._environment = opts.environment || 'development';
  this._baseUrl = URLS[this._environment];

  return this;
}

MarketplaceClient.prototype.MPRequest = function(methodName, data, endpointId) {
  var self = this;
  var requestDetails = CLIENTMETHODS[methodName];
  var urlEndpoint = self._baseUrl + requestDetails.endpoint;
  if (endpointId) {
    urlEndpoint = urlEndpoint + endpointId + '/';
  }
  console.log("URL ENDPOINT: ", urlEndpoint);
  console.log("Request Details: ", requestDetails);
  return new Promise(function(resolve, reject) {
    request({
      url: urlEndpoint,
      method: requestDetails.requestMethod,
      json: true,
      body: data,
      oauth: { "consumer_key": self._consumerKey, "consumer_secret": self._consumerSecret },
    }, function(error, response, body) {
      console.log("STATUS CODE: ", response.statusCode);
      if (error) {
        console.log("ERROR: ", response);
        reject(error);
      }
      if (requestDetails.successfulStatusCodes.indexOf(response.statusCode) === -1) {
        console.log("YEP STATUS CODE");
        reject(body);
      } else {
        resolve(body);
      }
    });
  });
};

MarketplaceClient.prototype.validate = function(validationResource) {
  return this.MPRequest('validate', { manifest: validationResource });
};

MarketplaceClient.prototype.publish = function(validationId, format) {
  var body = {}
  var publishType = (format === "packaged") ? "upload" : "manifest";
  body[publishType] = validationId;

  return this.MPRequest('publish', body);
};

MarketplaceClient.prototype.update = function(appId, appData) {
  return this.MPRequest('update', appData, appId);
};

module.exports = MarketplaceClient;
