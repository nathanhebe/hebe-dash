/* jshint undef: true, unused: true */

Dashboard.DataRowModel = Ember.Object.extend({

    isAppendicesRow: function () {
        return (this.get('title').toString().startsWith('*'));
    }.property(),

    ragClassName: function () {
        var ragCode = this.get('rag');
        switch (ragCode) {
            default:
                return 'noRAG';
            case 'A':
                return 'amber';
            case 'G':
                return 'green';
            case 'R':
                return 'red';
        }
    }.property(),

});