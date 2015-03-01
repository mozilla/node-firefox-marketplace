# WIP node-firefox-marketplace
JavaScript library for communicating with the [Firefox Marketplace](https://marketplace.firefox.com/).

This is a work in progress. The library currently only supports validating a manifest and uploading it to the Marketplace so you can continue the app submission process.

## Install
`npm install node-firefox-marketplace`

## Usage
```javascript
var MarketplaceClient = require('node-firefox-marketplace');

var fxos = new MarketplaceClient(options);
```

where `options` is an object consisting of:
  `consumerKey` (String)
  `consumerSecret` (String)
  `environment` (String) can be either `development` or `production`. If left blank, it will default to 'development'

The `consumerKey` and `consumerSecret` properties should correspond to your Marketplace Developer API key pair.

For development, you can generate OAuth keys on the [Beta Firefox Marketplace](https://marketplace-dev.allizom.org/) [here](https://marketplace-dev.allizom.org/developers/api).

To work with the production [Firefox Marketplace](https://marketplace.firefox.com/), you can generate your API keys [here](https://marketplace.firefox.com/developers/api).

Choose 'command line' for the client type when generating your key.


## Validating a manifest file
```javascript
fxos.validateManifest(manifestUrl).then(function(result) {
  console.log('Result: ', result);
});
```

`manifestUrl` is a hosted manifest.webapp URL. (i.e. http://brittanystoroz.github.io/its-five-o-clock-somewhere/manifest.webapp). The promise resolves with a validated manifest ID, that can then be used to publish your application to the marketplace.

## Publishing an app
```javascript
fxos.publish(validatedManifestID).then(function(result) {
  console.log('Result: ', result);
});
```
`validatedManifestID` is the ID returned by the `validateManifest` method. The promise resolves with an application ID, and you will see your newly created app under 'My Submissions' in the [Marketplace Developer Hub](https://marketplace.firefox.com/developers/).
