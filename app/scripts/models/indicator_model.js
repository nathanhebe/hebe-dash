Dashboard.IndicatorModel = Ember.Object.extend({
    targetValue: null,
    currentValue: null,
    previousValue: null,
    _dataValues: null,

    currentVal: function () {
        var val = parseFloat(this.get('currentValue').Value).toPrecision(3);
        if (val.length > 3) {
            val = parseFloat(this.get('currentValue').Value).toPrecision(2);
        }
        return val;
    }.property('currentValue'),

    previousVal: function () {
        var val = parseFloat(this.get('previousValue').Value).toPrecision(3);
        if (val.length > 3) {
            val = parseFloat(this.get('previousValue').Value).toPrecision(2);
        }
        return val;
    }.property('previousValue'),

    chartID: function () {
        return 'Chart' + this.get('ID');
    }.property(),

    hasValue: function () {
        // Todo: correcting for bad development data e.g. missing values or some have dates like 1968-01-20T00:00:00
        return !(this.get('currentValue') == null) && (this.get('currentValue').Value.indexOf('T00:') === -1);
    }.property('currentValue'),

    dataValues: function () {
        if (this.get('_dataValues') != null) {
            return this.get('_dataValues');
        } else {
            var obj = this;
            $.ajax({
                url: 'http://54.154.11.196/api/action/datastore_search_sql?sql=SELECT * from "a358a675-fabf-4b6b-9163-f88d2b26e776" WHERE "Indicator id" = ' + "'" + obj.get('ID') + "'" + ' ORDER BY "Year" DESC '
            })
            .then(function (response) {
                var results = response.result.records;
                obj.setProperties({
                    _dataValues: results,
                    currentValue: results[0],
                    previousValue: results[1]
                });
                return obj.get('_dataValues');
            });
        }
    }.property(),


    trend: function () {
        switch (this.get('ragColour')) {
            default:
                return 'even';
                break;
            case 'green':
            case 'greenAmber':
                return 'up'
                break;
            case 'red':
                return 'down';
                break;
        }
    }.property('_ragColour'),

    _ragColour: null,

    ragColour: function () {
        if (this.get('_ragColour') !== null) {
            return this.get('_ragColour');
        } else {
            var colour = 'blue';
            //switch this.get('RAGType')
            var current = this.get('currentValue').Value;
            var previous = this.get('previousValue').Value;

            if (current == null || previous == null) {
                colour = 'blue';
            }
            var ragVal = 1;
            var diff = current - previous;
            var diffPercent = (diff / previous) * 100;

            if (!isNaN(diffPercent)) {
                if (diffPercent < -(ragVal)) {
                    colour = 'red';
                }
                else if (diffPercent < 0) {
                    colour = 'amber';
                } else if (diffPercent <= ragVal) {
                    colour = 'amberGreen';
                } else if (diffPercent > ragVal) {
                    colour = 'green';
                }
            }
            this.set('_ragColour', colour);
            return colour;
        }

    }.property('currentVal','previousVal')






});

Dashboard.IndicatorModel.reopenClass({
    values: null
});