/* jshint undef: true, unused: true */
/* global $, utils */

Dashboard.PageModel = Ember.Object.extend({
    _rows: null,
    rows: function () {
        if (this.get('_rows') === null) {
            var obj = this;
            switch (this.get('type')) {
                case "page_finance":
                case "page_finance_table":
                case "page_supplimentary_business":
                case "page_supplimentary_risks":
                    if (this.get('_rows') === null) {
                        if (this.get('ckanID') !== null) {
                            var ckanID = obj.get('ckanID');
                            $.ajax({
                                url: 'http://54.154.11.196/api/action/datastore_search_sql?sql=SELECT * from "' + ckanID + '"'
                            })
                            .then(function (response) {
                                var results = [];
                                response.result.records.forEach(function (result) {
                                    var tmp = Dashboard.DataRowModel.create(result);
                                    results.push(tmp);
                                });
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
    data: function () {
        if (this.get('_data') === null) {
            switch (this.get('type')) {
                case "page_finance":
                    return null;
                case "page_finance_table":
                    return null;
                case "page_supplimentary_business":
                    return null;
                case "page_supplimentary_risks":
                    var obj = this;
                    if (this.get('_data') === null) {
                        if (this.get('ckanID') !== null) {
                            var ckanID = this.get('ckanID');
                            $.ajax({
                                url: 'http://54.154.11.196/api/action/datastore_search_sql?sql=SELECT * from "' + ckanID + '"'
                            }).then(function (response) {
                                var data = { sections: [] };
                                var section;
                                var group;
                                response.result.records.forEach(function (record) {
                                    if (record.type === 'section') {
                                        section = {
                                            title: record.sectionTitle,
                                            groups: []
                                        };
                                        data.sections.push(section);
                                    } else if (record.type === 'group') {
                                        group = {
                                            title: record.groupTitle,
                                            indicators: []
                                        };
                                        section.groups.push(group);
                                    } else if (record.type === 'indicator') {

                                        var parseRAG = function (rag) {
                                            switch (rag) {
                                                case "A/R":
                                                    return 'redAmber';
                                                case "R": 
                                                    return 'red';
                                                case "A": 
                                                    return 'amber';
                                                case "A/G": 
                                                    return 'amberGreen';
                                                case "G": 
                                                    return 'green';
                                            }
                                        };

                                        // Format the data so it makes sense in the template
                                        record.trend = record.col3;
                                        record.rag = record.col4;
                                        record.mitigatedRAG = record.col5;
                                        record.ragCode = parseRAG(record.rag);
                                        record.mitigatedRAGCode = parseRAG(record.mitigatedRAG);
                                        record.achieveDate = record.col6;

                                        delete record.col3;
                                        delete record.col4;
                                        delete record.col5;
                                        delete record.col6;

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
});