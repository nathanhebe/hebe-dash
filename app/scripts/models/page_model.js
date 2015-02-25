/* jshint undef: true, unused: true */
/* global $, utils */

Dashboard.PageModel = Ember.Object.extend({
    _rows: null,
    rows: function () {
        if (this.get('_rows') === null) {
            switch (this.get('Type')) {
                case "page_finance":
                case "page_finance_table":
                case "page_supplimentary_business":
                case "page_supplimentary_risks":
                    if (this.get('_rows') === null) {
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
                            });
                        }
                    }
                    return obj.get('_rows');
            }
        }
        return this.get('_rows');
    }.property('_rows'),

    _ragStatus: null,
    ragStatus: function () {
        //console.log('ragStatus');
        if (this.get('_ragStatus') !== null) {
            return this.get('_ragStatus');
        } else {
            var status = [
                {
                    colour: 'red',
                    count: utils.random(1, 4),
                    previous: utils.random(-6, -1)
                },
                {
                    colour: 'missing',
                    count: '',
                    previous: 'N/A'
                },
                {
                    colour: 'amber',
                    count: utils.random(3, 11),
                    previous: '+' + utils.random(1, 6)
                },
                {
                    colour: 'missing',
                    count: '',
                    previous: 'N/A'
                },
                {
                    colour: 'green',
                    count: utils.random(10, 18),
                    previous: '+' + utils.random(4, 10)
                }
                //,
                //{
                //    colour: 'blue',
                //    count: 2,
                //    previous: ''
                //}
            ];
            this.set('_ragStatus', status);
            return this.get('_ragStatus');
        }
    }.property('_ragStatus'),

    //_indicatorsByRAGDESC: null,
    //indicatorsByRAGDESC: function () {
    //    var indicators = this.get('indicators');

    //    //songsController = Ember.ArrayController.create({
    //    //    content: songs,
    //    //    sortProperties: ['ragColour'],
    //    //    sortAscending: false
    //    //});
    //    //_.sortBy(indicators, function (o) { return o.get('ragColour'); });

    //    return indicators;
    //}.property()
    _data: null,
    data: function() {
        if (this.get('_data') === null) {
            switch (this.get('Type')) {
                case "page_finance":
                    return null;
                case "page_finance_table":
                    return null;
                case "page_supplimentary_business":
                    return null;
                case "page_supplimentary_risks":
                    if (this.get('_data') === null) {
                        if (this.get('CKANID') !== null) {
                            var obj = this;
                            var ckanID = this.get('CKANID');
                            $.ajax({
                                url: 'http://54.154.11.196/api/action/datastore_search_sql?sql=SELECT * from "' + ckanID + '"'
                            }).then(function (response) {
                                var data = {sections: []};
                                var section;
                                var group;
                                response.result.records.forEach(function(record) {
                                    if (record.Type == 'section') {
                                        section = {
                                            title:  record.SectionTitle,
                                            groups: []
                                        };
                                        data.sections.push(section);
                                    } else if (record.Type == 'group') {
                                        group = {
                                            title: record.GroupTitle,
                                            indicators:  []
                                        };
                                        section.groups.push(group);
                                    } else if (record.Type == 'indicator') {
                                        //// Format the data so it makes sense in the template
                                        record.Trend = record.Col3;
                                        delete record.Col3;
                                        record.RAG = record.Col4;

                                        switch (record.Col4) {
                                            case "A/R": {
                                                record.RAGCode = 'redAmber';
                                                break;
                                            }
                                            case "R": {
                                                record.RAGCode = 'red';
                                                break;
                                            }
                                            case "A": {
                                                record.RAGCode = 'amber';
                                                break;
                                            }
                                            case "A/G": {
                                                record.RAGCode = 'amberGreen';
                                                break;
                                            }
                                            case "G": {
                                                record.RAGCode = 'green';
                                                break;
                                            }
                                        }

                                        delete record.Col4;
                                        record.mitigatedRAG = record.Col5;
                                        console.log(record);

                                        group.indicators.push(record);
                                    }
                                });
                                obj.set('data', data);

                                console.log(data);
                            });
                        }
                    }
                    return obj.get('_data');
            }
        }
        return this.get('_rows');
    }.property('_data')
})