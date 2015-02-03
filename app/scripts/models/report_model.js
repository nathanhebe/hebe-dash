Dashboard.IndicatorModel = Ember.Object.extend({
    targetValue: null,
    currentValue: null,
    previousValue: null,
    _dataValues: null,

    chartID: function () {
        return 'Chart' + this.get('ID');
    }.property(),

    dataValues: function () {
        if (this.get('_dataValues') != null) {
            return this.get('_dataValues');
        } else {
            var obj = this;
            $.ajax({
                url: 'http://54.154.11.196/api/action/datastore_search_sql?sql=SELECT * from "a358a675-fabf-4b6b-9163-f88d2b26e776" WHERE "Indicator id" = ' + "'" + obj.get('ID') + "'" + ' ORDER BY "Year" DESC '
            })
            .then(function (response) {
                var results = response.result.records;
                obj.setProperties({
                    _dataValues: results,
                    currentValue: results[0],
                    previousValue: results[1]
                });
                return obj.get('_dataValues');
            });
        }
    }.property()
});

Dashboard.IndicatorModel.reopenClass({
    values: null
});




Dashboard.PageModel = Ember.Object.extend({
    _rows: null,
    rows: function () {
        switch (this.get('Type')) {
            case "page_finance":
            case "page_finance_table":
                if (this.get('_rows') !== null) {
                    return this.get('_rows');
                } else {
                    if (this.get('CKANID') !== null) {
                        var obj = this;
                        var ckanID = obj.get('CKANID');
                        $.ajax({
                            url: 'http://54.154.11.196/api/action/datastore_search_sql?sql=SELECT * from "' + ckanID + '"'
                        })
                        .then(function (response) {
                            var results = response.result.records;
                            obj.setProperties({
                                _rows: results
                            });
                            return obj.get('_rows');
                        });
                    }
                }
                break;
        }
        return this.get('_rows');
    }.property()
});







Dashboard.ReportModel = Ember.Object.extend({
});

Dashboard.ReportModel.reopenClass({
    findAll: function (resource_id) {
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

            types['page'].forEach(function (page) {
                var indicators = [];
                var items = types['indicator'].filterBy('ParentID', page.ID);
                items.forEach(function (item) {
                    var indicator = Dashboard.IndicatorModel.create(item);
                    indicators.push(indicator);
                });
                page.indicators = indicators;
            });

            types['annex'].forEach(function (annex) {
                var pageTypes = types['page'].filterBy('ParentID', annex.ID);
                var pages = [];
                pageTypes.forEach(function (item) {
                    var page = Dashboard.PageModel.create(item);
                    pages.push(page);
                });
                annex.pages = pages;
            });

            var report = Dashboard.ReportModel.create({
                title: 'Sample Board Report',
                annexes: types['annex']
            });

            return report;
        });




        //return $.getJSON("http://www.reddit.com/r/" + subreddit + "/.json?jsonp=?").then(
        //  function (response) {
        //      return response.data.children.map(function (child) {
        //          return App.RedditLink.create(child.data);
        //      });
        //  }
        //);
    }
});