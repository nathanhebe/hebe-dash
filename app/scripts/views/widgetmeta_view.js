/* jshint undef: true, unused: true */
Dashboard.WidgetMetaView = Ember.View.extend({
    templateName: 'widget_meta',
    actions: {
        close: function () {
            //console.log('WidgetMetaView > Close');
            //return this.send('closeModal');
            this.get('controller').send('closeModal');
        }
    }

    //click: function () {
    //    alert('test');
    //}
});