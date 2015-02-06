Dashboard.IndexView = Ember.View.extend({
    templateName: 'index',
    didInsertElement: function () {
        console.log('Index is Loaded'); // will log 'hello world'
        initGridster();
    }
});