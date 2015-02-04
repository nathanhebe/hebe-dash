/* jshint undef: true, unused: true */
/* global d3, c3 */

Dashboard.HeatMapComponent = Ember.Component.extend({
    //margin: { top: 50, right: 0, bottom: 100, left: 30 },
    //width: 900,
    //height: 280,

    draw: function (myData) {
        //this.set('data', myData);
        //console.log(this.get('data'));
        var chartID = '#' + myData.get('chartID');
        //console.log('Loading C3');

        var values = myData.get('_dataValues');
        var xAxis = values.map(function (val) {
            //return val.Year;
            return new Date(val.Year.split(/[\.,-\/#!$%\^&\*;:{}=\-_`~() ]/g)[0]);
        });
        var lineVals = values.map(function (val) {
            return val.Value / 100;
        });

        xAxis.unshift('x');
        lineVals.unshift('Current');

        c3.generate({
            bindto: chartID,
            size: {
                width: '1360'
            },
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
                        format: '%Y'
                        //format : '%Y-%m-%d'
                        //format: '%b'
                    }
                },
                y: {
                    tick: {
                        format: d3.format(".1%")
                    }
                }
            },

            point: {
                focus: {
                    expand: {
                        r: 5
                    }
                }
            },

            regions: [
                    { axis: 'y', start: 0, end: 0.6, class: 'regionYR' },
                    { axis: 'y', start: 0.6, end: 0.7, class: 'regionYA' },
                    { axis: 'y', start: 0.7, class: 'regionYG' },
            ]
        });

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