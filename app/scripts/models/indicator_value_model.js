/* jshint undef: true, unused: true */
/* global $, utils */

Dashboard.IndicatorValueModel = Ember.Object.extend({
    _val: null,
    val: function () {
        if (this.get('_val') == null) {
            switch (this.get('valueType')) {
                default:
                    var value = utils.parseNumber(this.get('value'));
                    this.set('_val', value);
                    break;
                case '%':
                    var value = utils.parseNumber(this.get('value')) * 100;
                    value = parseFloat(value).toPrecisionDigits(3);
                    this.set('_val', value);
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