
/*
the images preload plugin
*/
(function ($) {
    $.fn.preload = function (options) {
        var opts = $.extend({}, $.fn.preload.defaults, options);
        o = $.meta ? $.extend({}, opts, this.data()) : opts;
        var c = this.length,
            l = 0;
        return this.each(function () {
            var $i = $(this);
            $('<img/>').load(function (i) {
                ++l;
                if (l == c) o.onComplete();
            }).attr('src', $i.attr('src'));
        });
    };
    $.fn.preload.defaults = {
        onComplete: function () { return false; }
    };
})(jQuery);
/*
the thumbnail slider plugin
*/
(function ($) {

    var methods = {
        init: function (options) {
            var opts = $.extend({}, $.fn.thumbnailSlider.defaults, options);
            return this.each(function () {
                var $this = $(this),
                    o = $.meta ? $.extend({}, opts, $pxs_container.data()) : opts;

                var $ts_container = $this.children('.ts_container'),
                    $ts_thumbnails = $ts_container.children('.ts_thumbnails'),
                    $nav_elems = $ts_container.children('li').not($ts_thumbnails),
                    total_elems = $nav_elems.length,
                    $ts_preview_wrapper = $ts_thumbnails.children('.ts_preview_wrapper'),
                    $arrow = $ts_thumbnails.children('span'),
                    $ts_preview = $ts_preview_wrapper.children('.ts_preview');

                /*
                calculate sizes for $ts_thumbnails:
                width 	-> width thumbnail + border (2*5)
                height 	-> height thumbnail + border + triangle height(6)
                top		-> -(height plus margin of 5)
                left	-> leftDot - 0.5*width + 0.5*widthNavDot
                    this will be set when hovering the nav,
                    and the default value will correspond to the first nav dot
                 */
                var w_ts_thumbnails = o.thumb_width + 2 * 5,
                    h_ts_thumbnails = o.thumb_height + 2 * 5 + 6,
                    t_ts_thumbnails = -(h_ts_thumbnails + 5),
                    $first_nav = $nav_elems.eq(0),
                    l_ts_thumbnails = $first_nav.position().left - 0.5 * w_ts_thumbnails + 0.5 * $first_nav.width();

                $ts_thumbnails.css({
                    width: w_ts_thumbnails + 'px',
                    height: h_ts_thumbnails + 'px',
                    top: t_ts_thumbnails + 'px',
                    left: l_ts_thumbnails + 'px'
                });

                /*
                calculate the top and left for the arrow of the tooltip
                top		-> thumb height + border(2*5)
                left	-> (thumb width + border)/2 -width/2
                 */
                var t_arrow = o.thumb_height + 2 * 5,
                    l_arrow = (o.thumb_width + 2 * 5) / 2 - $arrow.width() / 2;
                $arrow.css({
                    left: l_arrow + 'px',
                    top: t_arrow + 'px'
                });

                /*
                calculate the $ts_preview width -> thumb width times number of thumbs
                 */
                $ts_preview.css('width', total_elems * o.thumb_width + 'px');

                /*
                set the $ts_preview_wrapper width and height -> thumb width / thumb height
                 */
                $ts_preview_wrapper.css({
                    width: o.thumb_width + 'px',
                    height: o.thumb_height + 'px'
                });

                //hover the nav elems
                $nav_elems.bind('mouseenter', function () {
                    var $nav_elem = $(this),
                        idx = $nav_elem.index();

                    /*
                    calculate the new left
                    for $ts_thumbnails
                     */
                    var new_left = $nav_elem.position().left - 0.5 * w_ts_thumbnails + 0.5 * $nav_elem.width();

                    $ts_thumbnails.stop(true)
                        .show()
                        .animate({
                            left: new_left + 'px'
                        }, o.speed, o.easing);

                    /*
                    animate the left of the $ts_preview to show the right thumb
                     */
                    $ts_preview.stop(true)
                        .animate({
                            left: -idx * o.thumb_width + 'px'
                        }, o.speed, o.easing);

                    //zoom in the thumb image if zoom is true
                    if (o.zoom && o.zoomratio > 1) {
                        var new_width = o.zoomratio * o.thumb_width,
                            new_height = o.zoomratio * o.thumb_height;

                        //increase the $ts_preview width in order to fit the zoomed image
                        var ts_preview_w = $ts_preview.width();
                        $ts_preview.css('width', (ts_preview_w - o.thumb_width + new_width) + 'px');

                        $ts_preview.children().eq(idx).find('img').stop().animate({
                            width: new_width + 'px',
                            height: new_height + 'px'
                        }, o.zoomspeed);
                    }

                }).bind('mouseleave', function () {
                    //if zoom set the width and height to defaults
                    if (o.zoom && o.zoomratio > 1) {
                        var $nav_elem = $(this),
                            idx = $nav_elem.index();
                        $ts_preview.children().eq(idx).find('img').stop().css({
                            width: o.thumb_width + 'px',
                            height: o.thumb_height + 'px'
                        });
                    }

                    $ts_thumbnails.stop(true)
                        .hide();

                }).bind('click', function (e) {
                    var $nav_elem = $(this),
                        idx = $nav_elem.index();
                    $nav_elems.removeClass('selected').eq(idx).addClass('selected');
                    o.onClick(idx);
                    //e.preventDefault();
                });
            });
        },
        update: function (idx) {
            return this.each(function () {
                var $this = $(this),
                    $ts_container = $this.children('.ts_container'),
                    $ts_thumbnails = $ts_container.children('.ts_thumbnails'),
                    $nav_elems = $ts_container.children('li').not($ts_thumbnails);
                $nav_elems.removeClass('selected').eq(idx).addClass('selected');
            });
        }
    };

    $.fn.thumbnailSlider = function (method) {
        if (methods[method]) {
            return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
        } else if (typeof method === 'object' || !method) {
            return methods.init.apply(this, arguments);
        } else {
            $.error('Method ' + method + ' does not exist on jQuery.thumbnailSlider');
        }
    };
    $.fn.thumbnailSlider.defaults = {
        speed: 100,//speed of each slide animation
        easing: 'jswing',//easing effect for the slide animation
        thumb_width: 75,//your photos width
        thumb_height: 75,//your photos height
        zoom: false,//zoom animation for the thumbs
        zoomratio: 1.3,//multiplicator for zoom (must be > 1)
        zoomspeed: 15000,//speed of zoom animation
        onClick: function () { return false; }//click callback
    };
})(jQuery);

