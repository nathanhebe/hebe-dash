/* jshint undef: true, unused: true */
/* global $ */

Dashboard.ReportModel = Ember.Object.extend({
});

Dashboard.ReportModel.reopenClass({
    find: function (resource_id) {
        var data = {
            resource_id: resource_id
        };
        return $.ajax({
            url: 'http://54.154.11.196/api/action/datastore_search',
            data: data,
            dataType: 'jsonp',
        })
        .then(
            function (response) {
                var result = response.result;
                var types = {};
                result.records.forEach(function (item) {
                    var itemTypeGeneric = item.Type.split('_')[0]; // e.g. page_finance will be added as 'page' but still contain its true type in its own Type property
                    if (!types[itemTypeGeneric]) {
                        types[itemTypeGeneric] = [];
                    }
                    types[itemTypeGeneric].push(item);
                });

                types.page.forEach(function (page) {
                    var indicators = [];
                    var items = types.indicator.filterBy('ParentID', page.ID);
                    items.forEach(function (item) {
                        var indicator = Dashboard.IndicatorModel.create(item);
                        indicators.push(indicator);
                    });
                    page.indicators = indicators;
                });

                types.annex.forEach(function (annex) {
                    var pageTypes = types.page.filterBy('ParentID', annex.ID);
                    var pages = [];
                    pageTypes.forEach(function (item) {
                        var page = Dashboard.PageModel.create(item);
                        pages.push(page);
                    });
                    annex.pages = pages;
                });

                //var report = Dashboard.ReportModel.create({
                //    title: 'Board Report January 2015',
                //    annexes: types.annex
                //});
                //return report;

                return types.annex;
            }
        );
    },

    findAll: function (){ //resource_id) {
        var data = {
            resource_id: 'f441a675-1d3c-43d8-aa8d-c1059381c0e8', // the resource id
        };
        return $.ajax({
            url: 'http://54.154.11.196/api/action/datastore_search',
            data: data,
            dataType: 'jsonp',
        })
        .then(
        function (response) {
            var result = response.result;
            var types = {};

            result.records.forEach(function (item) {
                var itemTypeGeneric = item.Type.split('_')[0]; // e.g. page_finance will be added as 'page' but still contain its true type in its own Type property
                if (!types[itemTypeGeneric]) {
                    types[itemTypeGeneric] = [];
                }
                types[itemTypeGeneric].push(item);
            });

            types.page.forEach(function (page) {
                var indicators = [];
                var items = types.indicator.filterBy('ParentID', page.ID);
                items.forEach(function (item) {
                    var indicator = Dashboard.IndicatorModel.create(item);
                    indicators.push(indicator);
                });
                page.indicators = indicators;
            });

            types.annex.forEach(function (annex) {
                var pageTypes = types.page.filterBy('ParentID', annex.ID);
                var pages = [];
                pageTypes.forEach(function (item) {
                    var page = Dashboard.PageModel.create(item);
                    pages.push(page);
                });
                annex.pages = pages;
            });

            var report = Dashboard.ReportModel.create({
                title: 'Board Report January 2015',
                annexes: types.annex
            });

            return report;
        });
    }
});