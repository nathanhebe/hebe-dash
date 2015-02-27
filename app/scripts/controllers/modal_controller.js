Dashboard.ModalController = Ember.ObjectController.extend({
    actions: {
        close: function () {
            console.log('ModalController > Close');
            return this.send('closeModal');
        }
    }
});