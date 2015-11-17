import layout from '../../templates/components/deep-select/query-input';
import { keyDown } from 'ember-keyboard';
import Ember from 'ember';
const { TextField, on, inject } = Ember;

export default TextField.extend({
  keyboard: inject.service(),
  layout,

  focus: on('didInsertElement', function() {
    this.$().focus();
  }),

  backSpace: on(keyDown('Backspace'), function() {
    const length = this.$().val().length;
    if (length === 0) {
      this.sendAction('del');
    }
  }),

  arrowLeft: on(keyDown('ArrowLeft'), function() {
    // const position = this.$().prop('selectionStart');
    const length = this.$().val().length;
    if (length === 0) {
      this.sendAction('left');
    }
  }),

  arrowRight: on(keyDown('ArrowRight'), function() {
    const length = this.$().val().length;
    if (length === 0) {
      this.sendAction('right');
    }
  }),
});
