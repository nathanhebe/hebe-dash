Dashboard.PageController = Ember.ObjectController.extend({
    _pages: null,
    dashID: null,
    pages: function () {
        if (this.get('_pages') !== null) {
            return this.get('_pages');
        } else {
            // ragPages should be set in page route from the model hook
            var ragPages = this.get('ragPages');
            console.log(ragPages);
            this.set('_pages', ragPages)
            return this.get('_pages');
        }
    }.property('_pages', 'ragPages'),

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
            var resourceID = this.get('ckanID');
            if (resourceID != null) {
                Dashboard.PerformanceIndicatorModel.find(resourceID).then(function (results) {
                    obj.set('_nhsEnglandRAGTotals', results);
                });
            }
        }
    }.property('_nhsEnglandRAGTotals')
});

Ember.Handlebars.helper('ragColour', function (value, options) {
    var val = Handlebars.Utils.escapeExpression(value);
    var colour = (val === 'G' ? 'green'
                    : (val === 'A' ? 'amber'
                        : ((val === 'A/R' || val === 'R') ? 'red'
                            : 'blue')));
    return new Ember.Handlebars.SafeString(colour);
});