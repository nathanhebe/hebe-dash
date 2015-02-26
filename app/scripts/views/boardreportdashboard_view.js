/* jshint undef: true, unused: true */
/* global dashWrapper */
Dashboard.BoardReportDashboardView = Ember.View.extend({
    templateName: 'dashboard_Dashboard',

    didInsertElement: function () {
        var that = this;
        Ember.run.schedule('afterRender', function () {
            that.modelChanged();
        });
    },

    modelChanged: function () {
        if (!this.$()) { return; } // View not in DOM
        var model = this.get('controller.model');
        if (model.get('data') != null) {
            Ember.run.schedule('afterRender', function () {
                dashWrapper.initGridster();
            }); 
        }
        //var that = this;
    }.observes('controller.model.data.@each')

});