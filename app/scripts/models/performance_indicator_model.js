/* jshint undef: true, unused: true */
/* global $, utils */

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
                var result = response.result;
                var pis = [];
                result.records.forEach(function (item) {
                    debugger;

                    var grouped = _.groupBy(items, 'ID');

                    pis.push(Dashboard.PerformanceIndicatorModel.create(item));
                });
                return pis;
            }
        );
    },

});