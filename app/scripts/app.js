var Dashboard = window.Dashboard = Ember.Application.create();

Ember.Application.initializer({
    name: "websocketInit",
    initialize: function (container, application) {
        var hostURL = window.location.host;
        var dataID = '68ebcbee-177f-42b5-a31e-8f706d4ebf50'; // live resource id for data

        application.set('settings', Ember.Object.create({

            // testing
             ckanUrl: 'http://52.17.101.212',//'http://ec2-52-16-158-169.eu-west-1.compute.amazonaws.com',
             directoryID: 'b58a1a75-695e-4d35-9790-8f871657b662',
             dataUrl: 'https://data.england.nhs.uk/api/action/datastore_search_sql?sql=SELECT * from "68ebcbee-177f-42b5-a31e-8f706d4ebf50" ',

            // live
            //ckanUrl: '//' + hostURL,
            //directoryID: '10cff1d7-c4ce-496d-b6fe-45fb0e647179',
            //dataUrl: ckanURL + '/api/action/datastore_search_sql?sql=SELECT * from "' + dataID + '"',

        }))
    }
});

/* Order and include as you please. */
require('scripts/controllers/*');
require('scripts/store');
require('scripts/models/*');
require('scripts/routes/*');
require('scripts/components/*');
require('scripts/views/*');
require('scripts/router');


Ember.View.reopen({
    didInsertElement: function () {
        this._super();
        Ember.run.scheduleOnce('afterRender', this, this.afterRenderEvent);
    },
    afterRenderEvent: function () {
        // implement this hook in your own subclasses and run your jQuery logic there
    }
});
