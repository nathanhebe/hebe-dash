/* jshint undef: true, unused: true */

Dashboard.IndicatorRowChartComponent = Ember.Component.extend({
    //valueTypeString: function () {
    //    var model = this.get('model');
    //    if (model != null && model.get('valueType') == null) {
    //        return 'Value';
    //    } else {
    //        return (model.get('valueType') === '%' ? 'Percentage' : 'Value');
    //    }
    //}.property('model'),

    showChart: function () {
        var model = this.get('model');
        return (model != null && model.get('currentValue') != null && model.get('previousValue') != null);
    }.property('model.currentValue', 'model.previousValue')

});