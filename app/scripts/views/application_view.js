Dashboard.ApplicationView = Ember.View.extend({
    owlCarousel: null,
    didInsertElement: function () {
        var that = this;
        Ember.run.schedule('afterRender', function () {
            dashWrapper.init();

            that.owlCarousel = $('#widgetCarousel').owlCarousel({
                startPosition: 4
            }).data('owlCarousel');

            that.modelChanged();
        });
    },
    modelChanged: function () {
        if (!this.$()) { return; } // View not in DOM
        var model = this.get('controller.model');
        var that = this;
        that.owlCarousel.destroy()
        model.forEach(function (dash) {
            //dashPromise.then(function (dash) {
            var dashLink = '<a class=\"item center widgetItem\" href="#/dash/'+dash.ID+'">' + dash.Title + '</a>';
            that.owlCarousel.addItem(dashLink);
            //});
        });
    }.observes('controller.model.@each')

});