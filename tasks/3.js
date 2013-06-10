var serialize = function(obj) {
    var str = [];
    for(var p in obj) if (obj.hasOwnProperty(p)) {
        str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
    }
    return str.join("&");
};

function addParamsToUrl(baseUrl, params, replaceExisting) {
    var baseUrlParams = parseUrl(baseUrl);
    var urlObject = createUrlObject(baseUrl);
    var domain = urlObject.protocol + '//' + urlObject.hostname;

    for (var i in params) if (params.hasOwnProperty(i)) {
        if (!baseUrlParams[i] || replaceExisting) {
            baseUrlParams[i] = params[i];
        }
    }

    return domain + '?' + serialize(baseUrlParams);
}
