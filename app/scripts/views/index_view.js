Dashboard.IndexView = Ember.View.extend({
    templateName: 'index',
    owl: null,
    afterRenderEvent: function () {
        console.log('Index is Loaded'); // will log 'hello world'
        //initGridster();
        owl = $('#widgetCarousel');
        owl.owlCarousel({
            startPosition: 4
        });

        this.modelChanged();
    },

    modelChanged: function () {
        if (!this.$()) { return; } // View not in DOM
        var model = this.get('controller.model');
        model.forEach(function (dash) {
            //dashPromise.then(function (dash) {
                var dashLink = '<a class=\"item center widgetItem\" href="#/dash/'+dash.ID+'">' + dash.Title + '</a>';
                owl.data('owlCarousel').addItem(dashLink);
            //});
        });
    }.observes('controller.model.@each')
});