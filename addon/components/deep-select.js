import Ember from 'ember';
import layout from '../templates/components/deep-select';
import filterByQuery from 'ember-cli-filter-by-query';
import { keyDown } from 'ember-keyboard';
import without from 'lodash/array/without';
const { Component, computed, on } = Ember;

export default Component.extend({
  classNames: ['deep-select'],
  layout: layout,
  keyboard: Ember.inject.service(),

  options: computed('content.options.[]', 'content.selections.[]', function() {
    const selections = this.get('content.selections');
    const options = this.get('content.options');
    return without(options, ...selections);
  }),

  focus: on('didInsertElement', function() {
    this.$('input').focus();
  }),

  select(option) {
    const selections = this.get('content.selections');
    selections.pushObject(option);
    this.set('query', '');
  },

  deselect(option) {
    const selections = this.get('content.selections');
    selections.removeObject(option);
  },

  actions: {
    select(option)   { this.select(option);   },
    deselect(option) { this.deselect(option); }
  }
});
