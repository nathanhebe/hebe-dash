/* jshint undef: true, unused: true */
/* global $ */

Dashboard.DashboardModel = Ember.Object.extend({

    _data: null,
    data: function () {
        if (this.get('_data') != null) {
            return this.get('_data');
        } else {
            switch (this.get('Type')) {
                case "BoardReport":
                    console.log('Lazy Load Board Report Data Here');
                    this.set('_data', Dashboard.BoardReport.find(item.CKANResourceID));
                    break;
                case "Dashboard":
                    console.log('Lazy Load Dashboard Data Here');
                    //this.set('_data', Dashboard.BoardReport.find(item.CKANResourceID));
                    break;
            }
        }
    }.property('_data')

});

Dashboard.DashboardModel.reopenClass({
    findAll: function () {
        var data = {
            resource_id: 'e8a418c8-c879-4dd9-b36f-ecb9b6d65678', // the resource id
        };

        return $.ajax({
            url: 'http://54.154.11.196/api/action/datastore_search',
            data: data,
        })
        .then(
            function (response) {
                var dashboards = [];
                var result = response.result;
                result.records.forEach(function (item) {
                    dashboards.push(item);
                });
                return dashboards;
            }
        );
    }
});
