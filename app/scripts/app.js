var Dashboard = window.Dashboard = Ember.Application.create();

Ember.Application.initializer({
    name: "websocketInit",
    initialize: function (container, application) {
        var hostURL = window.location.host;
        var dataID = '68ebcbee-177f-42b5-a31e-8f706d4ebf50'; // live resource id for data
        var ckanUrl = '//' + hostURL;

        application.set('settings', Ember.Object.create({

            // dev
            ckanUrl: 'http://52.17.101.212',
            directoryID: '4b7e71f7-d2bc-4246-a2f0-13061ea1360a',
            dataUrl: 'https://data.england.nhs.uk/api/action/datastore_search_sql?sql=SELECT * from "6b50a572-7684-4dc9-8a3e-f4cdfac77714" ',

            //// testing
            //ckanUrl: ckanUrl,
            //directoryID: 'a1dad755-81df-4832-81cb-093f03beb9e8',
            //dataUrl: ckanUrl + '/api/action/datastore_search_sql?sql=SELECT * from "6fded5d7-6e24-4223-8182-26ec00423882"',

            // live
            //ckanUrl: '//' + hostURL,
            //directoryID: '10cff1d7-c4ce-496d-b6fe-45fb0e647179',
            //dataUrl: ckanUrl + '/api/action/datastore_search_sql?sql=SELECT * from "' + dataID + '"',

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


Ember.Handlebars.helper('addPlusSign', function (value, options) {
    return new Ember.Handlebars.SafeString((value == null ? "" : (value > 0 ? '+' + value.toString() : value.toString())));
});