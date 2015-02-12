Dashboard.IndexView = Ember.View.extend({
    templateName: 'index',
    owl: null,
    afterRenderEvent: function () {
        console.log('Index is Loaded'); // will log 'hello world'
        if (dashWrapper.isIndexViewAlreadyBeenShow == true && dashWrapper.isInitialized) {
            console.log('SHOW NAV PAGE');
            dashWrapper.showNavPage();
        }
        dashWrapper.isIndexViewAlreadyBeenShow = true;

    }

});