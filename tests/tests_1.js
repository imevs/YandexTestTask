TestCase("MyTestCase", {
    "test Check result type": function () {
        var url = 'http://domain.com?param1=val1&param2=val2&param3=val3';
        var result = parseUrl(url);
        assertObject(result);
    },
    "test Get url parameters from full url": function () {
        var url = 'http://domain.com?param1=val1&param2=val2&param3=val3';
        var result = parseUrl(url);
        assertEquals(result, {
            param1: 'val1',
            param2: 'val2',
            param3: 'val3'
        });
    },
    "test parse query string": function() {
        var url = '?param1=val1&param2=val2&param3=val3';
        var result = parseUrl(url);
        assertEquals(result, {
            param1: 'val1',
            param2: 'val2',
            param3: 'val3'
        });
    },
    "test get array from query (PHP style)": function() {
        var url = '?param[]=val1&param[]=val2&param[]=val3';
        var result = parseUrl(url);
        assertEquals(result, {
            param: ['val1', 'val2', 'val3']
        });
    }

});