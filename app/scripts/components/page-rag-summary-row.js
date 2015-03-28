/* jshint undef: true, unused: true */
/* global $ */

Dashboard.PageRagSummaryRowComponent = Ember.Component.extend({


    didInsertElement: function () {
        if (this.get('page') != null) {
            this.get('page').set('watchRAGChanges',true);
        }
    },

    

});