var Dashboard = window.Dashboard = Ember.Application.create();

Ember.Application.initializer({
    name: "websocketInit",
    initialize: function (container, application) {
        application.set('settings', Ember.Object.create({
            ckanUrl: 'http://52.17.101.212',//'http://ec2-52-16-158-169.eu-west-1.compute.amazonaws.com',
            directoryID: 'b58a1a75-695e-4d35-9790-8f871657b662',
            dataID: '6fded5d7-6e24-4223-8182-26ec00423882'
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
