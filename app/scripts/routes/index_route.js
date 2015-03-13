Dashboard.IndexRoute = Ember.Route.extend({
    model: function () {
        var route = this;
        return Dashboard.DashboardModel.findAll();
    },
    afterModel: function (dashes, transition) {
        if (dashes.get('length') > 0) {
            this.replaceWith('dash', dashes.get('firstObject').get('id'));
        }
    }
});