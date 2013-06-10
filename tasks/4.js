var Presentator = (function (d, $) {

    return function (params) {
        var me = this;

        me.selector = params.selector;
        me.prevBtn = params.prevBtn || '.prev';
        me.nextBtn = params.nextBtn || '.next';
        me.currentSlide = 0;
        me.url = 'images.json';
        me.slidesCount = 10;
        me.width = 800;
        me.height = 600;

        me.slides = params.slides;

        me.init = function () {
            $(me.selector).attr('width', me.width);
            $(me.selector).attr('height', me.height);
            $(me.prevBtn).click(function () {
                me.back();
            });
            $(me.nextBtn).click(function () {
                me.forward();
            });
            $.getJSON(me.url).done(function (data) {
                me.slides = data.items;
                me.slidesCount = me.slides.length;
            });
        };

        me.loadSlide = function (id) {
            var imageSrc = me.slides[id];
            var image = $('<img>');
            image.on('load', function () {
                console.log('loaded image');
                $(me.selector).attr('src', imageSrc);
            });
            image.attr('src', imageSrc);
        };
        me.setActiveSlide = function (number) {
            me.currentSlide = number;
            me.loadSlide(me.currentSlide);
        };
        me.forward = function () {
            me.currentSlide = Math.min(me.currentSlide + 1, me.slidesCount - 1);
            me.setActiveSlide(me.currentSlide);
        };
        me.back = function () {
            me.currentSlide = Math.max(me.currentSlide - 1, 0);
            me.setActiveSlide(me.currentSlide);
        };

        me.init();
    }

})(document, jQuery);