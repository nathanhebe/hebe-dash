//var $widgetCarousel = null;
//// Widget Owl Carousel Init
//function initWidgetCarousel(onInitCallback) {
//    $widgetPrev = $("#widgetPrev");
//    $widgetNext = $("#widgetNext");
//    $widgetCarousel = $("#widgetCarousel");

//    // Get total number of slides
//    $totalSlides = $body.find('.widgetItem').length;
//    $totalSlides = Number($totalSlides);
//    // Set start slide number to one less than the total
//    $startNo = $totalSlides - 1;
//    $startNo = Number($startNo);
//    $slideEnter = $totalSlides + 1;

//    imagesLoaded($('#widgetCarousel'), function () {
//        $widgetCarousel.owlCarousel({
//            onInitialized: onInitCallback,
//            loop: false,
//            nav: false,
//            //startPosition: $startNo,
//            responsive: {
//                0: {
//                    items: 1
//                },
//                650: {
//                    items: 3
//                },
//                850: {
//                    items: 3
//                },
//                950: {
//                    items: 4
//                },
//                1150: {
//                    items: 5
//                }
//            }
//        });
//    });

//    $widgetPrev.on('click', function (e) {
//        e.preventDefault();
//        $widgetCarousel.trigger('prev.owl.carousel');
//    });

//    $widgetNext.on('click', function (e) {
//        e.preventDefault();
//        $widgetCarousel.trigger('next.owl.carousel');
//    });

//    $addWidget.on('click', function (e) {
//        e.preventDefault();
//        var newBlock = '<button class=\"item center widgetItem\">New Block!</button>';
//        $widgetCarousel.trigger('add.owl.carousel', [newBlock]).trigger('refresh.owl.carousel').trigger('next.owl.carousel');
//        console.log('Widget position is ' + $slideEnter);
//        $slideEnter++;
//    });
//}


/* 
==========================================================================
   Cache Rules (Everything Around Me)
========================================================================== 
*/


