Dashboard.DashboardView = Ember.View.extend({
    templateName: 'dashboard_Dashboard',
    didInsertElement: function () {
        console.log('DashboardView is Loaded'); // will log 'hello world'
        dashWrapper.initGridster();
    }
});