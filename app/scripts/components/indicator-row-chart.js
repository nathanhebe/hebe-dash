/* jshint undef: true, unused: true */

Dashboard.IndicatorRowChartComponent = Ember.Component.extend({

    showChart: function () {
        var model = this.get('model');
        return (model != null && model.get('currentValue') != null && model.get('previousValue') != null && model.get('activeDateValues') != null && model.get('activeDateValues').length > 1);
    }.property('model.currentValue', 'model.previousValue')

});