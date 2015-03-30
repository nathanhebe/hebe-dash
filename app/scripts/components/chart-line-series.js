/* jshint undef: true, unused: true */
/* global $, d3, c3 */

Dashboard.ChartLineSeriesComponent = Ember.Component.extend({
    isDrawn: false,

    draw: function (myData) {
        var chartID = '#' + myData.get('chartID');
        var valueType = myData.get('valueString');
        var values = myData.get('activeDateValues'); // myData.get('dataValues');

        //var date_now = new Date();
        //// make surec values only for last 13 months
        //values = $.map(values,function(val) {
        //    var start_date = val.end_date;
        //    var a = moment(date_now);
        //    var b = moment(start_date);
        //    var diffMonths = a.diff(b, 'months');
        //    if (diffMonths < 14) {
        //        return val;
        //    }
        //});

        var YMin = 0;
        var YMax = 0;
        var maxVal = Math.max.apply(values, $.map(values,
                function (indicatorValue) {
                    return indicatorValue.get('val');
                }));
        YMax = maxVal;

        var ragTarget = parseFloat(myData.get('targetVal'));

        if (valueType === '%') {
            var minVal = Math.min.apply(values, $.map(values,
                function (indicatorValue) {
                    return indicatorValue._val;
                })
            );

            if (minVal > ragTarget) {
                minVal = ragTarget;
            }

            if (maxVal < ragTarget) {
                maxVal = ragTarget;
            }
            minVal = minVal - 1;
            maxVal = maxVal + 2;
            YMax = maxVal;
            YMin = minVal;
        }

        var xAxis = values.map(function (val) {
            var dateString = (val.start_date.indexOf('T') === -1 ? val.start_date : val.start_date.substr(0, val.start_date.indexOf('T')));
            return dateString;
        });

        var lineVals = values.map(function (val) {
            var value = val.get('val');
            return value;
        });

        var valueTypeString = (myData.get('valueType') === '%' ? 'Percentage' : 'Value');
        var regions = [];
        if (myData.get('ragType') === 'Constitutional') {
            // constitution only...
            var amber = ragTarget + 0.0099;
            var green = ragTarget + 0.01;
            var opacity = 0.3;
            if (valueType === '%') {
                regions = [
                            { axis: 'y', start: 0, end: ragTarget, class: 'regionYR', opacity: opacity },
                            { axis: 'y', start: ragTarget, end: amber, class: 'regionYA', opacity: opacity },
                            { axis: 'y', start: green, class: 'regionYG', opacity: opacity },
                ];
            } else {
                regions = [
                            { axis: 'y', start: 0, end: ragTarget, class: 'regionYG', opacity: opacity },
                            { axis: 'y', start: ragTarget, class: 'regionYR', opacity: opacity }
                ];
            }
        }

        xAxis.unshift('x');
        lineVals.unshift('Indicator Value');

        c3.generate({
            bindto: chartID,
            legend: {
                hide: true
            },
            data: {
                x: 'x',
                columns: [
                    xAxis,
                    lineVals
                ],
            },
            axis: {
                x: {
                    type: 'timeseries',
                    tick: {
                        format: '%b-%y'
                    },
                    label: {
                        text: 'Change over time',
                        position: 'outer-left',
                        padding: { top: 18, bottom: 0 },
                    }
                },
                y: {
                    tick: {
                        //format: (valueType === '%' ? d3.format("%") : null)
                        format: function (x) { return x.toString() + (valueType === '%' ? '%' : ''); }
                    },
                    min: YMin,
                    max: YMax,
                    padding: { top: 18, bottom: 0 },

                    label: {
                        text: valueTypeString + ' achieved',
                        position: 'outer-bottom'
                    }
                }
            },
            grid: { y: { show: true } },
            point: {
                focus: {
                    expand: {
                        r: 5
                    }
                }
            },

            padding: {
                right: 20
            },

            regions: regions
        });

        d3.select('.c3-axis.c3-axis-x').attr('clip-path', "");
        this.set('isDrawn', true);

        d3.selectAll('.c3-axis-x-label').attr('y', "2.5em");
    },

    didInsertElement: function () {
        var data = this.get('controller.data');
        var chartID = '#' + data.get('chartID');
        var chart = $(chartID);

        var accordionContent = chart.parents('.accordionContent');
        var handle = accordionContent.parent().siblings('.row[data-indicator-id="' + data.get('id') + '"]');
        var obj = this;
        handle.click(function () {
            if (!obj.get('isDrawn')) {
                setTimeout(function () {
                    obj.draw(data);
                }, 1000);
            }
        });
    }
});