Dashboard.IndexView = Ember.View.extend({
    templateName: 'index',
    owl: null,
    afterRenderEvent: function () {
        console.log('Index is Loaded'); // will log 'hello world'
        //initGridster();
    }

});