export var variant = function () {
    var proxy = new Proxy({}, {
        get: function (_, prop) {
            return function (payload) { return ({
                type: prop,
                payload: payload,
            }); };
        }
    });
    return proxy;
};
export var match = function (value, matcher) {
    var type = value.type, payload = value.payload;
    return matcher[type](payload);
};
