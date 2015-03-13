/* jshint undef: true, unused: true */
/* global $, utils */

Dashboard.DashboardModel = Ember.Object.extend({

    _data: null,
    data: function () {
        //debugger;
        if (this.get('_data') != null) {
            return this.get('_data');
        } else {
            var obj = null;
            var resourceID = this.get('ckanResourceID');
            switch (this.get('type')) {
                case "BoardReport":
                    if (resourceID != null) {
                        obj = this;
                        Dashboard.ReportModel.find(resourceID).then(function (report) {
                            obj.set('_data', report);
                            return obj.get('_data');
                        });
                    }
                    break;
                case "BoardReportDashboard":
                    if (resourceID != null) {
                        obj = this;
                        Dashboard.ReportModel.find(resourceID).then(function (report) {
                            var annexB = report.findBy('id', 'annex_b');
                            var pages = annexB.pages;
                            var constitution = pages.findBy('id', 'page_1');
                            var indicators = constitution.indicators;
                            obj.set('_data', indicators);
                        });
                    }
                    break;
                case "Dashboard":
                    if (resourceID != null) {
                        obj = this;
                        var data = {
                            resource_id: resourceID
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
                                        $.extend(item, $.parseJSON(item.config)); // merge any JSON properties from Config
                                        delete item.config; //  remove extra properties from CKAN
                                        var widget = Dashboard.WidgetModel.create(item);
                                        //widgets.push(item);
                                        widgets.push(widget);
                                    });

                                    var sorted = widgets.sortBy("order");
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
            return data.filterBy('id', dashID)[0];
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
