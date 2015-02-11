/* jshint undef: true, unused: true */
/* global $ */

Dashboard.IndicatorModel = Ember.Object.extend({
    targetValue: null,
    _currentValue: null,
    _currentVal: null,
    previousValue: null,
    _previousVal: null,
    _dataValues: null,
    _currentDate: null,

    currentValue: function () {
        if (this.get('_currentValue') != null) {
            return this.get('_currentValue');
        } else {
            this.get('dataValues');
        }
    }.property('_currentValue'),


    currentVal: function () {
        if (this.get('_currentVal') != null) {
            return this.get('_currentVal');
        } else {
            var val = 0;
            var current = this.get('currentValue');
            if (current != null && current.value != null) {
                val = parseFloat(parseFloat(current.value).toPrecisionDigits(3));
                this.set('_currentVal', val);
                return this.get('_currentVal');
            }
            return val;
        }
    }.property('currentValue'),

    previousVal: function () {
        if (this.get('_previousVal') != null) {
            return this.get('_previousVal');
        } else {
            var val = 0;
            var previous = this.get('previousValue');
            if (previous != null && previous.value != null) {
                val = parseFloat(parseFloat(previous.value).toPrecisionDigits(3));
                this.set('_previousVal', val);
                return this.get('_previousVal');
            }
            return val;
        }
    }.property('previousValue'),

    currentDate: function () {
        if (this.get('_currentDate') != null) {
            return this.get('_currentDate');
        } else {
            var current = this.get('currentValue');
            if (current != null && current.year != null) {
                var sanitizedDate = current.year.cleanDateFormats();
                this.set('_currentDate', sanitizedDate);
                return this.get('_currentDate');
            }
            return '';
        }
    }.property('currentValue'),

    chartID: function () {
        return 'Chart' + this.get('ID');
    }.property(),

    hasValue: function () {
        // Todo: correcting for bad development data e.g. missing values or some have dates like 1968-01-20T00:00:00
        var current = this.get('currentValue');
        if (current == null) {
            return false;
        } else if (current.value != null && current.value.indexOf('T00:') === -1) {
            return true;
        } else {
            return false;
        }
    }.property('currentValue'),

    dataValues: function () {
        if (this.get('_dataValues') != null) {
            return this.get('_dataValues');
        } else {
            var obj = this;

            // Hardcoded Constitutionn Values for demo (no data)
            var constitutionIDs = ['125', '126', '127', '128', '129', '130', '131', '132', '133', '134', '135', '136', '137', '138', '139', '140', '141', '142', '143', '144', '145'];

            if (constitutionIDs.indexOf(obj.get('ID')) !== -1) {

                var rnd = function() {
                    return Math.floor(Math.random()*(110-88+1)+88).toString();
                };

                var results =
                    [{
                        value: rnd(),
                        indicator: "28",
                        year: "2014",
                        period_of_coverage: "1/1/2014 to 31/3/2014",
                    }, {
                        value: rnd(),
                        indicator: "28",
                        year: "2013",
                        period_of_coverage: "1/10/2013 to 31/12/2013",
                    }, {
                        value: rnd(),
                        indicator: "28",
                        year: "2012",
                        period_of_coverage: "1/7/2013 to 30/9/2013",
                    }, {
                        value: rnd(),
                        indicator: "28",
                        year: "2011",
                        period_of_coverage: "1/4/2013 to 30/6/2013",
                    }];

                setTimeout(function () {
                    obj.setProperties({
                        _currentValue: results[0],
                        previousValue: results[1],
                        _dataValues: results
                    });
                }, 500);

                return obj.get('_dataValues');

            } else {
                $.ajax({
                    //url: 'http://54.154.11.196/api/action/datastore_search_sql?sql=SELECT * from "a358a675-fabf-4b6b-9163-f88d2b26e776" WHERE "Indicator id" = ' + "'" + obj.get('ID') + "'" + ' ORDER BY "Year" DESC '
                    url: 'http://54.154.11.196/api/action/datastore_search_sql?sql=SELECT * from "ed59dfc4-3076-4e84-806e-7a47d2321f36" WHERE "indicator_id" = ' + "'" + obj.get('ID') + "'" + ' ORDER BY "year" DESC '

                })
                .then(function (response) {
                    var results = response.result.records;
                    obj.setProperties({
                        _dataValues: results,
                        _currentValue: results[0],
                        previousValue: results[1]
                    });
                    return obj.get('_dataValues');
                });
            }
        }
    }.property(),


    trend: function () {
        switch (this.get('ragColour')) {
            default:
                return 'even';
            case 'green':
            case 'greenAmber':
                return 'up';
            case 'red':
                return 'down';
        }
    }.property('_ragColour'),

    _ragColour: null,

    ragColour: function () {
        if (this.get('_ragColour') !== null) {
            return this.get('_ragColour');
        } else {
            var colour = 'blue';
            //switch this.get('RAGType')
            var current = this.get('currentValue');
            var previous = this.get('previousValue');
            
            if (current == null || previous == null || current.value === null || previous.value === null) {
                colour = 'blue';
            } else {
                current = current.value;
                previous = previous.value;
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

    }.property('currentVal', 'previousVal')






});

Dashboard.IndicatorModel.reopenClass({
    values: null
});