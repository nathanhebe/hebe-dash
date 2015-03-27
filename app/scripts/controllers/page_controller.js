Dashboard.PageController = Ember.ObjectController.extend({
    _pages: null,
    dashID: null,
    pageRAGs: null,
    pageNoRAG: null,

    pages: function () {
        if (this.get('_pages') !== null) {
            return this.get('_pages');
        } else {
            // ragPages should be set in page route from the model hook
            var ragPages = this.get('ragPages');
            this.set('_pages', ragPages)
            return this.get('_pages');
        }
    }.property('_pages', 'ragPages'),

    calculatePageRAG: function () {
        console.log('calculatePageRAG');
        var rags = [];

        this.get('_pages').forEach(function (page) {
            var pageCopy = Object.create(page);
            var mainRAGs = pageCopy.get('rags');
            //var mainRAGs = obj.mainRAGs;
            //var noTrendRAG = obj.noTrendRAG;
            for (var p = 0; p < mainRAGs.length; p++) {
                var colour = mainRAGs[p];
                var ragColour = rags.findBy('colour', colour.colour);
                if (ragColour == null) {
                    rags.push(colour);
                } else {
                    ragColour.count++;
                }
            }
        });

        this.set('pageRAGs', rags);

    }.observes('_pages.@each.rags'),

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