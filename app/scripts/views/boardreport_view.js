Dashboard.BoardReportView = Ember.View.extend({
    templateName: 'dashboard_BoardReport',
    didInsertElement: function () {
        console.log('BoardReportView is Loaded'); // will log 'hello world'
        //dashWrapper.initGridster();
    }
});