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
        var me = this;
        me.tmpImage = $('<img>');
        me.log = options.logger || function (msg) {
            w.console.log(msg);
        };

        me.statics = statics;

        statics.addToPool(me);

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
        $.getJSON(me.settings.url).done(function(data) {me.onLoad(data);}).error(function () {
            log('Origin ' + d.location.origin + ' is not allowed by Access-Control-Allow-Origin.');
        });

        return me;
    };

    Presentator.prototype = {
        constructor: Presentator,
        onLoad           : function (data) {
            var me = this;
            me.slides = $.map(data[me.settings.dataRoot], function (item) {
                return me.settings.dataSrcKey ? item[me.settings.dataSrcKey] : item;
            });
            me.slidesCount = me.slides.length;
            me.setActiveSlide(0);
        },
        fullscreenToggle : function () {
            var me = this;
            statics.disableFullScreenForAll(me);
            me.$img.toggleClass('imgthumb');
            me.$img.toggleClass('imgfull');
            me.$context.toggleClass(me.settings.thumbnailClass);
            me.$context.toggleClass(me.settings.fullscreenClass);
        },
        fullscreenDisable: function () {
            var me = this;
            me.$img.addClass('imgthumb');
            me.$img.removeClass('imgfull');
            me.$context.addClass(me.settings.thumbnailClass);
            me.$context.removeClass(me.settings.fullscreenClass);
        },
        loadSlide        : function (id) {
            var me = this;

            if (!me.slides) return;
            me.log('start loading ' + id);

            var imageSrc = me.slides[id];
            me.tmpImage.one('load',function () {
                me.log('loaded ' + id);
                me.$img.attr('src', imageSrc);
            }).attr('src', imageSrc);
        },
        setActiveSlide   : function (number) {
            var me = this;

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
        },
        forward          : function () {
            var me = this;
            var newSlideNumber = Math.min(me.currentSlide + 1, me.slidesCount - 1);
            me.setActiveSlide(newSlideNumber);
        },
        back             : function () {
            var me = this;
            var newSlideNumber = Math.max(me.currentSlide - 1, 0);
            me.setActiveSlide(newSlideNumber);
        }
    };

    w.Presentator = Presentator;
    $.fn.presentator = function() {
        return this.each(function() { w.Presentator({context: this}); });
    };
    statics.init();
})(window, document, jQuery);