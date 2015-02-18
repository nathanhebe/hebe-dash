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
                var grouped = _.groupBy(results, 'ID');
                _.each(grouped,function (group) {
                    var sorted = _.sortBy(group, 'Date').reverse();
                    var first = _.first(sorted);
                    var second = sorted[1];

                    var indicator = Dashboard.PerformanceIndicatorModel.create({
                        Title: first.Title,
                        ID: first.ID,
                        Current: first,
                        Previous: second
                    });

                    pis.push(indicator);
                });
                //results.forEach(function (items) {
                //    pis.push(Dashboard.PerformanceIndicatorModel.create(items));
                //});
                return pis;
            }
        );
    },

});