Dashboard.PageRoute = Ember.Route.extend({
    model: function (params) {
        //var route = this;
        //var annexID = this.modelFor('annex').ID;
        var pageID = params.pageID;

        //return Dashboard.ReportModel.findAll().then(function (report) {
        //    var page = report
        //    .annexes.findBy('id', annexID)
        //    .pages.findBy('ID', pageID);
        //    return page;
        //});
        console.log(this.modelFor('annex'));
        console.log(this.modelFor('annex').pages);
        //debugger;
        return this.modelFor('annex').pages.findBy('id', pageID);
    },

    afterModel: function (page, transition) {
        var route = this;
        route.renderTemplate = function () {
            var model = route.currentModel;
            route.render(model.type,
                {
                    outlet: '',
                    into: 'application'
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
