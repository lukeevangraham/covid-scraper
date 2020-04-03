let mongoose = require("mongoose");

let Schema = mongoose.Schema;

let StatSchema = new Schema({
    date: {
        type: Date,
        required: "Date is Required"
    },
    totalPositives: {
        type: Number
    },
    hospitalizations: {
        type: Number
    },
    intensiveCare: {
        type: Number
    },
    deaths: {
        type: Number
    }
})

let Stats = mongoose.model("Stats", StatSchema);

module.exports = Stats;