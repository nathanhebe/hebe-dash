Dashboard.IndicatorModel = Ember.Object.extend({
    targetValue: null,
    currentValue: null,
    previousValue: null,
    chartID: function () {
        return 'Chart' + this.get('ID');
    }.property(),
    _dataValues: null,
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
                //obj.set('_dataValues', results);
                //obj.set('currentValue', results[0]);
                //obj.set('previousValue', results[1]);
                return obj.get('_dataValues');
            });
        }
    }.property()
});

Dashboard.IndicatorModel.reopenClass({
    values: null
});

Dashboard.ReportModel = Ember.Object.extend({});
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
                if (!types[item.Type]) {
                    types[item.Type] = [];
                }
                types[item.Type].push(item);
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
                annex.pages = types['page'].filterBy('ParentID', annex.ID);
            });

            var report = Dashboard.ReportModel.create({
                title: 'Hi Im a report',
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