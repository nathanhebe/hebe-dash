/* jshint undef: true, unused: true */
/* global $, utils */

Dashboard.DataRowModel = Ember.Object.extend({

    isAppendicesRow: function () {
        return (this.get('Title').substr(0, 1) === '*');
    }.property()
});