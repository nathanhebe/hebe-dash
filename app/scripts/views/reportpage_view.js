/* jshint undef: true, unused: true */

Dashboard.ReportPageView = Ember.View.extend({

    controller: Dashboard.PageController,


    templateName: function () {
        console.log(this.get('content.type'));
        return this.get('content.type');
    }.property('content.type').cacheable(),

    _templateChanged: function () {
        this.rerender();
    }.observes('templateName'),



});