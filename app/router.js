import Ember from 'ember';
import config from './config/environment';

var Router = Ember.Router.extend({
  location: config.locationType
});

Router.map(function() {
  this.route('settings', {path: '/settings'});
  this.resource('posts', {path: '/posts'}, function(){
    this.route('index', {path: '/'});
    this.route('new');
    this.route('edit', {path: '/edit/:post_id'});
  });
  this.route('post', {path: '/post/:post_id'});
});

export default Router;
