TestCase("MyTestCase", {
    testA: function () {
        var result = parseUrl('');
        assertObject(result);
    },
    testB: function () {
        var result = parseUrl('');
        assertEquals(result, {name: '1111' });
    },
    testC: function() {

    }

});