let express = require("express");

let router = express.Router();

let stat = require("../models/Stats.js");

router.get("/", function(req, res) {
    res.render("index");
})

module.exports = router;