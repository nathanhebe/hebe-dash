/* jshint undef: true, unused: true */

Dashboard.DropDownButtonComponent = Ember.Component.extend({
    classNames: ['dropDownButton'],
    classNameBindings: ['isActive'],

    isActive: false,


    //mouseEnter: function () {
    //    //this.set('isActive', true);
    //    //this.get('listWrapper').css({ height: this.get('contentHeight') });

    //    /*
    //        get the offset().top of this.$()
    //            get the height of this.$()
    //                set the top of this.$().find('ul') to offsetTop + height

    //        on scroll set active = false
    //    */

    //    var el = this.$();
    //    var offsetTop = el.offset().top;
    //    var height = el.height();
    //    var list = el.find('ul:first');
    //    var listTop = offsetTop + height;
    //    list.css(top, listTop);

    //},

    //mouseLeave: function () {
    //    this.set('isActive', false);
    //},

    //contentHeight: function () {
    //    var list = this.$().find('.listWrapper > ul');
    //    this.get('listWrapper').attr('data-height', list.height());
    //}.property('_reports'),

    //_listWrapper: null,

    //didInsertElement: function () {
    //    this.set('listWrapper', this.$().find('.listWrapper'));
    //    $().attr('data-height', this.get('contentHeight'));
    //}
});