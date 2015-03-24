/* jshint undef: true, unused: true */
/* global $, utilsv */

Dashboard.IndicatorValueModel = Ember.Object.extend({
    _val: null,
    val: function () {
        if (this.get('_val') == null) {
            switch (this.get('valueType')) {
                default:
                    this.set('_val', this.get('value'));
                    break;
                case '%':
                    this.set('_val', this.get('value') * 100);
                    break;
            }
            return this.get('_val');
        } else {
            return this.get('_val');
        }
    }.property('value', 'valueType'),

    upperCI: function () {
        if (this.get('uci') != null) {
            return this.get('uci');
        } else {
            return utils.random(this.get('val') - 3, this.get('val') + 3);
        }
    }.property('uci'),

    lowerCI: function () {
        if (this.get('uci') != null) {
            return this.get('lci');
        } else {
            var upper = this.get('upperCI');
            return utils.random(upper - 1, upper - 4);
        }
    }.property('uci')



});

Dashboard.IndicatorModel.reopenClass({
});