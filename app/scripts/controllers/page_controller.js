Dashboard.PageController = Ember.ObjectController.extend({
    _pages: null,
    dashID: null,

    _totalMainRAGs: null,
    totalMainRAGs: function (key, newMainRAGs) {
        if (arguments.length === 1) {
            if (this.get('_totalMainRAGs') == null) {
                this.calculateMainRAGs();
            }
            return this.get('_totalMainRAGs');
        } else {
            this.set('_totalMainRAGs', newMainRAGs);
            return newMainRAGs;
        }
    }.property('_totalMainRAGs'),


    _totalNoTrendRAG: null,
    totalNoTrendRAG: function (key, newNoTrendRAG) {
        if (arguments.length === 1) {
            if (this.get('_totalNoTrendRAG') == null) {
                this.calculateMainRAGs();
            }
            return this.get('_totalNoTrendRAG');
        } else {
            this.set('_totalNoTrendRAG', newNoTrendRAG);
            return newNoTrendRAG;
        }
    }.property('_totalNoTrendRAG'),



    calculateMainRAGs: function () {
        var mainRAGs = [
            { colour: 'red', count: 0, previous: 0, change: 0 },
            { colour: 'amberRed', count: 0, previous: 0, change: 0 },
            { colour: 'amber', count: 0, previous: 0, change: 0 },
            { colour: 'amberGreen', count: 0, previous: 0, change: 0 },
            { colour: 'green', count: 0, previous: 0, change: 0 }
        ];

        var noTrendRAG = { colour: 'noRAG', count: 0, previous: 0, change: 0 };

        this.get('pages').forEach(function (page) {
            var pageRAGs = page.get('mainRAGs');
            if (pageRAGs != null) {
                pageRAGs.forEach(function (colour) {
                    if (mainRAGs.findBy('colour', colour.colour) != null) {
                        mainRAGs.findBy('colour', colour.colour).count += colour.count;
                        mainRAGs.findBy('colour', colour.colour).previous += colour.previous;
                        if (colour.change != null) {
                            mainRAGs.findBy('colour', colour.colour).change += colour.change;
                        }
                    }
                });
            }

            var pageNoRAG = page.get('noTrendRAG');
            if (pageNoRAG != null) {
                noTrendRAG.count += pageNoRAG.count;
                noTrendRAG.previous += pageNoRAG.previous;
                if (pageNoRAG.change != null) {
                    noTrendRAG.change += pageNoRAG.change;
                }
            }

        });





        this.set('totalMainRAGs', mainRAGs);
        this.set('totalNoTrendRAG', noTrendRAG);
    }.observes('pages.@each.mainRAGs'),









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