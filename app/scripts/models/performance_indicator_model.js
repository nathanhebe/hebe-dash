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
                    Red: 0,
                    AmberRed: 0,
                    Amber: 0,
                    AmberGreen: 0,
                    Green: 0,
                    Missing: 0
                };
                var nhsPrevious = {
                    Red: 0,
                    AmberRed: 0,
                    Amber: 0,
                    AmberGreen: 0,
                    Green: 0,
                    Missing: 0
                };

                var grouped = _.groupBy(results, 'ID');
                _.each(grouped, function (group) {
                    var sorted = _.sortBy(group, 'Date').reverse(); // sort by date DESC
                    var current = _.first(sorted);
                    var previous = sorted[1];

                    var indicator = Dashboard.PerformanceIndicatorModel.create({
                        Title: current.Title,
                        ID: current.ID,
                        Current: current,
                        Previous: previous
                    });

                    nhsCurrent.Red += parseInt(current.Red,10);
                    nhsCurrent.AmberRed += parseInt(current.AmberRed, 10);
                    nhsCurrent.Amber += parseInt(current.Amber, 10);
                    nhsCurrent.AmberGreen += parseInt(current.AmberGreen, 10);
                    nhsCurrent.Green += parseInt(current.Green, 10);
                    nhsCurrent.Missing += parseInt(current.Missing, 10);

                    nhsPrevious.Red += parseInt(previous.Red, 10);
                    nhsPrevious.AmberRed += parseInt(previous.AmberRed, 10);
                    nhsPrevious.Amber += parseInt(previous.Amber, 10);
                    nhsPrevious.AmberGreen += parseInt(previous.AmberGreen, 10);
                    nhsPrevious.Green += parseInt(previous.Green, 10);
                    nhsPrevious.Missing += parseInt(previous.Missing, 10);

                    pis.push(indicator);
                });

                /*
                
                ID
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
                    Title: 'NHS England Totals',
                    ID: '999',
                    Current: nhsCurrent,
                    Previous: nhsPrevious
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