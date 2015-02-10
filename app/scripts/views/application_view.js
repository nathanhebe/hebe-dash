Dashboard.ApplicationView = Ember.View.extend({
    didInsertElement: function () {
        var that = this;
        Ember.run.schedule('afterRender', function () {
            dashWrapper.init();

            //that.$('.navbar').affix({ offset: -1000 });
        });
    }
});