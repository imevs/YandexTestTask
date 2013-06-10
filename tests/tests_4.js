TestCase("MyTestCase for Task4", {
    setUp: function() {
        this.server = sinon.fakeServer.create();
        this.server.respondWith('GET', 'images.json',
            [ 200, { "Content-Type": "application/json" },
                JSON.stringify({items: ['111.png', '222.png']})]
        );
    },
    tearDown: function() {
        this.server.restore();
    },
    "test Presentator - check count of images": function () {
        var present = new Presentator({});
        this.server.respond();
        assertEquals(present.slidesCount, 2);
    },
    "test Presentator - check Forward method": function () {
        var present = new Presentator({});

        this.server.respond();

        assertEquals(present.currentSlide, 0);
        present.forward();
        assertEquals(present.currentSlide, 1);
        present.forward();
        assertEquals(present.currentSlide, 1);
    },
    "test Presentator - check back method": function () {
        var present = new Presentator({});

        this.server.respond();

        assertEquals(present.currentSlide, 0);
        present.back();
        assertEquals(present.currentSlide, 0);
    },
    "test Presentator - check back/forward methods": function () {
        var present = new Presentator({});

        this.server.respond();

        assertEquals(present.currentSlide, 0);
        present.forward();
        assertEquals(present.currentSlide, 1);
        present.back();
        assertEquals(present.currentSlide, 0);
    }
});