Dashboard.DashRoute = Ember.Route.extend({
    model: function (params) {
        var route = this;
        var dashID = params.dashID;
        return Dashboard.DashboardModel.find(dashID);
    },
    afterModel: function (dash, transition) {
        var route = this;
        route.renderTemplate = function () {
            var model = route.currentModel;
            if (model != null) {
                var dashType = model.Type.decamelize();
                route.render(dashType);

                // render the header controller
                var headerController = this.controllerFor('header');
                headerController.set('model', model);

                route.render('header_' + dashType, {    // the template to render, referenced by name
                    into: 'application',    // the template to render into, referenced by name
                    outlet: 'header', // the outlet inside `options.template` to render into.
                    view: 'header',      // the view to use for this template, referenced by name
                    controller: headerController, // the controller to use for this template, referenced by name
                    model: model            // the model to set on `options.controller`.
                })

            }

        };
    },
    activate: function (dash, transition) {
        this.renderTemplate();
    }
});
