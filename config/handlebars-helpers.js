let moment = require("moment");

module.exports = {
formatDate: function(date) {
    return moment(date).format("M/D")
}
}