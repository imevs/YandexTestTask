var Presentator = (function (w, d, $) {

    var statics = {
        instances: [],
        currentPresentation: null,
        addToPool: function(obj) {
            statics.instances.push(obj);
        },
        initHotKeys: function() {
            var self = this;
            self.instances.length == 1 && $(d).keyup(function(event) {
                var activePresentation = self.currentPresentation;
                if (!activePresentation) return;

                if (event.keyCode == 37 || event.keyCode == 38) {
                    activePresentation.back();
                }
                if (event.keyCode == 39 || event.keyCode == 40) {
                    activePresentation.forward();
                }
            });
        },
        disableFullScreenForAll: function(current) {
            var self = this;
            self.currentPresentation = current;
            for (var i = 0; i < self.instances.length; i++) {
                if (self.instances[i] !== self.currentPresentation) {
                    self.instances[i].fullscreenDisable();
                }
            }
        },
        init: function() {
            $(function() {
                $('.presentator').each(function() {
                    Presentator({context: $(this)});
                });
            });
        }
    };

    var instance = function (params) {
        if (!(this instanceof Presentator)) {
            return new Presentator(params);
        }
        var me = this;

        me.statics = statics;

        statics.addToPool(me);

        var log = params.logger || function(msg) {
            w.console.log(msg);
        };
        me.$context = $(params.context);
        me.url = params.url || me.$context.data('url') || 'images.json';
        me.prevBtn = params.prevBtn || '.prev';
        me.nextBtn = params.nextBtn || '.next';
        me.$nextBtn = $(me.nextBtn, me.$context);
        me.$prevBtn = $(me.prevBtn, me.$context);
        me.$img = $('img', me.$context);
        me.currentSlide = -1;
        me.slidesCount = 0;
        me.width = 800;
        me.height = 600;

        me.slides = params.slides;

        var tmpImage = $('<img>');

        me.init = function () {
            me.$prevBtn.click(function () { me.back(); });
            me.$nextBtn.click(function () { me.forward(); });
            me.$img.css('width', '100%');
            me.$img.click(function() { me.fullscreenToggle(); });
            $.getJSON(me.url).done(function (data) {
                me.slides = data.items;
                me.slidesCount = me.slides.length;
                me.setActiveSlide(0);
            });
            statics.initHotKeys();
        };

        me.fullscreenToggle = function() {
            statics.disableFullScreenForAll(me);

            me.$context.toggleClass('span4');
            me.$context.toggleClass('span10');
            me.$img.css('width', '100%');
            me.$img.css('height') == '600px'
                ? me.$img.css('height', '200px')
                : me.$img.css('height', '600px');
        };
        me.fullscreenDisable = function() {
            me.$context.addClass('span4');
            me.$context.removeClass('span10');
            me.$img.css('height', '200px');
        };
        me.loadSlide = function (id) {
            var imageSrc = me.slides[id];
            tmpImage.one('load', function () {
                log('loaded ' + id);
                me.$img.attr('src', imageSrc);
            });
            tmpImage.attr('src', imageSrc);
        };
        me.setActiveSlide = function (number) {
            if (number == me.currentSlide) return;

            me.currentSlide = number;
            me.loadSlide(me.currentSlide);
            if (me.currentSlide == me.slidesCount - 1) {
                me.$nextBtn.addClass('disabled');
            } else if (me.currentSlide == 0) {
                me.$prevBtn.addClass('disabled');
            } else {
                me.$prevBtn.removeClass('disabled');
                me.$nextBtn.removeClass('disabled');
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