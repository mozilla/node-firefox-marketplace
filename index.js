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

function MarketplaceClient(options) {
  this._consumerKey = options.consumerKey;
  this._consumerSecret = options.consumerSecret;
  this._environment = options.environment || 'development';
  this._baseUrl = URLS[this._environment];

  return this;
}

MarketplaceClient.prototype.getAccountDetails = function() {
  var self = this;
  var promise = new Promise(function(resolve, reject) {
    request({
      url: self._baseUrl + ENDPOINTS.accountDetails,
      method: 'GET',
      oauth: { "consumer_key": self._consumerKey, "consumer_secret": self._consumerSecret },
    }, function(error, response, body) {
      if (error) {
        reject(error);
      } else {
        resolve(body);
      }
    });
  });

  return promise;
};

MarketplaceClient.prototype.validateManifest = function(manifestUrl) {
  var self = this;
  var promise = new Promise(function(resolve, reject) {
    request({
      url: self._baseUrl + ENDPOINTS.validate,
      method: 'POST',
      body: { "manifest": manifestUrl },
      json: true,
      oauth: { "consumer_key": self._consumerKey, "consumer_secret": self._consumerSecret },
    }, function(error, response, body) {
      if (error) {
        reject(error);
      } else {
        resolve(body.id);
      }
    });
  });

  return promise;
};

MarketplaceClient.prototype.validatePackage = function(packagePath) {
  var self = this;
  var promise = new Promise(function(resolve, reject) {
    fs.readFile(packagePath, function(error, data) {
      if(error) {
        reject(error);
      } else {
        
        request({
          url: self._baseUrl + ENDPOINTS.validate,
          method: 'POST',
          body: { "upload": {
              "type": "application/zip",
              "name": packagePath.match(/\/?([^\/]+\.zip)$/)[1],
              "data": data.toString("base64")
            }
          },
          json: true,
          oauth: { "consumer_key": self._consumerKey, "consumer_secret": self._consumerSecret },
        }, function(error, response, body) {
          if (error) {
            reject(error);
          } else {
            resolve(body.id);
          }
        });
      }
    });
  });

  return promise;
};

MarketplaceClient.prototype.publish = function(validatedManifestId) {
  var self = this;
  var promise = new Promise(function(resolve, reject) {
    request({
      url: self._baseUrl + ENDPOINTS.publish + "?manifest=" + validatedManifestId,
      method: 'POST',
      body: { "manifest": validatedManifestId },
      json: true,
      oauth: { "consumer_key": self._consumerKey, "consumer_secret": self._consumerSecret },
    }, function(error, response, body) {
      if (error) {
        reject(error);
      } else {
        resolve(body.id);
      }
    });  
  });

  return promise;
};

module.exports = MarketplaceClient;
