import Ember from 'ember';
const { Controller } = Ember;

export default Controller.extend({

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
          multi: true,
          options: [
            {
              label: 'version 1',
              value: 'v1',
              options: [
                {
                  label: 'release',
                  value: 'r',
                  multi: true,
                  options: [
                    {
                      label: 'stable',
                      value: 's'
                    },
                    {
                      label: 'unstable',
                      value: 'u',
                      multi: true,
                      options: [
                        {
                          label: 'pre',
                          value: 'pr'
                        },
                        {
                          label: 'post',
                          value: 'po'
                        },
                      ]
                    }
                  ]
                },
              ],
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
