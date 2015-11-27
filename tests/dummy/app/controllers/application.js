import Ember from 'ember';
const { computed, A } = Ember;

const Item = Ember.Object.extend({

  hasChildren: computed.bool('options.length'),

});

export default Ember.Controller.extend({

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
  }),

  selections: [],

  options: [
    {
      value: 'IAB1',
      label: 'Automobile',
      multi: true,
      options: [
        {
          label: 'BMW',
          value: 'bmw'
        },
        {
          label: 'Audi',
          value: 'audi'
        },
        {
          label: 'Tesla',
          value: 'tesla'
        },
        {
          label: 'Mercedes',
          value: 'mercedes'
        },
      ]
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
      multi: true,
      options: [
        {
          value: 'ios',
          label: 'iOS',
        },
        {
          value: 'android',
          label: 'Android',
          options: [
            {
              label: 'version 1',
              value: 'v1',
            },
            {
              label: 'version 2',
              value: 'v2',
            },
            {
              label: 'version 3',
              value: 'v3',
            },
          ]
        },
      ]
    }
  ]

});
