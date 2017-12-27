require('./config$');
require('./importScripts$');
function success() {
require('../..//app');
require('../..//pages/index/index');
}
self.bootstrapApp ? self.bootstrapApp({ success }) : success();
