Dashboard.AnnexRoute = Ember.Route.extend({
    //renderTemplate : function () {
    //    this.render('annex', { outlet: 'MainContent', into: 'application' });
    //    console.log('Rendering ANNEX: ');
    //},
    model: function (params) {
        var annexID = params.annexID;
        return Dashboard.ReportModel.findAll().then(function (report) {
            return report.annexes.findBy('ID', annexID);
        });
    }
});

Dashboard.PageRoute = Ember.Route.extend({
    model: function (params) {
        var route = this;
        var annexID = this.modelFor('annex').ID;
        var pageID = params.pageID;
        return Dashboard.ReportModel.findAll().then(function (report) {
            var page = report.annexes.findBy('ID', annexID).pages.findBy('ID', pageID);
            route.renderTemplate = function () {
                this.render(route.currentModel.Type, { outlet: '', into: 'application' });
                console.log('Rendering Page: ' + route.currentModel.Type);
            };
            return page;
        });
    },
    setupController: function (controller, model) {
        controller.set('model', model);
    }

});
