Dashboard.AnnexRoute = Ember.Route.extend({
    model: function (params) {
        var annexID = params.annexID;
        var dash = this.modelFor('dash');
        var resourceID = dash.get('ckanResourceID');
        if (resourceID != null) {
            var model = Dashboard.ReportModel.find(resourceID).then(function (annexes) {
                return annexes.findBy('id', annexID);
            });
            return model;
        }
    }
});