import layout from '../templates/components/deep-select';
import filterByQuery from 'ember-cli-filter-by-query';
import without from 'lodash/array/without';
import Ember from 'ember';
const { Component, computed, on, run } = Ember;

export default Component.extend({
  classNames: ['deep-select'],
  layout,
  isDeepSelect: true,
  queryPosition: 0,

  setView: on('didInsertElement', function() {
    const content = this.get('content');
    content.set('view', this);
    Ember.$(document).on('click', this.externalClick.bind(this));
  }),


  suggestion: computed.alias('filteredOptions.firstObject'),
  filteredOptions: filterByQuery('options', 'label', 'query'),
  options: computed('content.options.[]', 'content.selections.[]', function() {
    const selections = this.get('content.selections');
    const options = this.get('content.options');
    const multi = this.get('content.multi');
    if (multi) {
      return without(options, ...selections);
    } else {
      return selections.length ? [] : options;
    }
  }),

  nextLayer: computed('layer', function() {
    return this.get('layer') + 1;
  }),

  suggest(option) {
    this.set('suggestion', option);
  },

  select(option) {
    if (option = option || this.get('suggestion')) {
      const selections = this.get('content.selections');
      const queryPosition = this.get('queryPosition');
      selections.insertAt(queryPosition, option);
      this.set('query', '');
      this.$().children('.selections').children('li').children('input').addClass('show').focus();
    }

    this.moveForward();
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
      run.next(() => {
        const content = this.get('content');
        const parentSelections = content.get('parent.selections');
        const position = parentSelections.indexOf(content);
        this.$('.deep-select-input').removeClass('show');
        parentView.set('queryPosition', position + offset);
        run.next(() => {
          parentView.$().children('.selections').children('.deep-select-input').addClass('show').children('input').focus();
        });
      });
    } else {
      this.incrementProperty('queryPosition', 1 - offset);
      run.next(() => {
        this.$().children('.selections').children('.deep-select-input').addClass('show').children('input').focus();
      });
    }
  },

  moveDown(offset = 0) {
    const selections = this.get('content.selections');
    const position = this.get('queryPosition');
    const innerSelection = selections.objectAt(position - 1 + offset);
    run.next(() => {
      if (innerSelection.get('view.isDeepSelect')) {
        run.next(() => {
          const childView = innerSelection.get('view');
          const innerSelectionsLength = innerSelection.get('selections.length');
          this.$('.deep-select-input').removeClass('show');
          childView.set('queryPosition', offset ? 0 : innerSelectionsLength);
          run.next(() => {
            childView.$().children('.selections').children('.deep-select-input').addClass('show').children('input').focus();
          });
        });
      } else {
        this.incrementProperty('queryPosition', 2 * offset - 1);
        run.next(() => {
          this.$().children('.selections').children('.deep-select-input').addClass('show').children('input').focus();
        });
      }
    });
  },

  moveBack() {
    if (this.get('queryPosition') > 0) {
      this.moveDown();
    } else {
      this.moveUp();
    }
  },

  moveForward() {
    const selectionsLength = this.get('content.selections.length');
    if (this.get('queryPosition') < selectionsLength) {
      this.moveDown(1);
    } else {
      this.moveUp(1);
    }
  },

  externalClick() {
    this.$().children('.selections').children('.deep-select-input').removeClass('show');
  },

  click(e) {
    Ember.$('.deep-select-input').removeClass('show');
    const target = Ember.$(e.target);
    if (target.is('.deep-select-li')) {
      target.children('.deep-select')
        .children('.selections')
        .children('.deep-select-input').addClass('show')
        .children('input').focus();
    } else {
      this.$()
        .children('.selections')
        .children('.deep-select-input').addClass('show')
        .children('input').focus();
    }

    e.preventDefault();
    return false;
  },

  suggestNext(offset = 1) {
    const options = this.get('filteredOptions');
    const suggestion = this.get('suggestion');
    const currentIndex = options.indexOf(suggestion);
    const nextIndex = currentIndex - offset;
    if ( 0 <= nextIndex && nextIndex < options.length) {
      this.set('suggestion',options.objectAt(nextIndex));
    }
  },

  suggestPrevious(offset = 1) {
    this.suggestNext(-offset);
  },

  actions: {
    suggest(option)  { this.suggest(option);   },
    up()             { this.suggestNext();     },
    down()           { this.suggestPrevious(); },
    select(option)   { this.select(option);    },
    complete()       { this.select();          },
    deselect(option) { this.deselect(option);  },
    left()           { this.moveBack();        },
    right()          { this.moveForward();     },
    del()            { this.removeAtPos();     },
  }
});
