Dashboard.PageController = Ember.ObjectController.extend({
    _pages: null,
    dashID: null,

    pages: function () {
        if (this.get('_pages') !== null) {
            return this.get('_pages');
        } else {
            // ragPages should be set in page route from the model hook
            var ragPages = this.get('ragPages');
            //console.log(ragPages);
            this.set('_pages', ragPages)
            return this.get('_pages');
        }
    }.property('_pages', 'ragPages'),

    pageRAGTotals: function () {
        console.log('pageRAGTotals');
        var pages = this.get('pages');
        if (pages != null) {
            var rags = [];
            //pages.forEach(function (page) {
            //    var status = page.get('ragStatus');
            //    status.forEach(function (rag) {
            //        var ragForThisColour = rags.findBy('colour', rag.colour);
            //        if (ragForThisColour == null) {
            //            rags.push(rag);
            //        } else {
            //            ragForThisColour.count = ragForThisColour.count + rag.count;
            //            ragForThisColour.previous = ragForThisColour.previous + rag.previous;
            //        }
            //    });
            //});

            var noRag = rags.findBy('colour', 'noRAG');
            if (noRag != null) {
                this.set('_noRAGTotal', noRag);
            }

            // generate an array of the rag totals without the noRAG value
            // also check for null values
            var totals = rags.filter(function (rag) {
                if (rag.colour != 'noRAG') {
                    return true;
                }
                return false;
            });
            this.set('pageTotalValues', totals);
            //if (totals != null && totals.length > 0) {
            //    var nullVals = totals.findBy('colour', null);
            //    if (nullVals == null || nullVals.count > 0) {
            //        this.set('_pageTotalValues', null);
            //    } else {
            //        this.set('_pageTotalValues', totals);
            //    }
            //} else {
            //    this.set('_pageTotalValues', null);
            //}

            return rags;
        }
        return [];
    }.property('pages', 'pages.@each.ragStatus'),

    //_noRAGTotal: null,
    //_pageTotalValues: null,

    //noRAGTotal: function () {
    //    console.log('noRAGTotal');
    //    if(this.get('_noRAGTotal') == null){
    //        this.get('pageRAGTotals');
    //    }
    //    return this.get('_noRAGTotal');
    //}.property('_noRAGTotal'),

    //pageTotalValues: function () {
    //    console.log('pageTotalValues');
    //   // this.get('pageRAGTotals');
    //    return this.get('_pageTotalValues');
    //}.property('_pageTotalValues'),




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