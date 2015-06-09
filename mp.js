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
  publish: 'apps/app/',
  update: 'apps/app/'
};

function MarketplaceClient(options) {
  var opts = options || {};
  this._consumerKey = opts.consumerKey;
  this._consumerSecret = opts.consumerSecret;
  this._environment = opts.environment || 'development';
  this._baseUrl = URLS[this._environment];

  return this;
}

MarketplaceClient.prototype = {
  _getRequest: function(opts) {
    var promise = new Promise(function(resolve, reject) {
      request({
        url: opts.url,
        method: opts.method,
        oauth: opts.oauth || false,
        json: opts.json || true,
        body: opts.body || false
      }, function(error, response, body) {
        if (error) {
          reject(error);
        } else {
          resolve(body);
        }
      });
    });
 
    return promise;
  },

  validate: function(validationResource) {
    this._getRequest({
      url: this._baseUrl + ENDPOINTS.validate,
      method: 'POST',
      json: true,
      oauth: { "consumer_key": this._consumerKey, "consumer_secret": this._consumerSecret },
      body: requestData
    });
  },

  publish: function(validationId, format) {
    var requestData = {}
    var publishType = (format === "packaged") ? "upload" : "manifest";
    requestData[publishType] = validationId;

    this._getRequest({
      url: this._baseUrl + ENDPOINTS.publish,
      method: 'POST',
      json: true,
      oauth: { "consumer_key": this._consumerKey, "consumer_secret": this._consumerSecret },
      body: requestData
    });
  },

  update: function(appId, requestData) {
    this._getRequest({
      url: this._baseUrl + ENDPOINTS.update + appId,
      method: 'PUT',
      json: true,
      oauth: { "consumer_key": this._consumerKey, "consumer_secret": this._consumerSecret },
      body: requestData
    });
  }
};

module.exports = MarketplaceClient;
