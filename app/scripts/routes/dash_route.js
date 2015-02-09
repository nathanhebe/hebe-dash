Dashboard.DashRoute = Ember.Route.extend({
    model: function (params) {
        var route = this;
        var dashID = params.dashID;
        return Dashboard.DashboardModel.find(dashID)
            .then(function (dashboard) {
                console.log('Dashboard type = ' + dashboard.Type);
                route.renderTemplate = function () {
                    this.render(dashboard.Type.decamelize(),
                    //this.render('dashboard_' + dashboard.Type,
                        {
                            outlet: 'MainContent',
                        }
                    );
                };
                return dashboard;
            });
    }
    //,
    //setupController: function (controller, model) {
    //    controller.set('model', model);
    //}
});
