/* jshint node: true */

module.exports = function(environment) {
  var ENV = {
    modulePrefix: 'narcissus',
    environment: environment,
    baseURL: '/',
    locationType: 'hash',
    EmberENV: {
      FEATURES: {
        // Here you can enable experimental features on an ember canary build
        // e.g. 'with-controller': true
      }
    },

    APP: {
      // Here you can pass flags/options to your application instance
      // when it is created
      defaultLocale: 'en-us',
      parseApplicationId: '4f3ATEailRoi1A49sh4vlNppWKk8G8xf6ThymKkG',
      parseRestApiKey: 'm2CUMzzcTkqZLTR2v7BVbXLIg9vAzqAxWYVUvyjm'
    },

    contentSecurityPolicy: {
      'default-src': "'none'",
      // 'script-src': "'self' https://cdn.mxpnl.com", // Allow scripts from https://cdn.mxpnl.com
      'script-src': "'self' http://js-agent.newrelic.com http://bam.nr-data.net 'unsafe-inline'",
      'font-src': "'self' http://fonts.gstatic.com", // Allow fonts to be loaded from http://fonts.gstatic.com
      // 'connect-src': "'self' https://api.mixpanel.com http://custom-api.local", // Allow data (ajax/websocket) from api.mixpanel.com and custom-api.local
      'connect-src': "'self' https://api.parse.com",
      'img-src': "'self' http://cdn.infoqstatic.com http://lotus-assets.qiniudn.com http://gravatar.duoshuo.com https://bam.nr-data.net data:",
      'style-src': "'self' 'unsafe-inline' http://fonts.googleapis.com", // Allow inline styles and loaded CSS from http://fonts.googleapis.com
      'media-src': "'self'"
    }
  };

  if (environment === 'development') {
    // ENV.APP.LOG_RESOLVER = true;
    ENV.APP.LOG_ACTIVE_GENERATION = true;
    // ENV.APP.LOG_TRANSITIONS = true;
    // ENV.APP.LOG_TRANSITIONS_INTERNAL = true;
    ENV.APP.LOG_VIEW_LOOKUPS = true;
  }

  if (environment === 'test') {
    // Testem prefers this...
    ENV.baseURL = '/';
    // ENV.locationType = 'auto';

    // keep test console output quieter
    ENV.APP.LOG_ACTIVE_GENERATION = false;
    ENV.APP.LOG_VIEW_LOOKUPS = false;

    ENV.APP.rootElement = '#ember-testing';
  }

  if (environment === 'production') {
  }

  return ENV;
};
