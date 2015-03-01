# WIP node-firefox-marketplace
JavaScript library for communicating with the [Firefox Marketplace](https://marketplace.firefox.com/).

This is a work in progress. The library currently only supports validating a manifest and uploading it to the Marketplace so you can continue the app submission process.

## Install
`npm install node-firefox-marketplace`

## Usage
```javascript
var MarketplaceClient = require('node-firefox-marketplace');

var fxos = new MarketplaceClient(KEY, SECRET, environment);
```

where `KEY` and `SECRET` are strings that correspond to your Marketplace Developer API key pair. `environment` is also a string, and can be either `development` or `production`. If left blank, the environment will default to 'development'. 

For development, you can generate OAuth keys on the [Beta Firefox Marketplace](https://marketplace-dev.allizom.org/) [here](marketplace-dev.allizom.org/developers/api).

To work with the production [Firefox Marketplace](https://marketplace.firefox.com/), generate your API keys [here](https://marketplace.firefox.com/developers/api). 

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
