(function (w, d, $) {

    var statics = {
        instances: [],
        currentPresentation: null,
        addToPool: function (obj) {
            statics.instances.push(obj);
        },
        initHotKeys: function () {
            $(d).keyup(function (event) {
                var activePresentation = statics.currentPresentation;
                if (!activePresentation) return;

                if (event.keyCode == 37 || event.keyCode == 38) {
                    activePresentation.back();
                }
                if (event.keyCode == 39 || event.keyCode == 40) {
                    activePresentation.forward();
                }
            });
        },
        disableFullScreenForAll: function (current) {
            statics.currentPresentation = current;
            for (var i = 0; i < statics.instances.length; i++) {
                if (statics.instances[i] !== statics.currentPresentation) {
                    statics.instances[i].fullscreenDisable();
                }
            }
        },
        init: function () {
            $(function () {
                $('.presentator').presentator();
                statics.initHotKeys();
            });
        }
    };

    var Presentator = function (options) {
        if (!(this instanceof arguments.callee)) {
            return new arguments.callee(options);
        }
        var me = this, tmpImage = $('<img>'),
            log = options.logger || function (msg) {
                w.console.log(msg);
            };

        me.statics = statics;

        statics.addToPool(me);

        me.init = function (options) {
            me.$context = $(options.context);

            var dataUrl = me.$context.data('url');
            me.settings = $.extend( {
                'url'             : dataUrl ? dataUrl + '&callback=?' : 'images.json',
                'prevBtn'         : '.prev',
                'nextBtn'         : '.next',
                'thumbnailClass'  : 'span4',
                'fullscreenClass' : 'span10'
            }, options);
            me.settings.dataRoot = me.$context.data('root') || 'items';
            me.settings.dataSrcKey = me.$context.data('key') || '';

            me.$nextBtn = $(me.settings.nextBtn, me.$context);
            me.$prevBtn = $(me.settings.prevBtn, me.$context);
            me.$img = $('img', me.$context);
            me.currentSlide = -1;
            me.slidesCount = 0;
            me.slides = options.slides;

            me.$prevBtn.click(function () { me.back(); });
            me.$nextBtn.click(function () { me.forward(); });
            me.$img.click(function () { me.fullscreenToggle(); });
            me.$img.addClass('imgthumb');
            me.setActiveSlide(0);
            $.getJSON(me.settings.url).done(me.onLoad).error(function () {
                log('Origin ' + d.location.origin + ' is not allowed by Access-Control-Allow-Origin.');
            });
        };
        me.onLoad = function (data) {
            me.slides = $.map(data[me.settings.dataRoot], function (item) {
                return me.settings.dataSrcKey ? item[me.settings.dataSrcKey] : item;
            });
            me.slidesCount = me.slides.length;
            me.setActiveSlide(0);
        };
        me.fullscreenToggle = function () {
            statics.disableFullScreenForAll(me);
            me.$img.toggleClass('imgthumb');
            me.$img.toggleClass('imgfull');
            me.$context.toggleClass(me.settings.thumbnailClass);
            me.$context.toggleClass(me.settings.fullscreenClass);
        };
        me.fullscreenDisable = function () {
            me.$img.addClass('imgthumb');
            me.$img.removeClass('imgfull');
            me.$context.addClass(me.settings.thumbnailClass);
            me.$context.removeClass(me.settings.fullscreenClass);
        };
        me.loadSlide = function (id) {
            if (!me.slides) return;
            log('start loading ' + id);

            var imageSrc = me.slides[id];
            tmpImage.one('load', function () {
                log('loaded ' + id);
                me.$img.attr('src', imageSrc);
            }).attr('src', imageSrc);
        };
        me.setActiveSlide = function (number) {
            if (number == me.currentSlide) return;

            if (me.slidesCount) {
                me.currentSlide = number;
                me.loadSlide(me.currentSlide);

                if (me.currentSlide >= me.slidesCount - 1) {
                    me.$nextBtn.addClass('disabled');
                } else if (me.currentSlide == 0) {
                    me.$nextBtn.removeClass('disabled');
                    me.$prevBtn.addClass('disabled');
                } else {
                    me.$prevBtn.removeClass('disabled');
                    me.$nextBtn.removeClass('disabled');
                }
            } else {
                me.$prevBtn.addClass('disabled');
                me.$nextBtn.addClass('disabled');
            }
        };
        me.forward = function () {
            var newSlideNumber = Math.min(me.currentSlide + 1, me.slidesCount - 1);
            me.setActiveSlide(newSlideNumber);
        };
        me.back = function () {
            var newSlideNumber = Math.max(me.currentSlide - 1, 0);
            me.setActiveSlide(newSlideNumber);
        };

        me.init(options);
        return me;
    };

    w.Presentator = Presentator;
    $.fn.presentator = function() {
        return this.each(function() { Presentator({context: this}); });
    };
    statics.init();
})(window, document, jQuery);