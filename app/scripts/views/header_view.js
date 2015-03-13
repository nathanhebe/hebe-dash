/* jshint undef: true, unused: true */

Dashboard.HeaderView = Ember.View.extend({
    owlCarousel: null,
    _templateName: 'header_standard',
    //templateName: function () {
    //    var model = this.get('controller.model');
    //    var dashType = (model != null ? model.Type : 'standard'); //decamelize()
    //    var tmpName = 'header_' + dashType;
    //    if (this.get('_templateName') != tmpName) {
    //        this.set('_templateName', tmpName);
    //    }
    //    return 'header_' + dashType;
    //}.property('controller.model').cacheable(),

    //templateName: function (key, value, previousValue) {
    //    if (arguments.length > 1) {
    //        console.log(value + ' = ' + previousValue);
    //        if (value != previousValue) {
    //            this.set('_templateName', value);
    //        }
    //    }
    //    return this.get('_templateName');
    //}.property('_templateName'),

    //_templateChanged: function () {
    //    alert('rerender' + this.get('_templateName'));
    //    this.rerender();
    //},


    //templateNameDidChange: function () {
    //    this.rerender();
    //}.observes('templateName'),


    //didInsertElement: function () {
    //    var that = this;
    //    Ember.run.schedule('afterRender', function () {
    //        dashWrapper.init();
    //        //that.owlCarousel = $('#widgetCarousel').owlCarousel({
    //        //    startPosition: 4
    //        //}).data('owlCarousel');

    //        var model = that.get('controller.model');
    //        var dashType = (model != null ? model.Type : 'standard'); //decamelize()
    //        var tmpName = 'header_' + dashType;
    //        that.set('templateName', tmpName);
    //        that.rerender();

    //        //that.modelChanged();
    //    });
    //},

    //modelChanged: function () {
    //    if (!this.$()) { return; } // View not in DOM
    //    var model = this.get('controller.model');
    //    var that = this;

    //    var dashType = (model != null ? model.Type : 'standard'); //decamelize()
    //    var tmpName = 'header_' + dashType;
    //    console.log('tmpName:' + tmpName);
    //    this.set('templateName', tmpName);

    //    // add each found dashboard in model into the carousel sub menu
    //    //if (dashType == 'standard') {
    //    //    model.forEach(function (dash) {
    //    //        var dashLink = '<a class=\"item center widgetItem\" href="#/dash/' + dash.id + '">' + dash.Title + '</a>';
    //    //        that.owlCarousel.addItem(dashLink);
    //    //    });
    //    //}
    //}.observes('controller.model')
});