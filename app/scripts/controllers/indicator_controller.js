Dashboard.IndicatorrowconstitutionController = Ember.ObjectController.extend({
    mainTitle: function () {
        var title = (this.get('subTitle') == null || this.get('subTitle').length === 0 ? this.get('title') : this.get('subTitle'));
        return title;
    }.property("model.title", "model.subTitle")
});

Dashboard.IndicatorRowController = Ember.ObjectController.extend({
    mainTitle: function () {
        var title = (this.get('subTitle') == null || this.get('subTitle').length === 0 ? this.get('title') : this.get('subTitle'));
        return title;
    }.property("model.title", "model.subTitle")
});