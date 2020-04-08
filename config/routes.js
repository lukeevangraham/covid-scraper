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

  Stats.find({})
    .sort("date")
    .lean()
    .then(function (dbStat) {
      axios
        .get(
          "https://www.sandiegocounty.gov/content/sdc/hhsa/programs/phs/community_epidemiology/dc/2019-nCoV/status.html#Table"
        )
        .then(function (response) {
          let $ = cheerio.load(response.data);

          let arrayOfPositives = [];
          let arrayOfNewPositives = [];
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
          let previousTotalPositives;

          dbStat.forEach((document) => {
            arrayOfPositives.push(document.totalPositives);
            arrayOfDates.push(
              moment(document.date).subtract(1, "days").format("M/D")
            );
            // console.log("LOOK HERE: ", previousTotalPositives)
            if (previousTotalPositives) {
              document.newPositives =
                document.totalPositives - previousTotalPositives;
              arrayOfNewPositives.push(
                document.totalPositives - previousTotalPositives
              );
            } else {
              document.newPositives = 0;
              arrayOfNewPositives.push(0);
            }
            // console.log("LOOK HERE: ", document)
            previousTotalPositives = document.totalPositives;
            //   console.log("docDate: ", document.date);
            //   console.log("cheerioDate: ", date);
            if (moment(date).isAfter(document.date)) {
              // console.log("New date scraped!");
              newDateScraped = true;
            } else {
              // console.log("No new date scraped!");
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
                // when a new date is added, the newPositive numbers are calculate for the new entry (new isn't stored in Db)
                tempNewPositives =
                  Stats.totalPositives -
                  dbStat[dbStat.length - 1].totalPositives;
                dbStat.push(Stats);
                dbStat[dbStat.length - 1]["newPositives"] = tempNewPositives;
                hbsObject = {
                  stats: dbStat,
                  totalPositives: arrayOfPositives,
                  newPositives: arrayOfNewPositives,
                  dates: arrayOfDates,
                };
                renderIndex(hbsObject);
              })
              .catch(function (err) {
                console.log(err.message);
              });
          } else {
            hbsObject = {
              stats: dbStat,
              totalPositives: arrayOfPositives,
              newPositives: arrayOfNewPositives,
              dates: arrayOfDates,
            };
            renderIndex(hbsObject);
          }
        });
    });
});

module.exports = router;
