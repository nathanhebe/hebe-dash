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
                            var ckanUrl = Dashboard.get('settings').get('ckanUrl');

                            $.ajax({
                                url: ckanUrl + '/api/action/datastore_search_sql?sql=SELECT * from "' + ckanID + '"'
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





    watchRAGChanges: false,

    calculateRAG: function () {
        if (this.get('watchRAGChanges') === true) {
            console.log('calculateRAG');
            var status = [
                { colour: 'red', count: 0, previous: 0 },
                { colour: 'amberRed', count: 0, previous: 0 },
                { colour: 'amber', count: 0, previous: 0 },
                { colour: 'amberGreen', count: 0, previous: 0 },
                { colour: 'green', count: 0, previous: 0 },
                { colour: 'noRAG', count: 0, previous: 0 },
            ];

            this.get('indicators').forEach(function (indicator) {
                var colour = indicator.get('ragColour');
                if (colour != null && status.findBy('colour', colour) != null) {
                    //console.log('colour ' + colour);
                    status.findBy('colour', colour).count++;
                    // status.push({ colour: colour, count: 0, previous: 0 })
                }

                var previousColour = indicator.previousRagColour();
                if (previousColour != null && status.findBy('colour', previousColour) != null) {
                    //console.log('previous colour '+colour);
                    status.findBy('colour', previousColour).previous++;
                    // status.push({ colour: previousColour, count: 0, previous: 0 })
                }
            });

            status.forEach(function (rag) {
                rag.change = (rag.previous != null ? rag.count - rag.previous : null);
            });

            var mainRAGs = status.filter(function (rag) {
                if (rag.colour != 'noRAG') {
                    return true;
                }
                return false;
            });
            var noTrendRAG = status.findBy('colour', 'noRAG');

            this.set('noTrendRAG', noTrendRAG);
            this.set('mainRAGs', mainRAGs);
        }
    }.observes('indicators.@each.ragColour', 'watchRAGChanges'),


    _mainRAGs: null,
    mainRAGs: function (key, newMainRAGs) {
        if (arguments.length === 1) {
            if (this.get('_mainRAGs') == null) {
                this.calculateRAG();
            }
            return this.get('_mainRAGs');
        } else {
            this.set('_mainRAGs', newMainRAGs);
            return newMainRAGs;
        }
    }.property('_mainRAGs'),


    _noTrendRAG: null,
    noTrendRAG: function (key, newNoTrendRAG) {
        if (arguments.length === 1) {
            if (this.get('_noTrendRAG') == null) {
                this.calculateRAG();
            }
            return this.get('_noTrendRAG');
        } else {
            this.set('_noTrendRAG', newNoTrendRAG);
            return newNoTrendRAG;
        }
    }.property('_noTrendRAG'),



    //rags: function () {
    //    console.log('ragColour');
    //    return this.calculateRAG().mainRAGs;
    //}.property('indicators.@each._ragColour'),


    //_changed: 0,
    //changed: function (key, value) {
    //    if (value) {
    //        this.set('_changed', value);
    //    }
    //    return this.get('_changed');
    //}.property(),

    //indicatorChanged: function () {
    //    this.set('changed', +new Date());
    //    console.log('item changed!');
    //}.observes('indicators.@each.ragColour'),


    _indicators: null,
    indicators: function (key, initialIndicators) {
        if (arguments.length === 1) {
            return this.get('_indicators');
        } else {
            this.set('_indicators', initialIndicators);
            return initialIndicators;
        }
    }.property('_indicators'),

    sortedIndicators: function () {
        var indicators = this.get('indicators');

        var sorted = _.sortBy(indicators, function (item1) {
            var sortVals = {
                red: 12,
                redAmber: 10,
                amber: 8,
                amberGreen: 6,
                green: 4,
                noRAG: 14,
                none: 16
            };
            console.log('sortedIndicators: ' + sortVals[item1.get('ragColour')]);
            return sortVals[item1.get('ragColour')];
        });
        return sorted;
    }.property('indicators.@each.ragColour'),



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
                            var ckanUrl = Dashboard.get('settings').get('ckanUrl');

                            $.ajax({
                                url: ckanUrl + '/api/action/datastore_search_sql?sql=SELECT * from "' + ckanID + '"'
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
                                                    return 'amberRed';
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
                            });
                        }
                    }
                    return obj.get('_data');
                case "page_supplimentary_text":
                    var obj = this;
                    if (this.get('_data') === null) {
                        if (this.get('ckanID') !== null) {
                            var ckanID = this.get('ckanID');
                            var ckanUrl = Dashboard.get('settings').get('ckanUrl');
                            $.ajax({
                                // url: 'http://54.154.11.196/api/action/datastore_search_sql?sql=SELECT * from "' + ckanID + '"'
                                //4803b5a5-36a6-43b7-b001-462efde0dde2

                                // http://52.16.158.169/dataset/cb6fe8e4-66e3-4c03-80b1-20b850c84251/resource/60bf1f30-1a6c-4482-a8ee-d76d791fc1bd/download/boardreportperformancereportintro.txt

                                // http://52.16.158.169/dataset/cb6fe8e4-66e3-4c03-80b1-20b850c84251/resource/60bf1f30-1a6c-4482-a8ee-d76d791fc1bd/download/boardreportperformancereportintro.txt

                                // url: ckanUrl + '/dataset/4e0ecf43-d6cd-432c-876e-016e325fbb0c/resource/' + ckanID + '/download'

                                url: 'http://52.16.158.169/dataset/cb6fe8e4-66e3-4c03-80b1-20b850c84251/resource/60bf1f30-1a6c-4482-a8ee-d76d791fc1bd/download/boardreportperformancereportintro.txt'

                            }).then(function (response) {
                                var text = Handlebars.Utils.escapeExpression(response);
                                text = text.replace(/(\r\n|\n|\r)/gm, '<br>');
                                text = new Handlebars.SafeString(text);
                                obj.set('_data', text);
                            });
                        }
                    }
                    return obj.get('_data');
            }
        }
        return this.get('_data');
    }.property('_data')
});
