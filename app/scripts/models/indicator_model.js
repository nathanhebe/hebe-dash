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
    _periodOfCoverage: null,
    _trend: null,
    _ragColour: null,

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
            if (current != null && current.get('val') != null) {
                val = parseFloat(parseFloat(current.get('val')).toPrecisionDigits(3));
                this.set('_currentVal', val);
                return this.get('_currentVal');
            } else {
                return 'noData';
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
            if (previous != null && previous.get('val') != null) {
                val = parseFloat(parseFloat(previous.get('val')).toPrecisionDigits(3));
                this.set('_previousVal', val);
                return this.get('_previousVal');
            } else {
                //this.set('_previousVal', 'noData');
                return 'noData';
            }
            return val;
        }
    }.property('previousValue'),

    currentDate: function () {
        if (this.get('_currentDate') != null) {
            return this.get('_currentDate');
        } else {
            var current = this.get('currentValue');
            if (current != null && current.date != null) {
                var sanitizedDate = current.date.cleanDateFormats();
                this.set('_currentDate', sanitizedDate);
                return this.get('_currentDate');
            }
            return '';
        }
    }.property('currentValue'),

    periodOfCoverage: function () {
        if (this.get('_periodOfCoverage') != null) {
            return this.get('_periodOfCoverage');
        } else {
            var current = this.get('currentValue');
            if (current != null) {
                var period_of_coverage = current.start_date; //current.period_of_coverage;
                var ragType = this.get('ragType');
                if (ragType === "Constitutional" && period_of_coverage !== null && period_of_coverage !== '') {
                    this.set('_periodOfCoverage', period_of_coverage);
                } else {
                    var date = this.get('currentDate');
                    this.set('_periodOfCoverage', date);
                }
            }
            return this.get('_periodOfCoverage');
        }
    }.property('currentDate', '_currentValue'),

    getRAGTarget: function () {
        if (this.get('ragTarget') !== null && this.get('valueString') === '%') {
            return this.get('ragTarget') * 100;
        }
        return this.get('ragTarget');
    }.property('ragTarget'),

    chartID: function () {
        return 'Chart' + this.get('id');
    }.property(),

    hasValue: function () {
        //return true;
        // Todo: correcting for bad development data e.g. missing values or some have dates like 1968-01-20T00:00:00
        var current = this.get('currentValue');
        if (current == null) {
            return false;
        } else if (current.get('val') != null && current.get('val').toString().indexOf('T00:') === -1) {
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

            $.ajax({
                //url: 'http://54.154.11.196/api/action/datastore_search_sql?sql=SELECT * from "a358a675-fabf-4b6b-9163-f88d2b26e776" WHERE "Indicator id" = ' + "'" + obj.get('id') + "'" + ' ORDER BY "Year" DESC '
                //url: 'http://54.154.11.196/api/action/datastore_search_sql?sql=SELECT * from "ed59dfc4-3076-4e84-806e-7a47d2321f36" WHERE "indicator_id" = ' + "'" + obj.get('id') + "'" + ' ORDER BY "year" DESC '
                //url: 'https://data.england.nhs.uk/api/action/datastore_search_sql?sql=SELECT * from "bbbd5e7a-54ae-44d7-9426-8edb02a51cbe" WHERE "indicator_id" = ' + "'" + obj.get('id') + "'" + ' ORDER BY "date" DESC '
                url: 'https://data.england.nhs.uk/api/action/datastore_search_sql?sql=SELECT * from "56879843-edf2-4b66-a8e1-f27a91befb7a" WHERE "indicator_id" = ' + "'" + obj.get('id') + "'" + ' ORDER BY "start_date" DESC '
            })
            .then(function (response) {
                var results = [];
                var valueType = obj.get('valueType');
                response.result.records.forEach(function (record) {
                    results.push(Dashboard.IndicatorValueModel.create(_.extend(record, { valueType: valueType })));
                });
                obj.setProperties({
                    _dataValues: results,
                    _currentValue: results[0],
                    previousValue: results[1]
                });
                return obj.get('_dataValues');
            });
        }
    }.property(),

    trend: function () {
        if (this.get('currentVal') != null && this.get('previousVal') != null) {
            var current = this.get('currentVal');
            var previous = this.get('previousVal');
            var direction = this.get('desiredDirection');

            var trend = 'even';
            switch (direction) {
                default:
                    // up
                    if (current === previous) {
                        trend = 'even';
                    } else if (current > previous) {
                        trend = 'up';
                    } else {
                        trend = 'down';
                    }
                    break;
                case "Down":
                    if (current === previous) {
                        trend = 'even';
                    } else if (current < previous) {
                        trend = 'up';
                    } else {
                        trend = 'down';
                    }
                    break;
            }
            return trend;
        }
        return 'notrend';
    }.property('_currentVal', '_previousVal'),

    ragColour: function () {
        if (this.get('_ragColour') != null) {
            return this.get('_ragColour');
        } else {
            var colour = null;
            //switch this.get('ragType')
            var current = this.get('currentValue');
            var previous = this.get('previousValue');

            this.set('_ragColour', this.calculateRAG());
            return this.get('_ragColour');
        }


        //if (this.get('ragType') === "Constitutional") {
        //    return this.calculateRAG();
        //}

        ////console.log('current = ' + current + ', previous = ' + previous);

        //if (current == null || previous == null || current.get('val') === null || previous.get('val') === null) {
        //    return 'blue';
        //} else {
        //    current = current.get('val');
        //    previous = previous.get('val');
        //}
        //var ragVal = 1;
        //var diff = current - previous;
        //var diffPercent = (diff / previous) * 100;

        //if (!isNaN(diffPercent)) {
        //    if (diffPercent < -(ragVal)) {
        //        colour = 'red';
        //    }
        //    else if (diffPercent < 0) {
        //        colour = 'amber';
        //    } else if (diffPercent <= ragVal) {
        //        colour = 'amberGreen';
        //    } else if (diffPercent > ragVal) {
        //        colour = 'green';
        //    }
        //}
        //if (colour == null) {
        //    return 'blue';
        //} else {
        //    this.set('_ragColour', colour);
        //    return this.get('_ragColour');
        //}
        //}
    }.property('currentVal', 'previousVal'),

    valueString: function () {
        return (this.get('valueType') === 'int' ? '' : this.get('valueType'));
    }.property('valueType'),

    regionalInfo: function () {
        // e.g. https://data.england.nhs.uk/api/action/datastore_search_sql?sql=SELECT * from "dc7afa72-9d36-42da-b66a-851fe3e55855" WHERE "Level description" LIKE 'North Yorkshire' AND "Gender" = 'Female'  
    },

    calculateRAG: function () {
        switch (this.get('ragType')) {
            case "Constitutional":
                return this.get('constitutionalRAG');
            case "Standard":
                return this.get('standardRAG');
            case "Confidence":
                return this.get('confidenceRAG');
            default:
                return 'noRAG';
        }
        /*
        Type of data (col Q in feedsheet is for ValueType in our config
        Units (colP in feedsheet would be good for additional metadata on UI for the indicators)
        Org. Level Data (ColH in feedsheet)
            - can be used on Dashboards etc to inform to what level data can be drilled down

        ragPercentChangeToUse Add a percent change value (most will be 1% - but at least can be overriden per indicator if required (% Change to use if no CI ColF in Feedsheet))

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
                
                SET THE PERCENTAGE USED IN THE CALCULATIONS BELOW TO THE ragPercentChangeToUse FROM THE CONFIG

                (IF DESIRED DIRECTION IS UP)
                is Val2 > Val1 (+1%) = GREEN
                Is Val2 < Val -(1%) = red
                Else Amber

                (IF DESIRED DIRECTION IS DOWN)
                Is Val2 < Val1 (-1%) = green
                Va2 > Val2 + 1% = red
                else Amber



            CONSTITUTIONAL 
            SET THE PERCENTAGE USED IN THE CALCULATIONS BELOW TO THE ragPercentChangeToUse FROM THE CONFIG
                e.g. instead of +/- 1%    +/-PercentValue

            (if equalled it - they've achieved it)
            If the value is less than the stated value  (RAGTarget - FEEDSHEET > CURRENT RAG > Col D)
            Values  change very rarely - ADD TO METADATA

            if(current > RAGTarget + 1%) = green
            else if(current < RAGTarget) = red
            else amber



        */
    },

    constitutionalRAG: function () {
        console.log('constitutionalRAG');
        var rag = null;
        if (this.get('currentValue') != null) {
            rag = 'amber';
            var current = this.get('currentValue').get('val'); //this.get('currentValue').get('val');
            //if (this.get('ragTarget') != null && this.get('valueString') == '%') {
            //    return this.get('ragTarget') * 100;
            //}

            var ragTarget = this.get('ragTarget');
            ragTarget = (this.get('valueString') === '%' ? (ragTarget * 100) : ragTarget);
            console.log('ragTarget : ' + ragTarget);
            var upper = ragTarget + 1;
            //var lower = ragTarget - 1;

            if (this.get('valueString') !== "%") {
                if (current > ragTarget) {
                    return 'red';
                } else {
                    return 'green';
                }
            }

            if (current > upper) {
                rag = 'green';
            } else if (current < ragTarget) {
                rag = 'red';
            }
        }
        return rag;
    }.property('ragTarget', 'valueString', 'currentValue'),

    standardRAG: function () {
        console.log('standardRAG');
        //STANDARD
        //SAME AS ABOVE - BUT UCI/LCI ETC ARE CALCULATED BASED ON (% Change to use if no CI COLF FEEDSHEET) (1%)

        //SET THE PERCENTAGE USED IN THE CALCULATIONS BELOW TO THE ragPercentChangeToUse FROM THE CONFIG

        //(IF DESIRED DIRECTION IS UP)
        //is Val2 > Val1 (+1%) = GREEN
        //Is Val2 < Val -(1%) = red
        //Else Amber

        //(IF DESIRED DIRECTION IS DOWN)
        //Is Val2 < Val1 (-1%) = green
        //Va2 > Val2 + 1% = red
        //else Amber
        var rag = null;
        if (this.get('currentValue') != null && this.get('previousValue') != null) {
            var current = this.get('currentValue').get('val');
            var previous = this.get('previousValue').get('val');
            var direction = this.get('desiredDirection');
            var percent = (this.get('ragPercentChangeToUse') != null ? this.get('ragPercentChangeToUse') : 0.01);
            rag = 'amber';
            if (direction === 'Up') {
                if (current > (previous * (1 + percent))) {
                    rag = 'green';
                } else if (current < (previous * (1 - percent))) {
                    rag = 'red';
                }
            } else {
                if (current < (previous * (1 - percent))) {
                    rag = 'green';
                } else if (current > (previous * (1 + percent))) {
                    rag = 'red';
                }
            }
        }
        return rag;

    }.property('ragTarget', 'valueString', 'currentValue'),

    confidenceRAG: function () {
        console.log('confidenceRAG');
        //period of reporting
        //UCI

        //LCI

        //IMPORTANT - select the operator based on the DESIRED DIRECTION FIELD (e.g. up  = >   down  = <
        //IMPORTANT - The Previous period is defined by RAG Methodology (colX in feedsheet)
        //            - compare this to tType of Data (colN in feedsheet) to decide how far back comparative period
        //if(current.LCI > previous 
        //    if(LCI2 > LCI1) {
        //        green
        //    } else if(UCI1 > UCI2) {
        //        red
        //    } else {
        //        amber
        //    }

        var rag = null;
        if (this.get('currentValue') != null) {
            var current = this.get('currentValue');
            var currentVal = current.get('val');
            var direction = this.get('desiredDirection');
            var uci = current.get('upperCI');
            var lci = current.get('lowerCI');
            console.log('uci:' + uci + ',lci:' + lci + ',val:' + currentVal);
            rag = 'amber';
            if (direction === 'Up') {
                if (currentVal > uci) {
                    rag = 'green';
                } else if (currentVal < lci) {
                    rag = 'red';
                }
            } else {
                if (currentVal < uci) {
                    rag = 'green';
                } else if (currentVal > lci) {
                    rag = 'red';
                }
            }
            console.log('RAG ' + rag);

        }
        return rag;
    }.property('ragTarget', 'valueString', 'currentValue')
});

Dashboard.IndicatorModel.reopenClass({
    values: null
});