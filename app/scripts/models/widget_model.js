/* jshint undef: true, unused: true */

Dashboard.WidgetModel = Ember.Object.extend({

    _data: null,
    data: function () {
        if (this.get('_data') != null) {
            return this.get('_data');
        } else {
            switch (this.get('type')) {
                case 'NHSIndicator':
                    if (this.get('indicatorID') === null) {
                        return new Error('No indicator id for Widget > NHSIndicator ');
                    }
                    this.set('_data', Dashboard.IndicatorModel.create({ id: this.get('indicatorID') }));
                    return this.get('_data');
            }
        }
    }.property('_data')

});
Dashboard.WidgetModel.reopenClass({});