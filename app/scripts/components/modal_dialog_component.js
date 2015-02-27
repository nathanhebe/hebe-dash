
Dashboard.ModalDialogComponent = Ember.Component.extend({
    didInsertElement: function () {
        if (this.get('parentIsView') === true) {
            // if this was embeded by a view we need to set target object so actions will bubble correctly
            this.set('targetObject', this.get('parentView'));
        }
    },
    actions: {
        close: function () {
            console.log('ModalDialogComponent > Close');
            return this.sendAction();
        }
    }
});

