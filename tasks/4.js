var Presentator = (function (w, d, $) {

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
                $('.presentator').each(function () {
                    Presentator({context: $(this)});
                });
                statics.initHotKeys();
            });
        }
    };

    var instance = function (params) {
        if (!(this instanceof Presentator)) {
            return new Presentator(params);
        }
        var me = this,
            tmpImage = $('<img>'),
            log = params.logger || function (msg) {
                w.console.log(msg);
            };

        me.statics = statics;

        statics.addToPool(me);

        me.$context = $(params.context);
        me.url = params.url || me.$context.data('url') || 'images.json';
        me.prevBtn = params.prevBtn || '.prev';
        me.nextBtn = params.nextBtn || '.next';
        me.$nextBtn = $(me.nextBtn, me.$context);
        me.$prevBtn = $(me.prevBtn, me.$context);
        me.$img = $('img', me.$context);
        me.currentSlide = -1;
        me.slidesCount = 0;
        me.thumbnailClass = params.thumbnailClass || 'span4';
        me.fullscreenClass = params.fullscreenClass || 'span10';
        me.slides = params.slides;
        me.dataRoot = me.$context.data('root') || 'items';
        me.dataSrcKey = me.$context.data('key') || '';

        me.init = function () {
            me.$prevBtn.click(function () { me.back(); });
            me.$nextBtn.click(function () { me.forward(); });
            me.$img.click(function () { me.fullscreenToggle(); });
            me.$img.addClass('imgthumb');
            me.setActiveSlide(0);
            $.getJSON(me.url).done(function (data) {
                me.slides = $.map(data[me.dataRoot], function (item) {
                    return me.dataSrcKey ? item[me.dataSrcKey] : item;
                });
                me.slidesCount = me.slides.length;
                me.setActiveSlide(0);
            }).error(function () {
                log('Origin ' + d.location.origin + ' is not allowed by Access-Control-Allow-Origin.');
            });
        };
        me.fullscreenToggle = function () {
            statics.disableFullScreenForAll(me);
            me.$img.toggleClass('imgthumb');
            me.$img.toggleClass('imgfull');
            me.$context.toggleClass(me.thumbnailClass);
            me.$context.toggleClass(me.fullscreenClass);
        };
        me.fullscreenDisable = function () {
            me.$img.addClass('imgthumb');
            me.$img.removeClass('imgfull');
            me.$context.addClass(me.thumbnailClass);
            me.$context.removeClass(me.fullscreenClass);
        };
        me.loadSlide = function (id) {
            if (!me.slides) return;

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

        me.init();

        return me;
    };

    statics.init();
    return instance;
})(window, document, jQuery);