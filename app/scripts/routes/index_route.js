Dashboard.IndexRoute = Ember.Route.extend({
    renderTemplate : function () {
        this.render("index", {outlet: "page"});
    }
});
