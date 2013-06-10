function serializeForm(form) {
    var res = $(form).serialize();

    return parseUrl('?' + res);
}

function compareFormParams(params1, params2) {
    var paramsStatus = {};

    for (var i in params1) if (params1.hasOwnProperty(i)) {
        if (typeof params2[i] != "undefined") {
            if (params1[i] === params2[i]) {
                delete params1[i];
                delete params2[i];
            } else {
                paramsStatus[i] = {
                    "status": "changed",
                    "oldValue": params1[i],
                    "newValue": params2[i]
                };
            }
        } else {
            paramsStatus[i] = {
                "status": "removed",
                "oldValue": params1[i]
            };
        }
    }

    for (var j in params2) if (params2.hasOwnProperty(j)) {
        if (typeof params1[j] == "undefined") {
            paramsStatus[j] = {
                "status": "added",
                "oldValue": params2[i]
            };
        }
    }

    return paramsStatus;
}

function compareForms(form1, form2) {
    var form1Params = serializeForm(form1);
    var form2Params = serializeForm(form2);
    return compareFormParams(form1Params, form2Params);
}