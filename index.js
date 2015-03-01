'use strict';

var request = require('request');
var Promise = require('es6-promise').Promise;
 

var URLS = {
  development: 'https://marketplace-dev.allizom.org/api/v2/apps/',
  production: 'https://marketplace.firefox.com/api/v2/apps/'
}

var ENDPOINTS = {
  validate: 'validation/',
  publish: 'app/'
};

function MarketplaceClient(consumerKey, consumerSecret, environment) {
  this._consumerKey = consumerKey;
  this._consumerSecret = consumerSecret;
  this._environment = environment || 'development';
  this._baseUrl = URLS[environment];

  return this;
}

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
