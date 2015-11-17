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

  suggestion: computed.alias('filteredOptions.firstObject'),
  filteredOptions: filterByQuery('options', 'label', 'query'),
  options: computed('content.options.[]', 'content.selections.[]', function() {
    const selections = this.get('content.selections');
    const options = this.get('content.options');
    return without(options, ...selections);
  }),

  focus: on('didInsertElement', function() {
    this.$('input').focus();
  }),

  select(option) {
    if (option = option || this.get('suggestion')) {
      const selections = this.get('content.selections');
      selections.pushObject(option);
      this.set('query', '');
    }
  },

  deselect(option) {
    const selections = this.get('content.selections');
    selections.removeObject(option);
  },

  navigateBack: on(keyDown('ArrowLeft'), function() {
    console.log('back');
  }),

  actions: {
    select(option)   { this.select(option);   },
    complete()       { this.select();         },
    deselect(option) { this.deselect(option); }
  }
});
