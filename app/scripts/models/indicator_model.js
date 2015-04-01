/* jshint undef: true, unused: true */
/* global $ */

Dashboard.IndicatorModel = Ember.Object.extend({
    targetValue: null,
    _currentValue: null,
    _currentVal: null,
    _previousValue: null,
    _previousVal: null,
    _currentDate: null,
    _periodOfCoverage: null,
    _trend: null,
    _ragColour: null,

    _title: null,
    title: function (key, titleString) {
        if (arguments.length === 1) {
            return this.get('_title');
        } else {
            titleString = titleString.fixChars();
            this.set('_title', titleString);
            return titleString;
        }
    }.property('_title'),

    _subTitle: null,
    subTitle: function (key, titleString) {
        if (arguments.length === 1) {
            return this.get('_subTitle');
        } else {
            titleString = titleString.fixChars();
            this.set('_subTitle', titleString);
            return titleString;
        }
    }.property('_title'),

    _description: null,
    description: function (key, descriptionString) {
        if (arguments.length === 1) {
            return this.get('_description');
        } else {
            descriptionString = descriptionString.fixChars();
            this.set('_description', descriptionString);
            return descriptionString;
        }
    }.property('_description'),

    mainTitle: function () {
        var title = (this.get('subTitle') == null || this.get('subTitle').length === 0
            ? this.get('_title') : this.get('subTitle'));
        return title;
    }.property("_title", "subTitle"),

    currentValue: function () {
        if (this.get('_currentValue') != null) {
            return this.get('_currentValue');
        } else if (this.get('dataValues') == null) {
            this.get('dataValues');
            return null;
        } else {
            var current = this.get('dataValues')[0];
            this.set('_currentValue', current);
            return this.get('currentValue');
        }
    }.property('dataValues', '_currentValue'),

    previousValue: function () {
        if (this.get('_previousValue') != null) {
            return this.get('_previousValue');
        } else if (this.get('dataValues') == null) {
            this.get('dataValues');
            return null;
        } else {
            var previous = this.get('dataValues')[1];
            this.set('_previousValue', previous);
            return this.get('_previousValue');
        }
    }.property('dataValues', '_previousValue'),

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
                return null;
            }
            return val;
        }
    }.property('currentValue'),

    targetVal: function () {
        var target = (this.get('valueString') === '%' ? (this.get('ragTarget') * 100) : this.get('ragTarget'));
        return target;
    }.property('ragTarget'),

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
                return null;
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
                var period_of_coverage = current.date; //current.period_of_coverage;
                this.set('_periodOfCoverage', period_of_coverage);
                //var ragType = this.get('ragType');
                //if (ragType === "Constitutional" && period_of_coverage !== null && period_of_coverage !== '') {
                //    this.set('_periodOfCoverage', period_of_coverage);
                //} else {
                //    var date = this.get('currentDate');
                //    this.set('_periodOfCoverage', date);
                //}
            }
            return this.get('_periodOfCoverage');
        }
    }.property('currentDate', '_currentValue'),

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

    showChart: function () {
        return (this.get('currentValue') != null && this.get('previousValue') != null && this.get('activeDateValues') != null && this.get('activeDateValues').length > 1);
    }.property('activeDateValues', 'currentValue', 'previousValue'),

    activeDateValues: function () {
        // only return values within the current date range
        var values = this.get('dataValues');
        var dataType = this.get('ragTypeOfData');

        switch (dataType) {
            default:
                var dateRangeMonths = 14;
                var date_now = new Date();
                if (values != null) {
                    values = $.map(values, function (val) {
                        var start_date = val.end_date;
                        var a = moment(date_now);
                        var b = moment(start_date);
                        var diffMonths = a.diff(b, 'months');
                        if (diffMonths <= dateRangeMonths) {
                            return val;
                        }
                    });
                }
                break;
            case 'Financial':
            case 'Calendar':
            case 'Quarterly':
                var date_now = new Date();
                if (values != null) {
                    // only display up to last 5 data points
                    values = values.slice(0, 5);
                }
                break;
        }

        return values;
    }.property('dataValues'),

    _dataValues: null,
    dataValues: function (key, newDataValues) {
        if (arguments.length === 1) {
            if (this.get('_dataValues') == null) {
                this.getDataValues();
            }
            return this.get('_dataValues');
        } else {
            this.set('_dataValues', newDataValues);
            return newDataValues;
        }
    }.property('_dataValues'),

    getDataValues: function () {
        var obj = this;
        var ckanUrl = Dashboard.get('settings').get('ckanUrl');
        var dataUrl = Dashboard.get('settings').get('dataUrl');
        $.ajax({
            url: dataUrl + ' WHERE "indicator_id" = ' + "'" + obj.get('id') + "'" + ' ORDER BY "start_date" DESC '
        })
        .then(function (response) {
            var results = [];
            var valueType = obj.get('valueType');
            response.result.records.forEach(function (record) {
                results.push(Dashboard.IndicatorValueModel.create(_.extend(record, { valueType: valueType })));
            });
            obj.setProperties({
                dataValues: results
            });
        });
    },

    trend: function () {
        if (this.get('currentVal') != null && this.get('previousVal') != null) {
            var ragType = this.get('ragType');
            var numberOfDataPoints = this.get('dataValues').length;
            if (ragType == 'None' || numberOfDataPoints <= 2) {
                return 'noTrend';
            }

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

    valueString: function () {
        return (this.get('valueType') === 'int' ? '' : this.get('valueType'));
    }.property('valueType'),

    getRAGTarget: function () {
        if (this.get('ragTarget') !== null && this.get('valueString') === '%') {
            return this.get('ragTarget') * 100;
        }
        return this.get('ragTarget');
    }.property('ragTarget'),

    ragColour: function () {
        if (this.get('currentValue') != null) {
            var colour = null;
            var current = this.get('currentValue');
            var previous = this.get('previousValue');
            colour = this.calculateRAG();

            if (colour != this.get('_ragColour') && colour != null) {
                this.set('_ragColour', colour);
            }
        }
        return this.get('_ragColour');
    }.property('currentValue'),

    previousRagColour: function () {
        var previous = this.get('previousVal');
        if (previous != null) {
            switch (this.get('ragType')) {
                case "Constitutional":
                    return this.constitutionalRAG(previous);
                case "Standard":
                    var previousValue = this.get('previousValue');
                    var previousIndex = 0;
                    // get dataValue index of previous
                    this.get('dataValues').forEach(function (item, index, enumerable) {
                        if (item.get('start_date') == previousValue.get('start_date')
                            && item.get('end_date') == previousValue.get('end_date')
                            && item.get('value') == previousValue.get('value')) {
                            previousIndex = index;
                            return true;
                        }
                    });
                    // check if any values before that
                    if (previousIndex > 0 && this.get('dataValues').length > (previousIndex + 1)) {
                        var itemForComparison = this.get('dataValues')[(previousIndex + 1)];
                        // if so pass that value through as second param
                        if (itemForComparison != null) {
                            return this.standardRAG(previous, itemForComparison.get('val'));
                        }
                    }
                    else {
                        // else return 'noRAG'
                        return 'noRAG';
                    }
                case "Confidence":
                    return this.confidenceRAG(previous);
                default:
                    return 'noRAG';
            }
        }
    },

    calculateRAG: function () {
        var ragType = this.get('ragType');
        if (ragType == 'None') {
            return 'none';
        }

        var numberOfDataPoints = this.get('dataValues').length;
        if (numberOfDataPoints <= 2) {
            return 'noRAG';
        }

        switch (this.get('ragType')) {
            case "Constitutional":
                return this.constitutionalRAG();
            case "Standard":
                return this.standardRAG();
            case "Confidence":
                return this.confidenceRAG();
            default:
                return 'noRAG';
        }
    },

    constitutionalRAG: function (valueToUse) {
        var rag = null;
        if (valueToUse == null) {
            valueToUse = (this.get('currentValue') != null ? this.get('currentValue').get('val') : null);
        }
        if (valueToUse != null) {
            rag = 'amber';
            var current = valueToUse;
            var ragTarget = this.get('targetVal');
            var direction = this.get('desiredDirection');
            var percentChange = (this.get('ragPercentChangeToUse') != null ? this.get('ragPercentChangeToUse') : 0.01) * 100;
            var upper = ragTarget + percentChange; // percentChangedesired
            var lower = ragTarget - percentChange;

            if (direction === 'Up') {
                if (this.get('valueString') !== "%") {
                    if (current < ragTarget) {
                        return 'red';
                    } else if (current >= ragTarget) {
                        return 'green';
                    }
                } else {
                    if (current < ragTarget) {
                        rag = 'red';
                    } else if (current > upper) {
                        rag = 'green';
                    }
                }
            } else {
                if (this.get('valueString') !== "%") {
                    if (current > ragTarget) {
                        return 'red';
                    } else if (current <= ragTarget) {
                        return 'green';
                    }
                } else {
                    if (current > ragTarget) {
                        rag = 'red';
                    } else if (current <= lower) {
                        rag = 'green';
                    }
                }
            }
        }
        return rag;
    },

    standardRAG: function (valueToUse, previousValueToUse) {
        var rag = null;
        if (valueToUse == null) {
            valueToUse = (this.get('currentValue') != null ? this.get('currentValue').get('val') : null);
        }
        if (previousValueToUse == null) {
            previousValueToUse = (this.get('previousValue') != null ? this.get('previousValue').get('val') : null);
        }
        if (valueToUse != null && previousValueToUse != null) {
            var current = valueToUse;
            var previous = previousValueToUse;
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

    },

    confidenceRAG: function (valueToUse, uci, lci) {
        var rag = null;
        var current = this.get('currentValue');

        if (valueToUse == null) {
            valueToUse = (current != null ? current.get('val') : null);
        }
        if (uci == null && current != null) {
            uci = current.get('upperCI');
        }
        if (lci == null && current != null) {
            var lci = current.get('lowerCI');
        }

        if (valueToUse != null) {
            var currentVal = valueToUse;
            var direction = this.get('desiredDirection');
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
        }
        return rag;
    }

});




Dashboard.IndicatorModel.reopenClass({
    values: null
});




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

//if (this.get('_ragColour') != null) {
//    return this.get('_ragColour');
//} else {
//}


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