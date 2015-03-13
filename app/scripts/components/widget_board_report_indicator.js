/* jshint undef: true, unused: true */
/* global $ */

Dashboard.WidgetBoardReportIndicatorComponent = Ember.Component.extend({
    needs: "dashboard",
    dashboard: Ember.computed.alias("controllers.dashboard"),

    widget: null,
    indicator: null,
    chartModal: null,

    didInsertElement: function () {
        var widget = this.get('controller.widget');
        this.set('widget', widget);
    },

    actions: {
        toggleGraph: function () {
            this.displayGraphPopup();
        },
        toggleMeta: function () {
            this.displayMeta();
            this.sendAction('action', "Testy McTest test");
        },
        openModal: function (modalName,model) {
            this.sendAction('action', modalName, model);
        }
    },

    displayFlip: function () {
        //var el = this.$;
    },

    displayMeta: function () {
        //var dashController = this.get('controller').get('parentView').controller;
        var modal = null;
        var el = this.$();
        var dashboardContainer = el.parents('.dashboard');
        if (this.get('chartModal') == null) {
            // first time displaying chart for this indicator
            var popup = $('<div class="chartModal" id="' + this.get('widget.id') + '"></div>');
            modal = popup.appendTo(dashboardContainer);
            //var meta = el.find('.metadata').clone();
            el.addClass('modalHighlighted');
            this.set('chartModal', modal);
        } else {
            var visibleModals = $('.chartModal:visible');
            if (visibleModals.length > 0) {
                if (visibleModals.first().attr('id') === this.get('widget.id')) {
                    // currently showing this widget's modal so just fade it out
                    visibleModals.fadeOut('fast');
                } else {
                    // hide any existing charts
                    modal = this.get('chartModal');
                    visibleModals.fadeOut('fast', function () {
                        // then show this chart
                        modal.fadeIn('fast');
                    });
                }
            } else {
                // show this chart
                this.get('chartModal').fadeIn('fast');
            }
        }
    },

    displayGraphPopup: function () {
        if (this.get('chartModal') == null) {
            // first time displaying chart for this indicator
            var popup = $('<div class="chartModal"><h2>THIS IS THE CHART: ' + this.get('widget.indicatorID') + '</h2></div>');
            this.set('chartModal', popup.appendTo(this.$().parents('.dashboard')));
            this.populateChart();
        }
        if ($('.chartModal:visible').length > 0) {
            // hide any existing charts
            $('.chartModal:visible').fadeOut('fast', function () {
                // then show this chart
                this.get('chartModal').fadeToggle('fast');
            });
        } else {
            // show this chart
            this.get('chartModal').fadeToggle('fast');
        }
    },

    populateChart: function () {
        Dashboard.HeatMapComponent.create({ data: this.get('widget') }).appendTo(this.get('chartModal'));
    }
});