
Dashboard.IndicatorRowController = Ember.ObjectController.extend({
    mainTitle: function () {
        var title = (this.get('subTitle') == null || this.get('subTitle').length === 0 ? this.get('title') : this.get('subTitle'));
        return title;
    }.property("model.title", "model.subTitle"),

    showChart: function () {
        var model = this;
        return (model != null && model.get('currentValue') != null && model.get('previousValue') != null);
    }.property('this.currentValue', 'this.previousValue')



});

Dashboard.IndicatorRowConstitutionController = Dashboard.IndicatorRowController.extend({
});
