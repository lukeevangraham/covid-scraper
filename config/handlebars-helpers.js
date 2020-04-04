let moment = require("moment");

module.exports = {
formatDate: function(date) {
    return moment(date).subtract(1, 'days').format("M/D")
},
reverse: function(array) {
    array.reverse();
}
}