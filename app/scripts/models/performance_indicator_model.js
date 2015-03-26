/// <reference path="performance_indicator_model.js" />
/* jshint undef: true, unused: true */
/* global $, _ */

Dashboard.PerformanceIndicatorModel = Ember.Object.extend({
});

Dashboard.PerformanceIndicatorModel.reopenClass({
    find: function (resourceID) {
        var ckanUrl = Dashboard.get('settings').get('ckanUrl');
        return $.ajax({
            url: ckanUrl + '/api/action/datastore_search?resource_id='+ resourceID //6b6fdcd4-ed10-49a8-a147-bb588099ef05
        })
        .then(
            function (response) {
                var results = response.result.records;
                var pis = [];

                // Setup totals
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
                // end setup totals

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

                    // Append to Totals
                    nhsCurrent.red += parseFloat(current.red);
                    nhsCurrent.amberRed += parseFloat(current.amberRed);
                    nhsCurrent.amber += parseFloat(current.amber);
                    nhsCurrent.amberGreen += parseFloat(current.amberGreen);
                    nhsCurrent.green += parseFloat(current.green);
                    nhsCurrent.missing += (parseFloat(current.missing) || 0);

                    nhsPrevious.red += parseFloat(previous.red);
                    nhsPrevious.amberRed += parseFloat(previous.amberRed);
                    nhsPrevious.amber += parseFloat(previous.amber);
                    nhsPrevious.amberGreen += parseFloat(previous.amberGreen);
                    nhsPrevious.green += parseFloat(previous.green);
                    nhsPrevious.missing += (parseFloat(previous.missing) || 0);
                    // End Append to Totals

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
    }

});