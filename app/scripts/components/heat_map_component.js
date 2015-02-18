/* jshint undef: true, unused: true */
/* global $, d3, c3 */

Dashboard.HeatMapComponent = Ember.Component.extend({
    //margin: { top: 50, right: 0, bottom: 100, left: 30 },
    //width: 900,
    //height: 280,

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

        if (valueType === '%') {
            maxVal = maxVal / 100;


            var minVal = Math.min.apply(values, $.map(values,
                function (indicatorValue) {
                    return indicatorValue.value;
                }));

            minVal = minVal / 100;

            var ragValue = parseFloat(myData.get('RAGValue'));
            //var amber = ragValue + 0.0099;
            //var green = ragValue + 0.01;

            if (minVal > ragValue) {
                minVal = (ragValue - 0.01);
                console.log('SETTING minVal to rag...' + minVal);
            }

            if (maxVal < (ragValue + 0.01)) {
                maxVal = (ragValue + 0.01);
                console.log('SETTING maxVal to rag...' + maxVal);
            }


            YMax = maxVal;
            YMin = minVal;

        }

        //console.log('min = ' + YMin);
        //console.log('max = ' + YMax);




        var xAxis = values.map(function (val) {
            var dateString = (val.year.indexOf('T') === -1 ? val.year : val.year.substr(0, val.year.indexOf('T')));
            return dateString;
            //if (dateString.indexOf('Q') > -1) {
            //    var seperator = '-';
            //    var seperatorLocation = dateString.indexOf(seperator);

            //    startYear = dateString.substr(0, seperatorLocation);
            //    secondYear = dateString.substr((seperatorLocation + 1), 2);

            //    quarter = dateString.substr((dateString.indexOf('Q') +1), 1);

            //    var startMonthDateString = '';
            //    switch (quarter) {
            //        default:
            //            startMonthDateString = startYear + '-' + '04-01';
            //            break;
            //        case "2":
            //            startMonthDateString = startYear + '-' + '07-01';
            //            break;
            //        case "3":
            //            startMonthDateString = startYear + '-' + '10-01';
            //            break;
            //        case "4":
            //            startMonthDateString = (parseInt(startYear,10) + 1) + '-' + '01-01';
            //            break;
            //    }
            //    /*
            //    Q1 = 04-01
            //    Q2 = 07-01
            //    Q3 = 10-01
            //    Q4 = 01-01
            //    */

            //    var date = new Date(startMonthDateString);

            //    return date;
            //}
            // return new Date(val.year.split(/[\.,-\/#!$%\^&\*;:{}=\-_`~() ]/g)[0]);
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
            var ragValue = parseFloat(myData.get('RAGValue'));
            var amber = ragValue + 0.0099;
            var green = ragValue + 0.01;

            if (valueType === '%') {
                regions = [
                            { axis: 'y', start: 0, end: ragValue, class: 'regionYR' },
                            { axis: 'y', start: ragValue, end: amber, class: 'regionYA' },
                            { axis: 'y', start: green, class: 'regionYG' },
                ];
            } else {
                regions = [
                            { axis: 'y', start: 0, end: ragValue, class: 'regionYG' },
                            { axis: 'y', start: ragValue, class: 'regionYR' }
                ];
            }
        }







        xAxis.unshift('x');
        lineVals.unshift('Current');

        c3.generate({
            bindto: chartID,
            //size: {
            //    width: '1360'
            //},
            data: {
                x: 'x',
                columns: [
                    xAxis,
                    lineVals
                ],
                // type: 'spline',
            },
            axis: {
                x: {
                    type: 'timeseries',
                    tick: {
                        //format: '%Y'
                        //format : '%Y-%m-%d'
                        format: '%b %Y'
                        //format: '%b'
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

            point: {
                focus: {
                    expand: {
                        r: 5
                    }
                }
            },

            regions: regions

        });








        //var chart = $(chartID);
        //var svg = chart.find('svg:first');
        //svg.attr('viewBox', "0 0 1360 350");
        //svg.attr('preserveAspectRatio', "xMidYMid");

        //var aspect = 1360 / 350;

        //var accordionContent = chart.closest('.accordionContent');
        //var id = accordionContent.attr('data-indicator-id');

        //var handle = accordionContent.siblings('.row[data-indicator-id="' + id + '"]').find('.accordionHandle');
        //handle.click(function () {
        //    console.log('resizing chart = ' + accordionContent.width());
        //    var targetWidth = accordionContent.width() - 100;
        //    svg.attr("width", targetWidth);
        //    svg.attr("height", targetWidth / aspect);
        //});










        //$(window).on("resize", function () {
        //    console.log('resizing chart');
        //    var targetWidth = svg.parent().width();
        //    svg.attr("width", targetWidth);
        //    svg.attr("height", targetWidth / aspect);
        //});
    },

    didInsertElement: function () {
        var data = this.get('controller.data');
        //var hotnessArray = [];
        //for (var i = 0; i < data.length; i++) {
        //    var date = new Date(data[i].get('timestamp'));
        //    var row = {};
        //    row.day = date.getDay() + 1;
        //    row.hour = date.getHours() + 1;
        //    row.value = data[i].get('hotttnesss');
        //    hotnessArray.push(row);
        //}
        this.draw(data);
    }
});