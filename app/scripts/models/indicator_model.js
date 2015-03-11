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

    _periodOfCoverage: null,
    periodOfCoverage: function () {
        if (this.get('_periodOfCoverage') != null) {
            return this.get('_periodOfCoverage');
        } else {
            var current = this.get('currentValue');
            if (current != null) {
                var period_of_coverage = current.period_of_coverage;
                var ragType = this.get('RAGType');
                if (ragType === "Constitutional" && period_of_coverage !== null && period_of_coverage !== '') {
                    this.set('_periodOfCoverage', period_of_coverage);
                } else {
                    var year = this.get('currentDate');
                    this.set('_periodOfCoverage', year);
                }
            }
            return this.get('_periodOfCoverage');
        }
    }.property('currentDate'),



    getRAGValue: function () {
        if (this.get('RAGValue') !== null && this.get('valueString') === '%') {
            return this.get('RAGValue') * 100;
        }
        return this.get('RAGValue');
    }.property('RAGValue'),


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
            var constitutionIDs = ['125', '126', '127', '128', '129', '130', '131', '132', '133', '134', '135', '136', '137', '138', '139', '140', '141', '142', '143', '144', '145', '65'];



            //var constitutionData = [

            //    { indicator_id: '125', year: '2015-01-01', value: '97' },
            //    { indicator_id: '126', year: '2015-01-01', value: '89' },
            //    { indicator_id: '127', year: '2015-01-01', value: '95' },
            //    { indicator_id: '128', year: '2015-01-01', value: '93' },
            //    { indicator_id: '129', year: '2015-01-01', value: '381.00' },
            //    { indicator_id: '130', year: '2015-01-01', value: '99' },
            //    { indicator_id: '131', year: '2015-01-01', value: '93' },
            //    { indicator_id: '132', year: '2015-01-01', value: '94' },
            //    { indicator_id: '133', year: '2015-01-01', value: '94' },
            //    { indicator_id: '134', year: '2015-01-01', value: '98' },
            //    { indicator_id: '135', year: '2015-01-01', value: '96' },
            //    { indicator_id: '136', year: '2015-01-01', value: '1.00' },
            //    { indicator_id: '137', year: '2015-01-01', value: '97' },
            //    { indicator_id: '138', year: '2015-01-01', value: '83' },
            //    { indicator_id: '139', year: '2015-01-01', value: '94' },
            //    { indicator_id: '140', year: '2015-01-01', value: '89' },
            //    { indicator_id: '141', year: '2015-01-01', value: '72' },
            //    { indicator_id: '142', year: '2015-01-01', value: '68' },
            //    { indicator_id: '143', year: '2015-01-01', value: '94' },
            //    { indicator_id: '144', year: '2015-01-01', value: '247.00' },
            //    { indicator_id: '145', year: '2015-01-01', value: '4' },

            //    { indicator_id: '125', year: '2014', value: '97' },
            //    { indicator_id: '126', year: '2014', value: '88' },
            //    { indicator_id: '127', year: '2014', value: '95' },
            //    { indicator_id: '128', year: '2014', value: '93' },
            //    { indicator_id: '129', year: '2014', value: '362.00' },
            //    { indicator_id: '130', year: '2014', value: '99' },
            //    { indicator_id: '131', year: '2014', value: '95' },
            //    { indicator_id: '132', year: '2014', value: '94' },
            //    { indicator_id: '133', year: '2014', value: '90' },
            //    { indicator_id: '134', year: '2014', value: '98' },
            //    { indicator_id: '135', year: '2014', value: '96' },
            //    { indicator_id: '136', year: '2014', value: '1.00' },
            //    { indicator_id: '137', year: '2014', value: '97' },
            //    { indicator_id: '138', year: '2014', value: '84' },
            //    { indicator_id: '139', year: '2014', value: '94' },
            //    { indicator_id: '140', year: '2014', value: '90' },
            //    { indicator_id: '141', year: '2014', value: '721' },
            //    { indicator_id: '142', year: '2014', value: '70' },
            //    { indicator_id: '143', year: '2014', value: '94' },
            //    { indicator_id: '144', year: '2014', value: '205.00' },
            //    { indicator_id: '145', year: '2014', value: '5' }
            //];


            if (constitutionIDs.indexOf(obj.get('ID')) !== -1) {

                $.ajax({
                    url: 'http://54.154.11.196/api/action/datastore_search_sql?sql=SELECT * from "ff58da5b-297e-478a-a3e8-65b54b82d840" WHERE "indicator_id" = ' + "'" + obj.get('ID') + "'" + ' ORDER BY "year" DESC '

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





                // resource_id = 'ff58da5b-297e-478a-a3e8-65b54b82d840'

                //var rnd = function () {
                //    return utils.random(4, 110).toString();
                //};

                //var results = constitutionData.filterBy('indicator_id', obj.get('ID'));
                //var current = results[0];
                //var previous = results[1];

                //setTimeout(function () {
                //    obj.setProperties({
                //        _currentValue: current,
                //        previousValue: previous,
                //        _dataValues: results
                //    });
                //}, 200);





                //return obj.get('_dataValues');

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
        if (this.get('currentValue') != null) {
            var current = this.get('currentValue').value;
            var previous = this.get('previousValue').value;
            var direction = this.get('DesiredDirection');

            //console.log('current: ' + current + ', previous: ' + previous);
            switch (direction) {
                default:
                    // up
                    if (current === previous) {
                        return 'even';
                    } else if (current > previous) {
                        return 'up';
                    } else {
                        return 'down';
                    }
                    break;
                case "Down":
                    if (current === previous) {
                        return 'even';
                    } else if (current < previous) {
                        return 'up';
                    } else {
                        return 'down';
                    }
                    break;
            }
        }
        return 'notrend';

        //switch (this.get('ragColour')) {
        //    default:
        //        return 'even';
        //    case 'green':
        //    case 'greenAmber':
        //        return 'up';
        //    case 'red':
        //        return 'down';
        //}
    }.property('_ragColour','_currentValue'),

    _ragColour: null,

    ragColour: function () {
        if (this.get('_ragColour') !== null) {
            return this.get('_ragColour');
        } else {
            var colour = 'blue';
            //switch this.get('RAGType')
            var current = this.get('currentValue');
            var previous = this.get('previousValue');

            if (this.get('RAGType') === "Constitutional") {
                return this.calculateRAG();
            }

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

    }.property('_currentVal', '_previousVal'),

    valueString: function () {
        return (this.get('ValueType') === 'int' ? '' : this.get('ValueType'));
    }.property('ValueType'),

    regionalInfo: function () {
        // e.g. https://data.england.nhs.uk/api/action/datastore_search_sql?sql=SELECT * from "dc7afa72-9d36-42da-b66a-851fe3e55855" WHERE "Level description" LIKE 'North Yorkshire' AND "Gender" = 'Female'  
    },

    calculateRAG: function () {

        /*
        Type of data (col Q in feedsheet is for ValueType in our config
        Units (colP in feedsheet would be good for additional metadata on UI for the indicators)
        Org. Level Data (ColH in feedsheet)
            - can be used on Dashboards etc to inform to what level data can be drilled down

        PercentChangeValue Add a percent change value (most will be 1% - but at least can be overriden per indicator if required (% Change to use if no CI ColF in Feedsheet))

        Frequency of data (imply the range from E.g type of data)

        
        3 = ConsitutionalStandard
        2 = Confidence Intervals
        1 = standard

        Feedsheet > Current Rag > Rag Classification > Rag Type

        if confidence interval?
            period of reporting
                UCI

                LCI

                IMPORTANT - select the operator based on the DESIRED DIRECTION FIELD (e.g. up  = >   down  = <
                IMPORTANT - The Previous period is defined by RAG Methodology (colX in feedsheet)
                            - compare this to tType of Data (colN in feedsheet) to decide how far back comparative period




                if(current.LCI > previous 

                if(LCI2 > LCI1) {
                    green
                } else if(UCI1 > UCI2) {
                    red
                } else {
                    amber
                }


            STANDARD
                SAME AS ABOVE - BUT UCI/LCI ETC ARE CALCULATED BASED ON (% Change to use if no CI COLF FEEDSHEET) (1%)
                
                SET THE PERCENTAGE USED IN THE CALCULATIONS BELOW TO THE PercentChangeValue FROM THE CONFIG

                (IF DESIRED DIRECTION IS UP)
                is Val2 > Val1 (+1%) = GREEN
                Is Val2 < Val -(1%) = red
                Else Amber

                (IF DESIRED DIRECTION IS DOWN)
                Is Val2 < Val1 (-1%) = green
                Va2 > Val2 + 1% = red
                else Amber



            CONSTITUTIONAL 
            SET THE PERCENTAGE USED IN THE CALCULATIONS BELOW TO THE PercentChangeValue FROM THE CONFIG
                e.g. instead of +/- 1%    +/-PercentValue

            (if equalled it - they've achieved it)
            If the value is less than the stated value  (RAGValue - FEEDSHEET > CURRENT RAG > Col D)
            Values  change very rarely - ADD TO METADATA

            if(current > RAGValue + 1%) = green
            else if(current < RAGValue) = red
            else amber



        */

        // Constitutional
        var rag = 'amber';
        if (this.get('currentValue') != null) {
            var current = this.get('currentValue').value; //this.get('currentValue').value;
            //if (this.get('RAGValue') != null && this.get('valueString') == '%') {
            //    return this.get('RAGValue') * 100;
            //}

            var ragValue = this.get('RAGValue');
            ragValue = (this.get('valueString') === '%' ? (ragValue * 100) : ragValue);



            var upper = ragValue + 1;
            //var lower = ragValue - 1;


            if (this.get('valueString') !== "%") {
                if (current > ragValue) {
                    return 'red';
                } else {
                    return 'green';
                }
            }

            if (current > upper) {
                rag = 'green';
            } else if (current < ragValue) {
                rag = 'red';
            }
        }

        return rag;
    }

    //calculateRAGRating: function() {
    //    var previous = 1;
    //    var current = 1;
    //    var target = 1;

    //    var ragType = 'constitution';

    //    // constitution within 1% of target it is amber


    //}



});

Dashboard.IndicatorModel.reopenClass({
    values: null
});