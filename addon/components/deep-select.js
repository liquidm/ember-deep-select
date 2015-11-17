import layout from '../templates/components/deep-select';
import filterByQuery from 'ember-cli-filter-by-query';
import without from 'lodash/array/without';
import Ember from 'ember';
const { Component, computed, on } = Ember;

export default Component.extend({
  classNames: ['deep-select'],
  layout,
  queryPosition: 0,

  suggestion: computed.alias('filteredOptions.firstObject'),
  filteredOptions: filterByQuery('options', 'label', 'query'),
  options: computed('content.options.[]', 'content.selections.[]', function() {
    const selections = this.get('content.selections');
    const options = this.get('content.options');
    return without(options, ...selections);
  }),

  select(option) {
    if (option = option || this.get('suggestion')) {
      const selections = this.get('content.selections');
      const queryPosition = this.get('queryPosition');
      selections.insertAt(queryPosition, option);
      this.set('query', '');
      this.moveForward();
    }
  },

  deselect(option) {
    const selections = this.get('content.selections');
    selections.removeObject(option);
  },

  removeAtPos() {
    const selections = this.get('content.selections');
    const position = this.get('queryPosition');
    selections.removeAt(position);
    this.moveBack();
  },

  moveBack() {
    if (this.get('queryPosition') > 0) {
      this.decrementProperty('queryPosition');
    }
  },

  moveForward() {
    const length = this.get('content.selections.length');
    if (this.get('queryPosition') < length) {
      this.incrementProperty('queryPosition');
    }
  },

  actions: {
    select(option)   { this.select(option);   },
    complete()       { this.select();         },
    deselect(option) { this.deselect(option); },
    left()           { this.moveBack();       },
    right()          { this.moveForward();    },
    del()            { this.removeAtPos();    }
  }
});
