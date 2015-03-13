Dashboard.AnnexRoute = Ember.Route.extend({
    model: function (params) {
        var annexID = params.annexID;
        var annexes = this.modelFor('dash').get('data');
        var model = annexes.findBy('id', annexID);
        //debugger;
        return model;
        //return Dashboard.ReportModel.findAll().then(function (report) {
        //    return report.annexes.findBy('id', annexID);
        //});
    }
});