var dashWrapper = (function () {
    var $pageWidth,
    $pageHeight,
    $body,
    $navPage,
    $siteWrapper,
    $headerWrapper,
    $buttonWrapper,
    $menuButton,
    $backButton,
    $headerLine,
    $presentation,
    $infoButton,
    $infoCross,
    $infoWrapper,
    $navWrapper,
    $navLinks,
    $addWidget,
    $contentWrapper,
    $container,
    $widgetNavWrapper,
    $widgetsFit = null;
    var widgetMargin = 11;
    var widgetWidth = 210;

    var gridster = null;

    // Init Widget Carousel
    //initWidgetCarousel();


    //Set navPage pages to be 100% height, but still in flow
    function navPageHeight() {
        $navPage = $body.find('#NavPage');
        // If page has a navPage div, make it full height and set siteWrapper's top value to the same
        if ($navPage.length) {
            $navPage.height($pageHeight);
            $siteWrapper.css({ 'top': $pageHeight + 'px' });
        }
    }

    // Set the main content minimum height to that of the window
    function contentMinHeight() {
        $contentWrapper.css({ 'min-height': $pageHeight - 96 + 'px' })
    }

    // Home Menu Dropdown Functionality
    function menuButton() {
        $menuButton.on("click touchstart", function (e) {
            console.log('Menu Button Click');
            e.preventDefault();
            if (jQuery.data($navWrapper, 'state') == 'closed') {
                $(this).addClass('menuButtonActive');
                TweenMax.to($contentWrapper, 0.2, { marginTop: '97px' });
                TweenMax.to($navWrapper, 0.2, { bottom: '-97px' });
                TweenMax.staggerTo($navLinks, 0.15, { opacity: 1, scale: 1, delay: 0.25 }, 0.05);
                $contentWrapper.addClass('blur');
                jQuery.data($navWrapper, 'state', 'open');
            } else {
                $(this).removeClass('menuButtonActive');
                TweenMax.to($navLinks, 0.15, {
                    opacity: 0, scale: 0, onComplete: function () {
                        $contentWrapper.removeClass('blur');
                    }
                });
                TweenMax.to($contentWrapper, 0.15, { marginTop: '0', delay: 0.15 });
                TweenMax.to($navWrapper, 0.15, { bottom: '0', delay: 0.15 });
                jQuery.data($navWrapper, 'state', 'closed');
            }
        });
    }

    // Sub Menu functionality
    function subMenu() {
        $navLinks.on('click', function (e) {
            e.preventDefault();
            $thisSubMenu = $(this).data('submenu');
            TweenMax.to($navLinks, 0.15, { opacity: 0, scale: 0 });
            TweenMax.to($menuButton, 0.15, { opacity: 0, scale: 0, delay: 0.1 });

            // Display the back button
            TweenMax.to($backButton, 0.15, { opacity: 1, scale: 1, delay: 0.25 });

            // Open the 'Widgets' sub menu
            if ($thisSubMenu == 'widgets') {
                $body.find('.activeSubMenu').removeClass('activeSubMenu');
                $widgetNavWrapper.addClass('activeSubMenu');
                $subMenuInner = $body.find('.activeSubMenu .subMenuInner');

                TweenMax.to($widgetNavWrapper, 0, { bottom: '-97px', opacity: 1, scale: 1, zIndex: 3, delay: 0.35 });
                TweenMax.to($subMenuInner, 0.15, { opacity: 1, delay: 0.35 });

            }

        });
    }

    // Back to Main Navigation functionality
    function backToNav() {
        $backButton.on('click', function () {
            $activeSubMenu = $body.find('.activeSubMenu');
            $subMenuInner = $body.find('.activeSubMenu .subMenuInner');

            TweenMax.to($subMenuInner, 0.2, { opacity: 0, });

            TweenMax.to($activeSubMenu, 0, { zIndex: 0, bottom: "0", delay: 0.2 });

            TweenMax.to($backButton, 0.15, { opacity: 0, scale: 0, delay: 0.15 });

            TweenMax.to($menuButton, 0.15, { opacity: 1, scale: 1, delay: 0.3 });
            TweenMax.staggerTo($navLinks, 0.15, { opacity: 1, scale: 1, delay: 0.3 }, 0.05);
        });
    }

    // Puts the page into full-screen mode and moves the header out da way
    function setupPresentationMode() {
        $presentation.on('click', function () {
            launchFullscreen(document.documentElement);
            TweenMax.to($headerWrapper, 0.2, { opacity: '0' });
            TweenMax.to($headerWrapper, 0, { zIndex: '-1', delay: 0.2 });
            TweenMax.to($contentWrapper, 0.2, { top: '0px', marginTop: '0px', delay: 0.2 });
            $contentWrapper.removeClass('blur');
            jQuery.data($body, 'state', 'presentation');
        });
    }

    // Find the right method, call on correct element
    function launchFullscreen(element) {
        if (element.requestFullscreen) {
            element.requestFullscreen();
        } else if (element.mozRequestFullScreen) {
            element.mozRequestFullScreen();
        } else if (element.webkitRequestFullscreen) {
            element.webkitRequestFullscreen();
        } else if (element.msRequestFullscreen) {
            element.msRequestFullscreen();
        }
    }

    // When fullscreen changes, bring back the header and ting if it's not fullscreen mode
    function exitHandler() {
        var fullscreenEl = document.fullscreenElement || document.mozFullScreenElement || document.webkitFullscreenElement || document.msFullscreenElement;
        if (fullscreenEl == undefined) {
            TweenMax.to($headerWrapper, 0, { zIndex: '9', delay: 0 });
            TweenMax.to($headerWrapper, 0.2, { opacity: '1', delay: 0.2 });
            TweenMax.to($contentWrapper, 0.2, { top: '98px' });

            if (jQuery.data($navWrapper, 'state') == 'open') {
                TweenMax.to($contentWrapper, 0.2, {
                    marginTop: '98px', onComplete: function () {
                        $contentWrapper.addClass('blur');
                    }
                });
            }
        }
    }

    // Gridster init function, creates grid on the fly from a stored serial (in this case, generated by 'gridInit2()' and hard-coded below)
    function gridInit() {

        $t = $widgetsFit;
        $e = Math.floor($(window).width() / $t);
        //$('#container').width($e*6);

        // Hardcoded serial for now, needs to be 'got' from somewhere on page load, and updated on drag finish (as in 'gridInit2' callback)
        //var serialization = [{ "col": 1, "row": 1, "size_x": 2, "size_y": 2 }, { "col": 3, "row": 3, "size_x": 2, "size_y": 2 }, { "col": 8, "row": 1, "size_x": 2, "size_y": 2 }, { "col": 6, "row": 1, "size_x": 2, "size_y": 2 }, { "col": 1, "row": 3, "size_x": 1, "size_y": 2 }, { "col": 5, "row": 1, "size_x": 1, "size_y": 2 }, { "col": 2, "row": 4, "size_x": 1, "size_y": 2 }, { "col": 6, "row": 3, "size_x": 1, "size_y": 2 }, { "col": 3, "row": 2, "size_x": 2, "size_y": 1 }, { "col": 7, "row": 3, "size_x": 2, "size_y": 1 }, { "col": 5, "row": 5, "size_x": 2, "size_y": 1 }, { "col": 7, "row": 4, "size_x": 2, "size_y": 1 }, { "col": 1, "row": 5, "size_x": 1, "size_y": 1 }, { "col": 2, "row": 3, "size_x": 1, "size_y": 1 }, { "col": 5, "row": 4, "size_x": 1, "size_y": 1 }, { "col": 3, "row": 1, "size_x": 1, "size_y": 1 }, { "col": 4, "row": 1, "size_x": 1, "size_y": 1 }, { "col": 5, "row": 3, "size_x": 1, "size_y": 1 }];

        //// Function for returning the object with the largest column value
        //function getMaxCol(arr, prop) {
        //    var max;
        //    for (var i = 0 ; i < arr.length ; i++) {
        //        if (!max || parseInt(arr[i][prop]) > parseInt(max[prop]))
        //            max = arr[i];
        //    }
        //    return max;
        //}

        //// Go into the object and get the value of 'col', +1 to that value to account for a double-width widget being the last in line
        //var maxCol = getMaxCol(serialization, "col");
        //var maxCol = maxCol.col;
        //var colCount = maxCol + 1;

        var colCount = 2;

        // This will ensure that there is no horizontal scrolling on 2-column mobile displays
        if ($widgetsFit == 2) {
            colCount = 2;
        }

        // Set up grid options, sizes etc
        gridster = $("#contentWrapper #container").gridster({
            widget_margins: [widgetMargin, widgetMargin],
            widget_base_dimensions: [widgetWidth,widgetWidth],// [$e - 22, $e - 22],
            min_cols: $widgetsFit, // Change to colCount for proper serialization
            autogrow_cols: false, //Change to true for growable table
            avoid_overlapped_widgets: true,
        }).data('gridster');


        //$blockNo = 0;
        //$.each(serialization, function () {
        //    $blockNo++;
        //    gridster.add_widget('<li class="widget cover block' + $blockNo + ' noTouch"></li>', this.size_x, this.size_y, this.col, this.row);
        //});

        //$('#WidgetHolder li').each(function () {
        $('#WidgetHolder>.ember-view').each(function () {
            var widget = $(this).find('li:first');
            var sizeX = parseInt(widget.attr('data-sizex'));
            var sizeY = parseInt(widget.attr('data-sizex'));
            widget.attr('ID', $(this).attr('ID'));
            widget.addClass('ember-view');
            gridster.add_widget(widget, sizeX, sizeY);
            $(this).remove();
        });

        // Time delay on dragging
        dragTimeout = null;
        $("#container .gs-w").on('mousedown touchstart', function (e, data) {
            var self = this;
            if (!data || !data.start) {
                gridster.disable();
                dragTimeout = setTimeout(function () {
                    gridster.enable();
                    $(self).trigger(e, [{ start: true }]);
                    $container.addClass('dragging');
                }, 300);
            } else {
                $(self).addClass('dragging');
            }
        }).bind('mouseup  touchend', function () {
            $siteWrapper.find('.dragging').removeClass('dragging');
            clearTimeout(dragTimeout);
        });
    }

    // Gridster init function with serial storing, to be used in conjunction with hard-coded blocks in index.php
    //function gridInit2() {
    //    $t = 6;
    //    $e = Math.ceil($(window).width() / $t);
    //    $('#container').width($e * 6);

    //    // Initialize Gridster and cache it under the var 'gridster'
    //    var gridster = $("#contentWrapper #container").gridster({
    //        widget_margins: [11, 11],
    //        widget_base_dimensions: [$e - 22, $e - 22],
    //        extra_cols: 15,
    //        serialize_params: function ($w, wgd) {
    //            return {
    //                id: $($w).attr('id'),
    //                col: wgd.col,
    //                row: wgd.row,
    //                size_x: wgd.size_x,
    //                size_y: wgd.size_y
    //            };
    //        },
    //        draggable: {
    //            stop: function (event, ui) {
    //                var gridData = gridster.serialize();
    //                var positions = JSON.stringify(gridData);

    //                alert(positions);
    //            }
    //        }
    //    }).data('gridster');
    //}

    // Grid Resize functionality, called up there ^^ on window resize
    function gridResize() {

        gridster.destroy();
        gridster.options.max_cols = $maxColumns;
        gridster.init();

    }

    // Rudimentary snap points
    function snapPointsCalculated() {
        var $widgetsFit = Math.floor($pageWidth / (widgetWidth + widgetMargin));
        console.log('this screen size will comfortably fit ' + $widgetsFit + ' widgets.');
    }

    //function snapPoints() {
    //    if ($pageWidth > 1670) {
    //        $widgetsFit = 13;
    //        console.log('this screen size will comfortably fit ' + $widgetsFit + ' widgets.');
    //    } else if ($pageWidth > 1540) {
    //        $widgetsFit = 12;
    //        console.log('this screen size will comfortably fit ' + $widgetsFit + ' widgets.');
    //    } else if ($pageWidth > 1410) {
    //        $widgetsFit = 11;
    //        console.log('this screen size will comfortably fit ' + $widgetsFit + ' widgets.');
    //    } else if ($pageWidth > 1275) {
    //        $widgetsFit = 10;
    //        console.log('this screen size will comfortably fit ' + $widgetsFit + ' widgets.');
    //    } else if ($pageWidth > 1148) {
    //        $widgetsFit = 9;
    //        console.log('this screen size will comfortably fit ' + $widgetsFit + ' widgets.');
    //    } else if ($pageWidth > 1030) {
    //        $widgetsFit = 8;
    //        console.log('this screen size will comfortably fit ' + $widgetsFit + ' widgets.');
    //    } else if ($pageWidth > 890) {
    //        $widgetsFit = 7;
    //        console.log('this screen size will comfortably fit ' + $widgetsFit + ' widgets.');
    //    } else if ($pageWidth > 767) {
    //        $widgetsFit = 6;
    //        console.log('this screen size will comfortably fit ' + $widgetsFit + ' widgets.');
    //    } else if ($pageWidth > 599) {
    //        $widgetsFit = 5;
    //        console.log('this screen size will comfortably fit ' + $widgetsFit + ' widgets.');
    //    } else if ($pageWidth > 499) {
    //        $widgetsFit = 4;
    //        console.log('this screen size will comfortably fit ' + $widgetsFit + ' widgets.');
    //    } else if ($pageWidth > 374) {
    //        $widgetsFit = 3;
    //        console.log('this screen size will comfortably fit ' + $widgetsFit + ' widgets.');
    //    } else if ($pageWidth > 200) {
    //        $widgetsFit = 2;
    //        console.log('this screen size will comfortably fit ' + $widgetsFit + ' widgets.');
    //    }
    //}

    // Fire functions on final resize event
    var waitForFinalEvent = (function () {
        var timers = {};
        return function (callback, ms, uniqueId) {
            if (!uniqueId) {
                uniqueId = "Don't call this twice without a uniqueId";
            }
            if (timers[uniqueId]) {
                clearTimeout(timers[uniqueId]);
            }
            timers[uniqueId] = setTimeout(callback, ms);
        };
    })();


    // PUBLIC FUNCTIONS
    // E.G. dashWrapper.init()
    return {
        init: function () {
            console.log('dashWrapper.init');

            this.initDOMVars();

            // Set $navWrapper to "Closed" on initialization
            jQuery.data($navWrapper, 'state', 'closed');
            // Init Menu Dropdown Functionality
            menuButton();

            // Init Sub Menu drop-down
            subMenu();

            // Button that goes back to main nav
            backToNav();

            // Set contentWrapper min-height
            contentMinHeight();

            $infoButton.on('click', function () {
                TweenMax.to($infoWrapper, 0, { zIndex: '99' });
                TweenMax.to($infoWrapper, 0.2, { opacity: '1' });
                $siteWrapper.addClass('blur');
                $navPage.addClass('blur');
            });

            $infoCross.on('click', function () {
                TweenMax.to($infoWrapper, 0, { zIndex: '-1', delay: 0.2 });
                TweenMax.to($infoWrapper, 0.2, { opacity: '0' });
                $siteWrapper.removeClass('blur');
                $navPage.removeClass('blur');
            });

            ////////////////////////////////////////////
            // Nav Page
            // Set navPageHeight page to be 100% height
            navPageHeight();
            $('#NavPageLinks a').on('click', function (e) {
                dashWrapper.scrollToSiteWrapper();
            });

            // Window Resize event
            $(window).on('resize', function () {
                waitForFinalEvent(function () {

                    // Redefine the width and height of the window
                    $pageWidth = $(window).width();
                    $pageHeight = $(window).height();

                    // reset navPage divs to be 100% height
                    navPageHeight();

                    // Reset contentWrapper min-height
                    contentMinHeight();

                    snapPointsCalculated();
                });
            });

            // Scrolling functionality
            //$(window).on("scroll", function () {

            //    // Constantly update the distance you've scrolled from the top of the page
            //    var topDis = $(document).scrollTop();

            //    // If there's a navPage div present, hide it when you've scrolled its full height 
            //    if ($navPage.length) {
            //        $detachHeight = $navPage.height();
            //        if (topDis >= $detachHeight) {
            //            hideNavPage();
            //        }
            //    }
            //});

            var hideNavPage = function () {
                $navPage.detach();
                $navPage = '';
                $siteWrapper.css({ 'top': '0px' });
                window.scrollTo(0, 0);
                $contentWrapper.removeClass('overflowX');
                $headerWrapper.addClass('stickyWrapper');
                $contentWrapper.addClass('stickyContent');

                $detachHeight = $navPage.height();
                if (topDis >= $detachHeight) {
                    hideNavPage();
                }
            };



            // Listen for changes to the fullscreen API in a bunch of browsers, run exitHandler() when it goes dooown
            if (document.addEventListener) {
                document.addEventListener('webkitfullscreenchange', exitHandler, true);
                document.addEventListener('mozfullscreenchange', exitHandler, true);
                document.addEventListener('fullscreenchange', exitHandler, true);
                document.addEventListener('MSFullscreenChange', exitHandler, true);
            }

            setupPresentationMode();

        },

        isInitialized: false,

        initDOMVars: function () {
            dashWrapper.isInitialized = true;
            $pageWidth = $(window).width();
            $pageHeight = $(window).height();
            $body = $("body");
            $navPage = $body.find('#NavPage');
            $siteWrapper = $("#SiteWrapper");
            $headerWrapper = $("#headerWrapper");
            $buttonWrapper = $("#buttonWrapper");
            $menuButton = $("button.menuButton");
            $backButton = $("button.backButton");
            $headerLine = $("#headerLine");
            $presentation = $('#presentation');
            $infoButton = $('#infoButton');
            $infoCross = $('#infoCross');
            $infoWrapper = $('#infoWrapper');
            $navWrapper = $("#SecondNav");
            $navLinks = $navWrapper.find('button');
            $addWidget = $("#addWidget");
            $contentWrapper = $("#contentWrapper");
            $container = $('#container');
            $widgetNavWrapper = $("#WidgetNavWrapper");
        },

        initGridster: function () {
            if (!dashWrapper.isInitialized) {
                console.log('DOM Vars require reloading');
                this.initDOMVars();
            }

            snapPointsCalculated();
            gridInit();
        },

        scrollToSiteWrapper: function () {
            $("html, body").animate({ scrollTop: $siteWrapper.offset().top }, 300);
        },

        showNavPage: function () {
            if ($navPage.length == 0) {
                $navPage = $('#NavPage');
            }
            if ($navPage.length) {
                navPageHeight();
                $detachHeight = $navPage.height();
                var topDis = $(document).scrollTop();
                if (topDis <= $detachHeight) {
                    $contentWrapper.addClass('overflowX');
                    $headerWrapper.removeClass('stickyWrapper');
                    $contentWrapper.removeClass('stickyContent');
                    $siteWrapper.css({ 'top': $detachHeight });
                    $("html, body").scrollTop($detachHeight);
                    //                    $siteWrapper.animate({ top: $detachHeight }, 300);

                }
            }
        }
    }
})();