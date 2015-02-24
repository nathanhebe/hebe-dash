Dashboard.HeaderController = Ember.ObjectController.extend({

    actions: {
        goToReports: function () {
            this.get('target').transitionTo('dash', 'dash_1');
        },

        goToDashboard: function () {
            this.get('target').transitionTo('dash', 'dash_2');
        },

        goBackToBoardReport: function(){
            this.get('target').transitionTo('dash', 'dash_2');
            this.get('target').reset();
        },

        prepareForPrint: function () {
            window.print();
        }

    },
});