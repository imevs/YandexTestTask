TestCase("MyTestCase for Task3", {
    "test generate Url 1": function () {
        var url = 'http://domain.com';
        var result = addParamsToUrl(url, {
            param1: 'val1',
            param2: 'val2',
            param3: 'val3'
        });
        assertEquals(result, 'http://domain.com?param1=val1&param2=val2&param3=val3');
    },
    "test generate Url 2": function () {
        var url = 'http://domain.com?param0=val0';
        var result = addParamsToUrl(url, {
            param1: 'val1',
            param2: 'val2',
            param3: 'val3'
        });
        assertEquals(result, 'http://domain.com?param0=val0&param1=val1&param2=val2&param3=val3');
    },
    "test generate Url if some params existed - keep old": function () {
        var url = 'http://domain.com?param0=val0';
        var result = addParamsToUrl(url, {
            param0: 'val0_new',
            param1: 'val1',
            param2: 'val2',
            param3: 'val3'
        });
        assertEquals(result, 'http://domain.com?param0=val0&param1=val1&param2=val2&param3=val3');
    },
    "test generate Url if some params existed - override": function () {
        var url = 'http://domain.com?param0=val0';
        var result = addParamsToUrl(url, {
            param0: 'val0_new',
            param1: 'val1',
            param2: 'val2',
            param3: 'val3'
        }, true);
        assertEquals(result, 'http://domain.com?param0=val0_new&param1=val1&param2=val2&param3=val3');
    }

});