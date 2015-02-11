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
                    var resourceID = this.get('CKANResourceID');
                    if (resourceID != null) {
                        var obj = this;
                        Dashboard.ReportModel.find(resourceID).then(function (report) {
                            obj.set('_data', report);
                        });
                    }
                    break;
                case "Dashboard":
                    console.log('Lazy Load Dashboard Data Here');
                    //this.set('_data', Dashboard.BoardReport.find(item.CKANResourceID));
                    var widgets = [
                        {
                            Title: 'Widget 1',
                            sizeX: 2,
                            sizeY: 2
                        }
                    ];
                    console.log('Setting Dashboard data: ' + widgets);
                    this.set('_data', widgets);
                    return this.get('_data');
                    break;
            }
        }
    }.property('_data')

});

Dashboard.DashboardModel.reopenClass({
    find: function (dashID) {
        return this.findAll().then(function (data) {
            return data.filterBy('ID', dashID)[0];
        });
    },
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
                    var dash = Dashboard.DashboardModel.create(item);
                    dashboards.push(dash);
                });
                return dashboards;
            }
        );
    }
});
