import layout from '../templates/components/deep-select';
import filterByQuery from 'ember-cli-filter-by-query';
import without from 'lodash/array/without';
import Ember from 'ember';
const { Component, computed, on } = Ember;

export default Component.extend({
  classNames: ['deep-select'],
  layout,
  isDeepSelect: true,
  queryPosition: 0,
  setView: on('didInsertElement', function() {
    const content = this.get('content');
    content.set('view', this);
  }),

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
    const queryPosition = this.get('queryPosition');
    const selectionPosition = selections.indexOf(option);
    selections.removeObject(option);
    if (selectionPosition <= queryPosition) {
      this.decrementProperty('queryPosition');
    }
  },

  removeAtPos() {
    const selections = this.get('content.selections');
    const position = this.get('queryPosition');
    if (position > 0 && position <= selections.length) {
      selections.removeAt(position - 1);
      this.decrementProperty('queryPosition');
    }
  },

  moveUp(offset = 0) {
    const parentView = this.get('content.parent.view');
    if (parentView === this) {
      return;
    } else if (parentView.get('isDeepSelect')) {
      Ember.run.next(() => {
        this.set('queryPosition', -1);
        const content = this.get('content');
        const parentSelections = content.get('parent.selections');
        const position = parentSelections.indexOf(content);
        parentView.$('input').focus();
        parentView.set('queryPosition', position + offset);
      });
    } else {
      this.incrementProperty('queryPosition', 1 - offset);
    }
  },

  moveDown(offset = 0) {
    const selections = this.get('content.selections');
    const position = this.get('queryPosition');
    const innerSelection = selections.objectAt(position - 1 + offset);
    if (innerSelection.get('hasChildren')) {
      Ember.run.next(() => {
        this.set('queryPosition', -1);
        const childView = innerSelection.get('view');
        const innerSelectionsLength = innerSelection.get('selections.length');
        childView.$('input').focus();
        childView.set('queryPosition', offset ? 0 : innerSelectionsLength);
      });
    } else {
      this.incrementProperty('queryPosition', 2 * offset - 1);
    }
  },

  moveBack() {
    if (this.get('queryPosition') > 0) {
      this.moveDown();
    } else {
      this.moveUp();
    }
  },

  moveForward() {
    const length = this.get('content.selections.length');
    if (this.get('queryPosition') < length) {
      this.moveDown(1);
    } else {
      this.moveUp(1);
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
