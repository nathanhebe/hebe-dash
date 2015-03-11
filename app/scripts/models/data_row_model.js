/* jshint undef: true, unused: true */

Dashboard.DataRowModel = Ember.Object.extend({

    isAppendicesRow: function () {
        return (this.get('Title').toString().startsWith('*'));
    }.property()
});