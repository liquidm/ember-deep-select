import Ember from 'ember';
import layout from '../templates/components/root-select';
const { computed, A, Component } = Ember;

const Item = Ember.Object.extend({
  hasChildren: computed.bool('options.length'),
});

export default Component.extend({
  layout: layout,

  root: computed('options', 'selections', function() {
    const options = this.get('options');
    const selections = this.get('selections');

    const rec = (list, parent) => !list ? [] : list.map(({ value, label, multi, options }) => {
      const item = Item.create();
      item.setProperties({ parent, value, label, multi, options: rec(options, item), selections: parent ? new A() : selections });
      return item;
    });

    const root = Item.create({ selections: new A() });
    root.options = rec(options, root);
    root.parent = root;
    root.multi = true; // there should be no root, but a user provided one

    return root;
  })

});
