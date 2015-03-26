Dashboard.PageController = Ember.ObjectController.extend({
    _pages: null,
    dashID: null,
    noRAGTotal: null,
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
            var rags = [];
            pages.forEach(function (page) {
                var status = page.get('ragStatus');
                //status.forEach(function (rag) {
                status.forEach(function (rag) {
                    var ragForThisColour = rags.findBy('colour', rag.colour);
                    if (ragForThisColour == null) {
                        rags.push(rag);
                    } else {
                        ragForThisColour.count = ragForThisColour.count + rag.count;
                        ragForThisColour.previous = ragForThisColour.previous + rag.previous;
                    }
                });
            });

            var noRag = rags.findBy('colour', 'noRAG');
            if (noRag != null) {
                this.set('noRAGTotal', noRag);
            }

            return rags;
        }
        return [];
    }.property('_pages', '_pages.@each.ragStatus'),

    pageragTotalsData: function () {
        if (this.get('pageRAGTotals') != null) {
            var noTrend = this.get('pageRAGTotals').filter(function (rag) {
                if (rag.colour != 'noRAG') {
                    return true;
                }
                return false;
            });
            return noTrend;
        }
        return [];
    }.property('pageRAGTotals'),

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