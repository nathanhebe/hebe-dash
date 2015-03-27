Dashboard.IndexRoute = Dashboard.AuthenticatedRoute.extend({
    model: function () {
        this._super();
        var route = this;
        return Dashboard.DashboardModel.findAll();
    },
    afterModel: function (dashes, transition) {
        if (dashes != null && dashes != undefined) {
            if (dashes.get('length') > 0) {
                this.replaceWith('dash', dashes.get('lastObject').get('id'));
            }
        }
    }
});