/*ThumbnailSlider*/
$(function () {
    var $thumbnailSlider = $('#thumbnailSlider'),
        $slider = $('#slider'),
        $pg_photos = $('#pg_photos'),
        $pg_container = $('#pg_container'),
        $pg_scrollWrapper = $('#pg_scrollWrapper'),
        $pg_photos_elem = $pg_photos.children(),
        $pg_photos_img = $pg_photos_elem.find('img'),
        is_safari = navigator.userAgent.toLowerCase().indexOf('safari') > -1
            &&
            navigator.userAgent.toLowerCase().indexOf('chrome') == -1,
        pg_photos_width = 0;

    //preload the images
    $pg_photos_img.preload({
        onComplete: function () {
            init();
            //force the hashchange event
            //so that it slides to the image passed in the url
            $(window).hashchange();
        }
    });
    function init() {
        initThumbnailSlider();
        configGallery();
        initSlider();
        initEvents();
    }
    //init the thumbs slider plugin
    function initThumbnailSlider() {
        $thumbnailSlider.thumbnailSlider({
            thumb_width: 75,
            thumb_height: 75
        });
    }
    function configGallery() {
        $('BODY').css('overflow-x', 'hidden');
        //we need to set the width of the $pg_photos,
        //which is the sum of its childrens width
        $pg_photos.children().each(function () {
            pg_photos_width += $(this).outerWidth(true);
        });
        $pg_photos.css('width', pg_photos_width + 'px');
    }
    function initSlider() {
        $pg_scrollWrapper.show();
        //innitialize the slider
        var old_value = 0, //last value of the slider
            dir = 1; //direction
        $slider.slider('destroy').slider({
            orientation: 'horizontal',
            max: pg_photos_width - $pg_photos.children(':last').outerWidth(true),
            min: 0,
            value: 0,
            slide: function (event, ui) {
                $pg_photos.css('left', -ui.value + 'px');
                //the 3d effect
                if (is_safari) {
                    //the dir will define the value for the rotationY (negative or positive)
                    dir = (old_value < ui.value) ? 1 : -1;
                    old_value = ui.value;
                    if (dir == 1 && !$pg_container.hasClass('turnLeft'))
                        $pg_container.addClass('turnLeft')
                            .removeClass('turnRight flat');
                    else if (dir == -1 && !$pg_container.hasClass('turnRight'))
                        $pg_container.addClass('turnRight')
                            .removeClass('turnLeft flat');
                }
            },
            stop: function (event, ui) {
                if (is_safari) {
                    $pg_container.addClass('flat')
                        .removeClass('turnLeft turnRight');
                }
            }
        });
    }
    function initEvents() {
        //if we mouse over a photo, show the description sored in the alt attr
        $pg_photos_elem.bind('mouseenter', function (e) {
            var $e = $(this);
            $img = $e.find('img'),
                descr = $img.attr('alt');

            $('<span>' + descr + '</span>').hide().insertAfter($img).fadeIn();
        }).bind('mouseleave', function (e) {
            var $e = $(this);
            $descr = $e.find('span');

            $descr.fadeOut();
        });

        //slide as we scroll with the mouse
        $pg_container.mousewheel(function (e, delta) {
            var speed = 450,
                inc = -delta * speed,
                min = $slider.slider('option', 'min'),
                max = $slider.slider('option', 'max');

            var val = $slider.slider('value') + inc;
            if (val < min)
                val = min;
            else if (val > max)
                val = max;

            $slider.slider('value', val);
            $pg_photos.stop().animate({
                left: -(val) + 'px'
            }, 800, 'easeOutExpo', function () {
                if (is_safari) {
                    $pg_container.addClass('flat')
                        .removeClass('turnLeft turnRight');
                }
            });
            if (is_safari) {
                if (delta < 0 && !$pg_container.hasClass('turnLeft'))
                    $pg_container.addClass('turnLeft')
                        .removeClass('turnRight flat');
                else if (delta > 0 && !$pg_container.hasClass('turnRight'))
                    $pg_container.addClass('turnRight')
                        .removeClass('turnLeft flat');
            }
            return false;
        });

        $(window).hashchange(function () {
            //the index in the url hash
            var idx = location.hash.split('#')[1];
            if (!idx) {
                //we assume the current is the first one,
                //so set the first thumb nav elem as selected
                $thumbnailSlider.thumbnailSlider('update', 0);
                return;
            }
            //set the thumb nav elem as selected
            $thumbnailSlider.thumbnailSlider('update', idx - 1);
            //based on the current left value for the pg_photos,
            //and the left of the element, we know how much to slide
            var current_left = parseFloat($pg_photos.css('left'), 10),
                elem_left = $pg_photos_elem.eq(idx - 1).offset().left;
            //update the ui slider
            $slider.slider('value', Math.abs(parseInt(current_left - elem_left, 10)));
            //slide to element
            $pg_photos.stop().animate({
                left: current_left - elem_left + 'px'
            }, 800, 'easeInOutExpo');
        });
    }
});
