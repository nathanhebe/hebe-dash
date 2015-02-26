Dashboard.PageController = Ember.ObjectController.extend({
    _pages: null,
    pages: function () {
        if (this.get('_pages') !== null) {
            return this.get('_pages');
        } else {
            var obj = this;
            Dashboard.ReportModel.findAll()
                .then(function (report) {
                    var pages = report.annexes.findBy('ID', 'annex_b').pages;
                    //console.log('pages = ' + pages);
                    obj.set('_pages', pages);
                });
        }
        //var status = [];

        //pages.forEach(function (page) {
        //    status.push({});
        //    page.indicators.forEach(function(indicator){
        //        status.push({

        //        });
        //    });
        //});

    }.property('_pages'),
    pageRAGTotals: function () {
        var pages = this.get('pages');
        if (pages != null) {
            var rags = {};
            pages.forEach(function (page) {
                var status = page.get('ragStatus');
                //status.forEach(function (rag) {
                for (var i = 0; i < status.length; i++) {
                    var rag = status[i];
                    var colour = rag.colour;
                    //if (rags[colour] === undefined) {
                    if (rags[i] === undefined) {
                        rags[i] = {
                            colour: rag.colour,
                            count: rag.count,
                            previous: rag.previous
                        };
                    } else {
                        rags[i].count = parseInt(rags[i].count, 10) + parseInt(rag.count, 10);
                        rags[i].previous = parseInt(rags[i].previous, 10) + parseInt(rag.previous, 10);
                    }
                }
            });
            rags[1] = {
                colour: 'missing',
                count: "",
                previous: "N/A"
            };
            rags[3] = {
                colour: 'missing',
                count: "",
                previous: "N/A"
            };
            var tmp = [];
            for (var key in rags) {
                tmp.push(rags[key]);
            }
            return tmp;
        }
        return [];
    }.property('_pages'),

    _nhsEnglandRAGTotals: null,
    nhsEnglandRAGTotals: function () {
        var obj = this;
        if (this.get('_nhsEnglandRAGTotals') != null) {
            return this.get('_nhsEnglandRAGTotals');
        } else {
            Dashboard.PerformanceIndicatorModel.findAll().then(function (results) {
                obj.set('_nhsEnglandRAGTotals', results);
            });
        }
    }.property('_nhsEnglandRAGTotals')

    //fullNameChanged: function () {
    //    // deal with the change
    //    console.log('Indicator Changed');
    //    this.set('_hasValues',true);
    //}.observes('indicators')
    //.on('init')
});

Ember.Handlebars.helper('ragColour', function (value, options) {
    var val = Handlebars.Utils.escapeExpression(value);
    var colour = (val === 'G' ? 'green'
                    : (val === 'A' ? 'amber'
                        : ((val === 'A/R' || val === 'R') ? 'red'
                            : 'blue')));
    return new Ember.Handlebars.SafeString(colour);
});