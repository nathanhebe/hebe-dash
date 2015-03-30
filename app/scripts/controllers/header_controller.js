Dashboard.HeaderController = Ember.ObjectController.extend({

    //currentDashID: function () {
    //    debugger;
        
    //}.property(),

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
            this.transitionToRoute('print', this.get('dashID'));
           // window.print();

        }

    },
});