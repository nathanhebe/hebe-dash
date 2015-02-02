Dashboard.HeatMapComponent = Ember.Component.extend({
    margin: { top: 50, right: 0, bottom: 100, left: 30 },
    width: 900,
    height: 280,
    gridSize: 37,
    legendElementWidth: 100,
    buckets: 9,
    colors: ["#2F0000", "#661201", "#911900", "#B22604", "#CB3804", "#F25B02", "#F2720D", "#FFA321", "#FAC40A"], // alternatively colorbrewer.YlGnBu[9]
    days: ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"],
    times: ["1a", "2a", "3a", "4a", "5a", "6a", "7a", "8a", "9a", "10a", "11a", "12a", "1p", "2p", "3p", "4p", "5p", "6p", "7p", "8p", "9p", "10p", "11p", "12p"],

    draw: function (myData) {
        var self = this;

        //this.set('data', myData);
        //console.log(this.get('data'));
        var chartID = '#' + myData.get('chartID');
        console.log('Loading C3');

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

        var chart = c3.generate({
            bindto: chartID,
            //size: {
            //    height: 240,
            //    width: '1300'
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
                    { axis: 'y', start: 0, end: .6, class: 'regionYR' },
                    { axis: 'y', start: .6, end: .7, class: 'regionYA' },
                    { axis: 'y', start: .7, class: 'regionYG' },
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