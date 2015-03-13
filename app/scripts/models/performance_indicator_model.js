/* jshint undef: true, unused: true */
/* global $, _ */

Dashboard.PerformanceIndicatorModel = Ember.Object.extend({
});

Dashboard.PerformanceIndicatorModel.reopenClass({
    findAll: function () {
        var data = {
            resource_id: '54d570f3-c72c-42d6-84d8-38b43ff28fe1'
        };
        return $.ajax({
            url: 'http://54.154.11.196/api/action/datastore_search',
            data: data,
            dataType: 'jsonp',
        })
        .then(
            function (response) {
                var results = response.result.records;
                var pis = [];

                var nhsCurrent = {
                    red: 0,
                    amberRed: 0,
                    amber: 0,
                    amberGreen: 0,
                    green: 0,
                    missing: 0
                };
                var nhsPrevious = {
                    red: 0,
                    amberRed: 0,
                    amber: 0,
                    amberGreen: 0,
                    green: 0,
                    missing: 0
                };

                var grouped = _.groupBy(results, 'id');
                _.each(grouped, function (group) {
                    var sorted = _.sortBy(group, 'date').reverse(); // sort by date DESC
                    var current = _.first(sorted);
                    var previous = sorted[1];

                    var indicator = Dashboard.PerformanceIndicatorModel.create({
                        title: current.title,
                        id: current.id,
                        current: current,
                        previous: previous
                    });

                    nhsCurrent.red += parseInt(current.red,10);
                    nhsCurrent.amberRed += parseInt(current.amberRed, 10);
                    nhsCurrent.amber += parseInt(current.amber, 10);
                    nhsCurrent.amberGreen += parseInt(current.amberGreen, 10);
                    nhsCurrent.green += parseInt(current.green, 10);
                    nhsCurrent.missing += parseInt(current.missing, 10);

                    nhsPrevious.red += parseInt(previous.red, 10);
                    nhsPrevious.amberRed += parseInt(previous.amberRed, 10);
                    nhsPrevious.amber += parseInt(previous.amber, 10);
                    nhsPrevious.amberGreen += parseInt(previous.amberGreen, 10);
                    nhsPrevious.green += parseInt(previous.green, 10);
                    nhsPrevious.missing += parseInt(previous.missing, 10);

                    pis.push(indicator);
                });

                /*
                
                id
                Date
                Title
                Red
                AmberRed
                Amber
                AmberGreen
                Green
                Missing
                */

                var nhsEnglandTotals = Dashboard.PerformanceIndicatorModel.create({
                    title: 'NHS England Totals',
                    id: '999',
                    current: nhsCurrent,
                    previous: nhsPrevious
                });
                pis.push(nhsEnglandTotals);

                //results.forEach(function (items) {
                //    pis.push(Dashboard.PerformanceIndicatorModel.create(items));
                //});
                return pis;
            }
        );
    },

});