TestCase("MyTestCase for Task2", {
    "test compareFormParams - No changes": function () {
        var result = compareFormParams({
            param1: 'val1',
            param2: 'val2',
            param3: 'val3'
        }, {
            param1: 'val1',
            param2: 'val2',
            param3: 'val3'
        });
        assertEquals(result, {});
    },
    "test compareFormParams - Added params": function () {
        var result = compareFormParams({
            param1: 'val1',
            param2: 'val2'
        }, {
            param1: 'val1',
            param2: 'val2',
            param3: 'val3'
        });
        assertEquals(JSON.stringify(result), JSON.stringify({
            "param3":{"status":"added"}
        }));
    },
    "test compareFormParams - Remove params": function () {
        var result = compareFormParams({
            param1: 'val1',
            param2: 'val2',
            param3: 'val3'
        }, {
            param1: 'val1',
            param2: 'val2'
        });
        assertEquals(JSON.stringify(result), JSON.stringify({
            "param3":{"status":"removed", "oldValue": 'val3'}
        }));
    },
    "test compareFormParams - Changed params": function () {
        var result = compareFormParams({
            param1: 'val1',
            param2: 'val2',
            param3: 'val3'
        }, {
            param1: 'val1',
            param2: 'val2',
            param3: 'val3_changed'
        });
        assertEquals(JSON.stringify(result), JSON.stringify({
            "param3":{"status":"changed", "oldValue": 'val3', "newValue": "val3_changed"}
        }));
    }

});