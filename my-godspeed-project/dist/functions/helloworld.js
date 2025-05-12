"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "default", {
    enumerable: true,
    get: function() {
        return _default;
    }
});
const _core = require("@godspeedsystems/core");
function _default(ctx, args) {
    const { inputs: { data: { query// query parameters from rest api
     } } } = ctx;
    return new _core.GSStatus(true, 200, undefined, 'Hello ' + query.name, undefined);
}

//# sourceMappingURL=helloworld.js.map