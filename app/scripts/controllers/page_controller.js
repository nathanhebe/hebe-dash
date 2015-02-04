Dashboard.PageController = Ember.ObjectController.extend({
    // the initial value of the `search` property
    search: '',
    _pages: null,
    test: 'testy',
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


    //ragStatus: function () {
    //    return [
    //        {
    //            colour: 'red',
    //            count: 4
    //        },
    //        {
    //            colour: 'blue',
    //            count: 2
    //        },
    //        {
    //            colour: 'green',
    //            count: 8
    //        }
    //    ];
    //}.property()

    //actions: {
    //    query: function () {
    //        // the current value of the text field
    //        var query = this.get('search');
    //        this.transitionToRoute('search', { query: query });
    //    }
    //}
});