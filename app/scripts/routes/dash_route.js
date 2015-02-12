Dashboard.DashRoute = Ember.Route.extend({
    model: function (params) {
        var route = this;
        var dashID = params.dashID;
        return Dashboard.DashboardModel.find(dashID)
            .then(function (dashboard) {
                route.renderTemplate = function () {
                    route.render(route.currentModel.Type.decamelize());
                    console.log('Rendering Dash Dashboard type = ' + route.currentModel.Type);
                };
                return dashboard;
            });
    }
});
