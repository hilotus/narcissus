/* global require, module */

var EmberApp = require('ember-cli/lib/broccoli/ember-app');

var app = new EmberApp();

// Use `app.import` to add additional libraries to the generated
// output files.
//
// If you need to use different assets in different
// environments, specify an object as the first parameter. That
// object's keys should be the environment name and the values
// should be the asset to use in that environment.
//
// If the library that you are including contains AMD or ES6
// modules that you would like to import into your application
// please specify an object with the list of modules as keys
// along with the exports of each module as its value.

// jquery.nicescroll.min.js
app.import('bower_components/jquery-nicescroll/jquery.nicescroll.min.js');

// moment
app.import('bower_components/moment/min/moment-with-locales.min.js');
// moment-timezone
app.import('bower_components/moment-timezone/builds/moment-timezone-with-data.min.js');

// pace
app.import('bower_components/pace/pace.min.js');
app.import('bower_components/pace/themes/blue/pace-theme-flash.css');

// js-md5
app.import('bower_components/js-md5/js/md5.min.js');

module.exports = app.toTree();
