let moment = require("moment");

module.exports = {
formatDate: function(date) {
    return moment(date).format("MMM D")
}
}