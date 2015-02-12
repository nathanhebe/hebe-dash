Dashboard.ApplicationRoute = Ember.Route.extend({
    model: function () {
        return Dashboard.DashboardModel.findAll();
    }
});