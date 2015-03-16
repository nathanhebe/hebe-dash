Dashboard.PageRoute = Ember.Route.extend({
    dashID: null,
    annexID: null,
    pageID: null,

    model: function (params) {
        var dashID = params.dashID;
        var annexID = params.annexID;
        var pageID = params.pageID;
        this.set('dashID', dashID);
        this.set('annexID', annexID);
        this.set('pageID', pageID);

        var dash = this.modelFor('dash');
        if (dash == null) {
            console.log("the dash root has not previously been loaded so the model isn't setup");
            // we've likely come to this route directly 
                // the dash root has not previously been loaded so the model isn't setup
                // load the model based on the first url segment
            return Dashboard.DashboardModel.find(dashID).then(function (dash) {
                console.log('Loaded dash = ' + dash);
                var resourceID = dash.get('ckanResourceID');
                if (resourceID != null) {
                    return Dashboard.ReportModel.find(resourceID).then(function (annexes) {
                        return annexes.findBy('id', annexID).pages.findBy('id', pageID);
                    });
                }
            });
        } else {
            var resourceID = dash.get('ckanResourceID');
            if (resourceID != null) {
                var model = Dashboard.ReportModel.find(resourceID).then(function (annexes) {
                    return annexes.findBy('id', annexID).pages.findBy('id', pageID);
                });
                return model;
            }
        }
    },


    activate: function (dash, transition) {
        if (this.currentModel != null) {
            this.renderTemplate();
        }
    },

    afterModel: function (page, transition) {
        var route = this;
        route.renderTemplate = function () {
            var model = route.currentModel;
            model.setProperties({
                dashID: this.get('dashID'),
                annexID: this.get('annexID'),
                pageID: this.get('pageID')
            });

            route.render(model.type,
                {
                    outlet: '',
                    into: 'application',
                    model: model 
                });

            // render the header controller
            var headerController = route.controllerFor('header');
            headerController.set('model', model);
            route.render('header_board_report_page', {    // the template to render, referenced by name
                into: 'application',    // the template to render into, referenced by name
                outlet: 'header', // the outlet inside `options.template` to render into.
                view: 'header',      // the view to use for this template, referenced by name
                controller: headerController, // the controller to use for this template, referenced by name
                model: model            // the model to set on `options.controller`.
            });
        };
    },
    setupController: function (controller, model) {
        controller.set('model', model);
    }
});
