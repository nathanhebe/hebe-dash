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