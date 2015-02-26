Dashboard.BoardReportDashboardController = Ember.ObjectController.extend({
    _modal: null,
    _modalActive: false,
    actions: {
        modal: function (action) {
            alert('CONTROLLER ACTION: ' + action);
            debugger;
            this.toggleModal();
        }
    },

    toggleModal: function () {
        var el = this.$();
        if (this._modal == null) {
            //create modal
            //this._modal = $('<div class="fullScreen"></div>').appendTo(el);
        }
        if (this._modalActive) {
            // hide modal
            this._modal.fadeIn('fast');
        } else {
            // show modal
            this._modal.fadeOut('fast');
        }
    }


});
