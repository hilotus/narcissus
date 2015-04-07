import Ember from 'ember';
import GravatarMixin from '../../../mixins/gravatar';
import { module, test } from 'qunit';

module('GravatarMixin');

// Replace this with your real tests.
test('it works', function(assert) {
  var GravatarObject = Ember.Object.extend(GravatarMixin);
  var subject = GravatarObject.create();
  assert.ok(subject);
});
