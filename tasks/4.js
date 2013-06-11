var Presentator = (function (d, $) {

    return function (params) {
        if (!(this instanceof Presentator)) {
            return new Presentator(params);
        }
        var me = this;

        Presentator.instances = Presentator.instances || [];
        arguments.callee.instances.push(me);

        var log = params.logger || function(msg) {
            window.console.log(msg);
        };
        me.url = params.url || 'images.json';
        me.context = params.context + ' ' || '';
        me.$context = $(me.context);
        me.selector = params.selector;
        me.prevBtn = params.prevBtn || '.prev';
        me.nextBtn = params.nextBtn || '.next';
        me.$img = $(me.context + me.selector);
        me.$nextBtn = $(me.context + me.nextBtn);
        me.$prevBtn = $(me.context + me.prevBtn);
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

            $(window).keyup(function(event) {
                var activePresentation = Presentator.currentPresentation;
                if (!activePresentation) return;

                if (event.keyCode == 37 || event.keyCode == 38) {
                    activePresentation.back();
                }
                if (event.keyCode == 39 || event.keyCode == 40) {
                    activePresentation.forward();
                }
            })
        };

        me.fullscreenToggle = function() {
            Presentator.currentPresentation = me;
            for (var i = 0; i < Presentator.instances.length; i++) {
                if (Presentator.instances[i] !== Presentator.currentPresentation) {
                    Presentator.instances[i].fullscreenDisable();
                }
            }
            me.$context.toggleClass('span4');
            me.$context.toggleClass('span10');
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
            log('loaded tmpImage');
            var imageSrc = me.slides[id];
            tmpImage.one('load', function () {
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
    }

})(document, jQuery);