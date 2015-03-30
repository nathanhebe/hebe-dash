/* jshint undef: true, unused: true */

Dashboard.ReportPageView = Ember.View.extend({


    templateName: function () {
        console.log(this.get('item.type'));
        return this.get('item.type');
    }.property('item.type').cacheable(),

    _templateChanged: function () {
        this.rerender();
    }.observes('templateName'),



});