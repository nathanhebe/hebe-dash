Dashboard.DashRoute = Dashboard.AuthenticatedRoute.extend({
    model: function (params) {
        this._super();
        var dashID = params.dashID;
        return Dashboard.DashboardModel.find(dashID);
    },

    afterModel: function (dash, transition) {
        var route = this;
        route.renderTemplate = function () {
            var model = route.currentModel;
            if (model != null) {
                var dashType = model.type.decamelize();
                route.render(dashType, { /*controller: 'BoardReportDashboard',*/ model: model });

                // render the header controller
                var headerController = this.controllerFor('header');
                headerController.set('model', model);

                route.render('header_' + dashType, {    // the template to render, referenced by name
                    //route.render('header_Dashboard', {    // the template to render, referenced by name
                    into: 'application',    // the template to render into, referenced by name
                    outlet: 'header', // the outlet inside `options.template` to render into.
                    view: 'header',      // the view to use for this template, referenced by name
                    controller: headerController, // the controller to use for this template, referenced by name
                    model: model            // the model to set on `options.controller`.
                });
            }
        };
    },

    activate: function (dash, transition) {
        this.renderTemplate();
    },

    _modal: null,
    _modalActive: false,
    actions: {
        toggleFooter: function (content) {
            this.toggleFooter(content);
        },

        openModal: function (modalName, model) {
            //this.controllerFor(modalName).set('model', model);
            return this.render(modalName, {
                into: 'application',
                outlet: 'modal',
                view: modalName
            });
        },

        closeModal: function () {
            //console.log('DashRoute > closeModal');
            return this.disconnectOutlet({
                outlet: 'modal',
                parentView: 'application'
            });
        }
    },

    toggleFooter: function (modalName) {
        return this.render(modalName, {
            into: 'application',
            outlet: 'footer'
        });
    }

});
