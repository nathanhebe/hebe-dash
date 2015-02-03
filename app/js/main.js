
$(document).ready(function () {

    $(function () {
        $(window).bind('resize', function () {
            resizeMe();
        }).trigger('resize');
    });

    var resizeMe = function () {
        //Standard height, for which the body font size is correct
        var preferredWidth = 1440;
        //Base font size for the page
        var fontsize = 110;

        //var displayWidth = $(window).width();
        var displayWidth = $('#MainWrapper').width();

        // we want the size to slow down as the width reduces
        var difference = preferredWidth - displayWidth;
        difference = difference /4;
        displayWidth = displayWidth + difference;

        var percentage = displayWidth / preferredWidth;
        var newFontSize = Math.floor(fontsize * percentage);
        $("body").css("font-size", newFontSize + '%');
    };



    // Indicator Accordion
    $('#MainWrapper').on('click','.accordionHandle', function () {
        var indicatorIDContainer = $(this).closest('[data-indicator-id]');
        if (indicatorIDContainer.length > 0) {
            var indicatorID = indicatorIDContainer.attr('data-indicator-id');
            var accordionContent = $('.accordionContent[data-indicator-id="' + indicatorID + '"]');
            if (accordionContent.length > 0) {
                accordionContent.slideToggle('fast');
                $(this).toggleClass('active');
            }
        }
    });
    // End Indicator Accordion


    ////////////////////////////////////////////////////////
    // match the widths of all the finance tables' cells
    // actually, just match the first column
    var tables = $('.finance table');

    $.fn.matchWidths = function () {
        var tables = $(this);
        var columnCount = tables.first().find('thead tr th:first').length;
        var maxWidths = new Array();

        for (var i = 0; i < columnCount; i++) {
            // calculate the max width the first header column accross all tables
            var maxWidth = Math.max.apply(tables,
                $.map(tables,
                    function (e) {
                        var cell = $(e).find('thead tr th:first').eq(i);
                        var totalWidth = cell.outerWidth();
                        return totalWidth;
                    }
                )
            );
            maxWidths[i] = maxWidth;
        }

        // Apply the widths
        $.map(tables.find('thead tr th:first'),
                function (e) {
                    var index = $(e).index();
                    var newWidth = maxWidths[index];
                    return $(e).outerWidth(newWidth);
                });
    };

    tables.matchWidths();
    // END - Match the widths of all the finance tables' cells
    ////////////////////////////////////////////////////////











});