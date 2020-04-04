let express = require("express");
let cheerio = require("cheerio");
let axios = require("axios");
let moment = require("moment");
let router = express.Router();

let Stats = require("../models/Stats.js");

// let hbsObject = {}

router.get("/", function (req, res) {
  function renderIndex(hbsObject) {
    res.render("index", hbsObject);
  }

  Stats.find({}).sort('date')
    .lean()
    .then(function (dbStat) {
      axios
        .get(
          "https://www.sandiegocounty.gov/content/sdc/hhsa/programs/phs/community_epidemiology/dc/2019-nCoV/status.html#Table"
        )
        .then(function (response) {
          let $ = cheerio.load(response.data);

          let arrayOfPositives = [];
          let arrayOfDates = [];

          let dateFull = $("tbody > tr:nth-child(1) > td > p:nth-child(3)")
            .text()
            .split("d ", 2);
          let dateString = dateFull[1].split(",", 2).join();
          let date = moment(dateString, "MMM D, YYYY").format();
          let totalPositives = $(
            "tbody > tr:nth-child(3) > td:nth-child(2) > b"
          )
            .text()
            .split(",")
            .join("");
          let hospitalizations = $("tbody > tr:nth-child(19) > td:nth-child(2)")
            .html()
            .split(",")
            .join("");
          let intensiveCare = $("tbody > tr:nth-child(20) > td:nth-child(2)")
            .html()
            .split(",")
            .join("");
          let deaths = $("tbody > tr:nth-child(21) > td:nth-child(2)")
            .html()
            .split(",")
            .join("");

          // console.log("Latest Date: ", date);
          // console.log("Total Positives: ", totalPositives);
          // console.log("Hospitalizations: ", hospitalizations);
          // console.log("Intensive Care: ", intensiveCare);
          // console.log("Deaths: ", deaths);

          if (dbStat.length == 0) {
            console.log("length is 0");
            let data = {
              date: date,
              totalPositives: totalPositives,
              hospitalizations: hospitalizations,
              intensiveCare: intensiveCare,
              deaths: deaths,
              newCases: null,
            };

            Stats.create(data)
              .then(function (Stats) {
                console.log(Stats);
                dbStat.push(Stats);
                console.log("DbStat POST: ", dbStat);
                let hbsObject = {
                  stats: dbStat,
                };
                // console.log("HBS Object: ", hbsObject);

                res.render("index", hbsObject);
              })
              .catch(function (err) {
                console.log(err.message);
              });
          }

          let newDateScraped;

          dbStat.forEach((document) => {
            arrayOfPositives.push(document.totalPositives)
            arrayOfDates.push(moment(document.date).subtract(1, 'days').format("M/D"))
            //   console.log("docDate: ", document.date);
            //   console.log("cheerioDate: ", date);
            if (moment(date).isAfter(document.date)) {
              console.log("New date scraped!");
              newDateScraped = true;
            } else {
              console.log("No new date scraped!");
              newDateScraped = false;
            }
          });

          if (newDateScraped) {
            let data = {
              date: date,
              totalPositives: totalPositives,
              hospitalizations: hospitalizations,
              intensiveCare: intensiveCare,
              deaths: deaths,
            };

            Stats.create(data)
              .then(function (Stats) {
                dbStat.push(Stats);
                hbsObject = {
                  stats: dbStat,
                  totalPositives: arrayOfPositives,
                  dates: arrayOfDates
                };
                renderIndex(hbsObject)
              })
              .catch(function (err) {
                console.log(err.message);
              });
          } else {
            hbsObject = {
              stats: dbStat,
              totalPositives: arrayOfPositives,
              dates: arrayOfDates
            };
            renderIndex(hbsObject)
          }
        });
    });
});

module.exports = router;
