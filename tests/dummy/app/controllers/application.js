import Ember from 'ember';
const { computed, A } = Ember;

const Item = Ember.Object.extend({

  hasChildren: computed.bool('options.length'),

});

export default Ember.Controller.extend({

  root: computed('options', 'selections', function() {
    const options = this.get('options');
    const selections = this.get('selections');

    const rec = (list, parent) => !list ? [] : list.map(({ value, label, options}) => {
      const item = Item.create();
      item.setProperties({ parent, value, label, options: rec(options, item), selections: parent ? new A() : selections });
      return item;
    });

    const root = Item.create({ selections: new A() });
    root.options = rec(options, root);
    root.parent = root;

    return root;
  }),

  selections: [],

  options: [
    {
      value: 'IAB1',
      label: 'Automobile'
    },
    {
      value: 'IAB2',
      label: 'Business'
    },
    {
      value: 'IAB3',
      label: 'Gaming'
    },
    {
      value: 'OS',
      label: 'Operating System',
      options: [
        {
          value: 'ios',
          label: 'iOS',
        },
        {
          value: 'android',
          label: 'Android',
        },
      ]
    }
  ]

});
