/* jshint undef: true, unused: true */
/* global $, d3, c3 */

Dashboard.HeatMapComponent = Ember.Component.extend({
    //margin: { top: 50, right: 0, bottom: 100, left: 30 },
    //width: 900,
    //height: 280,

    isDrawn: false,

    draw: function (myData) {
        //this.set('data', myData);
        //console.log(this.get('data'));
        var chartID = '#' + myData.get('chartID');
        //console.log('Loading C3');
        var valueType = myData.get('valueString');
        var values = myData.get('_dataValues');

        var YMin = 0;
        var YMax = 0;

        var maxVal = Math.max.apply(values, $.map(values,
                function (indicatorValue) {
                    return indicatorValue.value;
                }));
        YMax = maxVal;
        var ragValue = parseFloat(myData.get('RAGValue'));

        if (valueType === '%') {
            maxVal = maxVal / 100;

            var minVal = Math.min.apply(values, $.map(values,
                function (indicatorValue) {
                    return indicatorValue.value;
                }));

            minVal = minVal / 100;


            if (minVal > ragValue) {
                minVal = ragValue;
            }

            if (maxVal < ragValue) {
                maxVal = ragValue;
            }


            minVal = minVal - 0.01;
            maxVal = maxVal + 0.01;


            YMax = maxVal;
            YMin = minVal;
        }

        var xAxis = values.map(function (val) {
            var dateString = (val.year.indexOf('T') === -1 ? val.year : val.year.substr(0, val.year.indexOf('T')));
            return dateString;
        });

        var lineVals = values.map(function (val) {
            if (valueType === '%') {
                return val.value / 100;
            } else {
                return val.value;
            }
        });


        var regions = [];
        if (myData.get('RAGType') === 'Constitutional') {
            // constitution only...
            var amber = ragValue + 0.0099;
            var green = ragValue + 0.01;
            var opacity = 0.3;
            if (valueType === '%') {
                regions = [
                            { axis: 'y', start: 0, end: ragValue, class: 'regionYR', opacity: opacity },
                            { axis: 'y', start: ragValue, end: amber, class: 'regionYA', opacity: opacity },
                            { axis: 'y', start: green, class: 'regionYG', opacity: opacity },
                ];
            } else {
                regions = [
                            { axis: 'y', start: 0, end: ragValue, class: 'regionYG', opacity: opacity },
                            { axis: 'y', start: ragValue, class: 'regionYR', opacity: opacity }
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
                        format: '%b %Y'
                    }
                },
                y: {
                    tick: {
                        format: (valueType === '%' ? d3.format(".1%") : null)
                    },
                    min: YMin,
                    max: YMax,
                    padding: { top: 18, bottom: 0 }
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
                right:20
            },

            regions: regions
        });

        d3.select('.c3-axis.c3-axis-x').attr('clip-path', "");
        this.set('isDrawn', true);
    },

    didInsertElement: function () {
        var data = this.get('controller.data');
        var chartID = '#' + data.get('chartID');
        var chart = $(chartID);

        var accordionContent = chart.parents('.accordionContent');
        var handle = accordionContent.siblings('div[data-indicator-id="' + data.get('ID') + '"]');
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