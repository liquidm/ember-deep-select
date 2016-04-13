import Ember from 'ember';
import layout from '../templates/components/root-select';
const { computed, A, Component } = Ember;

const Item = Ember.Object.extend({
  hasChildren: computed.bool('options.length'),
});

export default Component.extend({
  layout: layout,
  classNames: ['root-select'],

  root: computed('options', 'selections', function() {
    const options = this.get('options');
    const selections = this.get('selections');

    const rec = (list, parent) => !list ? [] : list.map(({ value, label, multi, options, record }) => {
      const item = Item.create();

      if (record) {
        label = record.get('label');
        value = record.get('value');
        multi = record.get('multi');
        options = record.get('options');
      }

      item.setProperties({ parent, value, label, multi, options: rec(options, item), selections: parent ? new A() : selections });
      return item;
    });

    const root = Item.create({ selections: selections || new A() });
    root.options = rec(options, root);
    root.parent = root;
    root.multi = true; // there should be no root, but a user provided one

    this.set('result', root);
    return root;
  })

});
