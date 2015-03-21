/* jshint undef: true, unused: true */

Dashboard.BusinessAreaRowComponent = Ember.Component.extend({
    needs: "dashboard",
    dashboard: Ember.computed.alias("controllers.dashboard"),

    commentDecoded: function () {
        var comments = this.get('row.comment');
        comments = comments.toString().fixChars();
        return comments;
    }.property('row.comment'),

    //actions: {
    //    //openModal: function (modalName,model) {
    //    //    this.sendAction('action', modalName, model);
    //    //}
    //}

});