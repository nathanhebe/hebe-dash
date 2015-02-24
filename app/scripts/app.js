var Dashboard = window.Dashboard = Ember.Application.create();

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