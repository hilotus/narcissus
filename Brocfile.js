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

// ember i18n
app.import('bower_components/cldr/plurals.js');
app.import('bower_components/ember-i18n/lib/i18n.js');

// moment
app.import('bower_components/moment/min/moment-with-locales.min.js');

// pace
app.import('bower_components/pace/pace.min.js');
app.import('bower_components/pace/themes/blue/pace-theme-flash.css');

// js-md5
app.import('bower_components/js-md5/js/md5.min.js');

// nicescroll
app.import('bower_components/jquery-nicescroll/jquery.nicescroll.min.js');

module.exports = app.toTree();
