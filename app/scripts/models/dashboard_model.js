/* jshint undef: true, unused: true */
/* global $, utils */

Dashboard.DashboardModel = Ember.Object.extend({

    _data: null,
    data: function () {
        if (this.get('_data') != null) {
            return this.get('_data');
        } else {
            var obj = null;
            switch (this.get('Type')) {
                case "BoardReport":
                    var resourceID = this.get('CKANResourceID');
                    if (resourceID != null) {
                        obj = this;
                        Dashboard.ReportModel.find(resourceID).then(function (report) {
                            obj.set('_data', report);
                        });
                    }
                    break;
                case "Dashboard":
                    var resource_id = this.get('CKANResourceID');
                    if (resource_id != null) {
                        obj = this;
                        var data = {
                            resource_id: resource_id
                        };
                        $.ajax({
                            url: 'http://54.154.11.196/api/action/datastore_search',
                            data: data,
                            dataType: 'jsonp',
                        })
                        .then(
                            function (response) {
                                var result = response.result;
                                var widgets = [];

                                if (result != null && utils.isArray(result.records)) {
                                    result.records.forEach(function (item) {
                                        //var itemTypeGeneric = item.Type;
                                        //var widget = Dashboard.WidgetModel.create(item);
                                        $.extend(item, $.parseJSON(item.Config)); // merge any JSON properties from Config
                                        delete item.Config; //  remove extra properties from CKAN
                                        widgets.push(item);
                                    });

                                    var sorted = widgets.sortBy("Order");
                                    obj.set('_data', sorted);
                                }
                            }
                        );
                    }
            }
            return this.get('_data');
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
